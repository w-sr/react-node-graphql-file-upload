import { ObjectId } from "mongodb";
import { Service } from "typedi";

import { File, FileMongooseModel, TagMongooseModel } from "../../entities";
import { FilesPayload, FilterFileInput, UpdateFileInput } from "./input";

@Service()
export default class FileModel {
  async getById(_id: ObjectId): Promise<File | null> {
    const file = await FileMongooseModel.findById(_id).populate("tags").exec();
    return file;
  }

  async getAll(data: FilterFileInput, _id: ObjectId): Promise<FilesPayload> {
    const { page, pageSize, name } = data;

    const files = await FileMongooseModel.aggregate([
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $match: {
          $and: [
            {
              user: { $eq: _id },
            },
            {
              $or: [
                { "tags.name": { $eq: name } },
                { name: { $regex: new RegExp(name, "i") } },
              ],
            },
          ],
        },
      },
      {
        $facet: {
          files: [{ $skip: (page - 1) * pageSize }, { $limit: +pageSize }],
          total: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const retTotal = files[0].total > 0 ? files[0].total[0].count : 0;

    return { files: files[0].files, total: retTotal };
  }

  async create(filename: string, url: string, _id: ObjectId): Promise<File> {
    const query = {
      name: filename,
      user: _id,
      public: false,
      url,
    };
    const createdFile = new FileMongooseModel(query);
    return createdFile.save();
  }

  async update(_id: ObjectId, data: UpdateFileInput): Promise<File | null> {
    const { tags, name } = data;

    /**
     * Check if there are newly inputed tags
     */
    const existingTags = await TagMongooseModel.find(
      {
        name: { $in: [...tags] },
      },
      { name: true }
    );

    const nonExistingTags = tags
      .filter((t) => !existingTags.map((ex) => ex.name).includes(t))
      .map((y) => ({ name: y }));

    /**
     * Create non existing tags
     */
    let newIds = [...existingTags.map((e) => e._id)];
    if (nonExistingTags.length > 0) {
      const newTags = await TagMongooseModel.create(nonExistingTags);
      newIds = [...newIds, ...newTags.map((x) => x._id)];
    }

    const updatedFile = await FileMongooseModel.findOneAndUpdate(
      {
        _id,
      },
      {
        name,
        tags: newIds,
      },
      {
        new: true,
      }
    ).populate("tags");

    return updatedFile;
  }

  async delete(_id: ObjectId): Promise<File | null> {
    const deletedFile = await FileMongooseModel.findByIdAndUpdate(_id, {
      isDeleted: true,
    });
    return deletedFile;
  }
}
