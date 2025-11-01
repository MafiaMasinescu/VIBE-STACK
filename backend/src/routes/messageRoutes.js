import express from "express";
import { sendMessage, getConversation, markAsRead, getConversations } from "../controllers/messageController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.post("/send", verifyToken, sendMessage);
router.get("/conversation/:userId", verifyToken, getConversation);
router.put("/read/:userId", verifyToken, markAsRead);
router.get("/conversations", verifyToken, getConversations);

export default router;
