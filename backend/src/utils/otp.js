const bcrypt = require("bcryptjs");

const genOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

const hashOTP = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

const verifyOTPHash = async (otp, hash) => {
  return bcrypt.compare(otp, hash);
};

module.exports = { genOTP, hashOTP, verifyOTPHash };
