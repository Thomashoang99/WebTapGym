const mongoose = require('mongoose');
const seedUsers = require('./users');
const seedExercises = require('./exercises');
require('dotenv').config();

const runSeeds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Đã kết nối CSDL.');

    await seedUsers();
    await seedExercises();

    console.log('Đã thêm dữ liệu mẫu thành công.');
  } catch (err) {
    console.error('Lỗi: ', err);
  } finally {
    await mongoose.disconnect();
  }
};

runSeeds();
