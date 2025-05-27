"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";

export default function NoticesPage() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }

    if (storedToken) {
      setToken(storedToken);
    }

    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await API.get("/notices");
        setNotices(res.data);
      } catch (error) {
        console.error("Error fetching notices:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchNotices();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please enter both title and description");
      return;
    }

    try {
      const res = await API.post("/notices", {
        title,
        description,
        orgId: user?.id,
      });

      if (res.status === 200 || res.status === 201) {
        alert("Notice added successfully!");
        setTitle("");
        setDescription("");

        // Refresh notices
        const updatedRes = await API.get("/notices");
        setNotices(updatedRes.data);
      }
    } catch (error) {
      console.error("Error adding notice:", error);
      alert("Error: " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  const allowedRoles = ["admin", "organization"];

  if (checkingAuth || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <div className="flex items-center justify-center min-h-screen">Unauthorized</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Notices</h1>

      {user.role === "admin" && user?.permissions?.includes("Notice") && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Notice Title"
            className="w-full p-2 border rounded-md mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Notice Description"
            className="w-full p-2 border rounded-md mb-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Post Notice
          </button>
        </form>
      )}

      {/* Notices List */}
      <h2 className="text-2xl font-bold text-gray-700 mb-4">All Notices</h2>
      <ul>
        {notices.map((notice) => (
          <li key={notice._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold">{notice.title}</h3>
            <p className="text-gray-700">{notice.description}</p>
            <p className="text-sm text-gray-500">
              Posted on: {new Date(notice.date).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
