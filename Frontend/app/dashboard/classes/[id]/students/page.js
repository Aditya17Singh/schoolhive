"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ClassStudentsPage() {
  const { id: classId } = useParams(); // get [id] from the URL

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3000);
  };
  const fetchStudents = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/classes/${classId}/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
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
      const res = await fetch(`http://localhost:5000/api/classes/${studentForm.classId}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(studentForm),
      });
  
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
        <h1 className="text-2xl font-bold">Students in Class</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          ➕ Add Student
        </button>
      </div>

      {loading ? (
        <p>Loading students...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map((student) => (
            <div key={student._id} className="border p-4 rounded shadow">
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Admission No:</strong> {student.admissionNumber}</p>
              <p><strong>Email:</strong> {student.email}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-lg relative p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Add Student</h2>
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <form
  onSubmit={(e) => {
    e.preventDefault();
    handleAddStudent();
  }}
  className="space-y-6"
>
  {/* Section 1: Student Info */}
  <section>
    <h3 className="text-lg font-semibold mb-2">Student Info</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input type="text" name="name" placeholder="Full Name" value={studentForm.name} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" required />
      <input type="text" name="admissionNumber" placeholder="Admission Number" value={studentForm.admissionNumber} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" required />
      <input type="email" name="email" placeholder="Email" value={studentForm.email} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" required />
      <input type="password" name="password" placeholder="Password (optional)" value={studentForm.password} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      <input type="text" name="phone" placeholder="Phone Number" value={studentForm.phone} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      <input type="file" name="profilePicture" onChange={(e) => handleFileChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      <input type="date" name="dateOfAdmission" value={studentForm.dateOfAdmission} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      <input type="number" name="fee" placeholder="Fee" value={studentForm.fee} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      {/* <select name="classId" value={studentForm.classId} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" required>
        <option value="">Select Class</option>
        {classes.map((cls) => (
          <option key={cls._id} value={cls._id}>{cls.name}</option>
        ))}
      </select> */}
    </div>
  </section>

  {/* Section 2: Other Info */}
  <section>
    <h3 className="text-lg font-semibold mb-2">Other Information</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input type="date" name="dob" value={studentForm.dob} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      <select name="gender" value={studentForm.gender} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded">
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
      <label className="flex items-center gap-2 col-span-2">
        <input type="checkbox" name="orphan" checked={studentForm.orphan} onChange={(e) => handleCheckboxChange(e, setStudentForm)} />
        <span>Orphan</span>
      </label>
      <input type="text" name="identifiableMark" placeholder="Identifiable Mark" value={studentForm.identifiableMark} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      <input type="text" name="religion" placeholder="Religion" value={studentForm.religion} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      <input type="number" name="siblings" placeholder="No. of Siblings" value={studentForm.siblings} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      <input type="text" name="bloodGroup" placeholder="Blood Group" value={studentForm.bloodGroup} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      <input type="text" name="disease" placeholder="Any Disease" value={studentForm.disease} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      <textarea name="address" placeholder="Address" value={studentForm.address} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" rows={2}></textarea>
    </div>
  </section>

  {/* Section 3: Father Info */}
  <section>
    <h3 className="text-lg font-semibold mb-2">Father / Guardian Info</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input type="text" name="fatherName" placeholder="Father's Name" value={studentForm.fatherName} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      <input type="text" name="fatherOccupation" placeholder="Occupation" value={studentForm.fatherOccupation} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      <input type="text" name="fatherMobile" placeholder="Mobile Number" value={studentForm.fatherMobile} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      <input type="text" name="fatherEducation" placeholder="Education" value={studentForm.fatherEducation} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
    </div>
  </section>

  {/* Section 4: Mother Info */}
  <section>
    <h3 className="text-lg font-semibold mb-2">Mother Info</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input type="text" name="motherName" placeholder="Mother's Name" value={studentForm.motherName} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      <input type="text" name="motherOccupation" placeholder="Occupation" value={studentForm.motherOccupation} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
      <input type="text" name="motherMobile" placeholder="Mobile Number" value={studentForm.motherMobile} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
    </div>
  </section>

  {/* Submit Button */}
  <div className="text-right pt-4">
    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow">
      ➕ Add Student
    </button>
  </div>
</form>

          </div>
        </div>
      )}
    </div>
  );
}
