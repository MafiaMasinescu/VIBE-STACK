import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Calendar.css";

const Calendar = ({ userId, isOwner = false }) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentWeekStart, setCurrentWeekStart] = useState(null);
  const [viewMode, setViewMode] = useState("month");
  const [dayData, setDayData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Invitation states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedEventForInvite, setSelectedEventForInvite] = useState(null);
  const [coworkers, setCoworkers] = useState([]);
  const [selectedCoworker, setSelectedCoworker] = useState("");

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Fetch calendar data when component mounts or when month/year changes
  useEffect(() => {
    if (token) {
      fetchCalendarData();
    }
  }, [currentMonth, currentYear, token]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      // Fetch data for the current month
      const firstDay = `${currentYear}-${currentMonth}-1`;
      const lastDay = `${currentYear}-${currentMonth}-${getDaysInMonth(
        currentMonth,
        currentYear
      )}`;

      console.log("Fetching calendar data:", {
        firstDay,
        lastDay,
        currentMonth,
        currentYear,
        userId,
        isOwner,
      });

      // Use different endpoint based on whether viewing own or other user's calendar
      const endpoint = isOwner
        ? `http://localhost:5001/api/calendar?startDate=${firstDay}&endDate=${lastDay}`
        : `http://localhost:5001/api/calendar/user/${userId}?startDate=${firstDay}&endDate=${lastDay}`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Calendar data received:", response.data);

      // Convert array of events to object keyed by date
      const dataByDate = {};
      response.data.forEach((item) => {
        dataByDate[item.date] = {
          workHours: item.workHours || { start: "", end: "" },
          events: item.events || [],
        };
      });

      console.log("Processed data by date:", dataByDate);

      setDayData((prevData) => ({
        ...prevData, // Keep data from other months
        ...dataByDate, // Update current month data
      }));
    } catch (err) {
      console.error("Error fetching calendar data:", err);
    } finally {
      setLoading(false);
    }
  };

  const convertTo12Hour = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);

    // Use 24-hour format for midnight and noon
    if (hour === 0) return `00:${minutes}`;
    if (hour === 12) return `12:${minutes}`;

    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatTimeForDisplay = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    return `${hours}:${minutes}`;
  };

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const getDayKey = (day, month, year) => `${year}-${month}-${day}`;

  const getDayData = (day, month, year) => {
    const key = getDayKey(day, month, year);
    return dayData[key] || { workHours: { start: "", end: "" }, events: [] };
  };

  const handleDayClick = (day, month, year) => {
    setSelectedDay(day);
    setSelectedMonth(month);
    setSelectedYear(year);
    const data = getDayData(day, month, year);
    setStartTime(data.workHours.start || "");
    setEndTime(data.workHours.end || "");
    setError("");
    setSuccessMessage("");
    setShowModal(true);
  };

  const handleSaveWorkHours = async () => {
    if (!startTime || !endTime) {
      setError("Both start time and end time are required");
      setSuccessMessage("");
      return;
    }
    if (startTime >= endTime) {
      setError("End time must be after start time");
      setSuccessMessage("");
      return;
    }

    try {
      setSaving(true);
      const date = getDayKey(selectedDay, selectedMonth, selectedYear);
      console.log("Saving work hours for date:", date, {
        selectedDay,
        selectedMonth,
        selectedYear,
        startTime,
        endTime,
      });

      const response = await axios.post(
        "http://localhost:5001/api/calendar/work-hours",
        { date, start: startTime, end: endTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Work hours saved, response:", response.data);

      // Update local state
      setDayData((prev) => ({
        ...prev,
        [date]: {
          workHours: { start: startTime, end: endTime },
          events: prev[date]?.events || [],
        },
      }));
      setError("");
      setSuccessMessage("Work hours saved successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving work hours:", err);
      setError(err.response?.data?.message || "Failed to save work hours");
      setSuccessMessage("");
    } finally {
      setSaving(false);
    }
  };

  const handleAddEvent = async () => {
    if (!eventName) {
      setError("Event name is required");
      setSuccessMessage("");
      return;
    }
    if (!eventTime) {
      setError("Event time is required");
      setSuccessMessage("");
      return;
    }

    try {
      setSaving(true);
      const date = getDayKey(selectedDay, selectedMonth, selectedYear);
      const response = await axios.post(
        "http://localhost:5001/api/calendar/event",
        {
          date,
          name: eventName,
          description: eventDescription,
          time: eventTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setDayData((prev) => ({
        ...prev,
        [date]: {
          workHours: prev[date]?.workHours || { start: "", end: "" },
          events: [
            ...(prev[date]?.events || []),
            { name: eventName, description: eventDescription, time: eventTime },
          ],
        },
      }));
      setEventName("");
      setEventDescription("");
      setEventTime("");
      setError("");
      setSuccessMessage("Event added successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error adding event:", err);
      setError(err.response?.data?.message || "Failed to add event");
      setSuccessMessage("");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (index) => {
    try {
      setSaving(true);
      const date = getDayKey(selectedDay, selectedMonth, selectedYear);
      await axios.delete("http://localhost:5001/api/calendar/event", {
        data: { date, eventId: index },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      setDayData((prev) => ({
        ...prev,
        [date]: {
          ...prev[date],
          events: prev[date].events.filter((_, i) => i !== index),
        },
      }));
      setSuccessMessage("Event deleted successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete event");
    } finally {
      setSaving(false);
    }
  };

  // Fetch coworkers for invitation
  const fetchCoworkers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/auth/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCoworkers(response.data);
    } catch (err) {
      console.error("Error fetching coworkers:", err);
    }
  };

  // Open invite modal
  const openInviteModal = (eventData, eventIndex) => {
    setSelectedEventForInvite({
      ...eventData,
      eventId: eventIndex,
      date: getDayKey(selectedDay, selectedMonth, selectedYear),
    });
    fetchCoworkers();
    setShowInviteModal(true);
  };

  // Send invitation
  const sendInvitation = async () => {
    if (!selectedCoworker) {
      setError("Please select a coworker to invite");
      return;
    }

    try {
      setSaving(true);
      await axios.post(
        "http://localhost:5001/api/invitations/send",
        {
          recipientId: selectedCoworker,
          eventDate: selectedEventForInvite.date,
          eventName: selectedEventForInvite.name,
          eventDescription: selectedEventForInvite.description || "",
          eventTime: selectedEventForInvite.time,
          eventId: selectedEventForInvite.eventId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Invitation sent successfully!");
      setShowInviteModal(false);
      setSelectedCoworker("");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error sending invitation:", err);
      setError(err.response?.data?.error || "Failed to send invitation");
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDay(null);
    setSelectedMonth(null);
    setSelectedYear(null);
    setStartTime("");
    setEndTime("");
    setEventName("");
    setEventDescription("");
    setEventTime("");
    setError("");
    setSuccessMessage("");
  };

  const hasData = (day, month, year) => {
    const data = getDayData(day, month, year);
    return data.workHours.start || data.workHours.end || data.events.length > 0;
  };

  const getWorkHours = (day, month, year) => {
    const data = getDayData(day, month, year);
    if (data.workHours.start && data.workHours.end) {
      return `${convertTo12Hour(data.workHours.start)} - ${convertTo12Hour(
        data.workHours.end
      )}`;
    }
    return null;
  };

  const getEventCount = (day, month, year) =>
    getDayData(day, month, year).events.length;

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const workHours = getWorkHours(day, currentMonth, currentYear);
      const eventCount = getEventCount(day, currentMonth, currentYear);

      days.push(
        <div
          key={day}
          className={`calendar-day ${
            hasData(day, currentMonth, currentYear) ? "work-day" : ""
          }`}
          onClick={() => handleDayClick(day, currentMonth, currentYear)}
        >
          <span className="day-number">{day}</span>
          {workHours && <div className="work-hours-display">{workHours}</div>}
          {eventCount > 0 && (
            <div className="event-count">
              {eventCount} event{eventCount > 1 ? "s" : ""}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const renderWeekView = () => {
    const weekStart =
      currentWeekStart || getWeekStart(new Date(currentYear, currentMonth, 1));
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        dayOfWeek: daysOfWeek[i],
        data: getDayData(date.getDate(), date.getMonth(), date.getFullYear()),
      };
    });

    return (
      <div className="week-grid">
        <div className="week-header-row">
          <div className="week-time-header">Time</div>
          {weekDays.map((dayInfo, idx) => (
            <div key={idx} className="week-day-header">
              <div className="week-day-name">{dayInfo.dayOfWeek}</div>
              <div className="week-day-date">{dayInfo.day}</div>
            </div>
          ))}
        </div>

        {hours.map((hour) => {
          const hourStr = hour.toString().padStart(2, "0");

          return (
            <div key={hour} className="week-hour-row">
              <div className="week-hour-label">
                {convertTo12Hour(`${hourStr}:00`)}
              </div>
              {weekDays.map((dayInfo, idx) => {
                const hourEvents = dayInfo.data.events.filter(
                  (e) => e.time && e.time.startsWith(hourStr)
                );
                const isWorkHour =
                  dayInfo.data.workHours.start &&
                  dayInfo.data.workHours.end &&
                  hourStr >= dayInfo.data.workHours.start.split(":")[0] &&
                  hourStr < dayInfo.data.workHours.end.split(":")[0];

                return (
                  <div
                    key={idx}
                    className={`week-hour-cell ${
                      isWorkHour ? "work-hour" : ""
                    }`}
                    onClick={() =>
                      handleDayClick(dayInfo.day, dayInfo.month, dayInfo.year)
                    }
                  >
                    {hourEvents.map((event, eventIdx) => (
                      <div key={eventIdx} className="week-event-item">
                        <div className="week-event-name">{event.name}</div>
                        {event.description && (
                          <div className="week-event-description">
                            {event.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const navigatePeriod = (direction) => {
    if (viewMode === "month") {
      if (direction === "prev") {
        if (currentMonth === 0) {
          setCurrentMonth(11);
          setCurrentYear(currentYear - 1);
        } else {
          setCurrentMonth(currentMonth - 1);
        }
      } else {
        if (currentMonth === 11) {
          setCurrentMonth(0);
          setCurrentYear(currentYear + 1);
        } else {
          setCurrentMonth(currentMonth + 1);
        }
      }
    } else {
      const weekStart =
        currentWeekStart ||
        getWeekStart(new Date(currentYear, currentMonth, 1));
      const newWeekStart = new Date(weekStart);
      newWeekStart.setDate(
        weekStart.getDate() + (direction === "prev" ? -7 : 7)
      );
      setCurrentWeekStart(newWeekStart);
      setCurrentMonth(newWeekStart.getMonth());
      setCurrentYear(newWeekStart.getFullYear());
    }
  };

  const getHeaderTitle = () => {
    if (viewMode === "month") {
      return `${months[currentMonth]} / ${currentYear}`;
    }
    const weekStart =
      currentWeekStart || getWeekStart(new Date(currentYear, currentMonth, 1));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return `${months[weekStart.getMonth()]} ${weekStart.getDate()} - ${
      months[weekEnd.getMonth()]
    } ${weekEnd.getDate()}, ${currentYear}`;
  };

  const getCurrentDayData = () => {
    if (!selectedDay) return { workHours: { start: "", end: "" }, events: [] };
    return getDayData(selectedDay, selectedMonth, selectedYear);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => navigatePeriod("prev")}>&lt;</button>
        <h1>{getHeaderTitle()}</h1>
        <button onClick={() => navigatePeriod("next")}>&gt;</button>
      </div>

      <div className="view-mode-selector">
        <button
          className={viewMode === "month" ? "active" : ""}
          onClick={() => setViewMode("month")}
        >
          Month
        </button>
        <button
          className={viewMode === "week" ? "active" : ""}
          onClick={() => {
            setViewMode("week");
            if (!currentWeekStart) {
              setCurrentWeekStart(
                getWeekStart(new Date(currentYear, currentMonth, 1))
              );
            }
          }}
        >
          Week
        </button>
      </div>

      <p className="calendar-instructions">
        {isOwner
          ? "Click on any day to add work hours and events"
          : "Click on any day to view work hours and events"}
      </p>

      {viewMode === "month" ? (
        <div className="calendar-wrapper">
          <div className="calendar-weekdays">
            {daysOfWeek.map((day) => (
              <div key={day} className="weekday-header">
                {day}
              </div>
            ))}
          </div>
          <div className="calendar-grid-month">{renderMonthView()}</div>
        </div>
      ) : (
        renderWeekView()
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {months[selectedMonth]} {selectedDay}, {selectedYear}
              </h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}

              {!isOwner && (
                <div className="view-only-notice">
                  <p>
                    📅 You are viewing{" "}
                    {getCurrentDayData().workHours.start ||
                    getCurrentDayData().events.length > 0
                      ? "this user's"
                      : "a"}{" "}
                    calendar in read-only mode
                  </p>
                </div>
              )}

              {isOwner && (
                <>
                  <div className="section">
                    <h3>Work Hours</h3>
                    <div className="time-inputs">
                      <div className="input-group">
                        <label>
                          Start Time: <span className="required">*</span>
                        </label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>
                          End Time: <span className="required">*</span>
                        </label>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      className="save-btn"
                      onClick={handleSaveWorkHours}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Work Hours"}
                    </button>
                  </div>

                  <div className="section">
                    <h3>Events</h3>
                    <div className="input-group">
                      <label>
                        Event Name: <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        placeholder="Enter event name"
                      />
                    </div>
                    <div className="input-group">
                      <label>
                        Event Time: <span className="required">*</span>
                      </label>
                      <input
                        type="time"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Description:</label>
                      <textarea
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        placeholder="Enter event description"
                        rows="3"
                      />
                    </div>
                    <button
                      className="add-btn"
                      onClick={handleAddEvent}
                      disabled={saving}
                    >
                      {saving ? "Adding..." : "Add Event"}
                    </button>
                  </div>
                </>
              )}

              <div className="section">
                <h3>Details</h3>
                {getCurrentDayData().workHours.start ? (
                  <div className="detail-item">
                    <strong>Work Hours:</strong>{" "}
                    {formatTimeForDisplay(getCurrentDayData().workHours.start)}{" "}
                    - {formatTimeForDisplay(getCurrentDayData().workHours.end)}
                  </div>
                ) : null}

                {getCurrentDayData().events.length > 0 ? (
                  <div className="events-list">
                    <strong>Events:</strong>
                    {getCurrentDayData().events.map((event, index) => (
                      <div key={index} className="event-item">
                        <div className="event-content">
                          <div className="event-name">
                            {event.name}
                            {event.time && (
                              <span className="event-time">
                                {" "}
                                @ {formatTimeForDisplay(event.time)}
                              </span>
                            )}
                            {event.attendees && event.attendees.length > 0 && (
                              <span className="attendee-count">
                                👥 {event.attendees.length} {event.attendees.length === 1 ? 'person' : 'people'} attending
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <div className="event-description">
                              {event.description}
                            </div>
                          )}
                          {event.attendees && event.attendees.length > 0 && (
                            <div className="attendees-list">
                              <strong>Attending:</strong>{" "}
                              {event.attendees.map((attendee, i) => (
                                <span key={i} className="attendee-name">
                                  {attendee.name}
                                  {i < event.attendees.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="event-actions">
                          {isOwner && (
                            <>
                              <button
                                className="invite-btn"
                                onClick={() => openInviteModal(event, index)}
                              >
                                Invite
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteEvent(index)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {!getCurrentDayData().workHours.start &&
                  getCurrentDayData().events.length === 0 && (
                    <p className="no-data">
                      No work hours or events added yet.
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Invite Coworker to Event</h2>
            {selectedEventForInvite && (
              <div className="invite-event-info">
                <p><strong>Event:</strong> {selectedEventForInvite.name}</p>
                <p><strong>Time:</strong> {formatTimeForDisplay(selectedEventForInvite.time)}</p>
                {selectedEventForInvite.description && (
                  <p><strong>Description:</strong> {selectedEventForInvite.description}</p>
                )}
              </div>
            )}
            
            <div className="form-group">
              <label>Select Coworker:</label>
              <select
                value={selectedCoworker}
                onChange={(e) => setSelectedCoworker(e.target.value)}
                className="coworker-select"
              >
                <option value="">-- Select a coworker --</option>
                {coworkers.map((coworker) => (
                  <option key={coworker._id} value={coworker._id}>
                    {coworker.name} {coworker.tag && `(${coworker.tag})`}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button
                onClick={sendInvitation}
                disabled={saving || !selectedCoworker}
                className="save-btn"
              >
                {saving ? "Sending..." : "Send Invitation"}
              </button>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setSelectedCoworker("");
                  setError("");
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
