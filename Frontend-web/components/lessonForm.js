"use client";

import React, { useEffect, useState } from "react";

const LessonForm = ({ lessonId }) => {
  const [lesson, setLesson] = useState({
    subject: "",
    teacher: "",
    class: "",
    startTime: "",
    endTime: "",
    room: "",
    day: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [subjectsRes, teachersRes, classesRes] = await Promise.all([
        fetch("http://localhost:5000/api/subjects", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/employees?role=Teacher", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/classes", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [subjectsData, teachersData, classesData] = await Promise.all([
        subjectsRes.json(),
        teachersRes.json(),
        classesRes.json(),
      ]);

      setSubjects(subjectsData);
      setTeachers(teachersData);
      setClasses(classesData);

      if (lessonId) {
        const res = await fetch(
          `http://localhost:5000/api/lessons/${lessonId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const lessonData = await res.json();
        setLesson({
          subject: lessonData.subject._id,
          teacher: lessonData.teacher._id,
          class: lessonData.class._id,
          startTime: new Date(lessonData.startTime).toISOString().slice(0, 16),
          endTime: new Date(lessonData.endTime).toISOString().slice(0, 16),
          room: lessonData.room,
          day: lessonData.day,
        });
        setIsEditMode(true);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  fetchInitialData();
}, [lessonId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      subject: lesson.subject,
      teacher: lesson.teacher,
      class: lesson.class,
      startTime: new Date(lesson.startTime),
      endTime: new Date(lesson.endTime),
      room: lesson.room,
      day: lesson.day,
    };

    try {
      const response = await fetch(
        `/api/lessons${isEditMode ? `/${lessonId}` : ""}`,
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log(data);
      // After successful submission, maybe redirect or show a success message.
    } catch (error) {
      console.error("Error saving lesson:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700">
        {isEditMode ? "Edit Lesson" : "Create Lesson"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="subject"
            className="font-medium text-lg text-gray-700"
          >
            Subject:
          </label>
          <select
            id="subject"
            value={lesson.subject}
            onChange={(e) => setLesson({ ...lesson, subject: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {subjects.length > 0 &&
              subjects?.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="teacher"
            className="font-medium text-lg text-gray-700"
          >
            Teacher:
          </label>
          <select
            id="teacher"
            value={lesson.teacher}
            onChange={(e) => setLesson({ ...lesson, teacher: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {teachers.length > 0 &&
              teachers?.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="class" className="font-medium text-lg text-gray-700">
            Class:
          </label>
          <select
            id="class"
            value={lesson.class}
            onChange={(e) => setLesson({ ...lesson, class: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {classes.length > 0 &&
              classes.map((classItem) => (
                <option key={classItem._id} value={classItem._id}>
                  {classItem.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="startTime"
            className="font-medium text-lg text-gray-700"
          >
            Start Time:
          </label>
          <input
            type="datetime-local"
            id="startTime"
            value={lesson.startTime}
            onChange={(e) =>
              setLesson({ ...lesson, startTime: e.target.value })
            }
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="endTime"
            className="font-medium text-lg text-gray-700"
          >
            End Time:
          </label>
          <input
            type="datetime-local"
            id="endTime"
            value={lesson.endTime}
            onChange={(e) => setLesson({ ...lesson, endTime: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="room" className="font-medium text-lg text-gray-700">
            Room:
          </label>
          <input
            type="text"
            id="room"
            value={lesson.room}
            onChange={(e) => setLesson({ ...lesson, room: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="day" className="font-medium text-lg text-gray-700">
            Day:
          </label>
          <select
            id="day"
            value={lesson.day}
            onChange={(e) => setLesson({ ...lesson, day: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 mt-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        >
          {isEditMode ? "Update Lesson" : "Create Lesson"}
        </button>
      </form>
    </div>
  );
};

export default LessonForm;
