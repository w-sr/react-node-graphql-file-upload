import { ObjectId } from "mongodb";
import { Service } from "typedi";

import { Tag, TagMongooseModel } from "../../entities";
import { CreateTagInput, UpdateTagInput } from "./input";

@Service()
export default class TagModel {
  async getById(_id: ObjectId): Promise<Tag | null> {
    const tag = await TagMongooseModel.findOne({ _id }).lean().exec();
    return tag;
  }

  async getAll(): Promise<Tag[]> {
    const tags = await TagMongooseModel.find();

    return tags;
  }

  async create(data: CreateTagInput): Promise<Tag> {
    const createdTag = new TagMongooseModel({ ...data, available: true });
    return createdTag.save();
  }

  async update(_id: ObjectId, name: string): Promise<Tag | null> {
    const updatedTag = await TagMongooseModel.findOneAndUpdate(
      {
        _id,
      },
      { name },
      {
        new: true,
      }
    );
    return updatedTag;
  }

  async delete(_id: ObjectId): Promise<Tag | null> {
    const deletedTag = await TagMongooseModel.findByIdAndUpdate(_id, {
      isDeleted: true,
    });
    return deletedTag;
  }
}
