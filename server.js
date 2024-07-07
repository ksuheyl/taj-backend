const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const userController = require("./controller/userController.js");
// const User = require("./models/user.js");

// const EventApplication = require("./models/eventApplication.js");
// const Event = require("./models/event.js");
const isAdmin = require("./middleware/isAdmin.js");
const cookieParser = require("cookie-parser");
const { checkUser } = require("./middleware/authMiddleware.js");
const eventController = require("./controller/eventController.js");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await User.sync({ force: false });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
testConnection();

//routes
app.use("*", checkUser);
app.use("/user", userController);
app.use("/admin", eventController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
