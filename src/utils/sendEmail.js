const nodemailer = require("nodemailer");
const { veificationtemplate } = require("./mailtemp/verification");
const { passwordtemplate } = require("./mailtemp/password");
const { logintemplate } = require("./mailtemp/login");
require("dotenv").config();
const {
  BadRequestError,
  InternalServerError,
} = require("../middlewares/errorhandler.middleware");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const sendEmail = async (email, subject, html) => {
  try {
    let info = await transporter.sendMail({
      from: `"Tost" <${process.env.EMAIL}>`,
      to: email,
      subject: subject,
      html: html,
    });
    return info;
  } catch (error) {
    console.log(error);
    throw new InternalServerError("Email not sent");
  }
};

const verificationEmail = async (user, otp) => {
  const subject = "Verify Yout Tost Account";
  const html = veificationtemplate
    .replace("{{otp}}", otp)
    .replace("{{username}}", user.firstName);
  return sendEmail(user.email, subject, html);
};

const sendOtpEmail = async (user, otp, type) => {
  let html;
  if (type === "password")
    html = passwordtemplate
      .replace("{{otp}}", otp)
      .replace("{{username}}", user.firstName);
  else if (type === "verification")
    html = veificationtemplate
      .replace("{{otp}}", otp)
      .replace("{{username}}", user.firstName);
  else if (type === "login")
    html = logintemplate
      .replace("{{otp}}", otp)
      .replace("{{username}}", user.firstName);
  else throw new BadRequestError("Check type of OTP requested");
  const subject =
    type === "password"
      ? "Tost Password Reset OTP"
      : type === "verification"
      ? "Tost Account Verification OTP"
      : type === "login"
      ? "Tost Login OTP"
      : "Tost OTP";
  return sendEmail(user.email, subject, html);
};

module.exports = { sendEmail, verificationEmail, sendOtpEmail };
