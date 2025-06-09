'use client';

import { useState, useEffect } from 'react';

export default function ManageApplicationsPage() {
	const [search, setSearch] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchApplications = async () => {
			try {
				setLoading(true);
				const token = localStorage.getItem('token');
				const res = await fetch(
					`http://localhost:5000/api/teachers?status=${filterStatus === 'all' ? '' : filterStatus}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const data = await res.json();
				console.log(data, 'data');
				
				if (data.success) {
					setApplications(data.data);
				}
			} catch (error) {
				console.error('Error fetching teachers:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchApplications();
	}, [filterStatus]);

	const updateStatus = async (id, newStatus) => {
	try {
		const token = localStorage.getItem('token');
		const res = await fetch(`http://localhost:5000/api/teachers/status/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ status: newStatus }),
		});
		const data = await res.json();
		if (data.success) {
			// Refresh the list after status update
			setApplications(prev => prev.map(app => app._id === id ? { ...app, status: newStatus } : app));
		}
	} catch (error) {
		console.error('Failed to update status:', error);
	}
  };

	const getStatusBadge = (status) => {
		const statusConfig = {
			pending: 'bg-amber-50 text-amber-700 border-amber-200',
			approved: 'bg-green-50 text-green-700 border-green-200',
			rejected: 'bg-red-50 text-red-700 border-red-200'
		};

		return (
			<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusConfig[status]}`}>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</span>
		);
	};
console.log(applications, 'applications');

	const filteredApplications = applications.filter(app => {
		const matchesSearch = app.fName?.toLowerCase().includes(search.toLowerCase())
		const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
		return matchesSearch && matchesFilter;
	});

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
				{/* Header */}
				<div className="mb-8">
					<div className="mb-6">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Manage Applications
						</h1>
						<p className="text-gray-600">
							Review and process teacher applications for your institution
						</p>
					</div>

					{/* Portal Status Card */}
					<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<div className={`w-3 h-3 rounded-full ${isPortalOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
								<div>
									<h3 className="font-semibold text-gray-900">Application Portal</h3>
									<p className="text-sm text-gray-500">
										Applications are currently {isPortalOpen ? 'open' : 'closed'}
									</p>
								</div>
							</div>
							<button
								onClick={() => setIsPortalOpen(!isPortalOpen)}
								className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${isPortalOpen
									? 'bg-red-600 hover:bg-red-700 text-white'
									: 'bg-green-600 hover:bg-green-700 text-white'
									}`}
							>
								{isPortalOpen ? (
									<>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
										Close Applications
									</>
								) : (
									<>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
										Open Applications
									</>
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Search and Filters */}
				<div className="mb-6 flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<circle cx="11" cy="11" r="8" />
							<path d="m21 21-4.3-4.3" />
						</svg>
						<input
							type="text"
							placeholder="Search by name or registration number..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<div className="flex gap-3">
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="all">All Status</option>
							<option value="pending">Pending</option>
							<option value="approved">Approved</option>
							<option value="rejected">Rejected</option>
						</select>

						<button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
							<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
						</button>
					</div>
				</div>

				{/* Applications Table */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 border-b border-gray-200">
								<tr>
									<th className="text-left px-6 py-4 font-semibold text-gray-900">Student Name</th>
									<th className="text-left px-6 py-4 font-semibold text-gray-900">Registration No.</th>
									<th className="text-left px-6 py-4 font-semibold text-gray-900">Application Date</th>
									<th className="text-left px-6 py-4 font-semibold text-gray-900">Status</th>
									<th className="text-left px-6 py-4 font-semibold text-gray-900">Phone</th>
									<th className="text-left px-6 py-4 font-semibold text-gray-900">Email</th>
									<th className="text-right px-6 py-4 font-semibold text-gray-900">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{filteredApplications.map((app) => (
									<tr key={app.id} className="hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4">
											<div className="font-medium text-gray-900">{app.fName}</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-600 font-mono">{app.regNo}</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-600">{app.date}</div>
										</td>
										<td className="px-6 py-4">
											{getStatusBadge(app.status)}
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-600">{app.phone}</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-600">{app.email}</div>
										</td>
										<td className="px-6 py-4 text-right">
											<div className="flex items-center justify-end gap-2">
												<button className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 rounded-md hover:bg-blue-50 transition-colors">
													View
												</button>
											</div>
										</td>

										<td className="px-6 py-4 text-right">
	{app.status === 'pending' && (
		<div className="flex gap-2 justify-end">
			<button
				onClick={() => updateStatus(app._id, 'approved')}
				className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
			>
				Approve
			</button>
			<button
				onClick={() => updateStatus(app._id, 'rejected')}
				className="text-sm px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
			>
				Reject
			</button>
		</div>
	)}
</td>

									</tr>
								))}
							</tbody>
						</table>
					</div>

					{filteredApplications.length === 0 && (
						<div className="text-center py-12">
							<svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							<h3 className="text-gray-500 font-medium">No applications found</h3>
							<p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
