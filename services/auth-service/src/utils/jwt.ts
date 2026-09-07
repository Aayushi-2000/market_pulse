
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { UserRole } from "../types/user.types.js";

interface AccessTokenPayload {
  sub: string;
  role: UserRole;
  type: "access";
}

interface RefreshTokenPayload {
  sub: string;
  type: "refresh";
}

export const signAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const signRefreshToken = (payload: RefreshTokenPayload) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  });
};
export const verifyAccessToken = (
  token: string
) => {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET
  ) as AccessTokenPayload & {
    iat: number;
    exp: number;
  };
};

export const verifyRefreshToken = (
  token: string
) => {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  ) as RefreshTokenPayload & {
    iat: number;
    exp: number;
  };
};
