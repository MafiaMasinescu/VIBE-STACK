import mongoose from "mongoose";

const CalendarEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    date: {
      type: String, // Format: "YYYY-M-D"
      required: true,
      index: true,
    },
    workHours: {
      start: {
        type: String, // Format: "HH:MM" (24-hour)
        default: null,
      },
      end: {
        type: String, // Format: "HH:MM" (24-hour)
        default: null,
      },
    },
    events: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
        time: {
          type: String, // Format: "HH:MM" (24-hour)
          required: true,
        },
        attendees: [
          {
            userId: {
              type: String,
              ref: "User",
            },
            name: {
              type: String,
            },
            status: {
              type: String,
              enum: ["pending", "accepted", "declined"],
              default: "accepted",
            },
          },
        ],
        createdBy: {
          type: String,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

// Compound index to ensure one document per user per date
CalendarEventSchema.index({ userId: 1, date: 1 }, { unique: true });

const CalendarEventModel = mongoose.model(
  "calendarEvents",
  CalendarEventSchema
);

export default CalendarEventModel;
