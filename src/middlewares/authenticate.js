import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import Session from '../models/Session.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      return next(createHttpError(401, 'Authorization header is missing'));
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return next(createHttpError(401, 'Invalid authorization header format'));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(createHttpError(401, 'Access token expired'));
      }
      return next(createHttpError(401, 'Invalid access token'));
    }

    const session = await Session.findOne({
      accessToken: token,
      accessTokenValidUntil: { $gt: new Date() },
    }).populate('userId');

    if (!session) {
      return next(createHttpError(401, 'Invalid session'));
    }

    req.user = {
      _id: session.userId._id,
      name: session.userId.name,
      email: session.userId.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
