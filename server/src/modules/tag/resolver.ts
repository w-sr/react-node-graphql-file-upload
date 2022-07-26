import { ObjectId } from "mongodb";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";

import { Tag } from "../../entities";
import { CreateTagInput, UpdateTagInput } from "./input";
import TagService from "./service";

@Service()
@Resolver()
export default class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Query(() => Tag)
  @Authorized()
  async getTag(@Arg("_id") _id: ObjectId): Promise<Tag | null> {
    const tag = await this.tagService.getById(_id);
    return tag;
  }

  @Query(() => [Tag])
  @Authorized()
  async getTags(): Promise<Tag[]> {
    const tags = await this.tagService.getAll();
    return tags;
  }

  @Mutation(() => Tag)
  @Authorized()
  async createTag(
    @Arg("createTagData") createTagData: CreateTagInput
  ): Promise<Tag | null> {
    const tag = await this.tagService.createTag(createTagData);
    return tag;
  }

  @Mutation(() => Tag)
  @Authorized()
  async updateTag(
    @Arg("updateTagData") updateTagData: UpdateTagInput
  ): Promise<Tag | null> {
    const tag = await this.tagService.updateTag(updateTagData);
    return tag;
  }
}
