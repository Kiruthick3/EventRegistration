const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  status: { type: String, enum: ["PENDING_OTP","CONFIRMED","CHECKED_IN"], default: "PENDING_OTP" },
  otpHash: { type: String },
  otpExpiresAt: { type: Date },
  ticketId: { type: String, unique: true, sparse: true }, 
  idCardPath: { type: String }, 
  qrToken: { type: String }, 
  checkedInAt: { type: Date }
}, { timestamps: true });

RegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });
module.exports = mongoose.model("Registration", RegistrationSchema);
