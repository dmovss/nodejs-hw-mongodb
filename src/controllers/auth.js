import * as authService from "../services/auth.js";

export const register = async (req, res, next) => {
  try {
    const data = await authService.registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await authService.loginUser(req.body);
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.json({
      status: 200,
      message: "Successfully logged in an user!",
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await authService.refreshSession(
      req.cookies.refreshToken
    );
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user.id);
    res.clearCookie("refreshToken");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
