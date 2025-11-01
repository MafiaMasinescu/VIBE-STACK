import CalendarInvitation from "../models/CalendarInvitation.js";
import CalendarEventModel from "../models/CalendarEvent.js";
import User from "../models/User.js";

// Send event invitation
export const sendInvitation = async (req, res) => {
  try {
    const {
      recipientId,
      eventDate,
      eventName,
      eventDescription,
      eventTime,
      eventId,
    } = req.body;
    const senderId = req.userId;

    // Get sender details
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    // Check if invitation already exists
    const existingInvitation = await CalendarInvitation.findOne({
      eventId,
      eventDate,
      senderId,
      recipientId,
      status: "pending",
    });

    if (existingInvitation) {
      return res.status(400).json({ error: "Invitation already sent" });
    }

    // Create invitation
    const invitation = new CalendarInvitation({
      eventId,
      eventDate,
      eventName,
      eventDescription,
      eventTime,
      senderId,
      senderName: sender.name,
      recipientId,
      status: "pending",
    });

    await invitation.save();

    res.status(201).json({
      message: "Invitation sent successfully",
      invitation,
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    res.status(500).json({ error: "Failed to send invitation" });
  }
};

// Get user's pending invitations
export const getUserInvitations = async (req, res) => {
  try {
    const userId = req.userId;

    const invitations = await CalendarInvitation.find({
      recipientId: userId,
      status: "pending",
    }).sort({ createdAt: -1 });

    res.json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res.status(500).json({ error: "Failed to fetch invitations" });
  }
};

// Accept invitation
export const acceptInvitation = async (req, res) => {
  try {
    const { invitationId } = req.body;
    const userId = req.userId;

    const invitation = await CalendarInvitation.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    if (invitation.recipientId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({ error: "Invitation already processed" });
    }

    // Update invitation status
    invitation.status = "accepted";
    await invitation.save();

    // Get user details
    const user = await User.findById(userId);

    // Add event to recipient's calendar
    const calendarEvent = await CalendarEventModel.findOneAndUpdate(
      {
        userId: userId,
        date: invitation.eventDate,
      },
      {
        $push: {
          events: {
            name: invitation.eventName,
            description: invitation.eventDescription,
            time: invitation.eventTime,
            attendees: [
              {
                userId: invitation.senderId,
                name: invitation.senderName,
                status: "accepted",
              },
              {
                userId: userId,
                name: user.name,
                status: "accepted",
              },
            ],
            createdBy: invitation.senderId,
          },
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    // Update the original event with the new attendee
    await CalendarEventModel.findOneAndUpdate(
      {
        userId: invitation.senderId,
        date: invitation.eventDate,
        "events._id": invitation.eventId,
      },
      {
        $push: {
          "events.$.attendees": {
            userId: userId,
            name: user.name,
            status: "accepted",
          },
        },
      }
    );

    res.json({
      message: "Invitation accepted",
      invitation,
      calendarEvent,
    });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({ error: "Failed to accept invitation" });
  }
};

// Decline invitation
export const declineInvitation = async (req, res) => {
  try {
    const { invitationId } = req.body;
    const userId = req.userId;

    const invitation = await CalendarInvitation.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    if (invitation.recipientId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({ error: "Invitation already processed" });
    }

    // Update invitation status
    invitation.status = "declined";
    await invitation.save();

    res.json({
      message: "Invitation declined",
      invitation,
    });
  } catch (error) {
    console.error("Error declining invitation:", error);
    res.status(500).json({ error: "Failed to decline invitation" });
  }
};

// Get event attendees
export const getEventAttendees = async (req, res) => {
  try {
    const { date, eventId } = req.query;
    const userId = req.userId;

    const calendarEvent = await CalendarEventModel.findOne({
      userId: userId,
      date: date,
    });

    if (!calendarEvent) {
      return res.status(404).json({ error: "Calendar event not found" });
    }

    const event = calendarEvent.events.id(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({
      attendees: event.attendees || [],
      totalAttendees: event.attendees ? event.attendees.length : 0,
    });
  } catch (error) {
    console.error("Error fetching attendees:", error);
    res.status(500).json({ error: "Failed to fetch attendees" });
  }
};
