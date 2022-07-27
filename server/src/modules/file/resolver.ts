import { FileUpload, GraphQLUpload } from "graphql-upload";
import { ObjectId } from "mongodb";
import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Publisher,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { Service } from "typedi";

import { File, User } from "../../entities";
import {
  CreateFilesPayload,
  FileContent,
  FilesPayload,
  FilterFileInput,
  ProgressStatus,
  UpdateFileInput,
} from "./input";
import FileService from "./service";

// export type ProgressStatus = {
//   progress: number;
// };

export interface PubSubSessionPayload<T> {
  sessionId: string;
  data: T | null;
}

@Service()
@Resolver()
export default class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Query(() => File)
  @Authorized()
  async getFile(@Arg("_id") _id: ObjectId): Promise<File | null> {
    const file = await this.fileService.getById(_id);
    return file;
  }

  @Query(() => FilesPayload)
  @Authorized()
  async getFiles(
    @Arg("filters") filters: FilterFileInput,
    @Ctx("user") user: User
  ): Promise<FilesPayload> {
    const payload = await this.fileService.getAll(filters, user._id);
    return payload;
  }

  @Mutation(() => CreateFilesPayload)
  @Authorized()
  async createFile(
    @Arg("input", () => [GraphQLUpload]) input: Promise<FileUpload>[],
    @Ctx("user") user: User,
    @PubSub("FILE_UPLOAD_PROGRESS")
    publish: Publisher<PubSubSessionPayload<ProgressStatus>>
  ): Promise<CreateFilesPayload> {
    const count = await this.fileService.create(input, user._id, publish);
    return { total: count };
  }

  @Mutation(() => File)
  @Authorized()
  async updateFile(
    @Arg("_id") _id: string,
    @Arg("input") input: UpdateFileInput
  ): Promise<File | null> {
    const file = await this.fileService.update(new ObjectId(_id), input);
    return file;
  }

  @Mutation(() => File)
  @Authorized()
  async deleteFile(@Arg("_id") _id: string): Promise<File | null> {
    const file = await this.fileService.delete(new ObjectId(_id));
    return file;
  }

  @Mutation(() => File)
  @Authorized()
  async createPublicUrl(@Arg("_id") _id: string): Promise<File | null> {
    const file = await this.fileService.createUrl(new ObjectId(_id));
    return file;
  }

  @Subscription(() => ProgressStatus, {
    topics: "FILE_UPLOAD_PROGRESS",
    filter: ({ payload, args }) => {
      console.log("payload, args", payload, args);
      return args.sessionId === payload.sessionId;
    },
    nullable: true,
  })
  @Authorized()
  uploadProgress(
    @Root() payload: PubSubSessionPayload<ProgressStatus>,
    @Arg("sessionId") sessionId: string
  ): ProgressStatus | null {
    console.log("here");
    return payload.data;
  }
}
