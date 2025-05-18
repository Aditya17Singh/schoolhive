"use client";

import { useState } from "react";

export default function TeacherRegistrationForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const res = await fetch("http://localhost:5000/api/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Teacher registered successfully!");
        form.reset();
      } else {
        alert("Failed: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 rounded-lg p-6 bg-white shadow-lg border border-gray-200">
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
            className={inputClass}
          />
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
            className={inputClass}
          />
          <input
            name="panNumber"
            placeholder="PAN Number"
            className={inputClass}
          />
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
            className={inputClass}
          />
          <input
            name="email"
            placeholder="Email Address"
            className={inputClass}
          />
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
                className={inputClass}
              />
              <input
                name="resLine2"
                placeholder="Address Line 2"
                className={inputClass}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <input
                name="resNearbyLandmark"
                placeholder="Nearby Landmark"
                className={inputClass}
              />
              <input name="resCity" placeholder="City" className={inputClass} />
              <input
                name="resDistrict"
                placeholder="District"
                className={inputClass}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <input
                name="resState"
                placeholder="State"
                className={inputClass}
              />
              <input
                name="resPinCode"
                placeholder="PIN Code"
                className={inputClass}
              />
            </div>
          </div>

          {/* Permanent Address */}
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold mb-4">Permanent Address</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="permLine1"
                placeholder="Address Line 1"
                className={inputClass}
              />
              <input
                name="permLine2"
                placeholder="Address Line 2"
                className={inputClass}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <input
                name="permNearbyLandmark"
                placeholder="Nearby Landmark"
                className={inputClass}
              />
              <input
                name="permCity"
                placeholder="City"
                className={inputClass}
              />
              <input
                name="permDistrict"
                placeholder="District"
                className={inputClass}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <input
                name="permState"
                placeholder="State"
                className={inputClass}
              />
              <input
                name="permPinCode"
                placeholder="PIN Code"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Category & Marital Status Combobox Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* <button type="button" className={comboboxClass}>
            <select name="category" className={inputClass}>
  <option value="">Category</option>
  <option value="General">General</option>
  <option value="SC">SC</option>
  <option value="ST">ST</option>
  <option value="OBC">OBC</option>
</select>

            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              className="h-4 w-4 opacity-50"
            >
              <path
                d="M4.93 5.43a.5.5 0 0 0 0 .64c.18.18.47.18.65 0L7.5 4.14l1.92 1.93a.46.46 0 0 0 .64 0 .5.5 0 0 0 0-.64L7.82 3.18a.5.5 0 0 0-.64 0L4.93 5.43ZM10.07 9.57a.5.5 0 0 0 0-.64.46.46 0 0 0-.64 0L7.5 10.86 5.57 8.93a.46.46 0 0 0-.64 0 .5.5 0 0 0 0 .64l2.25 2.25a.5.5 0 0 0 .64 0l2.25-2.25Z"
                fill="currentColor"
              />
            </svg>
          </button> */}

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
  );
}

const inputClass =
  "flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

const labelClass =
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

const comboboxClass =
  "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md bg-[#F7F8FA] border px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
