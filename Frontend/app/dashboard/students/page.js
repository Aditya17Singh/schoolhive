"use client";

import { useCallback, useEffect, useState } from "react";

export default function AdminStudentDashboard() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const schoolCode = user?.schoolCode;

  const fetchStudents = useCallback(() => {
    if (!schoolCode) return;

    setLoading(true);
    fetch(`http://localhost:5000/api/students?schoolCode=${schoolCode}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch students");
        return res.json();
      })
      .then((data) => {
        setStudents(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Error fetching students:", err))
      .finally(() => setLoading(false));
  } , [schoolCode]);

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

    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete student");
      fetchStudents();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const deleteAllStudents = async () => {
    if (
      !confirm(
        "⚠️ Are you sure you want to delete ALL students in this school?"
      )
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/students?schoolCode=${schoolCode}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete all students");
      fetchStudents();
    } catch (err) {
      console.error("Delete all failed:", err);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Students</h2>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search by name, admission number, or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-sm"
            />
            {filtered.length > 0 && (
              <button
                onClick={deleteAllStudents}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete All
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Admission No</th>
                <th className="px-4 py-2 text-left">Class</th>
                <th className="px-4 py-2 text-left">Section</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">School Code</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student._id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{student.name}</td>
                  <td className="px-4 py-2">{student.admissionNumber}</td>
                  <td className="px-4 py-2">{student.class?.name || "-"}</td>
                  <td className="px-4 py-2">{student.class?.section || "-"}</td>
                  <td className="px-4 py-2">{student.email}</td>
                  <td className="px-4 py-2">{student.phone || "-"}</td>
                  <td className="px-4 py-2">{student.schoolCode}</td>
                  <td className="px-4 py-2">
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
      </div>
    </div>
  );
}
