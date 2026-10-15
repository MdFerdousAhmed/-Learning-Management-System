"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET all users (Section 27: GET /api/users)
router.get("/", auth_1.protect, async (_req, res) => {
    try {
        const users = await User_1.User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// GET single user (Section 27: GET /api/users/:id)
router.get("/:id", auth_1.protect, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User_1.User.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// PATCH update user profile (Section 21 & Section 27: PATCH /api/users/:id)
router.patch("/:id", auth_1.protect, async (req, res) => {
    try {
        const userId = req.params.id;
        // Only allow updating own profile or admin
        if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
            res.status(403).json({ success: false, message: "Not authorized to update this profile" });
            return;
        }
        const { name, bio, phone, skills, avatarUrl } = req.body;
        const updateData = {};
        if (name)
            updateData.name = name;
        if (bio !== undefined)
            updateData.bio = bio;
        if (phone !== undefined)
            updateData.phone = phone;
        if (skills !== undefined)
            updateData.skills = skills;
        if (avatarUrl !== undefined)
            updateData.avatarUrl = avatarUrl;
        const updated = await User_1.User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
        res.status(200).json({ success: true, user: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// DELETE user (Section 27: DELETE /api/users/:id)
router.delete("/:id", auth_1.protect, async (req, res) => {
    try {
        const userId = req.params.id;
        if (req.user.role !== "admin") {
            res.status(403).json({ success: false, message: "Only administrators can delete users" });
            return;
        }
        await User_1.User.findByIdAndDelete(userId);
        res.status(200).json({ success: true, message: "User removed successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
