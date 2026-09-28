import { RefreshSession } from "../models/refresh-session.model.js";

export const createRefreshSession = async (data: {
  userId: string;
  tokenHash: string;
  familyId: string;
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
export const revokeRefreshTokenFamily =
  async (familyId: string) => {
    return RefreshSession.updateMany(
      {
        familyId,
        revokedAt: null,
      },
      {
        revokedAt: new Date(),
      }
    );
  };
  export const findRefreshSessionIncludingRevoked =
  async (tokenHash: string) => {
    return RefreshSession.findOne({
      tokenHash,
    });
  };