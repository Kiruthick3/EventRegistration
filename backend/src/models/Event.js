const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "EventGroup", required: true },
  name: { type: String, required: true },
  venue: { type: String, required: true },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  capacity: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true },
  description: { type: String, default: "" },
  isFree: { type: Boolean, default: true },
  cost: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
