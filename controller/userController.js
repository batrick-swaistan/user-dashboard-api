const User = require("../models/User");
const Project = require("../models/Project");
const bcrypt = require("bcryptjs");
const generateOTP = require("../utils/otpGen");
const redisClient = require("../config/redis");
const generateToken = require("../utils/jwt");
const DecryptPassword = require("../utils/decryptPassword");

const registerUser = async (req, res) => {
  const saltRounds = 10;
  try {
    const { firstName, lastName, email, password } = req.body;
    // console.log(email)

    const decryptedPassword = DecryptPassword(password);
    const hashedPassword = await bcrypt.hash(decryptedPassword, saltRounds);

    const userData = await User.findOne({ where: { email: email } });
    if (userData?.email === email) {
      const otp = generateOTP();
      await redisClient.setEx(email, 300, otp);

      return res.status(500).json({ message: "User already exists", otp });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const otp = generateOTP();
    await redisClient.setEx(email, 300, otp);

    return res.status(201).json({ message: "OTP send successfully", otp });
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
        const userData = await User.findOne({ where: { email: email } });
        const token = generateToken(userData);
        await redisClient.setEx(`Token${email}`, 6300, token);

        return res.status(200).json({
          message: "User verified successfully!",
          token,
          userId: userData.id,
        });
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

    const decryptedPassword = DecryptPassword(password);

    const isPasswordMatch = bcrypt.compareSync(
      decryptedPassword,
      userData.password
    );

    if (!isPasswordMatch) return res.status(403).send("Incorrect Password");

    req.user = userData;

    const token = generateToken(userData);

    await redisClient.setEx(`Token${email}`, 6300, token);

    return res
      .status(200)
      .json({
        message: "Authentication Successfull",
        token,
        userId: userData.id,
      });
  } catch (err) {
    console.error("Failed to login");
    return res.status(500).json({ message: err.message });
  }
};

const getUserData = async (req, res) => {
  const { userId } = req.query;
  try {
    const userData = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Project,
          as: "projects",
          attributes: ["projectId", "title", "description"],
        },
      ],
    });
    if (!userData) return res.status(404).send("No User Found");

    return res.status(200).json({ userData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  const profile = req.file ? req.file.path : null;
  const { userId, firstName, lastName, position } = req.body;

  try {
    const fieldsToUpdate = {
      firstName,
      lastName,
      profile,
      position,
    };
    // Object.keys(fieldsToUpdate).forEach((key) => {
    //   if (fieldsToUpdate[key] === undefined || fieldsToUpdate[key] === null) {
    //     delete fieldsToUpdate[key];
    //   }
    // });
    const [affectedRows] = await User.update(fieldsToUpdate, {
      where: { id: userId },
    });

    if (affectedRows > 0) {
      const userData = await User.findByPk(userId);
      return res.status(200).json({
        message: "User profile updated successfully",
        userData,
      });
    } else {
      return res
        .status(400)
        .send("Failed to update profile. User might not exist.");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const updateUserInfo = async (req, res) => {
  const { userId, userInfo, socialLinks } = req.body;
  try {
    const userData = await User.findByPk(userId);
    if (!userData) return res.status(404).send("user not found");

    const fieldsToUpdate = {};
    if (userInfo) {
      fieldsToUpdate.userInfo = userInfo;
    }
    if (socialLinks) {
      fieldsToUpdate.social = socialLinks;
    }

    if (Object.keys(fieldsToUpdate).length > 0) {
      const [updated] = await User.update(fieldsToUpdate, {
        where: { id: userId },
      });

      if (updated > 0) {
        const userData = await User.findByPk(userId);
        return res.status(200).json({ message: "Info updated", userData });
      } else {
        return res.status(500).send("Failed to update Info");
      }
    } else {
      return res.status(404).send("No fields to update");
    }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const updateSkills = async (req, res) => {
  const { userId, skills } = req.body;
  try {
    const userData = await User.findByPk(userId);
    if (!userData) return res.status(404).send("User not found");

    const [updateSkills] = await User.update(
      { skills: skills },
      { where: { id: userId } }
    );

    if (updateSkills > 0) {
      const userData = await User.findByPk(userId);
      return res.status(200).json({
        message: "Skills updated successfully",
        skills: userData.skills,
      });
    } else {
      return res.status(500).send("Failed to update the skills");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateGoal = async (req, res) => {
  const { userId, goal } = req.body;
  try {
    const [updateGoal] = await User.update(
      { goal: goal },
      { where: { id: userId } }
    );
    if (updateGoal > 0) {
      const userData = await User.findByPk(userId);
      return res.status(200).json({
        message: "Goal updated successfully",
        userGoal: userData.goal,
      });
    } else {
      return res.status(500).json({ message: "Failed to update goal" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const updateBio = async (req, res) => {
  const { userId, bio } = req.body;
  try {
    const [updateBio] = await User.update(
      { bio: bio },
      { where: { id: userId } }
    );

    if (updateBio > 0) {
      const userData = await User.findByPk(userId);

      return res
        .status(200)
        .json({ message: "Bio updated successfully", userBio: userData.bio });
    } else {
      return res.status(500).json({ message: "Failed to update bio" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const updateProject = async (req, res) => {
  const { userId, projectId, title, description } = req.body;
  try {
    const userData = await User.findOne({ where: { id: userId } });
    if (!userData) return res.status(404).send("No user found");

    let project;

    if (projectId) {
      project = await Project.findOne({
        where: { projectId: projectId, userId },
      });

      if (project) {
        (project.title = title), (project.description = description);

        const projectData = await project.save();
        return res
          .status(200)
          .json({ messgae: "Project updated successfully", projectData });
      }
    } else {
      const projectData = await Project.create({ title, description, userId });
      return res
        .status(200)
        .json({ messgae: "Project saved successfully", projectData });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.query;
  try {
    const deletedCount = await User.destroy({ where: { id: userId } });
    if (deletedCount > 0) {
      return res.status(200).json({ message: "User deleted succesfully" });
    } else {
      return res.status(500).json({ message: "unable to delete user" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  const email = req.params.email;
  // console.log(email);
  try {
    await redisClient.del(`Token${email}`);
    return res.status(200).send("User logged out");
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
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
};
