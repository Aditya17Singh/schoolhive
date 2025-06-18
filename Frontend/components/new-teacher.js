"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../lib/api";
import { Loader2, AlertCircle } from 'lucide-react';

export default function TeacherRegistrationForm({ orgId }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isTeacherOpen, setIsTeacherOpen] = useState();

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    []
  );

  const shareLink = useMemo(
    () => `http://localhost:3000/forms/teacher/${user.id ? user.id : orgId}`,
    [user.id, orgId]
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareLink]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.organizationId = orgId

    try {
      setLoading(true);
      const res = await API.post("/teachers", data);
      alert("Teacher registered successfully!");
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      const message = error.response?.data?.message || "Something went wrong.";
      alert("Failed: " + message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await API.get("/academics/admission-settings");
        setIsTeacherOpen(res.data.isTeacherApplicationOpen)
      } catch (err) {
        console.error('Failed to fetch admission settings', err)
        setIsTeacherOpen(false) // fallback to false
      }
    };

    fetchStatus();
  }, []);


  if (isTeacherOpen === undefined) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-gray-600">
        <Loader2 className="animate-spin h-6 w-6 mb-3" />
        <p className="text-base font-medium">Checking application status...</p>
      </div>
    );
  }

  if (!isTeacherOpen) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-red-600">
        <AlertCircle className="h-6 w-6 mb-2" />
        <p className="text-lg font-semibold">New teacher applications are currently closed.</p>
      </div>
    );
  }

  return (
    <div className={`gap-6 w-full lg:mt-4 ${!orgId ? "grid grid-cols-1 lg:grid-cols-[70%_27%]" : ""}`}>
      <div className="rounded-lg p-6 bg-white shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Teacher Registration
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div className="grid md:grid-cols-3 gap-4">
            <input name="fName" placeholder="First Name" className={inputClass} />
            <input
              name="mName"
              placeholder="Middle Name"
              className={inputClass} />
            <input name="lName" placeholder="Last Name" className={inputClass} />
          </div>

          {/* DOB, Joining Date, Nationality */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass} htmlFor="dob">
                Date of Birth
              </label>
              <input type="date" name="dob" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="joiningDate">
                Joining Date
              </label>
              <input type="date" name="joiningDate" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="nationality">
                Nationality
              </label>
              <select name="nationality" className={inputClass}>
                <option value="">Select Nationality</option>
                <option value="Indian">Indian</option>
                <option value="Foreign National">Foreign National</option>
              </select>
            </div>
          </div>

          {/* Aadhar, PAN, Blood Group */}
          <div className="grid md:grid-cols-3 gap-4">
            <input
              name="aadharNumber"
              placeholder="Aadhar Number"
              className={inputClass} />
            <input
              name="panNumber"
              placeholder="PAN Number"
              className={inputClass} />
            <select name="bloodGroup" className={inputClass}>
              <option value="">Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="phone"
              placeholder="Phone Number"
              className={inputClass} />
            <input
              name="email"
              placeholder="Email Address"
              className={inputClass} />
          </div>

          {/* Gender, Religion */}
          <div className="grid md:grid-cols-3 gap-4">
            <select name="gender" className={inputClass}>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select name="religion" className={inputClass}>
              <option value="">Religion</option>
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Sikh">Sikh</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Address Sections */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Residential Address */}
            <div className="border p-4 rounded">
              <h2 className="text-lg font-semibold mb-4">Residential Address</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  name="resLine1"
                  placeholder="Address Line 1"
                  className={inputClass} />
                <input
                  name="resLine2"
                  placeholder="Address Line 2"
                  className={inputClass} />
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <input
                  name="resNearbyLandmark"
                  placeholder="Nearby Landmark"
                  className={inputClass} />
                <input name="resCity" placeholder="City" className={inputClass} />
                <input
                  name="resDistrict"
                  placeholder="District"
                  className={inputClass} />
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <input
                  name="resState"
                  placeholder="State"
                  className={inputClass} />
                <input
                  name="resPinCode"
                  placeholder="PIN Code"
                  className={inputClass} />
              </div>
            </div>

            {/* Permanent Address */}
            <div className="border p-4 rounded">
              <h2 className="text-lg font-semibold mb-4">Permanent Address</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  name="permLine1"
                  placeholder="Address Line 1"
                  className={inputClass} />
                <input
                  name="permLine2"
                  placeholder="Address Line 2"
                  className={inputClass} />
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <input
                  name="permNearbyLandmark"
                  placeholder="Nearby Landmark"
                  className={inputClass} />
                <input
                  name="permCity"
                  placeholder="City"
                  className={inputClass} />
                <input
                  name="permDistrict"
                  placeholder="District"
                  className={inputClass} />
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <input
                  name="permState"
                  placeholder="State"
                  className={inputClass} />
                <input
                  name="permPinCode"
                  placeholder="PIN Code"
                  className={inputClass} />
              </div>
            </div>
          </div>

          {/* Category & Marital Status Combobox Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <select name="category" className={inputClass}>
              <option value="">Category</option>
              <option value="General">General</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="OBC">OBC</option>
            </select>
            <select name="maritalStatus" className={inputClass}>
              <option value="">Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="text-white cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-black-foreground shadow hover:bg-black/90 h-9 px-4 py-2 w-full max-w-md mx-auto block"
            >
              {loading ? "Submitting..." : "Create Teacher Profile"}
            </button>
          </div>
        </form>
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
                  value={shareLink} />
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

const inputClass =
  "flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

const labelClass =
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
