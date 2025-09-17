const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const auth = require("../middlewares/auth");

const router = express.Router();

// GET /api/me -> get current user's profile
router.get("/", auth(["USER", "ADMIN"]), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/me -> update current user's profile
router.put("/", auth(["USER", "ADMIN"]), async (req, res) => {
  try {
    const { name, bloodGroup, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bloodGroup: user.bloodGroup,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
