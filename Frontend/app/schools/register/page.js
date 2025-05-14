'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

// Modified action.js
export async function registerOrganization(body) {
  console.log('Registering organization:', body);
  
  try {
    const response = await fetch(`http://localhost:5000/api/organization/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Something went wrong with organization registration');
    
    return { 
      success: true, 
      organizationId: data.organizationId || data.schoolId,
      token: data.token // Store the authentication token returned from the API
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function registerClasses(classes, organizationId) {
  
  try {
    // Create an array to store the results of all class creations
    let classResults = [];
    
    // Process each class individually
    for (const className of classes) {
      // Determine the appropriate class type based on the class name
      let type = "primary"; // Default
      if (["Nursery", "LKG", "UKG"].includes(className)) {
        type = "pre-primary";
      } else if (parseInt(className) >= 6 && parseInt(className) <= 8) {
        type = "middle";
      } else if (parseInt(className) >= 9) {
        type = "secondary";
      }
      
      // Prepare data for class creation
      const classData = {
        name: className,
        section: "A", 
        type: type,
        schoolId: organizationId 
      };
      
      // Send the request to create this class
      const response = await fetch(`http://localhost:5000/api/classes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error(`Failed to create class ${className}:`, data);
        continue; // Continue with other classes even if one fails
      }
      
      classResults.push(data);
    }
    
    if (classResults.length === 0) {
      throw new Error('Failed to create any classes');
    }
    
    return { 
      success: true, 
      classIds: classResults.map(c => c._id),
      classResults: classResults
    };
    
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function registerAcademicYear(academicYear, organizationId) {
  console.log('Registering academic year:', academicYear, 'for organization:', organizationId);
  
  try {
    // Update the payload to match what the backend expects
    const payload = {
      ...academicYear,
      schoolId: organizationId  // Ensure we're using schoolId instead of organization
    };

    const response = await fetch(`http://localhost:5000/api/academics`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || 'Something went wrong with academic year registration');
    
    return { success: true, academicId: data.academicId || data._id };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

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
      const result = await registerOrganization(formattedData);

      if (result.success) {
        // Store the organization ID and authentication token for later steps
        setFormData(prev => ({ 
          ...prev, 
          organizationId: result.organizationId,
          authToken: result.token // Store the auth token from registration response
        }));
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
    
    // Make sure we have selected classes and an organization ID
    if (!formData.classes || formData.classes.length === 0) {
      setStatus("Please select at least one class");
      return;
    }
    
    if (!formData.organizationId) {
      setStatus("Missing organization information. Please go back to step 1.");
      return;
    }
    
    // if (!formData.authToken) {
    //   setStatus("Missing authentication token. Please restart the process.");
    //   return;
    // }
    
    setIsSubmitting(true);
    setStatus("Saving classes...");

    try {
      const result = await registerClasses(
        formData.classes, 
        formData.organizationId,
        formData.authToken // Pass the auth token to the API call
      );

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
    
    // Validate academic year data
    if (!formData.academicYearStart || !formData.academicYearEnd) {
      setStatus("Please enter both start and end years");
      return;
    }
    
    if (!formData.organizationId) {
      setStatus("Missing organization information. Please restart the process.");
      return;
    }
    
    // if (!formData.authToken) {
    //   setStatus("Missing authentication token. Please restart the process.");
    //   return;
    // }
    
    setIsSubmitting(true);
    setStatus("Saving academic year...");

    const academicYearData = {
      year: `${formData.academicYearStart}-${formData.academicYearEnd}`,
      start: formData.academicYearStart,
      end: formData.academicYearEnd,
      startDate: `${formData.academicYearStart}-04-01`,
      endDate: `${formData.academicYearEnd}-03-31`,
    };

    try {
      const result = await registerAcademicYear(
        academicYearData, 
        formData.organizationId,
        //formData.authToken // Pass the auth token to the API call
      );

      if (result.success) {
        setStatus("Academic year saved successfully!");
        // Store the token in localStorage for future sessions if needed
       // localStorage.setItem('authToken', formData.authToken);
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

        {/* Status message displayed prominently */}
        {status && (
          <div className={`p-4 mb-4 rounded-lg ${status.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {status}
          </div>
        )}

        {step === 1 && (
          <form
          onSubmit={handleSubmitStep1}
           className="space-y-6">
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                type="button"
                onClick={handleNext()}
                // disabled={isSubmitting}
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
          </form>
        )}

        {step === 2 && (
  <form onSubmit={handleSubmitStep2} className="space-y-6">
    <h3 className="text-lg font-semibold mb-4">
      Step 2: Select Classes
    </h3>

    {/* Card Groups */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Pre-Primary */}
      <div className="p-4 rounded-xl shadow bg-white">
        <h4 className="font-semibold mb-3 text-black">Pre-Primary</h4>
        <div className="grid grid-cols-2 gap-3">
          {["Nursery", "PG", "LKG", "UKG"].map((cls) => {
            const isSelected = formData.classes?.includes(cls);
            return (
              <button
                type="button"
                key={cls}
                className={`rounded-lg p-3 text-center font-medium transition ${
                  isSelected
                    ? "bg-black text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100 border"
                }`}
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    classes: isSelected
                      ? prev.classes.filter((c) => c !== cls)
                      : [...(prev.classes || []), cls],
                  }));
                }}
              >
                <div className="flex items-center justify-between">
                  <span>{cls}</span>
                  {isSelected && <span className="text-white">✔</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary */}
      <div className="p-4 rounded-xl shadow bg-white">
        <h4 className="font-semibold mb-3 text-black">Primary (1-6)</h4>
        <div className="grid grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6"].map((cls) => {
            const isSelected = formData.classes?.includes(cls);
            return (
              <button
                type="button"
                key={cls}
                className={`rounded-lg p-3 text-center font-medium transition ${
                  isSelected
                    ? "bg-black text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100 border"
                }`}
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    classes: isSelected
                      ? prev.classes.filter((c) => c !== cls)
                      : [...(prev.classes || []), cls],
                  }));
                }}
              >
                <div className="flex items-center justify-between">
                  <span>{cls}</span>
                  {isSelected && <span className="text-white">✔</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Middle */}
      <div className="p-4 rounded-xl shadow bg-white">
        <h4 className="font-semibold mb-3 text-black">Middle (7-10)</h4>
        <div className="grid grid-cols-3 gap-3">
          {["7", "8", "9", "10"].map((cls) => {
            const isSelected = formData.classes?.includes(cls);
            return (
              <button
                type="button"
                key={cls}
                className={`rounded-lg p-3 text-center font-medium transition ${
                  isSelected
                    ? "bg-black text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100 border"
                }`}
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    classes: isSelected
                      ? prev.classes.filter((c) => c !== cls)
                      : [...(prev.classes || []), cls],
                  }));
                }}
              >
                <div className="flex items-center justify-between">
                  <span>{cls}</span>
                  {isSelected && <span className="text-white">✔</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary */}
      <div className="p-4 rounded-xl shadow bg-white">
        <h4 className="font-semibold mb-3 text-black">Secondary (11–12)</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            "11 Science",
            "11 Commerce",
            "11 Arts",
            "12 Science",
            "12 Commerce",
            "12 Arts",
          ].map((cls) => {
            const isSelected = formData.classes?.includes(cls);
            return (
              <button
                type="button"
                key={cls}
                className={`rounded-lg p-3 text-center font-medium transition ${
                  isSelected
                    ? "bg-black text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100 border"
                }`}
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    classes: isSelected
                      ? prev.classes.filter((c) => c !== cls)
                      : [...(prev.classes || []), cls],
                  }));
                }}
              >
                <div className="flex items-center justify-between">
                  <span>{cls}</span>
                  {isSelected && <span className="text-white">✔</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>

    {/* Selected Classes Preview with Cross to Remove */}
    <div className="mt-4">
      <h5 className="font-semibold text-sm text-gray-700 mb-2">
        Selected Classes:
      </h5>
      <div className="flex flex-wrap gap-2">
        {(formData.classes || []).map((cls) => (
          <span
            key={cls}
            className="flex items-center bg-black text-white text-sm px-3 py-1 rounded-full gap-2"
          >
            {cls}
            <button
              type="button"
              className="text-white hover:text-red-300 ml-1"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  classes: prev.classes.filter((c) => c !== cls),
                }));
              }}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>

    {/* Navigation Buttons */}
    <div className="flex justify-between mt-6">
      <button
        type="button"
        className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-gray-200 text-gray-800 hover:bg-gray-300 h-9 py-2 px-8"
      >
        Back
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-black text-white hover:bg-gray-800 h-9 py-2 px-8"
      >
        {isSubmitting ? "Processing..." : "Continue"}
      </button>
    </div>
  </form>
)}

        {step === 3 && (
          <form onSubmit={handleSubmitStep3} className="space-y-6">
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
                className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-gray-800 shadow hover:bg-gray-300 h-9 py-2 px-8"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 py-2 px-8"
              >
                {isSubmitting ? "Processing..." : "Complete Setup"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

const inputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";