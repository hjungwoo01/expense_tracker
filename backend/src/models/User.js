const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true // Allow null values for Google login
  },
  password: {
    type: String,
    validate: {
      validator: function (v) {
        return this.googleId ? true : v.length > 0;
      },
      message: 'Password is required'
    }
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allow null values for non-Google login
  }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.googleId) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
