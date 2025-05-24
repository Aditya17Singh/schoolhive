// models/Admin.js
const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  permissions: { type: [String], default: [] },
  
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
