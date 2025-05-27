'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from "axios";

export default function ApplicationForm() {
	const [classes, setClasses] = useState([]);
	const [loading, setLoading] = useState(true);

	const [form, setForm] = useState({
		fName: '',
		mName: '',
		lName: '',
		dob: '',
		gender: '',
		religion: '',
		nationality: '',
		category: '',
		admissionClass: '',
		contactNumber: '',
		email: '',
		permanentAddress: '',
		residentialAddress: '',
		sameAsPermanent: false,
		fatherName: '',
		fatherPhone: '',
		fatherEmail: '',
		motherName: '',
		motherPhone: '',
		motherEmail: '',
		guardianName: '',
		guardianPhone: '',
		session: '',
		aadhaarNumber: '',
		abcId: '',
		avatar: null,
		aadharCard: null,
		previousSchoolTC: null,
		medicalCertificate: null,
		birthCertificate: null,
	});

	const handleChange = (e) => {
		const { id, value, type, checked, files } = e.target;
		if (type === 'checkbox') {
			setForm(prev => {
				if (id === 'sameAsPermanent' && checked) {
					// Copy permanentAddress to residentialAddress
					return { ...prev, [id]: checked, residentialAddress: prev.permanentAddress };
				}
				if (id === 'sameAsPermanent' && !checked) {
					return { ...prev, [id]: checked };
				}
				return prev;
			});
		} else if (type === 'file') {
			setForm(prev => ({ ...prev, [id]: files[0] }));
		} else {
			setForm(prev => ({ ...prev, [id]: value }));
			if (id === 'permanentAddress' && form.sameAsPermanent) {
				// Sync residentialAddress if checkbox checked
				setForm(prev => ({ ...prev, residentialAddress: value }));
			}
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Submitted:', form);
		// Handle API POST here, including files
	};

	const fetchClasses = useCallback(async () => {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get("http://localhost:5000/api/classes", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setClasses(res.data);
		} catch (error) {
			console.error(error);
			//   showToast("Error fetching classes", "error");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchClasses();
	}, [fetchClasses]);


	return (
		<div>
			<div>Personal Information</div>
			<form onSubmit={handleSubmit} className="p-6 pt-0 grid md:grid-cols-3 gap-6">
				{/* First Name */}
				<div className="space-y-2">
					<label htmlFor="fName" className="text-sm font-medium leading-none">First Name</label>
					<input
						id="fName"
						value={form.fName}
						onChange={handleChange}
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						required
					/>
				</div>

				{/* Middle Name */}
				<div className="space-y-2">
					<label htmlFor="mName" className="text-sm font-medium leading-none">Middle Name</label>
					<input
						id="mName"
						value={form.mName}
						onChange={handleChange}
						placeholder="Leave blank if not applicable"
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>

				{/* Last Name */}
				<div className="space-y-2">
					<label htmlFor="lName" className="text-sm font-medium leading-none">Last Name</label>
					<input
						id="lName"
						value={form.lName}
						onChange={handleChange}
						placeholder="Leave blank if not applicable"
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>

				{/* Date of Birth */}
				<div className="space-y-2">
					<label htmlFor="dob" className="text-sm font-medium leading-none">Date of Birth</label>
					<input
						id="dob"
						type="date"
						value={form.dob}
						onChange={handleChange}
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						required
					/>
				</div>

				{/* Gender */}
				<div className="space-y-2">
					<label htmlFor="gender" className="text-sm font-medium leading-none">Gender</label>
					<select
						id="gender"
						value={form.gender}
						onChange={handleChange}
						className="flex h-9 w-full rounded-md border bg-[#F7F8FA] px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						required
					>
						<option value="">Select Gender</option>
						<option>Male</option>
						<option>Female</option>
						<option>Other</option>
					</select>
				</div>

				{/* Religion */}
				<div className="space-y-2">
					<label htmlFor="religion" className="text-sm font-medium leading-none">Religion</label>
					<select
						id="religion"
						value={form.religion}
						onChange={handleChange}
						className="flex h-9 w-full rounded-md border bg-[#F7F8FA] px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
					<label htmlFor="nationality" className="text-sm font-medium leading-none">Nationality</label>
					<select
						id="nationality"
						value={form.nationality}
						onChange={handleChange}
						className="flex h-9 w-full rounded-md border bg-[#F7F8FA] px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						required
					>
						<option value="">Select Nationality</option>
						<option value="Indian">Indian</option>
						<option value="Other">Other</option>
					</select>
				</div>

				{/* Category */}
				<div className="space-y-2">
					<label htmlFor="category" className="text-sm font-medium leading-none">Category</label>
					<select
						id="category"
						value={form.category}
						onChange={handleChange}
						className="flex h-9 w-full rounded-md border bg-[#F7F8FA] px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						required
					>
						<option value="">Select Category</option>
						<option value="General">General</option>
						<option value="OBC">OBC</option>
						<option value="SC">SC</option>
						<option value="ST">ST</option>
					</select>
				</div>

				<div className="space-y-2">
					<label htmlFor="admissionClass" className="text-sm font-medium leading-none">
						Class (Admission Sought)
					</label>
					<select
						id="admissionClass"
						name="admissionClass"
						value={form.admissionClass}
						onChange={handleChange}
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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


				{/* Contact Number */}
				<div className="space-y-2">
					<label htmlFor="contactNumber" className="text-sm font-medium leading-none">Contact Number</label>
					<input
						id="contactNumber"
						type="tel"
						value={form.contactNumber}
						onChange={handleChange}
						placeholder="Student's contact number"
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						required
						pattern="[0-9]{10}"
						title="Enter 10 digit phone number"
					/>
				</div>

				{/* Email Address */}
				<div className="space-y-2">
					<label htmlFor="email" className="text-sm font-medium leading-none">Email Address</label>
					<input
						id="email"
						type="email"
						value={form.email}
						onChange={handleChange}
						placeholder="Student's email address"
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						required
					/>
				</div>

				{/* Permanent Address */}
				{/* Permanent Address */}
				<div className="space-y-2 md:col-span-2">
					<label className="text-sm font-medium text-gray-700">Permanent Address</label>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<input
							id="permanentAddress.line1"
							value={form.permanentAddress.line1}
							onChange={handleChange}
							placeholder="Address Line 1"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
							required
						/>
						<input
							id="permanentAddress.line2"
							value={form.permanentAddress.line2}
							onChange={handleChange}
							placeholder="Address Line 2"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
						/>
						<input
							id="permanentAddress.city"
							value={form.permanentAddress.city}
							onChange={handleChange}
							placeholder="City"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
							required
						/>
						<input
							id="permanentAddress.district"
							value={form.permanentAddress.district}
							onChange={handleChange}
							placeholder="District"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
							required
						/>
						<input
							id="permanentAddress.state"
							value={form.permanentAddress.state}
							onChange={handleChange}
							placeholder="State"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
							required
						/>
						<input
							id="permanentAddress.pincode"
							value={form.permanentAddress.pincode}
							onChange={handleChange}
							placeholder="Pin Code"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
							required
						/>
					</div>
				</div>

				{/* Residential Address */}
				<div className="space-y-2 md:col-span-2 mt-6">
					<label className="text-sm font-medium text-gray-700">Residential Address</label>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<input
							id="residentialAddress.line1"
							value={form.residentialAddress.line1}
							onChange={handleChange}
							placeholder="Address Line 1"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
							required
						/>
						<input
							id="residentialAddress.line2"
							value={form.residentialAddress.line2}
							onChange={handleChange}
							placeholder="Address Line 2"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
						/>
						<input
							id="residentialAddress.city"
							value={form.residentialAddress.city}
							onChange={handleChange}
							placeholder="City"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
							required
						/>
						<input
							id="residentialAddress.district"
							value={form.residentialAddress.district}
							onChange={handleChange}
							placeholder="District"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
							required
						/>
						<input
							id="residentialAddress.state"
							value={form.residentialAddress.state}
							onChange={handleChange}
							placeholder="State"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
							required
						/>
						<input
							id="residentialAddress.pincode"
							value={form.residentialAddress.pincode}
							onChange={handleChange}
							placeholder="Pin Code"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
							required
						/>
					</div>

					<label className="text-sm flex items-center gap-2 mt-3 text-gray-700">
						<input
							type="checkbox"
							id="sameAsPermanent"
							checked={form.sameAsPermanent}
							onChange={handleChange}
							className="w-4 h-4 border-gray-300 rounded"
						/>
						Same as permanent address
					</label>
				</div>


				{/* Father Info */}
				<div className="space-y-2">
					<label htmlFor="fatherName" className="text-sm font-medium leading-none">Father's Name</label>
					<input
						id="fatherName"
						value={form.fatherName}
						onChange={handleChange}
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						required
					/>
				</div>
				<div className="space-y-2">
					<label htmlFor="fatherPhone" className="text-sm font-medium leading-none">Father's Phone Number</label>
					<input
						id="fatherPhone"
						type="tel"
						value={form.fatherPhone}
						onChange={handleChange}
						placeholder="10-digit phone number"
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						pattern="[0-9]{10}"
						title="Enter 10 digit phone number"
						required
					/>
				</div>
				<div className="space-y-2">
					<label htmlFor="fatherEmail" className="text-sm font-medium leading-none">Father's Email Address</label>
					<input
						id="fatherEmail"
						type="email"
						value={form.fatherEmail}
						onChange={handleChange}
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						required
					/>
				</div>

				{/* Mother Info */}
				<div className="space-y-2">
					<label htmlFor="motherName" className="text-sm font-medium leading-none">Mother's Name</label>
					<input
						id="motherName"
						value={form.motherName}
						onChange={handleChange}
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						required
					/>
				</div>
				<div className="space-y-2">
					<label htmlFor="motherPhone" className="text-sm font-medium leading-none">Mother's Phone Number</label>
					<input
						id="motherPhone"
						type="tel"
						value={form.motherPhone}
						onChange={handleChange}
						placeholder="10-digit phone number"
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						pattern="[0-9]{10}"
						title="Enter 10 digit phone number"
						required
					/>
				</div>
				<div className="space-y-2">
					<label htmlFor="motherEmail" className="text-sm font-medium leading-none">Mother's Email Address</label>
					<input
						id="motherEmail"
						type="email"
						value={form.motherEmail}
						onChange={handleChange}
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						required
					/>
				</div>

				{/* Guardian Info */}
				<div className="space-y-2 md:col-span-2">
					<label htmlFor="guardianName" className="text-sm font-medium leading-none">Guardian's Name (If Applicable)</label>
					<input
						id="guardianName"
						value={form.guardianName}
						onChange={handleChange}
						placeholder="Optional"
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
				<div className="space-y-2 md:col-span-1">
					<label htmlFor="guardianPhone" className="text-sm font-medium leading-none">Guardian's Phone Number</label>
					<input
						id="guardianPhone"
						type="tel"
						value={form.guardianPhone}
						onChange={handleChange}
						placeholder="Optional"
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>

				{/* Session */}
				<div className="space-y-2">
					<label htmlFor="session" className="text-sm font-medium leading-none">Session</label>
					<input
						id="session"
						value={form.session}
						onChange={handleChange}
						placeholder="E.g. 2024-25"
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						required
					/>
				</div>

				{/* Aadhaar Number */}
				<div className="space-y-2">
					<label htmlFor="aadhaarNumber" className="text-sm font-medium leading-none">Aadhaar Number</label>
					<input
						id="aadhaarNumber"
						type="text"
						value={form.aadhaarNumber}
						onChange={handleChange}
						placeholder="12-digit Aadhaar Number"
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						pattern="[0-9]{12}"
						title="Enter 12 digit Aadhaar number"
						required
					/>
				</div>

				{/* ABC ID */}
				<div className="space-y-2">
					<label htmlFor="abcId" className="text-sm font-medium leading-none">ABC ID</label>
					<input
						id="abcId"
						value={form.abcId}
						onChange={handleChange}
						placeholder="If applicable"
						className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>

				{/* Documents Section */}
				<fieldset className="md:col-span-3 border border-gray-300 rounded-md p-4">
					<legend className="text-base font-semibold mb-4">Documents Upload</legend>

					{/* Avatar */}
					<div className="mb-4">
						<label htmlFor="avatar" className="block mb-2 text-sm font-medium">Upload Avatar</label>
						<input
							type="file"
							id="avatar"
							onChange={handleChange}
							accept="image/*"
							className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
						/>
					</div>

					{/* Aadhar Card */}
					<div className="mb-4">
						<label htmlFor="aadharCard" className="block mb-2 text-sm font-medium">Upload Aadhar Card</label>
						<input
							type="file"
							id="aadharCard"
							onChange={handleChange}
							accept=".pdf,image/*"
							className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
						/>
					</div>

					{/* Previous School TC */}
					<div className="mb-4">
						<label htmlFor="previousSchoolTC" className="block mb-2 text-sm font-medium">Upload Previous School TC</label>
						<input
							type="file"
							id="previousSchoolTC"
							onChange={handleChange}
							accept=".pdf,image/*"
							className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
						/>
					</div>

					{/* Medical Certificate */}
					<div className="mb-4">
						<label htmlFor="medicalCertificate" className="block mb-2 text-sm font-medium">Upload Medical Certificate</label>
						<input
							type="file"
							id="medicalCertificate"
							onChange={handleChange}
							accept=".pdf,image/*"
							className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
						/>
					</div>

					{/* Birth Certificate */}
					<div>
						<label htmlFor="birthCertificate" className="block mb-2 text-sm font-medium">Upload Birth Certificate</label>
						<input
							type="file"
							id="birthCertificate"
							onChange={handleChange}
							accept=".pdf,image/*"
							className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
						/>
					</div>
				</fieldset>

				{/* Submit Button */}
				<div className="md:col-span-3 pt-4 flex justify-end">
					<button
						type="submit"
						className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						Submit Application
					</button>
				</div>
			</form>
		</div>
	);
}
