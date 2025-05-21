// routes/admin/user.js
const express = require('express');
const router  = express.Router();
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');
const User    = require('../../models/User');


router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      username,
      email,
      createdFrom,
      createdTo
    } = req.query;

    const filter = {};
    if (username) filter.username = { $regex: username, $options: 'i' };
    if (email)    filter.email    = { $regex: email,    $options: 'i' };

    if (createdFrom || createdTo) {
      filter.createdAt = {};
      if (createdFrom) filter.createdAt.$gte = new Date(createdFrom);
      if (createdTo)   filter.createdAt.$lte = new Date(createdTo);
    }

    const skip = (page - 1) * parseInt(limit, 10);
    const docs = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .select('username email createdAt');

    const total = await User.countDocuments(filter);
    res.json({
      results: docs,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
