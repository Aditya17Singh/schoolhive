"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openMenus, setOpenMenus] = useState({
    academics: false,
    teachers: false,
    students: false,
    admission: false,
    attendance: false,
    fee: false,
  });

  const [open, setOpen] = useState(false);

  const router = useRouter();
  const popoverRef = useRef(null);
  const sidebarWidth = 250;

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

  const handleSignOut = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/");
  }, [router]);

  const toggleMenu = useCallback((menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div style={{ paddingLeft: `${sidebarWidth}px` }}>
      <aside
        className="fixed top-0 left-0 bg-blue-900 text-white p-4 overflow-y-auto"
        style={{ width: `${sidebarWidth}px`, height: "100vh" }}
      >
        <h2 className="text-xl font-bold mb-6">School Hive</h2>
        <ul className="space-y-2 text-sm">
          <MenuItem href="/dashboard" icon="🏠" label="Home" />
          <Dropdown label="Academics" icon="🎓" open={openMenus.academics} toggle={() => toggleMenu("academics")}>
            <MenuItem href="/dashboard/classes" label="Classes" icon="📘" />
            <MenuItem href="/dashboard/subjects" label="Subjects" icon="📚" />
            <MenuItem href="/dashboard/exam" label="Exam" icon="📝" />
            <MenuItem href="/dashboard/session" label="Session" icon="📝" />
          </Dropdown>
          <MenuItem href="/dashboard/notices" label="Notices" icon="📢" />
          <MenuItem href="/dashboard/calendar" label="Calendar" icon="🗓️" />
          <Dropdown label="Teachers" icon="👨‍🏫" open={openMenus.teachers} toggle={() => toggleMenu("teachers")}>
            <MenuItem href="/dashboard/teachers/dashboard" label="Dashboard" icon="📊" />
            <MenuItem href="/dashboard/teachers/applications" label="Manage Applications" icon="📄" />
            <MenuItem href="/dashboard/teachers" label="New Teacher" icon="➕" />
          </Dropdown>
          <Dropdown label="Students" icon="👩‍🎓" open={openMenus.students} toggle={() => toggleMenu("students")}>
            <MenuItem href="/dashboard/students" label="Dashboard" icon="📊" />
            <MenuItem href="/dashboard/students/rollno" label="Manage Roll No" icon="🔢" />
            <MenuItem href="/dashboard/students/promote" label="Promote Student" icon="📈" />
          </Dropdown>
          <Dropdown label="Admission" icon="📝" open={openMenus.admission} toggle={() => toggleMenu("admission")}>
            <MenuItem href="/dashboard/admission/stats" label="Dashboard" icon="📊" />
            <MenuItem href="/dashboard/admission/new" label="New Admission" icon="➕" />
          </Dropdown>
          <Dropdown label="Attendance" icon="🕒" open={openMenus.attendance} toggle={() => toggleMenu("attendance")}>
            <MenuItem href="/dashboard/attendance" label="Dashboard" icon="📊" />
          </Dropdown>
          <Dropdown label="Fee" icon="💰" open={openMenus.fee} toggle={() => toggleMenu("fee")}>
            <MenuItem href="/dashboard/fee" label="Dashboard" icon="📊" />
            <MenuItem href="/dashboard/fee/structures" label="Structures" icon="🏗️" />
            <MenuItem href="/dashboard/fee/payments" label="Payments" icon="💳" />
          </Dropdown>
          <MenuItem href="/dashboard/results" label="Result" icon="📈" />
          <div className="mt-10">
            Others
          </div>
          <MenuItem href="/dashboard/news" label="What's New" icon="📰" />
          <MenuItem href="/dashboard/organization" label="Organization" icon="🏢" />
          <MenuItem href="/dashboard/admins" label="Admins" icon="🧑‍💼" />
          <MenuItem href="/dashboard/support" label="Support" icon="🛠️" />
          <MenuItem href="/dashboard/settings" label="Settings" icon="⚙️" />
        </ul>
      </aside>

      <div className="flex flex-col">
        <header
          style={{ left: `${sidebarWidth}px` }}
          className="fixed top-0 right-0 z-20 bg-[#F5F7F8] shadow-sm h-20 px-4 flex items-center justify-between"
        >
          <div className="relative">
            <div className="flex gap-2 items-center px-4 border-2 border-gray-200 bg-gray-50 rounded-full w-[300px]">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 h-9 bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4 items-center" ref={popoverRef}>
            <div
              onClick={() => setOpen((prev) => !prev)}
              className="w-max relative flex items-center px-2 py-1 hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow cursor-pointer gap-3 group"
            >
              <h2 className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {user?.name}
              </h2>
              <img
                src="https://serp-bucket-123538789.s3.amazonaws.com/uploads/6822f0fd8a0c9dee94e269f5/6822f0fd8a0c9dee94e269f5-1747120381920-market-sentiment-option1.png"
                alt="DAV Public"
                className="h-8 w-8 rounded-full object-cover border border-gray-200"
              />
              {open && (
                <div className="absolute top-full right-0 mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <ul className="text-sm">
                    <li>
                      <Link
    href="/dashboard/organization"
    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
    onClick={() => setOpen(false)}
  >
    👤 Profile
  </Link>
                    </li>
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                        onClick={handleSignOut}
                      >
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pt-20 px-4 bg-white">{children}</main>
      </div>
    </div>
  );
}

function MenuItem({ href, label, icon }) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-2 hover:text-blue-300">
        <span>{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
}

function Dropdown({ label, icon, open, toggle, children }) {
  return (
    <li>
      <button
        onClick={toggle}
        className="flex items-center gap-2 w-full hover:text-blue-300 cursor-pointer"
      >
        <span>{icon}</span>
        <span>{label}</span>
        <span className="ml-auto transition-transform" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <ChevronDownIcon />
        </span>
      </button>
      {open && <ul className="pl-6 mt-2 space-y-2">{children}</ul>}
    </li>
  );
}

function SearchIcon() {
  return (
    <svg
      className="lucide lucide-search h-5 w-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      width="24" height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      className="lucide lucide-chevron-down h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      width="20" height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
