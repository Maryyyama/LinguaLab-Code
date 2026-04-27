const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  avatar: { type: String, default: '/media/default-avatar.png' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  isBanned: { type: Boolean, default: false },
  bannedUntil: { type: Date, default: null },
  violationCount: { type: Number, default: 0 },
  lastViolationDate: { type: Date, default: null },
  settings: {
    theme: { type: String, default: 'light' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  }
});

// Хеширование пароля перед сохранением
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Метод для сравнения паролей
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);