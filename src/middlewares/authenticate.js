import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { User } from "../models/user.js";

const ACCESS_SECRET = process.env.ACCESS_SECRET;

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      throw createHttpError(401, "Not authorized");
    }

    const payload = jwt.verify(token, ACCESS_SECRET);
    const user = await User.findById(payload.id);

    if (!user) throw createHttpError(401, "Not authorized");

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(createHttpError(401, "Access token expired"));
    }
    next(err);
  }
};
