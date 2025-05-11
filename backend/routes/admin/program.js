const express = require('express');
const Program = require('../../models/Program');
const Exercise = require('../../models/Exercise');
const router  = express.Router();
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');

const parseValues = str => str.split(',').map(s => s.trim());


// CREATE new program
router.post('/', async (req, res) => {
  try {
    const newProg = await Program.create(req.body);
    res.status(201).json(newProg);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// UPDATE existing program
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const updated = await Program.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Program not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE a program
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const deleted = await Program.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Program not found' });
    res.json({ message: 'Program deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Can't delete program" });
  }
});

module.exports = router;
