"use client";

import { useEffect, useState } from "react";
import { Calendar, ChevronDown, Search } from "lucide-react";
import API from "@/lib/api"; // Axios wrapper
import Link from "next/link";

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchExams() {
      try {
        const res = await API.get("/exams");
        setExams(res.data);
      } catch (err) {
        console.error("Error fetching exams:", err);
      }
    }

    fetchExams();
  }, []);

  const filteredExams = exams.filter((exam) =>
    exam.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Exams</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* Search + Button Wrapper */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 h-10 w-full rounded-md border border-gray-300 bg-white text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Create Button */}
          <Link href="/dashboard/academics/new" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 h-10 rounded-md bg-blue-500 text-white text-sm font-medium shadow-sm hover:bg-blue-700 whitespace-nowrap transition">
              Create New Exam
            </button>
          </Link>
        </div>
      </div>

      {/* Exam Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm caption-bottom">
          <thead className="[&_tr]:border-b bg-gray-50">
            <tr>
              <th className="h-10 px-2 text-left font-semibold text-gray-600">
                Exam Name
              </th>
              <th className="h-10 px-2 text-left font-semibold text-gray-600">
                Class
              </th>
              <th className="h-10 px-2 text-left font-semibold text-gray-600">
                Sessions
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {filteredExams.map((exam, index) => (
              <tr
                key={index}
                className={`border-b hover:bg-blue-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-2">
                  <div className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                    {exam.name}
                  </div>
                </td>
                <td className="p-2">
                  <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold">
                    {exam.className}
                  </div>
                </td>
                <td className="p-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-between gap-2 rounded-md border shadow-sm px-4 py-2 w-[200px] h-9 text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>View Sessions</span>
                    </div>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
