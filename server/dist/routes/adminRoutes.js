"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const Course_1 = require("../models/Course");
const Enrollment_1 = require("../models/Enrollment");
const Submission_1 = require("../models/Submission");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Protect all admin routes with RBAC
router.use(auth_1.protect);
router.use((0, auth_1.authorize)("admin"));
// GET /api/admin/stats - Platform Statistics (Section 19)
router.get("/stats", async (_req, res) => {
    try {
        const totalUsers = await User_1.User.countDocuments();
        const totalStudents = await User_1.User.countDocuments({ role: "student" });
        const totalInstructors = await User_1.User.countDocuments({ role: "instructor" });
        const totalCourses = await Course_1.Course.countDocuments();
        const publishedCourses = await Course_1.Course.countDocuments({ status: "Published" });
        const totalEnrollments = await Enrollment_1.Enrollment.countDocuments();
        const totalSubmissions = await Submission_1.Submission.countDocuments();
        // Sum total quizzes and assignments across courses
        const allCourses = await Course_1.Course.find();
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// GET /api/admin/users - User Management (Section 3.1)
router.get("/users", async (req, res) => {
    try {
        const { role } = req.query;
        const query = {};
        if (role && role !== "all") {
            query.role = role;
        }
        const users = await User_1.User.find(query).select("-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// PATCH /api/admin/users/:id/role - Update user role
router.patch("/users/:id/role", async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;
        if (!["student", "instructor", "admin"].includes(role)) {
            res.status(400).json({ success: false, message: "Invalid role specified" });
            return;
        }
        const updated = await User_1.User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
        if (!updated) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({ success: true, user: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// DELETE /api/admin/users/:id - Delete user
router.delete("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        await User_1.User.findByIdAndDelete(userId);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// PATCH /api/admin/courses/:id/status - Approve or toggle course status
router.patch("/courses/:id/status", async (req, res) => {
    try {
        const courseId = req.params.id;
        const { status } = req.body;
        if (!["Draft", "Published", "Archived"].includes(status)) {
            res.status(400).json({ success: false, message: "Invalid course status" });
            return;
        }
        const updated = await Course_1.Course.findByIdAndUpdate(courseId, { status }, { new: true });
        if (!updated) {
            res.status(404).json({ success: false, message: "Course not found" });
            return;
        }
        res.status(200).json({ success: true, course: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
