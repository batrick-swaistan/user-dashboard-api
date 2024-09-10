const Project = require("./Project");
const User = require("./User");

User.hasMany(Project, {
  foreignKey: "userId",
  as: "projects",
  onDelete:"CASCADE"
});

Project.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});


module.exports = { User, Project };
