import { FileUpload, GraphQLUpload } from "graphql-upload";
import { ObjectId } from "mongodb";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { File, User } from "../../entities";
import { FileContentType } from "../../entities/file";
import {
  FileContentPayload,
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
    const payload = await this.fileService.getById(_id);
    return payload;
  }

  @Query(() => FileContentPayload)
  @Authorized()
  async getPrivateFileContent(
    @Arg("data") data: string
  ): Promise<FileContentPayload | null> {
    const payload = await this.fileService.getContent(
      data,
      FileContentType.PRIVATE
    );
    return { content: payload };
  }

  @Query(() => FileContentPayload)
  async getPublicFileContent(
    @Arg("data") data: string
  ): Promise<FileContentPayload | null> {
    const payload = await this.fileService.getContent(
      data,
      FileContentType.PUBLIC
    );
    return { content: payload };
  }

  @Query(() => FilesPayload)
  @Authorized()
  async getFileList(
    @Arg("filters") filters: FilterFileInput,
    @Ctx("user") user: User
  ): Promise<FilesPayload> {
    const payload = await this.fileService.getAll(filters, user._id);
    return payload;
  }

  @Mutation(() => File)
  @Authorized()
  async uploadFile(
    @Arg("input", () => GraphQLUpload) input: Promise<FileUpload>,
    @Ctx("user") user: User
  ): Promise<File> {
    const payload = await this.fileService.upload(input, user._id);
    return payload;
  }

  @Mutation(() => File)
  @Authorized()
  async updateFile(
    @Arg("_id") _id: string,
    @Arg("input") input: UpdateFileInput
  ): Promise<File | null> {
    const payload = await this.fileService.update(new ObjectId(_id), input);
    return payload;
  }

  @Mutation(() => File)
  @Authorized()
  async deleteFile(@Arg("_id") _id: string): Promise<File | null> {
    const payload = await this.fileService.delete(new ObjectId(_id));
    return payload;
  }
}
