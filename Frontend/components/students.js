"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/lib/api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await API.get("/students");
        setStudents(response.data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  const skeletonRows = Array(5).fill(null);

  return (
    // <div className="relative w-full overflow-auto mt-4">
    //   <table className="w-full text-sm caption-bottom">
    //     <thead>
    //       <tr className="border-b bg-gray-50">
    //         <th className="py-4 px-2 text-left font-semibold text-gray-600">
    //           Organization UID
    //         </th>
    //         <th className="py-4 px-2 text-left font-semibold text-gray-600">
    //           Name
    //         </th>
    //         <th className="py-4 px-2 text-left font-semibold text-gray-600">
    //           Class
    //         </th>
    //         <th className="py-4 px-2 text-left font-semibold text-gray-600">
    //           Phone Number
    //         </th>
    //         <th className="py-4 px-2 text-left font-semibold text-gray-600">
    //           Actions
    //         </th>
    //       </tr>
    //     </thead>

    //     <tbody>
    //       {loading
    //         ? skeletonRows.map((_, idx) => (
    //             <tr key={idx} className="border-b animate-pulse bg-white">
    //               {[...Array(5)].map((_, i) => (
    //                 <td key={i} className="px-2 py-4">
    //                   <div className="h-4 w-24 bg-gray-200 rounded" />
    //                 </td>
    //               ))}
    //             </tr>
    //           ))
    //         : students.map((student) => (
    //             <tr
    //               key={student._id}
    //               className="border-b bg-white transition-colors hover:bg-gray-100"
    //             >
    //               <td className="px-2 py-3 text-gray-700 font-medium">
    //                 {student.orgUID}
    //               </td>
    //               <td className="px-2 py-3 text-gray-900 font-medium">
    //                 {`${student.fName} ${student.mName} ${student.lName}`}
    //               </td>
    //               <td className="px-2 py-3 uppercase">
    //                 {student.admissionClass}
    //               </td>
    //               <td className="px-2 py-3 lowercase">
    //                 {student.contactNumber}
    //               </td>
    //               <td className="px-2 py-3">
    //                 <div className="flex gap-3 items-center">
    //                   <Link href={`/dashboard/students/${student._id}`}>
    //                     <button className="h-8 w-8 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center justify-center transition">
    //                       <svg
    //                         xmlns="http://www.w3.org/2000/svg"
    //                         className="h-4 w-4 text-blue-600"
    //                         fill="none"
    //                         viewBox="0 0 24 24"
    //                         stroke="currentColor"
    //                       >
    //                         <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    //                         <circle cx="12" cy="12" r="3" />
    //                       </svg>
    //                     </button>
    //                   </Link>
    //                   <button className="h-8 w-8 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 flex items-center justify-center transition">
    //                     <svg
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       className="h-4 w-4 text-red-600"
    //                       fill="none"
    //                       viewBox="0 0 24 24"
    //                       stroke="currentColor"
    //                     >
    //                       <path d="M3 6h18" />
    //                       <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    //                       <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    //                       <line x1="10" x2="10" y1="11" y2="17" />
    //                       <line x1="14" x2="14" y1="11" y2="17" />
    //                     </svg>
    //                   </button>
    //                 </div>
    //               </td>
    //             </tr>
    //           ))}
    //     </tbody>
    //   </table>
    // </div>

    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                {/* <Users className="h-6 w-6 text-blue-600" /> */}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Students</h1>
                <p className="text-gray-600">Manage your student records</p>
              </div>
            </div>
            <Link href="/dashboard/admission/new">
              <button className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {/* <Plus className="h-4 w-4" /> */}
                Add Student
              </button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /> */}
            <input
              type="text"
              placeholder="Search students by name, ID, or class..."
              //   value={searchTerm}
              //   onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Table Section */}
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
                        {/* <Users className="h-12 w-12 text-gray-300 mb-4" /> */}
                        <p className="text-gray-500 text-lg font-medium">
                          No students found
                        </p>
                        <p className="text-gray-400 text-sm">
                          {/* {searchTerm
                            ? "Try adjusting your search criteria"
                            : "Get started by adding your first student"} */}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <tr
                      key={student._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-blue-600">
                              {/* {student.orgUID.slice(-2)} */}
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
                            onClick={() => handleView(student._id)}
                            className="inline-flex items-center justify-center p-1 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-150"
                            title="View student details"
                          >
                            {/* <Eye className="h-4 w-4" /> */}
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="inline-flex items-center justify-center p-1 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-150"
                            title="Delete student"
                          >
                            {/* <Trash2 className="h-4 w-4" /> */}
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
