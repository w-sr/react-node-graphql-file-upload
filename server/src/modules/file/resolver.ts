import { FileUpload, GraphQLUpload } from "graphql-upload";
import { ObjectId } from "mongodb";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";

import { File, User } from "../../entities";
import {
  CreateFilesPayload,
  // CreateFileInput,
  FilesPayload,
  FilterFileInput,
  UpdateFileInput,
} from "./input";
import FileService from "./service";

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
    @Ctx("user") user: User
  ): Promise<CreateFilesPayload> {
    const count = await this.fileService.create(input, user._id);
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
}
