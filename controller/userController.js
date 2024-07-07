const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const EventApplication = require("../models/eventApplication.js");
const Event = require("../models/event.js");

//yeni kullanıcı oluşturma
router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;

    const doubleRegister = await User.findOne({ where: { email } });
    if (doubleRegister) {
      return res.status(400).json({ error: "Email address is invalid" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json();
  }
});

//kullanıcı giriş
router.post("/login", async (req, res) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid e-mail or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid e-mail or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json();
  }
});

//etkinlik ilisteleme
router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

//etkinlik başvuru
router.post("/apply", async (req, res) => {
  try {
    const { user_id, event_id } = req.body;
    const user = await User.findByPk(user_id);
    const event = await Event.findByPk(event_id);

    if (!user || !event) {
      return res.status(400).json({ error: "Invalid user or event ID" });
    }

    const existingApplication = await EventApplication.findOne({
      where: { user_id, event_id },
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ error: "User has already applied for this event" });
    }

    const newApplication = await EventApplication.create({
      user_id,
      event_id,
    });

    res.status(201).json(newApplication);
  } catch (error) {
    console.log(error);
    res.status(500).json();
  }
});

module.exports = router;
