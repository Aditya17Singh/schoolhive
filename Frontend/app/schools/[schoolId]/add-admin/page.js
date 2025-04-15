'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AdminCreatePage() {
  const router = useRouter();
  const params = useParams();
  const schoolId = params.schoolId;
  const [status, setStatus] = useState('');
  const [adminData, setAdminData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    role: 'admin',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    if (!schoolId) {
      setStatus('❌ Error: School ID is required');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/schools/${schoolId}/add-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData),
      });

      const result = await response.json();
      if (response.ok) {
        setStatus('✅ Admin created successfully!');
      } else {
        setStatus(`❌ Error: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
      <button
        onClick={() => router.push('/schools/register')}
        className="mb-6 inline-flex items-center text-sm text-blue-600 hover:underline transition-all cursor-pointer"
      >
        ← Back to School Registration
      </button>

      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Create School Admin</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            name="name"
            value={adminData.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            name="mobile"
            value={adminData.mobile}
            onChange={handleInputChange}
            placeholder="Enter mobile number"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={adminData.email}
            onChange={handleInputChange}
            placeholder="example@school.com"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={adminData.password}
            onChange={handleInputChange}
            placeholder="Create a password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200"
          disabled={status === 'Submitting...'}
        >
          {status === 'Submitting...' ? 'Creating Admin...' : 'Create Admin'}
        </button>

        {status && status !== 'Submitting...' && (
          <p
            className={`mt-4 text-center font-medium ${
              status.includes('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
