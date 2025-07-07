const mongoose = require("mongoose");

const periodSchema = new mongoose.Schema({
  number: Number,
  startTime: String,
  endTime: String,   
});

module.exports = mongoose.model("Period", periodSchema);
