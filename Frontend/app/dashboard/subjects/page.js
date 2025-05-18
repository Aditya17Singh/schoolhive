"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SubjectDashboard() {
  const [subjects, setSubjects] = useState({ data: [] });
  const [form, setForm] = useState({ class: "" });
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const { data } = await axios.get("http://localhost:5000/api/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const { data } = await axios.get("http://localhost:5000/api/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
  }, []);

 const filteredSubjects =
  subjects.data?.filter((subject) =>
    subject.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!form.class || subject.class === form.class)
  ) || [];


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassSelect = (cls) => {
    setForm((prev) => ({ ...prev, class: cls }));
    setClassDropdownOpen(false);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Search + Class Selector UI */}
      <div className="w-full flex justify-between items-center pb-2">
        <div className="flex items-center gap-6 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors border-slate-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search subjects..."
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Class select dropdown */}
        <div className="relative w-[180px]">
          <button
            type="button"
            role="combobox"
            aria-controls="class-listbox"
            aria-expanded={classDropdownOpen}
            aria-haspopup="listbox"
            className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-[#fcfcfc] px-3 py-2 text-sm shadow-sm bg-gray-500/10 text-black cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-full"
            onClick={() => setClassDropdownOpen((open) => !open)}
          >
            <span style={{ pointerEvents: "none" }}>
              {form.class || "Select Class"}
            </span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 opacity-50"
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

          {/* Dropdown List */}
          {classDropdownOpen && (
            <ul
              id="class-listbox"
              role="listbox"
              tabIndex={-1}
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {classes.length === 0 && (
                <li className="cursor-default select-none py-2 px-3 text-gray-500">
                  No classes found
                </li>
              )}
              {classes.map((cls) => (
                <li
                  key={cls._id || cls.id || cls} // adapt depending on your data shape
                  role="option"
                  aria-selected={form.class === cls.name}
                  className={`cursor-pointer select-none py-2 px-3 hover:bg-indigo-600 hover:text-white ${
                    form.class === cls.name ? "bg-indigo-600 text-white" : ""
                  }`}
                  onClick={() => handleClassSelect(cls.name || cls)}
                >
                  {cls.name || cls}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* You can add the rest of your subjects table and other UI here */}
      {/* Subjects Table */}
      <table className="w-full text-sm caption-bottom">
        <thead className="border-b">
          <tr className="hover:bg-muted/50">
            <th className="px-2 py-3 text-left font-medium text-muted-foreground">
              <button className="flex items-center gap-2 hover:text-accent-foreground">
                Subject Name
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 15 15"
                >
                  <path d="M5 6l2.5-2.5L10 6M5 9l2.5 2.5L10 9" />
                </svg>
              </button>
            </th>
            <th className="px-2 py-3 text-left font-medium text-muted-foreground">
              <button className="flex items-center gap-2 hover:text-accent-foreground">
                Class
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 15 15"
                >
                  <path d="M5 6l2.5-2.5L10 6M5 9l2.5 2.5L10 9" />
                </svg>
              </button>
            </th>
            <th className="px-2 py-3 text-center font-medium text-muted-foreground">
              Teachers
            </th>
            <th className="px-2 py-3 text-center font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {subjects.data?.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-2 text-center text-sm text-gray-500"
              >
                No subjects found.
              </td>
            </tr>
          ) : (
            filteredSubjects?.map(({ _id, subjectName, class: cls, teachers }) => (
              <tr key={_id} className="border-b bg-slate-50 hover:bg-slate-100">
                <td className="px-4 py-2 capitalize">{subjectName}</td>
                <td className="px-4 py-2 text-center">{cls}</td>
                <td className="px-4 py-2 text-center">
                  {teachers.length === 0 ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600">
                      No teachers assigned yet
                    </span>
                  ) : (
                    teachers.join(", ") // assuming teachers is an array of names; adjust if objects
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  <button className="flex items-center gap-1 px-2 py-1 border rounded-full text-slate-600 hover:bg-green-100 hover:text-green-500 hover:border-green-300">
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
                    <span className="text-xs">Edit</span>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

