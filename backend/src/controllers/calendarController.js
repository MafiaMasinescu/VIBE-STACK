import CalendarEventModel from "../models/CalendarEvent.js";

// Get calendar data for a specific user (public view)
export const getUserCalendarEvents = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    let query = { userId };

    // If date range is provided, filter by it
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const events = await CalendarEventModel.find(query).sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error("Error fetching user calendar events:", error);
    res.status(500).json({ message: "Error fetching user calendar events" });
  }
};

// Get calendar data for a specific date range
export const getCalendarEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    let query = { userId };

    // If date range is provided, filter by it
    if (startDate && endDate) {
      // This will work because our date format is YYYY-M-D
      query.date = { $gte: startDate, $lte: endDate };
    }

    const events = await CalendarEventModel.find(query).sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ message: "Error fetching calendar events" });
  }
};

// Get calendar data for a specific date
export const getCalendarEventByDate = async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.params;

    const event = await CalendarEventModel.findOne({ userId, date });

    if (!event) {
      return res.json({
        workHours: { start: null, end: null },
        events: [],
      });
    }

    res.json(event);
  } catch (error) {
    console.error("Error fetching calendar event:", error);
    res.status(500).json({ message: "Error fetching calendar event" });
  }
};

// Save or update work hours for a specific date
export const saveWorkHours = async (req, res) => {
  try {
    const userId = req.userId;
    const { date, start, end } = req.body;

    if (!date || !start || !end) {
      return res
        .status(400)
        .json({ message: "Date, start time, and end time are required" });
    }

    if (start >= end) {
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    }

    const event = await CalendarEventModel.findOneAndUpdate(
      { userId, date },
      {
        $set: {
          "workHours.start": start,
          "workHours.end": end,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json(event);
  } catch (error) {
    console.error("Error saving work hours:", error);
    res.status(500).json({ message: "Error saving work hours" });
  }
};

// Add an event to a specific date
export const addEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const { date, name, description, time } = req.body;

    if (!date || !name || !time) {
      return res
        .status(400)
        .json({ message: "Date, event name, and time are required" });
    }

    const event = await CalendarEventModel.findOneAndUpdate(
      { userId, date },
      {
        $push: {
          events: { name, description: description || "", time },
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json(event);
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ message: "Error adding event" });
  }
};

// Delete an event from a specific date
export const deleteEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const { date, eventId } = req.body;

    if (!date || eventId === undefined) {
      return res
        .status(400)
        .json({ message: "Date and event index are required" });
    }

    const calendarEvent = await CalendarEventModel.findOne({ userId, date });

    if (!calendarEvent) {
      return res.status(404).json({ message: "Calendar event not found" });
    }

    // Remove the event at the specified index
    calendarEvent.events.splice(eventId, 1);
    await calendarEvent.save();

    res.json(calendarEvent);
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event" });
  }
};

// Delete all data for a specific date
export const deleteCalendarDate = async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.params;

    await CalendarEventModel.findOneAndDelete({ userId, date });

    res.json({ message: "Calendar date deleted successfully" });
  } catch (error) {
    console.error("Error deleting calendar date:", error);
    res.status(500).json({ message: "Error deleting calendar date" });
  }
};
