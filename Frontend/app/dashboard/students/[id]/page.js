// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";

// export default function StudentDetailsPage() {
//   const { id } = useParams();
//   const [student, setStudent] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [editMode, setEditMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [classes, setClasses] = useState([]); 

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//     useEffect(() => {
//       if (!id || !token) return;
    
//       const fetchStudent = axios.get(`http://localhost:5000/api/students/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
    
//       const fetchClasses = axios.get(`http://localhost:5000/api/classes`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
    
//       Promise.all([fetchStudent, fetchClasses])
//         .then(([studentRes, classesRes]) => {
//           setStudent(studentRes.data);
//           setFormData({
//             ...studentRes.data,
//             classId: studentRes.data.class?._id, // Store classId for editing
//           });
//           setClasses(classesRes.data);
//         })
//         .catch((err) => {
//           console.error("Error fetching data:", err.response?.data || err.message);
//         })
//         .finally(() => setLoading(false));
//     }, [id, token]);
    

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.put(
//         `http://localhost:5000/api/students/${id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
  
//       // Find and attach the full class object from local list
//       const updatedClass = classes.find((cls) => cls._id === formData.classId);
  
//       setStudent({
//         ...res.data,
//         class: updatedClass || res.data.class 
//       });
  
//       setEditMode(false);
//     } catch (error) {
//       console.error(
//         "Error updating student:",
//         error.response?.data || error.message
//       );
//     }
//   };
  

//   if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
//   if (!student) return <p className="p-6 text-red-600">Student not found.</p>;

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-8">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-blue-700">Student Profile</h1>
//         <div className="space-x-2">
//           {editMode ? (
//             <>
//               <button
//                 onClick={() => setEditMode(false)}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//               >
//                 Save Changes
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={() => setEditMode(true)}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Edit
//             </button>
//           )}
//         </div>
//       </div>

//       {student.profilePicture && (
//         <div className="flex justify-center">
//           <img
//             src={student.profilePicture}
//             alt="Profile"
//             className="w-32 h-32 rounded-full border-2 border-gray-300 object-cover"
//           />
//         </div>
//       )}

//       <form className="space-y-10" onSubmit={handleSubmit}>
//         {/* Section 1: Basic Info */}
//         <Section title="Basic Information">
//           <Field
//             label="Name"
//             value={formData.name}
//             editable={editMode}
//             onChange={(val) => handleChange("name", val)}
//           />
//           <Field
//             label="Admission Number"
//             value={formData.admissionNumber}
//             editable={editMode}
//             onChange={(val) => handleChange("admissionNumber", val)}
//           />
//           <Field
//             label="Email"
//             value={formData.email}
//             editable={editMode}
//             onChange={(val) => handleChange("email", val)}
//           />
//           <Field
//             label="Phone"
//             value={formData.phone}
//             editable={editMode}
//             onChange={(val) => handleChange("phone", val)}
//           />
//           <Field
//             label="Date of Admission"
//             type="date"
//             value={formData.dateOfAdmission?.slice(0, 10)}
//             editable={editMode}
//             onChange={(val) => handleChange("dateOfAdmission", val)}
//           />
//           <Field
//             label="Fee"
//             value={formData.fee}
//             editable={editMode}
//             onChange={(val) => handleChange("fee", val)}
//           />
//         </Section>

//         {/* Section 2: Academic */}
//         <Section title="Academic Details">
//           {editMode ? (
//             <Field
//               label="Class & Section"
//               value={formData.classId || ""}
//               editable={true}
//               type="select"
//               options={classes.map((cls) => ({
//                 label: `${cls.name} - ${cls.section}`,
//                 value: cls._id,
//               }))}
//               onChange={(val) => handleChange("classId", val)}
//             />
//           ) : (
//             <Field
//               label="Class & Section"
//               value={
//                 student.class
//                   ? `${student.class.name} - ${student.class.section}`
//                   : ""
//               }
//               editable={false}
//             />
//           )}
//         </Section>
//         {/* Section 3: Other Info */}
//         <Section title="Other Information">
//           <Field
//             label="Date of Birth"
//             type="date"
//             value={formData.dob?.slice(0, 10)}
//             editable={editMode}
//             onChange={(val) => handleChange("dob", val)}
//           />
//           <Field
//             label="Gender"
//             value={formData.gender}
//             editable={editMode}
//             onChange={(val) => handleChange("gender", val)}
//           />
//           <Field
//             label="Orphan"
//             value={formData.orphan ? "Yes" : "No"}
//             editable={editMode}
//             onChange={(val) => handleChange("orphan", val === "Yes")}
//           />
//           <Field
//             label="Identifiable Mark"
//             value={formData.identifiableMark}
//             editable={editMode}
//             onChange={(val) => handleChange("identifiableMark", val)}
//           />
//           <Field
//             label="Religion"
//             value={formData.religion}
//             editable={editMode}
//             onChange={(val) => handleChange("religion", val)}
//           />
//           <Field
//             label="Siblings"
//             value={formData.siblings}
//             editable={editMode}
//             onChange={(val) => handleChange("siblings", val)}
//           />
//           <Field
//             label="Blood Group"
//             value={formData.bloodGroup}
//             editable={editMode}
//             onChange={(val) => handleChange("bloodGroup", val)}
//           />
//           <Field
//             label="Disease"
//             value={formData.disease}
//             editable={editMode}
//             onChange={(val) => handleChange("disease", val)}
//           />
//           <Field
//             label="Address"
//             value={formData.address}
//             editable={editMode}
//             onChange={(val) => handleChange("address", val)}
//           />
//         </Section>

//         {/* Section 4: Father Info */}
//         <Section title="Father/Guardian Info">
//           <Field
//             label="Father Name"
//             value={formData.fatherName}
//             editable={editMode}
//             onChange={(val) => handleChange("fatherName", val)}
//           />
//           <Field
//             label="Occupation"
//             value={formData.fatherOccupation}
//             editable={editMode}
//             onChange={(val) => handleChange("fatherOccupation", val)}
//           />
//           <Field
//             label="Mobile"
//             value={formData.fatherMobile}
//             editable={editMode}
//             onChange={(val) => handleChange("fatherMobile", val)}
//           />
//           <Field
//             label="Education"
//             value={formData.fatherEducation}
//             editable={editMode}
//             onChange={(val) => handleChange("fatherEducation", val)}
//           />
//         </Section>

//         {/* Section 5: Mother Info */}
//         <Section title="Mother Info">
//           <Field
//             label="Mother Name"
//             value={formData.motherName}
//             editable={editMode}
//             onChange={(val) => handleChange("motherName", val)}
//           />
//           <Field
//             label="Occupation"
//             value={formData.motherOccupation}
//             editable={editMode}
//             onChange={(val) => handleChange("motherOccupation", val)}
//           />
//           <Field
//             label="Mobile"
//             value={formData.motherMobile}
//             editable={editMode}
//             onChange={(val) => handleChange("motherMobile", val)}
//           />
//         </Section>
//       </form>
//     </div>
//   );
// }

// // Section Component
// function Section({ title, children }) {
//   return (
//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold text-gray-700 border-b pb-1">
//         {title}
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
//     </div>
//   );
// }

// // Field Component
// function Field({ label, value, editable, type = "text", options, onChange }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
//       {editable ? (
//         type === "select" ? (
//           <select
//             value={value || ""}
//             onChange={(e) => onChange(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2"
//           >
//             <option value="">Select</option>
//             {options.map((opt) => (
//               <option key={opt.value} value={opt.value}>
//                 {opt.label}
//               </option>
//             ))}
//           </select>
//         ) : (
//           <input
//             type={type}
//             value={value || ""}
//             onChange={(e) => onChange(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2"
//           />
//         )
//       ) : (
//         <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
//           {value || "-"}
//         </div>
//       )}
//     </div>
//   );
// }
