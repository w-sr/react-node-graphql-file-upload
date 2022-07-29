import { Length } from "class-validator";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { File } from "../../entities";

@InputType()
export class UpdateFileInput {
  @Field(() => String, { nullable: true })
  @Length(1, 50)
  name?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => String, { nullable: true })
  publicUrl?: string;

  @Field(() => Boolean)
  publicly: boolean;
}

@InputType()
export class FilterFileInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;
}

@ObjectType()
export class FilesPayload {
  @Field(() => [File])
  files: File[];

  @Field(() => Int)
  total: number;
}

@ObjectType()
export class UploadFilePayload {
  @Field(() => Int)
  total: number;
}

@ObjectType()
export class FileContentPayload {
  @Field(() => String)
  content: string;
}
