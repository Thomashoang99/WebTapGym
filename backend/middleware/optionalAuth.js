const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // no token → proceed as guest
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
        req.user = {
            _id: user._id,
            userId: user.userId
        }
    }
  } catch (e) {
    // invalid token → ignore and proceed as guest
  }
  return next();
};

module.exports = optionalAuth;