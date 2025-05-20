function isAdmin(req, res, next) {
    console.log('isAdmin check, req.user:', req.user);
    console.log(req.user?.role || 'None');
    if (req.user?.role === 'admin') {
      console.log('Admin verified');
      return next();
    } else {
      console.log('Not an admin');
      return res.status(403).json({ message: 'Access denied' });
    }
};

module.exports = isAdmin;