import { User } from "../models/user.model.js";

export const findUserByEmail = async (
  email: string
) => {
  return User.findOne({
    email,
  });
};
export const findUserById = async (userId: string) => {
  return User.findById(userId);
};

export const createUser = async (
  data: {
    name: string;
    email: string;
    password: string;
  }
) => {
  return User.create({
    name: data.name,

    email: data.email,

    password: data.password,
  });
};

export const findUserByEmailWithPassword = async (email: string) => {
  return User.findOne({ email }).select("+password");
};