const Subject = require("../models/Subject");

exports.createSubject = async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// exports.getAllSubjects = async (req, res) => {
//   try {
//     const subjects = await Subject.find()
//       .populate("employee", "firstName lastName")
//       .populate("class", "name"); 

//     const formattedSubjects = subjects.map((subj) => ({
//       _id: subj._id,
//       subjectName: subj.name,
//       class: subj.class?.name || null, 
//       teachers: subj.employee
//         ? [`${subj.employee.firstName} ${subj.employee.lastName}`]
//         : [], 
//     }));

//     res.json({
//       success: true,
//       message: "Subjects found successfully",
//       data: formattedSubjects,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("employee", "firstName lastName")
      .populate("class", "name");

    // Format to send teacher info as an array with 0 or 1 teacher:
    const formattedSubjects = subjects.map((subj) => ({
      _id: subj._id,
      subjectName: subj.subjectName || subj.name, // fix field name
      class: subj.class?.name || subj.class || null,
      teachers: subj.employee
        ? [`${subj.employee.firstName} ${subj.employee.lastName}`]
        : [],
    }));

    res.json({
      success: true,
      message: "Subjects found successfully",
      data: formattedSubjects,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.assignOrRemoveTeacher = async (req, res) => {
  const subjectId = req.params.id;
  const { teacherId } = req.body;

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    // Assign or remove teacher
    subject.employee = teacherId || null; // if no teacherId sent, removes assignment
    await subject.save();

    res.json({
      success: true,
      message: teacherId
        ? "Teacher assigned to subject successfully"
        : "Teacher removed from subject successfully",
      data: subject,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate("employee", "firstName lastName")
      .populate("class");
    if (!subject) return res.status(404).json({ error: "Subject not found" });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Subject not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const deleted = await Subject.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Subject not found" });
    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
