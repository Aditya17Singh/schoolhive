"use client";

import { useState, useEffect } from "react";

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
        const res = await fetch("http://localhost:5000/api/notices", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setNotices(data);
        } else {
          console.error("Failed to fetch notices");
        }
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
      const res = await fetch("http://localhost:5000/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          schoolCode: user?.schoolCode,
        }),
      });

      if (res.ok) {
        alert("Notice added successfully!");
        setTitle("");
        setDescription("");

        // Refresh notices
        const updatedRes = await fetch("http://localhost:5000/api/notices", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (updatedRes.ok) {
          const updatedNotices = await updatedRes.json();
          setNotices(updatedNotices);
        }
      } else {
        const error = await res.json();
        alert("Error: " + error.message);
      }
    } catch (error) {
      console.error("Error adding notice:", error);
    }
  };

  if (checkingAuth || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || user.role !== "admin") {
    return <div className="flex items-center justify-center min-h-screen">Unauthorized</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Notices</h1>

      {/* Notice Form */}
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
