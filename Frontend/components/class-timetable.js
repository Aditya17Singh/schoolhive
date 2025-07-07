"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

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
  console.log(subjectTeachers, "subjectTeachers");
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
        : res.data.data; // in case it's already flat

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

    const fetchTeachers = async () => {
      try {
        const res = await API.get("/teachers");
        setTeachers(res.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchClasses();
    fetchTeachers();
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

      // setSubjects(classSubjects);
    } else {
      setSections([]);
      setSubjects([]);
    }
  };

  const handleSearch = async () => {
    if (!classId || !section)
      return alert("Please select both class and section.");
    try {
      const res = await API.get("/timetable", {
        params: { classId, section },
      });
      setTimetable(res.data);
    } catch (error) {
      console.error("Error fetching timetable:", error);
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
            teacherId: "", // reset teacher
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
    try {
      for (const entry of timetable) {
        await API.post("/timetable", {
          classId,
          section,
          day: entry.day,
          entries: entry.entries.map((e) => ({
            period: e.period,
            subjectId: e.subjectId?._id || e.subjectId || null,
            teacherId: e.teacherId?._id || e.teacherId || null,
          })),
        });
      }
      alert("Timetable saved successfully.");
    } catch (err) {
      console.error("Error saving timetable:", err);
      alert("Failed to save timetable.");
    }
  };
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Class Timetable</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          onChange={handleClassChange}
          className="border p-2 rounded"
          value={classId}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setSection(e.target.value)}
          className="border p-2 rounded"
          value={section}
        >
          <option value="">Select Section</option>
          {sections.map((sec, i) => (
            <option key={i} value={sec}>
              {sec}
            </option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {timetable.length > 0 && (
        <>
          <table className="table-auto w-full border-collapse border mb-4">
            <thead>
              <tr>
                <th className="border p-2">Period</th>
                {days.map((day) => (
                  <th key={day} className="border p-2">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => (
                <tr key={period.number}>
                  <td className="border p-2 font-medium">
                    Period {period.number} <br /> ({period.time})
                  </td>
                  {days.map((day) => {
                    const dayEntry = timetable.find((t) => t.day === day);
                    const entry = dayEntry?.entries.find(
                      (e) => e.period === period.number
                    );

                    const subjectId =
                      entry?.subjectId?._id || entry?.subjectId || "";
                    const teachersForSubject = subjectId
                      ? subjectTeachers[String(subjectId)] || []
                      : [];

                    return (
                      <td key={day} className="border p-2 text-xs">
                        <div>
                          {/* Subject Dropdown */}
                          <select
                            className="w-full border mb-1 p-1 text-xs"
                            value={subjectId}
                            onChange={(e) => {
                              const newSubjectId = e.target.value;
                              handleChange(
                                day,
                                period.number,
                                "subjectId",
                                newSubjectId
                              );
                            }}
                          >
                            {subjects.map((s) => (
                              <option key={s._id} value={s._id}>
                                {s.subjectName}
                              </option>
                            ))}
                          </select>

                          {/* Teacher Dropdown (only shown if a subject is selected) */}
                          <select
                            className="w-full border p-1 text-xs"
                            value={
                              entry?.teacherId?._id || entry?.teacherId || ""
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
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Save Timetable
          </button>
        </>
      )}
    </div>
  );
};

export default Timetable;
