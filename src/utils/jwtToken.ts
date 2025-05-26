import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";

export const generateToken = (id: any): string => {
  return jwt.sign({id}, JWT_SECRET, { expiresIn: "1d" });
};

