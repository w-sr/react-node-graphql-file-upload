import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";

import { User } from "../../entities";
import { LoginInput, RegisterInput, UserPayload } from "./input";
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
  async login(@Arg("input") input: LoginInput): Promise<UserPayload | null> {
    const user = await this.userService.login(input);

    return user;
  }

  @Mutation(() => UserPayload)
  async register(
    @Arg("input") input: RegisterInput
  ): Promise<UserPayload | null> {
    const user = await this.userService.register(input);
    return user;
  }
}
