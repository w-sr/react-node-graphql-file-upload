import { ApolloServer } from "apollo-server-express";

// loaders
import apolloLoader from "./apollo";
import mongooseLoader from "./mongoose";

export default async (): Promise<ApolloServer> => {
  // Connect to mongoose
  await mongooseLoader();

  // load apollo server config
  return apolloLoader();
};
