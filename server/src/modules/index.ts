import UserResolver from "./user/resolver";
import FileResolver from "./file/resolver";
import TagResolver from "./tag/resolver";

export const resolvers: [Function, ...Function[]] = [
  UserResolver,
  FileResolver,
  TagResolver,
];
