import { ApolloServer } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import { authChecker, getUser } from "../../middlewares/auth.middleware";
import { resolvers } from "../../modules";
import { ObjectIdScalar } from "../../utils/scalars";

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
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      if (!token) return null;
      const user = await getUser(token);
      return { user };
    },
    formatError: (error) => {
      console.log("error", error);
      return error;
    },
  });
};
