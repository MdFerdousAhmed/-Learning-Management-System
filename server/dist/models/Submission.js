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
exports.Submission = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SubmissionSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
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
}, { timestamps: true });
exports.Submission = mongoose_1.default.models.Submission || mongoose_1.default.model("Submission", SubmissionSchema);
