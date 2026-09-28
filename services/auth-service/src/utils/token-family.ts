import crypto from "crypto";

export const generateTokenFamilyId = () => {
  return crypto.randomUUID();
};