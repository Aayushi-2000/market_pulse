import bcrypt from "bcryptjs";

import {
  createUser,
  findUserByEmail,findUserByEmailWithPassword
} from "../repositories/user.repository.js";

import { AppError } from "../utils/app-error.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { createRefreshSession, findRefreshSession, revokeRefreshSession } from "../repositories/refresh-session.repository.js";
import { hashToken } from "../utils/token-hash.js";
import { getRefreshTokenExpiry } from "../utils/token-expiry.js";
import { User } from "../models/user.model.js";
export const registerUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {

  const existingUser =
    await findUserByEmail(email);

  if (existingUser) {
    throw new AppError(
      "User with this email already exists",
      409
    );
  }

  const saltRounds = 12;

  const hashedPassword =
    await bcrypt.hash(
      password,
      saltRounds
    );

  const user = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,

    name: user.name,

    email: user.email,

    role: user.role,

    isActive: user.isActive,

    createdAt: user.createdAt,
  };
};

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await findUserByEmailWithPassword(email);

  if (!user || !user.isActive) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    role: user.role,
    type: "access",
  });

  const refreshToken = signRefreshToken({
    sub: user._id.toString(),
    type: "refresh",
  });

  await createRefreshSession({
    userId: user._id.toString(),
    tokenHash: hashToken(refreshToken),
    expiresAt: getRefreshTokenExpiry(),
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },

    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (
  refreshToken: string
) => {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(
      "Invalid or expired refresh token",
      401
    );
  }

  if (payload.type !== "refresh") {
    throw new AppError(
      "Invalid refresh token",
      401
    );
  }

  const tokenHash = hashToken(refreshToken);

  const session = await findRefreshSession(
    tokenHash
  );

  if (!session) {
    throw new AppError(
      "Refresh token has been revoked or is invalid",
      401
    );
  }

  await revokeRefreshSession(
    session._id.toString()
  );

  const user = await User.findById(payload.sub);

  if (!user || !user.isActive) {
    throw new AppError(
      "User account is inactive",
      401
    );
  }

  const newAccessToken = signAccessToken({
    sub: user._id.toString(),
    role: user.role,
    type: "access",
  });

  const newRefreshToken = signRefreshToken({
    sub: user._id.toString(),
    type: "refresh",
  });

  await createRefreshSession({
    userId: user._id.toString(),
    tokenHash: hashToken(newRefreshToken),
    expiresAt: getRefreshTokenExpiry(),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (
  refreshToken?: string
) => {
  if (!refreshToken) {
    return;
  }

  const tokenHash =
    hashToken(refreshToken);

  const session =
    await findRefreshSession(tokenHash);

  if (session) {
    await revokeRefreshSession(
      session._id.toString()
    );
  }
};