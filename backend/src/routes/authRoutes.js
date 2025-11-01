import express from "express";
import { registerUser, loginUser, getUsers } from "../controllers/authController.js";

const router = express.Router();


router.get("/", getUsers);
// POST /auth/register
router.post("/register", registerUser);

// POST /auth/login
router.post("/login", loginUser);

export default router;
