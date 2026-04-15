import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

type ValidateMode = "create" | "update";
type ExamValidateMode = "create" | "update";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateUserPayload = (mode: ValidateMode) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body as {
      name?: unknown;
      email?: unknown;
      password?: unknown;
      role?: unknown;
    };

    if (mode === "create") {
      if (typeof name !== "string" || !name.trim()) {
        return next(new ErrorHandler("Name is required", 400));
      }

      if (typeof email !== "string" || !emailRegex.test(email.trim())) {
        return next(new ErrorHandler("A valid email is required", 400));
      }

      if (typeof password !== "string" || password.trim().length < 6) {
        return next(
          new ErrorHandler(
            "Password is required and must be at least 6 characters",
            400,
          ),
        );
      }
    }

    if (mode === "update") {
      if (name !== undefined && (typeof name !== "string" || !name.trim())) {
        return next(new ErrorHandler("Name must be a non-empty string", 400));
      }

      if (
        email !== undefined &&
        (typeof email !== "string" || !emailRegex.test(email.trim()))
      ) {
        return next(new ErrorHandler("Email must be valid", 400));
      }

      if (
        password !== undefined &&
        (typeof password !== "string" || password.trim().length < 6)
      ) {
        return next(
          new ErrorHandler("Password must be at least 6 characters", 400),
        );
      }
    }

    if (role !== undefined && role !== "user" && role !== "admin") {
      return next(
        new ErrorHandler("Role must be either 'user' or 'admin'", 400),
      );
    }

    next();
  };
};

export const validateLoginPayload = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body as {
    email?: unknown;
    password?: unknown;
  };

  if (typeof email !== "string" || !emailRegex.test(email.trim())) {
    return next(new ErrorHandler("A valid email is required", 400));
  }

  if (typeof password !== "string" || password.trim().length < 6) {
    return next(
      new ErrorHandler("Password must be at least 6 characters", 400),
    );
  }

  next();
};

export const validateExamPayload = (mode: ExamValidateMode) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { applicantId, name, ern, examDate, passed } = req.body as {
      applicantId?: unknown;
      name?: unknown;
      ern?: unknown;
      examDate?: unknown;
      passed?: unknown;
    };

    if (mode === "create") {
      if (typeof applicantId !== "string" || applicantId.trim().length < 3) {
        return next(new ErrorHandler("Applicant ID is required", 400));
      }

      if (typeof name !== "string" || !name.trim()) {
        return next(new ErrorHandler("Name is required", 400));
      }

      if (typeof ern !== "string" || !ern.trim()) {
        return next(new ErrorHandler("ERN is required", 400));
      }

      if (typeof examDate !== "string" || !examDate.trim()) {
        return next(new ErrorHandler("Exam date is required", 400));
      }
    }

    if (mode === "update") {
      if (
        applicantId !== undefined &&
        (typeof applicantId !== "string" || applicantId.trim().length < 3)
      ) {
        return next(new ErrorHandler("Applicant ID must be valid", 400));
      }

      if (name !== undefined && (typeof name !== "string" || !name.trim())) {
        return next(new ErrorHandler("Name must be a non-empty string", 400));
      }

      if (ern !== undefined && (typeof ern !== "string" || !ern.trim())) {
        return next(new ErrorHandler("ERN must be a non-empty string", 400));
      }

      if (
        examDate !== undefined &&
        (typeof examDate !== "string" || !examDate.trim())
      ) {
        return next(
          new ErrorHandler("Exam date must be a non-empty string", 400),
        );
      }
    }

    if (passed !== undefined && typeof passed !== "boolean") {
      return next(new ErrorHandler("Passed must be a boolean value", 400));
    }

    next();
  };
};
