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
} = require("../controller/userController");
const authenticateToken = require("../middleware/authentication");
const upload = require("../middleware/uploadMiddleware");
const userRouter = express.Router();

const USER_API = "/api/user";

userRouter.get(USER_API + "/userdata", getUserData);

userRouter.post(USER_API + "/register", registerUser);

userRouter.post(USER_API + "/verify", verifyUser);

userRouter.post(USER_API + "/authenticate", authenticateUser);

userRouter.post(
  USER_API + "/updateprofile",
  upload.single("image"),
  updateUser
);

userRouter.post(USER_API + "/updateskills", updateSkills);

userRouter.post(USER_API + "/updategoal", updateGoal);

userRouter.post(USER_API + "/updatebio", updateBio);

userRouter.post(USER_API + "/updateproject", updateProject);

userRouter.post(USER_API + "/updateuserinfo", updateUserInfo);

module.exports = userRouter;
