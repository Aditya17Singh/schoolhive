"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.replace("/"); // redirect if not authenticated
    } else {
      setUser(JSON.parse(userData));
      setLoading(false);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/");
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-blue-800 text-white w-64 p-6 shadow-lg hidden md:block">
        <Link href="/dashboard">
          <h2 className="text-2xl font-bold mb-6 cursor-pointer hover:underline">
            {user.schoolName || "Dashboard"}
          </h2>
        </Link>      <ul>
          <li className="mb-4">
            <Link
              href="/dashboard/profile"
              className="text-lg hover:text-blue-400"
            >
              Profile
            </Link>
          </li>

          {/* Admin Only Links */}
          {user.role === "admin" && (
            <>
              <li className="mb-4">
                <Link
                  href="/dashboard/classes"
                  className="text-lg hover:text-blue-400"
                >
                  Classes
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/dashboard/subjects"
                  className="text-lg hover:text-blue-400"
                >
                  Subjects
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/dashboard/teachers"
                  className="text-lg hover:text-blue-400"
                >
                  Teachers
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/dashboard/students"
                  className="text-lg hover:text-blue-400"
                >
                  Students
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/dashboard/notices"
                  className="text-lg hover:text-blue-400"
                >
                  Notices
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/dashboard/complaints"
                  className="text-lg hover:text-blue-400"
                >
                  Complaints
                </Link>
              </li>
            </>
          )}

          {/* Logout */}
          <li className="mt-6">
            <button
              onClick={handleSignOut}
              className="text-lg text-red-500 hover:text-red-700 font-semibold cursor-pointer transition duration-200 ease-in-out"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
