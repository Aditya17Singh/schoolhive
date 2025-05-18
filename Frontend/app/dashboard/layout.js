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
  const containerRef = useRef(null);
  const lastNonZeroWidth = useRef(250);

  const [openMenus, setOpenMenus] = useState({
    academics: false,
    teachers: false,
    students: false,
    admission: false,
    attendance: false,
    fee: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) router.replace("/");
    else {
      setUser(JSON.parse(userData));
      setLoading(false);
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/");
  };

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Image src="/site-logo.webp" alt="Site Logo" width={100} height={100} className="animate-pulse" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex w-full h-screen overflow-hidden bg-gray-100">
      <div className="bg-blue-900 text-white p-4 overflow-y-auto h-full" style={{ width: `${sidebarWidth}px` }}>
        <h2 className="text-xl font-bold mb-6">{user.schoolName || "Dashboard"}</h2>

        <ul className="space-y-2 text-sm">
          <MenuItem href="/dashboard" icon="🏠" label="Home" />

          <Dropdown label="Academics" icon="🎓" open={openMenus.academics} toggle={() => toggleMenu("academics")}>
            <MenuItem href="/dashboard/classes" label="Classes" icon="📘" />
            <MenuItem href="/dashboard/subjects" label="Subjects" icon="📚" />
            <MenuItem href="/dashboard/examsession" label="Exam Session" icon="📝" />
          </Dropdown>

          <MenuItem href="/dashboard/notices" label="Notices" icon="📢" />

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
            <MenuItem href="/dashboard/admission" label="Dashboard" icon="📊" />
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
          <MenuItem href="/dashboard/other" label="Other" icon="🧩" />
          <MenuItem href="/dashboard/news" label="What's New" icon="📰" />
          <MenuItem href="/dashboard/organization" label="Organization" icon="🏢" />
          <MenuItem href="/dashboard/admins" label="Admins" icon="🧑‍💼" />
          <MenuItem href="/dashboard/support" label="Support" icon="🛠️" />
          <MenuItem href="/dashboard/settings" label="Settings" icon="⚙️" />

          <li className="mt-4">
            <button onClick={handleSignOut} className="text-red-400 hover:text-red-600 font-semibold">
              🚪 Sign Out
            </button>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">{children}</div>
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
        <span className="ml-auto transform transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-down h-5 w-5"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      {open && <ul className="pl-6 mt-2 space-y-2">{children}</ul>}
    </li>
  );
}
