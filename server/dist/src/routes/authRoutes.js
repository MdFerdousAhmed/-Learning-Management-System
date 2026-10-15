"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const generateToken = (user) => {
    const secret = process.env.JWT_SECRET || "auspify_jwt_secret_key_987654321_lms";
    return jsonwebtoken_1.default.sign({ id: user._id || user.id, role: user.role }, secret, {
        expiresIn: "7d",
    });
};
// Register User (FR-AUTH-01)
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: "Name, email, and password are required" });
            return;
        }
        const cleanEmail = email.toLowerCase().trim();
        // Check if user already exists in Mongoose
        let user = await User_1.User.findOne({ email: cleanEmail });
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
        const userRole = role && ["student", "instructor", "admin"].includes(role) ? role : "student";
        user = await User_1.User.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// Login User (FR-AUTH-01)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: "Please provide email and password" });
            return;
        }
        const cleanEmail = email.toLowerCase().trim();
        let user = await User_1.User.findOne({ email: cleanEmail });
        // Fallback: If not in Mongoose users, check if user exists in Better Auth collection
        if (!user) {
            try {
                const db = mongoose_1.default.connection.db;
                if (db) {
                    const baUser = await db.collection("user").findOne({ email: cleanEmail });
                    if (baUser) {
                        // Auto-sync into Mongoose User collection
                        user = await User_1.User.create({
                            name: baUser.name || "User",
                            email: cleanEmail,
                            password,
                            role: baUser.role || "student",
                            bio: baUser.bio || "",
                            phone: baUser.phone || "",
                        });
                    }
                }
            }
            catch { }
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// Get current profile
router.get("/me", auth_1.protect, async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});
exports.default = router;
