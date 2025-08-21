const express = require("express");
const Event = require("../models/Event");
const auth = require("../middlewares/auth");

const router = express.Router();

// public: list events 
router.get("/", async (req, res) => {
  const { groupId } = req.query;
  const q = { isActive: true };
  if (groupId) q.groupId = groupId;
  const events = await Event.find(q).sort({ startsAt: 1 });
  res.json(events);
});

// get single
router.get("/:id", async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: "Event not found" });
  res.json(ev);
});

// admin create
router.post("/", auth(["ADMIN"]), async (req, res) => {
  const ev = await Event.create(req.body);
  res.status(201).json(ev);
});

// admin update
router.put("/:id", auth(["ADMIN"]), async (req, res) => {
  const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ev);
});

// admin delete
router.delete("/:id", auth(["ADMIN"]), async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
