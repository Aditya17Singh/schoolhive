const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import Routes
const teacherRoutes = require("./routes/teacherRoute");
const academicRoutes = require("./routes/academicRoute");
const adminRoutes = require("./routes/adminRoutes");
const classRoutes = require("./routes/classRoutes");
const studentRoutes = require("./routes/studentRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const statsRoutes = require("./routes/statsRoutes");
const organizationRoutes = require("./routes/organizationRoute");
const loginRoutes = require("./routes/loginRoutes");  
const lessonRoutes = require("./routes/lessonRoute");
const scheduleRoute = require("./routes/scheduleRoute");
const timetableRoute = require("./routes/timetableRoute");
const otpRoute = require("./routes/otpRoute");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://schoolhive.vercel.app",
  "https://www.schoolhive.in" 
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

app.use("/uploads/students", express.static(path.join(__dirname, "uploads/students")));


app.use("/api/teachers", teacherRoutes);
app.use("/api/academics" , academicRoutes);
app.use("/api/lessons", lessonRoutes);
app.use('/api/admins', adminRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/schedule", scheduleRoute);
app.use("/api", loginRoutes);  
app.use("/api/timetable", timetableRoute);
app.use("/api/otp", otpRoute);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
