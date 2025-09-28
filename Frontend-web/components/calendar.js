"use client";

import { useState, useEffect } from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  format as formatDateFns,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const CalendarSchedule = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "event",
    start: "",
    end: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/schedule/${user.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const events = res.data.data.map((e) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end),
      }));
      setEvents(events);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  const handleSelectSlot = ({ start }) => {
    const localStart = formatDateFns(start, "yyyy-MM-dd");
    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + 1);
    const localEnd = formatDateFns(endDate, "yyyy-MM-dd");

    setSelectedEvent(null); 
    setForm({
      title: "",
      description: "",
      type: "event",
      start: localStart,
      end: localEnd,
    });
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      type: event.type || "event",
      start: formatDateFns(event.start, "yyyy-MM-dd"),
      end: formatDateFns(event.end, "yyyy-MM-dd"),
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedEvent) {
        await axios.put(
          `http://localhost:5001/api/schedule/${selectedEvent._id}`,
          { ...form, orgId: user.id, createdBy: user.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:5001/api/schedule",
          { ...form, orgId: user.id, createdBy: user.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("Failed to save event:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    try {
      await axios.delete(
        `http://localhost:5001/api/schedule/${selectedEvent._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-4">
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
      />

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {selectedEvent ? "Update Schedule" : "Add Event"}
            </h2>
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <label className="block mb-1">Start</label>
            <input
              type="date"
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />

            <label className="block mb-1">End</label>
            <input
              type="date"
              value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />

            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="event">Event</option>
              <option value="holiday">Holiday</option>
              <option value="exam">Exam</option>
              <option value="others">Others</option>
            </select>
            <div className="flex justify-between items-center">
              {selectedEvent && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {selectedEvent ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarSchedule;
