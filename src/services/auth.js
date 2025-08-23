import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';
import createHttpError from 'http-errors';

export const register = async (userData) => {
  const { email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...userData, password: hashedPassword });

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  };
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  // Delete existing sessions
  await Session.deleteMany({ userId: user._id });

  // Generate tokens
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  // Create session
  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
    sessionId: session._id,
  };
};

export const refreshSession = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not provided');
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find session
    const session = await Session.findOne({
      refreshToken,
      refreshTokenValidUntil: { $gt: new Date() },
    }).populate('userId');

    if (!session) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    // Delete old session
    await Session.findByIdAndDelete(session._id);

    // Generate new tokens
    const newAccessToken = jwt.sign(
      { userId: session.userId._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
      { userId: session.userId._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    // Create new session
    const newSession = await Session.create({
      userId: session.userId._id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      user: {
        id: session.userId._id,
        name: session.userId.name,
        email: session.userId.email,
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      sessionId: newSession._id,
    };
  } catch (error) {
    throw createHttpError(401, 'Invalid refresh token');
  }
};

export const logout = async (sessionId) => {
  await Session.findByIdAndDelete(sessionId);
};
