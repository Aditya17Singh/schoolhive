const Student = require("../models/Student");
const Organization = require("../models/Organization");
const mongoose = require('mongoose');

exports.createStudent = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "No form data received" });
    }

    const orgId = req.user.id; 

    const org = await Organization.findById(orgId);
    if (!org) return res.status(404).json({ error: "Organization not found" });

    const orgName = org.orgName.replace(/\s+/g, '').toUpperCase(); 
    const {
      classId, fName, mName, lName, dob, gender, religion, nationality, category,
      admissionClass, contactNumber, email, permanentAddress, residentialAddress,
      sameAsPermanent, fatherName, fatherPhone, fatherEmail,
      motherName, motherPhone, motherEmail,
      guardianName, guardianPhone, session, aadhaarNumber, abcId
    } = req.body;

     const startYear = session.split('-')[0]; 
    // Count previous students for this org & session
    const count = await Student.countDocuments({ orgId, session });
    const nextNumber = (count + 1).toString().padStart(5, '0'); 

    const orgUID = `${orgName}${startYear}${nextNumber}`; 

    const studentData = {
      fName, mName, lName, dob, gender, religion, nationality, category,
      admissionClass, contactNumber, email, permanentAddress, residentialAddress,
      sameAsPermanent, fatherName, fatherPhone, fatherEmail,
      motherName, motherPhone, motherEmail, guardianName, guardianPhone,
      session, aadhaarNumber, abcId,
      orgUID,
      class: classId,
      orgId,
      status: 'pending' 
    };

    if (req.files) {
      if (req.files.avatar) studentData.avatar = req.files.avatar[0].path;
      if (req.files.aadharCard) studentData.aadharCard = req.files.aadharCard[0].path;
      if (req.files.previousSchoolTC) studentData.previousSchoolTC = req.files.previousSchoolTC[0].path;
      if (req.files.medicalCertificate) studentData.medicalCertificate = req.files.medicalCertificate[0].path;
      if (req.files.birthCertificate) studentData.birthCertificate = req.files.birthCertificate[0].path;
    }

    const newStudent = new Student(studentData);
    await newStudent.save();

    res.status(201).json(newStudent);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error creating student", details: err.message });
  }
};

exports.getAllStudentsForSchool = async (req, res) => {
  try {
    const orgId = req.user.id;
    if (!orgId) {
      return res.status(400).json({ message: "orgId is required" });
    }

    // Only fetch admitted students
    const students = await Student.find({ orgId, status: 'admitted' }).sort({ createdAt: -1 });

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
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          gender: "$_id",
          count: 1
        }
      }
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

    if (!['pending', 'admitted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updated = await Student.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
