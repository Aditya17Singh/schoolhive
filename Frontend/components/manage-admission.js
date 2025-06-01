"use client";

import { useEffect, useState } from "react";
import { Eye, Clock, CircleCheckBig, CircleX, CircleCheck } from "lucide-react";
import API from "@/lib/api"; // adjust based on your API wrapper path

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
    // Optionally refetch students or update local state
    alert(`Student ${status}`);
  } catch (err) {
    console.error(err);
    alert("Failed to update status");
  }
}


const Dialog = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative z-50 max-w-3xl w-full rounded-lg border bg-white p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Admission Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 text-sm">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Personal Information</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-500">Name:</span>{" "}
                  {`${student.fName} ${student.lName || ""}`}
                </p>
                <p>
                  <span className="text-gray-500">Gender:</span>{" "}
                  {student.gender}
                </p>
                <p>
                  <span className="text-gray-500">DOB:</span>{" "}
                  {new Date(student.dob).toLocaleDateString()}
                </p>
                <p>
                  <span className="text-gray-500">Registration No:</span>{" "}
                  {student.orgUID}
                </p>
                <p>
                  <span className="text-gray-500">Session:</span>{" "}
                  {student.session}
                </p>
                <p>
                  <span className="text-gray-500">Class:</span>{" "}
                  {student.admissionClass}
                </p>
              </div>
              {student.avatar && (
                <img
                  src={student.avatar}
                  className="h-32 w-32 mt-4 object-contain rounded border"
                  alt="Student"
                />
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-500">Phone:</span>{" "}
                  {student.contactNumber}
                </p>
                <p>
                  <span className="text-gray-500">Email:</span> {student.email}
                </p>
                <p>
                  <span className="text-gray-500">Address:</span>{" "}
                  {`${student.permanentAddress.line1}, ${student.permanentAddress.city}, ${student.permanentAddress.state}`}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Family Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p>
                  <span className="text-gray-500">Father's Name:</span>{" "}
                  {student.fatherName}
                </p>
                <p>
                  <span className="text-gray-500">Father's Phone:</span>{" "}
                  {student.fatherPhone}
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-500">Mother's Name:</span>{" "}
                  {student.motherName}
                </p>
                <p>
                  <span className="text-gray-500">Mother's Phone:</span>{" "}
                  {student.motherPhone}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => updateStatus(student._id, "rejected")}
              className="inline-flex items-center gap-2 border px-4 py-2 rounded text-sm hover:bg-gray-100"
            >
              <CircleX className="h-4 w-4" />
              Reject
            </button>

            <button
              onClick={() => updateStatus(student._id, "admitted")}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              <CircleCheck className="h-4 w-4" />
              Admit
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
        const response = await API.get("/students");
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
    <>
      <div className="relative w-full overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-muted">
            <tr className="border-b">
              <th className="h-10 px-2 text-left font-medium text-muted-foreground">Student Name</th>
              <th className="h-10 px-2 text-left font-medium text-muted-foreground">Registration No.</th>
              <th className="h-10 px-2 text-left font-medium text-muted-foreground">Class</th>
              <th className="h-10 px-2 text-left font-medium text-muted-foreground">Application Date</th>
              <th className="h-10 px-2 text-left font-medium text-muted-foreground">Status</th>
              <th className="h-10 px-2 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student._id}
                className="border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-muted"
              >
                <td className="p-2 font-medium">{`${student.fName} ${student.lName || ""}`}</td>
                <td className="p-2">{student.orgUID}</td>
                <td className="p-2">{student.admissionClass}</td>
                <td className="p-2">
                  {new Date(student.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="p-2">
                  <StatusBadge status={student.status || "pending"} />
                </td>
                <td className="p-2 text-right">
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 h-8 text-xs font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <Dialog student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </>
  );
};

export default StudentTable;
