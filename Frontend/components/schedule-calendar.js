import { Calendar, Views } from 'react-big-calendar';
import { useState } from 'react';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { dateFnsLocalizer } from 'react-big-calendar';
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

const CalendarComponent = ({ events }) => {
  const [view, setView] = useState(Views.WEEK); 
  const [date, setDate] = useState(new Date());

  const handleTodayClick = () => {
    setDate(new Date());
    setView(Views.WEEK);
  };

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
        eventPropGetter={(event) => ({
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
