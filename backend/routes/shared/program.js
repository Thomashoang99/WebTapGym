const express = require('express');
const router  = express.Router();
const Program = require('../../models/Program');
const Purchase = require('../../models/Purchase');
const optionalAuth = require('../../middleware/optionalAuth');

const parseValues = str => str.split(',').map(s => s.trim());

router.get('/', optionalAuth, async (req, res) => {
  try {
    let {
      keywords,
      difficulty,
      durationMin, durationMax,
      isPaid,
      priceMin, priceMax,
      page = 1, limit = 10,
      sortBy = 'createdAt', sortOrder = 'desc'
    } = req.query;

    const filter = {};

    if (keywords) {
      const kw = parseValues(keywords);
      filter.$and = kw.map(k => ({
        $or: [
          { name:        { $regex: k, $options: 'i' } },
          { description: { $regex: k, $options: 'i' } }
        ]
      }));
    }

    if (difficulty) {
      filter.difficulty = { $in: parseValues(difficulty) };
    }

    if (durationMin || durationMax) {
      filter.duration = {};
      if (durationMin) filter.duration.$gte = parseInt(durationMin, 10);
      if (durationMax) filter.duration.$lte = parseInt(durationMax, 10);
    }

    if (typeof isPaid !== 'undefined') {
      filter.isPaid = (isPaid === 'true');
    }

    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = parseFloat(priceMin);
      if (priceMax) filter.price.$lte = parseFloat(priceMax);
    }

    page  = parseInt(page, 10);
    limit = Math.min(parseInt(limit, 10), 100);
    const skip = (page - 1) * limit;
    const dir  = sortOrder === 'asc' ? 1 : -1;
    const validSortFields = ['name', 'createdAt', 'duration', 'price'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const total    = await Program.countDocuments(filter);
    const programs = await Program.find(filter)
      .sort({ [sortField]: dir, _id: dir })
      .skip(skip)
      .limit(limit);

    let purchasedSet = new Set();
    if (req.user && req.user._id) {
      const purchases = await Purchase.find({
        user:    req.user._id,
        program: { $in: programs.map(p => p._id) },
        status: 'completed'
      }).select('program');
      purchasedSet = new Set(purchases.map(p => p.program.toString()));
    }

    const resultsWithFlag = programs.map(prog => {
      const obj = prog.toObject();
      obj.purchased = purchasedSet.has(obj._id.toString());
      return obj;
    });

    res.json({
      totalPages: Math.ceil(total / limit),
      count: total,
      results: resultsWithFlag
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Can't retrieve programs" });
  }
});

// GET single program
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const programId = req.params.id;

    const program = await Program
      .findById(programId)
      .populate('exercises.exercise');
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    let purchased = false;
    if (req.user && req.user._id) {
      const purchase = await Purchase.findOne({
        user:    req.user._id,
        program: programId,
        status: 'completed'
      });
      purchased = !!purchase;
    }

    const obj = program.toObject();
    obj.purchased = purchased;
    res.json(obj);

  } catch (err) {
    console.error('Error fetching program detail:', err);
    res.status(500).json({ error: 'Could not retrieve program' });
  }
});

module.exports = router;
