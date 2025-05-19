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

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("teacher", "fName lName")
      .populate("class", "name");

    // Format to send teacher info as an array with 0 or 1 teacher:
   const formattedSubjects = subjects.map((subj) => ({
  _id: subj._id,
  subjectName: subj.subjectName || subj.name,
  class: subj.class?.name || subj.class || null,
  teachers: Array.isArray(subj.teacher)
    ? subj.teacher.map((t) => `${t.fName} ${t.lName}`)
    : [], // fallback in case it's not populated
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
  const { teacherIds = [], action } = req.body;

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    if (!Array.isArray(teacherIds)) {
      return res.status(400).json({ error: "teacherIds must be an array" });
    }

    // ✅ Ensure teacher array exists
    if (!Array.isArray(subject.teacher)) {
      subject.teacher = [];
    }

    if (action === "add") {
      teacherIds.forEach((id) => {
        if (!subject.teacher.includes(id)) {
          subject.teacher.push(id);
        }
      });
    } else if (action === "remove") {
      subject.teacher = subject.teacher.filter(
        (id) => !teacherIds.includes(id.toString())
      );
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    await subject.save();

    res.json({
      success: true,
      message: `Teacher(s) ${action === "add" ? "assigned" : "removed"} successfully`,
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
