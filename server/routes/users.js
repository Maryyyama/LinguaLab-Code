const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Получить всех пользователей (только админ)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получить пользователя по ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    // Пользователь может смотреть только свой профиль, если он не админ
    if (req.userRole !== 'admin' && req.userId !== user._id.toString()) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновить пользователя
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    // Только сам пользователь или админ может обновлять
    if (req.userRole !== 'admin' && req.userId !== user._id.toString()) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;
    await user.save();
    res.json({ message: 'Пользователь обновлён', user: user.toObject({ transform: (doc, ret) => { delete ret.password; return ret; } }) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удалить пользователя (админ или сам пользователь)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    if (req.userRole !== 'admin' && req.userId !== user._id.toString()) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    await user.deleteOne();
    res.json({ message: 'Пользователь удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Сброс нарушений пользователя (только админ)
router.post('/:id/reset-violations', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

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

module.exports = router;