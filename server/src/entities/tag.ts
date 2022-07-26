import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Length } from "class-validator";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "tags",
  },
})
@ObjectType()
export class Tag {
  @Field()
  readonly _id!: ObjectId;

  @Field(() => String)
  @prop({ type: () => String, required: true })
  @Length(1, 50)
  name: string;
}

export const TagMongooseModel = getModelForClass(Tag);
