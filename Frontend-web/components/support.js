"use client";

import { useState } from "react";

const faqs = [
	{
		question: "How do I manage student attendance?",
		answer:
			"You can manage student attendance through the Attendance module in the dashboard. Simply select the class, date, and mark present/absent status for each student. The system automatically calculates attendance percentages and generates reports.",
	},
	{
		question: "How can I generate fee receipts?",
		answer: "You can manage student attendance through the Attendance module in the dashboard. Simply select the class, date, and mark present/absent status for each student.",
	},
	{
		question: "How do I add new teachers to the system?",
		answer: "You can manage student attendance through the Attendance module in the dashboard. Simply select the class, date, and mark present/absent status for each student.",
	},
	{
		question: "Can I customize the academic calendar?",
		answer: "You can manage student attendance through the Attendance module in the dashboard. Simply select the class, date, and mark present/absent status for each student.",
	},
	{
		question: "How do I reset my password?",
		answer: "You can manage student attendance through the Attendance module in the dashboard. Simply select the class, date, and mark present/absent status for each student.",
	},
	{
		question: "How can I generate student report cards?",
		answer: "You can manage student attendance through the Attendance module in the dashboard. Simply select the class, date, and mark present/absent status for each student.",
	},
];
const features = [
	{ label: "24/7 Support", icon: "lucide-clock", color: "blue" },
	{ label: "Quick Response", icon: "lucide-circle-check", color: "green" },
	{ label: "Expert Help", icon: "lucide-circle-help", color: "purple" },
];
export default function HelpPage() {
	const [openIndex, setOpenIndex] = useState(0);

	const toggle = (index) => {
		setOpenIndex(index === openIndex ? null : index);
	};

	return (
		<div className="max-w-6xl mx-auto px-6 py-4">
			{/* Header */}
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold text-slate-800 mb-4">How Can We Help You?</h1>
				<p className="text-slate-600 max-w-2xl mx-auto">
					Get instant support for your queries. Our dedicated team is here to assist you 24/7.
				</p>
			</div>

			{/* FAQ Section */}
			<div className="grid lg:grid-cols-2 gap-8 mb-12">
				{/* Left FAQ Box */}
				<div className="rounded-xl border border-[#cecbcb] shadow-lg bg-white">
					<div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
						<h3 className="font-semibold flex items-center gap-2">
							<i className="lucide lucide-circle-help h-5 w-5" />
							Frequently Asked Questions
						</h3>
					</div>

					<div className="p-6">
						{/* Search */}
						<div className="mb-6 relative">
							<i className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
							<input
								type="text"
								placeholder="Search FAQs..."
								className="w-full h-9 pl-10 pr-3 py-1 rounded-md border border-slate-200 text-sm shadow-sm placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
							/>
						</div>

						{/* FAQ List */}
						<div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
							{faqs.map((item, idx) => (
								<div
									key={idx}
									className="border border-slate-200 rounded-lg overflow-hidden"
									style={{ opacity: 1 }}
								>
									<button
										onClick={() => toggle(idx)}
										className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
									>
										<span className="font-semibold text-slate-700">{item.question}</span>
										<div
											style={{
												transform: openIndex === idx ? "rotate(180deg)" : "rotate(0deg)",
												transition: "transform 0.3s ease",
											}}
										>
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
												className="lucide lucide-chevron-down h-5 w-5 text-slate-400"
											>
												<path d="m6 9 6 6 6-6" />
											</svg>
										</div>
									</button>
									{openIndex === idx && item.answer && (
										<div className="overflow-hidden">
											<div className="p-4 bg-slate-50 border-t border-slate-200">
												<p className="text-slate-600">{item.answer}</p>
											</div>
										</div>
									)}
								</div>
							))}
						</div>

					</div>
				</div>

				{/* Features */}
				<div className="space-y-6">
					{/* Feature Cards */}
					<div className="grid grid-cols-3 gap-4 mb-6">
						{features.map((item, idx) => (
							<div
								key={idx}
								className={`rounded-xl text-card-foreground shadow border border-[#cecbcb] cursor-pointer hover:bg-${item.color}-100 bg-${item.color}-50`}
							>
								<div className="p-4 text-center">
									<i className={`lucide ${item.icon} h-6 w-6 text-${item.color}-600 mx-auto mb-2`} />
									<p className="text-sm font-medium">{item.label}</p>
								</div>
							</div>
						))}
					</div>

					{/* Support Card */}
					<div className="rounded-xl border bg-card text-card-foreground border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
						<div className="p-6">
							{/* Phone Support */}
							<div className="flex items-center space-x-4 mb-6 hover:bg-slate-100 p-3 rounded-lg transition-colors cursor-pointer">
								<div className="bg-blue-100 p-3 rounded-full">
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
										className="lucide lucide-phone h-6 w-6 text-blue-600"
									>
										<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
									</svg>
								</div>
								<div>
									<h3 className="font-semibold text-lg">Phone Support</h3>
									<p className="text-slate-600">+91 8375004856</p>
									<p className="text-sm text-slate-500">Available Monday to Friday, 9AM - 6PM</p>
								</div>
							</div>

							{/* Email Support */}
							<div className="flex items-center space-x-4 hover:bg-slate-100 p-3 rounded-lg transition-colors cursor-pointer">
								<div className="bg-green-100 p-3 rounded-full">
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
										className="lucide lucide-mail h-6 w-6 text-green-600"
									>
										<rect width="20" height="16" x="2" y="4" rx="2" />
										<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
									</svg>
								</div>
								<div>
									<h3 className="font-semibold text-lg">Email Support</h3>
									<p className="text-slate-600">support@schoolhives.com</p>
									<p className="text-sm text-slate-500">24/7 email support</p>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
}
