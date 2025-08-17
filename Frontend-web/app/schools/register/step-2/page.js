"use client";

import { useState } from "react";
import { registerClasses } from "../action";
import RegistrationLayout from "../registration-layout";
import { useSearchParams, useRouter } from "next/navigation";

export default function Step2Page() {
	const searchParams = useSearchParams();
	const organizationId = searchParams.get("organizationId");
	const [formData, setFormData] = useState({});
	const [status, setStatus] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const handleSubmitStep2 = async (e) => {
		e.preventDefault();

		if (!formData.classes || formData.classes.length === 0) {
			setStatus("Please select at least one class");
			return;
		}

		if (!organizationId) {
			setStatus("Missing organization information. Please go back to step 1.");
			return;
		}

		setIsSubmitting(true);
		setStatus("Saving classes...");

		try {
			const result = await registerClasses(
				formData.classes,
				organizationId,
			);

			if (result.success) {
				setStatus("✅ Organization setup saved!");
				setTimeout(() => setStatus(""), 3000);
				router.push(`/schools/register/step-3?organizationId=${organizationId}`);
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
		<RegistrationLayout step={2} status={status}>
			<form onSubmit={handleSubmitStep2} className="space-y-6">
				<h3 className="text-lg font-semibold mb-4">
					Step 2: Select Classes
				</h3>
				<p>
					Please select the classes you want to register for. You can select
					multiple classes.
				</p>

				{/* Card Groups */}
				<div className="flex flex-col gap-6">
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
										className={`cursor-pointer rounded-lg p-3 text-center font-medium transition duration-200 ${isSelected
											? "bg-gray-700 text-white"
											: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
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
											{isSelected && (
												<span className="ml-2 text-white font-bold text-sm">
													✔
												</span>
											)}
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
										className={`cursor-pointer rounded-lg p-3 text-center font-medium transition duration-200 ${isSelected
											? "bg-gray-700 text-white"
											: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
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
											{isSelected && (
												<span className="ml-2 text-white font-bold text-sm">
													✔
												</span>
											)}
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
										className={`cursor-pointer rounded-lg p-3 text-center font-medium transition duration-200 ${isSelected
											? "bg-gray-700 text-white"
											: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
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
											{isSelected && (
												<span className="ml-2 text-white font-bold text-sm">
													✔
												</span>
											)}
										</div>
									</button>
								);
							})}
						</div>
					</div>

					{/* Secondary */}
					<div className="p-4 rounded-xl shadow bg-white">
						<h4 className="font-semibold mb-3 text-black">
							Secondary (11–12)
						</h4>
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
										className={`cursor-pointer rounded-lg p-3 text-center font-medium transition duration-200 ${isSelected
											? "bg-gray-700 text-white"
											: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
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
											{isSelected && (
												<span className="ml-2 text-white font-bold text-sm">
													✔
												</span>
											)}
										</div>
									</button>
								);
							})}
						</div>
					</div>
				</div>

				{/* Selected Classes UI - Styled like chips in a card */}
				<div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mt-6">
					<h5 className="font-semibold text-gray-800 mb-3">
						Selected Classes ({formData.classes?.length || 0})
					</h5>
					<div className="flex flex-wrap gap-2">
						{(formData.classes || []).map((cls) => (
							<span
								key={cls}
								className="flex items-center bg-gray-700 bg-opacity-90 text-white text-sm px-3 py-1.5 rounded-full gap-1"
							>
								{cls}
								<button
									type="button"
									className="ml-1 rounded-full hover:bg-gray-700 w-5 h-5 flex items-center justify-center"
									onClick={() => {
										setFormData((prev) => ({
											...prev,
											classes: prev.classes.filter((c) => c !== cls),
										}));
									}}
								>
									×
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
		</RegistrationLayout>
	);
}


