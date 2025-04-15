'use client';

import { useState } from 'react';
import { registerSchool } from './action';
import { useRouter } from 'next/navigation';

export default function SchoolRegisterPage() {
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const result = await registerSchool(data);

    if (result.success) {
      const newSchoolId = result.schoolId;
      router.push(`/schools/${newSchoolId}/add-admin`);
    } else {
      setStatus(`❌ Error: ${result.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Register a New School</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
            <input
              name="name"
              required
              placeholder="Enter full school name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">School Code</label>
            <input
              name="code"
              required
              placeholder="Unique school code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              name="contactEmail"
              type="email"
              required
              placeholder="school@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              name="contactPhone"
              placeholder="e.g. +91 9876543210"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              name="address"
              placeholder="Full address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'Submitting...'}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
          >
            {status === 'Submitting...' ? 'Registering...' : 'Register School'}
          </button>

          {status && status !== 'Submitting...' && (
            <p
              className={`text-center font-medium ${
                status.includes('✅') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
