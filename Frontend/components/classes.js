"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function ClassList() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Forms
  const [classForm, setClassForm] = useState({ name: "", section: "" });

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Toast Notification Function
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((toast) => toast.id !== id)),
      3000
    );
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
      const res = await axios.get("http://localhost:5000/api/classes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setClasses(res.data);
    } catch (error) {
      console.error(error);
      showToast("Error fetching classes", "error");
    } finally {
      setLoading(false);
    }
  };  

  // Handle Input Changes
  const handleInputChange = (e, setter) => {
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle Adding a Class
  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/classes",
        classForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setClasses([...classes, res.data]);
      setClassForm({ name: "", section: "" });
      showToast("Class added successfully!");
    } catch (error) {
      if (
        error.response &&
        error.response.data?.error ===
          "Class with this name and section already exists."
      ) {
        showToast(error.response.data.error, "error");
      } else {
        showToast("Error adding class", "error");
      }
    }
  };  

  // Handle Deleting a Class
  const handleDeleteClass = async (classId) => {
    // Displaying a warning that all students will lose their reference to this class
    if (
      !window.confirm(
        "Are you sure you want to delete this class? Deleting this class will remove its association with all students, but the students themselves will remain in the school system."
      )
    )
      return;
  
    try {
      await axios.delete(`http://localhost:5000/api/classes/${classId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      showToast("Class deleted and students' references removed successfully!");
      fetchClasses(); // Reload the class list
    } catch (error) {
      showToast("Error deleting class", "error");
    }
  };  

  // Handle Search for Classes
  const handleClassSearch = (e) => setSearch(e.target.value);

  // Escape Regular Expression Characters
  const escapeRegExp = (string) =>
    string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");

  // Filtered Classes Based on Search
  const sortedClasses = [...classes].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const filteredClasses = sortedClasses.filter((cls) =>
    `${cls.name} ${cls.section}`
      .toLowerCase()
      .includes(escapeRegExp(search.toLowerCase()))
  );

  // Loading Skeleton
  if (loading) {
    return (
      <div className="p-6 gap-6">
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
            className={`px-4 py-2 rounded shadow-md text-white ${
              toast.type === "error" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-6">Manage Classes & Students</h1>

      <div className="grid gap-6">
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
                {[
                  "Nursery",
                  "LKG",
                  "UKG",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                ].map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
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
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              ➕ Add Class
            </button>
          </form>

          <div>
            <label className="block font-medium mb-2">
              Search or Select a Class
            </label>
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
                  <div
                    key={cls._id}
                    className="flex items-center justify-between border-b py-2"
                  >
                    <div
                      onClick={() =>
                        router.push(`/dashboard/classes/${cls._id}/students`)
                      }
                      className="cursor-pointer flex-1"
                    >
                      {cls.name} - {cls.section}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/dashboard/classes/${cls._id}/students`}>
                        <button className="text-blue-600 hover:underline text-sm">
                          View Students
                        </button>
                      </Link>
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
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
