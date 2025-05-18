"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CirclePlus } from "lucide-react";
import axios from "axios";
import { AddSubjectsDialog } from "./add-subject-dialog";
import SectionDialog from "./class-section";

export default function ClassList() {
  const router = useRouter();

  // State management
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const fetchClasses = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data);
    } catch (error) {
      console.error(error);
      showToast("Error fetching classes", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Auth + Init fetch
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      return router.replace("/");
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "organization") {
        return router.replace("/");
      }

      setUser(parsedUser);
      fetchClasses();
    } catch {
      router.replace("/");
    }
  }, [fetchClasses, router]);

  const handleClassSearch = (e) => setSearch(e.target.value);

  const escapeRegExp = (string) =>
    string.replace(/[.*+?^=!:${}()|[\]/\\]/g, "\\$&");

  const sortedClasses = useMemo(
    () => [...classes].sort((a, b) => a.order - b.order),
    [classes]
  );

  const filteredClasses = useMemo(() => {
    const pattern = escapeRegExp(search.toLowerCase());
    return sortedClasses.filter((cls) =>
      `${cls.name} ${cls.section}`.toLowerCase().includes(pattern)
    );
  }, [search, sortedClasses]);

  // Subject dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const handleOpenDialog = (classId) => {
    setSelectedClassId(classId);
    setDialogOpen(true);
  };

  const handleSaveSubjects = useCallback(
    async (subjects) => {
      if (!selectedClassId) return;

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const orgId = user?.id;
        const res = await fetch(
          "http://localhost:5000/api/classes/add-subject",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              classId: selectedClassId,
              subjectNames: subjects,
              orgId,
            }),
          }
        );

        const data = await res.json();

        if (res.ok && data.classData?.subjects) {
          setClasses((prev) =>
            prev.map((cls) =>
              cls._id === selectedClassId
                ? { ...cls, subjects: data.classData.subjects }
                : cls
            )
          );
          showToast("Subjects updated successfully!");
          setDialogOpen(false);
        } else {
          showToast("Failed to update subjects", "error");
        }
      } catch (error) {
        console.error("Error adding subjects:", error);
        showToast("Error adding subjects", "error");
      }
    },
    [selectedClassId, showToast]
  );

  // Section dialog states
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [selectedSections, setSelectedSections] = useState(["A"]);
  const [compulsorySections] = useState(["A"]);
  const allSections = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

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

  const handleSaveSections = useCallback(async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/classes/${selectedClassId}/sections`,
        { sections: selectedSections },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        setClasses((prev) =>
          prev.map((cls) =>
            cls._id === selectedClassId
              ? { ...cls, sections: selectedSections }
              : cls
          )
        );
        showToast("Sections updated successfully!");
      } else {
        showToast("Failed to update sections", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to update sections", "error");
    } finally {
      setShowSectionDialog(false);
    }
  }, [selectedClassId, selectedSections, showToast]);

  const selectedClass = useMemo(() => {
    return classes.find((cls) => cls._id === selectedClassId);
  }, [classes, selectedClassId]);

  const classSubjectNames = useMemo(() => {
    return selectedClass?.subjects?.map((s) => s.name) || [];
  }, [selectedClass]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="bg-white p-6 shadow-md rounded-lg space-y-4 animate-pulse"
          >
            <div className="h-6 w-1/3 bg-gray-300 rounded"></div>

            <div className="w-full h-10 bg-gray-200 rounded"></div>

            <div className="grid grid-cols-5 gap-4">
              <div className="h-8 bg-gray-200 rounded col-span-1"></div>
              <div className="h-8 bg-gray-200 rounded col-span-1"></div>
              <div className="h-8 bg-gray-200 rounded col-span-1"></div>
              <div className="h-8 bg-gray-200 rounded col-span-1"></div>
              <div className="h-8 bg-gray-200 rounded col-span-1"></div>
            </div>
          </div>
        ))}
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
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={handleClassSearch}
            className="w-full border px-3 py-2 pl-10 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Search ClassName..."
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Class Table */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <div className="w-full max-h-[500px] overflow-y-auto rounded-md custom-scrollbar">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10 text-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">
                    Class Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Subjects
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Add Subjects
                  </th>
                  <th className="px-6 py-4 text-center font-semibold">
                    Sections
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Class Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((cls, idx) => (
                  <tr
                    key={cls._id}
                    className={`${
                      idx !== filteredClasses.length - 1 ? "border-b" : ""
                    } ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-4 py-3 capitalize text-center">
                      {cls.name}
                    </td>
                    <td className="px-4 py-3">
                      {cls.subjects.length === 0 ? (
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
                          No subjects added yet
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {cls.subjects.map((subject) => (
                            <span
                              key={subject._id}
                              className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-800 border border-green-300"
                              title={subject.name}
                            >
                              {subject.name.length > 20
                                ? subject.name.slice(0, 20) + "…"
                                : subject.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleOpenDialog(cls._id)}
                        className="cursor-pointer inline-flex gap-2 items-center px-4 py-2 text-sm font-medium shadow-sm rounded-md bg-background hover:bg-accent hover:text-accent-foreground"
                      >
                        <span className="text-xs font-medium px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                          {cls.subjects.length}
                        </span>
                        <CirclePlus />
                        Add Subjects
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center items-center gap-1 flex-wrap">
                        {[...cls.sections].sort().map((sec) => (
                          <div
                            key={sec}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-sm font-medium"
                          >
                            {sec}
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            setSelectedClassId(cls._id);
                            setSelectedSections(cls.sections || ["A"]);
                            setShowSectionDialog(true);
                          }}
                          className="hover:text-blue-600 cursor-pointer"
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
            classSubjectNames={classSubjectNames}
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
