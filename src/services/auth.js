import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/user.js';
import Session from '../models/session.js';

const ACCESS_TTL = '15m';
const REFRESH_TTL = '30d';

function calcValidUntil(ttl) {
  const now = new Date();
  return new Date(now.getTime() + {
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  }[ttl.slice(-1)] * parseInt(ttl));
}

function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TTL });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TTL });
  const accessTokenValidUntil = calcValidUntil(ACCESS_TTL);
  const refreshTokenValidUntil = calcValidUntil(REFRESH_TTL);
  return { accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil };
}

export async function registerUser({ name, email, password }) {
  const exists = await User.findOne({ email });
  if (exists) throw createHttpError(409, 'Email in use');

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  const { password: _, ...safe } = user.toObject();
  return safe;
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password is wrong');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw createHttpError(401, 'Email or password is wrong');

  // remove previous session(s)
  await Session.deleteMany({ userId: user._id });

  const tokens = generateTokens(user._id);
  const session = await Session.create({
    userId: user._id,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenValidUntil: tokens.accessTokenValidUntil,
    refreshTokenValidUntil: tokens.refreshTokenValidUntil,
  });

  return { user, session, tokens };
}

export async function refreshSession({ refreshToken, sessionId }) {
  if (!refreshToken) throw createHttpError(401, 'No refresh token');
  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) throw createHttpError(401, 'Not authorized');

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw createHttpError(401, 'Not authorized');
  }

  // remove old session
  await Session.deleteOne({ _id: session._id });

  const tokens = generateTokens(payload.userId);
  const newSession = await Session.create({
    userId: payload.userId,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenValidUntil: tokens.accessTokenValidUntil,
    refreshTokenValidUntil: tokens.refreshTokenValidUntil,
  });

  return { newSession, tokens };
}

export async function logoutSession({ refreshToken, sessionId }) {
  if (!refreshToken || !sessionId) return;
  await Session.deleteOne({ _id: sessionId, refreshToken });
}
