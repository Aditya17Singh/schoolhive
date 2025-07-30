"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function PromoteStudents() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [futureClass, setFutureClass] = useState("");
  const [futureSection, setFutureSection] = useState("");

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentClass, setCurrentClass] = useState("");
  const [currentSection, setCurrentSection] = useState("");

  //   // Load all classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("/classes");
        setClasses(res.data);
      } catch (err) {
        console.error("Failed to load classes:", err);
      }
    };

    fetchClasses();
  }, []);

  // Fetch students for selected class/section
  const handleSearch = async () => {
    const selectedClass = classes.find((c) => c.name === currentClass);
    if (!selectedClass) return alert("Class not found");

    setLoading(true);
    try {
      const res = await API.get("/students/search", {
        params: {
          classId: selectedClass._id,
          section: currentSection,
        },
      });

      setStudents(res.data);
      setSelectedStudents([]);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      alert("Could not load students.");
    } finally {
      setLoading(false);
    }
  };

  // Handle select all students
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStudents(students.map((student) => student._id));
    } else {
      setSelectedStudents([]);
    }
  };

  // Handle individual student selection
  const handleStudentSelect = (studentId, checked) => {
    if (checked) {
      setSelectedStudents((prev) => [...prev, studentId]);
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handlePromote = async () => {
    const targetClass = classes.find((c) => c.name === futureClass);
    if (!targetClass) return alert("Future class not found");

    try {
      await API.put("/students/promote", {
        studentIds: selectedStudents,
        newClassId: targetClass._id,
        newSection: futureSection,
      });

      alert("Students promoted successfully!");
      setStudents([]);
      setSelectedStudents([]);
    } catch (err) {
      console.error("Promotion error:", err);
      alert("Promotion failed.");
    }
  };

  const currentClassObj = classes.find((c) => c.name === currentClass);
  const availableCurrentSections = currentClassObj?.sections || [];

  const futureClassObj = classes.find((c) => c.name === futureClass);
  const availableFutureSections = futureClassObj?.sections || [];

  const allSelected =
    students.length > 0 && selectedStudents.length === students.length;
  const someSelected =
    selectedStudents.length > 0 && selectedStudents.length < students.length;

  return (
    <div className="flex flex-col gap-4 w-full mt-8 pl-4 pr-4">
      {/* Controls */}
      <div className="flex justify-between items-center w-full gap-4">
        {/* Left side - Search Controls */}
        <div className="flex gap-3 items-center">
          <DropdownButton
            label="Select Class"
            value={currentClass}
            setValue={setCurrentClass}
            options={classes.map((c) => c.name)}
          />
          <DropdownButton
            label="Select Section"
            value={currentSection}
            setValue={setCurrentSection}
            options={availableCurrentSections}
          />
          <button
            onClick={handleSearch}
            disabled={!currentClass || !currentSection || loading}
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2 transition-colors disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search Students"}
          </button>
        </div>

        {/* Right side - Promotion Controls */}
        <div className="flex gap-3 items-center">
          <button
            onClick={handlePromote}
            disabled={
              selectedStudents.length === 0 || !futureClass || !futureSection
            }
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-green-600 text-white shadow hover:bg-green-700 h-9 px-4 py-2 transition-colors disabled:opacity-50"
          >
            Promote Selected
          </button>
          <DropdownButton
            label="Select Future Class"
            value={futureClass}
            setValue={setFutureClass}
            options={classes.map((c) => c.name)}
          />
          <DropdownButton
            label="Select Future Section"
            value={futureSection}
            setValue={setFutureSection}
            options={availableFutureSections}
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="mt-6 w-full">
        {currentClass && currentSection && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Students in Class {currentClass} - Section {currentSection}
            </h3>
            {students.length > 0 && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 border border-dashed border-gray-300 p-6 rounded-xl">
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="text-center text-gray-500 border border-dashed border-gray-300 p-6 rounded-xl">
            {currentClass && currentSection
              ? `No students found in Class ${currentClass} - Section ${currentSection}.`
              : "Select a class and section to view students."}
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="w-12 p-4 text-left">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(input) => {
                          if (input) input.indeterminate = someSelected;
                        }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded"
                      />
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-900">
                      Avatar
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-900">
                      Student Name
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-900">
                      Student ID
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-900">
                      Class
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-900">
                      Section
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={student._id}
                      className={`border-b hover:bg-gray-50 ${
                        selectedStudents.includes(student._id)
                          ? "bg-blue-50"
                          : ""
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student._id)}
                          onChange={(e) =>
                            handleStudentSelect(student._id, e.target.checked)
                          }
                          className="rounded"
                        />
                      </td>
                      <td className="p-4">
                        <img
                          src={student.avatar}
                          alt="Student Avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        {student.fName} {student.lName}
                      </td>
                      <td className="p-4 font-mono text-sm text-gray-700">
                        {student._id.slice(-6)}
                      </td>
                      <td className="p-4 font-semibold text-blue-600">
                        {student.admissionClass}
                      </td>
                      <td className="p-4 font-semibold text-green-600">
                        {student.section}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        {students.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
            <span>
              Total Students:{" "}
              <span className="font-semibold text-gray-900">
                {students.length}
              </span>
            </span>
            <span>
              Selected:{" "}
              <span className="font-semibold text-blue-600">
                {selectedStudents.length}
              </span>
            </span>
            <span>
              Active:{" "}
              <span className="font-semibold text-green-600">
                {students.filter((s) => s.status === "Active").length}
              </span>
            </span>
            <span>
              Inactive:{" "}
              <span className="font-semibold text-red-600">
                {students.filter((s) => s.status === "Inactive").length}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function DropdownButton({ label, value, setValue, options = [] }) {
  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="flex h-9 min-w-[150px] items-center rounded-md border px-3 py-2 text-sm bg-[#F7F8FA] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">{label}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
