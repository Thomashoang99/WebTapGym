const { Schema, model } = require('mongoose');

const UserCounterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
  });
  
const UserCounter = model('UserCounter', UserCounterSchema);
module.exports = UserCounter;
  