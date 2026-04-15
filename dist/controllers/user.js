"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const user_1 = __importDefault(require("../models/user"));
const sanitizeUser = (userDoc) => {
    const user = userDoc.toObject();
    delete user.password;
    return user;
};
exports.createUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const existingUser = await user_1.default.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        return next(new ErrorHandler_1.default("User with this email already exists", 409));
    }
    const user = await user_1.default.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password.trim(),
        role: role ?? "user",
    });
    res.status(201).json({
        success: true,
        message: "User created successfully",
        user: sanitizeUser(user),
    });
});
exports.getUsers = (0, catchAsyncErrors_1.catchAsyncErrors)(async (_req, res) => {
    const users = await user_1.default.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        count: users.length,
        users,
    });
});
exports.getUserById = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    const user = await user_1.default.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler_1.default("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user,
    });
});
exports.updateUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    const user = await user_1.default.findById(req.params.id).select("+password");
    if (!user) {
        return next(new ErrorHandler_1.default("User not found", 404));
    }
    const { name, email, password, role } = req.body;
    if (typeof name === "string") {
        user.name = name.trim();
    }
    if (typeof email === "string") {
        user.email = email.toLowerCase().trim();
    }
    if (typeof password === "string") {
        user.password = password.trim();
    }
    if (role) {
        user.role = role;
    }
    await user.save();
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: sanitizeUser(user),
    });
});
exports.deleteUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    const user = await user_1.default.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler_1.default("User not found", 404));
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});
exports.loginUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await user_1.default.findOne({
        email: email.toLowerCase().trim(),
    }).select("+password");
    if (!user) {
        return next(new ErrorHandler_1.default("Invalid email or password", 401));
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return next(new ErrorHandler_1.default("Invalid email or password", 401));
    }
    res.status(200).json({
        success: true,
        message: "Login successful",
        user: sanitizeUser(user),
    });
});
