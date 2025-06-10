const { Schema, model } = require("mongoose");

const MetricSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: () => new Date(), required: true },
    weight: {
      type: Number,
      required: true,
      validate: {
        validator: function (w) {
          return w > 0.0;
        },
      },
    },
    height: {
      type: Number,
      required: true,
      validate: {
        validator: function (h) {
          return h > 0.0;
        },
      },
    },
    bmi: {
      type: Number,
      validate: {
        validator: function (b) {
          return b > 0.0;
        },
      },
    },
  },
  { timestamps: true }
);

MetricSchema.index({ user: 1, date: -1 });

MetricSchema.pre("save", async function (next) {
  const BMI = this.weight / (this.height / 100) ** 2;
  this.bmi = parseFloat(BMI.toFixed(1));
  next();
});

MetricSchema.pre("findOneAndUpdate", async function (next) {
  const u = this.getUpdate();
  const BMI = u.weight / (u.height / 100) ** 2;
  u.bmi = parseFloat(BMI.toFixed(1));
  this.setUpdate(u);
  next();
});

MetricSchema.pre("updateMany", async function (next) {
  const u = this.getUpdate();
  const BMI = u.weight / (u.height / 100) ** 2;
  u.bmi = parseFloat(BMI.toFixed(1));
  this.setUpdate(u);
  next();
});

const Metric = model("Metric", MetricSchema);
module.exports = Metric;