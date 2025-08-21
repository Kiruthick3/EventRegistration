const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  bloodGroup: { type: String, enum: ["A+","A-","B+","B-","O+","O-","AB+","AB-"], required: true },
}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true });
module.exports = mongoose.model("User", UserSchema);
