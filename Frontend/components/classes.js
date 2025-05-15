"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { AddSubjectsDialog } from "./add-subject-dialog";
import * as Dialog from '@radix-ui/react-dialog';
import { X, Lock, Check,CirclePlus } from 'lucide-react';

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

  // Handle Input Changes
  const handleInputChange = (e, setter) => {
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle Adding a Class
  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/classes",
        classForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setClasses([...classes, res.data]);
      setClassForm({ name: "", section: "" });
      showToast("Class added successfully!");
    } catch (error) {
      if (
        error.response &&
        error.response.data?.error ===
          "Class with this name and section already exists."
      ) {
        showToast(error.response.data.error, "error");
      } else {
        showToast("Error adding class", "error");
      }
    }
  };

  // Handle Deleting a Class
  const handleDeleteClass = async (classId) => {
    // Displaying a warning that all students will lose their reference to this class
    if (
      !window.confirm(
        "Are you sure you want to delete this class? Deleting this class will remove its association with all students, but the students themselves will remain in the school system."
      )
    )
      return;

    try {
      await axios.delete(`http://localhost:5000/api/classes/${classId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      showToast("Class deleted and students' references removed successfully!");
      fetchClasses(); // Reload the class list
    } catch (error) {
      showToast("Error deleting class", "error");
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

const handleSaveSections = () => {
  // Save logic here
  setShowSectionDialog(false);
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
                            onClick={() => setShowSectionDialog(true)}
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

function SectionDialog({
  show,
  onClose,
  selectedSections,
  compulsorySections,
  allSections,
  handleRemoveSection,
  handleToggleSection,
  handleSaveSections,
}) {
  return (
    <Dialog.Root open={show} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg sm:rounded-lg"
        >
          <Dialog.Title className="text-lg font-semibold">
            Add or Remove Sections
          </Dialog.Title>

          <div className="flex flex-col gap-6 py-4">
            {/* Selected Sections */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Selected Sections
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedSections.map((sec) => (
                  <span
                    key={sec}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    {sec}
                    {compulsorySections.includes(sec) ? (
                      <Lock className="h-3 w-3 ml-1 text-blue-600" />
                    ) : (
                      <button
                        onClick={() => handleRemoveSection(sec)}
                        className="hover:text-blue-600 ml-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Available Sections */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-700">Available Sections</h3>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  = Compulsory
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {allSections.map((sec) => {
                  const isSelected = selectedSections.includes(sec);
                  const isCompulsory = compulsorySections.includes(sec);
                  return (
                    <button
                      key={sec}
                      onClick={() => handleToggleSection(sec)}
                      disabled={isCompulsory}
                      className={`p-3 rounded-lg text-sm font-medium transition-all border flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 border-blue-500'
                          : 'border-gray-200 hover:border-blue-500'
                      } ${isCompulsory ? 'cursor-default text-blue-700' : ''}`}
                    >
                      {sec}
                      {isCompulsory && <Lock className="w-3 h-3" />}
                      {isSelected && !isCompulsory && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Dialog.Close asChild>
              <button className="border bg-white text-sm px-4 py-2 rounded-md hover:bg-gray-50">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSaveSections}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>

          {/* Close Icon */}
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-4 top-4 opacity-70 hover:opacity-100"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
