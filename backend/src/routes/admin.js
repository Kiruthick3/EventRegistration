const express = require("express");
const Registration = require("../models/Registration");
const User = require("../models/User");
const Event = require("../models/Event");
const auth = require("../middlewares/auth");

const { createObjectCsvStringifier } = require("csv-writer");
const jwt = require("jsonwebtoken");

const { generateTicketId } = require("../utils/ids");
const { createIdCard } = require("../services/idcard");
const { sendIdCardEmail } = require("../services/mailer");

const path = require("path");
const fs = require("fs");

const router = express.Router();

// GET /api/admin/registrations?eventId=...
router.get("/registrations", auth(["ADMIN"]), async (req, res) => {
  const { eventId } = req.query;
  const q = {};
  if (eventId) q.eventId = eventId;
  const regs = await Registration.find(q).populate("userId").populate("eventId").sort({ createdAt: -1 });
  res.json(regs);
});

// GET /api/admin/registrations/export?eventId=...
router.get("/registrations/export", auth(["ADMIN"]), async (req, res) => {
  const { eventId } = req.query;
  if (!eventId) return res.status(400).json({ message: "eventId required" });

  const regs = await Registration.find({ eventId }).populate("userId").populate("eventId").sort({ createdAt: -1 });

  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: "ticketId", title: "TicketId" },
      { id: "name", title: "Name" },
      { id: "email", title: "Email" },
      { id: "bloodGroup", title: "BloodGroup" },
      { id: "status", title: "Status" },
      { id: "checkedInAt", title: "CheckedInAt" },
      { id: "createdAt", title: "CreatedAt" }
    ]
  });

  const records = regs.map(r => ({
    ticketId: r.ticketId || "",
    name: r.userId?.name || "",
    email: r.userId?.email || "",
    bloodGroup: r.userId?.bloodGroup || "",
    status: r.status,
    checkedInAt: r.checkedInAt ? r.checkedInAt.toISOString() : "",
    createdAt: r.createdAt.toISOString()
  }));

  const header = csvStringifier.getHeaderString();
  const body = csvStringifier.stringifyRecords(records);
  const csv = header + body;

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=registrations-${eventId}.csv`);
  res.send(csv);
});

// POST /api/admin/checkin  -> { qrToken }
router.post("/checkin", auth(["ADMIN"]), async (req, res) => {
  const { qrToken } = req.body;
  if (!qrToken) return res.status(400).json({ message: "qrToken required" });

  try {
    const payload = jwt.verify(qrToken, process.env.QR_SECRET);
    const { regId } = payload;
    const reg = await Registration.findById(regId).populate("userId").populate("eventId");
    if (!reg) return res.status(404).json({ message: "Registration not found" });

    if (reg.status === "CHECKED_IN") {
      return res.status(400).json({ message: "Already checked in", checkedInAt: reg.checkedInAt });
    }

    if (reg.status !== "CONFIRMED") {
      return res.status(400).json({ message: "Registration not confirmed" });
    }

    reg.status = "CHECKED_IN";
    reg.checkedInAt = new Date();
    await reg.save();

    res.json({ message: "Check-in successful", ticketId: reg.ticketId, name: reg.userId.name });
  } catch (err) {
    console.error("checkin err:", err.message);
    res.status(400).json({ message: "Invalid or expired QR token" });
  }
});

// DELETE /api/admin/registrations/:regId -> Remove a user registration
router.delete("/registrations/:regId", auth(["ADMIN"]), async (req, res) => {
  try {
    const { regId } = req.params;

    if (!regId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid registration ID" });
    }

    const reg = await Registration.findById(regId);
    if (!reg) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Delete associated ID card file if exists
    if (reg.idCardPath) {
      const filePath = path.resolve(reg.idCardPath);
      fs.unlink(filePath, (err) => {
        if (err) console.warn("Failed to delete ID card file:", err.message);
      });
    }

    await reg.deleteOne();
    res.json({ message: "Registration removed" });
  } catch (error) {
    console.error("Error deleting registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// POST /api/admin/registrations/add -> Add user to event manually
router.post("/registrations/add", auth(["ADMIN"]), async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = await Registration.findOne({ userId, eventId });
    if (existing) return res.status(400).json({ message: "User already registered" });

    // Generate ticket ID
    const ticketId = generateTicketId();
    const qrToken = jwt.sign(
      { userId, eventId, ticketId },
      process.env.QR_SECRET,
      { expiresIn: "7d" }
    );

    // Create ID card
    const idCardUrl = await createIdCard({
      name: user.name,
      ticketId,
      eventName: event.name,
      venue: event.venue,
      bloodGroup: user.bloodGroup,
      qrToken,
    });

    const reg = await Registration.create({
      userId,
      eventId,
      status: "CONFIRMED",
      ticketId,
      idCardPath: idCardUrl,
      qrToken
    });

    await sendIdCardEmail(user.email, user.name, event.name, ticketId, idCardUrl);

    res.json({ message: "User added to event", registration: reg });
  } catch (error) {
    console.error("Error adding registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
