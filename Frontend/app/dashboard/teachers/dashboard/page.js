"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useEffect, useState, useMemo } from "react";
import axios from "axios";

export default function TeacherDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [teacherSubjects, setTeacherSubjects] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    const fetchTeachersAndSubjects = async () => {
      try {
        if (!token) throw new Error("No token found.");

        const { data: teacherData } = await axios.get(
          "http://localhost:5000/api/teachers",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!teacherData.success) return console.error("Failed to fetch teachers");

        const fetchedTeachers = teacherData.data;
        setTeachers(fetchedTeachers);

        const subjectResponses = await Promise.all(
          fetchedTeachers.map((t) =>
            axios.get(
              `http://localhost:5000/api/teachers/by-teacher/${t._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );

        const subjectMap = subjectResponses.reduce((acc, res, i) => {
          acc[fetchedTeachers[i]._id] = res.data.data;
          return acc;
        }, {});

        setTeacherSubjects(subjectMap);
      } catch (error) {
        console.error("Error fetching teachers or subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachersAndSubjects();
  }, [token]);

  const fetchClasses = useCallback(async () => {
    try {
      if (!token) return;

      const { data } = await axios.get("http://localhost:5000/api/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClasses(data || []);
    } catch (error) {
      console.error("Error fetching classes", error);
    }
  }, [token]);

  const handleAssignClass = async () => {
    try {
      if (!token || !selectedTeacher) return;

      const { _id } = selectedTeacher;

      const { data } = await axios.put(
        `http://localhost:5000/api/teachers/assign/${_id}`,
        {
          assignedClass: selectedClass,
          assignedSection: selectedSection,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        alert("Class assigned successfully!");
        setTeachers((prev) =>
          prev.map((t) => (t._id === _id ? data.data : t))
        );
        setDialogOpen(false);
      } else {
        alert("Failed to assign class");
      }
    } catch (error) {
      console.error("Error assigning class:", error);
      alert("Something went wrong!");
    }
  };

  const handleClassChange = (e) => setSelectedClass(e.target.value);

  const selectedClassObj = useMemo(
    () => classes.find((cls) => cls.name === selectedClass),
    [classes, selectedClass]
  );

  const filteredTeachers = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return teachers.filter((teacher) =>
      `${teacher.fName} ${teacher.lName}`.toLowerCase().includes(lowerSearch) ||
      teacher.email?.toLowerCase().includes(lowerSearch) ||
      teacher.phone?.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm, teachers]);

  const schoolPrefix = useMemo(() => {
    try {
      const org = JSON.parse(localStorage.getItem("user") || "{}");
      return org.name?.split(" ")[0]?.toUpperCase() || "SCH"; 
    } catch {
      return "SCH";
    }
  }, []);

  const sectionsForSelectedClass = selectedClassObj?.sections || [];

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search teacher..."
            className="w-full h-10 px-4 border border-gray-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm">
          + Add New Teacher
        </button>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="h-12 px-4 text-left font-semibold text-gray-600">ID</th>
                <th className="h-12 px-4 text-left font-semibold text-gray-600">Teacher Name</th>
                <th className="h-12 px-4 text-left font-semibold text-gray-600">Contact</th>
                <th className="h-12 px-4 text-left font-semibold text-gray-600">Class</th>
                <th className="h-12 px-4 text-left font-semibold text-gray-600">Subjects</th>
                <th className="h-12 px-4 text-left font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500 text-sm">
                    No teacher found
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher, index) => (
                  <tr
                    key={teacher._id}
                    className={`hover:bg-gray-50 ${index === teachers.length - 1 ? "" : "border-b"}`}
                  >
                    <td className="p-4">{`${schoolPrefix}${String(index + 1).padStart(6, "0")}`}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                          {teacher.fName[0]}{teacher.lName?.[0]}
                        </div>
                        <div>
                          <div className="font-medium">{`${teacher.fName} ${teacher.lName}`}</div>
                          <div className="text-xs text-gray-500">{teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{teacher.phone}</td>
                    <td className="p-4">
                      {teacher.assignedClass ? (
                        <div className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100 inline-block">
                          {teacher.assignedClass} - {teacher.assignedSection}
                        </div>
                      ) : (
                        <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100 inline-block">
                          Not Assigned
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-xs text-gray-600">
                      {teacherSubjects[teacher._id]?.length > 0 ? (
                        <div className="flex gap-1.5 flex-wrap">
                          {teacherSubjects[teacher._id].map((subj, idx) => {
                            const colorClasses = [
                              "bg-emerald-50 text-emerald-700 border-emerald-100",
                              "bg-indigo-50 text-indigo-700 border-indigo-100",
                              "bg-rose-50 text-rose-700 border-rose-100",
                              "bg-yellow-50 text-yellow-700 border-yellow-100",
                              "bg-sky-50 text-sky-700 border-sky-100",
                              "bg-purple-50 text-purple-700 border-purple-100"
                            ];
                            const color = colorClasses[idx % colorClasses.length];
                            return (
                              <span
                                key={idx}
                                className={`px-3 py-0.5 text-xs font-medium rounded-full border ${color}`}
                              >
                                {`${subj.subjectName}_${subj.class}`}
                              </span>

                            );
                          })}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <a href={`/dashboard/teachers/dashboard/DAV${String(index + 1).padStart(6, "0")}`}>
                          <button className="rounded-md text-xs h-8 w-8 border border-blue-200 hover:bg-blue-50">👁</button>
                        </a>
                        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                          <Dialog.Trigger asChild>
                            <button
                              onClick={() => {
                                setSelectedTeacher(teacher);
                                fetchClasses();
                                setDialogOpen(true);
                              }}
                              className="cursor-pointer flex items-center gap-1 px-2 py-1 border rounded-full text-slate-600 hover:bg-green-100 hover:text-green-500 hover:border-green-300 text-xs"
                            >
                              ✏️ Edit
                            </button>
                          </Dialog.Trigger>

                          <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
                            <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-lg p-6 shadow-lg">
                              <Dialog.Title className="text-lg font-semibold mb-2">Edit Teacher</Dialog.Title>
                              <Dialog.Description className="text-sm text-gray-500 mb-4">
                                Update basic details and assign class/section
                              </Dialog.Description>

                              <form className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Class</label>
                                  <select
                                    value={selectedClass}
                                    onChange={handleClassChange}
                                    className="mt-1 w-full h-9 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                                  >
                                    <option value="">Select a class</option>
                                    {classes.map((cls, i) => (
                                      <option key={i} value={cls.name}>
                                        {cls.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Section</label>
                                  <select
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                    disabled={!selectedClass}
                                    className={`mt-1 w-full h-9 px-3 py-2 border rounded-md text-sm ${!selectedClass
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                      : "bg-gray-50 border-gray-300"
                                      }`}
                                  >
                                    <option value="">{selectedClass ? "Select a section" : "Select a class first"}</option>
                                    {sectionsForSelectedClass.map((section, i) => (
                                      <option key={i} value={section}>
                                        {section}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </form>
                              <div className="mt-6 flex justify-end gap-2">
                                <Dialog.Close asChild>
                                  <button className="cursor-pointer px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100">
                                    Cancel
                                  </button>
                                </Dialog.Close>
                                <button
                                  onClick={handleAssignClass}
                                  className="cursor-pointer px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                  Save
                                </button>
                              </div>
                            </Dialog.Content>
                          </Dialog.Portal>
                        </Dialog.Root>
                        <button className="rounded-md text-xs h-8 w-8 border border-red-200 hover:bg-red-50">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
