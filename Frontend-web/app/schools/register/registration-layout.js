"use client";

import { useRouter } from "next/navigation";

export default function RegistrationLayout({
  children,
  step,
  status,
}) {
  const router = useRouter();

  return (
    <>
      {/* Header */}
      <header className="py-4 px-4 md:px-6 border-b bg-white/50 backdrop-blur-sm sticky top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center mx-auto">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Organization Setup
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Complete the following steps to get started
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
          >
            Login Instead?
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto py-4 px-4 space-y-4">
        {/* Step Indicator */}
        <div className="flex justify-center items-center mb-6 space-x-4 text-sm font-semibold">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === s
                    ? "bg-blue-600 text-white"
                    : step > s
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > s ? "✓" : s}
              </div>
              {s !== 3 && (
                <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
              )}
            </div>
          ))}
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`p-4 mb-4 rounded-lg ${
              status.includes("Error")
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {status}
          </div>
        )}

        {/* Page Content */}
        {children}
      </div>
    </>
  );
}
