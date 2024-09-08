const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(404).send("In-valid Token");
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  if (token == null) return res.status(401).send("Invalid Token");

  jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
    if(err) return res.status(403).send("Un-authorised");

    req.user = user;

    next();
  })
};

module.exports = authenticateToken;
