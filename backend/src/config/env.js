function required(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: required("JWT_SECRET"),
};

