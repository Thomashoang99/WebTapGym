const express = require('express');
const { hash, compare } = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../../middleware/auth');

// Đăng ký
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) 
      return res.status(400).json({ message: 'Email đã tồn tại' });

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) 
      return res.status(400).json({ message: 'Sai email' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) 
      return res.status(400).json({ message: 'Sai password' });

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

// Đổi mật khẩu
router.patch('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email address' });

    const isSamePassword = await user.matchPassword(newPassword);
    if (isSamePassword)
      return res.status(400).json({ message: 'New password must be different from the old one' });


    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Password reset failed' });
  }
});

module.exports = router;