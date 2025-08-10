const Subject = require("../models/Subject");

exports.createSubject = async (req, res) => {
  try {
    const orgId = req.user.id;
    if (!orgId) return res.status(400).json({ error: "Organization ID missing" });

    const subjectData = { ...req.body, orgId };

    const subject = new Subject(subjectData);
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAllSubjects = async (req, res) => {
  try {
    const orgId = req.user.id;   
    if (!orgId) {
      return res.status(400).json({ error: "Organization ID missing" });
    }

    const subjects = await Subject.find({ orgId })
      .populate("teacher", "fName lName")
      .populate("class", "name");

    // ... rest of your formatting code
    const formattedSubjects = subjects.map((subj) => ({
      _id: subj._id,
      subjectName: subj.subjectName || subj.name,
      class: subj.class?.name || subj.class || null,
      teachers: Array.isArray(subj.teacher)
        ? subj.teacher.map((t) => ({ _id: t._id, fName: t.fName, lName: t.lName }))
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
  const { add = [], remove = [] } = req.body;

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    if (!Array.isArray(subject.teacher)) {
      subject.teacher = [];
    }

    add.forEach((id) => {
      if (!subject.teacher.includes(id)) {
        subject.teacher.push(id);
      }
    });

    subject.teacher = subject.teacher.filter(
      (id) => !remove.includes(id.toString())
    );

    await subject.save();

    res.json({
      success: true,
      message: "Teacher assignments updated successfully",
      data: subject,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate("teacher", "firstName lastName")
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

exports.getSubjectsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const orgId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ success: false, message: "Invalid teacher ID" });
    }

    const teacherObjId = new mongoose.Types.ObjectId(teacherId);

    const subjects = await Subject.find({ teacher: teacherObjId, orgId })
      .populate("teacher", "fName lName")
      .populate("class", "name");
    console.log(subjects, 'subjects')
    const formatted = subjects.map(s => ({
      _id: s._id,
      subjectName: s.subjectName || s.name,
      class: s.class?.name || null,
      teachers: Array.isArray(s.teacher)
        ? s.teacher.map(t => ({
            _id: t._id,
            fName: t.fName,
            lName: t.lName
          }))
        : []
    }));

    res.json({
      success: true,
      message: "Subjects fetched successfully",
      data: formatted
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
