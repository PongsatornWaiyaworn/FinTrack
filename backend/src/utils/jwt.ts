import jwt, { JwtPayload } from "jsonwebtoken";
import env from "@/config/env";

export interface TokenPayload {
  userId: string;
  email?: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

  if (!decoded || typeof decoded !== "object" || !decoded.userId) {
    throw new Error("Invalid token");
  }

  return {
    userId: decoded.userId as string,
    email: decoded.email as string | undefined,
  };
}