import express from "express";
import { registerUser, loginUser, getUsers, getUserProfile, updateUserProfile, getCurrentUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

const router = express.Router();


router.get("/", getUsers);
// POST /auth/register
router.post("/register", registerUser);

// POST /auth/login
router.post("/login", loginUser);

// GET /auth/me - Get current logged in user
router.get("/me", verifyToken, getCurrentUser);

// GET /auth/profile/:userId - Get user profile with their posts
router.get("/profile/:userId", getUserProfile);

// PUT /auth/profile/:userId - Update user profile (requires authentication)
router.put("/profile/:userId", verifyToken, upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
]), updateUserProfile);

export default router;
