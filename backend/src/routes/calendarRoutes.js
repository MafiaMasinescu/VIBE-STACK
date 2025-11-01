import express from "express";
import {
  getCalendarEvents,
  getCalendarEventByDate,
  saveWorkHours,
  addEvent,
  deleteEvent,
  deleteCalendarDate,
  getUserCalendarEvents,
} from "../controllers/calendarController.js";
import { verifyToken } from "../controllers/postController.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get calendar events for a specific user (for viewing other users' calendars)
router.get("/user/:userId", getUserCalendarEvents);

// Get all calendar events (optionally filtered by date range) for the logged-in user
router.get("/", getCalendarEvents);

// Get calendar event for a specific date
router.get("/:date", getCalendarEventByDate);

// Save or update work hours
router.post("/work-hours", saveWorkHours);

// Add an event
router.post("/event", addEvent);

// Delete an event
router.delete("/event", deleteEvent);

// Delete all data for a specific date
router.delete("/:date", deleteCalendarDate);

export default router;
