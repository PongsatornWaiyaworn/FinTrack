import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
}
