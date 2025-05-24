"use client";

import { useState, useEffect, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import API from "@/lib/api";
import * as Popover from "@radix-ui/react-popover";

export default function Admins() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [admins, setAdmins] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const permissions = [
    "Library",
    "Notice",
    "Exam",
    "Teacher Registration",
    "Manage Admins",
    "Attendance",
    "Fees",
  ];

  const schoolPrefix = useMemo(() => {
    try {
      const org = JSON.parse(localStorage.getItem("user") || "{}");
      return org.name?.split(" ")[0]?.toUpperCase() || "SCH";
    } catch {
      return "SCH";
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const togglePermission = (adminId, perm) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) => {
        if (admin.id !== adminId) return admin;
        const has = admin.permissions.includes(perm);
        const newPerms = has
          ? admin.permissions.filter((p) => p !== perm)
          : [...admin.permissions, perm];
        return { ...admin, permissions: newPerms, unsaved: true };
      })
    );
  };

  const savePermissions = async (adminId) => {
    const admin = admins.find((a) => a.id === adminId);
    const original = await API.get("/admins");

    const realAdmin = original.data.find((a) => a.email === admin.email);

    try {
      await API.put(`/admins/${realAdmin._id}/permissions`, {
        permissions: admin.permissions,
      });
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === adminId ? { ...a, unsaved: false, justSaved: true } : a
        )
      );

      setTimeout(() => {
        setAdmins((prev) =>
          prev.map((a) => (a.id === adminId ? { ...a, justSaved: false } : a))
        );
      }, 1500);
    } catch (err) {
      console.error("Permission save failed", err.message);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await API.get("/admins");
      const data = res.data;
      setAdmins(
        data.map((admin, index) => ({
          id: `${schoolPrefix}${String(index + 1).padStart(6, "0")}`,
          name: `${admin.firstName} ${admin.middleName || ""} ${
            admin.lastName
          }`.trim(),
          email: admin.email,
          phone: admin.phone,
          permissions: admin.permissions || [], 
          showPermissionsPopover: false, 
        }))
      );
    } catch (err) {
      console.error("Fetch admins error:", err.message);
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(search.toLowerCase())
  );

  const allSelected =
    filteredAdmins.length > 0 &&
    filteredAdmins.every((admin) => selectedIds.has(admin.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      // Unselect all filtered
      const newSelected = new Set(selectedIds);
      filteredAdmins.forEach((admin) => newSelected.delete(admin.id));
      setSelectedIds(newSelected);
    } else {
      // Select all filtered
      const newSelected = new Set(selectedIds);
      filteredAdmins.forEach((admin) => newSelected.add(admin.id));
      setSelectedIds(newSelected);
    }
  };

  const toggleSelectOne = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const isDeleteEnabled = selectedIds.size > 0;

  const handleDelete = () => {
    // After delete, clear selection
    setSelectedIds(new Set());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { firstName, middleName, lastName, email, phone, address } = formData;

    if (!firstName || !lastName || !email || !phone) {
      setError("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await API.post("/admins", {
        orgId: user?.id,
        firstName,
        middleName,
        lastName,
        email,
        phone,
        address,
      });

      await fetchAdmins();
      setOpen(false);
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create admin"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex gap-2 flex-grow max-w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Admin..."
            className="flex-grow h-10 rounded-md border border-gray-400 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-1 whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            + New Admin
          </button>
        </div>

        {/* Delete Selected */}
        <div>
          <button
            type="button"
            disabled={!isDeleteEnabled}
            onClick={handleDelete}
            className={`flex items-center gap-1 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium shadow-sm transition ${
              isDeleteEnabled
                ? "bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                : "bg-red-300 text-red-700 cursor-not-allowed"
            }`}
          >
            Delete Selected
          </button>
        </div>
      </div>

      {/* Admins Table */}
      <div className="mt-6 overflow-x-auto rounded-md border border-gray-300">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="w-10 p-2 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all admins"
                  className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="p-2 text-left font-medium">Organization UID</th>
              <th className="p-2 text-left font-medium">Admin Name</th>
              <th className="p-2 text-left font-medium">Email Address</th>
              <th className="p-2 text-left font-medium">Phone Number</th>
              <th className="p-2 text-left font-medium">Permissions</th>
              <th className="p-2 text-left font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAdmins.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No admins found.
                </td>
              </tr>
            )}

            {filteredAdmins.map((admin) => (
              <tr
                key={admin.id}
                className="border-b bg-white hover:bg-blue-50 transition-colors"
              >
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(admin.id)}
                    onChange={() => toggleSelectOne(admin.id)}
                    aria-label={`Select admin ${admin.name}`}
                    className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">{admin.id}</td>
                <td className="p-2">{admin.name}</td>
                <td className="p-2">{admin.email}</td>
                <td className="p-2">{admin.phone}</td>
                <td className="p-2 relative">
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button className="flex flex-wrap gap-1 px-2 py-1 border rounded bg-white hover:bg-gray-100">
                        {admin.permissions.length === 0 ? (
                          <span className="text-xs text-gray-500 cursor-pointer">
                            Select Permissions
                          </span>
                        ) : (
                          admin.permissions.map((perm, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 capitalize"
                            >
                              {perm}
                            </span>
                          ))
                        )}
                      </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        side="bottom"
                        align="start"
                        className="z-50 w-48 rounded-md border bg-white shadow-lg p-2 space-y-1"
                        sideOffset={4}
                      >
                        {permissions.map((perm) => (
                          <label
                            key={perm}
                            className="flex items-center space-x-2 px-2 py-1 text-sm hover:bg-gray-100 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={admin.permissions.includes(perm)}
                              onChange={() => togglePermission(admin.id, perm)}
                              className="accent-blue-600"
                            />
                            <span>{perm}</span>
                          </label>
                        ))}
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                  {admin.unsaved && (
                    <button
                      onClick={() => savePermissions(admin.id)}
                      className="mt-2 text-xs cursor-pointer text-blue-600 hover:underline"
                    >
                      Save Permissions
                    </button>
                  )}
                  {admin.justSaved && (
                    <span className="ml-2 text-xs text-green-600">
                      ✔ Saved!
                    </span>
                  )}
                </td>

                <td className="p-2">
                  <button
                    onClick={() =>
                      alert(`Deleting admin ${admin.name} (id: ${admin.id})`)
                    }
                    className="rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Admin Dialog */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/20" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg focus:outline-none">
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="absolute right-4 top-4 rounded-md bg-gray-200 px-2 py-1 text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ×
              </button>
            </Dialog.Close>

            <Dialog.Title className="mb-2 text-xl font-semibold text-gray-800">
              New Admin
            </Dialog.Title>
            <Dialog.Description className="mb-6 text-sm text-gray-500">
              Add a new admin to your organization
            </Dialog.Description>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "First", name: "firstName" },
                  { label: "Middle", name: "middleName" },
                  { label: "Last", name: "lastName" },
                ].map(({ label, name }) => (
                  <div key={name} className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">
                      {label} Name
                    </label>
                    <input
                      type="text"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="rounded-md border border-gray-400 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="sandeep@gmail.com"
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0123456789"
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="ABC 1st Street"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Profile Photo */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">
                  Profile Photo
                </label>
                <input
                  type="file"
                  name="profilePhoto"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-white hover:file:bg-blue-700"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
