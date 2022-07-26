import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { IsEmail, Length, MinLength } from "class-validator";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
@ObjectType()
export class User {
  @Field()
  readonly _id!: ObjectId;

  @Field(() => String)
  @prop({ type: () => String, required: true })
  @Length(1, 50)
  name: string;

  @Field(() => String)
  @IsEmail()
  @prop({ type: () => String, required: true, unique: true })
  email: string;

  @Field(() => String)
  @MinLength(8)
  @prop({ type: () => String, required: true })
  password: string;
}

export const UserMongooseModel = getModelForClass(User);
