"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ClassStudents() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams(); // Get class ID from URL
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/classes/${id}/students`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [id]);

  const handleAddStudent = () => {
    router.push(`/dashboard/classes/${id}/add-student`);
  };

  if (loading) return <p className="p-6">Loading students...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Students in Class</h1>

      {students.length === 0 ? (
        <div className="mt-4">
          <p>No students found.</p>
          <button onClick={handleAddStudent} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
            + Add Student
          </button>
        </div>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2 border">Student Name</th>
              <th className="p-2 border">Roll Number</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="text-center bg-white border">
                <td className="p-2 border">{student.name}</td>
                <td className="p-2 border">{student.rollNumber}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => alert("Feature coming soon!")}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
