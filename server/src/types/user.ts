import { ObjectId } from "mongodb";

export type UserDocument = {
  _id: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  verified: boolean;
  verificationToken: string | null;
  createdAt: number;
  updatedAt: number;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  verified: boolean;
};
