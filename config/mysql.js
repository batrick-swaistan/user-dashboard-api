const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize("business_optima", "root", "Myma@2001", {
  host: "localhost",
  port: 3310,
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
