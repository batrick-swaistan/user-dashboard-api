const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateOTP = require("../utils/otpGen");
const redisClient = require("../config/redis");
const generateToken = require("../utils/jwt");

const registerUser = async (req, res) => {
  const saltRounds = 10;

  //   console.log(req.body);

  try {
    const { firstName, lastName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const otp = await generateOTP();
    await redisClient.setEx(email, 300, otp);

    return res
      .status(201)
      .json({ message: "User registered successfully", otp });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ error: err.message });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedOtp = await redisClient.get(email);
    if (!storedOtp) return res.status(401).send("Otp expired!");

    if (storedOtp === otp) {
      const [affectedRows] = await User.update(
        { verified: true },
        { where: { email: email } }
      );

      if (affectedRows > 0) {
        return res
          .status(200)
          .json({ message: "User verified successfully!", affectedRows });
      } else {
        returnres.status(404).send("user not found");
      }
    }
  } catch (err) {
    console.log("Failed to verify user");
    return res.status(500).json({ message: err.message });
  }
};

const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ where: { email: email } });
    if (!userData) return res.status(404).send("Invalid Email ");
    if (!userData.verified) return res.status(403).send("User is not verified");

    const isPasswordMatch = bcrypt.compareSync(password, userData.password);

    if (!isPasswordMatch) return res.status(403).send("Incorrect Password");

    req.user = userData;

    const token = generateToken(userData);
    return res.status(200).json({ token, userId: userData.id });
  } catch (err) {
    console.error("Failed to login");
    return res.status(500).json({ message: err.message });
  }
};

const getUserData = async (req, res) => {
  const { userId } = req.query;
  try {
    const userData = await User.findOne({ where: { id: userId } });
    if (!userData) return res.status(404).send("No User Found");

    return res.status(200).json({ userData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, verifyUser, authenticateUser,getUserData };
