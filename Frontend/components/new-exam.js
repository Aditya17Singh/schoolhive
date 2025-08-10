"use client";

import { useEffect, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import API from "@/lib/api";

export default function CreateExam() {
  const [examName, setExamName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState([]);
  const [teachers, setTeachers] = useState([]);
console.log(teachers, 'teachers')
  // Fetch all classes
  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await API.get("/classes");
        setClasses(res.data.sort((a, b) => a.order - b.order));
      } catch (err) {
        console.error("Failed to load classes", err);
      }
    }

    fetchClasses();
  }, []);
 
  
useEffect(() => {
  async function fetchSubjectsForClass() {
    if (!selectedClassId) return;

    try {
      const classRes = await API.get(`/classes/${selectedClassId}`);
      const subjectIds = classRes.data.subjects || [];

      // Fetch subject details
      const subjectData = await Promise.all(
        subjectIds.map((id) => API.get(`/subjects/${id}`).then((res) => res.data))
      );

      // Create initial rows without teachers
      let subjectsWithTeachers = subjectData.map((subject) => ({
        subjectId: subject._id,
        subjectName: subject.name,
        teacher: [],
        teachers: [],
        maxMarks: [],
        date: "",
      }));

      // Fetch teachers for each subject (using your existing function)
      subjectsWithTeachers = await Promise.all(
        subjectsWithTeachers.map(async (subjectRow, index) => {
          const res = await API.get(`/subjects/${subjectRow.subjectId}`);
          if (res.data.success) {
            subjectRow.teachers = res.data.data;
          }
          return subjectRow;
        })
      );

      setFormData(subjectsWithTeachers);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setFormData([]);
    }
  }

  fetchSubjectsForClass();
}, [selectedClassId]);



  const handleChange = (index, field, value) => {
    const updated = [...formData];
    updated[index][field] = value;
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      examName,
      classId: selectedClassId,
      subjects: formData.map((item) => ({
        subjectId: item.subjectId,
        teacher: item.teacher,
        maxMarks: item.maxMarks,
        date: item.date,
      })),
    };

    console.log("Submitting:", payload);

    // TODO: POST to your API endpoint here
  };

//  useEffect(() => {
//    if (!subjectId) return;

//    const fetchTeachers = async () => {
//      try {
//        const res = await API.get(`/subjects/teachers/${subjectId}`);
//        if (res.data.success) {
//          setTeachers(res.data.data);
//        }
//      } catch (err) {
//        console.error("Error fetching teachers:", err);
//      }
//    };

//    fetchTeachers();
//  }, [subjectId]);

const fetchTeachersForSubject = async (subjectId, index) => {
  console.log('subjectId')
  try {
    const res = await API.get(`/subjects/${subjectId}`);
    if (res.data.success) {
      const updated = [...formData];
      updated[index].teachers = res.data.data; // store in that subject's row
      setFormData(updated);
    }
  } catch (err) {
    console.error("Error fetching teachers:", err);
  }
};



  return (
    <div className="pl-6 pt-4">
      <h2 className="text-xl font-semibold mb-4">Create New Exam</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Exam Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exam Name
          </label>
          <input
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="e.g. First Term Exam"
            required
            className="w-full h-9 px-3 py-1 border border-gray-400 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Class Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full h-9 px-3 py-2 border border-gray-400 rounded-md text-sm bg-[#F7F8FA] shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subjects */}
        {formData.length > 0 && (
          <div className="space-y-2">
            {formData.map((data, index) => (
              <div
                key={data.subjectId}
                className="px-1 gap-1 py-1 w-full border flex justify-between items-center rounded-md shadow-sm border-gray-400"
              >
                <div className="flex-1">
                  <span className="font-semibold text-[#333333] pl-2 text-sm">
                    {data.subjectName}
                  </span>
                </div>

                {/* Teacher Selector (placeholder button for now) */}
                <div className="flex-[2]">
                  <select
                    multiple
                    value={data.teacher}
                      onClick={() => fetchTeachersForSubject(data.subjectId, index)}

                    onChange={(e) => {
                      const selectedOptions = Array.from(
                        e.target.selectedOptions
                      ).map((opt) => opt.value);
                      handleChange(index, "teacher", selectedOptions);
                    }}
                  >
                    {data.teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.fName} {teacher.lName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Max Marks */}
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Max Marks"
                    value={data.maxMarks}
                    onChange={(e) =>
                      handleChange(index, "maxMarks", e.target.value)
                    }
                    className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border-gray-400 min-w-[150px]"
                  />
                </div>

                {/* Exam Date */}
                <div className="flex-1">
                  <input
                    type="date"
                    value={data.date}
                    onChange={(e) =>
                      handleChange(index, "date", e.target.value)
                    }
                    className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border-gray-400 min-w-[150px]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 h-9 rounded-md bg-yellow-400 text-black hover:bg-yellow-500 text-sm font-medium shadow"
        >
          Save new exam
        </button>
      </form>
    </div>
  );
}
