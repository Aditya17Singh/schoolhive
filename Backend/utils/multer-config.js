const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/students");

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Define file filter if needed
const fileFilter = (req, file, cb) => {
  cb(null, true); // Accept all files
};

const upload = multer({ storage, fileFilter });

module.exports = { upload };
