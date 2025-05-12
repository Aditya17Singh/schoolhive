"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import AddStudentModal from "./add-student";

export default function AdminStudentDashboard() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const schoolCode = user?.schoolCode;

  const fetchStudents = useCallback(() => {
    if (!schoolCode) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:5000/api/students?schoolCode=${schoolCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStudents(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error("Error fetching students:", err))
      .finally(() => setLoading(false));
  }, [schoolCode]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, schoolCode]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    const keyword = debouncedSearch.toLowerCase();
    const result = students.filter(
      (s) =>
        s.name.toLowerCase().includes(keyword) ||
        s.admissionNumber.toLowerCase().includes(keyword) ||
        (s.email && s.email.toLowerCase().includes(keyword))
    );
    setFiltered(result);
  }, [debouncedSearch, students]);

  const deleteStudent = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchStudents();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const deleteAllStudents = async () => {
    const confirmation = prompt(
      "⚠️ This action will DELETE ALL STUDENTS from the school.\n\nType DELETE ALL to confirm:"
    );

    if (confirmation !== "DELETE ALL") {
      alert("❌ Deletion cancelled. Confirmation phrase did not match.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found in localStorage");
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/students?schoolCode=${schoolCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ All students deleted successfully:", res.data);
      fetchStudents();
    } catch (err) {
      console.error("❌ Delete all failed:", err.response?.data || err.message);
    }
  };

  const handleAddStudent = () => {
    fetchStudents();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Students</h2>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name, admission number, or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-sm"
          />
          <button
            onClick={() => setIsStudentModalOpen(true)} // Open modal on button click
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            + Add Student
          </button>
          {filtered.length > 0 && (
            <button
              onClick={deleteAllStudents}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200"
            >
              Delete All
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-200 text-gray-700 font-semibold">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Admission No</th>
              <th className="py-3 px-4 text-left">Class</th>
              <th className="py-3 px-4 text-left">Section</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <Link
                    href={`/dashboard/students/${student._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {student.name}
                  </Link>
                </td>
                <td className="py-3 px-4">{student.admissionNumber}</td>
                <td className="py-3 px-4">{student.class?.name || "-"}</td>
                <td className="py-3 px-4">{student.class?.section || "-"}</td>
                <td className="py-3 px-4">{student.email}</td>
                <td className="py-3 px-4">{student.phone || "-"}</td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    onClick={() => deleteStudent(student._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading ? (
        <p className="text-center mt-6 text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center mt-6 text-gray-500">No students found.</p>
      ) : null}

      <AddStudentModal
        isOpen={isStudentModalOpen} // Pass modal open state
        closeModal={() => setIsStudentModalOpen(false)} // Close modal function
        handleAddStudent={handleAddStudent} // Handle form submission
      />
    </div>
  );
}
