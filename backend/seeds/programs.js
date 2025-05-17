// /backend/seeds/programs.js
const mongoose  = require('mongoose');
const Program   = require('../models/Program');
const Exercise  = require('../models/Exercise');
require('dotenv').config();

const seedPrograms = async () => {
  await Program.deleteMany();

  const exercises = await Exercise.find({});
  const byName = exercises.reduce((map, ex) => {
    map[ex.name] = ex._id;
    return map;
  }, {});

  const programs = [
    {
      name: 'Beginner Full-Body Blast',
      description: 'A 4-week program covering all major muscle groups with bodyweight and light equipment.',
      difficulty: 'Beginner',
      duration: 4,        
      exercises: [
        { exercise: byName['Push-Up'],          sets: 3, reps: '10–12' },
        { exercise: byName['Barbell Squat'],            sets: 3, reps: '12–15' },
        { exercise: byName['Leg Raise'],        sets: 3, reps: '10–15' },
        { exercise: byName['Dumbbell Shoulder Press'], sets: 3, reps: '8–10' },
      ],
      isPaid: false,
      price: 0
    },
    {
      name: 'Intermediate Strength Builder',
      description: 'An intermediate 6-week barbell-focused strength program.',
      difficulty: 'Intermediate',
      duration: 6,
      exercises: [
        { exercise: byName['Barbell Squat'],       sets: 5, reps: '5' },
        { exercise: byName['Deadlift'],            sets: 3, reps: '5' },
        { exercise: byName['Pull-Up'],             sets: 4, reps: '6–8' },
        { exercise: byName['Cable Chest Fly'],     sets: 4, reps: '10–12' },
      ],
      isPaid: true,
      price: 20000
    },
    {
      name: 'Advanced Power & Hypertrophy',
      description: 'A high-intensity 8-week split program mixing heavy lifts and volume work.',
      difficulty: 'Advanced',
      duration: 8,
      exercises: [
        { exercise: byName['Deadlift'],            sets: 5, reps: '3–5' },
        { exercise: byName['Barbell Squat'],       sets: 5, reps: '3–5' },
        { exercise: byName['Bicep Curl'],          sets: 4, reps: '8–10' },
        { exercise: byName['Triceps Pushdown'],    sets: 4, reps: '10–12' },
      ],
      isPaid: true,
      price: 30000
    }
  ];

  await Program.insertMany(programs);
  console.log('Programs data seeded!');
};

module.exports = seedPrograms;
