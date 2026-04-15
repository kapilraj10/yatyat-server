"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("Missing MongoDB URI. Set MONGO_URI (or MONGODB_URI) in your environment.");
    }
    const { connection } = await mongoose_1.default.connect(mongoUri);
    console.log(`MongoDB connected: ${connection.host}`);
};
exports.connectDB = connectDB;
