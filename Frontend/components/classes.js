"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClassList() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  const [activeTab, setActiveTab] = useState("view");
  const [loading, setLoading] = useState(true);

  // Forms
  const [classForm, setClassForm] = useState({ name: "", section: "" });
  const [studentForm, setStudentForm] = useState({
    name: "",
    admissionNumber: "",
    email: "",
    password: "",
  });

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
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const handleInputChange = (e, setter) => {
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/students/${studentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete student");
      alert("Student deleted successfully!");
      fetchStudents(selectedClass);
    } catch (error) {
      alert("Error deleting student");
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const classData = {
        ...classForm,
      };

      const res = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(classData),
      });
      if (!res.ok) throw new Error("Failed to add class");
      const newClass = await res.json();
      setClasses([...classes, newClass]);
      setClassForm({ name: "", section: "" });
      alert("Class added successfully!");
    } catch (error) {
      alert("Error adding class");
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedClass) {
      alert("Please select a class first!");
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
      alert("Student added successfully!");
      setStudentForm({ name: "", admissionNumber: "", email: "", password: "" });
      fetchStudents(selectedClass);
      setActiveTab("view");
    } catch (error) {
      alert("Error adding student");
    }
  };

  const handleClassSelection = (classId) => {
    setSelectedClass(classId);
    setActiveTab("view");
    fetchStudents(classId);
  };

  if (loading) return <p className="p-6">Loading classes...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Classes & Students</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT SIDE: Class Actions */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Create or Select Class</h2>

          {/* Add Class */}
          <form onSubmit={handleAddClass} className="mb-6">
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                name="name"
                placeholder="Class Name"
                value={classForm.name}
                onChange={(e) => handleInputChange(e, setClassForm)}
                className="flex-1 p-2 border rounded"
                required
              />
              <input
                type="text"
                name="section"
                placeholder="Section"
                value={classForm.section}
                onChange={(e) => handleInputChange(e, setClassForm)}
                className="flex-1 p-2 border rounded"
                required
              />
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
              ➕ Add Class
            </button>
          </form>

          {/* Select Class */}
          <div>
            <label className="block font-medium mb-2">Select a Class</label>
            <select
              onChange={(e) => handleClassSelection(e.target.value)}
              value={selectedClass}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Choose a Class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} ({cls.section})
                </option>
              ))}
            </select>
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
