import { ApolloServer } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import { authChecker, getUser } from "../../middlewares/auth.middleware";
import { resolvers } from "../../modules";
import { ObjectIdScalar } from "../../utils/scalars.utils";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { httpServer } from "..";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

export default async () => {
  const schema = await buildSchema({
    resolvers,
    authChecker,
    container: Container,
    dateScalarMode: "timestamp",
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  const serverCleanup = useServer({ schema }, wsServer);

  return new ApolloServer({
    schema,
    introspection: true,
    cache: "bounded",
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      if (!token) return null;
      const user = await getUser(token);
      return { user };
    },
    formatError: (error) => {
      return error;
    },
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
};
