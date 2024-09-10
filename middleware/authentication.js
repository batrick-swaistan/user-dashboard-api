const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const redisClient = require("../config/redis");

dotenv.config();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(404).send("In-valid Token");
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  if (token == null) return res.status(401).send("Invalid Token");

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).send("Un-authorised");

    req.user = user;

    const email = user.sub;
    // console.log(user)
    const tokenFromRedis = await redisClient.get(`Token${email}`);
    // console.log(tokenFromRedis);
    if (tokenFromRedis !== token) return res.status(401).send("Invalid Token");

    next();
  });
};

module.exports = authenticateToken;
