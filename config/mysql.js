const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize("business_optima", "root", process.env.DB_PASSWORD, {
  host: "localhost",
  port: 3310,
  dialect: "mysql",
  logging: false,
});




module.exports = sequelize;
