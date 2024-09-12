const express = require("express");
const {
  registerUser,
  verifyUser,
  authenticateUser,
  getUserData,
  updateGoal,
  updateBio,
  updateProject,
  updateUserInfo,
  updateUser,
  updateSkills,
  deleteUser,
  logout,
  chatResponse,
} = require("../controller/userController");
const authenticateToken = require("../middleware/authentication");
const upload = require("../middleware/uploadMiddleware");
const userRouter = express.Router();

const USER_API = "/api/user";

userRouter.get(USER_API + "/userdata", authenticateToken, getUserData);

userRouter.post(USER_API + "/register", registerUser);

userRouter.post(USER_API + "/verify", verifyUser);

userRouter.post(USER_API + "/authenticate", authenticateUser);

userRouter.post(
  USER_API + "/updateprofile",
  authenticateToken,
  upload.single("image"),
  updateUser
);

userRouter.post(USER_API + "/updateskills", authenticateToken, updateSkills);

userRouter.post(USER_API + "/updategoal", authenticateToken, updateGoal);

userRouter.post(USER_API + "/updatebio", authenticateToken, updateBio);

userRouter.post(USER_API + "/updateproject", authenticateToken, updateProject);

userRouter.post(
  USER_API + "/updateuserinfo",
  authenticateToken,
  updateUserInfo
);

userRouter.post(USER_API + "/logout/:email", authenticateToken, logout);

userRouter.delete(USER_API + "/deletemyaccount", authenticateToken, deleteUser);

module.exports = userRouter;
