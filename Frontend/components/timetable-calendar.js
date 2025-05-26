'use client';

import { Calendar, Views } from 'react-big-calendar';
import { useState, useEffect } from 'react';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { dateFnsLocalizer } from 'react-big-calendar';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const CalendarComponent = ({ teacherId }) => {
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const handleTodayClick = () => {
    setDate(new Date());
    setView(Views.WEEK);
  };

  const fetchTimetable = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/timetable/teacher/${teacherId}`);
      const timetableData = response.data.data;

      const dayMap = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
      };

      const events = timetableData.map(entry => {
        const today = new Date();
        const currentWeekDay = today.getDay(); // Sunday = 0

        const targetDay = dayMap[entry.day];
        const offset = ((targetDay + 7 - (currentWeekDay || 7)) % 7); // Adjust for Sunday = 0
        const eventDate = new Date(today);
        eventDate.setDate(today.getDate() + offset);

        const [startHour, startMinute] = entry.startTime.split(':').map(Number);
        const [endHour, endMinute] = entry.endTime.split(':').map(Number);

        const start = new Date(eventDate);
        start.setHours(startHour, startMinute, 0);

        const end = new Date(eventDate);
        end.setHours(endHour, endMinute, 0);

        return {
          title: `${entry.subject.name} (${entry.class.name}-${entry.section})`,
          start,
          end,
        };
      });

      setEvents(events);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchTimetable();
    }
  }, [teacherId]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold">Teacher Schedule</h3>
        <button
          onClick={handleTodayClick}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Today
        </button>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        views={['month', 'week', 'day', 'agenda']}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        className="!bg-white"
        eventPropGetter={() => ({
          style: {
            backgroundColor: '#2563eb',
            borderRadius: '5px',
            color: 'white',
            border: 'none',
            padding: '4px',
          },
        })}
      />
    </div>
  );
};

export default CalendarComponent;
