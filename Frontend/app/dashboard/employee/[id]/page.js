"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const locales = { "en-US": require("date-fns/locale/en-US") };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TeacherDetails = () => {
  const params = useParams();
  const id = params.id;

  const [teacher, setTeacher] = useState(null);
  const [events, setEvents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState({});

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const [tRes, sRes, subRes] = await Promise.all([
          fetch(`http://localhost:5000/api/employees/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/employees/schedule/${id}`, {
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

        const formattedEvents = scheduleData?.length
          ? scheduleData.map((event) => ({
              ...event,
              start: new Date(event.start),
              end: new Date(event.end),
            }))
          : [];

        setTeacher(teacherData);
        setEditedTeacher(teacherData);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedTeacher),
      });

      if (!res.ok) throw new Error("Failed to update teacher");

      const updated = await res.json();
      setTeacher(updated);
      setEditedTeacher(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    }
  };

  if (loading) return <div className="p-4 text-center text-lg">Loading...</div>;

  if (!teacher)
    return (
      <div className="p-4 text-center text-red-500">No teacher data found</div>
    );

  const teacherSubjects = teacher.subjects.map((subjectId) => {
    const subject = subjects.find((sub) => sub._id === subjectId);
    return subject ? subject.name : "Unknown Subject";
  });

  const renderField = (label, name, type = "text") => (
    <p>
      <span className="font-semibold">{label}:</span>{" "}
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={editedTeacher[name] || ""}
          onChange={handleInputChange}
          className="border px-2 py-1 rounded ml-2 w-full max-w-xs"
        />
      ) : (
        teacher[name] || "N/A"
      )}
    </p>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Left Side: Info */}
      <div className="bg-white p-6 rounded-2xl shadow col-span-1">
        <h2 className="text-2xl font-bold mb-4">
          {teacher.firstName} {teacher.lastName}
        </h2>
        <div className="space-y-2 text-gray-700">
          {renderField("Role", "role")}
          {renderField("Email", "email")}
          {renderField("Phone", "phone")}
          {renderField("Address", "address")}
          {renderField("Gender", "gender")}
          {renderField("Birth Date", "birthDate", "date")}
          {renderField("Date of Joining", "dateOfJoining", "date")}
          {renderField("Monthly Salary", "monthlySalary", "number")}
          {renderField("Father/Husband's Name", "fatherOrHusbandName")}
          {renderField("Experience", "experience")}
          {renderField("Religion", "religion")}
          {renderField("Education", "education")}
          {renderField("Employee ID", "employeeId")}

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Subjects:</h3>
            {isEditing ? (
              <select
                multiple
                name="subjects"
                value={editedTeacher.subjects}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(
                    (o) => o.value
                  );
                  setEditedTeacher((prev) => ({ ...prev, subjects: selected }));
                }}
                className="w-full border p-2 rounded"
              >
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            ) : teacherSubjects.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {teacherSubjects.map((name, index) => (
                  <li
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No subjects assigned</p>
            )}
          </div>

          {teacher.photoUrl && (
            <div className="mt-4">
              <h3 className="font-semibold">Photo:</h3>
              <img
                src={teacher.photoUrl}
                alt="Teacher"
                className="w-32 h-32 object-cover rounded-full border"
              />
            </div>
          )}

          <div className="mt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditedTeacher(teacher);
                    setIsEditing(false);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
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
