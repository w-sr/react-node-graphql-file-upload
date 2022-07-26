import dotenv from "dotenv";
dotenv.config();

// Safely get the environment variable in the process
const env = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing: process.env['${name}'].`);
  }

  return value;
};

export interface Config {
  salt: string;
  port: number;
  path: string;
  db: {
    host: string;
    name: string;
    port: number;
    user: string;
    pass: string;
  };
}

// All your secrets, keys go here
export const config: Config = {
  salt: env("AUTH_SALT"),
  port: +env("PORT"),
  path: env("GRAPHQL_PATH"),
  db: {
    host: env("DB_HOST"),
    name: env("DB_NAME"),
    port: +env("DB_PORT"),
    user: env("DB_USER"),
    pass: env("DB_PASS"),
  },
};

export const UPLOAD_DIR = "./uploads";
