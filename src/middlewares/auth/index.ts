import jwt from "jsonwebtoken";
import appConfig from "../../config";
import User from "../../models/User";
import { Request, Response, NextFunction } from "express";
import UserRepository from "../../repositories/UserRepository";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .send({ error: "This resource needs authentication" });
  }

  const parts = authHeader.split(" ");

  if (!(parts.length === 2)) {
    return res.status(401).send({ error: "Invalid token" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: "Token error" });
  }

  const secret = appConfig.secret;

  if (!secret) return res.status(500).json("Internal Error");

  let userID: string;

  jwt.verify(token, secret, async (error, decoded) => {
    if (error || !decoded) {
      return res.status(401).send({ error: "Invalid Token" });
    }
    userID = (<any>decoded).id;
    const user: User = await new UserRepository().findByID(userID);
    if (!user) {
      return res.status(401).send({ error: "Invalid user" });
    }
    return next();
  });
};
