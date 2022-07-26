import { ObjectId } from "mongodb";
import { Service } from "typedi";

import { User, UserMongooseModel } from "../../entities";
import { encryptPassword } from "../../helpers/auth.helpers";
import { RegisterUserInput } from "./input";

@Service()
export default class UserModel {
  async getById(_id: ObjectId): Promise<User | null> {
    return UserMongooseModel.findById(_id).lean().exec();
  }

  async getByEmail(email: string): Promise<User | null> {
    return UserMongooseModel.findOne({ email }).lean().exec();
  }

  async register(data: RegisterUserInput): Promise<User> {
    const { password, ...rest } = data;
    const hashedPassword = await encryptPassword(password);
    const user = new UserMongooseModel({ ...rest, password: hashedPassword });

    return user.save();
  }
}
