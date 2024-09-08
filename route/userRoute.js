const express = require("express");
const {
  registerUser,
  verifyUser,
  authenticateUser,
  getUserData,
} = require("../controller/userController");
const authenticateToken = require("../middleware/authentication");
const userRouter = express.Router();

const USER_API = "/api/user";

userRouter.post(USER_API + "/register", registerUser);

userRouter.post(USER_API + "/verify", verifyUser);

userRouter.post(USER_API + "/authenticate", authenticateUser);

userRouter.get(USER_API + "/userdata",authenticateToken, getUserData);

module.exports = userRouter;
