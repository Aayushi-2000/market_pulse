export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

export interface IUser {
  _id: string;

  name: string;

  email: string;

  password: string;

  role: UserRole;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}
export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}