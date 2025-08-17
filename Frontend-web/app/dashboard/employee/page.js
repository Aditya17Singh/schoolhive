// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// export default function EmployeeDashboard() {
//   const [employees, setEmployees] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [search, setSearch] = useState("");
//   const [form, setForm] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const router = useRouter();

//   const fetchEmployees = useCallback(async () => {
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/employees?page=${page}&search=${encodeURIComponent(
//           search
//         )}`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );
//       if (!res.ok) throw new Error("Failed to fetch employees");
//       const data = await res.json();
//       setEmployees(data.employees);
//       setTotal(data.total);
//     } catch (error) {
//       console.error(error);
//     }
//   }, [page, search]);

//   const fetchSubjects = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/subjects", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch subjects");
//       const data = await res.json();
//       setSubjects(data);
//     } catch (error) {
//       console.error("Subjects fetch failed:", error);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, [fetchEmployees]);

//   useEffect(() => {
//     fetchSubjects();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "photo" && files?.length) {
//       setForm((f) => ({
//         ...f,
//         photoUrl: URL.createObjectURL(files[0]),
//         photo: files[0],
//       }));
//     } else if (name === "subjects") {
//       const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
//       setForm((f) => ({ ...f, subjects: selected }));
//     } else if (name === "role") {
//       setForm((f) => ({
//         ...f,
//         role: value,
//         subjects: value === "Teacher" ? f.subjects : [], // clear if not Teacher
//       }));
//     } else {
//       setForm((f) => ({ ...f, [name]: value }));
//     }
//   };

//   const handleSubmit = async () => {
//     const method = editMode ? "PUT" : "POST";
//     const url = editMode
//       ? `http://localhost:5000/api/employees/${selectedEmployee._id}`
//       : "http://localhost:5000/api/employees";

//     let uploadedPhotoUrl = form.photoUrl;

//     if (form.photo) {
//       const formData = new FormData();
//       formData.append("photo", form.photo);
//       try {
//         const res = await fetch("http://localhost:5000/api/upload", {
//           method: "POST",
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//           body: formData,
//         });
//         const data = await res.json();
//         uploadedPhotoUrl = data.url;
//       } catch (error) {
//         console.error("Image upload failed:", error);
//       }
//     }

//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     const schoolId = user.schoolId;

//     const payload = {
//       ...form,
//       photoUrl: uploadedPhotoUrl,
//       schoolId,
//     };

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);

//       // Success handling
//       console.log("Employee saved:", data);
//       setShowModal(false);
//     } catch (err) {
//       console.error("Error saving employee:", err.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this employee?")) return;

//     try {
//       const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       if (!res.ok) throw new Error("Failed to delete employee");
//       fetchEmployees();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const openEditModal = (employee) => {
//     setSelectedEmployee(employee);
//     setForm(employee);
//     setEditMode(true);
//     setShowModal(true);
//   };

//   const getInitials = (name) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   return (
//     <div className="p-4  mx-auto">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-semibold">All Employees</h2>
//         <div className="flex gap-2">
//           <input
//             placeholder="Search"
//             className="border px-3 py-1 rounded-md"
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button
//             onClick={() => {
//               setShowModal(true);
//               setEditMode(false);
//               setForm({});
//             }}
//             className="bg-blue-600 text-white px-3 py-1 rounded-md"
//           >
//             + Add Employee
//           </button>
//         </div>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-white p-8 shadow-xl">
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute right-4 top-3 text-2xl text-gray-500 hover:text-black"
//             >
//               &times;
//             </button>
//             <h3 className="text-2xl font-bold mb-6">
//               {editMode ? "Edit Employee" : "Add Employee"}
//             </h3>
//             <div className="space-y-8">
//               {/* Basic Information */}
//               <div>
//                 <h4 className="text-xl font-semibold mb-4">
//                   Basic Information
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {[
//                     { name: "employeeId", label: "Employee ID", type: "text" },
//                     {
//                       name: "role",
//                       label: "Role",
//                       type: "select",
//                       options: [
//                         "Principal",
//                         "Teacher",
//                         "Management Staff",
//                         "Accountant",
//                         "Store Manager",
//                         "Other",
//                       ],
//                     },
//                     { name: "email", label: "Email", type: "email" },
//                     { name: "firstName", label: "First Name", type: "text" },
//                     { name: "lastName", label: "Last Name", type: "text" },
//                     { name: "phone", label: "Phone", type: "text" },
//                     { name: "address", label: "Address", type: "text" },
//                     {
//                       name: "dateOfJoining",
//                       label: "Date of Joining",
//                       type: "date",
//                     },
//                     {
//                       name: "monthlySalary",
//                       label: "Monthly Salary",
//                       type: "number",
//                     },
//                   ].map((field) => (
//                     <div key={field.name} className="flex flex-col">
//                       <label className="text-sm font-medium mb-1">
//                         {field.label}
//                       </label>
//                       {field.type === "select" ? (
//                         <select
//                           name={field.name}
//                           value={form[field.name] || ""}
//                           onChange={handleChange}
//                           className="border p-2 rounded"
//                         >
//                           <option value="">Select {field.label}</option>
//                           {field.options.map((opt) => (
//                             <option key={opt} value={opt}>
//                               {opt}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         <input
//                           name={field.name}
//                           type={field.type}
//                           value={form[field.name] || ""}
//                           onChange={handleChange}
//                           className="border p-2 rounded"
//                         />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Other Information */}
//               <div>
//                 <h4 className="text-xl font-semibold mb-4">
//                   Other Information
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {[
//                     {
//                       name: "fatherOrHusbandName",
//                       label: "Father/Husband Name",
//                       type: "text",
//                     },
//                     {
//                       name: "gender",
//                       label: "Gender",
//                       type: "select",
//                       options: ["Male", "Female", "Other"],
//                     },
//                     { name: "experience", label: "Experience", type: "text" },
//                     { name: "religion", label: "Religion", type: "text" },
//                     { name: "birthDate", label: "Birth Date", type: "date" },
//                     { name: "education", label: "Education", type: "text" },
//                   ].map((field) => (
//                     <div key={field.name} className="flex flex-col">
//                       <label className="text-sm font-medium mb-1">
//                         {field.label}
//                       </label>
//                       {field.type === "select" ? (
//                         <select
//                           name={field.name}
//                           value={form[field.name] || ""}
//                           onChange={handleChange}
//                           className="border p-2 rounded"
//                         >
//                           <option value="">Select {field.label}</option>
//                           {field.options.map((opt) => (
//                             <option key={opt} value={opt}>
//                               {opt}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         <input
//                           name={field.name}
//                           type={field.type}
//                           value={form[field.name] || ""}
//                           onChange={handleChange}
//                           className="border p-2 rounded"
//                         />
//                       )}
//                     </div>
//                   ))}

//                   {/* Subjects (multiple select) */}
//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium mb-1">Subjects</label>
//                     <select
//                       name="subjects"
//                       multiple
//                       value={form.subjects || []}
//                       onChange={handleChange}
//                       className="border p-2 rounded h-32"
//                       disabled={form.role !== "Teacher"}
//                     >
//                       {subjects.map((s) => (
//                         <option key={s._id} value={s._id}>
//                           {s.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Photo Upload */}
//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium mb-1">Photo</label>
//                     <input
//                       type="file"
//                       name="photo"
//                       onChange={handleChange}
//                       className="border p-2 rounded"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={handleSubmit}
//               className="mt-6 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-semibold"
//             >
//               {editMode ? "Update Employee" : "Create Employee"}
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
//         <table className="min-w-full bg-white text-sm">
//           <thead className="bg-gray-300 text-gray-700 font-semibold">
//             <tr>
//               <th className="py-3 px-4 text-left">Avatar</th>
//               <th className="py-3 px-4 text-left">Name</th>
//               <th className="py-3 px-4 text-left">Employee ID</th>
//               <th className="py-3 px-4 text-left">Phone</th>
//               <th className="py-3 px-4 text-left">Role</th>
//               <th className="py-3 px-4 text-left">Subjects</th>
//               <th className="py-3 px-4 text-left">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-100">
//             {employees.map((emp) => (
//               <tr key={emp._id} className="hover:bg-gray-50">
//                 <td className="py-3 px-4">
//                   {emp.photoUrl ? (
//                     <Image
//                       src={emp.photoUrl}
//                       alt="avatar"
//                       width={40}
//                       height={40}
//                       className="rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
//                       {getInitials(`${emp.firstName} ${emp.lastName}`)}
//                     </div>
//                   )}
//                 </td>
//                 <td
//                   onClick={() => router.push(`/dashboard/employee/${emp._id}`)}
//                   className="py-3 px-4 text-blue-600 hover:underline cursor-pointer"
//                 >
//                   {emp.firstName} {emp.lastName}
//                 </td>
//                 <td className="py-3 px-4">{emp.employeeId}</td>
//                 <td className="py-3 px-4">{emp.phone}</td>
//                 <td className="py-3 px-4">{emp.role || "-"}</td>{" "}
//                 {/* ✅ Role added here */}
//                 <td className="py-3 px-4">
//                   {(emp.subjects || [])
//                     .map((id) => subjects.find((s) => s._id === id)?.name)
//                     .filter(Boolean)
//                     .join(", ") || "-"}
//                 </td>
//                 <td className="py-3 px-4 space-x-2">
//                   <button
//                     onClick={() => openEditModal(emp)}
//                     className="text-blue-500 hover:underline"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(emp._id)}
//                     className="text-red-500 hover:underline"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="mt-6 flex justify-center gap-2">
//         <button
//           disabled={page === 1}
//           onClick={() => setPage((p) => p - 1)}
//           className="px-4 py-2 bg-gray-200 rounded"
//         >
//           Prev
//         </button>
//         <button
//           disabled={page * 10 >= total}
//           onClick={() => setPage((p) => p + 1)}
//           className="px-4 py-2 bg-gray-200 rounded"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }
