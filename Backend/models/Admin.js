// models/Admin.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'superAdmin'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  mobile: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model("Admin", AdminSchema);
