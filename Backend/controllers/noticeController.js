const Notice = require("../models/Notice");

exports.getAllNotices = async (req, res) => {
  try {
    // Ensure the 'schoolCode' is available in req.user (set by the verifyToken middleware)
    const { schoolCode } = req.user;  // 'schoolCode' should now be available here

    if (!schoolCode) {
      return res.status(400).json({ message: "School code is missing from user data" });
    }

    // Fetch notices filtered by the admin's schoolCode
    const notices = await Notice.find({ schoolCode });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const { schoolCode } = req.user;  // Ensure that 'req.user' contains 'schoolCode'
    const { title, description } = req.body;

    const newNotice = new Notice({
      title,
      description,
      schoolCode,  // Attach the schoolCode to the notice
      issuedBy: req.user._id,  // Assuming the admin is authenticated and we have their ID
    });

    await newNotice.save();
    res.status(201).json(newNotice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a notice by ID
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findById(id);

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    await notice.deleteOne();
    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notice" });
  }
};

exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const notice = await Notice.findByIdAndUpdate(id, { title, description }, { new: true });

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: "Error updating notice" });
  }
};
