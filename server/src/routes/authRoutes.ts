import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User, IUser, UserRole } from "../models/User";
import { protect, AuthRequest } from "../middleware/auth";

const router = Router();

const generateToken = (user: { _id?: any; id?: any; role: string }): string => {
  const secret = process.env.JWT_SECRET || "auspify_jwt_secret_key_987654321_lms";
  return jwt.sign({ id: user._id || user.id, role: user.role }, secret, {
    expiresIn: "7d",
  });
};

// Register User (FR-AUTH-01)
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: "Name, email, and password are required" });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists in Mongoose
    let user = await User.findOne({ email: cleanEmail });
    if (user) {
      // If user exists, check if password matches for seamless sign-in
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        const token = generateToken(user);
        res.status(200).json({
          success: true,
          message: "Account already exists, signed in successfully",
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            bio: user.bio,
            phone: user.phone,
            skills: user.skills,
          },
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: "An account with this email already exists. Please sign in instead.",
      });
      return;
    }

    const userRole: UserRole =
      role && ["student", "instructor", "admin"].includes(role) ? role : "student";

    user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: userRole,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login User (FR-AUTH-01)
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Please provide email and password" });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: cleanEmail });

    // Fallback: If not in Mongoose users, check if user exists in Better Auth collection
    if (!user) {
      try {
        const db = mongoose.connection.db;
        if (db) {
          const baUser = await db.collection("user").findOne({ email: cleanEmail });
          if (baUser) {
            // Auto-sync into Mongoose User collection
            user = await User.create({
              name: baUser.name || "User",
              email: cleanEmail,
              password,
              role: (baUser.role as UserRole) || "student",
              bio: baUser.bio || "",
              phone: baUser.phone || "",
            });
          }
        }
      } catch {}
    }

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        phone: user.phone,
        skills: user.skills,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current profile
router.get("/me", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;
