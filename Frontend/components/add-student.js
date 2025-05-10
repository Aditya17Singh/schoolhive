"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// Modal Form State
export default function AddStudentModal({
  isOpen,
  closeModal,
  handleAddStudent,
}) {
  const [studentForm, setStudentForm] = useState({
    name: "",
    admissionNumber: "",
    email: "",
    phone: "",
    profilePicture: null,
    dateOfAdmission: "",
    fee: "",
    classId: "",

    // Section 2: Other Info
    dob: "",
    gender: "",
    orphan: false,
    identifiableMark: "",
    religion: "",
    siblings: "",
    bloodGroup: "",
    disease: "",
    address: "",

    // Father Info
    fatherName: "",
    fatherOccupation: "",
    fatherMobile: "",
    fatherEducation: "",

    // Mother Info
    motherName: "",
    motherOccupation: "",
    motherMobile: "",
    motherEducation: "",
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentForm({
      ...studentForm,
      [name]: value,
    });
  };

  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((toast) => toast.id !== id)),
      3000
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    for (let key in studentForm) {
      if (key === "profilePicture" && studentForm[key]) {
        formData.append(
          "profilePicture",
          studentForm[key],
          studentForm[key].name
        );
      } else {
        formData.append(key, studentForm[key]);
      }
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/students/class/${studentForm.classId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = res.data;
      handleAddStudent(); // Refresh list
      closeModal(); // Close modal
      showToast("Student added successfully!");
    } catch (err) {
      showToast("Error adding student", "error");
      console.error(err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/classes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = res.data;
      setClasses(data);
    } catch (error) {
      console.error(error);
      showToast("Error fetching classes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchClasses();
    }
  }, [isOpen]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setStudentForm((prev) => ({ ...prev, profilePicture: file }));
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg relative p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Add Student</h2>

          <button
            className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
            onClick={closeModal}
          >
            ✕
          </button>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Section 1: Student Info */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Student Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={studentForm.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Admission Number</label>
                  <input
                    type="text"
                    name="admissionNumber"
                    placeholder="Admission Number"
                    value={studentForm.admissionNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={studentForm.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={studentForm.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Profile Picture</label>
                  <input
                    type="file"
                    name="profilePicture"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Date of Admission</label>
                  <input
                    type="date"
                    name="dateOfAdmission"
                    value={studentForm.dateOfAdmission}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Fee</label>
                  <input
                    type="number"
                    name="fee"
                    placeholder="Fee"
                    value={studentForm.fee}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Select Class</label>
                  <select
                    name="classId"
                    value={studentForm.classId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name} {cls.section}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Section 2: Other Info */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Other Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={studentForm.dob}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={studentForm.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="orphan"
                      checked={studentForm.orphan}
                      onChange={handleCheckboxChange}
                    />
                    <span>Orphan</span>
                  </label>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Identifiable Mark</label>
                  <input
                    type="text"
                    name="identifiableMark"
                    placeholder="Identifiable Mark"
                    value={studentForm.identifiableMark}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Religion</label>
                  <input
                    type="text"
                    name="religion"
                    placeholder="Religion"
                    value={studentForm.religion}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">No. of Siblings</label>
                  <input
                    type="number"
                    name="siblings"
                    placeholder="No. of Siblings"
                    value={studentForm.siblings}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Blood Group</label>
                  <input
                    type="text"
                    name="bloodGroup"
                    placeholder="Blood Group"
                    value={studentForm.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Any Disease</label>
                  <input
                    type="text"
                    name="disease"
                    placeholder="Any Disease"
                    value={studentForm.disease}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    placeholder="Address"
                    value={studentForm.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                  ></textarea>
                </div>
              </div>
            </section>

            {/* Father Info Section */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Father&apos;s Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Father&apos;s Name</label>
                  <input
                    type="text"
                    name="fatherName"
                    placeholder="Father's Name"
                    value={studentForm.fatherName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Father&apos;s Occupation</label>
                  <input
                    type="text"
                    name="fatherOccupation"
                    placeholder="Father's Occupation"
                    value={studentForm.fatherOccupation}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Father&apos;s Mobile</label>
                  <input
                    type="text"
                    name="fatherMobile"
                    placeholder="Father's Mobile"
                    value={studentForm.fatherMobile}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Father&apos;s Education</label>
                  <input
                    type="text"
                    name="fatherEducation"
                    placeholder="Father's Education"
                    value={studentForm.fatherEducation}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </section>

            {/* Mother Info Section */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Mother&apos;s Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Mother&apos;s Name</label>
                  <input
                    type="text"
                    name="motherName"
                    placeholder="Mother's Name"
                    value={studentForm.motherName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Mother&apos;s Occupation</label>
                  <input
                    type="text"
                    name="motherOccupation"
                    placeholder="Mother's Occupation"
                    value={studentForm.motherOccupation}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Mother&apos;s Mobile</label>
                  <input
                    type="text"
                    name="motherMobile"
                    placeholder="Mother's Mobile"
                    value={studentForm.motherMobile}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Mother&apos;s Education</label>
                  <input
                    type="text"
                    name="motherEducation"
                    placeholder="Mother's Education"
                    value={studentForm.motherEducation}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="text-right pt-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
              >
                ➕ Add Student
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
