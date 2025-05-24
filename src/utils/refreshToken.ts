import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign({ payload }, JWT_SECRET, { expiresIn: "1d" });
};

