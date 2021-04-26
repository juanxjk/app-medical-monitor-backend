import User from "../../models/User";
import jwt from "jsonwebtoken";

export const generateToken = (
  user: User,
  secret: string,
  options?: jwt.SignOptions
) => {
  return jwt.sign({ id: user.id }, secret, { expiresIn: "1 day", ...options });
};
