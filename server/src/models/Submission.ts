import mongoose, { Document, Schema, Model } from "mongoose";

export interface ISubmission extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  type: "quiz" | "assignment";
  targetTitle: string;
  quizIndex?: number;
  assignmentIndex?: number;
  score?: number;
  totalPoints: number;
  percentage?: number;
  passingStatus?: "Passed" | "Failed";
  answers?: number[]; // indices of student's answers for quiz
  submissionText?: string;
  githubUrl?: string;
  liveUrl?: string;
  fileAttachment?: string;
  feedback?: string;
  status: "Pending" | "Submitted" | "Late" | "Reviewed" | "Graded";
  submittedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    type: { type: String, enum: ["quiz", "assignment"], required: true },
    targetTitle: { type: String, required: true },
    quizIndex: { type: Number },
    assignmentIndex: { type: Number },
    score: { type: Number, default: 0 },
    totalPoints: { type: Number, required: true },
    percentage: { type: Number, default: 0 },
    passingStatus: { type: String, enum: ["Passed", "Failed"] },
    answers: [{ type: Number }],
    submissionText: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    fileAttachment: { type: String, default: "" },
    feedback: { type: String, default: "Submission received and awaiting instructor review." },
    status: {
      type: String,
      enum: ["Pending", "Submitted", "Late", "Reviewed", "Graded"],
      default: "Submitted",
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Submission: Model<ISubmission> =
  mongoose.models.Submission || mongoose.model<ISubmission>("Submission", SubmissionSchema);
