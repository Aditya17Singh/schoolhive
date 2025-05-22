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

    const orgID = req.user.id;

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
      orgID,
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
    const orgID = req.user.id;

    const teacher = await Teacher.findOne({ _id: teacherId, orgID });

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found or unauthorized" });
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

const getAllTeachers = async (req, res) => {
  try {
    const orgID = req.user.id;
    const teachers = await Teacher.find({ orgID });

    res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSubjectsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const orgID = req.user.id;

    const teacher = await Teacher.findOne({ _id: teacherId, orgID });
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

module.exports = {
  createTeacherProfile,
  getAllTeachers,
  assignClassToTeacher,
  getSubjectsByTeacher,
};
