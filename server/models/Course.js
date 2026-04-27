const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  language: { type: String, required: true, enum: ['english', 'german', 'spanish', 'chinese', 'french', 'japanese', 'korean', 'italian'] },
  level: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  duration: String,
  modules: Number,
  lessons: Number,
  tasks: Number,
  tests: Number,
  expertSessions: Number,
  flagImage: String,
  coverImage: String,
  afterCourse: [String],
  forWhom: String,
  modulesList: [{
    title: String,
    subtitle: String,
    description: String,
    lessons: Number,
    points: Number
  }],
  topStudents: [{ name: String, score: Number }],
  reviews: [{
    author: String,
    role: String,
    text: String,
    stars: Number,
    date: { type: Date, default: Date.now }
  }],
  // Поле для связи с преподавателем
  teacher: {
    type: String,
    required: false,
    default: null,
    validate: {
      validator: function(value) {
        if (!value) return true; // Разрешаем null
        // Проверка будет выполняться на уровне маршрута через teacherLanguage.js
        return true;
      },
      message: 'Преподаватель не найден в системе'
    }
  },
  // Альтернативно можно хранить ссылку на модель Teacher
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: false },
  status: { type: String, enum: ['active', 'archived'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);