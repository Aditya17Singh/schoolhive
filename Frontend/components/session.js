'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/api';

export default function AcademicSessions() {
	const [sessions, setSessions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAcademicYears = async () => {
			try {
				const res = await API.get('/academics/academic-years');
				setSessions(res.data);
			} catch (error) {
				console.error('Failed to fetch academic years:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchAcademicYears();
	}, []);

	return (
		<div className="h-full w-full m-1 p-3 bg-gray-100 rounded-md shadow-sm border border-gray-100 mt-6">
			{/* Header */}
			<div className="mb-3 flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-800 mb-2">Academic Sessions</h1>
					<p className="text-gray-600">Manage your academic year sessions</p>
				</div>
				<div>
					<button
						type="button"
						className="flex items-center gap-2 justify-center whitespace-nowrap text-sm h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-all duration-200"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path
								fillRule="evenodd"
								d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
								clipRule="evenodd"
							/>
						</svg>
						Create New Session
					</button>
				</div>
			</div>

			{/* Academic Sessions */}
			{loading ? (
				<p className="text-center text-gray-500 py-8">Loading sessions...</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
					{sessions.map((session) => (
						<div
							key={session._id}
							className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-200 flex flex-col items-center justify-center gap-3"
						>
							<h2 className="font-semibold text-xl text-gray-800">{session.year}</h2>
							<div
								className={`inline-flex items-center text-xs px-4 py-1 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border ${session.isActive
									? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
									: 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-secondary/80'
									}`}
							>
								{session.isActive ? 'Active' : 'Inactive'}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
