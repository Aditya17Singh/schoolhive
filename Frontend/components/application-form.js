"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import API from "@/lib/api";
import axios from "axios";

export default function ApplicationForm({ orgId }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [admissionFee, setAdmissionFee] = useState(null);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(null);
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState("");

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    []
  );

  const shareLink = useMemo(
    () => `http://localhost:3000/forms/admission/${user.id ? user.id : orgId}`,
    [user.id, orgId]
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareLink]);

  const initialState = useMemo(
    () => ({
      fName: "",
      mName: "",
      lName: "",
      dob: "",
      gender: "",
      religion: "",
      nationality: "",
      category: "",
      admissionClass: "",
      contactNumber: "",
      email: "",
      sameAsPermanent: false,
      permanentAddress: {
        line1: "",
        line2: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
      },
      residentialAddress: {
        line1: "",
        line2: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
      },
      fatherName: "",
      fatherPhone: "",
      fatherEmail: "",
      motherName: "",
      motherPhone: "",
      motherEmail: "",
      guardianName: "",
      guardianPhone: "",
      session: "",
      aadhaarNumber: "",
      abcId: "",
      avatar: null,
      aadharCard: null,
      previousSchoolTC: null,
      medicalCertificate: null,
      birthCertificate: null,
    }),
    []
  );

  const [form, setForm] = useState(initialState);
  console.log(form, 'form');

  const handleChange = useCallback((e) => {
    const { id, value, type, checked, files } = e.target;

    setForm((prev) => {
      if (type === "checkbox") {
        if (id === "sameAsPermanent") {
          const residentialAddress = checked
            ? { ...prev.permanentAddress }
            : {
              line1: "",
              line2: "",
              city: "",
              district: "",
              state: "",
              pincode: "",
            };

          return {
            ...prev,
            sameAsPermanent: checked,
            residentialAddress,
          };
        }
        return { ...prev, [id]: checked };
      }

      if (type === "file") {
        const file = files[0];
        if (!file) return prev;

        const previewUrl = URL.createObjectURL(file);
        return {
          ...prev,
          [id]: file,
          [`${id}Preview`]: previewUrl,
        };
      }

      if (
        id.startsWith("permanentAddress.") ||
        id.startsWith("residentialAddress.")
      ) {
        const [section, field] = id.split(".");
        const updatedSection = {
          ...prev[section],
          [field]: value,
        };

        let updated = {
          ...prev,
          [section]: updatedSection,
        };

        // Mirror updates to residentialAddress if sameAsPermanent is true
        if (section === "permanentAddress" && prev.sameAsPermanent) {
          updated.residentialAddress = {
            ...updatedSection,
          };
        }

        return updated;
      }

      return { ...prev, [id]: value };
    });
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setError("");
      setSuccess("");

      const currentOrgId = user.id ? user.id : orgId;

      try {
        const formDataToSend = new FormData();

        // Append all form fields except files
        Object.entries(form).forEach(([key, value]) => {
          if (
            [
              "avatar",
              "aadharCard",
              "previousSchoolTC",
              "medicalCertificate",
              "birthCertificate",
            ].includes(key)
          ) {
            // skip files for now
            return;
          }

          if (typeof value === "object" && value !== null) {
            Object.entries(value).forEach(([subKey, subVal]) => {
              formDataToSend.append(`${key}.${subKey}`, subVal);
            });
          } else {
            formDataToSend.append(key, value);
          }
        });

        // Append files
        if (form.avatar) formDataToSend.append("avatar", form.avatar);
        if (form.aadharCard)
          formDataToSend.append("aadharCard", form.aadharCard);
        if (form.previousSchoolTC)
          formDataToSend.append("previousSchoolTC", form.previousSchoolTC);
        if (form.medicalCertificate)
          formDataToSend.append("medicalCertificate", form.medicalCertificate);
        if (form.birthCertificate)
          formDataToSend.append("birthCertificate", form.birthCertificate);

        // Send as multipart/form-data
        await axios.post(
          `http://localhost:5000/api/students?orgId=${currentOrgId}&public_key=letmein12345`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setForm(initialState);
        setSuccess("Application submitted successfully.");
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to create student"
        );
      } finally {
        setSubmitting(false);
      }
    },
    [form, user.id, orgId, initialState]
  );


  const fetchClasses = useCallback(async () => {
    const currentOrgId = user.id ? user.id : orgId;

    try {
      const res = await API.get("/classes?public_key=letmein12345", {
        params: {
          orgId: currentOrgId,
        },
      });
      setClasses(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [orgId, user.id]);

  useEffect(() => {
    const fetchAdmissionSettings = async () => {
      setLoading(true);
      const currentOrgId = user.id ? user.id : orgId;

      try {
        const [academicRes, feeRes] = await Promise.all([
          API.get("/academics/active", {
            params: {
              public_key: "letmein12345",
              orgId: currentOrgId,
            },
          }),
          API.get(
            `/organization/admission/settings?public_key=letmein12345&orgId=${currentOrgId}`
          ),
        ]);

        setIsAdmissionOpen(academicRes.data.admissionOpen);
        setAdmissionFee(feeRes.data.admissionFee);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load admission settings."
        );
        setIsAdmissionOpen(null);
        setAdmissionFee(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
    fetchAdmissionSettings();
  }, [orgId, user.id, fetchClasses]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [success]);


  return (
    <div
      className={`min-h-screen mt-4 relative rounded-lg py-8 px-4 ${!orgId ? "grid gap-8 lg:grid-cols-[1fr_30%] items-start overflow-x-hidden" : ""
        }`}
    >
      <div>
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-3xl font-bold text-black">
                Student Admission Form
              </h1>
              <p className="text-black-100 mt-1">
                Complete all sections to submit your application
              </p>
            </div>
          </div>
        </div>

        {isAdmissionOpen === true ? (
          <>
            {success && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-800 px-4 py-3 rounded mb-4 font-medium text-center shadow">
                {error}
              </div>
            )}

            {admissionFee > 0 && (
              <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded mb-4 font-medium text-center shadow">
                Admission Fee: ₹{admissionFee}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold text-white">
                      Personal Information
                    </h2>
                  </div>
                </div>

                <div className="p-6 grid md:grid-cols-3 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="fName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fName"
                      value={form.fName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>

                  {/* Middle Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="mName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Middle Name
                    </label>
                    <input
                      id="mName"
                      value={form.mName}
                      onChange={handleChange}
                      placeholder="Optional"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="lName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lName"
                      value={form.lName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label
                      htmlFor="dob"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="dob"
                      type="date"
                      value={form.dob}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Religion */}
                  <div className="space-y-2">
                    <label
                      htmlFor="religion"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Religion <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="religion"
                      value={form.religion}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    >
                      <option value="">Select Religion</option>
                      <option value="Hindu">Hinduism</option>
                      <option value="Muslim">Islam</option>
                      <option value="Christian">Christianity</option>
                      <option value="Sikh">Sikhism</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Nationality */}
                  <div className="space-y-2">
                    <label
                      htmlFor="nationality"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nationality <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="nationality"
                      value={form.nationality}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    >
                      <option value="">Select Nationality</option>
                      <option value="Indian">Indian</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                  </div>

                  {/* Admission Class */}
                  <div className="space-y-2">
                    <label
                      htmlFor="admissionClass"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Class (Admission Sought){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="admissionClass"
                      name="admissionClass"
                      value={form.admissionClass}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    >
                      <option value="">Select a class</option>
                      {classes.map((cls) => (
                        <option key={cls._id} value={cls.name}>
                          {cls.name} {cls.section ? `- ${cls.section}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold text-white">
                      Contact Information
                    </h2>
                  </div>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-6">
                  {/* Contact Number */}
                  <div className="space-y-2">
                    <label
                      htmlFor="contactNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contactNumber"
                      type="tel"
                      value={form.contactNumber}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                      pattern="[0-9]{10}"
                      title="Enter 10 digit phone number"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="student@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold text-white">
                      Address Information
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* Permanent Address */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Permanent Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        id="permanentAddress.line1"
                        value={form.permanentAddress.line1}
                        onChange={handleChange}
                        placeholder="Address Line 1"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        required
                      />
                      <input
                        id="permanentAddress.line2"
                        value={form.permanentAddress.line2}
                        onChange={handleChange}
                        placeholder="Address Line 2 (Optional)"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      />
                      <input
                        id="permanentAddress.city"
                        value={form.permanentAddress.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        required
                      />
                      <input
                        id="permanentAddress.district"
                        value={form.permanentAddress.district}
                        onChange={handleChange}
                        placeholder="District"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        required
                      />
                      <input
                        id="permanentAddress.state"
                        value={form.permanentAddress.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        required
                      />
                      <input
                        id="permanentAddress.pincode"
                        value={form.permanentAddress.pincode}
                        onChange={handleChange}
                        placeholder="PIN Code"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Same as Permanent Checkbox */}
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="sameAsPermanent"
                      checked={form.sameAsPermanent}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="sameAsPermanent"
                      className="text-sm font-medium text-gray-700"
                    >
                      Residential address same as permanent address
                    </label>
                  </div>

                  {/* Residential Address */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Residential Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        id="residentialAddress.line1"
                        value={form.residentialAddress.line1}
                        onChange={handleChange}
                        placeholder="Address Line 1"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        required
                        disabled={form.sameAsPermanent}
                      />
                      <input
                        id="residentialAddress.line2"
                        value={form.residentialAddress.line2}
                        onChange={handleChange}
                        placeholder="Address Line 2 (Optional)"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        disabled={form.sameAsPermanent}
                      />
                      <input
                        id="residentialAddress.city"
                        value={form.residentialAddress.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        required
                        disabled={form.sameAsPermanent}
                      />
                      <input
                        id="residentialAddress.district"
                        value={form.residentialAddress.district}
                        onChange={handleChange}
                        placeholder="District"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        required
                        disabled={form.sameAsPermanent}
                      />
                      <input
                        id="residentialAddress.state"
                        value={form.residentialAddress.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        required
                        disabled={form.sameAsPermanent}
                      />
                      <input
                        id="residentialAddress.pincode"
                        value={form.residentialAddress.pincode}
                        onChange={handleChange}
                        placeholder="PIN Code"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        required
                        disabled={form.sameAsPermanent}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Parent/Guardian Information */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold text-white">
                      Parent/Guardian Information
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* Father's Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Father's Information
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="fatherName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Father's Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fatherName"
                          value={form.fatherName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="fatherPhone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Father's Phone
                        </label>
                        <input
                          id="fatherPhone"
                          value={form.fatherPhone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="fatherEmail"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Father's Email
                        </label>
                        <input
                          id="fatherEmail"
                          type="email"
                          value={form.fatherEmail}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mother's Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Mother's Information
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="motherName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Mother's Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="motherName"
                          value={form.motherName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="motherPhone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Mother's Phone
                        </label>
                        <input
                          id="motherPhone"
                          value={form.motherPhone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="motherEmail"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Mother's Email
                        </label>
                        <input
                          id="motherEmail"
                          type="email"
                          value={form.motherEmail}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Guardian Information (if applicable)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="guardianName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Guardian's Name
                        </label>
                        <input
                          id="guardianName"
                          value={form.guardianName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="guardianPhone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Guardian's Phone
                        </label>
                        <input
                          id="guardianPhone"
                          value={form.guardianPhone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic & Identification */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold text-white">
                      Academic & Identification
                    </h2>
                  </div>
                </div>

                <div className="p-6 grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="session"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Academic Session <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="session"
                      value={form.session}
                      onChange={handleChange}
                      placeholder="e.g., 2024-2025"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="aadhaarNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Aadhaar Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="aadhaarNumber"
                      value={form.aadhaarNumber}
                      onChange={handleChange}
                      placeholder="12-digit Aadhaar number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                      pattern="[0-9]{12}"
                      title="Enter 12 digit Aadhaar number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="abcId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ABC ID (if available)
                    </label>
                    <input
                      id="abcId"
                      value={form.abcId}
                      onChange={handleChange}
                      placeholder="Academic Bank of Credits ID"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold text-white">Document Upload</h2>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Avatar */}
                  <div className="space-y-2">
                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                      Upload Student Photo
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="avatar"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> student photo
                          </p>
                          <p className="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
                        </div>
                        <input
                          id="avatar"
                          type="file"
                          onChange={handleChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                    </div>
                    {form.avatarPreview && (
                      <div className="mt-2 flex justify-center">
                        <img
                          src={form.avatarPreview}
                          alt="Avatar Preview"
                          className="h-24 w-24 object-cover rounded-full border"
                        />
                      </div>
                    )}
                  </div>

                  {/* Document Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Aadhaar Card */}
                    <div className="space-y-2">
                      <label htmlFor="aadharCard" className="block text-sm font-medium text-gray-700">
                        Aadhaar Card
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="aadharCard"
                          className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex flex-col items-center justify-center pt-3 pb-3">
                            <p className="text-xs text-gray-500">Upload Aadhaar Card</p>
                          </div>
                          <input
                            id="aadharCard"
                            type="file"
                            onChange={handleChange}
                            accept=".pdf,image/*"
                            className="hidden"
                          />
                        </label>
                      </div>
                      {form.aadharCardPreview && (
                        <div className="mt-2">
                          {form.aadharCard?.type === "application/pdf" ? (
                            <iframe src={form.aadharCardPreview} className="w-full h-48 border rounded" />
                          ) : (
                            <img
                              src={form.aadharCardPreview}
                              alt="Aadhaar Preview"
                              className="h-24 w-auto object-contain border rounded"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Previous School TC */}
                    <div className="space-y-2">
                      <label htmlFor="previousSchoolTC" className="block text-sm font-medium text-gray-700">
                        Previous School TC
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="previousSchoolTC"
                          className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex flex-col items-center justify-center pt-3 pb-3">
                            <p className="text-xs text-gray-500">Upload TC</p>
                          </div>
                          <input
                            id="previousSchoolTC"
                            type="file"
                            onChange={handleChange}
                            accept=".pdf,image/*"
                            className="hidden"
                          />
                        </label>
                      </div>
                      {form.previousSchoolTCPreview && (
                        <div className="mt-2">
                          {form.previousSchoolTC?.type === "application/pdf" ? (
                            <iframe src={form.previousSchoolTCPreview} className="w-full h-48 border rounded" />
                          ) : (
                            <img
                              src={form.previousSchoolTCPreview}
                              alt="TC Preview"
                              className="h-24 w-auto object-contain border rounded"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Medical Certificate */}
                    <div className="space-y-2">
                      <label htmlFor="medicalCertificate" className="block text-sm font-medium text-gray-700">
                        Medical Certificate
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="medicalCertificate"
                          className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex flex-col items-center justify-center pt-3 pb-3">
                            <p className="text-xs text-gray-500">Upload Medical Cert.</p>
                          </div>
                          <input
                            id="medicalCertificate"
                            type="file"
                            onChange={handleChange}
                            accept=".pdf,image/*"
                            className="hidden"
                          />
                        </label>
                      </div>
                      {form.medicalCertificatePreview && (
                        <div className="mt-2">
                          {form.medicalCertificate?.type === "application/pdf" ? (
                            <iframe src={form.medicalCertificatePreview} className="w-full h-48 border rounded" />
                          ) : (
                            <img
                              src={form.medicalCertificatePreview}
                              alt="Medical Cert Preview"
                              className="h-24 w-auto object-contain border rounded"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Birth Certificate */}
                    <div className="space-y-2">
                      <label htmlFor="birthCertificate" className="block text-sm font-medium text-gray-700">
                        Birth Certificate
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="birthCertificate"
                          className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex flex-col items-center justify-center pt-3 pb-3">
                            <p className="text-xs text-gray-500">Upload Birth Cert.</p>
                          </div>
                          <input
                            id="birthCertificate"
                            type="file"
                            onChange={handleChange}
                            accept=".pdf,image/*"
                            className="hidden"
                          />
                        </label>
                      </div>
                      {form.birthCertificatePreview && (
                        <div className="mt-2">
                          {form.birthCertificate?.type === "application/pdf" ? (
                            <iframe src={form.birthCertificatePreview} className="w-full h-48 border rounded" />
                          ) : (
                            <img
                              src={form.birthCertificatePreview}
                              alt="Birth Cert Preview"
                              className="h-24 w-auto object-contain border rounded"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  {/* <button
                  type="button"
                  className="px-8 py-3 cursor-pointer border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Save as Draft
                </button> */}
                  <button
                    type="submit"
                    className="px-8 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : isAdmissionOpen === false ? (
          <div className="bg-red-100 text-red-800 px-4 py-3 rounded font-medium text-center shadow">
            Admissions are currently closed.
          </div>
        ) : (
          <div className="text-gray-600 text-center py-6">
            Checking admission status...
          </div>
        )}
      </div>

      {!orgId && (
        <div className="rounded-xl bg-card shadow mx-auto lg:mx-0 w-full max-w-xl">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">
              Add Student Automatically
            </h3>
            <p className="text-sm text-muted-foreground">
              Share this link with student to fill out the form. After submission, you'll receive a
              notification to review and approve their addition to the organization.
            </p>
          </div>
          <div className="p-6 pt-0">
            <div className="relative border rounded-lg">
              <div className="flex flex-col md:flex-col lg:flex-row items-stretch gap-2 bg-muted/50 rounded-xl p-2 transition-all duration-300">
                <input
                  readOnly
                  className="bg-transparent w-full text-sm outline-none font-mono text-muted-foreground truncate"
                  type="text"
                  value={shareLink}
                />
                <button
                  onClick={handleCopy}
                  className="w-full lg:w-auto inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-secondary/80 bg-secondary text-secondary-foreground shadow-sm h-10 px-4 text-sm transition-all duration-300 rounded-lg shrink-0"
                >
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
