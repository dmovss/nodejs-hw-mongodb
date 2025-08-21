import {
  registerUser,
  loginUser,
  refreshSession,
  logoutSession,
} from '../services/auth.js';

const isProd = process.env.NODE_ENV === 'production';

const cookieOpts = (expires) => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  expires,
  path: '/',
});

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { session, tokens } = await loginUser(req.body);

    res
      .cookie('refreshToken', tokens.refreshToken, cookieOpts(tokens.refreshTokenValidUntil))
      .cookie('sid', String(session._id), cookieOpts(tokens.refreshTokenValidUntil))
      .status(200)
      .json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: { accessToken: tokens.accessToken },
      });
  } catch (e) {
    next(e);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken, sid } = req.cookies;
    const { newSession, tokens } = await refreshSession({
      refreshToken,
      sessionId: sid,
    });

    res
      .cookie('refreshToken', tokens.refreshToken, cookieOpts(tokens.refreshTokenValidUntil))
      .cookie('sid', String(newSession._id), cookieOpts(tokens.refreshTokenValidUntil))
      .status(200)
      .json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: { accessToken: tokens.accessToken },
      });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken, sid } = req.cookies;
    await logoutSession({ refreshToken, sessionId: sid });

    res
      .clearCookie('refreshToken', { path: '/' })
      .clearCookie('sid', { path: '/' })
      .status(204)
      .send();
  } catch (e) {
    next(e);
  }
};
