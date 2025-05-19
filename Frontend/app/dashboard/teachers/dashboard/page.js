"use client";

import * as Dialog from '@radix-ui/react-dialog';
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export default function TeacherDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found.");

        const { data } = await axios.get("http://localhost:5000/api/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) setTeachers(data.data);
        else console.error("Failed to fetch teachers");
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Fetch class list
  const fetchClasses = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClasses(res.data || []);
    } catch (error) {
      console.error("Error fetching classes", error);
    }
  }, []);

  const handleAssignClass = async () => {
    try {
      const token = localStorage.getItem("token");
      const { _id } = selectedTeacher;

      const res = await axios.put(
        `http://localhost:5000/api/teachers/assign/${_id}`,
        { assignedClass: selectedClass, assignedSection: selectedSection },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        alert("Class assigned successfully!");
        setTeachers((prev) =>
          prev.map((t) => (t._id === _id ? res.data.data : t))
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
  
  const handleClassChange = (e) => {
    const cls = e.target.value;
    setSelectedClass(cls);
  };

  const selectedClassObj = classes.find(cls => cls.name === selectedClass);
  const sectionsForSelectedClass = selectedClassObj ? selectedClassObj.sections : [];
  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div>
      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&>tr]:border-b bg-gray-50/80">
              <tr>
                <th className="h-10 px-2 text-left font-semibold text-gray-600">ID</th>
                <th className="h-10 px-2 text-left font-semibold text-gray-600">Teacher Name</th>
                <th className="h-10 px-2 text-left font-semibold text-gray-600">Contact</th>
                <th className="h-10 px-2 text-left font-semibold text-gray-600">Class</th>
                <th className="h-10 px-2 text-left font-semibold text-gray-600">Subjects</th>
                <th className="h-10 px-2 text-left font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr key={teacher._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{`DAV${String(index + 1).padStart(6, "0")}`}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                        {teacher.fName[0]}
                        {teacher.lName?.[0]}
                      </div>
                      <div>
                        <div className="font-medium">{`${teacher.fName} ${teacher.lName}`}</div>
                        <div className="text-xs text-gray-500">{teacher.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-sm">{teacher.phone}</td>
                  <td className="p-2">
                    {teacher.assignedClass ? (
                      <div className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                        {teacher.assignedClass} - {teacher.assignedSection}
                      </div>
                    ) : (
                      <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                        Not Assigned
                      </div>
                    )}
                  </td>

                  <td className="p-2 text-xs text-gray-600">N/A</td>
                  <td className="p-2">
                    <div className="flex gap-2 justify-end">
                      <a href={`/dashboard/teachers/dashboard/DAV${String(index + 1).padStart(6, "0")}`}>
                        <button className="rounded-md text-xs h-8 w-8 border border-blue-200 hover:bg-blue-50">👁</button>
                      </a>
                      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                        <Dialog.Trigger asChild>
                          <button onClick={() => {
                            setSelectedTeacher(teacher);
                            fetchClasses();
                            setDialogOpen(true);
                          }} className="cursor-pointer flex items-center gap-1 px-2 py-1 border rounded-full text-slate-600 hover:bg-green-100 hover:text-green-500 hover:border-green-300">
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
                                  className={`mt-1 w-full h-9 px-3 py-2 border rounded-md text-sm
      ${!selectedClass ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-50 border-gray-300"}
    `}
                                >
                                  <option value="">{selectedClass ? "Select a section" : "Select a class first"}</option>
                                  {selectedClass &&
                                    sectionsForSelectedClass.map((section, i) => (
                                      <option key={i} value={section}>
                                        {section}
                                      </option>
                                    ))
                                  }
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
