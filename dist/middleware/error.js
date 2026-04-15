"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const errorMiddleware = (err, req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error ";
    // wrong mysql id ero
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler_1.default(message, 400);
    }
    // wrong jwt eror
    if (err.name === "JsonWebTokenError") {
        const message = `Json web token is invalid, try again`;
        err = new ErrorHandler_1.default(message, 400);
    }
    // JWT expired error
    if (err.name === "TokenExpiredError") {
        const message = `Json web token is expired , try again `;
        err = new ErrorHandler_1.default(message, 400);
    }
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};
exports.errorMiddleware = errorMiddleware;
