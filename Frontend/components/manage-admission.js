"use client";

import { useEffect, useState } from "react";
import { Eye, Clock, CircleCheckBig, CircleX, CircleCheck, GraduationCap, Users, Calendar, Phone, Mail, MapPin, User } from "lucide-react";
import API from "@/lib/api";

const StatusBadge = ({ status }) => {
  const base =
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors";

  if (status === "admitted") {
    return (
      <div className={`${base} bg-green-50 text-green-700 border-green-300`}>
        <CircleCheckBig className="h-3 w-3 mr-1" />
        Admitted
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className={`${base} bg-red-50 text-red-700 border-red-300`}>
        <CircleX className="h-3 w-3 mr-1" />
        Rejected
      </div>
    );
  }

  return (
    <div className={`${base} bg-yellow-50 text-yellow-700 border-yellow-300`}>
      <Clock className="h-3 w-3 mr-1" />
      Pending
    </div>
  );
};

async function updateStatus(id, status) {
  try {
    await API.patch(`/students/status/${id}`, { status });
    alert(`Student ${status}`);
  } catch (err) {
    console.error(err);
    alert("Failed to update status");
  }
}

const Dialog = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative z-50 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Admission Application</h2>
                <p className="text-blue-100 text-sm">Student Details & Status</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <CircleX className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Student Overview Card */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {student.avatar ? (
                  <img
                    src={student.avatar}
                    className="h-24 w-24 rounded-xl object-cover border-4 border-white shadow-lg"
                    alt="Student"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="h-10 w-10 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {`${student.fName} ${student.lName || ""}`}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>DOB: {new Date(student.dob).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="h-4 w-4" />
                    <span>Class: {student.admissionClass}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <StatusBadge status={student.status || "pending"} />
                </div>
              </div>
            </div>
          </div>

          {/* Information Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-500 font-medium">Gender</span>
                    <span className="text-gray-900">{student.gender}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-500 font-medium">Registration No</span>
                    <span className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded text-sm">{student.orgUID}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-500 font-medium">Session</span>
                    <span className="text-gray-900">{student.session}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 py-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{student.contactNumber}</span>
                  </div>
                  <div className="flex items-center gap-3 py-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{student.email}</span>
                  </div>
                  <div className="flex items-start gap-3 py-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-900">
                      {`${student.permanentAddress.line1}, ${student.permanentAddress.city}, ${student.permanentAddress.state}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Family Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 border-b pb-2">Father's Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name</span>
                      <span className="text-gray-900 font-medium">{student.fatherName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone</span>
                      <span className="text-gray-900">{student.fatherPhone}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 border-b pb-2">Mother's Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name</span>
                      <span className="text-gray-900 font-medium">{student.motherName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone</span>
                      <span className="text-gray-900">{student.motherPhone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => updateStatus(student._id, "rejected")}
              className="inline-flex items-center gap-2 px-6 py-3 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 hover:border-red-400 transition-all duration-200 font-medium"
            >
              <CircleX className="h-4 w-4" />
              Reject Application
            </button>
            <button
              onClick={() => updateStatus(student._id, "admitted")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <CircleCheck className="h-4 w-4" />
              Admit Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await API.get("/students/admissions");
        setStudents(response.data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);


  if (loading) return <p className="p-4 text-sm text-muted-foreground">Loading students...</p>;

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="mb-2 pb-2">
        <div className="flex flex-col space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
            Manage Admissions
          </h1>
          <p className="text-base text-gray-500 max-w-2xl">
            Review and process student admission applications. Track status and manage enrollment requests efficiently.
          </p>
        </div>
        <div className="mt-4 flex items-center space-x-3 text-sm text-gray-500">
          <div className="flex items-center text-gray-500 font-semibold">
            <Clock className="h-4 w-4 mr-1.5" />
            <span>{students.filter(s => s.status === 'pending' || !s.status).length} Active requests</span>
          </div>
          <span>•</span>
          <div className="flex items-center">
            <CircleCheckBig className="h-4 w-4 mr-1.5" />
            <span>Last updated Jun 2, 2025</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Registration No.</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Class</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Application Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student, index) => (
                <tr
                  key={student._id}
                  className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                        {student.fName.charAt(0)}{(student.lName || '').charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{`${student.fName} ${student.lName || ""}`}</p>
                        <p className="text-sm text-gray-500">{student.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{student.orgUID}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 font-medium">{student.admissionClass}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{new Date(student.createdAt).toLocaleDateString("en-IN")}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={student.status || "pending"} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {students.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-500">There are currently no student admission applications to review.</p>
        </div>
      )}

      {selectedStudent && (
        <Dialog student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
};

export default StudentTable;
