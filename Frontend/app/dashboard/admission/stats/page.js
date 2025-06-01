"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import axios from "axios";

export default function AdmissionSettingsCard() {
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(null);
  const [admissionFee, setAdmissionFee] = useState(0);
  const [editingFee, setEditingFee] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeAcademicYear, setActiveAcademicYear] = useState("");
  const [genderData, setGenderData] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await API.get("/academics/active");
        const data = res.data;

        setIsAdmissionOpen(data.admissionOpen);
        setActiveAcademicYear(data.year || "");
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load admission settings."
        );
        setIsAdmissionOpen(null);
        setActiveAcademicYear("");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggleAdmission = async () => {
    setLoading(true);
    try {
      const res = await API.put("/academics/active/admission", {
        admissionOpen: !isAdmissionOpen,
        admissionFee,
      });
      setIsAdmissionOpen(res.data.admissionOpen);
      setAdmissionFee(res.data.admissionFee);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not update admission status."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFeeUpdate = async () => {
    setLoading(true);
    try {
      const res = await API.put("/organization/admission/settings", {
        admissionOpen: isAdmissionOpen,
        admissionFee,
      });
      setAdmissionFee(res.data.admissionFee);
      setEditingFee(false);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not update admission fee."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSettingsFee = async () => {
      setLoading(true);
      try {
        const res = await API.get("/organization/admission/settings");
        const data = res.data;

        setAdmissionFee(data.admissionFee);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load admission settings."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSettingsFee();
  }, []);

  useEffect(() => {
    async function fetchGenderData() {
      try {
        const response = await API.get("/students/gender-distribution");
        const distribution = response.data.genderDistribution;

        const chartData = distribution.map((entry) => ({
          name: entry.gender,
          value: entry.count,
        }));

        setGenderData(chartData);
      } catch (error) {
        console.error("Failed to fetch gender distribution:", error);
      }
    }

    fetchGenderData();
  }, []);

  const COLORS = {
    Male: "#3b82f6",
    Female: "#ec4899",
    Other: "#10b981",
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Pending */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <h3 className="text-2xl font-bold text-yellow-600">1</h3>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <h3 className="text-2xl font-bold text-red-600">0</h3>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Admitted */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admitted</p>
              <h3 className="text-2xl font-bold text-green-600">1</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                <path d="m9 11 3 3L22 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        {/* Active Session Card */}
        <div className="w-72 bg-white bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-200 p-4 flex flex-col space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <h2 className="font-medium">
              {activeAcademicYear || "No Active Session"}
            </h2>
            <span className="text-green-600 text-xs font-semibold">
              Active Session
            </span>
          </div>

          <div>
            {isAdmissionOpen === null ? (
              <div className="w-full h-8 bg-gray-200 rounded animate-pulse" />
            ) : (
              <button
                disabled={loading}
                onClick={handleToggleAdmission}
                className={`w-full h-9 cursor-pointer text-sm font-medium rounded-md transition duration-200 px-4 py-1 text-white shadow disabled:opacity-50 disabled:pointer-events-none
							${
                !isAdmissionOpen
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              >
                {loading
                  ? "Updating..."
                  : isAdmissionOpen
                  ? "Close Admissions"
                  : "Open Admissions"}
              </button>
            )}
          </div>
        </div>

        {/* Admission Fee Card */}
        <div className="w-72 bg-white shadow rounded-lg p-4 flex flex-col space-y-3 text-sm">
          <h2 className="font-medium">Admission Fee</h2>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={admissionFee}
              disabled={!editingFee}
              onChange={(e) => setAdmissionFee(parseFloat(e.target.value))}
              className="w-full h-8 px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
            {editingFee ? (
              <button
                onClick={handleFeeUpdate}
                disabled={loading}
                className="text-xs px-3 py-1 cursor-pointer rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditingFee(true)}
                className="text-xs px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-xs mt-2 w-full">{error}</p>}
      </div>

      <div className="rounded-xl mt-4 max-w-[14rem] bg-card text-card-foreground shadow flex flex-col">
        <div className="flex flex-col space-y-1.5 p-6 items-center pb-0">
          <h3 className="font-semibold leading-none tracking-tight">
            Gender Distribution
          </h3>
          <p className="text-sm text-muted-foreground">Overall</p>
        </div>
        <div className="p-6 pt-0 flex-1 pb-0">
          <div
            data-chart="chart-rll"
            className="flex justify-center text-xs mx-auto aspect-square max-h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={76}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {genderData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[entry.name] || "#ccc"}
                      stroke="#fff"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}`, `${name}`]}
                  contentStyle={{ fontSize: "0.75rem" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex items-center p-6 pt-0 flex-col gap-2 text-sm">
          <div className="flex gap-6 font-medium leading-none">
            {genderData.map((entry) => (
              <div key={entry.name} className="flex gap-1 items-center">
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: COLORS[entry.name] || "#ccc" }}
                ></div>
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
