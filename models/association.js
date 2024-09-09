const Project = require("./Project");
const User = require("./User");

User.hasMany(Project, {
  foreignKey: "userId",
  as: "project",
});

Project.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});


module.exports = { User, Project };
