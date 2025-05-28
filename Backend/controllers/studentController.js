const Student = require("../models/Student"); 

exports.createStudent = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "No form data received" });
    }

    const orgId = req.user.id; 
    const {
      classId, fName, mName, lName, dob, gender, religion, nationality, category,
      admissionClass, contactNumber, email, permanentAddress, residentialAddress,
      sameAsPermanent, fatherName, fatherPhone, fatherEmail,
      motherName, motherPhone, motherEmail,
      guardianName, guardianPhone, session, aadhaarNumber, abcId
    } = req.body;

    const studentData = {
      fName, mName, lName, dob, gender, religion, nationality, category,
      admissionClass, contactNumber, email, permanentAddress, residentialAddress,
      sameAsPermanent, fatherName, fatherPhone, fatherEmail,
      motherName, motherPhone, motherEmail, guardianName, guardianPhone,
      session, aadhaarNumber, abcId,
      class: classId,
      orgId 
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

    const students = await Student.find({ orgId })
      .populate("class", "name section") 
      .sort({ createdAt: -1 });

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", details: error.message });
  }
};