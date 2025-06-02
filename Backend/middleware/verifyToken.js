const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";
const ADMISSION_BYPASS_KEY = process.env.ADMISSION_BYPASS_KEY || "letmein12345";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const publicKey = req.query.public_key;

  // ✅ Allow public access to specific routes with correct public key
 const isPublicRoute =
  publicKey === ADMISSION_BYPASS_KEY &&
  (
    req.originalUrl.startsWith("/api/organization/admission/settings") ||
    req.originalUrl.startsWith("/api/classes") ||
    req.originalUrl.startsWith("/api/students") ||
    req.originalUrl.startsWith("/api/academics/active")
  );

if (isPublicRoute) {
  req.user = { id: req.query.orgId };
  return next();
}


  // 🔐 Enforce token check
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = verifyToken;
