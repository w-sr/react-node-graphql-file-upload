import fs from "fs/promises";
import { FileUpload } from "graphql-upload";
import { ObjectId } from "mongodb";
import { Publisher } from "type-graphql";
import { Service } from "typedi";
import { File } from "../../entities";
import { makeURL } from "../../utils/common.utils";
import { singleUpload } from "../../utils/file.utils";
import {
  FileContent,
  FilesPayload,
  FilterFileInput,
  ProgressStatus,
  UpdateFileInput,
} from "./input";
import FileModel from "./model";
import { PubSubSessionPayload } from "./resolver";

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
    const result = await this.fileModel.getAll(data, _id);
    return result;
    // const { total, files } = f;
    // const ret: FileContent[] = [];
    // if (total > 0) {
    //   await Promise.allSettled(files.map((file) => fs.readFile(file.url))).then(
    //     (results) =>
    //       results.forEach((result, index) => {
    //         if ("value" in result) {
    //           ret.push({
    //             file: files[index],
    //             content: result.value,
    //           });
    //         }
    //       })
    //   );
    // }
    // return {
    //   files: ret,
    //   total,
    // };
  }

  public async create(
    data: Promise<FileUpload>[],
    _id: ObjectId,
    publish: Publisher<PubSubSessionPayload<ProgressStatus>>
  ): Promise<number> {
    let count = 0;
    for (const result of await Promise.allSettled(
      // data.map((file) => singleUpload(file, publish))
      data.map((file) => singleUpload(file))
    )) {
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
    const updatedFile = await this.fileModel.update(_id, data);
    return updatedFile;
  }

  public async delete(_id: ObjectId): Promise<File | null> {
    const deletedFile = await this.fileModel.delete(_id);
    return deletedFile;
  }

  public async createUrl(_id: ObjectId): Promise<File | null> {
    const existingFile = await this.fileModel.getById(_id);
    if (!existingFile) throw new Error("File does not exist!");

    const data: UpdateFileInput = {
      publicUrl: makeURL(32),
    };

    const updatedFile = await this.fileModel.update(_id, data);
    return updatedFile;
  }
}
