"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function AdmissionSettingsCard() {
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(null);
  const [admissionFee, setAdmissionFee] = useState(0);
  const [editingFee, setEditingFee] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeAcademicYear, setActiveAcademicYear] = useState("");

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

  return (
    <div className="flex flex-wrap gap-4 mt-4 ">
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
  );
}
