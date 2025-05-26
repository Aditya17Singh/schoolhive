"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import CalendarComponent from "@/components/timetable-calendar";

export default function TeacherProfilePage() {
  const params = useParams();
  const teacherId = params?.teachersId;
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  const events = [
    {
      title: "Math - Grade 8B",
      start: new Date(2025, 4, 26, 9, 0), 
      end: new Date(2025, 4, 26, 9, 45),
    },
    {
      title: "Science - Grade 8B",
      start: new Date(2025, 4, 26, 10, 0),
      end: new Date(2025, 4, 26, 10, 45),
    },
  ];

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const index = parseInt(teacherId.replace(/^\D+/g, ""), 10) - 1;
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:5000/api/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const teachers = response.data.data || [];
        const teacherData = teachers[index];

        if (!teacherData) return notFound();

        setTeacher(teacherData);
      } catch (error) {
        console.error("Failed to fetch teacher:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [teacherId]);

  if (loading) {
    return <div className="p-8 text-lg text-gray-700">Loading teacher...</div>;
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-48 h-48 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
              <Image
                src="/"
                alt="Teacher Profile"
                width={192}
                height={192}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-md">
              Faculty
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {teacher?.fName} {teacher?.lName}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {teacher?.department || "Department"} • {teacher?.teacherId}
              </p>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <InfoCard label="Email" value={teacher?.email} isLink />
              <InfoCard label="Phone" value={teacher?.phone} />
              <InfoCard
                label="Blood Group"
                value={teacher?.bloodGroup || "N/A"}
              />
              <InfoCard
                label="Joined"
                value={
                  teacher?.joiningDate
                    ? new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(teacher.joiningDate))
                    : "N/A"
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-white p-8 rounded-2xl shadow-md mt-4">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Teacher Calendar
        </h2>
        <CalendarComponent teacherId={teacher._id} />
      </div>
    </div>
  );
}

function InfoCard({ label, value, isLink }) {
  return (
    <div className="group flex items-start gap-4 p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-all border border-gray-100">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {isLink ? (
          <a
            href={`mailto:${value}`}
            className="mt-1 block text-sm font-semibold text-blue-600 hover:text-blue-800 truncate transition-colors"
          >
            {value}
          </a>
        ) : (
          <p className="mt-1 text-sm font-semibold text-gray-900 truncate">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
