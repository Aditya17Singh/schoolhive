"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // <-- import useParams

const locales = { "en-US": require("date-fns/locale/en-US") };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TeacherDetails = () => {
  const params = useParams(); // <-- get URL params
  const id = params.id; // <-- get id from params

  const [teacher, setTeacher] = useState(null);
  const [events, setEvents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // wait for id

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const [tRes, sRes, subRes] = await Promise.all([
          fetch(`http://localhost:5000/api/teachers/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/teachers/schedule/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/subjects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!tRes.ok || !sRes.ok || !subRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const teacherData = await tRes.json();
        const scheduleData = await sRes.json();
        const subjectsData = await subRes.json();

        const formattedEvents = scheduleData?.length > 0
          ? scheduleData.map(event => ({
              ...event,
              start: event.start ? new Date(event.start) : new Date(),
              end: event.end ? new Date(event.end) : new Date(),
            }))
          : [];

        setTeacher(teacherData);
        setEvents(formattedEvents);
        setSubjects(subjectsData);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-4 text-center text-lg">Loading...</div>;
  }

  if (!teacher) {
    return <div className="p-4 text-center text-red-500">No teacher data found</div>;
  }

  const teacherSubjects = teacher.subjects.map(subjectId => {
    const subject = subjects.find(sub => sub._id === subjectId);
    return subject ? subject.name : "Unknown Subject";
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Left Side: Teacher Info */}
      <div className="bg-white p-6 rounded-2xl shadow col-span-1">
        <h2 className="text-2xl font-bold mb-4">
          {teacher.firstName} {teacher.lastName}
        </h2>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Email:</span> {teacher.email}</p>
          <p><span className="font-semibold">Phone:</span> {teacher.phone}</p>
          <p><span className="font-semibold">Address:</span> {teacher.address}</p>
          <p><span className="font-semibold">Gender:</span> {teacher.gender}</p>
          <p><span className="font-semibold">Blood Type:</span> {teacher.bloodType}</p>
          <p><span className="font-semibold">Birth Date:</span> {new Date(teacher.birthDate).toLocaleDateString()}</p>
          <p><span className="font-semibold">Employee ID:</span> {teacher.employeeId}</p>

          {/* Subjects */}
          <div>
            <h3 className="text-lg font-semibold mt-4 mb-2">Subjects:</h3>
            {teacherSubjects.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {teacherSubjects.map((name, index) => (
                  <li key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No subjects assigned</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Calendar */}
      <div className="bg-white p-4 rounded-2xl shadow col-span-2">
        <h2 className="text-2xl font-bold mb-4">Schedule</h2>
        {events.length > 0 ? (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            views={["week", "day"]}
          />
        ) : (
          <p className="text-center text-gray-500">No schedule available.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherDetails;
