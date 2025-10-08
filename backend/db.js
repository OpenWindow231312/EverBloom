const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "anikadebeer_everbloom_db", // DB name
  "anikadebeer", // DB username (AlwaysData)
  "Anika@22", // replace with actual password
  {
    host: "mysql-anikadebeer.alwaysdata.net",
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize;
