const express = require('express');
const router  = express.Router();
const Program = require('../../models/Program');
const Progress = require('../../models/Progress');
const auth    = require('../../middleware/auth');


router.get('/:id/progress', auth, async (req, res) => {
  try {
    const progId = req.params.id;
    let pp = await Progress.findOne({
      user: req.user._id,
      program: progId
    });
    if (!pp) {
      return res.json({ notes: '', progress: 0 });
    }
    res.json({
      notes:    pp.notes,
      progress: pp.progress
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch progress' });
  }
});

router.put('/:id/progress', auth, async (req, res) => {
  try {
    const progId = req.params.id;
    const { notes, progress } = req.body;
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
    const pp = await Progress.findOneAndUpdate(
      { user: req.user._id, program: progId },
      { notes, progress },
      opts
    );
    res.json({
      notes:    pp.notes,
      progress: pp.progress
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save progress' });
  }
});

module.exports = router;
