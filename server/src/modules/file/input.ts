import { Length } from "class-validator";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { File } from "../../entities";

// @InputType()
// export class CreateFileInput {
//   @Field(() => String)
//   file: File;
// }

// @InputType()
// export class CreateFileInput {
//   @Field(() => String)
//   file: FileUpload;
// }

@InputType()
export class UpdateFileInput {
  @Field(() => String)
  @Length(1, 50)
  name: string;

  @Field(() => [String])
  tags: string[];
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
export class CreateFilesPayload {
  @Field(() => Int)
  total: number;
}
