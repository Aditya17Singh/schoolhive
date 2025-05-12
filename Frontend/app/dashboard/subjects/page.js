"use client";
import { useEffect, useState } from "react";

export default function SubjectDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSubjects = async () => {
    const res = await fetch("http://localhost:5000/api/subjects", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setSubjects(data);
  };

  const fetchTeachersAndClasses = async () => {
    const [tRes, cRes] = await Promise.all([
      fetch("http://localhost:5000/api/employee", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      fetch("http://localhost:5000/api/classes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    ]);

    const [tData, cData] = await Promise.all([tRes.json(), cRes.json()]);
    setTeachers(tData.teachers);
    setClasses(cData);
  };

  useEffect(() => {
    fetchSubjects();
    fetchTeachersAndClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:5000/api/subjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({});
      setIsModalOpen(false);
      fetchSubjects();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete subject?")) return;
    const res = await fetch(`http://localhost:5000/api/subjects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.ok) fetchSubjects();
  };

  const filteredSubjects = subjects.length > 0 && subjects?.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">All Subjects</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="border p-2 rounded"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
          >
            <span className="mr-1">+</span> Add Subject
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Subject</h3>
            <div className="space-y-3">
              <input
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                placeholder="Subject Name"
                className="border p-2 rounded w-full"
              />
              <input
                name="code"
                value={form.code || ""}
                onChange={handleChange}
                placeholder="Subject Code"
                className="border p-2 rounded w-full"
              />
              <select
                name="teacher"
                onChange={handleChange}
                value={form.teacher || ""}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.firstName} {t.lastName}
                  </option>
                ))}
              </select>
              <select
                name="class"
                onChange={handleChange}
                value={form.class || ""}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Class</option>
                {classes?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.section}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subjects Table */}
      <table className="w-full table-auto border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Code</th>
            <th className="p-2">Teacher</th>
            <th className="p-2">Class</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredSubjects && filteredSubjects.map((s) => (
            <tr key={s._id} className="border-t">
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.code}</td>
              <td className="p-2">{s.teacher?.firstName || "-"}</td>
              <td className="p-2">
                {s.class ? `${s.class.name} ${s.class.section}` : "-"}
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(s._id)}
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
  );
}
