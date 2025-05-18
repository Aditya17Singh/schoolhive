"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export default function TeacherDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

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
      console.log(res);
      
      setClasses(res.data || []);
    } catch (error) {
      console.error("Error fetching classes", error);
    }
  }, []);

  // Fetch sections based on class
//   const fetchSections = useCallback(async (className) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`http://localhost:5000/api/classes/${className}/sections`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSections(res.data.sections || []);
//     } catch (error) {
//       console.error("Error fetching sections", error);
//     }
//   }, []);

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
    fetchClasses(); // fetch available classes
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTeacher(null);
    setSelectedClass("");
    setSelectedSection("");
    setSections([]);
  };

  const handleClassChange = (e) => {
    const cls = e.target.value;
    setSelectedClass(cls);
    // fetchSections(cls);
  };
  const allSections = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
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
                    <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                      Not Assigned
                    </div>
                  </td>
                  <td className="p-2 text-xs text-gray-600">N/A</td>
                  <td className="p-2">
                    <div className="flex gap-2 justify-end">
                      <a href={`/dashboard/teachers/dashboard/DAV${String(index + 1).padStart(6, "0")}`}>
                        <button className="rounded-md text-xs h-8 w-8 border border-blue-200 hover:bg-blue-50">👁</button>
                      </a>
                      <button
                        className="rounded-md text-xs h-8 w-8 border border-gray-200 hover:bg-gray-50"
                        onClick={() => openEditModal(teacher)}
                      >
                        ✏️
                      </button>
                      <button className="rounded-md text-xs h-8 w-8 border border-red-200 hover:bg-red-50">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dark Overlay + Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="z-50 bg-white p-6 w-full max-w-lg rounded-lg shadow-xl relative">
            <h2 className="text-lg font-semibold">Edit Teacher</h2>
            <p className="text-sm text-gray-500 mb-4">Assign class and section</p>

            <form className="space-y-4">
              {/* Class Dropdown */}
              <div>
                <label className="text-sm font-medium">Class</label>
                <select
                  value={selectedClass}
                  onChange={handleClassChange}
                  className="mt-1 w-full h-9 px-3 py-2 border rounded-md bg-gray-50"
                >
                  <option value="">Select a class</option>
                  {classes.map((cls, i) => (
                    <option key={i} value={cls.name}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Dropdown */}
              <div>
                <label className="text-sm font-medium">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="mt-1 w-full h-9 px-3 py-2 border rounded-md bg-gray-50"
                >
                  <option value="">Select a section</option>
                  {allSections.map((section, i) => (
                    <option key={i} value={section.name}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeEditModal}
                className="h-9 px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Saved class: ${selectedClass}, section: ${selectedSection}`);
                  closeEditModal();
                }}
                className="h-9 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>

            {/* Close button top right */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeEditModal}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
