"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CirclePlus } from 'lucide-react';
import axios from "axios";
import { AddSubjectsDialog } from "./add-subject-dialog";
import SectionDialog from "./class-section";

export default function ClassList() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Forms
  const [classForm, setClassForm] = useState({ name: "", section: "" });

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Toast Notification Function
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((toast) => toast.id !== id)),
      3000
    );
  };

  // User Authentication Check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.replace("/");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "organization") {
      router.replace("/");
      return;
    }

    setUser(parsedUser);
    fetchClasses();
  }, []);

  // Fetch Classes from API
  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/classes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setClasses(res.data);
    } catch (error) {
      console.error(error);
      showToast("Error fetching classes", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle Search for Classes
  const handleClassSearch = (e) => setSearch(e.target.value);

  // Escape Regular Expression Characters
  const escapeRegExp = (string) =>
    string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");

  // Filtered Classes Based on Search
  const sortedClasses = [...classes].sort((a, b) => a.order - b.order);

  const filteredClasses = sortedClasses.filter((cls) =>
    `${cls.name} ${cls.section}`
      .toLowerCase()
      .includes(escapeRegExp(search.toLowerCase()))
  );

  //for subject
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [subjectMap, setSubjectMap] = useState({});

  const handleOpenDialog = (classId) => {
    setSelectedClassId(classId);
    setDialogOpen(true);
  };

  const handleSaveSubjects = (subjects) => {
    if (selectedClassId) {
      setSubjectMap((prev) => ({
        ...prev,
        [selectedClassId]: subjects,
      }));
    }
  };

  //for section
  const [showSectionDialog, setShowSectionDialog] = useState(false);
const [selectedSections, setSelectedSections] = useState(["A"]);
const [compulsorySections, setCompulsorySections] = useState(["A"]);
const allSections = ["A", "B", "C", "D", "E", "F", "G" ,"H", "I", "J"];

const handleToggleSection = (section) => {
  setSelectedSections((prev) =>
    prev.includes(section)
      ? prev.filter((s) => s !== section)
      : [...prev, section]
  );
};

const handleRemoveSection = (section) => {
  setSelectedSections((prev) => prev.filter((s) => s !== section));
};

const handleSaveSections = async () => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/classes/${selectedClassId}/sections`,
      { sections: selectedSections },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    showToast("Sections updated successfully!");
    fetchClasses(); // Refresh
  } catch (error) {
    console.error(error);
    showToast("Failed to update sections", "error");
  } finally {
    setShowSectionDialog(false);
  }
};



  // Loading Skeleton
  if (loading) {
    return (
      <div className="p-6 gap-6">
        {/* Skeleton for Left Side */}
        <div className="bg-white p-6 shadow-md rounded-lg space-y-4 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>

        {/* Skeleton for Right Side */}
        <div className="bg-white p-6 shadow-md rounded-lg space-y-4 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded shadow-md text-white ${
              toast.type === "error" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-6">Manage Classes & Students</h1>

      <div className="grid gap-6">
        {/* LEFT SIDE: Class Actions */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={handleClassSearch}
            className="flex w-full border bg-transparent px-3 py-1 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-12 h-11 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Search ClassName..."
          />
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <div className="bg-white p-6 shadow-md rounded-lg">
          <div className="w-full max-h-[500px] overflow-y-auto  rounded-md shadow-md custom-scrollbar">
            <table className="w-full text-sm caption-bottom">
              <thead className="[&>tr]:border-b bg-gray-50 text-gray-700 sticky top-0 z-10">
                <tr className="border-b border-gray-200 hover:bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold">
                    Class Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Subjects
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Add Subjects
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-center">
                    Sections
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Class Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses
                  .sort((a, b) => a.order - b.order) // ensure correct sorting by order
                  .map((cls, idx) => (
                    <tr
                      key={cls._id}
                      className={`${
                        idx !== filteredClasses.length - 1 ? "border-b" : ""
                      } hover:bg-gray-100 ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      {/* Class Name */}
                      <td className="px-4 py-3 text-center capitalize">
                        {cls.name}
                      </td>

                      {/* Subjects */}
                      <td className="px-4 py-3">
                        {cls.subjects.length === 0 ? (
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
                            No subjects added yet
                          </span>
                        ) : (
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-200">
                            {cls.subjects.length} Subjects
                          </span>
                        )}
                      </td>

                      {/* Add Subjects */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleOpenDialog(cls._id)}
                          className="inline-flex gap-2 items-center px-4 py-2 text-sm font-medium shadow-sm rounded-md bg-background hover:bg-accent hover:text-accent-foreground"
                        >
                          <span className="text-xs font-medium px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                            {cls.subjects.length}
                          </span>
                         <CirclePlus/>
                          Add Subjects
                        </button>
                      </td>

                      {/* Sections */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center items-center gap-1">
                          <div className="w-7 aspect-square flex items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-sm font-medium">
                            {cls.section}
                          </div>
                          <button
onClick={() => {
  setSelectedClassId(cls._id);
  setSelectedSections(cls.sections || ["A"]); // Set current sections
  setShowSectionDialog(true);
}}
                            className="hover:text-blue-600"
                          >
                            <svg
                              className="w-7 h-7"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M8 12h8M12 8v8" />
                            </svg>
                          </button>
                        </div>
                      </td>

                      {/* Class Type */}
                      <td className="px-4 py-3 capitalize">
                        {cls.type.replace("-", " ")}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <AddSubjectsDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSave={handleSaveSubjects}
          />

          <SectionDialog
            show={showSectionDialog}
            onClose={() => setShowSectionDialog(false)}
            selectedSections={selectedSections}
            compulsorySections={compulsorySections}
            allSections={allSections}
            handleRemoveSection={handleRemoveSection}
            handleToggleSection={handleToggleSection}
            handleSaveSections={handleSaveSections}
          />
        </div>
      </div>
    </div>
  );
}

