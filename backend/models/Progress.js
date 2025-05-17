const { Schema, model } = require('mongoose');

const ProgressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  program: {
    type: Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, { timestamps: true });

// ensure one record per user+program
ProgressSchema.index({ user: 1, program: 1 }, { unique: true });

const Progress = model('Progress', ProgressSchema);
module.exports = Progress;
