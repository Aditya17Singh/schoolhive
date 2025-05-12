const Employee = require("../models/Employee");
const Lesson = require("../models/Lesson"); // Only needed if you're still handling teacher schedules

exports.createEmployee = async (req, res) => {
  try {
    const { subjects, ...employeeData } = req.body;
    const schoolId = req.user.schoolId;

    const newEmployee = new Employee({
      ...employeeData,
       schoolId,
      subjects: employeeData.role === "Teacher" ? subjects || [] : []
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role } = req.query;

    const query = {
      ...(role && { role }),
      $or: [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { employeeId: new RegExp(search, "i") }
      ]
    };

    const employees = await Employee.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Employee.countDocuments(query);

    res.json({ employees, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { subjects, ...employeeData } = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        ...employeeData,
        subjects: employeeData.role === "Teacher" ? subjects || [] : []
      },
      { new: true }
    );

    if (!updatedEmployee) return res.status(404).json({ error: "Employee not found" });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Only for teachers
exports.getTeacherSchedule = async (req, res) => {
  try {
    const lessons = await Lesson.find({ teacher: req.params.id })
      .populate("class subject")
      .lean();

    const events = lessons.map((l) => ({
      title: `${l.class.name} | ${l.subject.name}`,
      start: l.startTime,
      end: l.endTime
    }));

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
