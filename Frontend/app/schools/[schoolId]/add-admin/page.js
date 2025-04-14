'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function AdminCreatePage() {
    const params = useParams();
    const schoolId = params.schoolId;
    const [status, setStatus] = useState('');
    const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
});


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData({
      ...adminData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    if (!schoolId) {
      setStatus('❌ Error: School ID is required');
      return;
    }

    try {
      // Send a POST request with schoolId in the URL
      const response = await fetch(`http://localhost:5000/schools/${schoolId}/add-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData), // No need to include schoolId here, it's in the URL
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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Create Admin for School</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Admin details */}
        <input
          name="name"
          value={adminData.name}
          onChange={handleInputChange}
          placeholder="Admin Name"
          required
          className="input"
        />
        <input
          name="email"
          type="email"
          value={adminData.email}
          onChange={handleInputChange}
          placeholder="Admin Email"
          required
          className="input"
        />
        <input
          name="password"
          type="password"
          value={adminData.password}
          onChange={handleInputChange}
          placeholder="Admin Password"
          required
          className="input"
        />
        <select
          name="role"
          value={adminData.role}
          onChange={handleInputChange}
          className="input"
        >
          <option value="admin">Admin</option>
          <option value="superAdmin">Super Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          disabled={status === 'Submitting...'}
        >
          Create Admin
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
