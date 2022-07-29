import { IsEmail, Length, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "../../entities";

@InputType()
export class LoginInput {
  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  password: string;
}

@InputType()
export class RegisterInput {
  @Field(() => String)
  @Length(1, 50)
  name: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @MinLength(8)
  password: string;
}

@ObjectType()
export class UserPayload {
  @Field(() => User)
  user: User;

  @Field(() => String)
  token: string;
}
