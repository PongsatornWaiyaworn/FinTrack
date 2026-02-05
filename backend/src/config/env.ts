import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  JWT_SECRET: required("JWT_SECRET"),
};

export default env;
