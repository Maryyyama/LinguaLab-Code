const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const Student = require('../models/Student');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Получить все платежи (админ)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    const payments = await Payment.find()
      .populate('userId', 'email firstName lastName')
      .populate('courseId', 'title price');
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получить платежи текущего пользователя
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId }).populate('courseId', 'title');
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создать платеж (симуляция) и записать на курс
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { courseId, paymentMethod, language, level, group } = req.body;
    const student = await Student.findOne({ userId: req.userId });
    if (!student) {
      return res.status(404).json({ error: 'Студент не найден' });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    // Проверка, что платеж уже существует
    const existingPayment = await Payment.findOne({ userId: req.userId, courseId });
    if (existingPayment) {
      return res.status(400).json({ error: 'Платеж уже существует' });
    }
    // Создаем платеж
    const payment = new Payment({
      userId: req.userId,
      courseId,
      amount: course.price,
      paymentMethod,
      status: 'pending',
      metadata: {
        email: req.user?.email,
        phone: req.user?.phone,
        courseLanguage: language || course.language,
        courseLevel: level || course.level
      }
    });
    await payment.save();
    // Симуляция успешной оплаты
    payment.status = 'completed';
    payment.paymentDate = new Date();
    await payment.save();

    // Запись студента на курс, если еще не записан
    const alreadyEnrolled = student.enrolledCourses.some(e => e.courseId.toString() === courseId);
    if (!alreadyEnrolled) {
      const enrolledCourse = {
        courseId,
        language: language || course.language,
        level: level || course.level,
        startDate: new Date(),
        status: 'active',
        group: group || 'Standard Group',
        progress: {
          completedLessons: 0,
          totalLessons: course.lessons || 0,
          attendance: 0,
          lastTestScore: 0
        },
        paymentStatus: 'paid'
      };
      student.enrolledCourses.push(enrolledCourse);
      await student.save();
    } else {
      // Обновляем paymentStatus на 'paid' для существующей записи
      const enrolled = student.enrolledCourses.find(e => e.courseId.toString() === courseId);
      if (enrolled) {
        enrolled.paymentStatus = 'paid';
        await student.save();
      }
    }

    res.status(201).json({
      message: 'Платеж успешно создан и вы записаны на курс',
      payment,
      student
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновить статус платежа (админ)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    const { status } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Платеж не найден' });
    }
    payment.status = status;
    if (status === 'completed' && !payment.paymentDate) {
      payment.paymentDate = new Date();
    }
    await payment.save();
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удалить платеж (админ)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Платеж не найден' });
    }
    await payment.deleteOne();
    res.json({ message: 'Платеж удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;