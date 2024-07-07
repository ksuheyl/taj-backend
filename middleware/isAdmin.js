eventController = require("../controller/eventController.js");

const isAdmin = (req, res) => {
  if (res.locals.user.role == "admin") {
    eventController(req, res);
  } else {
    res.status(404).send("Not Found");
  }
};

module.exports = isAdmin;
