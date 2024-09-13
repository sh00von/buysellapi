// routes/halls.js
const express = require('express');
const router = express.Router();
const Hall = require('../models/Hall');

// Get all halls
router.get('/', async (req, res) => {
  try {
    const halls = await Hall.find();
    res.json(halls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new hall
router.post('/', async (req, res) => {
  const hall = new Hall({
    name: req.body.name,
  });

  try {
    const newHall = await hall.save();
    res.status(201).json(newHall);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a hall by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await Hall.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Cannot find hall' });
    }
    res.json({ message: 'Hall deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
