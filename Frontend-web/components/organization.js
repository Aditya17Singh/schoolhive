"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function SchoolProfileCard() {
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ studentCount: 0, teacherCount: 0 });

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const orgId = user?.id;

        const [orgRes, statsRes] = await Promise.all([
          API.get(`/organization/${orgId}`),
          API.get(`/organization/${orgId}/stats`)
        ]);

        setOrg(orgRes.data.organization);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Fetch organization error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!org)
    return (
      <div className="text-center py-10 text-red-500">
        Organization not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="border text-card-foreground bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="flex flex-col space-y-1.5 p-6 relative h-48 bg-gradient-to-r from-blue-600 to-blue-800">
            <div className="absolute -bottom-16 left-8">
              <div className="h-32 w-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={org.logo || "https://via.placeholder.com/150"}
                  alt={org.orgName}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="p-6 pt-20 px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {org.orgName}
                </h1>
                <div className="flex items-center text-gray-600 mb-6">
                  <span>Administrator</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div>
                      <p className="text-gray-700">{org.address.line1},</p>
                      <p className="text-gray-700">
                        {org.address.city}, {org.address.district}
                      </p>
                      <p className="text-gray-700">
                        {org.address.state} - {org.address.pinCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <a
                      href={`mailto:${org.orgEmail}`}
                      className="text-gray-700 hover:text-blue-600"
                    >
                      {org.orgEmail}
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:border-l lg:pl-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard title="Total Students" value={stats.studentCount} />
                  <StatCard title="Faculty Members" value={stats.teacherCount} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <img
              src="/logo_without_bg.svg"
              alt="Indigle Logo"
              className="h-6 w-6 rounded-full bg-gray-100"
            />
            <span className="text-sm font-medium">Powered by SchoolHive</span>
          </a>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon }) => (
  <div className="rounded-xl border shadow bg-gradient-to-br from-blue-50 to-blue-100 p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-blue-600 font-medium">{title}</p>
        <p className="text-2xl font-bold text-blue-900">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);
