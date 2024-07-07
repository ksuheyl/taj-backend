const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

const EventApplication = sequelize.define("EventApplication", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "events",
      key: "id",
    },
  },
});

module.exports = EventApplication;
