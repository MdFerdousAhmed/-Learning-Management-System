import { Router, Response } from "express";
import { Enrollment } from "../models/Enrollment";
import { Course } from "../models/Course";
import { protect, authorize, AuthRequest } from "../middleware/auth";

const router = Router();

// GET all enrolled courses for logged in student (Section 27: GET /api/enrollments/my-courses)
router.get("/my-courses", protect, authorize("student"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const enrollments = await Enrollment.find({ student: req.user!._id })
      .populate("course")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Alias /my
router.get("/my", protect, authorize("student"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const enrollments = await Enrollment.find({ student: req.user!._id })
      .populate("course")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET enrollment for specific course (Section 27: GET /api/enrollments/:courseId)
router.get("/:courseId", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courseId = req.params.courseId as string;
    const enrollment = await Enrollment.findOne({
      student: req.user!._id,
      course: courseId,
    }).populate("course");

    if (!enrollment) {
      res.status(404).json({ success: false, message: "Not enrolled in this course" });
      return;
    }

    res.status(200).json({ success: true, enrollment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST Enroll in a course (Section 27: POST /api/enrollments)
router.post("/", protect, authorize("student"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      res.status(400).json({ success: false, message: "courseId is required" });
      return;
    }

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    let enrollment = await Enrollment.findOne({
      student: req.user!._id,
      course: courseId,
    });

    if (enrollment) {
      res.status(200).json({
        success: true,
        message: "Already enrolled in this course",
        enrollment,
      });
      return;
    }

    enrollment = await Enrollment.create({
      student: req.user!._id,
      course: courseId,
      completedLessons: [],
      progressPercentage: 0,
      status: "Not Started",
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledStudentsCount: 1 } });

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in course",
      enrollment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST Enroll with courseId in param
router.post("/:courseId", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courseId = req.params.courseId as string;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    let enrollment = await Enrollment.findOne({
      student: req.user!._id,
      course: courseId,
    });

    if (enrollment) {
      res.status(200).json({
        success: true,
        message: "Already enrolled in this course",
        enrollment,
      });
      return;
    }

    enrollment = await Enrollment.create({
      student: req.user!._id,
      course: courseId,
      completedLessons: [],
      progressPercentage: 0,
      status: "Not Started",
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledStudentsCount: 1 } });

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in course",
      enrollment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST Toggle lesson completion & recalculate percentage in real-time (FR-07)
router.post("/:courseId/lesson/:lessonId/toggle", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courseId = req.params.courseId as string;
    const lessonId = req.params.lessonId as string;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    let enrollment = await Enrollment.findOne({
      student: req.user!._id,
      course: courseId,
    });

    if (!enrollment) {
      enrollment = await Enrollment.create({
        student: req.user!._id,
        course: courseId,
        completedLessons: [],
        progressPercentage: 0,
        status: "In Progress",
      });
    }

    // Calculate total lessons in course
    let totalLessonsCount = 0;
    course.modules.forEach((mod) => {
      totalLessonsCount += mod.lessons.length;
    });

    const isCompleted = enrollment.completedLessons.includes(lessonId);
    if (isCompleted) {
      enrollment.completedLessons = enrollment.completedLessons.filter((id) => id !== lessonId);
    } else {
      enrollment.completedLessons.push(lessonId);
    }

    // Recompute percentage dynamically
    const completedCount = enrollment.completedLessons.length;
    const progress = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;
    enrollment.progressPercentage = Math.min(100, Math.max(0, progress));
    enrollment.lastAccessedAt = new Date();

    if (enrollment.progressPercentage === 100) {
      enrollment.status = "Completed";
      enrollment.completedAt = new Date();
    } else if (enrollment.progressPercentage > 0) {
      enrollment.status = "In Progress";
    } else {
      enrollment.status = "Not Started";
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      progressPercentage: enrollment.progressPercentage,
      status: enrollment.status,
      completedLessons: enrollment.completedLessons,
      totalLessons: totalLessonsCount,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
