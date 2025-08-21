const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = (roles = []) => async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No auth token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = { id: payload.sub, role: payload.role, name: payload.name };
    if (roles.length && !roles.includes(payload.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (err) {
    console.error("auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
