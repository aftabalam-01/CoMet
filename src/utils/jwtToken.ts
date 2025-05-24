import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";

export const generateToken = (payload: object): string => {
  return jwt.sign({ payload }, JWT_SECRET, { expiresIn: "1d" });
};

export const verfiyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
