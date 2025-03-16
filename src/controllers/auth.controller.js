const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');
const checkRequiredFields = require('../utils/requiredFieldsChecker');
const { ResponseHandler } = require('../utils/responseHandler');
const validateEmail = require('../utils/emailValidator');
const {
  sendEmail,
  sendOtpEmail,
  verificationEmail,
} = require('../utils/sendEmail');
const {
  generateToken,
  validateToken,
  generateOTP,
  deleteOTP,
} = require('../utils/generateToken');
const {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} = require('../middlewares/errorhandler.middleware');

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    const requiredFields = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone number',
      password: 'Password',
    };
    await checkRequiredFields(req.body, requiredFields);

    const isEmailValid = await validateEmail(email);

    if (!isEmailValid) {
      throw new BadRequestError('Invalid email');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    if (!user) {
      throw new InternalServerError('User registration failed');
    }

    const verficationEmailResponse = await verificationEmail(
      user,
      await generateOTP(user.id)
    );
    if (!verficationEmailResponse) {
      throw new InternalServerError('Email not sent');
    }

    ResponseHandler.success(res, user, 201, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const requiredFields = {
      email: 'Email',
      password: 'Password',
    };
    await checkRequiredFields(req.body, requiredFields);
    const isEmailValid = await validateEmail(email);
    if (!isEmailValid) {
      throw new BadRequestError('Invalid email');
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        profile: true,
        isVerified: true,
        isArchived: true,
        settings: true,
      },
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    delete user.password;

    if (user.settings?.twoFactorAuth) {
      const emailResponse = await sendOtpEmail(
        user,
        await generateOTP(user.id),
        'login'
      );
      if (!emailResponse) {
        throw new InternalServerError('Error sending otp');
      }
      ResponseHandler.success(res, user, 200, 'OTP sent successfully');
    }

    ResponseHandler.success(res, user, 200, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const verifyAccount = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isVerified = await verifyOtp(otp, userId);
    if (!isVerified) {
      throw new InternalServerError('Error verifying account');
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });
    if (!updatedUser) {
      throw new InternalServerError('Account verification failed');
    }
    ResponseHandler.success(res, null, 200, 'Account verified successfully');
  } catch (error) {
    next(error);
  }
};

const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { type } = req.query;

    if (!email) {
      throw new BadRequestError('User id is required');
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const secret = await generateOTP(user.id);
    if (!secret) {
      throw new InternalServerError('Error generating otp');
    }
    const emailResponse = await sendOtpEmail(user, secret, type);
    if (!emailResponse) {
      throw new InternalServerError('Error sending otp');
    }
    ResponseHandler.success(res, null, 200, 'OTP sent successfully');
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (otp, userId) => {
  try {
    const savedOtp = await prisma.otp.findFirst({
      where: {
        userId: userId,
      },
    });
    if (!savedOtp) {
      throw new NotFoundError('OTP not found please request for a new one');
    }
    if (savedOtp.secret !== otp) {
      throw new BadRequestError('Invalid OTP');
    }
    const isExpired =
      new Date(savedOtp.updatedAt) < new Date(Date.now() - 10 * 60 * 1000);
    if (isExpired) {
      throw new BadRequestError('OTP expired please request for a new one');
    }

    const isDeleted = await deleteOTP(userId);

    if (!isDeleted) {
      throw new InternalServerError('Error deleting otp');
    }
    return true;
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError('Email is required');
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const secret = await generateOTP(user.id);
    if (!secret) {
      throw new InternalServerError('Error generating token');
    }
    const emailResponse = await sendOtpEmail(user, secret, 'password');
    if (!emailResponse) {
      throw new InternalServerError('Error sending email');
    }
    ResponseHandler.success(res, null, 200, 'Reset password OTP sent');
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    if (!otp || !password || !email) {
      throw new BadRequestError('OTP, email and password are required');
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const isOtpValid = await verifyOtp(otp, user.id);
    if (!isOtpValid) {
      throw new BadRequestError('Invalid OTP');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });
    if (!updatedUser) {
      throw new InternalServerError('Error updating password');
    }
    ResponseHandler.success(
      res,
      updatedUser,
      200,
      'Password updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verifyAccount,
  sendOtp,
  verifyOtp,
  resetPassword,
  updatePassword,
};
