import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";

type TokenPayload = {
  userId: string;
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
    req.userId = payload.userId;
    return next();
  } catch (error) {
    console.error("Failed to verify token", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const signAuthToken = (payload: TokenPayload, expiresIn = "7d") =>
  jwt.sign(payload, env.jwtSecret, { expiresIn });

