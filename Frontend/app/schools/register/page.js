'use client';

import { useState } from 'react';
import { registerSchool } from './action';

export default function SchoolRegisterPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const result = await registerSchool(data);

    if (result.success) {
      setStatus('✅ School and Admin created successfully!');
    } else {
      setStatus(`❌ Error: ${result.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Register School + Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="School Name" required className="input" />
        <input name="code" placeholder="School Code" required className="input" />
        <input name="contactEmail" type="email" placeholder="School Email" required className="input" />
        <input name="contactPhone" placeholder="Phone Number" className="input" />
        <input name="address" placeholder="Address" className="input" />

        <hr className="my-4" />

        <input name="adminName" placeholder="Admin Name" required className="input" />
        <input name="adminEmail" type="email" placeholder="Admin Email" required className="input" />
        <input name="adminPassword" type="password" placeholder="Admin Password" required className="input" />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          disabled={status === 'Submitting...'}
        >
          Register
        </button>

        {status === 'Submitting...' && (
          <div className="flex justify-center my-4">
            <div className="w-6 h-6 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          </div>
        )}

        {status && status !== 'Submitting...' && <p className="text-center mt-4">{status}</p>}
      </form>
    </div>
  );
}
