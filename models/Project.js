const { DataTypes, UUIDV1, UUIDV4 } = require("sequelize");
const sequelize = require("../config/mysql");
const User = require("./User.js");

const Project = sequelize.define(
  "Project",
  {
    projectId: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "projects",
    timestamps: true,
  }
);

Project.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = Project;
