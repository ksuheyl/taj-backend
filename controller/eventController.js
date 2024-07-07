const express = require("express");
const router = express.Router();
const Event = require("../models/event.js");

// Etkinlik listeleme
router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Yeni etkinlik oluşturma
router.post("/", async (req, res) => {
  const { city, district, event_type, latitude, longitude } = req.body;
  try {
    await Event.create({
      city,
      district,
      event_type,
      latitude,
      longitude,
    });
    res.status(201).send("Event created");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Etkinlik düzenleme
router.put("/:id", async (req, res) => {
  const { city, district, event_type, latitude, longitude, status } = req.body;
  const { id } = req.params;

  try {
    const event = await Event.findOne({ where: { id } });
    if (!event) {
      return res.status(404).send("Event not found");
    }

    await event.update({
      city,
      district,
      event_type,
      latitude,
      longitude,
      status,
    });

    res.status(200).send("Event updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Etkinlik silme
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Event.destroy({ where: { id } });
    if (result === 0) {
      return res.status(404).send("Event not found");
    }
    res.status(200).send("Event deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
