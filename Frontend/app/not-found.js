"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-6xl font-bold text-blue-900">404</h1>
      <p className="text-2xl mt-4 text-gray-700">Page Not Found</p>
      <p className="mt-2 text-gray-500">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-block bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
      >
        Go back to Dashboard
      </Link>
    </div>
  );
}
