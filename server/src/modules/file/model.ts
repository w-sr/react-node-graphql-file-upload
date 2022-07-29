import { ObjectId } from "mongodb";
import { Service } from "typedi";
import { File, FileMongooseModel, TagMongooseModel } from "../../entities";
import { fileNameValidate, makeURL } from "../../utils/common.utils";
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

    let searchName = name;
    if (name) {
      searchName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

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
          $or: [
            { "tags.name": { $regex: new RegExp(searchName, "i") } },
            { name: { $regex: new RegExp(searchName, "i") } },
          ],
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
    ]).exec();

    const retTotal = files[0].total.length > 0 ? files[0].total[0].count : 0;

    return { files: files[0].files, total: retTotal };
  }

  async create(filename: string, url: string, _id: ObjectId): Promise<File> {
    const data = {
      name: filename,
      user: _id,
      publicly: false,
      url,
    };
    const createdFile = new FileMongooseModel(data).save();
    return createdFile;
  }

  async update(_id: ObjectId, data: UpdateFileInput): Promise<File | null> {
    const { tags, name, publicly } = data;

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
       * Create new tags
       */
      if (nonExistingTags.length > 0) {
        const error = nonExistingTags.some(
          (tag) => !/^[A-Za-z0-9]*$/.test(tag.name)
        );

        if (error) {
          throw new Error("Please input correct tag name");
        }

        const newTags = await TagMongooseModel.create(nonExistingTags);
        newIds = [...newIds, ...newTags.map((x) => x._id)];
      }

      query.tags = newIds;
    }

    if (name) {
      const error = fileNameValidate(name);
      if (error) {
        throw new Error(error);
      }
      query.name = name
        .substring(0, name.length - 4)
        .trim()
        .concat(name.substring(name.length - 4));
    }

    if (publicly) {
      query.publicUrl = makeURL(32);
      query.publicly = true;
    } else {
      query.publicUrl = null;
      query.publicly = false;
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
