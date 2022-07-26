import * as jwt from "jsonwebtoken";
import { AuthChecker } from "type-graphql";
import { config } from "../config";
import { Context } from "../context";
import { User, UserMongooseModel } from "../entities";

// auth checker function
export const authChecker: AuthChecker<Context> = ({ context: { user } }) => {
  if (!user) return false;
  return true;
};

export const getUser = async (token: string): Promise<User | null> => {
  try {
    const payload = <{ _id: string }>jwt.verify(token, config.salt);
    const user = await UserMongooseModel.findById(payload._id).lean().exec();
    return user;
  } catch (error) {
    return null;
  }
};
