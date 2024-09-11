const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("business_optima", "batrick", "password", {
  host: "34.132.178.82",
  port: 3306,
  dialect: "mysql",
  logging: false,
});




module.exports = sequelize;
