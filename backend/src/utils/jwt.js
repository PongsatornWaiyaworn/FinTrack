const jwt = require("jsonwebtoken");
const env = require("../config/env");

function signToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function verifyToken(token) {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (!decoded || typeof decoded !== "object" || !decoded.userId) {
    throw new Error("Invalid token");
  }

  return {
    userId: decoded.userId,
    email: decoded.email,
  };
}

module.exports = {
  signToken,
  verifyToken,
};
