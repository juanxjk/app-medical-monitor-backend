import { Request, Response } from "express";
import appConfig from "../config";
import UserRepository from "../repositories/UserRepository";
import { generateToken } from "./utils/tokens";

const userRepository = new UserRepository();
const secret = appConfig.secret;

export default {
  login: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      const user = await userRepository.findOne(
        { username },
        { select: ["id","passwordHash"] }
      );

      if (!user) return res.status(404).json({ error: "User not found" });

      if (!user.checkPassword(password))
      return res.status(401).json({ error: "Invalid password" });
      
      const token = generateToken(user, secret);

      res.json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Error" });
    }
  },
};
