const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  try {
    const { title, description, start, end, type, orgId, createdBy } = req.body;
    const newEvent = await Event.create({ title, description, start, end, type, orgId, createdBy });

    res.status(201).json({ success: true, data: newEvent });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating event" });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { orgId } = req.params;
    const events = await Event.find({ orgId });
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching events" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { title, description, start, end, type, orgId, createdBy } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, start, end, type, orgId, createdBy },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, data: updatedEvent });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating event" });
  }
};


exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting event" });
  }
};
