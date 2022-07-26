import { Length } from "class-validator";
import { ObjectId } from "mongodb";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTagInput {
  @Field(() => String)
  name: string;
}

@InputType()
export class UpdateTagInput {
  @Field(() => String)
  @Length(1, 50)
  _id: ObjectId;

  @Field(() => String)
  name: string;
}
