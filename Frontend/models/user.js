import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["admin", "student", "employee"],
      required: true,
    },
    username: {
      type: String,
      required: function () {
        return this.role === "admin";
      },
    },
    mobile: {
      type: String,
      required: function () {
        return this.role === "admin";
      },
      unique: function () {
        return this.role === "admin";
      },
    },
    schoolCode: {
      type: String,
      required: function () {
        return this.role === "student" || this.role === "employee";
      },
    },
    admissionNumber: {
      type: String,
      required: function () {
        return this.role === "student";
      },
      unique: function () {
        return this.role === "student";
      },
    },
    employeeId: {
      type: String,
      required: function () {
        return this.role === "employee";
      },
      unique: function () {
        return this.role === "employee";
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate model registration
export default mongoose.models.User || mongoose.model("User", UserSchema);
