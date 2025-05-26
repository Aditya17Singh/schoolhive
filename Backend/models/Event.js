const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  type: { type: String, enum: ['event', 'holiday', 'exam', 'others'], default: 'event' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
