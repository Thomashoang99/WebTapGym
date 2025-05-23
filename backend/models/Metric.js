const { Schema, model } = require('mongoose');

const MetricSchema = new Schema({
  user:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date:    { type: Date, default: () => new Date(), required: true },
  weight:  { type: Number, required: true },
  bodyFat: { type: Number, required: true }
}, { timestamps: true });

MetricSchema.index({ user: 1, date: -1 });

const Metric = model('Metric', MetricSchema);
module.exports = Metric;