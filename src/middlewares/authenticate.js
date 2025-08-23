import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import Session from '../models/session.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw createHttpError(401, 'Authorization header missing');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw createHttpError(401, 'Invalid authorization format');
    }

    const session = await Session.findOne({ accessToken: token })
      .populate('userId')
      .exec();

    if (!session || session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Access token expired');
    }

    req.user = session.userId;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
