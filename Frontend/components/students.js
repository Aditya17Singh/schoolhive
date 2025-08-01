"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/lib/api";
import { Search, Plus, Eye, Trash2, Filter } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [studentsRes, classesRes] = await Promise.all([
          API.get("/students"),
          API.get("/classes"),
        ]);
        setStudents(studentsRes.data);
        setClasses(classesRes.data.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  const filteredStudents = students.filter((student) => {
    const fullName = `${student?.fName || ""} ${student?.mName || ""} ${student?.lName || ""
      }`.toLowerCase();
    const orgUID = student?.orgUID?.toLowerCase() || "";
    const admissionClass = student?.admissionClass?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      fullName.includes(term) ||
      orgUID.includes(term) ||
      admissionClass.includes(term);

    const matchesClass =
      selectedClass === "" || admissionClass === selectedClass.toLowerCase();

    return matchesSearch && matchesClass;
  });

  const handleClassSelect = (clsName) => {
    setSelectedClass(clsName);
    setClassDropdownOpen(false);
  };

  const renderDropdown = () => (
    <div className="relative w-48">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={classDropdownOpen}
        className="flex h-11 items-center justify-between rounded-lg border border-gray-200 px-4 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 w-full transition-colors duration-200"
        onClick={() => setClassDropdownOpen((open) => !open)}
      >
        <span className="truncate">
          {selectedClass ? selectedClass : "All Classes"}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${classDropdownOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path
            d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {classDropdownOpen && (
        <div className="absolute z-20 mt-2 w-full rounded-lg bg-white shadow-xl border border-gray-200 py-1 max-h-60 overflow-auto">
          <div
            className="cursor-pointer py-2 px-4 hover:bg-blue-50 text-sm text-gray-700 border-b border-gray-100"
            onClick={() => handleClassSelect("")}
          >
            All Classes
          </div>
          {loading.classes ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="py-2 px-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))
          ) : classes.length === 0 ? (
            <div className="py-3 px-4 text-gray-500 text-sm">No classes found</div>
          ) : (
            classes.map((cls) => (
              <div
                key={cls._id || cls.id || cls}
                role="option"
                className={`cursor-pointer py-2 px-4 text-sm hover:bg-blue-50 transition-colors duration-150 ${selectedClass === cls.name ? "bg-blue-100 text-blue-800 font-medium" : "text-gray-700"}
                  }`}
                onClick={() => handleClassSelect(cls.name || cls)}
              >
                {cls.name || cls}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const skeletonRows = Array(5).fill(null);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name, ID, or class"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>

            <div className="w-full sm:w-auto">{renderDropdown()}</div>

            <Link
              href="/dashboard/admission/new"
              className="self-start md:self-auto"
            >
              <button className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus size={16} />
                Add Student
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Student Records
                {!loading && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({students.length} students)
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  skeletonRows.map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      {[...Array(5)].map((_, i) => (
                        <td key={i} className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-gray-500 text-lg font-medium">
                          No students found
                        </p>
                        <p className="text-gray-400 text-sm"></p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents?.map((student, index) => (
                    <tr
                      key={student.orgUID}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-blue-600">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {student.orgUID}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {`${student.fName} ${student.mName} ${student.lName}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {student.admissionClass}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 font-mono">
                          {student.contactNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/students/${student.orgUID}`}
                            className="inline-flex cursor-pointer items-center gap-1 px-2 py-1 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-150 text-sm"
                            title="View student details"
                          >
                            <Eye size={16} />
                            View
                          </Link>

                          <button
                            onClick={() => handleDelete(student.orgUID)}
                            className="inline-flex cursor-pointer items-center gap-1 px-2 py-1 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-150 text-sm"
                            title="Delete student"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        {!loading && students.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {students.length} of {students.length} students
              </span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
