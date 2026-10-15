"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const LessonSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    duration: { type: String, default: "15 min" },
    content: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    resources: [{ type: String }],
});
const ModuleSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    lessons: [LessonSchema],
});
const QuizQuestionSchema = new mongoose_1.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswerIndex: { type: Number, required: true },
    points: { type: Number, default: 10 },
});
const QuizSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    timeLimitMinutes: { type: Number, default: 15 },
    passingScore: { type: Number, default: 70 },
    questions: [QuizQuestionSchema],
});
const AssignmentSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    instructions: { type: String, required: true },
    deadline: { type: Date },
    totalMarks: { type: Number, default: 100 },
});
const CourseSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, default: "Development" },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    thumbnail: { type: String, default: "" },
    instructor: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
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
}, { timestamps: true });
exports.Course = mongoose_1.default.models.Course || mongoose_1.default.model("Course", CourseSchema);
