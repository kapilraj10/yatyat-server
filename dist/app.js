"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middleware/error");
const users_1 = __importDefault(require("./routes/users"));
const examResults_1 = __importDefault(require("./routes/examResults"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json({ limit: "50mb" }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
}));
exports.app.get("/test", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "API is working",
    });
});
exports.app.use("/api/v1/users", users_1.default);
exports.app.use("/api/v1/exams", examResults_1.default);
exports.app.use((req, _res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
exports.app.use(error_1.errorMiddleware);
