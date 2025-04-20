const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  schoolCode: { type: String, required: true },
});

module.exports = mongoose.model("Notice", noticeSchema);
