const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Получить всех студентов (админ)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    const students = await Student.find().populate('user', 'firstName lastName email');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получить профиль текущего студента
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId });
    if (!student) {
      return res.status(404).json({ error: 'Профиль студента не найден' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить профиль студента
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ error: 'Профиль студента не найден' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Запись на курс
router.post('/enroll', authMiddleware, async (req, res) => {
  try {
    const { courseId, language, level, group } = req.body;
    
    let student = await Student.findOne({ userId: req.userId });
    if (!student) {
      // Если профиля нет, создаем новый
      const newStudent = new Student({ userId: req.userId });
      await newStudent.save();
      student = newStudent;
    }
    
    // Проверяем, не записан ли уже на этот курс
    const alreadyEnrolled = student.enrolledCourses.some(e => e.courseId.toString() === courseId);
    if (alreadyEnrolled) {
      return res.status(400).json({ error: 'Вы уже записаны на этот курс' });
    }
    
    const enrolledCourse = {
      courseId,
      language,
      level,
      startDate: new Date(),
      status: 'active',
      group: group || 'Стандартная группа',
      progress: {
        completedLessons: 0,
        totalLessons: 0,
        attendance: 0,
        lastTestScore: 0
      },
      paymentStatus: 'paid'
    };
    
    student.enrolledCourses.push(enrolledCourse);
    
    // Обновляем учебную информацию студента
    student.language = language;
    student.level = level === 'beginner' ? 'Начальный' : 'Средний';
    student.group = group || 'Стандартная группа';
    student.paymentPackage = 'Оплачен';
    
    await student.save();
    
    res.json({ message: 'Вы успешно записаны на курс', student });
  } catch (error) {
    console.error('Ошибка записи на курс:', error);
    res.status(500).json({ error: error.message });
  }
});

// Получить студента по ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user')
      .populate('enrolledCourses.course');
    if (!student) {
      return res.status(404).json({ error: 'Студент не найден' });
    }
    // Только сам студент или админ может смотреть
    if (req.userRole !== 'admin' && student.user._id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создать профиль студента (при регистрации)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    if (user.role !== 'student') {
      return res.status(400).json({ error: 'Пользователь не является студентом' });
    }
    const existingStudent = await Student.findOne({ user: userId });
    if (existingStudent) {
      return res.status(400).json({ error: 'Профиль студента уже существует' });
    }
    const student = new Student({ user: userId });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновить профиль студента
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Студент не найден' });
    }
    if (req.userRole !== 'admin' && student.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    Object.assign(student, req.body);
    await student.save();
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удалить профиль студента
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Студент не найден' });
    }
    if (req.userRole !== 'admin' && student.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    await student.deleteOne();
    res.json({ message: 'Профиль студента удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновить прогресс по курсу
router.patch('/:id/progress', authMiddleware, async (req, res) => {
  try {
    const { courseId, progress } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Студент не найден' });
    }
    // Только сам студент или админ
    if (req.userRole !== 'admin' && student.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    const enrolled = student.enrolledCourses.find(e => e.course.toString() === courseId);
    if (!enrolled) {
      return res.status(404).json({ error: 'Студент не записан на этот курс' });
    }
    enrolled.progress = progress;
    if (progress >= 100) enrolled.completed = true;
    await student.save();
    res.json({ message: 'Прогресс обновлён', enrolled });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;