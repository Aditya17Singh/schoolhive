const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sections: {
    type: [String],
    required: true,
    default: ["A"],
    validate: [(val) => val.length > 0, "At least one section is required"],
  },
  type: {
    type: String,
    required: true,
    enum: ["pre-primary", "primary", "middle", "secondary"]
  },
  order: { type: Number, required: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  },
});

classSchema.index({ name: 1, orgId: 1 }, { unique: true });

module.exports = mongoose.model("Class", classSchema);

