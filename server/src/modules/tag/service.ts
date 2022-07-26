import { ObjectId } from "mongodb";
import { Service } from "typedi";
import { Tag } from "../../entities";
import { CreateTagInput, UpdateTagInput } from "./input";

import TagModel from "./model";

@Service()
export default class TagService {
  constructor(private readonly tagModel: TagModel) {}

  public async getAll(): Promise<Tag[]> {
    return this.tagModel.getAll();
  }

  public async getById(_id: ObjectId): Promise<Tag | null> {
    return this.tagModel.getById(_id);
  }

  public async createTag(data: CreateTagInput): Promise<Tag | null> {
    return this.tagModel.create(data);
  }

  public async updateTag(data: UpdateTagInput): Promise<Tag | null> {
    const { _id, name } = data;
    const tag = await this.tagModel.getById(_id);
    if (!tag) throw new Error("Tag does not exist!");
    if (tag.name === data.name)
      throw new Error("Tag with same name is existed");

    return this.tagModel.update(_id, name);
  }
}
