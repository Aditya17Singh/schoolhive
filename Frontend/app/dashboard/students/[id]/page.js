"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "@/lib/api";
import Link from "next/link";

import {
  User,
  Phone,
  Mail,
  BookOpen,
  FileText,
  CreditCard,
  GraduationCap,
  Edit3,
  Save,
  X,
  ChevronRight,
} from "lucide-react";

// MAIN COMPONENT
export default function StudentDetailsPage() {
  const { id: orgUID } = useParams();
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [activeTab, setActiveTab] = useState("Profile");

  useEffect(() => {
    if (!orgUID) return;

    const fetchStudent = API.get(`/students/${orgUID}`);
    const fetchClasses = API.get(`/classes`);

    Promise.all([fetchStudent, fetchClasses])
      .then(([studentRes, classesRes]) => {
        setStudent(studentRes.data);
        setFormData({
          ...studentRes.data,
          classId: studentRes.data.class?._id,
        });
        setClasses(classesRes.data);
      })
      .catch((err) => {
        console.error(
          "Error fetching student:",
          err.response?.data || err.message
        );
      })
      .finally(() => setLoading(false));
  }, [orgUID]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData };
      const response = await API.put(`/students/${student._id}`, payload);

      if (response.status === 200) {
        setEditMode(false);
        setFormData(response.data.student);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">
            Loading student details...
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-semibold text-lg">
            Student not found
          </p>
          <p className="text-gray-500 mt-2">
            The requested student could not be located.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Link
              href="/dashboard/students"
              className="hover:underline hover:text-gray-700 cursor-pointer"
            >
              Student
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium">
              {student.fName} {student.lName}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT CARD - Profile Summary */}
          <div className="lg:col-span-1 mb-6 lg:mb-0">
            <div className="bg-white rounded-2xl  shadow-xl border border-gray-100 overflow-hidden h-full lg:h-[calc(100vh-130px)] sticky top-24">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center relative">
                <div className="absolute top-4 right-4">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      student.status === "Active"
                        ? "bg-green-500/20 text-green-100 border border-green-400/30"
                        : "bg-red-500/20 text-red-100 border border-red-400/30"
                    }`}
                  >
                    {student.status}
                  </div>
                </div>

                <div className="relative inline-block mb-4">
                  {student.profilePicture ? (
                    <img
                      src={student.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-white/20 object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center">
                      <User className="w-10 h-10 text-white/80" />
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white mb-1">
                  {student.fName} {student.lName}
                </h2>
                <p className="text-blue-100 text-sm font-medium">
                  {student.orgUID}
                </p>
              </div>

              {/* Quick Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Class & Section</p>
                    <p className="font-semibold text-gray-900">
                      {student.admissionClass} - {student.section}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-semibold text-gray-900">
                      {student.contactNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900 text-sm break-all">
                      {student.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION - Tabs & Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <Tabs
                tabs={[
                  { id: "Profile", label: "Profile", icon: User },
                  { id: "Fees", label: "Fees", icon: CreditCard },
                  { id: "Exams", label: "Exams", icon: BookOpen },
                  { id: "Documents", label: "Documents", icon: FileText },
                ]}
                active={activeTab}
                onChange={setActiveTab}
              />

              <div className="p-8">
                {activeTab === "Profile" && (
                  <div className="space-y-10">
                    <Section title="Basic Information" icon={User}>
                      <Field
                        label="First Name"
                        value={formData.fName}
                        editable={editMode}
                        onChange={(val) => handleChange("fName", val)}
                      />
                      <Field
                        label="Last Name"
                        value={formData.lName}
                        editable={editMode}
                        onChange={(val) => handleChange("lName", val)}
                      />
                      <Field
                        label="Date of Birth"
                        type="date"
                        value={formData.dob?.slice(0, 10)}
                        editable={editMode}
                        onChange={(val) => handleChange("dob", val)}
                      />
                      <Field
                        label="Gender"
                        value={formData.gender}
                        editable={editMode}
                        onChange={(val) => handleChange("gender", val)}
                      />
                      <Field
                        label="Aadhaar Number"
                        value={formData.aadhaarNumber}
                        editable={editMode}
                        onChange={(val) => handleChange("aadhaarNumber", val)}
                      />
                      <Field
                        label="Religion"
                        value={formData.religion}
                        editable={editMode}
                        onChange={(val) => handleChange("religion", val)}
                      />
                      <Field
                        label="Category"
                        value={formData.category}
                        editable={editMode}
                        onChange={(val) => handleChange("category", val)}
                      />
                      <Field
                        label="Nationality"
                        value={formData.nationality}
                        editable={editMode}
                        onChange={(val) => handleChange("nationality", val)}
                      />
                    </Section>

                    <Section title="Academic Details" icon={GraduationCap}>
                      <Field
                        label="Session"
                        value={formData.session}
                        editable={editMode}
                        onChange={(val) => handleChange("session", val)}
                      />
                      <Field
                        label="Class"
                        value={formData.admissionClass}
                        editable={editMode}
                        onChange={(val) => handleChange("admissionClass", val)}
                      />
                      <Field
                        label="Section"
                        value={formData.section}
                        editable={editMode}
                        onChange={(val) => handleChange("section", val)}
                      />
                      <Field
                        label="Status"
                        value={formData.status}
                        editable={editMode}
                        onChange={(val) => handleChange("status", val)}
                      />
                    </Section>

                    <Section title="Contact Information" icon={Phone}>
                      <Field
                        label="Phone Number"
                        value={formData.contactNumber}
                        editable={editMode}
                        onChange={(val) => handleChange("contactNumber", val)}
                      />
                      <Field
                        label="Email"
                        value={formData.email}
                        editable={editMode}
                        onChange={(val) => handleChange("email", val)}
                      />
                    </Section>

                    <Section title="Father / Guardian Information" icon={User}>
                      <Field
                        label="Father's Name"
                        value={formData.fatherName}
                        editable={editMode}
                        onChange={(val) => handleChange("fatherName", val)}
                      />
                      <Field
                        label="Father's Phone"
                        value={formData.fatherPhone}
                        editable={editMode}
                        onChange={(val) => handleChange("fatherPhone", val)}
                      />
                      <Field
                        label="Father's Email"
                        value={formData.fatherEmail}
                        editable={editMode}
                        onChange={(val) => handleChange("fatherEmail", val)}
                      />
                      <Field
                        label="Guardian Name"
                        value={formData.guardianName}
                        editable={editMode}
                        onChange={(val) => handleChange("guardianName", val)}
                      />
                      <Field
                        label="Guardian Phone"
                        value={formData.guardianPhone}
                        editable={editMode}
                        onChange={(val) => handleChange("guardianPhone", val)}
                      />
                    </Section>

                    <Section title="Mother Information" icon={User}>
                      <Field
                        label="Mother's Name"
                        value={formData.motherName}
                        editable={editMode}
                        onChange={(val) => handleChange("motherName", val)}
                      />
                      <Field
                        label="Mother's Phone"
                        value={formData.motherPhone}
                        editable={editMode}
                        onChange={(val) => handleChange("motherPhone", val)}
                      />
                      <Field
                        label="Mother's Email"
                        value={formData.motherEmail}
                        editable={editMode}
                        onChange={(val) => handleChange("motherEmail", val)}
                      />
                    </Section>

                    {/* Action Buttons at bottom of Profile tab */}
                    <div className="pt-8 flex justify-end gap-4">
                      {editMode ? (
                        <>
                          <button
                            onClick={() => setEditMode(false)}
                            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                          <button
                            onClick={handleSubmit}
                            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setEditMode(true)}
                          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "Fees" && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Fee Details
                    </h3>
                    <p className="text-gray-500">
                      Fee information and payment history will be displayed
                      here.
                    </p>
                  </div>
                )}

                {activeTab === "Exams" && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Exam Records
                    </h3>
                    <p className="text-gray-500">
                      Students exam results and academic performance will be
                      shown here.
                    </p>
                  </div>
                )}

                {activeTab === "Documents" && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Documents
                    </h3>
                    <p className="text-gray-500">
                      Uploaded documents and certificates will be available
                      here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// TABS COMPONENT
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="border-b border-gray-200 bg-gray-50/50">
      <div className="flex">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all duration-200 border-b-2 ${
                active === tab.id
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-blue-500 hover:bg-white/50"
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// SECTION COMPONENT
function Section({ title, icon: IconComponent, children }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <IconComponent className="w-4 h-4 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

// FIELD COMPONENT
function Field({
  label,
  value,
  editable,
  type = "text",
  options = [],
  onChange,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {editable ? (
        type === "select" ? (
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white"
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )
      ) : (
        <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-900 font-medium">
          {value || <span className="text-gray-400 italic">Not provided</span>}
        </div>
      )}
    </div>
  );
}
