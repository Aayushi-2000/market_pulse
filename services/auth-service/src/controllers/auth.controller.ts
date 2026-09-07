import type {
  Request,
  Response,
} from "express";

import { asyncHandler } from "../utils/async-handler.js";

import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../services/auth.service.js";
import { AppError } from "../utils/app-error.js";
import { refreshTokenCookieOptions } from "../config/cookie.js";

export const register = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    const user =
      await registerUser(req.body);

    res.status(201).json({
      success: true,

      message:
        "User registered successfully",

      data: {
        user,
      },
    });
  }
);


export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const result =
      await loginUser(req.body);

    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshTokenCookieOptions
    );

    res.status(200).json({
      success: true,
      message: "Login successful",

      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  }
);

export const refresh = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken =
      req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        "Refresh token is required",
        401
      );
    }

    const tokens =
      await refreshAccessToken(refreshToken);

    res.cookie(
      "refreshToken",
      tokens.refreshToken,
      refreshTokenCookieOptions
    );

    res.status(200).json({
      success: true,
      message:
        "Token refreshed successfully",

      data: {
        accessToken:
          tokens.accessToken,
      },
    });
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken =
      req.cookies.refreshToken;

    await logoutUser(refreshToken);

    res.clearCookie(
      "refreshToken",
      {
        ...refreshTokenCookieOptions,
        maxAge: undefined,
      }
    );

    res.status(200).json({
      success: true,
      message:
        "Logged out successfully",
    });
  }
);