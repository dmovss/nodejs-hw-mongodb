import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw createHttpError(409, "Email in use");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  return { id: user._id, name: user.name, email: user.email };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, "Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw createHttpError(401, "Invalid credentials");

  await Session.deleteOne({ userId: user._id });

  const accessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
    expiresIn: "30d",
  });

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

export const refreshSession = async (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const userId = payload.id;

    await Session.deleteOne({ userId });

    const accessToken = jwt.sign({ id: userId }, ACCESS_SECRET, {
      expiresIn: "15m",
    });
    const newRefreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, {
      expiresIn: "30d",
    });

    await Session.create({
      userId,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken: newRefreshToken };
  } catch {
    throw createHttpError(401, "Invalid refresh token");
  }
};

export const logoutUser = async (userId) => {
  await Session.deleteOne({ userId });
};
