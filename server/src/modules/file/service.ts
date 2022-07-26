import shortId from "shortid";
import { ObjectId } from "mongodb";
import { Service } from "typedi";
import { createWriteStream, unlink } from "fs";
import { File } from "../../entities";
import {
  // CreateFileInput,
  FilesPayload,
  FilterFileInput,
  UpdateFileInput,
} from "./input";
import FileModel from "./model";
import { UPLOAD_DIR } from "../../config";
import { FileUpload } from "graphql-upload";
import { singleUpload } from "../../utils/fileUpload";

@Service()
export default class FileService {
  constructor(private readonly fileModel: FileModel) {}

  public async getById(_id: ObjectId): Promise<File | null> {
    return this.fileModel.getById(_id);
  }

  public async getAll(
    data: FilterFileInput,
    _id: ObjectId
  ): Promise<FilesPayload> {
    return this.fileModel.getAll(data, _id);
  }

  public async create(
    data: Promise<FileUpload>[],
    _id: ObjectId
  ): Promise<number> {
    let count = 0;
    for (const result of await Promise.allSettled(data.map(singleUpload))) {
      if ("value" in result) {
        const { name, url } = result.value;
        const newFile = await this.fileModel.create(name, url, _id);
        if (newFile) {
          count++;
        }
      } else {
        console.error(`Failed to store upload: ${result.reason}`);
      }
    }

    return count;
  }

  public async update(
    _id: ObjectId,
    data: UpdateFileInput
  ): Promise<File | null> {
    const newFile = await this.fileModel.update(_id, data);
    return newFile;
  }
}
