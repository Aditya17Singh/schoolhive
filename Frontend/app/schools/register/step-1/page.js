"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerOrganization } from "../action";
import RegistrationLayout from "../registration-layout";

const inputClass =
	"w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300";

export default function Step1Page() {
	const [formData, setFormData] = useState({});
	const [status, setStatus] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [logoPreview, setLogoPreview] = useState(null);

	const router = useRouter();

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		const finalValue = files ? files[0] : value;

		if (name === "logo" && files?.[0]) {
			setLogoPreview(URL.createObjectURL(files[0]));
		}

		setFormData((prev) => ({
			...prev,
			[name]: finalValue,
		}));
	};

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
				setStatus("✅ Organization setup saved!");
				setTimeout(() => setStatus(""), 3000);
				router.push(`/schools/register/step-2?organizationId=${result.organizationId
					}`);
			} else {
				setStatus(`❌ Error: ${result.error || "Unknown error"}`);
			}
		} catch (error) {
			setStatus(`❌ Error: ${error.message}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<RegistrationLayout step={1} status={status}>
			<form onSubmit={handleSubmitStep1} className="space-y-6">
				{/* Organization Details */}
				<Section title="Organization Details" subtitle="Basic info about your organization">
					<div className="grid p-4 grid-cols-1 md:grid-cols-2 gap-4">
						<InputField label="Organization Name" name="name" value={formData.name || ""} onChange={handleChange} />
						<InputField label="Organization Email" name="contactEmail" type="email" value={formData.contactEmail || ""} onChange={handleChange} />
						<InputField label="Phone Number" name="contactPhone" value={formData.contactPhone || ""} onChange={handleChange} />
						<InputField label="Password" name="password" type="password" value={formData.password || ""} onChange={handleChange} />
						<InputField label="Organization Prefix" name="prefix" value={formData.prefix || ""} onChange={handleChange} />
						<InputField label="Short Name" name="shortName" value={formData.shortName || ""} onChange={handleChange} />
					</div>
				</Section>

				{/* Logo Upload */}
				<Section title="Organization Logo" subtitle="Upload a professional logo">
					<div className="p-4 space-y-4">
						<input
							name="logo"
							type="file"
							accept="image/*"
							onChange={handleChange}
							className={inputClass}
						/>
						{logoPreview && (
							<div className="mt-2">
								<p className="text-sm text-gray-500">Preview:</p>
								<img src={logoPreview} alt="Logo Preview" className="h-20 object-contain mt-1" />
							</div>
						)}
					</div>
				</Section>

				{/* Address */}
				<Section title="Organization Address">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
						<InputField label="Address Line 1" name="addressLine1" value={formData.addressLine1 || ""} onChange={handleChange} />
						<InputField label="Address Line 2" name="addressLine2" value={formData.addressLine2 || ""} required={false} onChange={handleChange} />
						<InputField label="State" name="state" value={formData.state || ""} onChange={handleChange} />
						<InputField label="District" name="district" value={formData.district || ""} onChange={handleChange} />
						<InputField label="City" name="city" value={formData.city || ""} onChange={handleChange} />
						<InputField label="PIN Code" name="pincode" value={formData.pincode || ""} onChange={handleChange} />
					</div>
				</Section>

				{/* Buttons */}
				<div className="flex justify-between items-center mt-6">
					<p className="text-sm text-gray-500">
						<span className="text-red-500">*</span> Required fields
					</p>
					<button
						type="submit"
						disabled={isSubmitting}
						className="inline-flex items-center px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
					>
						{isSubmitting ? "Processing..." : "Continue"}
						<svg
							className="ml-2"
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M5 12h14" />
							<path d="m12 5 7 7-7 7" />
						</svg>
					</button>
				</div>
			</form>
		</RegistrationLayout>
	);
}

// Reusable section wrapper - move outside main component
function Section({ title, subtitle, children }) {
	// Example icons for each title - you can customize
	const icons = {
		"Organization Details": (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
				<path d="M20 7h-9"></path>
				<path d="M14 17H5"></path>
				<circle cx="17" cy="17" r="3"></circle>
				<circle cx="7" cy="7" r="3"></circle>
			</svg>
		),
		"Organization Logo": (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
				<rect width="18" height="18" x="3" y="3" rx="2"></rect>
				<circle cx="9" cy="9" r="2"></circle>
				<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
			</svg>
		),
		"Organization Address": (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
				<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
				<circle cx="12" cy="10" r="3"></circle>
			</svg>
		),
	};

	return (
		<div className="rounded-xl shadow-sm">
			<div className="flex bg-gray-50 flex-col space-y-1.5 p-4 rounded-t-lg">
				<h3 className="font-semibold tracking-tight text-xl flex items-center gap-2">
					{icons[title]}
					{title} {title === "Organization Logo" && <span className="text-red-500">*</span>}
				</h3>
				{subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
			</div>
			{children}
		</div>
	);
}

function InputField({ label, name, type = "text", required = true, value, onChange }) {
	const id = `input-${name}`;
	return (
		<div>
			<label htmlFor={id} className="block mb-1">
				{label} {required && <span className="text-red-500">*</span>}
			</label>
			<input
				id={id}
				name={name}
				type={type}
				required={required}
				value={value}
				onChange={onChange}
				className={inputClass}
			/>
		</div>
	);
}

