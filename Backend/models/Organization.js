const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AddressSchema = new mongoose.Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true }
});

const OrganizationSchema = new mongoose.Schema(
  {
    orgName: { type: String, required: true },             
    orgEmail: { type: String, required: true },            
    phoneNumber: { type: String, required: true },          
    password: { type: String, required: true },            
    prefix: { type: String, required: true },               
    shortName: { type: String, required: true },            
    logo: { type: String },                
    address: { type: AddressSchema, required: true }, 
    admissionFee: { type: Number, default: 0 },   
    role: { type: String, default: "organization" }
  },
  { timestamps: true }
);

OrganizationSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});


module.exports = mongoose.model("Organization", OrganizationSchema);
