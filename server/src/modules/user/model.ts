import { ObjectId } from "mongodb";
import { Service } from "typedi";

import { User, UserMongooseModel } from "../../entities";
import { encryptPassword } from "../../helpers/auth.helpers";
import { RegisterInput } from "./input";

@Service()
export default class UserModel {
  async getById(_id: ObjectId): Promise<User | null> {
    if (!_id) throw new Error("ID was not provided");
    const user = await UserMongooseModel.findById(_id).lean().exec();
    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    if (!email) throw new Error("Email was not provided");
    const user = await UserMongooseModel.findOne({ email }).lean().exec();
    return user;
  }

  async register(data: RegisterInput): Promise<User> {
    if (!data) throw new Error("Register data was not provided");
    const { password, ...rest } = data;
    const hashedPassword = await encryptPassword(password);
    const user = new UserMongooseModel({ ...rest, password: hashedPassword });

    return user.save();
  }
}
