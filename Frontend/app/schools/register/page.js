'use client';

import { useState } from 'react';
import { registerSchool } from './action';
import { useRouter } from 'next/navigation';

export default function SchoolRegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const finalValue = files ? files[0] : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    
    // Reformat formData to match the backend schema
    const formattedData = {
      name: formData.name,
      shortName: formData.shortName,
      prefix: formData.prefix,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      password: formData.password,
      logo: formData.logo, // assuming formData.logo is a file object or a string (URL)
      address: {
        line1: formData.addressLine1,
        line2: formData.addressLine2 || '',  // optional field
        stateDistrict: formData.stateDistrict,
        city: formData.city,
        pinCode: formData.pincode,
      },
      classes: formData.classes, // array of selected classes
      academicYear: {
        start: formData.academicYearStart,
        end: formData.academicYearEnd,
      },
    };
  
    try {
      const result = await registerSchool(formattedData);
  
      if (result.success) {
        router.push('/dashboard');
      } else {
        setStatus(`❌ Error: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <>
    <header className="py-4 px-4 md:px-6 border-b bg-white/50 backdrop-blur-sm sticky top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center mx-auto">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Organization Setup</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Complete the following steps to get started</p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
        >
          Login Instead?
        </button>
      </div>
    </header>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full mx-auto py-4 px-4 space-y-4">

          {/* Step Indicator */}
          <div className="flex justify-center items-center mb-6 space-x-4 text-sm font-semibold">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {s}
                </div>
                {s !== 3 && <div className="w-8 h-1 bg-gray-300 rounded-full"></div>}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                {/* Card 1: Organization Details */}
                <div className="p-6 bg-gray-50 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-blue-700">1. Organization Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">Organization Name <span className="text-red-500">*</span></label>
                      <input name="name" required onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="block mb-1">Organization Email <span className="text-red-500">*</span></label>
                      <input name="contactEmail" required type="email" onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="block mb-1">Phone Number <span className="text-red-500">*</span></label>
                      <input name="contactPhone" required onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="block mb-1">Password <span className="text-red-500">*</span></label>
                      <input name="password" required type="password" onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="block mb-1">Organization Prefix <span className="text-red-500">*</span></label>
                      <input name="prefix" required onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="block mb-1">Short Name <span className="text-red-500">*</span></label>
                      <input name="shortName" required onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Card 2: Organization Logo */}
                <div className="p-6 bg-gray-50 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-blue-700">2. Organization Logo</h3>
                  <label className="block mb-2">Upload a professional logo <span className="text-red-500">*</span></label>
                  <input name="logo" type="file" accept="image/*" onChange={handleChange} className={inputClass} />
                </div>

                {/* Card 3: Organization Address */}
                <div className="p-6 bg-gray-50 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-blue-700">3. Organization Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">Address Line 1 <span className="text-red-500">*</span></label>
                      <input name="addressLine1" required onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="block mb-1">Address Line 2</label>
                      <input name="addressLine2" onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="block mb-1">State & District <span className="text-red-500">*</span></label>
                      <input name="stateDistrict" required onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="block mb-1">City <span className="text-red-500">*</span></label>
                      <input name="city" required onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="block mb-1">PIN Code <span className="text-red-500">*</span></label>
                      <input name="pincode" required onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <p className="text-sm text-gray-500 text-right">Fields marked with <span className="text-red-500">*</span> are required</p>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 py-2 px-8"
                  >
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}


            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Step 2: Select Classes</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(cls => (
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
                        }} />
                      {cls}
                    </label>
                  ))}
                </div>
                <div className="flex justify-between mt-6">
                  <button type="button" onClick={handleBack} className="btn-secondary">Back</button>
                  <button type="button" onClick={handleNext} className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 transition"
                  >Continue</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Step 3: Academic Year</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Start Year *</label>
                    <input name="academicYearStart" required placeholder="2025" onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="block mb-1">End Year *</label>
                    <input name="academicYearEnd" required placeholder="2026" onChange={handleChange} className={inputClass} />
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button type="button" onClick={handleBack} className="btn-secondary">Back</button>
                  <button type="submit" disabled={status === 'Submitting...'} className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 transition"
                  >
                    {status === 'Submitting...' ? 'Registering...' : 'Submit'}
                  </button>
                </div>
                {status && <p className="text-center text-red-600">{status}</p>}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
