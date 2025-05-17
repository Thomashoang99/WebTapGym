const mongoose = require('mongoose');
const seedUsers = require('./users');
const seedExercises = require('./exercises');
const seedPrograms = require('./programs');
const resetPurchases = require('./purchases');

require('dotenv').config();

const runSeeds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB connected');

    await resetPurchases();
    await seedUsers();
    await seedExercises();
    await seedPrograms();

    console.log('All data seeded successfully!');
  } catch (err) {
    console.error('Error: ', err);
  } finally {
    await mongoose.disconnect();
  }
};

runSeeds();