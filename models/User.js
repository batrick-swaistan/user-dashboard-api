const { DataTypes, UUIDV1, UUIDV4 } = require("sequelize");
const sequelize = require("../config/mysql");
const Project = require("./Project");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    goal: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    profile: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    social: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    userInfo: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    skills: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

User.hasMany(Project,{
  foreignKey:"userId",
  as:"project"
})

module.exports = User;
