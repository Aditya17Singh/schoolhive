"use client";

import { useEffect, useState } from "react";
import { ChevronsUpDown, Calendar, Users, BookOpen, Hash } from "lucide-react";
import API from "@/lib/api";

export default function CreateExam() {
  const [examName, setExamName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

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

  // Fetch subjects when class is selected
  useEffect(() => {
    async function fetchSubjectsForClass() {
      if (!selectedClassId) return;

      setLoadingSubjects(true);
      try {
        const classRes = await API.get(`/classes/${selectedClassId}`);
        const subjectIds = classRes.data.subjects || [];

        if (subjectIds.length === 0) {
          setFormData([]);
          setLoadingSubjects(false);
          return;
        }

        // Fetch subject details in parallel
        const subjectPromises = subjectIds.map((id) =>
          API.get(`/subjects/${id}`).then((res) => res.data)
        );

        const subjectData = await Promise.all(subjectPromises);

        const initializedFormData = subjectData.map((subject) => ({
          subjectId: subject._id,
          subjectName: subject.name,
          teacher: [],
          maxMarks: "",
          date: "",
        }));

        setFormData(initializedFormData);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setFormData([]);
      } finally {
        setLoadingSubjects(false);
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
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Exam
          </h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Information Section */}
            <div className="space-y-6 mb-4">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Exam Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Exam Name *
                  </label>
                  <input
                    type="text"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="e.g. First Term Exam"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Class Select */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Class *
                  </label>
                  <div className="relative">
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
                      required
                    >
                      <option value="">Choose a class</option>
                      {classes.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                    <ChevronsUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Subjects Section */}
            {formData.length > 0 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {formData.map((data, index) => (
                    <div
                      key={data.subjectId}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow"
                    >
                      {/* Subject Name Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-700 font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {data.subjectName}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Assign Teacher
                          </label>
                          <select
                            multiple
                            value={data.teacher}
                            onFocus={async () => {
                              try {
                                const res = await API.get(
                                  `/subjects/teachers/${data.subjectId}`
                                );
                                if (res.data.success) {
                                  setTeachers(res.data.data);
                                }
                              } catch (err) {
                                console.error("Error fetching teachers:", err);
                              }
                            }}
                            onChange={(e) => {
                              const selectedOptions = Array.from(
                                e.target.selectedOptions
                              ).map((opt) => opt.value);
                              handleChange(index, "teacher", selectedOptions);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[42px]"
                          >
                            {teachers.map((teacher) => (
                              <option key={teacher._id} value={teacher._id}>
                                {teacher.fName} {teacher.lName}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Max Marks */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                            <Hash className="w-4 h-4" />
                            Maximum Marks
                          </label>
                          <input
                            type="number"
                            placeholder="Enter max marks"
                            value={data.maxMarks}
                            onChange={(e) =>
                              handleChange(index, "maxMarks", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            min="1"
                          />
                        </div>

                        {/* Exam Date */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Exam Date
                          </label>
                          <input
                            type="date"
                            value={data.date}
                            onChange={(e) =>
                              handleChange(index, "date", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-3">
              {formData.length === 0 && (
                <p className="text-sm text-gray-600 mb-2">
                  Select class to see subjects
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  type="submit"
                  disabled={
                    !examName || !selectedClassId || formData.length === 0
                  }
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Create Exam
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Help Text */}
        {selectedClassId && loadingSubjects && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              Loading subjects for the selected class...
            </p>
          </div>
        )}

        {selectedClassId && !loadingSubjects && formData.length === 0 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              No subjects found. Please select another class to see subjects.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
