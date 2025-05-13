"use client";

import { useState } from "react";
import { registerSchool } from "./action";
import { useRouter } from "next/navigation";

export default function SchoolRegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const finalValue = files ? files[0] : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmitStep1 = async (e) => {
    console.log("step1");

    e.preventDefault();
    setIsSubmitting(true);
    setStatus("Submitting organization setup...");

    const formattedData = {
      orgName: formData.name,
      shortName: formData.shortName,
      prefix: formData.prefix,
      orgEmail: formData.contactEmail,
      phoneNumber: formData.contactPhone,
      password: formData.password,
      logo: formData.logo,
      address: {
        state: formData.state,
        district: formData.district,
        city: formData.city,
        pinCode: formData.pincode,
        line1: formData.addressLine1,
        line2: formData.addressLine2 || "",
      },
    };

    try {
      const result = await registerSchool(formattedData);

      if (result.success) {
        setStatus("Organization setup saved successfully!");
        handleNext();  // Proceed to the next step (class selection)
      } else {
        setStatus(`❌ Error: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("Saving classes...");

    const formattedClassesData = {
      classes: formData.classes.map((cls) => ({
        name: cls,
        section: "A", // Default section, adjust as needed
      })),
    };

    try {
      const result = await registerSchool(formattedClassesData);

      if (result.success) {
        setStatus("Classes saved successfully!");
        handleNext();  // Proceed to the next step (academic year setup)
      } else {
        setStatus(`❌ Error: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false); // Stop processing
    }
  };

  const handleSubmitStep3 = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("Saving academic year...");

    const formattedAcademicYearData = {
      academicYear: {
        year: `${formData.academicYearStart}-${formData.academicYearEnd}`,
        start: formData.academicYearStart,
        end: formData.academicYearEnd,
        startDate: `${formData.academicYearStart}-04-01`,
        endDate: `${formData.academicYearEnd}-03-31`,
      },
    };

    try {
      const result = await registerSchool(formattedAcademicYearData);

      if (result.success) {
        setStatus("Academic year saved successfully!");
        router.push("/dashboard");  // Redirect to the dashboard after completing all steps
      } else {
        setStatus(`❌ Error: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false); // Stop processing
    }
  };

  return (
    <>
      <header className="py-4 px-4 md:px-6 border-b bg-white/50 backdrop-blur-sm sticky top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center mx-auto">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Organization Setup
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Complete the following steps to get started
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
          >
            Login Instead?
          </button>
        </div>
      </header>
      <div className="max-w-5xl mx-auto py-4 px-4 space-y-4 ">
        {/* Step Indicator */}
        <div className="flex justify-center items-center mb-6 space-x-4 text-sm font-semibold">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step === s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                  }`}
              >
                {s}
              </div>
              {s !== 3 && (
                <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={
          step === 1
            ? handleSubmitStep1
            : step === 2
              ? handleSubmitStep2
              : handleSubmitStep3
        }>
          {step === 1 && (
            <div className="space-y-6">
              {/* Card 1: Organization Details */}
              <div className="rounded-xl shadow-sm">
                <div className="flex bg-gray-50 flex-col space-y-1.5 p-4 rounded-t-lg">
                  <h3 className="font-semibold tracking-tight text-xl flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="text-primary"
                    >
                      <path d="M20 7h-9"></path>
                      <path d="M14 17H5"></path>
                      <circle cx="17" cy="17" r="3"></circle>
                      <circle cx="7" cy="7" r="3"></circle>
                    </svg>
                    Organization Details
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Basic information about your organization
                  </p>
                </div>{" "}
                <div className="grid p-4 grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">
                      Organization Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      required
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">
                      Organization Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="contactEmail"
                      required
                      type="email"
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="contactPhone"
                      required
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="password"
                      required
                      type="password"
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">
                      Organization Prefix{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="prefix"
                      required
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">
                      Short Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="shortName"
                      required
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Organization Logo */}
              <div className="rounded-xl shadow-sm">
                <div className="space-y-1.5 bg-muted/40 rounded-t-lg">
                  <div className="bg-gray-50  p-4">
                    <h3 className="font-semibold bg-gray-50 tracking-tight text-xl flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="text-primary"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                        <circle cx="9" cy="9" r="2"></circle>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                      </svg>
                      Organization Logo<span className="text-red-500">*</span>
                    </h3>
                    <p className="text-sm text-muted-foreground pb-4">
                      Upload a professional logo for your organization
                    </p>
                  </div>
                  <div className=" p-4">
                    <input
                      name="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Organization Address */}
              <div className="rounded-xl shadow-sm">
                <div className="flex flex-col bg-gray-50 p-4  space-y-1.5  rounded-t-lg">
                  <h3 className="font-semibold tracking-tight text-xl flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="text-primary"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Organization Address
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Physical location of your organization
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                  <div>
                    <label className="block mb-1">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="addressLine1"
                      required
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Address Line 2</label>
                    <input
                      name="addressLine2"
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="state"
                      required
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">
                      District <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="district"
                      required
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="city"
                      required
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="pincode"
                      required
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <p className="text-sm text-gray-500 text-right">
                  Fields marked with <span className="text-red-500">*</span> are
                  required
                </p>

                <button
                  type="submit"
                  // onClick={handleNext}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 py-2 px-8"
                >
                  {isSubmitting ? "Processing..." : "Continue"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">
                Step 2: Select Classes
              </h3>
              <div className="grid grid-cols-3 gap-4">
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
                  "10",
                ].map((cls) => (
                  <label key={cls} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="classes"
                      value={cls}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          classes: checked
                            ? [...(prev.classes || []), cls]
                            : prev.classes.filter((c) => c !== cls),
                        }));
                      }}
                    />
                    {cls}
                  </label>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 transition"
                >
                  {isSubmitting ? "Processing..." : "Continue"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">
                Step 3: Academic Year
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Start Year *</label>
                  <input
                    name="academicYearStart"
                    required
                    placeholder="2025"
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block mb-1">End Year *</label>
                  <input
                    name="academicYearEnd"
                    required
                    placeholder="2026"
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={status === "Submitting..."}
                  className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 transition"
                >
                  {status === "Submitting..." ? "Registering..." : "Complete Setup"}
                </button>
              </div>
              {status && <p className="text-center text-red-600">{status}</p>}
            </div>
          )}
        </form>
      </div>
    </>
  );
}

const inputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
