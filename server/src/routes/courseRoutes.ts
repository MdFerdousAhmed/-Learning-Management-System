import { Router, Request, Response } from "express";
import { Course } from "../models/Course";
import { User } from "../models/User";
import { protect, authorize, AuthRequest } from "../middleware/auth";

import { INITIAL_FALLBACK_COURSES } from "../lib/initialCourses";

const router = Router();

// In-memory cache to guarantee 100% uptime even during database reconnections
let cachedCoursesList: any[] = [...INITIAL_FALLBACK_COURSES];

// GET all courses with search and filtering (Section 20)
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, difficulty, status } = req.query;
    const query: any = {};

    // Filter by status (default to Published for public, or specified)
    if (status && status !== "All") {
      query.status = status;
    } else if (!status) {
      query.status = "Published";
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty;
    }

    if (search && String(search).trim()) {
      // Escape special regex characters to avoid invalid regular expression crashes
      const sanitizedSearch = String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: { $regex: sanitizedSearch, $options: "i" } },
        { description: { $regex: sanitizedSearch, $options: "i" } },
        { instructorName: { $regex: sanitizedSearch, $options: "i" } },
        { category: { $regex: sanitizedSearch, $options: "i" } },
      ];
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });
    if (courses && courses.length > 0) {
      cachedCoursesList = courses;
    }

    res.status(200).json({ success: true, count: courses.length, courses });
  } catch (error: any) {
    console.error("[Course Route Error]:", error.message);
    // If DB has an issue or is reconnecting, serve from cached fallback to prevent 500 error
    if (cachedCoursesList && cachedCoursesList.length > 0) {
      let filtered = [...cachedCoursesList];
      const { category, search, difficulty } = req.query;
      if (category && category !== "All") {
        filtered = filtered.filter((c) => c.category === category);
      }
      if (difficulty && difficulty !== "All") {
        filtered = filtered.filter((c) => c.difficulty === difficulty);
      }
      if (search && String(search).trim()) {
        const s = String(search).toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.title?.toLowerCase().includes(s) ||
            c.description?.toLowerCase().includes(s) ||
            c.instructorName?.toLowerCase().includes(s)
        );
      }
      res.status(200).json({ success: true, count: filtered.length, courses: filtered, fallback: true });
      return;
    }

    res.status(200).json({ success: false, count: 0, courses: [], message: error.message });
  }
});

// GET single course by id or slug
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    let course;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(id);
    } else {
      course = await Course.findOne({ slug: id });
    }

    if (!course && cachedCoursesList.length > 0) {
      course = cachedCoursesList.find(
        (c) => c._id?.toString() === id || c.slug === id
      );
    }

    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }

    res.status(200).json({ success: true, course });
  } catch (error: any) {
    console.error("[Course Detail Route Error]:", error.message);
    const id = req.params.id as string;
    const fallbackCourse = cachedCoursesList.find(
      (c) => c._id?.toString() === id || c.slug === id
    );
    if (fallbackCourse) {
      res.status(200).json({ success: true, course: fallbackCourse, fallback: true });
      return;
    }
    res.status(404).json({ success: false, message: "Course not found" });
  }
});

// POST Create new course (Instructors & Admins only - FR-04)
router.post(
  "/",
  protect,
  authorize("instructor", "admin"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        title,
        description,
        category,
        difficulty,
        thumbnail,
        price,
        duration,
        learningObjectives,
        requirements,
        modules,
        quizzes,
        assignments,
      } = req.body;

      if (!title || !description) {
        res.status(400).json({ success: false, message: "Title and description are required" });
        return;
      }

      const slug =
        title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now();

      const course = await Course.create({
        title,
        slug,
        description,
        category: category || "Development",
        difficulty: difficulty || "Beginner",
        thumbnail:
          thumbnail ||
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
        instructor: req.user!._id,
        instructorName: req.user!.name,
        price: price || 0,
        duration: duration || "12 hours",
        status: "Published",
        learningObjectives: learningObjectives || [],
        requirements: requirements || [],
        modules: modules || [],
        quizzes: quizzes || [],
        assignments: assignments || [],
      });

      res.status(201).json({ success: true, course });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// PATCH / PUT Update course (Section 27: PATCH /api/courses/:id)
router.patch(
  "/:id",
  protect,
  authorize("instructor", "admin"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const courseId = req.params.id as string;
      const course = await Course.findById(courseId);
      if (!course) {
        res.status(404).json({ success: false, message: "Course not found" });
        return;
      }

      if (req.user!.role !== "admin" && course.instructor.toString() !== req.user!._id.toString()) {
        res.status(403).json({ success: false, message: "Not authorized to update this course" });
        return;
      }

      const updated = await Course.findByIdAndUpdate(courseId, req.body, { new: true });
      res.status(200).json({ success: true, course: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// DELETE course (FR-03 & Section 27)
router.delete(
  "/:id",
  protect,
  authorize("instructor", "admin"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const courseId = req.params.id as string;
      const course = await Course.findById(courseId);
      if (!course) {
        res.status(404).json({ success: false, message: "Course not found" });
        return;
      }

      if (req.user!.role !== "admin" && course.instructor.toString() !== req.user!._id.toString()) {
        res.status(403).json({ success: false, message: "Not authorized to delete this course" });
        return;
      }

      await Course.findByIdAndDelete(courseId);
      res.status(200).json({ success: true, message: "Course deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// POST /api/courses/:id/modules - Add module to course (Section 8)
router.post(
  "/:id/modules",
  protect,
  authorize("instructor", "admin"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const courseId = req.params.id as string;
      const { title, lessons } = req.body;
      const course = await Course.findById(courseId);
      if (!course) {
        res.status(404).json({ success: false, message: "Course not found" });
        return;
      }

      course.modules.push({ title, lessons: lessons || [] });
      await course.save();

      res.status(201).json({ success: true, course });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// SEED comprehensive demo data matching the specification
router.post("/seed", async (_req: Request, res: Response): Promise<void> => {
  try {
    const { seedDatabase } = await import("../lib/seedData");
    const result = await seedDatabase();

    res.status(201).json({
      success: true,
      message: "Seeded complete platform courses, modules, lessons, enrollments, and submissions!",
      ...result,
      demoAccounts: {
        admin: { email: "admin@auspify.com", password: "password123" },
        instructor: { email: "instructor@auspify.com", password: "password123" },
        elena: { email: "elena@auspify.com", password: "password123" },
        student: { email: "student@auspify.com", password: "password123" },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
