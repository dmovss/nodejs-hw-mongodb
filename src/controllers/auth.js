const User = require('../models/user');
const Session = require('../models/session');
const { createHttpError } = require('../helpers');
const { authSchema, emailSchema } = require('../schemas/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const sendResetEmail = async (req, res, next) => {
  try {
    const { error } = emailSchema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.message);
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Reset',
      html: `Click <a href="${resetLink}">here</a> to reset your password.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    if (error.code === 'ESOCKET' || error.code === 'ECONNECTION') {
      next(createHttpError(500, 'Failed to send the email, please try again later.'));
    } else {
      next(error);
    }
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      throw createHttpError(400, 'Token and password are required');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ email: decoded.email });

      if (!user) {
        throw createHttpError(404, 'User not found!');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();

      await Session.deleteMany({ userId: user._id });

      res.json({
        status: 200,
        message: 'Password has been successfully reset.',
        data: {},
      });
    } catch (jwtError) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendResetEmail,
  resetPassword,
};
