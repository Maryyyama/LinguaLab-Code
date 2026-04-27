const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// Настройка multer для сохранения файлов в папку ../../media с оригинальным расширением
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destPath = path.join(__dirname, '../../media');
    // Убедимся, что директория существует
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    // Сохраняем оригинальное имя файла с добавлением временной метки для уникальности
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// Middleware для логирования запросов к роутам учителей
router.use((req, res, next) => {
  console.log('Teachers route hit:', req.method, req.url);
  next();
});

// Получить всех учителей
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('userId', 'firstName lastName email avatar');
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновить настройки приватности учителя (только владелец)
router.put('/:id/privacy', authMiddleware, async (req, res) => {
  try {
    console.log('=== PRIVACY UPDATE DEBUG ===');
    console.log('Request params id:', req.params.id);
    
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      console.log('Teacher not found for id:', req.params.id);
      return res.status(404).json({ error: 'Учитель не найден' });
    }
    
    console.log('Teacher found:', teacher._id);
    console.log('Teacher.userId:', teacher.userId);
    console.log('Teacher.userId type:', typeof teacher.userId);
    console.log('req.userId:', req.userId);
    console.log('req.userId type:', typeof req.userId);
    console.log('req.userRole:', req.userRole);
    
    const teacherUserId = teacher.userId?.toString();
    const currentUserId = req.userId?.toString();
    
    console.log('teacherUserId string:', teacherUserId);
    console.log('currentUserId string:', currentUserId);
    console.log('Are they equal?', teacherUserId === currentUserId);
    
    if (req.userRole !== 'admin' && teacherUserId !== currentUserId) {
      console.log('ACCESS DENIED: roles do not match');
      return res.status(403).json({ error: 'Доступ запрещён' });
    }

    const { privacySettings } = req.body;
    console.log('Privacy settings to save:', privacySettings);
    
    if (!privacySettings || typeof privacySettings !== 'object') {
      return res.status(400).json({ error: 'Некорректные данные настроек приватности' });
    }

    const allowedFields = [
      'showFullName', 'showSpecialization', 'showExperience',
      'showEducation', 'showMethodology', 'showGroups',
      'showIndividualStudents', 'showFormat', 'showContactInfo', 'showToGuests'
    ];

    if (!teacher.privacySettings) {
      teacher.privacySettings = {};
    }

    allowedFields.forEach(field => {
      if (typeof privacySettings[field] === 'boolean') {
        teacher.privacySettings[field] = privacySettings[field];
      }
    });

    await teacher.save();
    console.log('Privacy settings saved successfully');
    
    res.json({
      message: 'Настройки приватности обновлены',
      privacySettings: teacher.privacySettings
    });
  } catch (err) {
    console.error('Error in privacy update:', err);
    res.status(500).json({ error: err.message });
  }
});

// Получить учителя по ID с учётом прав доступа
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('userId', 'firstName lastName email avatar login');
    if (!teacher) {
      return res.status(404).json({ error: 'Учитель не найден' });
    }

    // Определяем, кто делает запрос
    const token = req.headers.authorization?.split(' ')[1];
    let requester = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        requester = decoded;
      } catch (err) {}
    }

    const isOwner = requester && requester.userId === teacher.userId?._id?.toString();
    const isGuest = !requester;

    const { privacySettings = {} } = teacher;

    // Если гость и showToGuests = false → 403
    if (isGuest && privacySettings.showToGuests === false) {
      return res.status(403).json({ error: 'Доступ запрещён для гостей' });
    }

    // Если владелец — возвращаем ВСЕ данные
    if (isOwner) {
      const fullTeacher = teacher.toObject();
      const firstName = teacher.firstName || '';
      const lastName = teacher.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim() || teacher.userId?.login || 'Преподаватель';
      return res.json({
        teacher: {
          firstName,
          lastName,
          name: fullName,
          avatar: teacher.userId?.avatar || '/media/default-avatar.png',
          specialization: teacher.specialization || [],
          experience: teacher.experience ? `${teacher.experience} лет` : null,
          education: teacher.education?.map(e => `${e.institution} (${e.degree})`) || [],
          methodology: teacher.methodology || '',
          groups: teacher.currentLoad?.groups || [],
          individualStudents: teacher.currentLoad?.individualStudents || 0,
          format: teacher.schedule?.[0]?.format === 'online' ? 'Онлайн' : 'Онлайн/оффлайн',
          license: teacher.license || { number: '', status: 'active', expiryDate: null },
          nextCheck: teacher.license?.expiryDate ? new Date(teacher.license.expiryDate).toLocaleDateString('ru-RU') : '01.09.2025',
          contacts: teacher.contacts || { phone: '', email: '', city: '', address: '' }
        },
        privacy: privacySettings
      });
    }

    // Для учеников и гостей — возвращаем ТОЛЬКО разрешённые данные
    const filteredTeacher = {
      firstName: privacySettings.showFullName !== false ? teacher.firstName || '' : '',
      lastName: privacySettings.showFullName !== false ? teacher.lastName || '' : '',
      name: privacySettings.showFullName !== false
        ? (`${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || teacher.userId?.login || 'Преподаватель')
        : 'Преподаватель',
      avatar: teacher.userId?.avatar || '/media/default-avatar.png',
      specialization: privacySettings.showSpecialization !== false ? teacher.specialization : null,
      experience: privacySettings.showExperience !== false ? (teacher.experience ? `${teacher.experience} лет` : null) : null,
      education: privacySettings.showEducation !== false ? teacher.education?.map(e => `${e.institution} (${e.degree})`) || [] : null,
      methodology: privacySettings.showMethodology !== false ? teacher.methodology : null,
      groups: privacySettings.showGroups === true ? teacher.currentLoad?.groups || [] : null,
      individualStudents: privacySettings.showIndividualStudents === true ? teacher.currentLoad?.individualStudents || 0 : null,
      format: privacySettings.showFormat !== false ? (teacher.schedule?.[0]?.format === 'online' ? 'Онлайн' : 'Онлайн/оффлайн') : null,
      license: teacher.license || { number: '', status: 'active', expiryDate: null }
    };

    // Добавляем контакты, если разрешено настройками приватности
    if (privacySettings.showContactInfo === true) {
      filteredTeacher.contacts = teacher.contacts || { phone: '', email: '', city: '', address: '' };
    }

    res.json({
      teacher: filteredTeacher,
      privacy: privacySettings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Публичный профиль учителя (с фильтрацией по privacySettings)
router.get('/:id/public', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: 'Учитель не найден' });
    }

    // Если showToGuests === false и пользователь не аутентифицирован, можно вернуть ошибку
    // Пока пропускаем эту проверку

    const { privacySettings = {} } = teacher;
    const filteredTeacher = {};

    // Базовые поля
    if (privacySettings.showFullName !== false) {
      filteredTeacher.firstName = teacher.firstName;
      filteredTeacher.lastName = teacher.lastName;
      filteredTeacher.name = `${teacher.firstName} ${teacher.lastName}`;
    } else {
      filteredTeacher.name = 'Преподаватель';
    }

    if (privacySettings.showSpecialization !== false) {
      filteredTeacher.specialization = teacher.specialization;
    }

    if (privacySettings.showExperience !== false) {
      filteredTeacher.experience = teacher.experience;
    }

    if (privacySettings.showEducation !== false) {
      filteredTeacher.education = teacher.education;
    }

    if (privacySettings.showMethodology !== false) {
      filteredTeacher.methodology = teacher.methodology;
    }

    if (privacySettings.showGroups !== false) {
      filteredTeacher.groups = teacher.currentLoad?.groups || [];
    }

    if (privacySettings.showIndividualStudents !== false) {
      filteredTeacher.individualStudents = teacher.currentLoad?.individualStudents || 0;
    }

    if (privacySettings.showFormat !== false) {
      // Определяем формат из schedule
      const format = teacher.schedule?.[0]?.format;
      filteredTeacher.format = format === 'online' ? 'Онлайн' : 'Онлайн/оффлайн';
    }

    // Контактная информация скрывается по умолчанию (showContactInfo === false)
    if (privacySettings.showContactInfo === true) {
      filteredTeacher.contacts = teacher.contacts;
    }

    // Аватар всегда показываем (можно добавить настройку)
    filteredTeacher.avatar = teacher.userId?.avatar || '/media/default-avatar.png';

    res.json({
      teacher: filteredTeacher,
      privacy: privacySettings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создать профиль учителя (админ или сам пользователь)
// Поддерживает два режима:
// 1. Если передан userId - создает профиль для существующего пользователя
// 2. Если переданы login, password - создает нового пользователя и профиль
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Данные теперь приходят в обычном JSON (не FormData)
    const { userId, login, password, name, firstName, lastName, email, phone, avatar, specialization,
            qualification, interests, experience, status, bio, experienceYears,
            education, hourlyRate, language } = req.body;
    
    // ========== ПРЕОБРАЗОВАНИЕ И ВАЛИДАЦИЯ ПОЛЕЙ ==========
    // Язык преподавания: если не передан, по умолчанию 'english'
    const teacherLanguage = language && ['english', 'german', 'spanish', 'chinese'].includes(language.toLowerCase())
      ? language.toLowerCase()
      : 'english';
    
    // Статус пользователя: преобразуем русские значения в английские
    let userStatus = 'active';
    if (status) {
      const statusLower = status.toLowerCase();
      if (statusLower === 'активен' || statusLower === 'active') {
        userStatus = 'active';
      } else if (statusLower === 'заблокирован' || statusLower === 'blocked') {
        userStatus = 'blocked';
      } else {
        // Если значение не распознано, оставляем 'active'
        userStatus = 'active';
      }
    }
    
    // Аватарка по умолчанию - преподаватель добавит фото позже самостоятельно
    const avatarPath = '/media/default-avatar.png';
    
    let targetUserId = userId;
    
    // ========== СОЗДАНИЕ НОВОГО ПОЛЬЗОВАТЕЛЯ (если передан login и password) ==========
    if (login && password) {
      // Проверяем, не существует ли уже пользователь с таким логином или email
      const existingUser = await User.findOne({ $or: [{ login }, { email }] });
      if (existingUser) {
        return res.status(400).json({ error: 'Пользователь с таким логином или email уже существует' });
      }
      
      // Создаем нового пользователя с ролью teacher
      const newUser = new User({
        login,
        email: email || `${login}@linguabot.ru`,
        password,
        phone: phone || 'Не указан',
        role: 'teacher',
        status: userStatus,
        avatar: avatarPath
      });
      
      await newUser.save();
      targetUserId = newUser._id;
    } else if (userId) {
      // ========== ИСПОЛЬЗОВАНИЕ СУЩЕСТВУЮЩЕГО ПОЛЬЗОВАТЕЛЯ ==========
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      if (user.role !== 'teacher') {
        return res.status(400).json({ error: 'Пользователь не является учителем' });
      }
      // Аватар не обновляем - преподаватель добавит фото позже самостоятельно
    } else {
      return res.status(400).json({ error: 'Необходимо указать либо userId, либо login и password' });
    }
    
    // Проверяем, не существует ли уже профиль учителя для этого пользователя
    const existingTeacher = await Teacher.findOne({ userId: targetUserId });
    if (existingTeacher) {
      return res.status(400).json({ error: 'Профиль учителя уже существует' });
    }
    
    // ========== ОПРЕДЕЛЕНИЕ firstName и lastName ==========
    let finalFirstName = '';
    let finalLastName = '';
    
    if (firstName && lastName) {
      // Используем переданные firstName и lastName
      finalFirstName = firstName;
      finalLastName = lastName;
    } else if (name) {
      // Разбиваем name на firstName и lastName для обратной совместимости
      const nameParts = name.trim().split(/\s+/);
      finalFirstName = nameParts[0] || '';
      finalLastName = nameParts.slice(1).join(' ') || '';
    }
    // Если ничего не передано, остаются пустыми строками
    
    // ========== БЕЗОПАСНАЯ ОБРАБОТКА СПЕЦИАЛИЗАЦИИ ==========
    let specArray = [];
    if (specialization) {
      if (Array.isArray(specialization)) {
        specArray = specialization;
      } else if (typeof specialization === 'string') {
        // Если строка содержит запятые, разбиваем
        specArray = specialization.split(',').map(s => s.trim()).filter(s => s !== '');
      } else {
        specArray = [String(specialization)];
      }
    }
    
    // ========== БЕЗОПАСНЫЙ ПАРСИНГ ОБРАЗОВАНИЯ ==========
    // Преобразуем education в массив объектов согласно схеме Teacher
    let educationArray = [];
    if (education) {
      let rawItems = [];
      if (Array.isArray(education)) {
        rawItems = education;
      } else if (typeof education === 'string') {
        try {
          // Пробуем распарсить JSON, если это JSON-строка
          const parsed = JSON.parse(education);
          rawItems = Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
          // Если не JSON, считаем, что это строка с разделителями запятыми
          rawItems = education.split(',').map(e => e.trim()).filter(e => e !== '');
        }
      } else {
        rawItems = [String(education)];
      }
      // Преобразуем каждый элемент в объект { institution, degree, year }
      educationArray = rawItems.map(item => {
        if (typeof item === 'object' && item !== null && item.institution) {
          // Уже объект с нужными полями
          return {
            institution: item.institution || '',
            degree: item.degree || '',
            year: item.year ? Number(item.year) : null
          };
        }
        // Иначе считаем, что item - строка (название учебного заведения)
        return {
          institution: String(item),
          degree: '',
          year: null
        };
      });
    }
    
    // ========== ПРЕОБРАЗОВАНИЕ ЧИСЛОВЫХ ПОЛЕЙ ==========
    const parseNumber = (value, defaultValue = 0) => {
      if (value === undefined || value === null || value === '') return defaultValue;
      const num = Number(value);
      return isNaN(num) ? defaultValue : num;
    };
    
    const expNum = parseNumber(experience);
    const expYearsNum = parseNumber(experienceYears);
    const hourlyRateNum = parseNumber(hourlyRate);
    
    // ========== ОБРАБОТКА interests ==========
    let interestsArray = [];
    if (interests) {
      if (Array.isArray(interests)) {
        interestsArray = interests;
      } else if (typeof interests === 'string') {
        interestsArray = interests.split(',').map(i => i.trim()).filter(i => i !== '');
      } else {
        interestsArray = [String(interests)];
      }
    }
    
    // ========== СОЗДАНИЕ ПРОФИЛЯ УЧИТЕЛЯ ==========
    const teacher = new Teacher({
      userId: targetUserId,
      firstName: finalFirstName,
      lastName: finalLastName,
      language: teacherLanguage,
      specialization: specArray,
      qualification: qualification || '',
      experience: expNum,
      interests: interestsArray,
      contacts: {
        phone: phone || '',
        email: email || '',
        city: '',
        address: ''
      },
      // Сохраняем дополнительные поля из старого API для обратной совместимости
      bio: bio || '',
      experienceYears: expYearsNum,
      education: educationArray,
      hourlyRate: hourlyRateNum
    });
    
    await teacher.save();
    
    // Возвращаем учителя с populated данными пользователя
    const populatedTeacher = await Teacher.findById(teacher._id).populate('userId', 'login email phone avatar status');
    res.status(201).json(populatedTeacher);
  } catch (err) {
    // Детальное логирование ошибки с полным стеком
    console.error('Ошибка создания преподавателя:', err);
    console.error('Stack trace:', err.stack);
    // Возвращаем подробное сообщение об ошибке
    res.status(500).json({ error: err.message });
  }
});

// Обновить профиль учителя
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: 'Учитель не найден' });
    }
    // Только сам учитель или админ может обновлять
    if (req.userRole !== 'admin' && teacher.userId?.toString() !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    Object.assign(teacher, req.body);
    await teacher.save();
    res.json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удалить профиль учителя
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: 'Учитель не найден' });
    }
    if (req.userRole !== 'admin' && teacher.userId?.toString() !== req.userId) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    await teacher.deleteOne();
    res.json({ message: 'Профиль учителя удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;