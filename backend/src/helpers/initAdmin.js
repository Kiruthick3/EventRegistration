const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function initAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    let admin = await User.findOne({ email });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      admin = await User.create({
        name: adminName,
        email: email,
        passwordHash: hash,
        role: "ADMIN",
        bloodGroup: "O+"
      });
      console.log("Default admin created:", email);
    } else {
      console.log("Admin already exists:", email);
    }
  } catch (err) {
    console.error("Error creating default admin:", err.message);
  }
}

module.exports = initAdmin;
