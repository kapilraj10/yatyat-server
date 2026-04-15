import { Router } from "express";
import {
  createExamResult,
  deleteExamResult,
  getExamResultByApplicantId,
  getExamResults,
  updateExamResult,
} from "../controllers/examResult";
import { validateExamPayload } from "../middleware/validateRequest";

const examResultsRouter = Router();

examResultsRouter.get("/", getExamResults);
examResultsRouter.get("/applicant/:applicantId", getExamResultByApplicantId);
examResultsRouter.post("/", validateExamPayload("create"), createExamResult);
examResultsRouter.put("/:id", validateExamPayload("update"), updateExamResult);
examResultsRouter.delete("/:id", deleteExamResult);

export default examResultsRouter;
