const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
    {
      sub: user.email,
      email_verified: user.verified,
      userId: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

module.exports = generateToken;
