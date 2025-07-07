"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Search,
  Save,
  ChevronDown,
} from "lucide-react";

const Timetable = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [sections, setSections] = useState([]);
  const [section, setSection] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjectTeachers, setSubjectTeachers] = useState({});
  const [allSubjects, setAllSubjects] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const periods = [
    { number: 1, time: "08:00 AM - 08:40 AM" },
    { number: 2, time: "08:45 AM - 09:25 AM" },
    { number: 3, time: "09:30 AM - 10:10 AM" },
    { number: 4, time: "10:15 AM - 10:55 AM" },
    { number: 5, time: "11:00 AM - 11:40 AM" },
    { number: 6, time: "11:45 AM - 12:25 PM" },
    { number: 7, time: "12:30 PM - 01:10 PM" },
    { number: 8, time: "01:15 PM - 01:55 PM" },
  ];

  useEffect(() => {
    const fetchAllSubjects = async () => {
      try {
        const res = await API.get("/subjects");
        const flatSubjects = Array.isArray(res.data.data)
          ? res.data.data.flat()
          : res.data.data;

        setAllSubjects(flatSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchAllSubjects();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("/classes");
        setClasses(res.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleClassChange = (e) => {
    const selectedId = e.target.value;
    setClassId(selectedId);

    const selectedClass = classes.find((c) => c._id === selectedId);
    if (selectedClass) {
      setSections(selectedClass.sections || []);
      const assignedSubjectIds = selectedClass.subjects.map((s) => s._id);
      const filteredSubjects = allSubjects.filter((subj) =>
        assignedSubjectIds.includes(subj._id)
      );

      setSubjects(filteredSubjects);
    } else {
      setSections([]);
      setSubjects([]);
    }
  };

  const handleSearch = async () => {
    if (!classId || !section)
      return alert("Please select both class and section.");

    setIsLoading(true);
    try {
      const res = await API.get("/timetable", {
        params: { classId, section },
      });

      const updatedTimetable = days.map((day) => {
        const existingDay = res.data.find((d) => d.day === day) || {
          day,
          entries: [],
        };

        const filledEntries = periods.map((p) => {
          return (
            existingDay.entries.find((e) => e.period === p.number) || {
              period: p.number,
              subjectId: "",
              teacherId: "",
            }
          );
        });

        return {
          ...existingDay,
          entries: filledEntries,
        };
      });

      setTimetable(updatedTimetable);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (day, periodNumber, field, value) => {
    setTimetable((prev) =>
      prev.map((t) => {
        if (t.day !== day) return t;

        const updatedEntries = t.entries.map((entry) => {
          if (entry.period !== periodNumber) return entry;

          // When subject changes, reset teacherId
          if (field === "subjectId") {
            return {
              ...entry,
              subjectId: value,
              teacherId: "",
            };
          }

          return {
            ...entry,
            [field]: value,
          };
        });

        return {
          ...t,
          entries: updatedEntries,
        };
      })
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const entry of timetable) {
        const cleanedEntries = entry.entries.map((e) => ({
          period: e.period,
          subjectId:
            typeof e.subjectId === "object"
              ? e.subjectId._id
              : e.subjectId?.trim?.() || null,
          teacherId:
            typeof e.teacherId === "object"
              ? e.teacherId._id
              : e.teacherId?.trim?.() || null,
        }));

        await API.post("/timetable", {
          classId,
          section,
          day: entry.day,
          entries: cleanedEntries,
        });
      }

      alert("Timetable saved successfully.");
    } catch (err) {
      console.error("Error saving timetable:", err);
      alert("Failed to save timetable.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Class Timetable Management
          </h1>
          <p className="text-gray-600 text-lg">
            Create and manage your class schedules efficiently
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              Select Class & Section
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                Class
              </label>
              <div className="relative">
                <select
                  onChange={handleClassChange}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={classId}
                >
                  <option value="">Choose a class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Section
              </label>
              <div className="relative">
                <select
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={section}
                  disabled={!classId}
                >
                  <option value="">Choose a section</option>
                  {sections.map((sec, i) => (
                    <option key={i} value={sec}>
                      Section {sec}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 opacity-0">
                Action
              </label>
              <button
                onClick={handleSearch}
                disabled={isLoading || !classId || !section}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 cursor-pointer text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Load Timetable
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Timetable */}
        {timetable.length > 0 && (
          <div className="py-6">
            <div className="bg-white shadow-lg  rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table-auto w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left font-semibold text-gray-700">
                        Period
                      </th>
                      {days.map((day) => (
                        <th
                          key={day}
                          className="p-3 text-center font-semibold text-gray-700 whitespace-nowrap"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periods.map((period, idx) => (
                      <tr
                        key={period.number}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                          Period {period.number}
                          <br />
                          <span className="text-xs text-gray-500">
                            ({period.time})
                          </span>
                        </td>
                        {days.map((day) => {
                          const dayEntry = timetable.find((t) => t.day === day);
                          const entry = dayEntry?.entries.find(
                            (e) => e.period === period.number
                          );

                          const rawSubjectId = entry?.subjectId;
                          const subjectId =
                            rawSubjectId && typeof rawSubjectId === "object"
                              ? rawSubjectId._id
                              : rawSubjectId || "";

                          const subjectObj = subjects.find(
                            (s) => s._id === subjectId
                          );
                          const teachersForSubject = subjectObj?.teachers || [];

                          return (
                            <td key={day} className="px-3 py-3 text-xs">
                              {/* Subject Dropdown */}
                              <select
                                className="w-full border border-gray-300 rounded-md p-1 mb-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={subjectId || ""}
                                onChange={(e) =>
                                  handleChange(
                                    day,
                                    period.number,
                                    "subjectId",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">--Subject--</option>
                                {subjects.map((s) => (
                                  <option key={s._id} value={s._id}>
                                    {s.subjectName}
                                  </option>
                                ))}
                              </select>

                              {/* Teacher Dropdown */}
                              <select
                                className="w-full border border-gray-300 rounded-md p-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={
                                  entry?.teacherId?._id ||
                                  entry?.teacherId ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleChange(
                                    day,
                                    period.number,
                                    "teacherId",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">--Teacher--</option>
                                {teachersForSubject.map((t) => (
                                  <option key={t._id} value={t._id}>
                                    {t.fName} {t.lName}
                                  </option>
                                ))}
                              </select>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 text-center bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-6 py-2 rounded-lg font-medium shadow-md transition-all"
                >
                  Save Timetable
                </button>
              </div>
            </div>
          </div>
        )}

        {timetable.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-gray-100">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Timetable Loaded
              </h3>
              <p className="text-gray-600">
                Select a class and section, then click to begin creating your
                schedule.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timetable;
