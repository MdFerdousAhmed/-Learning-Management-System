import { Router, Response } from "express";
import { User } from "../models/User";
import { Course } from "../models/Course";
import { Enrollment } from "../models/Enrollment";
import { Submission } from "../models/Submission";
import { protect, authorize, AuthRequest } from "../middleware/auth";

const router = Router();

// Protect all admin routes with RBAC
router.use(protect);
router.use(authorize("admin"));

// GET /api/admin/stats - Platform Statistics (Section 19)
router.get("/stats", async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalInstructors = await User.countDocuments({ role: "instructor" });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ status: "Published" });
    const totalEnrollments = await Enrollment.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    // Sum total quizzes and assignments across courses
    const allCourses = await Course.find();
    let totalQuizzes = 0;
    let totalAssignments = 0;
    allCourses.forEach((c) => {
      totalQuizzes += c.quizzes?.length || 0;
      totalAssignments += c.assignments?.length || 0;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        totalAssignments,
        totalQuizzes,
        totalSubmissions,
        activeUsers: totalUsers,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/users - User Management (Section 3.1)
router.get("/users", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.query;
    const query: any = {};
    if (role && role !== "all") {
      query.role = role;
    }
    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/users/:id/role - Update user role
router.patch("/users/:id/role", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id as string;
    const { role } = req.body;

    if (!["student", "instructor", "admin"].includes(role)) {
      res.status(400).json({ success: false, message: "Invalid role specified" });
      return;
    }

    const updated = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
    if (!updated) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, user: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete("/users/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id as string;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/courses/:id/status - Approve or toggle course status
router.patch("/courses/:id/status", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courseId = req.params.id as string;
    const { status } = req.body;
    if (!["Draft", "Published", "Archived"].includes(status)) {
      res.status(400).json({ success: false, message: "Invalid course status" });
      return;
    }

    const updated = await Course.findByIdAndUpdate(courseId, { status }, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    res.status(200).json({ success: true, course: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
