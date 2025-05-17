const { Schema, model } = require('mongoose');
const { hash, compare } = require('bcryptjs');
const UserCounter = require('./UserCounter');

const UserSchema = new Schema({
    userId: { 
      type: Number, unique: true, minlength: 3, maxlength: 30
    },
    username: { 
      type: String, required: true, unique: true, trim: true 
    },
    email: { 
      type: String, required: true, unique: true, trim: true, lowercase: true,
      match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    password: { 
      type: String, required: true, select: false
     },
    role: { 
      type: String, 
      enum: ['admin', 'user'], default: 'user', 
      required: true }
}, { timestamps: true })


UserSchema.pre('save', async function (next) {
    if (this.isModified('password')){
      this.password = await hash(this.password, 10);
    }
    if (this.isNew) {
      try {
          const counter = await UserCounter.findByIdAndUpdate(
              { _id: 'userId' },
              { $inc: { seq: 1 } },
              { upsert: true, new: true }
          );
          this.userId = counter.seq;
      } catch (error) {
          return next(error);
      }
  }
  next();
})

UserSchema.methods.matchPassword = async function (password) {
    return await compare(password, this.password);
};


const User = model('User', UserSchema);
module.exports = User;