const express = require('express');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const router = express.Router();


router.get('/', auth, async (req, res) => {
    const { username, email, bio, imageUrl, createdAt } = req.user;
    res.json({ username, email, bio, imageUrl, createdAt });
});

router.put('/', auth, upload.single('image'), async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('+password');
      const { username, email, oldPassword, newPassword } = req.body;
      
      if (username) user.username = username;
      if (email)    user.email    = email;

      if (oldPassword && newPassword) {
        const ok = await user.matchPassword(oldPassword);
        if (!ok) return res.status(400).json({ error: 'Incorrect current password' });
        user.password = newPassword;
      }

      if (req.file) {
        user.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }

      await user.save();
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;
