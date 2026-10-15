import { Router, Response } from "express";
import { Submission } from "../models/Submission";
import { Course } from "../models/Course";
import { protect, authorize, AuthRequest } from "../middleware/auth";

const router = Router();

// GET all submissions for current student (Section 27: GET /api/submissions/my-submissions)
router.get("/my-submissions", protect, authorize("student"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const submissions = await Submission.find({ student: req.user!._id })
      .populate("course", "title slug thumbnail")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Alias for backwards compatibility
router.get("/my", protect, authorize("student"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const submissions = await Submission.find({ student: req.user!._id })
      .populate("course", "title slug thumbnail")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all submissions for instructor's courses (Section 18: Instructor review)
router.get(
  "/instructor",
  protect,
  authorize("instructor", "admin"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const instructorCourses = await Course.find({ instructor: req.user!._id }).select("_id");
      const courseIds = instructorCourses.map((c) => c._id);

      const query = req.user!.role === "admin" ? {} : { course: { $in: courseIds } };

      const submissions = await Submission.find(query)
        .populate("student", "name email")
        .populate("course", "title slug")
        .sort({ submittedAt: -1 });

      res.status(200).json({ success: true, count: submissions.length, submissions });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// POST Submit Quiz & Auto-Grade (FR-11: Student Quiz Attempt)
router.post("/:courseId/quiz/:quizIndex", protect, authorize("student"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courseId = req.params.courseId as string;
    const quizIndex = req.params.quizIndex as string;
    const { answers } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    const idx = parseInt(quizIndex, 10);
    const quiz = course.quizzes[idx];
    if (!quiz) {
      res.status(404).json({ success: false, message: "Quiz not found at specified index" });
      return;
    }

    if (!Array.isArray(answers)) {
      res.status(400).json({ success: false, message: "Answers must be an array of numbers" });
      return;
    }

    // Dynamic automated evaluation
    let score = 0;
    let totalPoints = 0;

    quiz.questions.forEach((q, qIndex) => {
      const qPoints = q.points || 10;
      totalPoints += qPoints;
      if (answers[qIndex] === q.correctAnswerIndex) {
        score += qPoints;
      }
    });

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const passingScore = quiz.passingScore || 70;
    const passingStatus = percentage >= passingScore ? "Passed" : "Failed";

    const feedback =
      passingStatus === "Passed"
        ? `Passed with ${percentage}%. Excellent mastery of the concepts!`
        : `Scored ${percentage}%. Passing benchmark is ${passingScore}%. Please review the lessons and retake.`;

    const submission = await Submission.create({
      student: req.user!._id,
      course: course._id,
      type: "quiz",
      targetTitle: quiz.title,
      quizIndex: idx,
      score,
      totalPoints,
      percentage,
      passingStatus,
      answers,
      feedback,
      status: "Graded",
    });

    res.status(201).json({
      success: true,
      message: "Quiz auto-evaluated successfully",
      result: {
        score,
        totalPoints,
        percentage,
        passingStatus,
        feedback,
        submissionId: submission._id,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST Submit Assignment (FR-09: Student Assignment Submission)
router.post("/:courseId/assignment/:assignmentIndex", protect, authorize("student"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courseId = req.params.courseId as string;
    const assignmentIndex = req.params.assignmentIndex as string;
    const { submissionText, githubUrl, liveUrl, fileAttachment } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    const idx = parseInt(assignmentIndex, 10);
    const assignment = course.assignments[idx];
    if (!assignment) {
      res.status(404).json({ success: false, message: "Assignment not found at specified index" });
      return;
    }

    const submission = await Submission.create({
      student: req.user!._id,
      course: course._id,
      type: "assignment",
      targetTitle: assignment.title,
      assignmentIndex: idx,
      totalPoints: assignment.totalMarks || 100,
      submissionText: submissionText || "",
      githubUrl: githubUrl || "",
      liveUrl: liveUrl || "",
      fileAttachment: fileAttachment || "",
      feedback: "Received and awaiting instructor evaluation.",
      status: "Submitted",
    });

    res.status(201).json({
      success: true,
      message: "Assignment submitted successfully!",
      submission,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/submissions/:id/review - Instructor reviews and grades assignment (Section 27 & FR-12)
router.patch(
  "/:id/review",
  protect,
  authorize("instructor", "admin"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const submissionId = req.params.id as string;
      const { score, feedback, status } = req.body;

      const submission = await Submission.findById(submissionId);
      if (!submission) {
        res.status(404).json({ success: false, message: "Submission not found" });
        return;
      }

      if (score !== undefined) {
        submission.score = score;
        submission.percentage = Math.round((score / submission.totalPoints) * 100);
        submission.passingStatus = submission.percentage >= 60 ? "Passed" : "Failed";
      }

      if (feedback) submission.feedback = feedback;
      submission.status = status || "Reviewed";

      await submission.save();

      res.status(200).json({
        success: true,
        message: "Submission evaluated successfully",
        submission,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
