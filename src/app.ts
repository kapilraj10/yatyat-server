import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { NextFunction, Request, Response } from "express";
import { errorMiddleware } from "./middleware/error";
import usersRouter from "./routes/users";
import examResultsRouter from "./routes/examResults";

export const app = express();

app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);

app.get("/test", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/exams", examResultsRouter);

app.use((req: Request, _res: Response, next: NextFunction) => {
  const err: any = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

app.use(errorMiddleware);
