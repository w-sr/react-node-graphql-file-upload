import { ObjectId } from "mongodb";
import { Service } from "typedi";

import { User } from "../../entities";
import { comparePassword, getToken } from "../../helpers/auth.helpers";
import { LoginInput, RegisterUserInput, UserPayload } from "./input";
import UserModel from "./model";

@Service()
export default class UserService {
  constructor(private readonly userModel: UserModel) {}

  public async login(data: LoginInput): Promise<UserPayload | null> {
    const user = await this.userModel.getByEmail(data.email);
    if (!user) throw new Error("User not found!");

    const isMatch = await comparePassword(data.password, user?.password);
    if (!isMatch) throw new Error("Password was not matched!");

    const input = { _id: user._id };
    const token = getToken(input);

    return { user, token };
  }

  public async register(data: RegisterUserInput): Promise<UserPayload> {
    const user = await this.userModel.getByEmail(data.email);
    if (user) throw new Error("User already existed!");

    const newUser = await this.userModel.register(data);
    const input = { _id: newUser._id };
    const token = getToken(input);

    return { user: newUser, token };
  }

  public async getById(_id: ObjectId): Promise<User | null> {
    return this.userModel.getById(_id);
  }
}
