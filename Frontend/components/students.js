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
    const fullName = `${student?.fName || ""} ${student?.mName || ""} ${
      student?.lName || ""
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

            <div className="relative w-full md:w-48">
              <Filter
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full appearance-none pl-10 custom-scrollbar pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              >
                <option value="">All Classes</option>
                {classes.map((cls, idx) => (
                  <option key={idx} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

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
                        <p className="text-gray-400 text-sm">
                        </p>
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
                          <button
                            onClick={() => handleView(student.orgUID)}
                            className="inline-flex cursor-pointer items-center gap-1 px-2 py-1 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-150 text-sm"
                            title="View student details"
                          >
                            <Eye size={16} />
                            View
                          </button>

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
