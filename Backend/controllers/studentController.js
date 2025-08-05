const Student = require("../models/Student");
const Organization = require("../models/Organization");
const Class = require("../models/Class");

const mongoose = require("mongoose");

exports.createStudent = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "No form data received" });
    }

    const orgId = req.user.id;
    const org = await Organization.findById(orgId);
    if (!org) return res.status(404).json({ error: "Organization not found" });

    const orgName = org.orgName.replace(/\s+/g, "").toUpperCase();

    // Helper to unflatten dotted keys
    const unflatten = (data) => {
      const result = {};
      Object.entries(data).forEach(([key, value]) => {
        const keys = key.split(".");
        keys.reduce((acc, part, index) => {
          if (index === keys.length - 1) {
            acc[part] = value;
            return;
          }
          if (!acc[part]) acc[part] = {};
          return acc[part];
        }, result);
      });

      return result;
    };

    const body = unflatten(req.body);
    const {
      classId,
      fName,
      mName,
      lName,
      dob,
      gender,
      religion,
      nationality,
      category,
      admissionClass,
      contactNumber,
      email,
      permanentAddress,
      residentialAddress,
      sameAsPermanent,
      fatherName,
      fatherPhone,
      fatherEmail,
      motherName,
      motherPhone,
      motherEmail,
      guardianName,
      guardianPhone,
      session,
      aadhaarNumber,
      abcId,
    } = body;

    const startYear = session.split("-")[0];

    const classDoc = await Class.findOne({ name: admissionClass, orgId });
    if (!classDoc) {
      return res.status(404).json({ error: "Class not found" });
    }

    let selectedSection = null;
    const maxSectionCapacity = 30;

    for (const sec of classDoc.sections) {
      const count = await Student.countDocuments({
        orgId,
        admissionClass,
        section: sec,
        session,
        status: { $in: ["pending", "admitted"] },
      });

      if (count < maxSectionCapacity) {
        selectedSection = sec;
        break;
      }
    }

    if (!selectedSection) {
      return res.status(400).json({ error: "All sections for this class are full." });
    }

    const rollCount = await Student.countDocuments({
      orgId,
      admissionClass,
      section: selectedSection,
      session,
      status: { $in: ["pending", "admitted"] },
    });

    const rollNumber = rollCount + 1;

    // Calculate total file size
    if (req.files) {
      let totalSize = 0;
      for (const field in req.files) {
        req.files[field].forEach((file) => {
          totalSize += file.size;
        });
      }

      const maxTotalSize = 10 * 1024 * 1024; // 10 MB total
      if (totalSize > maxTotalSize) {
        return res.status(400).json({
          error: "Total uploaded file size exceeds 10MB limit",
        });
      }
    }

    // Retry logic for unique orgUID
    const MAX_ATTEMPTS = 5;
    let attempt = 0;
    let newStudent;
    let saved = false;

    while (!saved && attempt < MAX_ATTEMPTS) {
      try {
        const count = await Student.countDocuments({ orgId, session });
        const nextNumber = (count + 1 + attempt).toString().padStart(5, "0");
        const orgUID = `${orgName}${startYear}${nextNumber}`;

        const studentData = {
          fName,
          mName,
          lName,
          dob,
          gender,
          religion,
          nationality,
          category,
          admissionClass,
          contactNumber,
          email,
          permanentAddress,
          residentialAddress,
          sameAsPermanent,
          fatherName,
          fatherPhone,
          fatherEmail,
          motherName,
          motherPhone,
          motherEmail,
          guardianName,
          guardianPhone,
          session,
          aadhaarNumber,
          abcId,
          orgUID,
          rollNumber,
          class: classId,
          section: selectedSection,
          orgId,
          status: "pending",
        };

        newStudent = new Student(studentData);
        await newStudent.save();
        saved = true;
      } catch (err) {
        if (err.code === 11000 && err.message.includes("orgUID")) {
          attempt++; // try again
        } else {
          throw err;
        }
      }
    }

    if (!saved) {
      return res.status(500).json({
        error: "Failed to generate unique orgUID after multiple attempts.",
      });
    }

    res.status(201).json(newStudent);
  } catch (err) {
    console.error(err);
    res.status(400).json({
      error: "Error creating student",
      details: err.message,
    });
  }
};

exports.getAllStudentsForSchool = async (req, res) => {
  try {
    const orgId = req.user.id;
    if (!orgId) {
      return res.status(400).json({ message: "orgId is required" });
    }

    // Only fetch admitted students
    const students = await Student.find({ orgId, status: "admitted" }).sort({
      createdAt: -1,
    });

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", details: error.message });
  }
};

exports.getGenderDistribution = async (req, res) => {
  try {
    const orgId = req.user.id;

    if (!orgId) {
      return res.status(400).json({ message: "orgId is required" });
    }

    const genderDistribution = await Student.aggregate([
      { $match: { orgId: new mongoose.Types.ObjectId(orgId) } },
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          gender: "$_id",
          count: 1,
        },
      },
    ]);

    res.status(200).json({ genderDistribution });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", details: error.message });
  }
};

exports.updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "admitted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updated = await Student.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

exports.getAllStudent = async (req, res) => {
  try {
    const orgId = req.user.id;
    if (!orgId) {
      return res.status(400).json({ message: "orgId is required" });
    }

    const students = await Student.find({
      orgId,
      status: { $in: ["pending", "admitted", "rejected"] },
    }).sort({ createdAt: -1 });

    res.json(students);
  } catch (err) {
    console.error("Error fetching admissions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudentStats = async (req, res) => {
  try {
    const orgId = req.user.id;

    if (!orgId) {
      return res.status(400).json({ message: "orgId is required" });
    }

    const stats = await Student.aggregate([
      { $match: { orgId: new mongoose.Types.ObjectId(orgId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      total: 0,
      pending: 0,
      admitted: 0,
      rejected: 0,
    };

    stats.forEach((stat) => {
      result.total += stat.count;
      result[stat._id] = stat.count;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error", details: error.message });
  }
};

exports.promoteStudents = async (req, res) => {
  try {
    const { studentIds, newClassId, newSection } = req.body;

    if (!studentIds || !newClassId || !newSection) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const classDoc = await Class.findById(newClassId);
    if (!classDoc) {
      return res.status(404).json({ error: "Target class not found" });
    }

    // Get current data for all selected students
    const students = await Student.find({ _id: { $in: studentIds } });

    // Filter out students already in the same class and section
    const studentsToPromote = students.filter(
      (student) =>
        student.admissionClass !== classDoc.name ||
        student.section !== newSection
    );

    if (studentsToPromote.length === 0) {
      return res
        .status(400)
        .json({ error: "No students need promotion. All are already in this class and section." });
    }

    const idsToPromote = studentsToPromote.map((s) => s._id);

    const updated = await Student.updateMany(
      { _id: { $in: idsToPromote } },
      {
        $set: {
          admissionClass: classDoc.name,
          section: newSection,
          class: newClassId,
        },
      }
    );

    res.status(200).json({
      message: `Promoted ${updated.modifiedCount} student(s)`,
      skipped: studentIds.length - idsToPromote.length,
    });
  } catch (error) {
    console.error("Promote error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

exports.getStudentsByClassAndSection = async (req, res) => {
  try {
    const orgId = req.user.id;
    const { classId, section } = req.query;

    if (!orgId || !classId || !section) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // fetch class name based on classId (because admissionClass is a string)
    const classDoc = await Class.findById(classId);
    if (!classDoc) return res.status(404).json({ error: "Class not found" });
    const students = await Student.find({
      orgId,
      admissionClass: classDoc.name,
      section,
      status: "admitted",
    }).sort({ createdAt: -1 });

    console.log(students, classDoc.name, section, orgId, "students");
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

exports.getStudentByOrgUID = async (req, res) => {
  try {
    const { orgUID } = req.params;

    const student = await Student.findOne({ orgUID });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student by orgUID:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const orgId = req.user.id;

    const student = await Student.findOne({ _id: studentId, orgId });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const updatableFields = [
      "fName", "mName", "lName", "dob", "gender", "religion", "nationality",
      "category", "admissionClass", "contactNumber", "email",
      "permanentAddress", "residentialAddress", "sameAsPermanent",
      "fatherName", "fatherPhone", "fatherEmail",
      "motherName", "motherPhone", "motherEmail",
      "guardianName", "guardianPhone", "aadhaarNumber", "abcId",
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    if (req.files) {
      if (req.files.avatar) student.avatar = req.files.avatar[0].path;
      if (req.files.aadharCard) student.aadharCard = req.files.aadharCard[0].path;
      if (req.files.previousSchoolTC) student.previousSchoolTC = req.files.previousSchoolTC[0].path;
      if (req.files.medicalCertificate) student.medicalCertificate = req.files.medicalCertificate[0].path;
      if (req.files.birthCertificate) student.birthCertificate = req.files.birthCertificate[0].path;
    }

    await student.save();

    res.status(200).json({ message: "Student updated successfully", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating student", details: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error deleting student", details: err.message });
  }
};
