const express = require("express");
const EventGroup = require("../models/EventGroup");
const auth = require("../middlewares/auth");

const router = express.Router();

// public: list
router.get("/", async (req, res) => {
  const groups = await EventGroup.find().sort({ name: 1 });
  res.json(groups);
});

// admin routes
router.post("/", auth(["ADMIN"]), async (req, res) => {
  try {
    const g = await EventGroup.create(req.body);
    res.status(201).json(g);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", auth(["ADMIN"]), async (req, res) => {
  try {
    const g = await EventGroup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(g);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete("/:id", auth(["ADMIN"]), async (req, res) => {
  await EventGroup.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
