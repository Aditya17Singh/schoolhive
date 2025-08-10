"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";
import { Megaphone, CalendarDays, PlusCircle, Bell } from "lucide-react";

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
        setUser(JSON.parse(storedUser));
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

        const updatedRes = await API.get("/notices");
        setNotices(updatedRes.data);
      }
    } catch (error) {
      console.error("Error adding notice:", error);
      alert("Error: " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  const allowedRoles = ["admin", "organization"];

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Megaphone className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Notices</h1>
          </div>
          <p className="text-gray-600">Stay updated with the latest announcements</p>
        </div>

        {/* Create Notice Form */}
        {user.role === "admin" && user?.permissions?.includes("Notice") && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  Create New Notice
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notice Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter notice title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Write your notice description here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-vertical"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post Notice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notices List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Notices</h2>
            <div className="text-sm text-gray-500">
              {notices.length} {notices.length === 1 ? 'notice' : 'notices'}
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              // Skeleton loader only when fetching notices
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                        <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : notices.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notices yet</h3>
                <p className="text-gray-500">
                  {user.role === "admin" && user?.permissions?.includes("Notice")
                    ? "Create your first notice to get started!"
                    : "Check back later for new announcements."}
                </p>
              </div>
            ) : (
              notices.map((notice) => (
                <div
                  key={notice._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Megaphone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {notice.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {notice.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <CalendarDays className="w-4 h-4" />
                          <span>{new Date(notice.date).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}