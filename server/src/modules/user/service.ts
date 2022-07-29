import { ObjectId } from "mongodb";
import { Service } from "typedi";

import { User } from "../../entities";
import { comparePassword, getToken } from "../../helpers/auth.helpers";
import { LoginInput, RegisterInput, UserPayload } from "./input";
import UserModel from "./model";

@Service()
export default class UserService {
  constructor(private readonly userModel: UserModel) {}

  public async login(input: LoginInput): Promise<UserPayload | null> {
    const user = await this.userModel.getByEmail(input.email);
    if (!user) throw new Error("User not found!");

    const isMatch = await comparePassword(input.password, user?.password);
    if (!isMatch) throw new Error("Password was not matched!");

    const data = { _id: user._id };
    const token = getToken(data);

    return { user, token };
  }

  public async register(input: RegisterInput): Promise<UserPayload> {
    const user = await this.userModel.getByEmail(input.email);
    if (user) throw new Error("User already existed!");

    const newUser = await this.userModel.register(input);
    const data = { _id: newUser._id };
    const token = getToken(data);

    return { user: newUser, token };
  }

  public async getById(_id: ObjectId): Promise<User | null> {
    return this.userModel.getById(_id);
  }
}
