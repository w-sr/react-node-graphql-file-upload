import cors from "cors";
import express from "express";

import { config } from "../../config";

export default async (app: express.Application) => {
  app.use(config.path);

  app.use(cors());
};
