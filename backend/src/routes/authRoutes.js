import express from "express";
import { registerUser, loginUser, getUsers, getUserProfile } from "../controllers/authController.js";

const router = express.Router();


router.get("/", getUsers);
// POST /auth/register
router.post("/register", registerUser);

// POST /auth/login
router.post("/login", loginUser);

// GET /auth/profile/:userId - Get user profile with their posts
router.get("/profile/:userId", getUserProfile);

export default router;
