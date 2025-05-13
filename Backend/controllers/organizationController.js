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
