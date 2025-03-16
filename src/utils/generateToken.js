const jwt = require("jsonwebtoken");
const prisma = require("./prisma");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const validateToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const generateOTP = async (userId) => {
  const secret = Math.floor(1000 + Math.random() * 9000);
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const savedOtp = await prisma.otp.upsert({
    where: {
      userId,
    },
    update: {
      secret,
    },
    create: {
      secret,
      userId,
    },
  });
  if (!savedOtp) {
    throw new Error("Error saving otp");
  }
  return secret;
};

const deleteOTP = async (userId) => {
  const deletedOtp = await prisma.otp.delete({
    where: {
      userId: userId,
    },
  });
  if (!deletedOtp) {
    throw new Error("Error deleting otp");
  }
  return true;
};

module.exports = {
  generateToken,
  validateToken,
  generateOTP,
  deleteOTP,
};
