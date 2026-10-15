import mongoose, { Document, Schema, Model } from "mongoose";

export interface ILesson {
  _id?: mongoose.Types.ObjectId;
  title: string;
  duration: string;
  content: string;
  videoUrl?: string;
  resources?: string[];
}

export interface IModule {
  _id?: mongoose.Types.ObjectId;
  title: string;
  lessons: ILesson[];
}

export interface IQuizQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  points: number;
}

export interface IQuiz {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScore: number;
  questions: IQuizQuestion[];
}

export interface IAssignment {
  _id?: mongoose.Types.ObjectId;
  title: string;
  instructions: string;
  deadline?: Date;
  totalMarks: number;
}

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string;
  instructor: mongoose.Types.ObjectId;
  instructorName?: string;
  price: number;
  duration: string;
  status: "Draft" | "Published" | "Archived";
  learningObjectives?: string[];
  requirements?: string[];
  modules: IModule[];
  quizzes: IQuiz[];
  assignments: IAssignment[];
  enrolledStudentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  duration: { type: String, default: "15 min" },
  content: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
  resources: [{ type: String }],
});

const ModuleSchema = new Schema<IModule>({
  title: { type: String, required: true },
  lessons: [LessonSchema],
});

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true },
  points: { type: Number, default: 10 },
});

const QuizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  timeLimitMinutes: { type: Number, default: 15 },
  passingScore: { type: Number, default: 70 },
  questions: [QuizQuestionSchema],
});

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  instructions: { type: String, required: true },
  deadline: { type: Date },
  totalMarks: { type: Number, default: 100 },
});

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, default: "Development" },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    thumbnail: { type: String, default: "" },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    instructorName: { type: String, default: "Instructor" },
    price: { type: Number, default: 0 },
    duration: { type: String, default: "8 hours" },
    status: { type: String, enum: ["Draft", "Published", "Archived"], default: "Published" },
    learningObjectives: [{ type: String }],
    requirements: [{ type: String }],
    modules: [ModuleSchema],
    quizzes: [QuizSchema],
    assignments: [AssignmentSchema],
    enrolledStudentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
