import mongoose, { Document, Model, Schema } from "mongoose";

export interface IExamResult extends Document {
  applicantId: string;
  name: string;
  ern: string;
  examDate: string;
  passed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const examResultSchema = new Schema<IExamResult>(
  {
    applicantId: {
      type: String,
      required: [true, "Applicant ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    ern: {
      type: String,
      required: [true, "ERN is required"],
      trim: true,
    },
    examDate: {
      type: String,
      required: [true, "Exam date is required"],
      trim: true,
    },
    passed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const ExamResult: Model<IExamResult> =
  mongoose.models.ExamResult ||
  mongoose.model<IExamResult>("ExamResult", examResultSchema);

export default ExamResult;
