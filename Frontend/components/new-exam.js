"use client";

import { useEffect, useState } from "react";

export default function CreateExam() {
  const [examName, setExamName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // Replace with actual API call to get classes
    setClasses([
      { id: "6822f16b8a0c9dee94e269f8", name: "Nursery" },
      { id: "6822f16b8a0c9dee94e269fa", name: "PG" },
      { id: "6822f16b8a0c9dee94e269fc", name: "LKG" },
      { id: "6822f16b8a0c9dee94e269fe", name: "1st" },
      { id: "6822f16b8a0c9dee94e26a00", name: "2nd" },
      { id: "6822f16b8a0c9dee94e26a02", name: "7th" },
      { id: "6822f16b8a0c9dee94e26a04", name: "11th Science" },
      { id: "6822f16b8a0c9dee94e26a06", name: "11th Commerce" },
    ]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add actual POST logic here
    console.log("Creating exam:", { examName, selectedClassId });

    // Reset form
    setExamName("");
    setSelectedClassId("");
  };

  return (
    <div className="pl-6 pt-4">
      <h2 className="text-xl font-semibold mb-4">Create New Exam</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Exam Name */}
        <div>
          <label
            htmlFor="examName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Exam Name
          </label>
          <input
            id="examName"
            type="text"
            placeholder="e.g. First Term Exam"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="w-full h-9 px-3 py-1 border border-gray-400 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* Class Select */}
        <div>
          <label
            htmlFor="class"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Class
          </label>
          <select
            id="class"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full h-9 px-3 py-2 border border-gray-400 rounded-md text-sm bg-[#F7F8FA] shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subjects Message */}
        {selectedClassId && (
          <p className="text-gray-500 font-sans pl-1 text-sm">
            Select class to see subjects (feature coming soon)
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 h-9 rounded-md bg-yellow-400 text-black hover:bg-yellow-500 text-sm font-medium shadow"
        >
          Save new exam
        </button>
      </form>
    </div>
  );
}
