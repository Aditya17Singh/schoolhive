"use client";

import { useState } from "react";
import { registerAcademicYear } from "../action";
import RegistrationLayout from "../registration-layout";
import { useSearchParams, useRouter } from "next/navigation";

export default function Step2Page() {
	const searchParams = useSearchParams();
	const organizationId = searchParams.get("organizationId");
	const [formData, setFormData] = useState({});
	const [status, setStatus] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
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
	const handleBack = () => setStep((s) => s - 1);
	const handleSubmitStep3 = async (e) => {
		e.preventDefault();

		// Validate academic year data
		if (!formData.academicYearStart || !formData.academicYearEnd) {
			setStatus("Please enter both start and end years");
			return;
		}

		if (!organizationId) {
			setStatus(
				"Missing organization information. Please restart the process."
			);
			return;
		}

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
				organizationId
			);

			if (result.success) {
				setStatus("Academic year saved successfully!");
				router.push("/");
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
		<RegistrationLayout step={3} status={status}>
			<form onSubmit={handleSubmitStep3} className="space-y-6">
				{/* Step Heading */}
				<div>
					<h3 className="text-xl font-semibold text-gray-800 mb-1">
						Final Step: Set Academic Year
					</h3>
					<p className="text-gray-600 text-sm">
						Configure the academic year of your organization
					</p>
				</div>

				{/* Card Container */}
				<div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
					<h4 className="font-semibold text-gray-800 mb-4">
						Academic Year
					</h4>

					{/* Input Fields */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block mb-1 text-sm font-medium text-gray-700">
								Start Year <span className="text-red-500">*</span>
							</label>
							<input
								name="academicYearStart"
								required
								placeholder="2025"
								onChange={handleChange}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
						<div>
							<label className="block mb-1 text-sm font-medium text-gray-700">
								End Year <span className="text-red-500">*</span>
							</label>
							<input
								name="academicYearEnd"
								required
								placeholder="2026"
								onChange={handleChange}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
					</div>

					{/* Navigation Buttons */}
					<div className="flex justify-between mt-6">
						<button
							type="button"
							onClick={handleBack}
							className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 px-6 py-2 transition"
						>
							Back
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							// className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 transition"
							className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-black text-white hover:bg-gray-800 h-9 py-2 px-8"
						>
							{isSubmitting ? "Processing..." : "Complete Setup"}
						</button>
					</div>
				</div>
			</form>
		</RegistrationLayout>
	);
}


