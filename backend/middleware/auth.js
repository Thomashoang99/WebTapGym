const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) 
      return res.status(401).json({ message: 'Invalid user' });

    req.user = {
      _id: user._id,
      role: user.role,
      userId: user.userId
    };
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

module.exports = auth;