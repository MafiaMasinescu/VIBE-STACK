import express from "express";
import {
  sendInvitation,
  getUserInvitations,
  acceptInvitation,
  declineInvitation,
  getEventAttendees,
} from "../controllers/invitationController.js";
import { verifyToken } from "../controllers/postController.js";

const router = express.Router();

// Send invitation to coworker
router.post("/send", verifyToken, sendInvitation);

// Get user's pending invitations
router.get("/", verifyToken, getUserInvitations);

// Accept invitation
router.post("/accept", verifyToken, acceptInvitation);

// Decline invitation
router.post("/decline", verifyToken, declineInvitation);

// Get event attendees
router.get("/attendees", verifyToken, getEventAttendees);

export default router;
