const Notice = require("../models/Notice");


exports.getAllNotices = async (req, res) => {
  try {
    const user = req.user;

    let notices;

    if (user.role === "admin") {
      // Allow all admins to view notices regardless of permission
      notices = await Notice.find({ orgId: user.orgId }).sort({ date: -1 });
    } else if (user.role === "organization") {
      notices = await Notice.find({ orgId: user.id }).sort({ date: -1 });
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notices", error: err.message });
  }
};


exports.createNotice = async (req, res) => {
  try {
    const { role, orgId, permissions, _id } = req.user;

    if (role !== "admin" || !permissions?.includes("Notice")) {
      return res.status(403).json({ message: "Unauthorized: You don't have permission to post notices." });
    }

    const { title, description } = req.body;

    const newNotice = new Notice({
      title,
      description,
      orgId,
      issuedBy: _id,
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
