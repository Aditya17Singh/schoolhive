const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  complaintText: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Complaint", complaintSchema);
