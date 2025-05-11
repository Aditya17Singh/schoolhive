"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);
  const lastNonZeroWidth = useRef(250);

  // Add to top with existing hooks
  const lastClickTimeRef = useRef(0);

  // Detect double click for toggling sidebar
  // const handleResizerClick = () => {
  //   const now = Date.now();
  //   if (now - lastClickTimeRef.current < 300) {
  //     // Double tap detected
  //     toggleSidebar();
  //   }
  //   lastClickTimeRef.current = now;
  // };

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.replace("/");
    } else {
      setUser(JSON.parse(userData));
      setLoading(false);
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/");
  };

  // Resizable logic
  // const startResizing = () => setIsResizing(true);
  const stopResizing = () => setIsResizing(false);

  // const handleMouseMove = (e) => {
  //   if (!isResizing || !containerRef.current) return;
  //   const containerLeft = containerRef.current.getBoundingClientRect().left;
  //   const newWidth = e.clientX - containerLeft;
  //   const min = 150;
  //   const max = 500;
  //   if (newWidth >= min && newWidth <= max) {
  //     setSidebarWidth(newWidth);
  //     lastNonZeroWidth.current = newWidth;
  //   }
  // };

  const toggleSidebar = () => {
    if (sidebarWidth === 0) {
      setSidebarWidth(lastNonZeroWidth.current || 250);
    } else {
      lastNonZeroWidth.current = sidebarWidth;
      setSidebarWidth(0);
    }
  };

  // useEffect(() => {
  //   document.addEventListener("mousemove", handleMouseMove);
  //   document.addEventListener("mouseup", stopResizing);
  //   return () => {
  //     document.removeEventListener("mousemove", handleMouseMove);
  //     document.removeEventListener("mouseup", stopResizing);
  //   };
  // }, [isResizing]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Image
          src="/site-logo.webp"
          alt="Site Logo"
          width={100}
          height={100}
          className="animate-pulse"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex w-full h-screen overflow-hidden relative bg-gray-100 "
    >
      {/* Sidebar */}
      <div
        className="bg-blue-800 text-white p-6 transition-all duration-300 overflow-y-auto h-full group"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="flex justify-between items-center mb-6">
          <Link href="/dashboard">
            <h2 className="text-2xl font-bold cursor-pointer hover:underline">
              {user.schoolName || "Dashboard"}
            </h2>
          </Link>
          {/* Collapse Button (←) shown when sidebar is open) */}
          {/* {sidebarWidth !== 0 && (
            <button
              onClick={toggleSidebar}
              className="absolute z-20 hidden group-hover:block  left-[calc(100%+4px)] cursor-pointer  border rounded-full shadow w-8 h-8 flex items-center"
              style={{ left: `${sidebarWidth - 40}px` }} // 8px offset from resizer
            >
              ←
            </button>
          )} */}

          {/* Expand Button (→) shown when sidebar is collapsed */}
          {/* {sidebarWidth === 0 && (
            <button
              onClick={toggleSidebar}
              className="absolute z-20 top-4 hidden group-hover:block cursor-pointer bg-black border rounded-full shadow p-1 w-8 h-8 flex items-center"
              style={{ left: `${sidebarWidth + 40}px` }}
            >
              →
            </button>
          )} */}
        </div>
        <ul>
          <li className="mb-4">
            <Link
              href="/dashboard/profile"
              className="text-lg hover:text-blue-400"
            >
              Profile
            </Link>
          </li>

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
          <li className="mt-6">
            <button
              onClick={handleSignOut}
              className="text-lg text-red-400 hover:text-red-600 font-semibold"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>

      {/* Resizer */}
      {/* Resizer with double click toggle */}
      {/* <div
        onMouseDown={startResizing}
        onClick={handleResizerClick}
        className="absolute top-0 bottom-0 z-10"
        style={{ left: `${sidebarWidth}px` }}
      >
        <div className="cursor-col-resize w-[5px] h-full hover:bg-black transition-colors" />
      </div> */}

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto h-full">{children}</div>
    </div>
  );
}
