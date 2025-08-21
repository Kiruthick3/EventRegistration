const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send OTP email
const sendOTPEmail = async (to, name, eventName, otp) => {
  const html = `<p>Hi ${name},</p>
    <p>Your OTP for registering to <b>${eventName}</b> is <b>${otp}</b>. It expires in 10 minutes.</p>`;
  await transporter.sendMail({
    from: `"Event Desk" <${process.env.SMTP_USER}>`,
    to,
    subject: `OTP for ${eventName}`,
    html
  });
};

// Send ID card email (Cloudinary PNG)
const sendIdCardEmail = async (to, name, eventName, ticketId, idCardUrl) => {
  const html = `<p>Hi ${name},</p>
    <p>Your registration is confirmed for <b>${eventName}</b>. Ticket ID: <b>${ticketId}</b></p>
    <p>Here is your ID card. Keep it safe for entry.</p>
    <p><img src="${idCardUrl}" alt="ID Card" style="width:300px"/></p>`;
  
  await transporter.sendMail({
    from: `"Event Desk" <${process.env.SMTP_USER}>`,
    to,
    subject: `Your ID Card — ${eventName}`,
    html
  });
};

module.exports = { transporter, sendOTPEmail, sendIdCardEmail };
