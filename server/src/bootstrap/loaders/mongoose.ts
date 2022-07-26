import mongoose from "mongoose";

import { config } from "../../config";

const { db } = config;
const dbURL = `mongodb://${db.host}:${db.port}/${db.name}`;

// Close the Mongoose default connection is the event of application termination
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

export const mongoDBConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const options: mongoose.ConnectOptions = {
  autoIndex: true,
};

// Your Mongoose setup goes here
export default async (): Promise<mongoose.Mongoose> =>
  mongoose.connect(dbURL, options);
