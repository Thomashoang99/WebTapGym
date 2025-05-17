const express = require('express');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();


// Đăng nhập admin
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) 
      return res.status(400).json({ message: 'Sai email' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) 
      return res.status(400).json({ message: 'Sai password' });

    if (user.role !== 'admin'){
        return res.status(403).json({ message: 'Không được phép truy cập' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const userData = user.toObject();
    delete userData.password;
    res.json({
      user: userData,
      token: token
    });
  } catch (err) {
    res.status(500).json('Đăng nhập thất bại');
  }
});

module.exports = router;