import jwt from "jsonwebtoken";
import prisma from "../db/db_connection";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config/config";

export interface AuthenticatedRequest extends Request {
  user?: any;
}
export const authMiddleware = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req?.headers?.authorization?.split(" ")[1];
      try {
        if (token) {
          const decode = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
          if (!decode || typeof decode !== "object" || !("id" in decode)) {
            res.status(403);
            throw new Error("Invalid Token Payload");
          }
          const user = await prisma.user.findUnique({
            where: { id: decode.id },
          });
          if (!user || user.isDeleted) {
            res.status(404);
            {
              throw new Error("User not Found or has been Deleted");
            }
          }
          req.user = user;
          next();
        }
      } catch (error:any) {
        throw new Error(error);
      }
    } else {
      throw new Error("No Token Attached to the Header");
    }
  }
);

export const isAdmin = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req?.user?.role !== "ADMIN") {
      throw new Error("Access denied: Admins only");
    } else {
      next();
    }
  }
);
