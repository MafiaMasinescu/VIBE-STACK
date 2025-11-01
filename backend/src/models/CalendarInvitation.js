import mongoose from "mongoose";

const calendarInvitationSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
    },
    eventDate: {
      type: String, // Format: YYYY-M-D
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    eventDescription: {
      type: String,
      default: "",
    },
    eventTime: {
      type: String,
      default: "",
    },
    senderId: {
      type: String,
      required: true,
      ref: "User",
    },
    senderName: {
      type: String,
      required: true,
    },
    recipientId: {
      type: String,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const CalendarInvitation = mongoose.model(
  "CalendarInvitation",
  calendarInvitationSchema
);

export default CalendarInvitation;
