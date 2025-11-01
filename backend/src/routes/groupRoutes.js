import express from "express";
import {
    createGroup,
    getUserGroups,
    getGroup,
    addMembers,
    removeMember,
    deleteGroup,
    sendGroupMessage,
    getGroupMessages
} from "../controllers/groupController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.post("/create", verifyToken, createGroup);
router.get("/", verifyToken, getUserGroups);
router.get("/:groupId", verifyToken, getGroup);
router.put("/:groupId/members", verifyToken, addMembers);
router.delete("/:groupId/members/:memberId", verifyToken, removeMember);
router.delete("/:groupId", verifyToken, deleteGroup);
router.post("/:groupId/messages", verifyToken, sendGroupMessage);
router.get("/:groupId/messages", verifyToken, getGroupMessages);

export default router;
