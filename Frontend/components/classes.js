"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClassList() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Forms
  const [classForm, setClassForm] = useState({ name: "", section: "" });
  const [studentForm, setStudentForm] = useState({
    name: "",
    admissionNumber: "",
    email: "",
    password: "",
  });

  // File Inputs
  const [studentFile, setStudentFile] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Toast Notification Function
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3000);
  };

  // User Authentication Check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.replace("/");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      router.replace("/");
      return;
    }

    setUser(parsedUser);
    fetchClasses();
  }, []);

  // Fetch Classes from API
  const fetchClasses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/classes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch classes");
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error(error);
      showToast("Error fetching classes", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Students for a Selected Class
  const fetchStudents = async (classId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/classes/${classId}/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents((prev) => ({ ...prev, [classId]: data }));
    } catch (error) {
      console.error(error);
      showToast("Error fetching students", "error");
    }
  };

  // Handle Input Changes
  const handleInputChange = (e, setter) => {
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle Deleting a Student
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/students/${studentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete student");
      showToast("Student deleted successfully!");
      fetchStudents(selectedClass);
    } catch (error) {
      showToast("Error deleting student", "error");
    }
  };

  // Handle Adding a Class
  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(classForm),
      });
      if (!res.ok) throw new Error("Failed to add class");
      const newClass = await res.json();
      setClasses([...classes, newClass]);
      setClassForm({ name: "", section: "" });
      showToast("Class added successfully!");
    } catch (error) {
      showToast("Error adding class", "error");
    }
  };

  // Handle Adding a Student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedClass) {
      showToast("Please select a class first!", "error");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/classes/${selectedClass}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(studentForm),
      });
      if (!res.ok) throw new Error("Failed to add student");
      setStudentForm({ name: "", admissionNumber: "", email: "", password: "" });
      fetchStudents(selectedClass);
      showToast("Student added successfully!");
    } catch (error) {
      showToast("Error adding student", "error");
    }
  };

  // Handle Class Selection
  const handleClassSelection = (classId) => {
    setSelectedClass(classId);
    fetchStudents(classId);
  };

  // Handle Deleting a Class
  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/classes/${classId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete class");
      showToast("Class deleted successfully!");
      fetchClasses(); // Refetch classes after deletion
    } catch (error) {
      showToast("Error deleting class", "error");
    }
  };

  // Handle Bulk Upload for Students
  const handleBulkStudentUpload = async (e) => {
    const file = e.target.files[0];
    setStudentFile(file);
    if (!file || !selectedClass) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const rows = reader.result.split("\n").map((row) => row.split(","));
      const studentData = rows.map(([name, admissionNumber, email, password]) => ({
        name,
        admissionNumber,
        email,
        password,
      }));

      for (const student of studentData) {
        try {
          const res = await fetch(`http://localhost:5000/api/classes/${selectedClass}/students`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(student),
          });
          if (!res.ok) throw new Error("Failed to add student");
        } catch (error) {
          console.error("Error adding student", error);
        }
      }
      showToast("Students added successfully!");
      fetchStudents(selectedClass);
    };
    reader.readAsText(file);
  };

  // Handle Search for Classes
  const handleClassSearch = (e) => setSearch(e.target.value);

  // Escape Regular Expression Characters
  const escapeRegExp = (string) => string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');

  // Filtered Classes Based on Search
  const sortedClasses = [...classes].sort((a, b) => a.name.localeCompare(b.name));

  const filteredClasses = sortedClasses.filter(
    (cls) => `${cls.name} ${cls.section}`.toLowerCase().includes(escapeRegExp(search.toLowerCase()))
  );

  // Loading Skeleton
  if (loading) {
    return (
      <div className="p-6 grid md:grid-cols-2 gap-6">
        {/* Skeleton for Left Side */}
        <div className="bg-white p-6 shadow-md rounded-lg space-y-4 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>

        {/* Skeleton for Right Side */}
        <div className="bg-white p-6 shadow-md rounded-lg space-y-4 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded shadow-md text-white ${toast.type === "error" ? "bg-red-600" : "bg-green-600"
              }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-6">Manage Classes & Students</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT SIDE: Class Actions */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Create or Select Class</h2>

          {/* Add Class */}
          <form onSubmit={handleAddClass} className="mb-6">
            <div className="flex space-x-2 mb-2">
              <select
                name="name"
                value={classForm.name}
                onChange={(e) => handleInputChange(e, setClassForm)}
                className="flex-1 p-2 border rounded"
                required
              >
                <option value="">Select Class</option>
                {["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>

              <select
                name="section"
                value={classForm.section}
                onChange={(e) => handleInputChange(e, setClassForm)}
                className="flex-1 p-2 border rounded"
                required
              >
                <option value="">Select Section</option>
                {["A", "B", "C", "D", "E", "F"].map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
              ➕ Add Class
            </button>
          </form>
          
          <div>
            <label className="block font-medium mb-2">Search or Select a Class</label>
            <input
              type="text"
              value={search}
              onChange={handleClassSearch}
              className="w-full p-2 border rounded mb-2"
              placeholder="Search for a class"
            />

            <div className="max-h-60 overflow-y-auto">
              {classes.length === 0 ? (
                <p className="text-red-600">Please add a class first.</p>
              ) : (
                filteredClasses.map((cls) => (
                  <div key={cls._id} className="flex items-center justify-between border-b py-2">
                    <div onClick={() => handleClassSelection(cls._id)} className="cursor-pointer">
                      {cls.name} - {cls.section}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClass(cls._id);
                      }}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>


        {/* RIGHT SIDE: Student Actions */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Add Student</h2>
          {!selectedClass ? (
            <p className="text-red-600">Please select a class first.</p>
          ) : (
            <form onSubmit={handleAddStudent}>
              {["name", "admissionNumber", "email", "password"].map((field) => (
                <input
                  key={field}
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={studentForm[field]}
                  onChange={(e) => handleInputChange(e, setStudentForm)}
                  className="w-full p-2 border rounded mb-2"
                  required
                />
              ))}
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                ➕ Add Student
              </button>
            </form>
          )}

          {/* Bulk Upload for Students */}
          <div className="mt-6">
            <label className="block font-medium mb-2">Bulk Upload Students (CSV)</label>
            <input
              type="file"
              onChange={handleBulkStudentUpload}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* View Students */}
          {selectedClass && (
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">Students in Class</h3>
              {students[selectedClass]?.length ? (
                <ul className="space-y-2 max-h-64 overflow-auto">
                  {students[selectedClass].map((student) => (
                    <li
                      key={student._id}
                      className="flex justify-between items-center bg-gray-100 p-3 rounded"
                    >
                      <span>{student.name}</span>
                      <button
                        onClick={() => handleDeleteStudent(student._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No students in this class</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
