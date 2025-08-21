const { customAlphabet } = require("nanoid");
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const nano = customAlphabet(alphabet, 6);

const generateTicketId = () => {
  const year = new Date().getFullYear();
  return `EVT${year}-${nano()}`;
};

module.exports = { generateTicketId };
