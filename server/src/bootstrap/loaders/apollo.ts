import { ApolloServer } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import { authChecker, getUser } from "../../middlewares/auth.middleware";
import { resolvers } from "../../modules";
import { ObjectIdScalar } from "../../utils/scalars.utils";

export default async () => {
  const schema = await buildSchema({
    resolvers,
    authChecker,
    container: Container,
    dateScalarMode: "timestamp",
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
  });

  return new ApolloServer({
    schema,
    introspection: true,
    cache: "bounded",
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      if (!token) return new Error("Access denied!");
      const user = await getUser(token);
      return { user };
    },
    formatError: (error) => {
      return error;
    },
  });
};
