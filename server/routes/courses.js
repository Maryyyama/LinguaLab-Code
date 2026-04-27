const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { validateTeacherForCourse } = require('../utils/teacherLanguage');

const router = express.Router();

// Список запрещенных слов (дублируем из requests.js для consistency)
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
      console.log(`🔨 Пользователь ${user.login} забанен на ${banDuration} минут (до ${bannedUntil.toLocaleString('ru-RU')}) за отзыв с запрещенными словами`);
    } else {
      user.isBanned = true;
      user.bannedUntil = null;
      console.log(`🔨 Пользователь ${user.login} забанен навсегда за отзыв с запрещенными словами`);
    }
    
    await user.save();
    return banDuration;
  } catch (error) {
    console.error('Ошибка при применении бана:', error);
  }
};

// Получить все курсы
router.get('/', async (req, res) => {
  try {
    const { language, level, status = 'active' } = req.query;
    const filter = { status };
    if (language) filter.language = language;
    if (level) filter.level = level;
    
    const courses = await Course.find(filter);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить курс по ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Маппинг языков с русского на английский
const languageMap = {
  'Английский': 'english',
  'Немецкий': 'german',
  'Испанский': 'spanish',
  'Китайский': 'chinese',
  'Французский': 'french',
  'Японский': 'japanese',
  'Корейский': 'korean',
  'Итальянский': 'italian'
};

// Создать курс (только админ)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const body = { ...req.body };
    // Преобразуем язык, если он есть в маппинге
    if (body.language && languageMap[body.language]) {
      body.language = languageMap[body.language];
    }
    
    // Валидация соответствия преподавателя и языка курса
    if (body.teacher && body.language) {
      const validation = validateTeacherForCourse(body.teacher, body.language);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
      }
    }
    
    const course = new Course(body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить курс (только админ)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const body = { ...req.body };
    // Преобразуем язык, если он есть в маппинге
    if (body.language && languageMap[body.language]) {
      body.language = languageMap[body.language];
    }
    
    // Валидация соответствия преподавателя и языка курса
    if (body.teacher && body.language) {
      const validation = validateTeacherForCourse(body.teacher, body.language);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
      }
    }
    
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true, runValidators: true }
    );
    if (!course) return res.status(404).json({ error: 'Курс не найден' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Добавить отзыв к курсу (только авторизованные пользователи)
router.post('/:id/reviews', authMiddleware, async (req, res) => {
  try {
    console.log(`POST /api/courses/${req.params.id}/reviews called`);
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }

    const { text, stars } = req.body;
    
    // Получаем данные пользователя
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Проверка на запрещенные слова в отзыве
    const hasForbiddenWords = containsForbiddenWords(text);
    
    if (hasForbiddenWords) {
      // Найдены нарушения - увеличиваем счетчик и применяем бан
      user.violationCount = (user.violationCount || 0) + 1;
      user.lastViolationDate = new Date();
      await user.save();
      
      const banDuration = await applyBanForViolation(req.userId, user.violationCount);
      
      let errorMessage = 'Ваш отзыв содержит запрещенные слова. ';
      if (banDuration === null) {
        errorMessage += 'Ваш аккаунт заблокирован навсегда.';
      } else {
        errorMessage += `Ваш аккаунт заблокирован на ${banDuration} минут.`;
      }
      
      return res.status(400).json({ error: errorMessage });
    }

    // Если нарушений нет - добавляем отзыв
    const newReview = {
      author: user.login || user.email,
      role: user.role === 'student' ? 'Студент' : user.role === 'teacher' ? 'Преподаватель' : 'Админ',
      text: text,
      stars: stars,
      date: new Date()
    };

    course.reviews.push(newReview);
    await course.save();

    res.status(201).json({
      message: 'Отзыв добавлен',
      review: newReview
    });
  } catch (error) {
    console.error('Ошибка добавления отзыва:', error);
    res.status(500).json({ error: error.message });
  }
});

// Удалить отзыв из курса (только админ)
router.delete('/:courseId/reviews/:reviewId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { courseId, reviewId } = req.params;
    console.log(`DELETE /api/courses/${courseId}/reviews/${reviewId} called`);
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }

    // Находим индекс отзыва в массиве
    const reviewIndex = course.reviews.findIndex(review => review._id.toString() === reviewId);
    if (reviewIndex === -1) {
      return res.status(404).json({ error: 'Отзыв не найден' });
    }

    // Удаляем отзыв из массива
    course.reviews.splice(reviewIndex, 1);
    await course.save();

    res.json({ message: 'Отзыв успешно удален' });
  } catch (error) {
    console.error('Ошибка удаления отзыва:', error);
    res.status(500).json({ error: error.message });
  }
});

// Удалить курс (только админ)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Курс не найден' });
    res.json({ message: 'Курс удален' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;