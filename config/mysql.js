const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  "business_optima",
  "batrick",
  process.env.DB_PASSWORD,
  {
    host: "34.132.178.82",
    port: 3306,
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize;
