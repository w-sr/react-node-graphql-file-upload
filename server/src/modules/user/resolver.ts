import { ObjectId } from "mongodb";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";

import { User } from "../../entities";
import { RegisterUserInput, LoginInput, UserPayload } from "./input";
import UserService from "./service";

@Service()
@Resolver()
export default class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @Authorized()
  async me(@Ctx("user") user: User): Promise<User | null> {
    const existingUser = await this.userService.getById(user._id);

    return existingUser;
  }

  @Mutation(() => UserPayload)
  async login(
    @Arg("loginUserData") loginUserData: LoginInput
  ): Promise<UserPayload | null> {
    const user = await this.userService.login(loginUserData);

    return user;
  }

  @Mutation(() => UserPayload)
  async register(
    @Arg("registerUserData") registerUserData: RegisterUserInput
  ): Promise<UserPayload | null> {
    const user = await this.userService.register(registerUserData);
    return user;
  }
}
