const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const { authMiddleware } = require('../middleware/auth');

// Только админ может использовать эти маршруты
router.use(authMiddleware);
router.use((req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Доступ запрещён' });
  }
  next();
});

// Статистика платформы
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalCourses = await Course.countDocuments();
    const totalPayments = await Payment.countDocuments({ status: 'completed' });
    const revenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    res.json({
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      totalPayments,
      revenue: revenue[0]?.total || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Управление пользователями
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Изменить роль пользователя
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Недопустимая роль' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    user.role = role;
    await user.save();
    res.json({ message: 'Роль обновлена', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Управление курсами
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().populate('teacher').populate('students');
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Активировать/деактивировать курс
router.patch('/courses/:id/active', async (req, res) => {
  try {
    const { isActive } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    course.isActive = isActive;
    await course.save();
    res.json({ message: 'Статус курса обновлён', course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Просмотр всех платежей
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('student', 'user')
      .populate('course', 'title')
      .sort('-createdAt');
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Бан пользователя
router.post('/users/:id/ban', async (req, res) => {
  try {
    const { duration } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    
    // Сначала снимаем текущий бан, если есть
    user.isBanned = false;
    user.bannedUntil = null;
    
    if (duration === null) {
      user.isBanned = true;
      user.bannedUntil = null;
    } else {
      user.bannedUntil = new Date(Date.now() + duration * 60 * 1000);
      user.isBanned = true;
    }
    await user.save();
    
    const message = duration === null
      ? 'Пользователь заблокирован навсегда'
      : `Пользователь заблокирован на ${duration} минут (до ${new Date(user.bannedUntil).toLocaleString('ru-RU')})`;
    
    res.json({ message, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Разбан пользователя
router.post('/users/:id/unban', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    
    user.isBanned = false;
    user.bannedUntil = null;
    await user.save();
    res.json({ message: 'Пользователь разблокирован', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Сброс нарушений пользователя
router.post('/users/:id/reset-violations', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

    user.violationCount = 0;
    user.lastViolationDate = null;
    await user.save();

    res.json({
      message: 'Нарушения пользователя сброшены',
      user: user.toObject({ transform: (doc, ret) => { delete ret.password; return ret; } })
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получить курсы студента (studentId - это userId пользователя)
router.get('/students/:studentId/courses', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.studentId }).populate('enrolledCourses.courseId', 'title language level');
    if (!student) return res.status(404).json({ error: 'Студент не найден' });
    
    const courses = student.enrolledCourses.map(ec => ({
      courseId: ec.courseId._id,
      title: ec.courseId.title,
      language: ec.courseId.language,
      level: ec.courseId.level,
      progress: ec.progress || 0,
      enrolledAt: ec.enrolledAt
    }));
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обнулить курс студенту (studentId - это userId пользователя)
router.delete('/students/:studentId/courses/:courseId', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.studentId });
    if (!student) return res.status(404).json({ error: 'Студент не найден' });
    
    student.enrolledCourses = student.enrolledCourses.filter(
      c => c.courseId.toString() !== req.params.courseId
    );
    await student.save();
    res.json({ message: 'Курс удален из профиля студента' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;