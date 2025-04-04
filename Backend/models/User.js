const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  role: { type: String, enum: ["admin", "student", "employee"], required: true },

  // Common fields
  password: { type: String, required: true },

  // Admin-specific fields
  mobile: { type: String, unique: true, sparse: true },
  username: { type: String, unique: true, sparse: true },

  // Student-specific fields
  schoolCode: { type: String, sparse: true },
  admissionNumber: { type: String, unique: true, sparse: true },

  // Employee-specific fields
  employeeID: { type: String, unique: true, sparse: true },
});

module.exports = mongoose.model("User", UserSchema);
