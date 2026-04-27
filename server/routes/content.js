const express = require('express');
const router = express.Router();
const Content = require('../models/CourseContent');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/auth');

// Получить весь контент курса
router.get('/course/:courseId', async (req, res) => {
  try {
    const contents = await Content.find({ course: req.params.courseId }).sort('order');
    res.json(contents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получить контент по ID
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('course');
    if (!content) {
      return res.status(404).json({ error: 'Контент не найден' });
    }
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создать контент (учитель или админ)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'teacher' && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    const content = new Content(req.body);
    await content.save();
    res.status(201).json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновить контент
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Контент не найден' });
    }
    // Проверка, что пользователь - учитель курса или админ
    const course = await Course.findById(content.course);
    if (req.userRole !== 'admin' && course.teacher.toString() !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    Object.assign(content, req.body);
    await content.save();
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удалить контент
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Контент не найден' });
    }
    const course = await Course.findById(content.course);
    if (req.userRole !== 'admin' && course.teacher.toString() !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    await content.deleteOne();
    res.json({ message: 'Контент удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Опубликовать/скрыть контент
router.patch('/:id/publish', authMiddleware, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Контент не найден' });
    }
    const course = await Course.findById(content.course);
    if (req.userRole !== 'admin' && course.teacher.toString() !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    content.isPublished = req.body.isPublished;
    if (req.body.isPublished && !content.publishedAt) {
      content.publishedAt = new Date();
    }
    await content.save();
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;