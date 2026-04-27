const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  name: { type: String, default: '' },
  avatar: { type: String, default: '/media/default-avatar.png' },
  
  // Учебная информация
  language: { type: String, default: 'Не выбран' },
  level: { type: String, default: 'Не известно' },
  group: { type: String, default: 'Не выбрана' },
  
  // Прогресс
  progress: {
    completed: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 },
    lastTest: { type: Number, default: 0 }
  },
  
  // Дополнительная информация
  registrationDate: { type: Date, default: Date.now },
  studyFormat: { type: String, default: 'Не выбран' },
  paymentPackage: { type: String, default: 'У вас нет оплаченных курсов' },
  packageExpiry: { type: String, default: '' },
  
  // Курсы студента
  enrolledCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    language: String,
    level: String,
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['active', 'completed', 'frozen'], default: 'active' },
    group: String,
    progress: {
      completedLessons: { type: Number, default: 0 },
      totalLessons: Number,
      attendance: { type: Number, default: 0 },
      lastTestScore: { type: Number, default: 0 }
    },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
    paymentPackage: String
  }],
  
  statistics: {
    totalLessons: { type: Number, default: 0 },
    averageAttendance: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);