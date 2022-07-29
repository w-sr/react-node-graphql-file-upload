import fs from "fs/promises";
import { FileUpload } from "graphql-upload";
import { ObjectId } from "mongodb";
import { Service } from "typedi";
import { File } from "../../entities";
import { FileContentType } from "../../entities/file";
import { makeURL } from "../../utils/common.utils";
import { singleUpload } from "../../utils/file.utils";
import { FilesPayload, FilterFileInput, UpdateFileInput } from "./input";
import FileModel from "./model";

@Service()
export default class FileService {
  constructor(private readonly fileModel: FileModel) {}

  public async getById(_id: ObjectId): Promise<File | null> {
    if (!_id) throw new Error("ID was not provided.");
    const file = await this.fileModel.getById(_id);
    return file;
  }

  public async getByPublicUrl(publicUrl: string): Promise<File | null> {
    if (!publicUrl) throw new Error("Public url was not provided");
    const file = await this.fileModel.getByPublicUrl(publicUrl);
    return file;
  }

  public async getContent(
    data: string,
    type: FileContentType
  ): Promise<string> {
    if (!data) {
      throw new Error("File ID or public url was not provided");
    }
    if (!Object.values(FileContentType).includes(type)) {
      throw new Error("Type is not defined!");
    }

    let file;
    if (type === "private") {
      file = await this.getById(new ObjectId(data));
      if (!file) throw new Error("File does not existed!");
    } else {
      file = await this.getByPublicUrl(data);
      if (!file) throw new Error("Invalid public url");
    }

    const fileData = await fs.readFile(file.url);
    const content = JSON.stringify({ blob: fileData.toString("base64") });
    return content;
  }

  public async getAll(
    query: FilterFileInput,
    userId: ObjectId
  ): Promise<FilesPayload> {
    const files = await this.fileModel.getAll(query, userId);
    return files;
  }

  public async upload(
    data: Promise<FileUpload>,
    userId: ObjectId
  ): Promise<File> {
    if (!userId) throw new Error("Please login to upload a file");
    if (!data) throw new Error("File data was not provided");

    try {
      const result = await singleUpload(data);
      const { name, url } = result;
      const newFile = await this.fileModel.create(name, url, userId);
      return newFile;
    } catch (error) {
      throw new Error("File upload failed!");
    }
  }

  public async update(
    _id: ObjectId,
    data: UpdateFileInput
  ): Promise<File | null> {
    if (!_id) throw new Error("ID was not provided!");
    const updatedFile = await this.fileModel.update(_id, data);
    return updatedFile;
  }

  public async delete(_id: ObjectId): Promise<File | null> {
    if (!_id) throw new Error("ID was not provided!");
    const deletedFile = await this.fileModel.delete(_id);
    return deletedFile;
  }

  public async createUrl(_id: ObjectId): Promise<File | null> {
    if (!_id) throw new Error("ID was not provided!");
    const existingFile = await this.fileModel.getById(_id);
    if (!existingFile) throw new Error("File does not exist!");

    const data: UpdateFileInput = {
      publicUrl: makeURL(32),
      publicly: true,
    };

    const updatedFile = await this.fileModel.update(_id, data);
    return updatedFile;
  }
}
