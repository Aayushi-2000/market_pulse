import mongoose, { Schema, Types } from "mongoose";

export interface IRefreshSession {
  userId: Types.ObjectId;
  tokenHash: string;
  familyId:String;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const refreshSessionSchema = new Schema<IRefreshSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    familyId: {
  type: String,
  required: true,
  index: true,
},
    tokenHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

refreshSessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const RefreshSession =
  mongoose.model<IRefreshSession>(
    "RefreshSession",
    refreshSessionSchema
  );