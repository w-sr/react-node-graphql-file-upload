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

  async getByPublicUrl(publicUrl: string): Promise<File | null> {
    const file = await FileMongooseModel.findOne({ publicUrl }).exec();
    return file;
  }

  async getAll(
    query: FilterFileInput,
    userId: ObjectId
  ): Promise<FilesPayload> {
    const { page, pageSize, name } = query;

    const files = await FileMongooseModel.aggregate([
      {
        $match: {
          user: { $eq: userId },
          isDeleted: { $eq: false },
        },
      },
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
          $or: [{ "tags.name": { $regex: name } }, { name: { $regex: name } }],
        },
      },
      {
        $facet: {
          files: [
            { $sort: { createdAt: -1 } },
            { $skip: page * pageSize },
            { $limit: +pageSize },
          ],
          total: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const retTotal = files[0].total.length > 0 ? files[0].total[0].count : 0;

    return { files: files[0].files, total: retTotal };
  }

  async create(filename: string, url: string, _id: ObjectId): Promise<File> {
    const data = {
      name: filename,
      user: _id,
      public: false,
      url,
    };
    const createdFile = new FileMongooseModel(data).save();
    return createdFile;
  }

  async update(_id: ObjectId, data: UpdateFileInput): Promise<File | null> {
    const { tags, name, publicUrl } = data;

    const query: Record<string, any> = {};
    if (tags) {
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
        .filter((tag) => !existingTags.find((ex) => ex.name === tag))
        .map((y) => ({ name: y }));

      let newIds = [...existingTags.map((e) => e._id)];

      /**
       * Create non existing tags
       */
      if (nonExistingTags.length > 0) {
        const newTags = await TagMongooseModel.create(nonExistingTags);
        newIds = [...newIds, ...newTags.map((x) => x._id)];
      }

      query.tags = newIds;
    }

    if (name) {
      query.name = name;
    }

    if (publicUrl) {
      query.publicUrl = publicUrl;
      query.public = true;
    }

    const updatedFile = await FileMongooseModel.findOneAndUpdate(
      {
        _id,
      },
      query,
      {
        new: true,
      }
    ).populate("tags");

    return updatedFile;
  }

  async delete(_id: ObjectId): Promise<File | null> {
    const deletedFile = await FileMongooseModel.findByIdAndUpdate(_id, {
      isDeleted: true,
      publicUrl: null,
    });
    return deletedFile;
  }
}
