"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import CalendarComponent from "@/components/teacher-calendar";
import API from "@/lib/api";

export default function TeacherProfilePage() {
  const params = useParams();
  const teacherId = params?.teachersId;
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) return;

    const fetchEvents = async () => {
      try {
        const res = await API.get(`/schedule/${user.id}`);
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

    fetchEvents();
  }, [teacher?._id]);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const index = parseInt(teacherId.replace(/^\D+/g, ""), 10) - 1;
        const response = await API.get("/teachers");
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
    return (
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Skeleton Profile Image */}
            <div className="relative">
              <div className="w-48 h-48 rounded-full bg-gray-200 animate-pulse ring-4 ring-white shadow-xl" />
            </div>

            {/* Skeleton Profile Details */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mx-auto md:mx-0" />
                <div className="h-4 w-36 bg-gray-100 rounded mt-2 animate-pulse mx-auto md:mx-0" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm animate-pulse"
                  >
                    <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                    <div className="h-5 w-full bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Calendar Section */}
        <div className="bg-white p-8 rounded-2xl shadow-md mt-4">
          <div className="h-6 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
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
        <CalendarComponent events={events} />
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
