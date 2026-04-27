const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'RUB' },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, enum: ['card', 'sbp', 'yandex'] },
  paymentDate: Date,
  invoiceNumber: String,
  transactionId: String,
  metadata: {
    email: String,
    phone: String,
    courseLanguage: String,
    courseLevel: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);