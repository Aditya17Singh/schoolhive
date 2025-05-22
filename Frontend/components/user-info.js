"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";


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
  const [attendanceData , setAttendanceData] = useState([
  { date: "2025-05-01", present: 95, absent: 5 },
  { date: "2025-05-02", present: 90, absent: 10 },
  { date: "2025-05-03", present: 92, absent: 8 },
  { date: "2025-05-04", present: 88, absent: 12 },
  { date: "2025-05-05", present: 91, absent: 9 },
]);
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Unauthorized. Please login.
      </div>
    );
  }

  return (
    <>
      <div className="p-6 flex gap-2">
        <div className="flex-[0_1_65%]">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
            <StatCard
              title="Students"
              value={stats.totalStudents}
              color="text-blue-600"
              link="/dashboard/students"
            />
            <StatCard
              title="Classes"
              value={stats.totalClasses}
              color="text-green-600"
              link="/dashboard/classes"
            />
            <StatCard
              title="Teachers"
              value={stats.totalTeachers}
              color="text-purple-600"
              link="/dashboard/teachers"
            />
            {/* <StatCard
              title="Fee Collection"
              value={`₹${stats.feeCollection}`}
              color="text-red-600" /> */}
          </div>

          <AttendanceChart data={attendanceData} />

        </div>
        <div className="flex-[0_1_35%]">
          {/* Notices */}
          <div className="rounded-xl bg-white text-gray-900 shadow-md hover:shadow-lg transition-shadow duration-300 mb-6">
            <div className="flex flex-col space-y-1.5 p-6 bg-gray-100">
              <h3 className="font-semibold leading-none tracking-tight text-lg">
                Quick Actions
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Each Quick Action */}
                <QuickAction
                  href="/dashboard/attendance/dashboard"
                  icon="clock"
                  label="Attendance"
                />
                <QuickAction
                  href="/dashboard/admission/stats"
                  icon="users"
                  label="Admission"
                />
                <QuickAction
                  href="/dashboard/fee/dashboard"
                  icon="badge-indian-rupee"
                  label="Fees"
                />
                <QuickAction
                  href="/dashboard/result/dashboard"
                  icon="chart-no-axes-combined"
                  label="Result"
                />
                <QuickAction
                  href="/dashboard/classes"
                  icon="users"
                  label="Classes"
                />
                <QuickAction
                  href="/dashboard/subjects"
                  icon="book-open"
                  label="Subjects"
                />
                <QuickAction
                  href="/dashboard/students"
                  icon="graduation-cap"
                  label="Students"
                />
                <QuickAction
                  href="/dashboard/teachers/dashboard"
                  icon="user"
                  label="Teachers"
                />
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Latest Notices</h2>
              {/* <button
                onClick={() =>
                  fetchStatsAndNotices(localStorage.getItem("token"))
                }
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Refresh Notices
              </button> */}
            </div>

            {notices.length > 0 ? (
              <ul className="space-y-4">
                {notices.map((notice) => (
                  <li
                    key={notice._id}
                    className="border-b pb-2 flex justify-between items-center"
                  >
                    {editingNotice?._id === notice._id ? (
                      <div className="w-full">
                        <input
                          type="text"
                          value={editingNotice.title}
                          onChange={(e) =>
                            setEditingNotice({
                              ...editingNotice,
                              title: e.target.value,
                            })
                          }
                          className="w-full border p-2 mb-2"
                        />
                        <textarea
                          value={editingNotice.description}
                          onChange={(e) =>
                            setEditingNotice({
                              ...editingNotice,
                              description: e.target.value,
                            })
                          }
                          className="w-full border p-2"
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={handleSaveEdit}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNotice(null)}
                            className="bg-gray-400 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        <h3 className="text-lg font-medium">{notice.title}</h3>
                        <p className="text-gray-700">{notice.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(notice.date).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      {user?.role === "admin" && (
                        <>
                          <button
                            onClick={() => handleEdit(notice)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(notice._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
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
      </div>
    </>
  );
}

function AttendanceChart({ data }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Attendance Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="present"
            stroke="#4ade80"
            name="Present"
          />
          <Line
            type="monotone"
            dataKey="absent"
            stroke="#f87171"
            name="Absent"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function QuickAction({ href, icon, label }) {
  return (
    <Link href={href}>
      <div className="items-center cursor-pointer justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background shadow-sm w-full h-auto py-4 px-3 flex flex-col gap-2 transition-all duration-200 hover:bg-gray-50 hover:text-blue-600">
        <span>{label}</span>
      </div>
    </Link>
  );
}

function StatCard({ title, value, color, link }) {
  const router = useRouter();

  const handleClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <div
      className={`bg-white px-1 py-4 flex justify-center gap-2 items-center rounded-lg shadow-lg text-center cursor-${
        link ? "pointer" : "default"
      } hover:shadow-xl transition`}
      onClick={handleClick}
    >
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
