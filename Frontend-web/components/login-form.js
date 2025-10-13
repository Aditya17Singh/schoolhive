"use client";

import { useState } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { Mail, Lock, Phone, Building2, Loader2 } from "lucide-react";
import API from "@/lib/api";

export default function LoginForm() {
  const [role, setRole] = useState("organization");
  const [orgUid, setOrgUid] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (
  //     (role === "admin" && ((!email && !orgUid) || !password)) ||
  //     (role === "teacher" && ((!phone && !orgUid) || !password)) ||
  //     (role === "organization" && (!email || !password))
  //   ) {
  //     setError("All fields are required.");
  //     return;
  //   }

  //   setError("");
  //   setLoading(true);

  //   let payload = { role: role.toLowerCase(), password };

  //   if (role === "admin") {
  //     payload = {
  //       email: email || orgUid,
  //       password,
  //       role,
  //     };
  //   } else if (role === "teacher") {
  //     payload = {
  //       phoneOrOrgUid: phone || orgUid,
  //       password,
  //       role,
  //     };
  //   } else if (role === "organization") {
  //     payload = {
  //       organizationEmail: email,
  //       password,
  //       role,
  //     };
  //   }

  //   try {
  //     const res = await fetch("http://localhost:5001/api/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       localStorage.setItem("token", data.token);
  //       localStorage.setItem("user", JSON.stringify(data.user));
  //       router.push("/dashboard");
  //     } else {
  //       setError(data.message || "Login failed");
  //       setLoading(false);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setError("Something went wrong");
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    (role === "admin" && ((!email && !orgUid) || !password)) ||
    (role === "teacher" && ((!phone && !orgUid) || !password)) ||
    (role === "organization" && (!email || !password))
  ) {
    setError("All fields are required.");
    return;
  }

  setError("");
  setLoading(true);

  let payload = { role: role.toLowerCase(), password };

  if (role === "admin") {
    payload = {
      email: email || orgUid,
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
    const { data } = await API.post("/login", payload);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    router.push("/dashboard");
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="z-10 w-full max-w-md rounded-xl bg-white p-8 shadow-xl border border-gray-100">
        <h2 className="text-center text-3xl font-bold text-gray-800 tracking-tight">
          Sign In
        </h2>
        {error && (
          <p className="mt-3 text-center text-sm text-red-500 font-medium">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setEmail("");
                setPhone("");
                setOrgUid("");
                setPassword("");
              }}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
            >
              <option value="organization">Organization</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Admin: Email or Organization UID */}
          {role === "admin" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or Organization UID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={email || orgUid}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setOrgUid(e.target.value);
                  }}
                  placeholder="Enter email or org UID"
                  className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Teacher: Phone or Organization UID */}
          {role === "teacher" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number or Organization UID
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={phone || orgUid}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setOrgUid(e.target.value);
                  }}
                  placeholder="Enter phone or org UID"
                  className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Organization: Email only */}
          {role === "organization" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Email
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@org.com"
                  className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md py-2 text-white font-semibold shadow-md transition-all flex items-center justify-center gap-2 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing In...
              </>
            ) : (
              "SignIn"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
