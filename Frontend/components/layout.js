"use client";
import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return null;
  }

  const user = session.user;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="md:hidden text-white bg-blue-800 p-4 rounded-r-lg fixed top-4 left-4 z-50"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`bg-blue-800 text-white w-64 p-6 fixed h-full transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul>
          <li className="mb-4">
            <Link href="/profile" className="text-lg hover:text-blue-400">Profile</Link>
          </li>
          {user.role === "admin" && (
            <>
              <li className="mb-4">
                <Link href="/admin/students" className="text-lg hover:text-blue-400">Students Attendance</Link>
              </li>
              <li className="mb-4">
                <Link href="/admin/employees" className="text-lg hover:text-blue-400">Employees Attendance</Link>
              </li>
            </>
          )}
          <li className="mt-6">
            <button 
              onClick={() => signOut({ callbackUrl: "/" })} 
              className="text-lg text-red-500 hover:text-red-700 font-semibold cursor-pointer transition duration-200 ease-in-out"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 ml-0 md:ml-64">{children}</div>
    </div>
  );
}
