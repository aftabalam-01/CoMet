"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};
exports.notFound = notFound;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong",
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};
exports.errorHandler = errorHandler;
