"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ClassList() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [modalClassId, setModalClassId] = useState(null);


  // Forms
  const [classForm, setClassForm] = useState({ name: "", section: "" });
  const [studentForm, setStudentForm] = useState({
    name: "",
    admissionNumber: "",
    email: "",
    password: "",
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
  });  

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("user"));
    if (admin?.schoolCode && isStudentModalOpen) {
      setStudentForm((prev) => ({ ...prev, schoolCode: admin.schoolCode }));
    }
  }, [isStudentModalOpen]);
  

  // File Inputs
  const [studentFile, setStudentFile] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Toast Notification Function
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3000);
  };

  // User Authentication Check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.replace("/");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      router.replace("/");
      return;
    }

    setUser(parsedUser);
    fetchClasses();
  }, []);

  // Fetch Classes from API
  const fetchClasses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/classes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch classes");
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error(error);
      showToast("Error fetching classes", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Students for a Selected Class
  const fetchStudents = async (classId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/classes/${classId}/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents((prev) => ({ ...prev, [classId]: data }));
    } catch (error) {
      console.error(error);
      showToast("Error fetching students", "error");
    }
  };

  // Handle Input Changes
  const handleInputChange = (e, setter) => {
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle Deleting a Student
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/students/${studentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete student");
      showToast("Student deleted successfully!");
      fetchStudents(selectedClass);
    } catch (error) {
      showToast("Error deleting student", "error");
    }
  };

  // Handle Adding a Class
  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(classForm),
      });
      if (!res.ok) throw new Error("Failed to add class");
      const newClass = await res.json();
      setClasses([...classes, newClass]);
      setClassForm({ name: "", section: "" });
      showToast("Class added successfully!");
    } catch (error) {
      showToast("Error adding class", "error");
    }
  };

  // Handle Adding a Student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedClass) {
      showToast("Please select a class first!", "error");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/classes/${selectedClass}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(studentForm),
      });
      if (!res.ok) throw new Error("Failed to add student");
      setStudentForm({ name: "", admissionNumber: "", email: "", password: "" });
      fetchStudents(selectedClass);
      showToast("Student added successfully!");
    } catch (error) {
      showToast("Error adding student", "error");
    }
  };

  const handleAddStudentToClass = async (classId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/classes/${classId}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(studentForm),
      });
      if (!res.ok) throw new Error("Failed to add student");
      setStudentForm({ name: "", admissionNumber: "", email: "", password: "" });
      fetchStudents(classId);
      showToast("Student added successfully!");
      setIsStudentModalOpen(false);
    } catch (error) {
      showToast("Error adding student", "error");
    }
  };


  const handleCheckboxChange = (e, setter) => {
    const { name, checked } = e.target;
    setter(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e, setForm) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, profilePicture: reader.result })); // Base64 string
    };
    reader.readAsDataURL(file);
  };
  
  // Handle Class Selection
  const handleClassSelection = (classId) => {
    setSelectedClass(classId);
    fetchStudents(classId);
  };

  // Handle Deleting a Class
  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/classes/${classId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete class");
      showToast("Class deleted successfully!");
      fetchClasses(); // Refetch classes after deletion
    } catch (error) {
      showToast("Error deleting class", "error");
    }
  };

  // Handle Bulk Upload for Students
  const handleBulkStudentUpload = async (e) => {
    const file = e.target.files[0];
    setStudentFile(file);
    if (!file || !selectedClass) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const rows = reader.result.split("\n").map((row) => row.split(","));
      const studentData = rows.map(([name, admissionNumber, email, password]) => ({
        name,
        admissionNumber,
        email,
        password,
      }));

      for (const student of studentData) {
        try {
          const res = await fetch(`http://localhost:5000/api/classes/${selectedClass}/students`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(student),
          });
          if (!res.ok) throw new Error("Failed to add student");
        } catch (error) {
          console.error("Error adding student", error);
        }
      }
      showToast("Students added successfully!");
      fetchStudents(selectedClass);
    };
    reader.readAsText(file);
  };

  // Handle Search for Classes
  const handleClassSearch = (e) => setSearch(e.target.value);

  // Escape Regular Expression Characters
  const escapeRegExp = (string) => string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');

  // Filtered Classes Based on Search
  const sortedClasses = [...classes].sort((a, b) => a.name.localeCompare(b.name));

  const filteredClasses = sortedClasses.filter(
    (cls) => `${cls.name} ${cls.section}`.toLowerCase().includes(escapeRegExp(search.toLowerCase()))
  );

  // Loading Skeleton
  if (loading) {
    return (
      <div className="p-6 gap-6">
        {/* Skeleton for Left Side */}
        <div className="bg-white p-6 shadow-md rounded-lg space-y-4 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>

        {/* Skeleton for Right Side */}
        <div className="bg-white p-6 shadow-md rounded-lg space-y-4 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded shadow-md text-white ${toast.type === "error" ? "bg-red-600" : "bg-green-600"
              }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-6">Manage Classes & Students</h1>

      <div className="grid gap-6">
        {/* LEFT SIDE: Class Actions */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Create or Select Class</h2>

          {/* Add Class */}
          <form onSubmit={handleAddClass} className="mb-6">
            <div className="flex space-x-2 mb-2">
              <select
                name="name"
                value={classForm.name}
                onChange={(e) => handleInputChange(e, setClassForm)}
                className="flex-1 p-2 border rounded"
                required
              >
                <option value="">Select Class</option>
                {[
                  "Nursery",
                  "LKG",
                  "UKG",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                ].map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>

              <select
                name="section"
                value={classForm.section}
                onChange={(e) => handleInputChange(e, setClassForm)}
                className="flex-1 p-2 border rounded"
                required
              >
                <option value="">Select Section</option>
                {["A", "B", "C", "D", "E", "F"].map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              ➕ Add Class
            </button>
          </form>

          <div>
            <label className="block font-medium mb-2">
              Search or Select a Class
            </label>
            <input
              type="text"
              value={search}
              onChange={handleClassSearch}
              className="w-full p-2 border rounded mb-2"
              placeholder="Search for a class"
            />

            <div className="max-h-60 overflow-y-auto">
              {classes.length === 0 ? (
                <p className="text-red-600">Please add a class first.</p>
              ) : (
                filteredClasses.map((cls) => (
                  <div
                    key={cls._id}
                    className="flex items-center justify-between border-b py-2"
                  >
                    <div
                      // onClick={() => handleClassSelection(cls._id)}
                      onClick={() => router.push(`/dashboard/classes/${cls._id}/students`)}
                      className="cursor-pointer flex-1"
                    >
                      {cls.name} - {cls.section}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/dashboard/classes/${cls._id}/students`}>
                        <button className="text-blue-600 hover:underline text-sm">View Students</button>
                      </Link>
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalClassId(cls._id);
                          setIsStudentModalOpen(true);
                        }}
                        className="text-green-600 hover:underline text-sm"
                      >
                        ➕
                      </button> */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClass(cls._id);
                        }}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Student Actions */}
        {isStudentModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            {/* <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg relative p-6"> */}
              {/* <h2 className="text-2xl font-bold mb-6 text-center">Add Student</h2> */}

              {/* <button
                className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
                onClick={() => setIsStudentModalOpen(false)}
              >
                ✕
              </button> */}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // handleAddStudentToClass(modalClassId);
                }}
                className="space-y-6"
              >
                {/* Section 1: Student Info */}
                {/* <section>
                  <h3 className="text-lg font-semibold mb-2">Student Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Full Name" value={studentForm.name} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" required />
                    <input type="text" name="admissionNumber" placeholder="Admission Number" value={studentForm.admissionNumber} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" required />
                    <input type="email" name="email" placeholder="Email" value={studentForm.email} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" required />
                    <input type="password" name="password" placeholder="Password (optional)" value={studentForm.password} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
                    <input type="text" name="phone" placeholder="Phone Number" value={studentForm.phone} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
                    <input type="file" name="profilePicture" onChange={(e) => handleFileChange(e, setStudentForm)} className="w-full p-2 border rounded" />
                    <label className="col-span-2">
                      <span className="block mb-1 text-sm font-medium text-gray-700">Date of Admission</span>
                      <input type="date" name="dateOfAdmission" value={studentForm.dateOfAdmission} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
                    </label>
                    <input type="number" name="fee" placeholder="Fee" value={studentForm.fee} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
                    <select name="classId" value={studentForm.classId} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" required>
                      <option value="">Select Class</option>
                      {classes.map((cls) => (
                        <option key={cls._id} value={cls._id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                </section> */}

                {/* Section 2: Other Info */}
                {/* <section>
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
                </section> */}

                {/* Section 3: Father Info */}
                {/* <section>
                  <h3 className="text-lg font-semibold mb-2">Father / Guardian Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" name="fatherName" placeholder="Father's Name" value={studentForm.fatherName} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
                    <input type="text" name="fatherOccupation" placeholder="Occupation" value={studentForm.fatherOccupation} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
                    <input type="text" name="fatherMobile" placeholder="Mobile Number" value={studentForm.fatherMobile} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
                    <input type="text" name="fatherEducation" placeholder="Education" value={studentForm.fatherEducation} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
                  </div>
                </section> */}

                {/* Section 4: Mother Info */}
                {/* <section>
                  <h3 className="text-lg font-semibold mb-2">Mother Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" name="motherName" placeholder="Mother's Name" value={studentForm.motherName} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
                    <input type="text" name="motherOccupation" placeholder="Occupation" value={studentForm.motherOccupation} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
                    <input type="text" name="motherMobile" placeholder="Mobile Number" value={studentForm.motherMobile} onChange={(e) => handleInputChange(e, setStudentForm)} className="w-full p-2 border rounded" />
                  </div>
                </section> */}

                {/* Submit Button */}
                {/* <div className="text-right pt-4">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow">
                    ➕ Add Student
                  </button>
                </div> */}
              </form>
            {/* </div> */}
          </div>
        )}
      </div>
    </div>
  );
}
