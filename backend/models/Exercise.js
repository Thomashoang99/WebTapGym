const { Schema, model } = require('mongoose');


const ExerciseSchema = new Schema({
    name: { 
      type: String, 
      required: [true, 'Exercise name is required'],
      trim: true,
      unique: true
    },
    imageUrl: { 
      type: String 
    },
    description: { 
      type: String, 
      required: [true, 'Exercise description is required'],
    },
    bodyParts: { 
        type: [String], 
        enum: ['Full Body', 'Back', 'Chest', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Legs'],
        required: true,
        validate: [
            {
              validator: function (arr) {
                return arr.length > 0;
              },
              message: 'At least one targeted body part is required.'
            },
            {
              validator: function (arr) {
                return new Set(arr).size === arr.length;
              },
              message: 'Duplicate body parts are not allowed.'
            }
          ]
    },
    equipment: {
      type: String,
      enum: ['Barbell', 'Dumbbell', 'Machine', 'Bodyweight'],
      required: true
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    videoUrl: {
      type: String,
      validate: {
        validator: function(v) {
          if (!v) return true; 
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
      }
    }
}, { timestamps: true })

ExerciseSchema.index({ bodyParts: 1 });
ExerciseSchema.index({ difficulty: 1 });
ExerciseSchema.index({ equipment: 1 });

const Exercise = model('Exercise', ExerciseSchema);
module.exports = Exercise;