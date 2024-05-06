// const { Sequelize } = require("sequelize");
// const config = require("./config");

// const sequelize = new Sequelize(
//   config.database,
//   config.username,
//   config.password,
//   {
//     host: config.host,
//     dialect: "postgres",
//   }
// );

const { Sequelize } = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("./config");

const sequelize = new Sequelize(config[env]);

module.exports = sequelize;
