import { Router, Response } from "express";
import { User } from "../models/User";
import { protect, AuthRequest } from "../middleware/auth";

const router = Router();

// GET all users (Section 27: GET /api/users)
router.get("/", protect, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single user (Section 27: GET /api/users/:id)
router.get("/:id", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id as string;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH update user profile (Section 21 & Section 27: PATCH /api/users/:id)
router.patch("/:id", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id as string;

    // Only allow updating own profile or admin
    if (req.user!.role !== "admin" && req.user!._id.toString() !== userId) {
      res.status(403).json({ success: false, message: "Not authorized to update this profile" });
      return;
    }

    const { name, bio, phone, skills, avatarUrl } = req.body;
    const updateData: any = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;
    if (skills !== undefined) updateData.skills = skills;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    const updated = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    res.status(200).json({ success: true, user: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE user (Section 27: DELETE /api/users/:id)
router.delete("/:id", protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.id as string;
    if (req.user!.role !== "admin") {
      res.status(403).json({ success: false, message: "Only administrators can delete users" });
      return;
    }
    await User.findByIdAndDelete(userId);
    res.status(200).json({ success: true, message: "User removed successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
