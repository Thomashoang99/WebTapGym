// routes/purchases.js
const express  = require('express');
const router   = express.Router();
const Purchase = require('../../models/Purchase');
const Program  = require('../../models/Program');
const auth     = require('../../middleware/auth');


router.post('/', auth, async (req, res) => {
  try {
    console.log('BODY', req.body);
    const { program, amount } = req.body;
    console.log('Program: ' + program + '\nAmount: ' + amount);
    const prog = await Program.findById(program);
    if (!prog) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const purchase = await Purchase.create({
      user:    req.user._id,
      program,
      amount,
      status:  'completed'  
    });

    res.status(201).json(purchase);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Program already purchased' });
    }
    console.error(err);
    res.status(500).json({ error: 'Could not create purchase' });
  }
});


router.get('/me', auth, async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id })
      .populate('program')           
      .sort({ createdAt: -1 });

    res.json(purchases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch your purchases' });
  }
});


router.get('/:id', auth, async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      _id:    req.params.id,
      user:   req.user._id
    }).populate('program');

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    res.json(purchase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch purchase' });
  }
});

module.exports = router;