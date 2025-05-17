const { Schema, model } = require('mongoose');

const BookmarkSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  program: { type: Schema.Types.ObjectId, ref: 'Program', default: null },
  exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', default: null },
  article: { type: Schema.Types.ObjectId, ref: 'Article', default: null }
}, { timestamps: true });


BookmarkSchema.pre('validate', function (next) {
  const fields = [this.program, this.exercise, this.article];
  const setCount = fields.filter(field => field != null).length;

  if (setCount !== 1) {
    return next(new Error('Exactly one of program, exercise, or article must be set.'));
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

BookmarkSchema.index(
  { user: 1, article: 1 },
  { unique: true, partialFilterExpression: { exercise: { $type: 'objectId' } } }
);

module.exports = model('Bookmark', BookmarkSchema);
