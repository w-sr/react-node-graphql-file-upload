import { Length } from "class-validator";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { File } from "../../entities";
import { FileUpload, GraphQLUpload } from "graphql-upload";

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
  @Field(() => String, { nullable: true })
  @Length(1, 50)
  name?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => String, { nullable: true })
  publicUrl?: string;
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
export class FileContent {
  @Field(() => File)
  file: File;

  @Field(() => String)
  content: Buffer;
}

@ObjectType()
export class FilesPayload {
  @Field(() => [File])
  files: File[];

  @Field(() => Int)
  total: number;
}

// @ObjectType()
// export class FilesPayload {
//   @Field(() => [File])
//   files: FileContent[];

//   @Field(() => Int)
//   total: number;
// }

@ObjectType()
export class CreateFilesPayload {
  @Field(() => Int)
  total: number;
}

@ObjectType()
export class ProgressStatus {
  @Field(() => Int)
  progress: number;
}
