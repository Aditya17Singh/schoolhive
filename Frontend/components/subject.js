"use client";

import * as Dialog from "@radix-ui/react-dialog";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";

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
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");
      const { data } = await axios.get(
        `http://localhost:5000/api/${endpoint}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setter(endpoint === "subjects" ? data.data : data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  }, []);

   const fetchTeachers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");
      const { data } = await axios.get("http://localhost:5000/api/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");
      const toAdd = selectedTeachers.filter((id) => !originalTeachers.includes(id));
      const toRemove = originalTeachers.filter((id) => !selectedTeachers.includes(id));
      const { data } = await axios.put(
        `http://localhost:5000/api/subjects/assign-teacher/${selectedSubject._id}`,
        { add: toAdd, remove: toRemove },
        { headers: { Authorization: `Bearer ${token}` } }
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
    return subjects.filter(({ subjectName, class: cls }) =>
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
    <div className="relative w-[180px]">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={classDropdownOpen}
        className="flex h-9 items-center justify-between rounded-md border border-[#fcfcfc] px-3 py-2 text-sm shadow-sm bg-gray-500/10 text-black w-full"
        onClick={() => setClassDropdownOpen((open) => !open)}
      >
        <span>{form.class || "Select Class"}</span>
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
      {classDropdownOpen && (
        <ul
          role="listbox"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5"
        >
          {loading.classes ? (
            [1, 2, 3].map((i) => (
              <li key={i} className="py-2 px-3 animate-pulse text-gray-300">
                Loading...
              </li>
            ))
          ) : classes.length === 0 ? (
            <li className="py-2 px-3 text-gray-500">No classes found</li>
          ) : (
            classes.map((cls) => (
              <li
                key={cls._id || cls.id || cls}
                role="option"
                aria-selected={form.class === cls.name}
                className={`cursor-pointer py-2 px-3 hover:bg-indigo-600 hover:text-white ${form.class === cls.name ? "bg-indigo-600 text-white" : ""
                  }`}
                onClick={() => handleClassSelect(cls.name || cls)}
              >
                {cls.name || cls}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );

  const renderLoadingRow = () => (
    <tr className="border-b animate-pulse">
      <td className="px-4 py-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </td>
      <td className="px-4 py-2">
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
      </td>
      <td className="px-4 py-2 text-center">
        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
      </td>
      <td className="px-4 py-2 text-center">
        <div className="h-6 w-16 mx-auto bg-gray-200 rounded-full" />
      </td>
    </tr>
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center pb-2 gap-4">
        <input
          type="text"
          placeholder="Search subjects..."
          className="flex-1 max-w-md h-9 rounded-md border px-3 py-1 text-sm shadow-sm border-slate-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {renderDropdown()}
      </div>

      <table className="w-full text-sm caption-bottom">
        <thead className="border-b">
          <tr className="hover:bg-muted/50">
            {[
              "Subject Name",
              "Class",
              "Teachers",
              "Assign or Remove Teachers",
            ].map((header) => (
              <th
                key={header}
                className="px-2 py-3 text-left font-medium text-muted-foreground"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading.subjects ? (
            Array.from({ length: 3 }, (_, i) => (
              <React.Fragment key={i}>{renderLoadingRow()}</React.Fragment>
            ))
          ) : filteredSubjects.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No subjects found.
              </td>
            </tr>
          ) : (
            filteredSubjects.map(
              ({ _id, subjectName, class: cls, teachers }) => (
                <tr
                  key={_id}
                  className="border-b bg-slate-50 hover:bg-slate-100"
                >
                  <td className="px-2 py-2 capitalize text-left">
                    {subjectName}
                  </td>
                  <td className="px-2 py-2 text-left">{cls}</td>
                  <td className="px-2 py-2 text-left">
                    {teachers.length ? (
                      teachers.map((teacher, index) => (
                        <span key={teacher._id}>
                          {teacher.fName} {teacher.lName}
                          {index < teachers.length - 1 ? ", " : ""}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600">
                        No teachers assigned yet
                      </span>
                    )}
                  </td>

                  <td className="px-2 py-2 text-left">
                    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                      <Dialog.Trigger asChild>
                        <button
                          onClick={() =>
                            handleEditClick({
                              _id,
                              subjectName,
                              class: cls,
                              teachers,
                            })
                          }
                          className="cursor-pointer flex items-center gap-1 px-2 py-1 border rounded-full text-slate-600 hover:bg-green-100 hover:text-green-500 hover:border-green-300"
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
                          <span className="text-xs">Edit</span>
                        </button>
                      </Dialog.Trigger>

                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/10 z-40" />
                        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-lg p-6">
                          <Dialog.Title className="text-lg font-semibold mb-2">
                            Teacher Assignment
                          </Dialog.Title>
                          <Dialog.Description className="text-sm text-gray-500 mb-4">
                            Assign or remove teachers for this subject.
                          </Dialog.Description>

                          <div className="mb-4 max-h-48 overflow-y-auto border rounded p-2 space-y-2">
                            {teachers1.length === 0 ? (
                              <p className="text-sm text-gray-500">
                                No teachers available.
                              </p>
                            ) : (
                              teachers1.map((teacher) => (

                                <label
                                  key={teacher._id}
                                  className="flex items-center gap-2 text-sm cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    className="accent-indigo-600"
                                    checked={selectedTeachers.includes(String(teacher._id))}

                                    onChange={() => {
                                      if (
                                        selectedTeachers.includes(teacher._id)
                                      ) {
                                        setSelectedTeachers(
                                          selectedTeachers.filter(
                                            (id) => id !== teacher._id
                                          )
                                        );
                                      } else {
                                        setSelectedTeachers([
                                          ...selectedTeachers,
                                          teacher._id,
                                        ]);
                                      }
                                    }}
                                  />
                                  <span>
                                    {teacher.fName} {teacher.lastName}
                                  </span>
                                </label>
                              ))
                            )}
                          </div>

                          <div className="flex justify-end gap-2">
                            <Dialog.Close asChild>
                              <button className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-100">
                                Cancel
                              </button>
                            </Dialog.Close>
                            <button
                              onClick={handleTeacherAssignment}
                              className="px-4 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
                            >
                              Save
                            </button>
                          </div>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
