'use client';

import React, { useEffect, useState } from 'react';
// import { FaTrashAlt } from 'react-icons/fa';

const LessonList = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/lessons');
        const data = await response.json();
        setLessons(data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/lessons/${id}`, { method: 'DELETE' });
      setLessons(lessons.filter(lesson => lesson._id !== id));
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  };

  if (loading) return <div className="text-center text-lg text-gray-500">Loading lessons...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50">
      <h2 className="text-4xl font-semibold mb-8 text-center text-gray-800">Lessons Schedule</h2>
      
      {lessons.length > 0 ? (
        <div className="space-y-6">
          {lessons.map(lesson => (
            <div key={lesson._id} className="bg-white shadow-xl rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-800">{lesson.subject.name}</h3>
                <p className="text-lg text-gray-600">Teacher: {lesson.teacher.firstName} {lesson.teacher.lastName}</p>
                <p className="text-sm text-gray-500">{new Date(lesson.startTime).toLocaleString()} - {new Date(lesson.endTime).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Room: {lesson.room}</p>
                <p className="text-sm text-gray-500">Day: {lesson.day}</p>
              </div>

              <button 
                onClick={() => handleDelete(lesson._id)} 
                className="bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition duration-200 transform hover:scale-105"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-lg text-gray-500">No lessons found</div>
      )}
    </div>
  );
};

export default LessonList;
