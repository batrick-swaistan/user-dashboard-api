const crypto = require("crypto");

const generateOTP = () => {
  const min = Math.pow(10, 6 - 1);
  const max = Math.pow(10, 6) - 1;

  return crypto.randomInt(min, max + 1).toString();
};

module.exports = generateOTP;
