"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExamResult = exports.updateExamResult = exports.getExamResultByApplicantId = exports.getExamResults = exports.createExamResult = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const examResult_1 = __importDefault(require("../models/examResult"));
exports.createExamResult = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    const { applicantId, name, ern, examDate, passed } = req.body;
    const existingResult = await examResult_1.default.findOne({
        applicantId: applicantId.trim(),
    });
    if (existingResult) {
        return next(new ErrorHandler_1.default("Exam result for this applicant already exists", 409));
    }
    const result = await examResult_1.default.create({
        applicantId: applicantId.trim(),
        name: name.trim(),
        ern: ern.trim(),
        examDate: examDate.trim(),
        passed: Boolean(passed),
    });
    res.status(201).json({
        success: true,
        message: "Exam result created successfully",
        result,
    });
});
exports.getExamResults = (0, catchAsyncErrors_1.catchAsyncErrors)(async (_req, res) => {
    const results = await examResult_1.default.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        count: results.length,
        results,
    });
});
exports.getExamResultByApplicantId = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    const applicantIdParam = req.params.applicantId;
    const applicantId = typeof applicantIdParam === "string"
        ? applicantIdParam.trim()
        : String(applicantIdParam || "").trim();
    const result = await examResult_1.default.findOne({ applicantId });
    if (!result) {
        return next(new ErrorHandler_1.default("Applicant not found", 404));
    }
    res.status(200).json({
        success: true,
        result,
    });
});
exports.updateExamResult = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    const result = await examResult_1.default.findById(req.params.id);
    if (!result) {
        return next(new ErrorHandler_1.default("Exam result not found", 404));
    }
    const { applicantId, name, ern, examDate, passed } = req.body;
    if (typeof applicantId === "string") {
        result.applicantId = applicantId.trim();
    }
    if (typeof name === "string") {
        result.name = name.trim();
    }
    if (typeof ern === "string") {
        result.ern = ern.trim();
    }
    if (typeof examDate === "string") {
        result.examDate = examDate.trim();
    }
    if (typeof passed === "boolean") {
        result.passed = passed;
    }
    await result.save();
    res.status(200).json({
        success: true,
        message: "Exam result updated successfully",
        result,
    });
});
exports.deleteExamResult = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    const result = await examResult_1.default.findById(req.params.id);
    if (!result) {
        return next(new ErrorHandler_1.default("Exam result not found", 404));
    }
    await result.deleteOne();
    res.status(200).json({
        success: true,
        message: "Exam result deleted successfully",
    });
});
