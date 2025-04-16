"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalTeachers: 0,
    feeCollection: 0,
  });
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNotice, setEditingNotice] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/"); // redirect to login if not logged in
    } else {
      setUser(JSON.parse(userData));
      fetchStatsAndNotices(token);
    }
  }, []);

  const fetchStatsAndNotices = async (token) => {
    try {
      const [statsRes, noticesRes] = await Promise.all([
        fetch("http://localhost:5000/api/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:5000/api/notices", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const statsData = await statsRes.json();
      const noticesData = await noticesRes.json();

      setStats(statsData);
      setNotices(noticesData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/notices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setNotices((prevNotices) =>
          prevNotices.filter((notice) => notice._id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !editingNotice) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/notices/${editingNotice._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editingNotice.title,
            description: editingNotice.description,
          }),
        }
      );

      if (res.ok) {
        setNotices((prevNotices) =>
          prevNotices.map((n) =>
            n._id === editingNotice._id ? editingNotice : n
          )
        );
        setEditingNotice(null);
      }
    } catch (error) {
      console.error("Error updating notice:", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Unauthorized. Please login.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Welcome, {user.name}!</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Students" value={stats.totalStudents} color="text-blue-600" />
        <StatCard title="Total Classes" value={stats.totalClasses} color="text-green-600" />
        <StatCard title="Total Teachers" value={stats.totalTeachers} color="text-purple-600" />
        <StatCard title="Fee Collection" value={`₹${stats.feeCollection}`} color="text-red-600" />
      </div>

      {/* Notices */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Latest Notices</h2>
          <button onClick={() => fetchStatsAndNotices(localStorage.getItem("token"))} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Refresh Notices
          </button>
        </div>

        {notices.length > 0 ? (
          <ul className="space-y-4">
            {notices.map((notice) => (
              <li key={notice._id} className="border-b pb-2 flex justify-between items-center">
                {editingNotice?._id === notice._id ? (
                  <div className="w-full">
                    <input
                      type="text"
                      value={editingNotice.title}
                      onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                      className="w-full border p-2 mb-2"
                    />
                    <textarea
                      value={editingNotice.description}
                      onChange={(e) => setEditingNotice({ ...editingNotice, description: e.target.value })}
                      className="w-full border p-2"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button onClick={handleSaveEdit} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                      <button onClick={() => setEditingNotice(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <h3 className="text-lg font-medium">{notice.title}</h3>
                    <p className="text-gray-700">{notice.description}</p>
                    <p className="text-sm text-gray-500">{new Date(notice.date).toLocaleDateString()}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  {user?.role === "admin" && (
                    <>
                      <button onClick={() => handleEdit(notice)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                      <button onClick={() => handleDelete(notice._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No notices available.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
