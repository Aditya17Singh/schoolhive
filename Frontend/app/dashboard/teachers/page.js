"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // top of your file
import Image from "next/image";

export default function TeacherDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const fetchTeachers = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/teachers?page=${page}&search=${encodeURIComponent(
          search
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch teachers");
      const data = await res.json();
      setTeachers(data.teachers);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
    }
  }, [page, search]);

  const fetchSubjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/subjects", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch subjects");
      const data = await res.json();

      setSubjects(data);
    } catch (error) {
      console.error("Subjects fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers, page, search]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files?.length) {
      setForm((f) => ({ ...f, photoUrl: URL.createObjectURL(files[0]) }));
    } else if (name === "subjects") {
      const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
      setForm((f) => ({ ...f, subjects: selected }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const method = editMode ? "PUT" : "POST";
    const url = editMode
      ? `http://localhost:5000/api/teachers/${selectedTeacher._id}`
      : "http://localhost:5000/api/teachers";

    // If the photo has been updated, handle image upload
    let uploadedPhotoUrl = form.photoUrl;

    if (form.photo) {
      const formData = new FormData();
      formData.append("photo", form.photo);
      try {
        const res = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (!res.ok) throw new Error("Failed to upload image");
        const data = await res.json();
        uploadedPhotoUrl = data.url; // Assuming the server returns the image URL
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }

    const updatedForm = { ...form, photoUrl: uploadedPhotoUrl };

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedForm),
      });

      if (!res.ok) throw new Error("Failed to create/update teacher");

      setForm({});
      setShowModal(false);
      fetchTeachers();
      setSelectedTeacher(null);
      setEditMode(false);
    } catch (error) {
      console.error("Teacher submission failed:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/teachers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete teacher");

      fetchTeachers();
    } catch (error) {
      console.error(error);
    }
  };

  const getInitials = (name) => {
    const nameArray = name.split(" ");
    return nameArray
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setForm({ ...teacher });
    setEditMode(true);
    setShowModal(true);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Teachers</h2>
        <div className="flex gap-2">
          <input
            placeholder="Search"
            className="border px-3 py-1 rounded-md"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => {
              setShowModal(true);
              setEditMode(false);
              setForm({});
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded-md"
          >
            + Add Teacher
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Teacher" : "Add Teacher"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="employeeId"
                onChange={handleChange}
                value={form.employeeId || ""}
                placeholder="Employee ID"
                className="border p-2 rounded"
              />
              <input
                name="email"
                onChange={handleChange}
                value={form.email || ""}
                placeholder="Email"
                className="border p-2 rounded"
              />
              <input
                name="firstName"
                onChange={handleChange}
                value={form.firstName || ""}
                placeholder="First Name"
                className="border p-2 rounded"
              />
              <input
                name="lastName"
                onChange={handleChange}
                value={form.lastName || ""}
                placeholder="Last Name"
                className="border p-2 rounded"
              />
              <input
                name="phone"
                onChange={handleChange}
                value={form.phone || ""}
                placeholder="Phone"
                className="border p-2 rounded"
              />
              <input
                name="address"
                onChange={handleChange}
                value={form.address || ""}
                placeholder="Address"
                className="border p-2 rounded"
              />
              <input
                name="birthDate"
                onChange={handleChange}
                value={form.birthDate || ""}
                type="date"
                className="border p-2 rounded"
              />
              <select
                name="gender"
                onChange={handleChange}
                value={form.gender || ""}
                className="border p-2 rounded"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input
                name="bloodType"
                onChange={handleChange}
                value={form.bloodType || ""}
                placeholder="Blood Type"
                className="border p-2 rounded"
              />
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <select
                name="subjects"
                multiple
                value={form.subjects || []}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSubmit}
              className="mt-6 bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
            >
              {editMode ? "Update Teacher" : "Create Teacher"}
            </button>
          </div>
        </div>
      )}

      {/* Teacher List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left">Avatar</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Employee ID</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Blood Type</th>
              <th className="py-3 px-4 text-left">Subjects</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-center">
                  {t.photoUrl ? (
                    <Image
                      src={t.photoUrl}
                      alt="avatar"
                      className="rounded-full object-cover"
                      width={40} // Set a width
                      height={40} // Set a height
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-white text-sm">
                        {getInitials(`${t.firstName} ${t.lastName}`)}
                      </span>
                    </div>
                  )}
                </td>

                <td
                  className="py-3 px-4 cursor-pointer text-blue-600 hover:underline"
                  onClick={() => router.push(`/dashboard/teachers/${t._id}`)}
                >
                  {t.firstName} {t.lastName}
                </td>
                <td className="py-3 px-4">{t.employeeId}</td>
                <td className="py-3 px-4">{t.phone}</td>
                <td className="py-3 px-4">{t.bloodType}</td>
                <td className="py-3 px-4">
                  {t.subjects
                    ?.map((subjectId) => {
                      const subject = subjects.find((s) => s._id === subjectId);
                      return subject ? subject.name : null;
                    })
                    .join(", ") || "-"}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => openEditModal(t)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          disabled={page * 10 >= total}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
