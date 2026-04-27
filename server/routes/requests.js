const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Список запрещенных слов
const forbiddenWords = [
  'хуй', 'пизда', 'ебать', 'залупа', 'мудак', 'гнида', 'сука', 'блядь',
  'нацист', 'фашист', 'скинхед', 'террор', 'взорвать', 'убить', 'смерть',
  'исламское государство', 'игил', 'аллах акбар', 'джихад',
  'test', // тестовое слово для проверки
  // добавить другие слова по необходимости
];

// Функция проверки текста
const containsForbiddenWords = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return forbiddenWords.some(word => lowerText.includes(word));
};

// Функция применения бана по прогрессивной шкале
const applyBanForViolation = async (userId, violationCount) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    
    let banDuration = null; // null = навсегда
    if (violationCount === 1) banDuration = 5; // 5 минут
    else if (violationCount === 2) banDuration = 15; // 15 минут
    else if (violationCount === 3) banDuration = 30; // 30 минут
    else if (violationCount === 4) banDuration = 60; // 1 час
    else if (violationCount === 5) banDuration = 1440; // 24 часа
    else if (violationCount >= 6) banDuration = null; // навсегда
    
    if (banDuration) {
      const bannedUntil = new Date(Date.now() + banDuration * 60 * 1000);
      user.bannedUntil = bannedUntil;
      user.isBanned = true;
      console.log(`🔨 Пользователь ${user.login} забанен на ${banDuration} минут (до ${bannedUntil.toLocaleString('ru-RU')})`);
    } else {
      user.isBanned = true;
      user.bannedUntil = null;
      console.log(`🔨 Пользователь ${user.login} забанен навсегда`);
    }
    
    await user.save();
    return banDuration;
  } catch (error) {
    console.error('Ошибка при применении бана:', error);
  }
};

// Получить все заявки (только админ)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    const requests = await Request.find().populate('userId', 'login email').sort('-createdAt');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получить заявки текущего пользователя
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.userId }).sort('-createdAt');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создать новую заявку (от ученика)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, phone, question, message } = req.body;
    
    // Проверка на запрещенные слова
    const hasForbiddenWords = containsForbiddenWords(question) || containsForbiddenWords(message);
    
    if (hasForbiddenWords) {
      // Найдены нарушения - увеличиваем счетчик и применяем бан
      const user = await User.findById(req.userId);
      if (user) {
        user.violationCount = (user.violationCount || 0) + 1;
        user.lastViolationDate = new Date();
        await user.save();
        
        // Применяем бан по прогрессивной шкале
        const banDuration = await applyBanForViolation(req.userId, user.violationCount);
        
        let errorMessage = 'Ваше сообщение содержит запрещенные слова. ';
        if (banDuration === null) {
          errorMessage += 'Ваш аккаунт заблокирован навсегда.';
        } else {
          errorMessage += `Ваш аккаунт заблокирован на ${banDuration} минут.`;
        }
        
        return res.status(400).json({
          error: errorMessage,
          violationCount: user.violationCount,
          banned: true,
          bannedUntil: user.bannedUntil
        });
      }
    }
    
    // Если нарушений нет или пользователь не найден - создаем заявку
    const request = new Request({
      userId: req.userId,
      name,
      phone,
      question,
      message,
      status: 'pending'
    });
    
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Ответить на заявку (только админ)
router.put('/:id/answer', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    
    const { answer } = req.body;
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }
    
    request.answer = answer;
    request.status = 'answered';
    request.answeredAt = new Date();
    request.answeredBy = req.userId;
    
    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удалить заявку (только админ)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }
    
    await request.deleteOne();
    res.json({ message: 'Заявка удалена' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;