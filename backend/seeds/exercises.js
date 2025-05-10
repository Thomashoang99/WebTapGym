const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
require('dotenv').config();

const seedExercises = async () => {
  await Exercise.deleteMany();

  const exercises = [
    {
      name: 'Push-Up',
      imageUrl: 'https://www.fitnesseducation.edu.au/wp-content/uploads/2020/10/Pushups.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
      description: 'A basic bodyweight exercise targeting the chest, shoulders, and triceps.',
      bodyParts: ['Chest', 'Shoulders', 'Triceps'],
      equipment: 'Bodyweight',
      difficulty: 'Beginner'
    },
    {
      name: 'Pull-Up',
      imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/mh0418-fit-pul-01-1558554157.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
      description: 'A compound bodyweight exercise focusing on the back and biceps.',
      bodyParts: ['Back', 'Biceps'],
      equipment: 'Bodyweight',
      difficulty: 'Intermediate'
    },
    {
      name: 'Barbell Squat',
      imageUrl: 'https://www.dmoose.com/cdn/shop/articles/barbell_squat.jpg?v=1653488200',
      videoUrl: 'https://www.youtube.com/watch?v=eFYv8Skf66g',
      description: 'A foundational lower body barbell exercise.',
      bodyParts: ['Legs'],
      equipment: 'Barbell',
      difficulty: 'Intermediate'
    },
    {
      name: 'Dumbbell Shoulder Press',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyjL8m4PR4uRzowa6ZNzARI6PnGQkEpTKH4w&s',
      videoUrl: 'https://www.youtube.com/watch?v=0JfYxMRsUCQ',
      description: 'Targets the shoulders using dumbbells.',
      bodyParts: ['Shoulders'],
      equipment: 'Dumbbell',
      difficulty: 'Beginner'
    },
    {
      name: 'Leg Raise',
      imageUrl: 'https://static.strengthlevel.com/images/exercises/lying-leg-raise/lying-leg-raise-800.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
      description: 'An effective bodyweight movement for strengthening the core.',
      bodyParts: ['Core'],
      equipment: 'Bodyweight',
      difficulty: 'Beginner'
    },
    {
      name: 'Cable Chest Fly',
      imageUrl: 'https://www.puregym.com/media/0c2ijzzq/cable-chest-flyes.jpg?quality=80',
      videoUrl: 'https://www.youtube.com/watch?v=Iwe6AmxVf7o',
      description: 'An isolation chest movement performed with a cable machine.',
      bodyParts: ['Chest'],
      equipment: 'Machine',
      difficulty: 'Intermediate'
    },
    {
      name: 'Deadlift',
      imageUrl: 'https://trainingstation.co.uk/cdn/shop/articles/hammer-brand-page-50-50-1-need-rights_768x.jpg?v=1679149922',
      videoUrl: 'https://www.youtube.com/watch?v=vfKwjT5-86k',
      description: 'A compound barbell movement that targets the full body, especially back and legs.',
      bodyParts: ['Full Body', 'Back', 'Legs'],
      equipment: 'Barbell',
      difficulty: 'Advanced'
    },
    {
      name: 'Bicep Curl',
      imageUrl: 'https://imagely.mirafit.co.uk/wp/wp-content/uploads/2019/08/fitness-expert-doing-bicep-curls-with-an-ez-cutl-bar.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
      description: 'An isolation movement for the biceps using dumbbells.',
      bodyParts: ['Biceps'],
      equipment: 'Dumbbell',
      difficulty: 'Beginner'
    },
    {
      name: 'Triceps Pushdown',
      imageUrl: 'https://www.puregym.com/media/0kujs5ev/tricep-pushdowns.jpg?quality=80',
      videoUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
      description: 'An isolation triceps exercise done on a cable machine.',
      bodyParts: ['Triceps'],
      equipment: 'Machine',
      difficulty: 'Intermediate'
    },
    {
      name: 'Lunge',
      imageUrl: 'https://images.ctfassets.net/hjcv6wdwxsdz/2bQRCnH8foEemorHTvK44n/be6097a413f930f637e3dd3bf905ce6f/lunge.png',
      videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
      description: 'A bodyweight or weighted lower body exercise focusing on legs and core stability.',
      bodyParts: ['Legs'],
      equipment: 'Bodyweight',
      difficulty: 'Beginner'
    }
  ];

  await Exercise.insertMany(exercises);
  console.log('Đã thêm dữ liêu bài tập');
};

module.exports = seedExercises;