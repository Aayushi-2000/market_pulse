import { RefreshSession } from "../models/refresh-session.model.js";

export const createRefreshSession = async (data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) => {
  return RefreshSession.create(data);
};

export const findRefreshSession = async (
  tokenHash: string
) => {
  return RefreshSession.findOne({
    tokenHash,
    revokedAt: null,
  });
};

export const revokeRefreshSession = async (
  sessionId: string
) => {
  return RefreshSession.findByIdAndUpdate(
    sessionId,
    {
      revokedAt: new Date(),
    },
    { new: true }
  );
};