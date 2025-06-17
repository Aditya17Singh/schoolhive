const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject");

const createTeacherProfile = async (req, res) => {
  try {
    const {
      fName,
      mName,
      lName,
      dob,
      joiningDate,
      nationality,
      aadharNumber,
      panNumber,
      bloodGroup,
      phone,
      email,
      gender,
      religion,
      resLine1,
      resLine2,
      resNearbyLandmark,
      resCity,
      resDistrict,
      resState,
      resPinCode,
      permLine1,
      permLine2,
      permNearbyLandmark,
      permCity,
      permDistrict,
      permState,
      permPinCode,
      category,
      maritalStatus,
    } = req.body;

    const orgId = req.user.id;

    const newTeacher = await Teacher.create({
      fName,
      mName,
      lName,
      dob,
      joiningDate,
      nationality,
      aadharNumber,
      panNumber,
      bloodGroup,
      phone,
      email,
      gender,
      religion,
      category,
      maritalStatus,
      orgId,
      residentialAddress: {
        line1: resLine1,
        line2: resLine2,
        nearbyLandmark: resNearbyLandmark,
        city: resCity,
        district: resDistrict,
        state: resState,
        pinCode: resPinCode,
      },
      permanentAddress: {
        line1: permLine1,
        line2: permLine2,
        nearbyLandmark: permNearbyLandmark,
        city: permCity,
        district: permDistrict,
        state: permState,
        pinCode: permPinCode,
      },
      status: "pending"
    });

    res.status(201).json({ success: true, data: newTeacher });
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const assignClassToTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { assignedClass, assignedSection } = req.body;
    const orgId = req.user.id;

    const teacher = await Teacher.findOne({ _id: teacherId, orgId });
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found or unauthorized" });
    }

    const existingAssignment = await Teacher.findOne({
      _id: { $ne: teacherId },
      assignedClass,
      assignedSection,
      orgId,
    });

    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: `Class ${assignedClass} - ${assignedSection} is already assigned to another teacher.`,
      });
    }

    teacher.assignedClass = assignedClass;
    teacher.assignedSection = assignedSection;
    await teacher.save();

    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    console.error("Error assigning class to teacher:", error);
    res.status(500).json({ success: false, message: "Failed to assign class" });
  }
};

const getSubjectsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const orgId = req.user.id;

    const teacher = await Teacher.findOne({ _id: teacherId, orgId });
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found or unauthorized" });
    }

    const subjects = await Subject.find({ teacher: teacherId })
      .populate("teacher", "fName lName")
      .populate("class", "name");

    const formattedSubjects = subjects.map((subj) => ({
      _id: subj._id,
      subjectName: subj.subjectName || subj.name,
      class: subj.class?.name || subj.class || null,
      teachers: subj.teacher.map((t) => ({
        _id: t._id,
        fName: t.fName,
        lName: t.lName,
      })),
    }));

    res.json({
      success: true,
      message: "Subjects fetched successfully",
      data: formattedSubjects,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const orgId = req.user.id;
    const { status } = req.query;

    const filter = { orgId };
    if (status) {
      filter.status = status;
    }

    const teachers = await Teacher.find(filter);
    res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTeacherStatus = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { status } = req.body;
    const orgId = req.user.id;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const teacher = await Teacher.findOneAndUpdate(
      { _id: teacherId, orgId },
      { status },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found or unauthorized" });
    }

    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTeacherProfile,
  getAllTeachers,
  assignClassToTeacher,
  getSubjectsByTeacher,
  updateTeacherStatus,
};
