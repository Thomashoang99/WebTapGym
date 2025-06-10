const express = require("express");
const auth = require("../../middleware/auth");
const Metric = require("../../models/Metric");

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filters = {};
    filters.user = req.user._id;
    if (startDate || endDate) {
      filters.date = {};
      if (startDate) filters.date.$gte = new Date(startDate);
      if (endDate)   filters.date.$lte = new Date(endDate);
    }
    const entries = await Metric.find(filters).sort({
      date: -1,
    });
    res.json(entries);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    console.log(req.body);
    const { date, weight, height } = req.body;
    const entry = await Metric.create({
      user: req.user._id,
      date: date,
      weight: weight,
      height: height,
    });
    res.status(201).json(entry);
  } catch (err) {
    console.err(err);
    res.status(500).json(err);
  }
});

// PUT to update an existing entry
router.put('/:id', auth, async (req, res) => {
  try {
    const entry = await Metric.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      req.body,
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ error: "Not found" });
    res.json(entry);
  } catch (err) {
    console.err(err);
    res.status(500).json(err);
  }
});

// DELETE an entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await Metric.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    console.err(err);
    res.status(500).json(err);
  }
});

module.exports = router;
