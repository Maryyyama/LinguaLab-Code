const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, default: '' },
  question: { type: String, required: true },
  answer: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'answered'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  answeredAt: Date,
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Request', RequestSchema);