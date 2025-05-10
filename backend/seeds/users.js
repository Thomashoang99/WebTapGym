const mongoose = require('mongoose');
const User = require('../models/User');
const UserCounter = require('../models/UserCounter');
require('dotenv').config();


const seedUsers = async () => {
  
  await User.deleteMany();
  await UserCounter.deleteMany();

  const users = [
    {
      username: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      username: 'User',
      email: 'user@gmail.com',
      password: 'user123',
      role: 'user'
    },
    {
      username: 'Nguyen Van A',
      email: 'nguyenvana@gmail.com',
      password: 'nguyenvana123',
      role: 'user'
    }
  ];

    for (const user of users) {
      const u = new User(user);
      await u.save();
    }
    console.log('Đã thêm user thành công');
};

module.exports = seedUsers;