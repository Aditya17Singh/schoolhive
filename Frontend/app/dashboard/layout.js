"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  Menu,
  X,
  Home,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Bell,
  CalendarDays,
  Users,
  UserPlus,
  FileText,
  LineChart,
  DollarSign,
  LayoutDashboard,
  Building,
  Newspaper,
  Settings,
  LifeBuoy,
  BadgeCheck,
  Hash,
  ArrowUp,
  Plus,
  Clock,
  CreditCard,
  UserCog,
  Blocks,
  User,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  const pathname = usePathname();
  const popoverRef = useRef(null);
  const sidebarWidth = 250;

  useEffect(() => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
  }, [pathname]);

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
    router.replace("/login");
  }, [router]);

  const toggleMenu = useCallback((menu) => {
    setOpenMenus((prev) => {
      const allClosed = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      return { ...allClosed, [menu]: !prev[menu] };
    });
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

  const isAcademicsActive = [
    "/dashboard/classes",
    "/dashboard/subjects",
    "/dashboard/academics/exam",
    "/dashboard/session",
  ].some((path) => pathname.startsWith(path));

  const isTeachersActive = [
    "/dashboard/teachers",
    "/dashboard/teachers/dashboard",
    "/dashboard/teachers/manage-application",
  ].some((path) => pathname.startsWith(path));

  const isStudentsActive = [
    "/dashboard/students",
    "/dashboard/students/rollno",
    "/dashboard/students/promote",
  ].some((path) => pathname.startsWith(path));

  const isAdmissionActive = ["/dashboard/admission"].some((path) =>
    pathname.startsWith(path)
  );

  const isAttendanceActive = ["/dashboard/attendance"].some((path) =>
    pathname.startsWith(path)
  );

  const isFeeActive = ["/dashboard/fee"].some((path) =>
    pathname.startsWith(path)
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
    <div className="lg:pl-[250px] pt-16 lg:pt-0">
      <button
        onClick={toggleMobileMenu}
        className={`fixed top-4 left-4 z-50 lg:hidden bg-blue-900 text-white p-2 rounded-lg shadow-lg transition-colors ${
          isMobileMenuOpen ? "hidden" : ""
        }`}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out lg:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      <aside
        className={`
    fixed top-0 left-0 bg-[#F5F7F8] text-black overflow-y-auto z-40 custom-scrollbar
    transform transition-transform duration-400 ease-in-out
    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
    lg:translate-x-0
  `}
        style={{
          width: `${sidebarWidth}px`,
          height: "100%",
        }}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">School Hive</h2>
            <button
              onClick={closeMobileMenu}
              className="lg:hidden text-white hover:text-gray-300"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav>
            <ul className="space-y-2 text-[15px] font-medium text-gray-600">
              <MenuItem
                href="/dashboard"
                icon={<Home className="w-4 h-4" />}
                label="Home"
              />

              <Dropdown
                label="Academics"
                icon={<GraduationCap className="w-4 h-4" />}
                open={openMenus.academics}
                toggle={() => toggleMenu("academics")}
                active={isAcademicsActive}
              >
                <MenuItem
                  href="/dashboard/classes"
                  label="Classes"
                  icon={<BookOpen className="w-4 h-4" />}
                />
                <MenuItem
                  href="/dashboard/class-timetable"
                  label="Class Timetable"
                  icon={<ClipboardList className="w-4 h-4" />}
                />
                <MenuItem
                  href="/dashboard/subjects"
                  label="Subjects"
                  icon={<BookOpen className="w-4 h-4" />}
                />
                <MenuItem
                  href="/dashboard/academics/exam"
                  label="Exam"
                  icon={<ClipboardList className="w-4 h-4" />}
                />
                <MenuItem
                  href="/dashboard/session"
                  label="Session"
                  icon={<ClipboardList className="w-4 h-4" />}
                />
              </Dropdown>

              <MenuItem
                href="/dashboard/notices"
                label="Notices"
                icon={<Bell className="w-4 h-4" />}
              />
              <MenuItem
                href="/dashboard/calendar"
                label="Calendar"
                icon={<CalendarDays className="w-4 h-4" />}
              />

              <Dropdown
                label="Teachers"
                icon={<Users className="w-4 h-4" />}
                open={openMenus.teachers}
                toggle={() => toggleMenu("teachers")}
                active={isTeachersActive}
              >
                <MenuItem
                  href="/dashboard/teachers/dashboard"
                  label="Dashboard"
                  icon={<LayoutDashboard className="w-4 h-4" />}
                />
                <MenuItem
                  href="/dashboard/teachers/manage-application"
                  label="Manage Applications"
                  icon={<FileText className="w-4 h-4" />}
                />
                <MenuItem
                  href="/dashboard/teachers"
                  label="New Teacher"
                  icon={<UserPlus className="w-4 h-4" />}
                />
              </Dropdown>

              <Dropdown
                label="Students"
                icon={<Users className="w-4 h-4" />}
                open={openMenus.students}
                toggle={() => toggleMenu("students")}
                active={isStudentsActive}
              >
                <MenuItem
                  href="/dashboard/students"
                  label="Dashboard"
                  icon={<LayoutDashboard className="w-4 h-4" />}
                />
                <MenuItem
                  href="/dashboard/students/rollno"
                  label="Manage Roll No"
                  icon={<Hash className="w-4 h-4" />}
                />
                <MenuItem
                  href="/dashboard/promote-students"
                  label="Promote Student"
                  icon={<ArrowUp className="w-4 h-4" />}
                />
              </Dropdown>

              <Dropdown
                label="Admission"
                icon={<FileText className="w-4 h-4" />}
                open={openMenus.admission}
                toggle={() => toggleMenu("admission")}
                active={isAdmissionActive}
              >
                <MenuItem
                  href="/dashboard/admission/stats"
                  label="Dashboard"
                  icon={<LayoutDashboard className="w-4 h-4" />}
                />
                <MenuItem
                  href="/dashboard/admission/new"
                  label="New Admission"
                  icon={<Plus className="w-4 h-4" />}
                />
              </Dropdown>

              <Dropdown
                label="Attendance"
                icon={<Clock className="w-4 h-4" />}
                open={openMenus.attendance}
                toggle={() => toggleMenu("attendance")}
                active={isAttendanceActive}
              >
                <MenuItem
                  href="/dashboard/attendance"
                  label="Dashboard"
                  icon={<LayoutDashboard className="w-4 h-4" />}
                />
              </Dropdown>

              <Dropdown
                label="Fee"
                icon={<DollarSign className="w-4 h-4" />}
                open={openMenus.fee}
                toggle={() => toggleMenu("fee")}
                active={isFeeActive}
              >
                <MenuItem
                  href="/dashboard/fee"
                  label="Dashboard"
                  icon={<LayoutDashboard className="w-4 h-4" />}
                />
                <MenuItem
                  href="/dashboard/fee/structures"
                  label="Structures"
                  icon={<Blocks className="w-4 h-4" />}
                />
                <MenuItem
                  href="/dashboard/fee/payments"
                  label="Payments"
                  icon={<CreditCard className="w-4 h-4" />}
                />
              </Dropdown>

              <MenuItem
                href="/dashboard/results"
                label="Result"
                icon={<LineChart className="w-4 h-4" />}
              />

              {/* Others Section */}
              <li className="mt-8 mb-4">
                <div className="text-xs uppercase tracking-wider font-semibold px-3">
                  Others
                </div>
              </li>

              <MenuItem
                href="/dashboard/news"
                label="What's New"
                icon={<Newspaper className="w-4 h-4" />}
              />
              <MenuItem
                href="/dashboard/organization"
                label="Organization"
                icon={<Building className="w-4 h-4" />}
              />
              <MenuItem
                href="/dashboard/admins"
                label="Admins"
                icon={<UserCog className="w-4 h-4" />}
              />
              <MenuItem
                href="/dashboard/support"
                label="Support"
                icon={<LifeBuoy className="w-4 h-4" />}
              />
              <MenuItem
                href="/dashboard/settings"
                label="Settings"
                icon={<Settings className="w-4 h-4" />}
              />
            </ul>
          </nav>
        </div>
      </aside>

      <div className="flex flex-col">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 lg:left-[250px] z-20 bg-white shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Link href="/dashboard/ai">
                  <button
                    type="button"
                    aria-label="Go to AI dashboard. Available AI Credits: 100"
                    title="Available AI Credits: 100"
                    className="
            group
            flex items-center gap-3 px-4 py-2 rounded-full border border-blue-200
            bg-white shadow-md hover:shadow-lg
            transition-all duration-150
            hover:bg-blue-50
            focus:outline-none focus:ring-2 focus:ring-blue-400
            cursor-pointer
          "
                  >
                    <span className="text-base font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                      AI
                    </span>
                    <div
                      className="
              flex items-center gap-1
              bg-gradient-to-r from-blue-500 to-indigo-500
              rounded-full px-3 py-1
              text-white text-sm font-semibold
              shadow
              border border-blue-600
              transition-all
              group-hover:scale-105
            "
                    >
                      <span className="text-sm font-bold">100</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-flame h-4 w-4 text-white ml-1"
                      >
                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                      </svg>
                    </div>
                  </button>
                </Link>
              </div>
              {/* Search Bar - Hidden on mobile, visible on desktop */}
              <div className="hidden lg:block flex-1 max-w-md">
                <div className="flex gap-2 items-center px-4 border-2 border-gray-200 bg-gray-50 rounded-full">
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="flex-1 h-9 bg-transparent outline-none text-sm"
                  />
                </div>
              </div>

              {/* Spacer for mobile - pushes user menu to right */}
              <div className="flex-1 lg:hidden"></div>

              {/* User Menu */}
              <div className="flex-shrink-0" ref={popoverRef}>
                <div
                  onClick={() => setOpen((prev) => !prev)}
                  className="relative flex items-center px-2 py-1 hover:bg-gray-50 rounded-lg shadow-sm hover:shadow cursor-pointer gap-3 group min-w-0"
                >
                  <h2 className="text-sm font-medium text-black group-hover:text-gray-900 truncate max-w-[120px] sm:max-w-none">
                    {user?.name}
                  </h2>
                  <img
                    src="https://serp-bucket-123538789.s3.amazonaws.com/uploads/6822f0fd8a0c9dee94e269f5/6822f0fd8a0c9dee94e269f5-1747120381920-market-sentiment-option1.png"
                    alt="User Avatar"
                    className="h-8 w-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
                  />

                  {/* Dropdown Menu */}
                  {open && (
                    <div className="absolute top-full right-0 mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <ul className="text-sm">
                        <li>
                          <Link
                            href="/dashboard/organization"
                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                            onClick={() => setOpen(false)}
                          >
                            <User className="h-4 w-4" /> Profile
                          </Link>
                        </li>
                        <li>
                          <button
                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                            onClick={handleSignOut}
                          >
                            <LogOut className="h-4 w-4" /> Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Search Bar - Below main header on mobile */}
            <div className="lg:hidden mt-3">
              <div className="flex gap-2 items-center px-4 border-2 border-gray-200 bg-gray-50 rounded-full">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 h-9 bg-transparent outline-none text-sm"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 pt-20 lg:pt-16 bg-white min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

function MenuItem({ href, label, icon }) {
  const pathname = usePathname();

  if (href === "/dashboard") {
    const isActive = pathname === href;
    return (
      <li>
        <Link
          href={href}
          className={`flex items-center gap-2 ${
            isActive ? "text-blue-400 font-semibold" : ""
          }`}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </Link>
      </li>
    );
  }

  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-2 ${
          isActive ? "text-blue-400 font-semibold" : ""
        }`}
      >
        <span>{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
}

function Dropdown({ label, icon, open, toggle, active, children }) {
  return (
    <li>
      <button
        onClick={toggle}
        className={`flex items-center gap-2 w-full ${
          active ? "text-blue-400 font-semibold" : ""
        }`}
      >
        <span>{icon}</span>
        <span>{label}</span>
        <span
          className="ml-auto transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
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
      width="24"
      height="24"
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
      width="20"
      height="20"
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
