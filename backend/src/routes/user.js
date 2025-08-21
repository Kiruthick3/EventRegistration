const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth");

const router = express.Router();

// GET /api/admin/users -> list all users
router.get("/", auth(["ADMIN"]), async (req, res) => {
  const users = await User.find().sort({ name: 1 }).select("-passwordHash");
  res.json(users);
});

// POST /api/admin/users -> create a user
router.post("/", auth(["ADMIN"]), async (req, res) => {
  try {
    const { name, email, password, bloodGroup, role } = req.body;
    if (!name || !email || !password || !bloodGroup) return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash, bloodGroup, role: role || "USER" });
    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/admin/users/:id -> update a user
router.put("/:id", auth(["ADMIN"]), async (req, res) => {
  try {
    const { name, email, password, bloodGroup, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (role) user.role = role;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/admin/users/:id -> delete a user
router.delete("/:id", auth(["ADMIN"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne(); 
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
