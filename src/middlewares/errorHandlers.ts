import { Request, Response, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  (error as any).statusCode = 404;
  next(error);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode =
    err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

