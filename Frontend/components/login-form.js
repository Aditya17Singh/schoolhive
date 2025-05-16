"use client";

import { useState } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [role, setRole] = useState("admin");
  const [orgUid, setOrgUid] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      (role === "admin" && (!email && !orgUid || !password)) ||
      (role === "teacher" && (!phone && !orgUid || !password)) ||
      (role === "organization" && (!email || !password))
    ) {
      setError("All fields are required.");
      return;
    }

    setError("");

    let payload = { role, password };

    if (role === "admin") {
      payload = {
        emailOrOrgUid: email || orgUid,
        password,
        role,
      };
    } else if (role === "teacher") {
      payload = {
        phoneOrOrgUid: phone || orgUid,
        password,
        role,
      };
    } else if (role === "organization") {
      payload = {
        organizationEmail: email,
        password,
        role,
      };
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-800">Sign In</h2>
        {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}
        <div className="mt-4 text-center">
          <Link
            href="/schools/register/step-1"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 group relative px-5 py-2.5 text-sm font-medium text-white bg-[#003d3d] hover:bg-[#003d3d]/90 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 border border-green-200 hover:border-green-300"
          >
            <div className="relative flex items-center gap-2">
              <span>Get Started</span>
            </div>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setEmail("");
                setPhone("");
                setOrgUid("");
                setPassword("");
              }}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            >
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="organization">Organization</option>
            </select>
          </div>

          {/* Admin: Email or Organization UID */}
          {role === "admin" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email or Organization UID
                </label>
                <input
                  type="text"
                  value={email || orgUid}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setOrgUid(e.target.value);
                  }}
                  placeholder="Enter email or org UID"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            </>
          )}

          {/* Teacher: Phone or Organization UID */}
          {role === "teacher" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number or Organization UID
                </label>
                <input
                  type="text"
                  value={phone || orgUid}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setOrgUid(e.target.value);
                  }}
                  placeholder="Enter phone or org UID"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            </>
          )}

          {/* Organization: Email only */}
          {role === "organization" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Organization Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@org.com"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            </>
          )}

          {/* Password for all roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
