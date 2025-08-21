const { createCanvas, loadImage } = require("canvas");
const QRCode = require("qrcode");
const { uploadToCloudinary } = require("../config/cloudinary");

/**
 * Create an ID card image and upload to Cloudinary.
 * @param {Object} opts
 * @param {string} opts.name - User full name
 * @param {string} opts.ticketId - Ticket ID
 * @param {string} opts.eventName - Event name
 * @param {string} opts.venue - Venue
 * @param {string} opts.bloodGroup - Blood group (optional)
 * @param {string} opts.qrToken - Signed QR token
 * @returns {Promise<string>} Cloudinary URL of the ID card
 */
async function createIdCard({ name, ticketId, eventName, venue, bloodGroup, qrToken }) {
  // Card size
  const width = 600;
  const height = 350;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#f8fafc"; 
  ctx.fillRect(0, 0, width, height);

  // Title bar
  ctx.fillStyle = "#3b2244ff"; 
  ctx.fillRect(0, 0, width, 60);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px Sans-serif";
  ctx.fillText("EVENT ID CARD", 20, 40);

  // Event details
  ctx.fillStyle = "#000000";
  ctx.font = "20px Sans-serif";
  ctx.fillText(`Event: ${eventName}`, 20, 100);
  ctx.fillText(`Venue: ${venue}`, 20, 130);

  // User details
  ctx.fillText(`Name: ${name}`, 20, 180);
  ctx.fillText(`Ticket ID: ${ticketId}`, 20, 210);
  if (bloodGroup) ctx.fillText(`Blood Group: ${bloodGroup}`, 20, 240);

  // QR Code
  const qrDataUrl = await QRCode.toDataURL(qrToken, { width: 150, margin: 1 });
  const qrImage = await loadImage(qrDataUrl);
  ctx.drawImage(qrImage, width - 180, 120, 150, 150);

  // Convert to buffer (PNG)
  const buffer = canvas.toBuffer("image/png");

  // Upload to Cloudinary
  const url = await uploadToCloudinary(buffer, ticketId);

  return url;
}

module.exports = { createIdCard };
