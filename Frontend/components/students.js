"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import AddStudentModal from "./add-student"; 

export default function AdminStudentDashboard() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
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
    const keyword = search.toLowerCase();
    const result = students.filter(
      (s) =>
        s.name.toLowerCase().includes(keyword) ||
        s.admissionNumber.toLowerCase().includes(keyword) ||
        (s.email && s.email.toLowerCase().includes(keyword))
    );
    setFiltered(result);
  }, [search, students]);

  const deleteStudent = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/students/${id}`, {
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
    const confirmDelete = confirm(
      "⚠️ Are you sure you want to delete ALL students in this school?"
    );
    if (!confirmDelete) return;
  
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
      <div className="bg-white rounded-lg shadow-md p-6">
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

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Admission No</th>
                <th className="px-6 py-3 text-left">Class</th>
                <th className="px-6 py-3 text-left">Section</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr
                  key={student._id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-3">
                    <Link
                      href={`/dashboard/students/${student._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {student.name}
                    </Link>
                  </td>
                  <td className="px-6 py-3">{student.admissionNumber}</td>
                  <td className="px-6 py-3">{student.class?.name || "-"}</td>
                  <td className="px-6 py-3">{student.class?.section || "-"}</td>
                  <td className="px-6 py-3">{student.email}</td>
                  <td className="px-6 py-3">{student.phone || "-"}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => deleteStudent(student._id)}
                      className="text-red-600 hover:underline"
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
      </div>
      <AddStudentModal
        isOpen={isStudentModalOpen} // Pass modal open state
        closeModal={() => setIsStudentModalOpen(false)} // Close modal function
        handleAddStudent={handleAddStudent} // Handle form submission
      />
    </div>
  );
}
