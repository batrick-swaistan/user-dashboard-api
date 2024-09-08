const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("business_optima", "root", "password", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});




module.exports = sequelize;
