const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");

dotenv.config();

const DecryptPassword = (password) => {
  const secretkey = process.env.AES_SECRET_KEY;
  const bytes = CryptoJS.AES.decrypt(password, secretkey);
  const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedPassword;
};

module.exports = DecryptPassword;
