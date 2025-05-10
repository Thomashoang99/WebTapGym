const { Schema, model } = require('mongoose');

const BookmarkSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  program: { type: Schema.Types.ObjectId, ref: 'Program', default: null },
  exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', default: null }
}, { timestamps: true });


BookmarkSchema.pre('validate', function (next) {
  if (this.program && this.exercise) {
    return next(new Error('A bookmark must reference either a program or an exercise, but not both.'));
  }
  if (!this.program && !this.exercise) {
    return next(new Error('A bookmark must reference either a program or an exercise.'));
  }
  next();
});

BookmarkSchema.index(
  { user: 1, program: 1 },
  { unique: true, partialFilterExpression: { program: { $type: 'objectId' } } }
);

BookmarkSchema.index(
  { user: 1, exercise: 1 },
  { unique: true, partialFilterExpression: { exercise: { $type: 'objectId' } } }
);

module.exports = model('Bookmark', BookmarkSchema);
