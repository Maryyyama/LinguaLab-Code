const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const bcrypt = require('bcrypt');

// GET /api/settings - публичный доступ, получение настроек сайта
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    // Возвращаем только нужные поля (без служебных)
    res.json({
      siteName: settings.siteName,
      adminEmail: settings.adminEmail,
      contactPhone: settings.contactPhone,
      contactAddress: settings.contactAddress,
      metaDescription: settings.metaDescription,
      metaKeywords: settings.metaKeywords,
      updatedAt: settings.updatedAt
    });
  } catch (err) {
    console.error('Ошибка при получении настроек:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении настроек' });
  }
});

// PUT /api/settings - обновление настроек (только администратор)
router.put('/', authMiddleware, async (req, res) => {
  try {
    // Проверка роли
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён. Требуются права администратора.' });
    }

    const { siteName, adminEmail, contactPhone, contactAddress, metaDescription, metaKeywords } = req.body;

    // Получаем текущие настройки
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    // Обновляем поля
    if (siteName !== undefined) settings.siteName = siteName;
    if (adminEmail !== undefined) settings.adminEmail = adminEmail;
    if (contactPhone !== undefined) settings.contactPhone = contactPhone;
    if (contactAddress !== undefined) settings.contactAddress = contactAddress;
    if (metaDescription !== undefined) settings.metaDescription = metaDescription;
    if (metaKeywords !== undefined) settings.metaKeywords = metaKeywords;

    await settings.save();

    res.json({
      message: 'Настройки успешно обновлены',
      settings: {
        siteName: settings.siteName,
        adminEmail: settings.adminEmail,
        contactPhone: settings.contactPhone,
        contactAddress: settings.contactAddress,
        metaDescription: settings.metaDescription,
        metaKeywords: settings.metaKeywords,
        updatedAt: settings.updatedAt
      }
    });
  } catch (err) {
    console.error('Ошибка при обновлении настроек:', err);
    res.status(500).json({ error: 'Ошибка сервера при обновлении настроек' });
  }
});

// POST /api/settings/change-password - смена пароля администратора
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён. Требуются права администратора.' });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Валидация
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Новый пароль и подтверждение не совпадают' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Новый пароль должен содержать минимум 6 символов' });
    }

    // Находим пользователя-администратора
    const adminUser = await User.findById(req.userId);
    if (!adminUser) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Проверяем текущий пароль
    const isPasswordValid = await adminUser.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Текущий пароль указан неверно' });
    }

    // Устанавливаем новый пароль (хеширование произойдет в pre-save хуке модели User)
    adminUser.password = newPassword;
    await adminUser.save();

    // Проверяем, что пароль действительно изменился
    const updatedUser = await User.findById(req.userId);
    const isNewPasswordValid = await updatedUser.comparePassword(newPassword);
    if (!isNewPasswordValid) {
      console.error('Пароль не изменился после сохранения');
      return res.status(500).json({ error: 'Ошибка при обновлении пароля' });
    }

    console.log(`Пароль администратора ${adminUser.email} успешно изменён`);
    res.json({ message: 'Пароль успешно изменён' });
  } catch (err) {
    console.error('Ошибка при смене пароля:', err);
    res.status(500).json({ error: 'Ошибка сервера при смене пароля' });
  }
});

module.exports = router;