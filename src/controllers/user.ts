import { Request, Response, NextFunction } from "express";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import User from "../models/user";

const sanitizeUser = (userDoc: { toObject: () => Record<string, unknown> }) => {
  const user = userDoc.toObject();
  delete user.password;
  return user;
};

export const createUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: "user" | "admin";
    };

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new ErrorHandler("User with this email already exists", 409));
    }

    const user = await User.create({
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
  },
);

export const getUsers = catchAsyncErrors(
  async (_req: Request, res: Response) => {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  },
);

export const getUserById = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  },
);

export const updateUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const { name, email, password, role } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: "user" | "admin";
    };

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
  },
);

export const deleteUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  },
);

export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: sanitizeUser(user),
    });
  },
);
