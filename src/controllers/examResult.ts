import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import ExamResult from "../models/examResult";

export const createExamResult = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { applicantId, name, ern, examDate, passed } = req.body as {
      applicantId: string;
      name: string;
      ern: string;
      examDate: string;
      passed?: boolean;
    };

    const existingResult = await ExamResult.findOne({
      applicantId: applicantId.trim(),
    });

    if (existingResult) {
      return next(
        new ErrorHandler("Exam result for this applicant already exists", 409),
      );
    }

    const result = await ExamResult.create({
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
  },
);

export const getExamResults = catchAsyncErrors(
  async (_req: Request, res: Response) => {
    const results = await ExamResult.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  },
);

export const getExamResultByApplicantId = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const applicantIdParam = req.params.applicantId;
    const applicantId =
      typeof applicantIdParam === "string"
        ? applicantIdParam.trim()
        : String(applicantIdParam || "").trim();

    const result = await ExamResult.findOne({ applicantId });

    if (!result) {
      return next(new ErrorHandler("Applicant not found", 404));
    }

    res.status(200).json({
      success: true,
      result,
    });
  },
);

export const updateExamResult = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ExamResult.findById(req.params.id);

    if (!result) {
      return next(new ErrorHandler("Exam result not found", 404));
    }

    const { applicantId, name, ern, examDate, passed } = req.body as {
      applicantId?: string;
      name?: string;
      ern?: string;
      examDate?: string;
      passed?: boolean;
    };

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
  },
);

export const deleteExamResult = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ExamResult.findById(req.params.id);

    if (!result) {
      return next(new ErrorHandler("Exam result not found", 404));
    }

    await result.deleteOne();

    res.status(200).json({
      success: true,
      message: "Exam result deleted successfully",
    });
  },
);
