import express from "express";

import { graphqlUploadExpress } from "graphql-upload";
import { Config } from "../config";
import loaders from "./loaders";

export default async (config: Config) => {
  const app = express();

  const server = await loaders();

  await server.start();

  app.use(graphqlUploadExpress({ maxFileSize: 30 * 1000 * 1000 }));

  app.use(server.getMiddleware());

  app.listen({ port: config.port }, () =>
    console.log(`Server ready at http://localhost:${config.port}${config.path}`)
  );
};
