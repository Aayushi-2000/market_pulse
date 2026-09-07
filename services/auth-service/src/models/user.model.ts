import mongoose, { Schema } from "mongoose";

import {
    UserRole,
  type IUser,
} from "../types/user.types.js";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,

      required: true,

      trim: true,

      minlength: 2,

      maxlength: 50,
    },

    email: {
      type: String,

      required: true,

      unique: true,

      lowercase: true,

      trim: true,

      index: true,
    },

    password: {
      type: String,

      required: true,

      select: false,
    },

    role: {
      type: String,

      enum: Object.values(UserRole),

      default: UserRole.CUSTOMER,
    },

    isActive: {
      type: Boolean,

      default: true,

      index: true,
    },
  },

  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>(
  "User",
  userSchema
);