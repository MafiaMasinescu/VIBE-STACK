# Calendar Integration - Implementation Summary

## Overview

Successfully integrated a personal calendar system for tracking working hours and events for each user in the VIBE-STACK application.

## What Was Implemented

### 1. Backend Components

#### **CalendarEvent Model** (`backend/src/models/CalendarEvent.js`)

- MongoDB schema to store calendar data per user
- Fields:
  - `userId`: Reference to the user (indexed)
  - `date`: Date string in format "YYYY-M-D" (indexed)
  - `workHours`: Object with `start` and `end` times (24-hour format)
  - `events`: Array of event objects with `name`, `description`, and `time`
- Unique compound index on `userId` and `date` to ensure one document per user per day

#### **Calendar Controller** (`backend/src/controllers/calendarController.js`)

Handles all calendar operations:

- `getCalendarEvents`: Fetch all calendar events (with optional date range filtering)
- `getCalendarEventByDate`: Get data for a specific date
- `saveWorkHours`: Save or update work hours for a date
- `addEvent`: Add an event to a specific date
- `deleteEvent`: Remove an event from a date
- `deleteCalendarDate`: Delete all data for a specific date

#### **Calendar Routes** (`backend/src/routes/calendarRoutes.js`)

RESTful API endpoints (all require authentication):

- `GET /api/calendar` - Get calendar events with optional date range
- `GET /api/calendar/:date` - Get specific date data
- `POST /api/calendar/work-hours` - Save work hours
- `POST /api/calendar/event` - Add event
- `DELETE /api/calendar/event` - Delete event
- `DELETE /api/calendar/:date` - Delete date

#### **Server Integration** (`backend/src/server.js`)

- Imported and registered calendar routes at `/api/calendar`

### 2. Frontend Components

#### **Updated Calendar Component** (`frontend/src/Components/Calendar.jsx`)

Enhanced with MongoDB integration:

- Accepts `userId` prop
- Fetches calendar data from API on mount and when month changes
- Auto-saves work hours and events to database
- Shows loading states
- Displays success/error alerts
- Maintains month and week view functionality
- Real-time data synchronization

#### **Updated Profile Page** (`frontend/src/Profile.jsx`)

- Imported Calendar component
- Added "Calendar" tab (only visible for the user's own profile)
- Tab positioned after "About" tab
- Passes userId to Calendar component
- Properly integrated with existing tab system

## Features

### Calendar Functionality

1. **Month View**: Grid layout showing all days with indicators for work hours and events
2. **Week View**: Hour-by-hour timeline showing scheduled events and work hours
3. **Work Hours Tracking**: Set start and end times for each day
4. **Event Management**:
   - Add events with name, description, and time
   - View all events for a day
   - Delete events
5. **Data Persistence**: All data stored in MongoDB and synced automatically
6. **User-Specific**: Each user has their own private calendar

### Security

- All calendar routes protected by authentication middleware
- Users can only access and modify their own calendar data
- Token-based authentication using JWT

## API Usage

### Save Work Hours

```javascript
POST /api/calendar/work-hours
Headers: { Authorization: "Bearer <token>" }
Body: {
  date: "2025-10-15",
  start: "09:00",
  end: "17:00"
}
```

### Add Event

```javascript
POST /api/calendar/event
Headers: { Authorization: "Bearer <token>" }
Body: {
  date: "2025-10-15",
  name: "Team Meeting",
  description: "Quarterly review",
  time: "14:30"
}
```

### Get Calendar Data

```javascript
GET /api/calendar?startDate=2025-10-1&endDate=2025-10-31
Headers: { Authorization: "Bearer <token>" }
```

## Database Structure

Each calendar entry in MongoDB:

```javascript
{
  userId: ObjectId("..."),
  date: "2025-10-15",
  workHours: {
    start: "09:00",
    end: "17:00"
  },
  events: [
    {
      name: "Team Meeting",
      description: "Quarterly review",
      time: "14:30"
    }
  ],
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

## Usage Instructions

1. **Navigate to Profile**: Go to your profile page
2. **Access Calendar**: Click on the "Calendar" tab (only visible on your own profile)
3. **Add Work Hours**:
   - Click on any day
   - Enter start and end times
   - Click "Save Work Hours"
4. **Add Events**:
   - Click on any day
   - Enter event name, time, and optional description
   - Click "Add Event"
5. **View Data**:
   - Switch between Month and Week views
   - Click days to see detailed information
6. **Delete Events**: Open a day modal and click "Delete" next to any event

## Benefits

- **Personal Time Tracking**: Each user can track their working hours
- **Event Planning**: Schedule and remember important events
- **Visual Overview**: Easy-to-read calendar interface
- **Persistent Data**: All data saved to database and accessible from anywhere
- **Professional Tool**: Useful for HR, developers, and designers to manage their time

## Technical Notes

- Calendar uses 24-hour time format internally (HH:MM)
- Dates stored as strings in "YYYY-M-D" format for easy querying
- Data automatically fetches when navigating between months
- Optimized with compound indexes for fast user-specific queries
- Frontend handles both local state and API synchronization
