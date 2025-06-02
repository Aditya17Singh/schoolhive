const Organization = require("../models/Organization");

exports.registerOrganization = async (req, res) => {
  try {
    const {
      orgName,
      shortName,
      prefix,
      orgEmail,
      phoneNumber,
      password,
      logo,
      address,
    } = req.body;

    // Check if an organization already exists with this email
    const existingOrg = await Organization.findOne({ orgEmail });
    if (existingOrg) {
      return res.status(400).json({ message: "Organization already exists with this email" });
    }

    // Create the organization (password will be hashed via pre-save hook)
    const organization = await Organization.create({
      orgName,
      shortName,
      prefix,
      orgEmail,
      phoneNumber,
      password,
      logo,
      address,
    });

    res.status(201).json({
      message: "Organization created successfully",
      organizationId: organization._id,
      organization,
    });
  } catch (err) {
    console.error("Error in registerOrganization:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({ organization });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateAdmissionSettings = async (req, res) => {
  try {
    const { admissionOpen, admissionFee } = req.body;
    const orgId = req.user.id; // assuming token middleware sets req.user

    const updatedOrg = await Organization.findByIdAndUpdate(
      orgId,
      {
        admissionFee,
        admissionOpen,
      },
      { new: true }
    );

    if (!updatedOrg) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({
      admissionFee: updatedOrg.admissionFee,
      admissionOpen: updatedOrg.admissionOpen,
    });
  } catch (err) {
    console.error("Error updating admission settings:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAdmissionSettings = async (req, res) => {
  try {
    const orgId = req.user.id;

    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({
      admissionFee: org.admissionFee || 0,
      admissionOpen: org.admissionOpen || false,
      year: new Date().getFullYear(),
    });
  } catch (err) {
    console.error("Error fetching admission settings:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

