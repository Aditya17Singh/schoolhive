"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function PromoteStudents() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [currentClass, setCurrentClass] = useState("");
  const [currentSection, setCurrentSection] = useState("");
  const [futureClass, setFutureClass] = useState("");
  const [futureSection, setFutureSection] = useState("");

  // Load all classes
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

    try {
      const res = await API.get("/students", {
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
  const futureClassObj = classes.find((c) => c.name === futureClass);

  const availableCurrentSections = currentClassObj?.sections || [];
  const availableFutureSections = futureClassObj?.sections || [];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Controls */}
      <div className="flex justify-between items-center w-full gap-4">
        {/* Left side */}
        <div className="flex gap-3 items-center">
          <DropdownButton
            label="Select Current Class"
            value={currentClass}
            setValue={setCurrentClass}
            options={classes.map((c) => c.name)}
          />
          <DropdownButton
            label="Select Current Section"
            value={currentSection}
            setValue={setCurrentSection}
            options={availableCurrentSections}
          />
          <button
            onClick={handleSearch}
            disabled={!currentClass || !currentSection}
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 transition-colors disabled:opacity-50"
          >
            Search
          </button>
        </div>

        {/* Right side */}
        <div className="flex gap-3 items-center">
          <button
            onClick={handlePromote}
            disabled={
              selectedStudents.length === 0 || !futureClass || !futureSection
            }
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 transition-colors disabled:opacity-50"
          >
            Promote selected
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

      {/* Students List */}
      {students.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Students in {currentClass} - {currentSection}
          </h3>
          <div className="flex flex-col gap-2">
            {students.map((student) => (
              <label key={student._id} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStudents((prev) => [...prev, student._id]);
                    } else {
                      setSelectedStudents((prev) =>
                        prev.filter((id) => id !== student._id)
                      );
                    }
                  }}
                />
                <span>
                  <strong>ID:</strong> {student._id.slice(-6)} |{" "}
                  <strong>Name:</strong> {student.fName} {student.lName} |{" "}
                  <strong>Class:</strong> {student.admissionClass} |{" "}
                  <strong>Section:</strong> {currentSection}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownButton({ label, value, setValue, options = [] }) {
  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="flex h-9 min-w-[150px] items-center rounded-md border px-3 py-2 text-sm bg-[#F7F8FA] shadow-sm"
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
