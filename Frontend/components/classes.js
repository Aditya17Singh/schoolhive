"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ClassList() {
  const { data: session, status } = useSession();
  const router = useRouter();
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
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") router.push("/");
  }, [session, status, router]);

  // Fetch Classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/classes", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch classes");
        const data = await res.json();
        setClasses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Fetch Students when class is selected or when switching to "View Students" tab
  useEffect(() => {
    if (activeTab === "view" && selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [activeTab, selectedClass]);

  // Fetch Students
  const fetchStudents = async (classId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/classes/${classId}/students`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents((prev) => ({ ...prev, [classId]: data }));
      setSelectedClass(classId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e, setter) => {
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

   // Delete Student
   const handleDeleteStudent = async (studentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/students/${studentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete student");

      alert("Student deleted successfully!");
      fetchStudents(selectedClass);
    } catch (error) {
      alert("Error deleting student");
    }
  };

  // Add Class
  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classForm),
        credentials: "include",
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

  // Add Student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedClass) {
      alert("Please select a class first!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/classes/${selectedClass}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentForm),
        credentials: "include",
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

  // Handle Class Selection
  const handleClassSelection = (classId) => {
    setSelectedClass(classId);
    setActiveTab("view"); // Switch to "View Students" when class is selected
  };

  if (loading) return <p className="p-6">Loading classes...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Classes & Students</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("addClass")}
          className={`px-4 py-2 rounded ${activeTab === "addClass" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          Add Class
        </button>
        <button
          onClick={() => setActiveTab("addStudent")}
          className={`px-4 py-2 rounded ${activeTab === "addStudent" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          Add Student
        </button>
        <button
          onClick={() => setActiveTab("view")}
          className={`px-4 py-2 rounded ${activeTab === "view" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          View Students
        </button>
      </div>

      {/* Add Class Form */}
      {activeTab === "addClass" && (
        <form onSubmit={handleAddClass} className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">Add New Class</h2>
          <input
            type="text"
            name="name"
            placeholder="Class Name"
            value={classForm.name}
            onChange={(e) => handleInputChange(e, setClassForm)}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="text"
            name="section"
            placeholder="Section"
            value={classForm.section}
            onChange={(e) => handleInputChange(e, setClassForm)}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">
            Add Class
          </button>
        </form>
      )}

      {/* Add Student Form */}
      {activeTab === "addStudent" && (
        <form onSubmit={handleAddStudent} className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">Add Student</h2>
          <select
            onChange={(e) => handleClassSelection(e.target.value)}
            value={selectedClass || ""}
            className="border px-3 py-2 rounded w-full mb-2"
          >
            <option value="">-- Select a Class --</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} ({cls.section})
              </option>
            ))}
          </select>
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
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full">
            Add Student
          </button>
        </form>
      )}

      {/* View Students */}
      {activeTab === "view" && (
        <div className="mt-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-2">Students in Class</h2>
          {selectedClass ? (
            students[selectedClass]?.length ? (
              <ul className="space-y-2">
                {students[selectedClass].map((student) => (
                  <li key={student._id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
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
            )
          ) : (
            <p className="text-red-500">⚠️ Please select a class to view students.</p>
          )}
        </div>
      )}
    </div>
  );
}
