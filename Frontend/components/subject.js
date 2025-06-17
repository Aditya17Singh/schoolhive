"use client";

import * as Dialog from "@radix-ui/react-dialog";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import API from "@/lib/api";

export default function SubjectDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ class: "" });
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [loading, setLoading] = useState({ subjects: true, classes: true });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [teachers1, setTeachers] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [originalTeachers, setOriginalTeachers] = useState([]);

  const fetchData = useCallback(async (endpoint, setter, key) => {
    try {
      setLoading((prev) => ({ ...prev, [key]: true }));
      const { data } = await API.get(`/${endpoint}`);
      setter(endpoint === "subjects" ? data.data : data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      const { data } = await API.get("/teachers");
      if (data.success) {
        setTeachers(data.data);
      } else {
        console.error("Failed to fetch teachers:", data.message);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading((prev) => ({ ...prev, teachers: false }));
    }
  }, []);

  const handleTeacherAssignment = async () => {
    try {
      const toAdd = selectedTeachers.filter(
        (id) => !originalTeachers.includes(id)
      );
      const toRemove = originalTeachers.filter(
        (id) => !selectedTeachers.includes(id)
      );

      const { data } = await API.put(
        `/subjects/assign-teacher/${selectedSubject._id}`,
        { add: toAdd, remove: toRemove }
      );

      if (data.success) {
        setDialogOpen(false);
        await fetchData("subjects", setSubjects, "subjects");
      } else {
        console.error("Error assigning/removing teachers", data);
      }
    } catch (error) {
      console.error("Error updating teacher assignment:", error);
    }
  };

  useEffect(() => {
    fetchData("subjects", setSubjects, "subjects");
    fetchData("classes", setClasses, "classes");
    fetchTeachers();
  }, [fetchData, fetchTeachers]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter(
      ({ subjectName, class: cls }) =>
        subjectName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!form.class || form.class === cls)
    );
  }, [subjects, searchQuery, form.class]);

  const handleClassSelect = (cls) => {
    setForm((prev) => ({ ...prev, class: cls }));
    setClassDropdownOpen(false);
  };

  const handleEditClick = ({ _id, subjectName, class: cls, teachers }) => {
    setSelectedSubject({ _id, subjectName, class: cls });
    const teacherIds = teachers.map((t) => t._id);
    setSelectedTeachers(teacherIds);
    setOriginalTeachers(teacherIds);
    setDialogOpen(true);
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
        <span className="truncate">{form.class || "All Classes"}</span>
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
                aria-selected={form.class === cls.name}
                className={`cursor-pointer py-2 px-4 text-sm hover:bg-blue-50 transition-colors duration-150 ${
                  form.class === cls.name ? "bg-blue-100 text-blue-800 font-medium" : "text-gray-700"
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

  const renderLoadingRow = () => (
    <tr className="border-b border-gray-100">
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
      </td>
      <td className="px-6 py-4">
        <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subject Dashboard</h1>
          <p className="text-gray-600">Manage subjects and teacher assignments</p>
        </div>

        {/* Search and Filter Section */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Search Field */}
            <div className="w-full sm:max-w-md">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Subjects
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by subject name..."
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Dropdown */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Class
              </label>
              {renderDropdown()}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Subjects ({filteredSubjects.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {[
                    "Subject Name",
                    "Class",
                    "Assigned Teachers",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading.subjects ? (
                  Array.from({ length: Math.min(Math.max(subjects.length || 5, 5), 8) }, (_, i) => (
                    <React.Fragment key={i}>{renderLoadingRow()}</React.Fragment>
                  ))
                ) : filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium">No subjects found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map(
                    ({ _id, subjectName, class: cls, teachers }) => (
                      <tr
                        key={_id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 capitalize">
                            {subjectName}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {cls}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {teachers.length ? (
                            <div className="flex flex-wrap gap-1">
                              {teachers.map((teacher, index) => (
                                <span 
                                  key={teacher._id}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
                                >
                                  {teacher.fName} {teacher.lName}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              No teachers assigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              handleEditClick({
                                _id,
                                subjectName,
                                class: cls,
                                teachers,
                              })
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                            </svg>
                            Manage Teachers
                          </button>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* Custom Dialog */}
        {dialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
              onClick={() => setDialogOpen(false)}
            />
            
            {/* Dialog Content */}
            <div className="relative z-50 w-[90vw] max-w-lg bg-white rounded-xl shadow-2xl">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Teacher Assignment
                  </h2>
                  <button
                    onClick={() => setDialogOpen(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-6">
                  {selectedSubject && (
                    <>
                      Manage teachers for <span className="font-medium text-gray-900">{selectedSubject.subjectName}</span> in <span className="font-medium text-gray-900">{selectedSubject.class}</span>
                    </>
                  )}
                </p>

                {/* Teachers List */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Available Teachers</h3>
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-3">
                    {teachers1.length === 0 ? (
                      <p className="text-sm text-gray-500 py-4 text-center">No teachers available.</p>
                    ) : (
                      teachers1.map((teacher) => (
                        <label
                          key={teacher._id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={selectedTeachers.includes(String(teacher._id))}
                            onChange={() => {
                              if (selectedTeachers.includes(teacher._id)) {
                                setSelectedTeachers(
                                  selectedTeachers.filter((id) => id !== teacher._id)
                                );
                              } else {
                                setSelectedTeachers([
                                  ...selectedTeachers,
                                  teacher._id,
                                ]);
                              }
                            }}
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">
                              {teacher.fName} {teacher.lastName}
                            </span>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setDialogOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTeacherAssignment}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
