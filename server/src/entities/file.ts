import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { Length } from "class-validator";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";
import { Tag } from "./tag";

export enum FileContentType {
  PRIVATE = "private",
  PUBLIC = "public",
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "files",
  },
})
@ObjectType()
export class File {
  @Field()
  readonly _id!: ObjectId;

  @Field(() => String)
  @Length(1, 50)
  @prop({ type: () => String, required: true })
  name: string;

  @Field(() => [Tag])
  @prop({ ref: () => Tag })
  tags: Ref<Tag>[];

  @Field(() => String)
  @Length(1, 50)
  @prop({ type: () => String, required: true })
  url: string;

  @Field(() => String, { nullable: true })
  @prop({ type: () => String })
  publicUrl: string;

  @Field(() => Boolean)
  @prop({ type: () => Boolean, required: true, default: false })
  public: boolean;

  @Field(() => ObjectId)
  @prop({ type: () => ObjectId, required: true })
  user: ObjectId;

  @Field()
  @prop({ type: () => Boolean, default: false })
  isDeleted: boolean;
}

export const FileMongooseModel = getModelForClass(File);
