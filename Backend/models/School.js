const mongoose = require("mongoose");
const { Schema } = mongoose;

const SchoolSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true, index: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String },
  address: { type: String },
  status: { type: String, enum: ['approved'], default: 'approved' }, 
}, { timestamps: true });

module.exports = mongoose.model("School", SchoolSchema);
