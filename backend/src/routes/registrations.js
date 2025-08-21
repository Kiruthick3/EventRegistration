const express = require("express");
const bcrypt = require("bcryptjs");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const User = require("../models/User");
const auth = require("../middlewares/auth");
const { genOTP, hashOTP, verifyOTPHash } = require("../utils/otp");
const { sendOTPEmail, sendIdCardEmail } = require("../services/mailer");
const { generateTicketId } = require("../utils/ids");
const { createIdCard } = require("../services/idcard");
const jwt = require("jsonwebtoken");

const router = express.Router();

// POST /api/registrations -> start registration
router.post("/", auth(["USER", "ADMIN"]), async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    if (!eventId) return res.status(400).json({ message: "eventId required" });

    const event = await Event.findById(eventId);
    if (!event || !event.isActive)
      return res.status(400).json({ message: "Event not available" });

    const existing = await Registration.findOne({ userId, eventId });
    if (existing) {
      return res
        .status(400)
        .json({
          message: "Already registered for this event",
          registration: existing,
        });
    }

    const otp = genOTP();
    const otpHash = await hashOTP(otp);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const reg = await Registration.create({
      userId,
      eventId,
      otpHash,
      otpExpiresAt: otpExpiry,
      status: "PENDING_OTP",
    });

    const user = await User.findById(userId);
    await sendOTPEmail(user.email, user.name, event.name, otp);

    res
      .status(201)
      .json({ message: "OTP sent to email", registrationId: reg._id });
  } catch (err) {
    console.error("register err:", err);
    res
      .status(500)
      .json({
        message: "Server error in registration",
        error: err.message,
      });
  }
});

// POST /api/registrations/verify-otp
router.post("/verify-otp", auth(["USER", "ADMIN"]), async (req, res) => {
  try {
    const { registrationId, otp } = req.body;
    const userId = req.user.id;
    if (!registrationId || !otp)
      return res
        .status(400)
        .json({ message: "registrationId and otp required" });

    const reg = await Registration.findById(registrationId)
      .populate("eventId")
      .populate("userId");
    if (!reg) return res.status(404).json({ message: "Registration not found" });
    if (String(reg.userId._id) !== String(userId))
      return res.status(403).json({ message: "Not your registration" });

    if (reg.status !== "PENDING_OTP")
      return res.status(400).json({ message: "Registration not pending" });

    if (!reg.otpHash || !reg.otpExpiresAt || reg.otpExpiresAt < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP expired, request a new one" });
    }

    const ok = await verifyOTPHash(otp, reg.otpHash);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    const confirmedCount = await Registration.countDocuments({
      eventId: reg.eventId._id,
      status: "CONFIRMED",
    });
    if (reg.eventId.capacity && confirmedCount >= reg.eventId.capacity) {
      return res.status(400).json({ message: "Event capacity reached" });
    }

    const ticketId = generateTicketId();
    const qrToken = jwt.sign(
      {
        regId: reg._id.toString(),
        userId,
        eventId: reg.eventId._id.toString(),
        ticketId,
      },
      process.env.QR_SECRET,
      { expiresIn: "7d" }
    );

    // NEW: Create ID card image + upload to Cloudinary
    const user = await User.findById(userId);
    const idCardUrl = await createIdCard({
      name: user.name,
      ticketId,
      eventName: reg.eventId.name,
      venue: reg.eventId.venue,
      bloodGroup: user.bloodGroup,
      qrToken,
    });

    reg.status = "CONFIRMED";
    reg.ticketId = ticketId;
    reg.idCardPath = idCardUrl;
    reg.qrToken = qrToken;
    reg.otpHash = undefined;
    reg.otpExpiresAt = undefined;
    await reg.save();

    await sendIdCardEmail(
      user.email,
      user.name,
      reg.eventId.name,
      ticketId,
      idCardUrl
    );

    res.json({ message: "Registration confirmed", ticketId, idCardUrl });
  } catch (err) {
    console.error("verify-otp err:", err);
    res
      .status(500)
      .json({
        message: "Server error in verify-otp",
        error: err.message,
      });
  }
});

// POST /api/registrations/resend-otp
router.post("/resend-otp", auth(["USER", "ADMIN"]), async (req, res) => {
  try {
    const { registrationId } = req.body;
    const userId = req.user.id;

    if (!registrationId)
      return res.status(400).json({ message: "registrationId required" });

    const reg = await Registration.findById(registrationId)
      .populate("eventId")
      .populate("userId");
    if (!reg) return res.status(404).json({ message: "Registration not found" });

    if (String(reg.userId._id) !== userId)
      return res.status(403).json({ message: "Not your registration" });
    if (reg.status !== "PENDING_OTP")
      return res
        .status(400)
        .json({ message: "Registration already confirmed" });

    // Generate new OTP
    const otp = genOTP();
    reg.otpHash = await hashOTP(otp);
    reg.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await reg.save();

    // Send email
    await sendOTPEmail(reg.userId.email, reg.userId.name, reg.eventId.name, otp);

    res.json({ message: "OTP resent to your email" });
  } catch (err) {
    console.error("resend-otp err:", err);
    res
      .status(500)
      .json({ message: "Server error in resend-otp", error: err.message });
  }
});

// GET /api/registrations/mine
router.get("/mine", auth(["USER", "ADMIN"]), async (req, res) => {
  try {
    const userId = req.user.id;
    const regs = await Registration.find({ userId })
      .populate("eventId")
      .sort({ createdAt: -1 });
    res.json(regs);
  } catch (err) {
    console.error("mine err:", err);
    res.status(500).json({ message: "Server error in fetching mine", error: err.message });
  }
});

// GET /api/registrations/:id/idcard
router.get("/:id/idcard", auth(["USER", "ADMIN"]), async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: "Not found" });

    if (String(req.user.id) !== String(reg.userId) && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!reg.idCardPath) return res.status(404).json({ message: "ID card not generated" });

    res.json({ url: reg.idCardPath });
  } catch (err) {
    console.error("idcard err:", err);
    res.status(500).json({ message: "Server error in idcard", error: err.message });
  }
});

module.exports = router;
