"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ClassStudentsPage() {
  const { id: classId } = useParams(); // get [id] from the URL
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classInfo, setClassInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: "",
    admissionNumber: "",
    email: "",
    password: "",
    phone: "",
    profilePicture: null,
    dateOfAdmission: "",
    fee: "",
    classId: classId || "", // default to current classId
  });
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((toast) => toast.id !== id)),
      3000
    );
  };
  const fetchClassInfo = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/classes/${classId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch class info");
      const data = await res.json();
      setClassInfo(data);
    } catch (error) {
      console.error("Error fetching class info:", error);
    }
  };
  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/classes/${classId}/students`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (classId) {
      setStudentForm((prev) => ({ ...prev, classId }));
      fetchStudents();
      fetchClassInfo();
    }
  }, [classId]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: checked }));
  };
  const handleFileChange = (e) => {
    setStudentForm((prev) => ({ ...prev, profilePicture: e.target.files[0] }));
  };
  const handleAddStudent = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/classes/${studentForm.classId}/students`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(studentForm),
        }
      );
      if (!res.ok) throw new Error("Failed to add student");
      // Reset the form after successful addition
      setStudentForm({
        name: "",
        admissionNumber: "",
        email: "",
        password: "",
        phone: "",
        profilePicture: null,
        dateOfAdmission: "",
        fee: "",
        classId: classId || "", // maintain classId
        dob: "",
        gender: "",
        orphan: false,
        identifiableMark: "",
        religion: "",
        siblings: "",
        bloodGroup: "",
        disease: "",
        address: "",
        fatherName: "",
        fatherOccupation: "",
        fatherMobile: "",
        fatherEducation: "",
        motherName: "",
        motherOccupation: "",
        motherMobile: "",
      });
      // Fetch students again to update the list
      fetchStudents();
      // Close modal and show success toast
      setIsModalOpen(false);
      showToast("Student added successfully!");
    } catch (error) {
      console.error("Error adding student:", error);
      showToast("Error adding student", "error");
    }
  };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Students in Class {classInfo?.name}
          {classInfo?.section ? classInfo.section.toUpperCase() : ""}
        </h1>
      </div>
      {loading ? (
        <p>Loading students...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map((student) => (
            <Link
              href={`/dashboard/students/${student._id}`}
              key={student._id}
              className="border p-4 rounded shadow hover:bg-gray-50 transition block"
            >
              <p>
                <strong>Name:</strong> {student.name}
              </p>
              <p>
                <strong>Admission No:</strong> {student.admissionNumber}
              </p>
              <p>
                <strong>Email:</strong> {student.email}
              </p>
            </Link>
          ))}
        </div>
      )}
    
    </div>
  );
}
