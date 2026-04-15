"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExamPayload = exports.validateLoginPayload = exports.validateUserPayload = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateUserPayload = (mode) => {
    return (req, _res, next) => {
        const { name, email, password, role } = req.body;
        if (mode === "create") {
            if (typeof name !== "string" || !name.trim()) {
                return next(new ErrorHandler_1.default("Name is required", 400));
            }
            if (typeof email !== "string" || !emailRegex.test(email.trim())) {
                return next(new ErrorHandler_1.default("A valid email is required", 400));
            }
            if (typeof password !== "string" || password.trim().length < 6) {
                return next(new ErrorHandler_1.default("Password is required and must be at least 6 characters", 400));
            }
        }
        if (mode === "update") {
            if (name !== undefined && (typeof name !== "string" || !name.trim())) {
                return next(new ErrorHandler_1.default("Name must be a non-empty string", 400));
            }
            if (email !== undefined &&
                (typeof email !== "string" || !emailRegex.test(email.trim()))) {
                return next(new ErrorHandler_1.default("Email must be valid", 400));
            }
            if (password !== undefined &&
                (typeof password !== "string" || password.trim().length < 6)) {
                return next(new ErrorHandler_1.default("Password must be at least 6 characters", 400));
            }
        }
        if (role !== undefined && role !== "user" && role !== "admin") {
            return next(new ErrorHandler_1.default("Role must be either 'user' or 'admin'", 400));
        }
        next();
    };
};
exports.validateUserPayload = validateUserPayload;
const validateLoginPayload = (req, _res, next) => {
    const { email, password } = req.body;
    if (typeof email !== "string" || !emailRegex.test(email.trim())) {
        return next(new ErrorHandler_1.default("A valid email is required", 400));
    }
    if (typeof password !== "string" || password.trim().length < 6) {
        return next(new ErrorHandler_1.default("Password must be at least 6 characters", 400));
    }
    next();
};
exports.validateLoginPayload = validateLoginPayload;
const validateExamPayload = (mode) => {
    return (req, _res, next) => {
        const { applicantId, name, ern, examDate, passed } = req.body;
        if (mode === "create") {
            if (typeof applicantId !== "string" || applicantId.trim().length < 3) {
                return next(new ErrorHandler_1.default("Applicant ID is required", 400));
            }
            if (typeof name !== "string" || !name.trim()) {
                return next(new ErrorHandler_1.default("Name is required", 400));
            }
            if (typeof ern !== "string" || !ern.trim()) {
                return next(new ErrorHandler_1.default("ERN is required", 400));
            }
            if (typeof examDate !== "string" || !examDate.trim()) {
                return next(new ErrorHandler_1.default("Exam date is required", 400));
            }
        }
        if (mode === "update") {
            if (applicantId !== undefined &&
                (typeof applicantId !== "string" || applicantId.trim().length < 3)) {
                return next(new ErrorHandler_1.default("Applicant ID must be valid", 400));
            }
            if (name !== undefined && (typeof name !== "string" || !name.trim())) {
                return next(new ErrorHandler_1.default("Name must be a non-empty string", 400));
            }
            if (ern !== undefined && (typeof ern !== "string" || !ern.trim())) {
                return next(new ErrorHandler_1.default("ERN must be a non-empty string", 400));
            }
            if (examDate !== undefined &&
                (typeof examDate !== "string" || !examDate.trim())) {
                return next(new ErrorHandler_1.default("Exam date must be a non-empty string", 400));
            }
        }
        if (passed !== undefined && typeof passed !== "boolean") {
            return next(new ErrorHandler_1.default("Passed must be a boolean value", 400));
        }
        next();
    };
};
exports.validateExamPayload = validateExamPayload;
