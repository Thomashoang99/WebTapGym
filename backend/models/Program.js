const { Schema, model } = require('mongoose');

const ProgramSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    duration: {
        type: Number,
        min: 1
    },
    exercises: [{
        exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
        sets: { type: Number, min: 1, required: true },
        reps: { type: String, required: true }
    }],
    isPaid: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        min: 0, default: 0,
        required: function() { return this.isPaid; }
    }
}, { timestamps: true })

ProgramSchema.path('exercises').validate(function(exercises) {
    return exercises && exercises.length > 0;
}, 'Program need at least 1 exercise');

ProgramSchema.path('price').validate(function () {
    return !this.isPaid || (this.isPaid && this.price > 0);
  });

ProgramSchema.index({ difficulty: 1 });
ProgramSchema.index({ goal: 1 });

const Program = model('Program', ProgramSchema);
module.exports = Program;