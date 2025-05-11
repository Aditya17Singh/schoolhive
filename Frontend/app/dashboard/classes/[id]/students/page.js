"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function ClassStudentsPage() {
  const { id: classId } = useParams();
  const [students, setStudents] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchClassInfo = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/classes/${classId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClassInfo(res.data);
    } catch (error) {
      console.error("Error fetching class info:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/classes/${classId}/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchClassInfo();
      fetchStudents();
    }
  }, [classId]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Students - Class {classInfo?.name} {classInfo?.section?.toUpperCase()}
        </h1>
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/students"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow transition"
          >
            Manage Students
          </Link>
          <Link
            href="/dashboard/classes"
            className="text-sm text-gray-600 hover:underline"
          >
            ← Back to Classes
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 p-4 rounded-lg shadow animate-pulse"
            >
              <div className="h-4 bg-gray-300 mb-2 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 mb-2 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <p className="text-red-500">No students found in this class.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <Link
              href={`/dashboard/students/${student._id}`}
              key={student._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md hover:bg-gray-50 transition duration-200 border"
            >
              <h2 className="text-lg font-semibold mb-1">{student.name}</h2>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Admission No:</span>{" "}
                {student.admissionNumber}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {student.email}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
