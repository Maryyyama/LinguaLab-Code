const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { login, email, password, phone, role = 'student' } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ login }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }
    
    const user = new User({ login, email, password, phone, role });
    await user.save();
    
    if (role === 'student') {
      const student = new Student({
        userId: user._id,
        firstName: '',
        lastName: '',
        enrolledCourses: []
      });
      await student.save();
    } else if (role === 'teacher') {
      const teacher = new Teacher({ userId: user._id });
      await teacher.save();
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: { id: user._id, login: user.login, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body.login);
    const { login, password } = req.body;
    
    const user = await User.findOne({ $or: [{ login }, { email: login }] });
    console.log('User found:', user ? 'yes' : 'no');
    
    if (!user) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }
    
    const isValid = await user.comparePassword(password);
    console.log('Password valid:', isValid);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }
    
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id });
    } else if (user.role === 'teacher') {
      // Ищем ВСЕ профили преподавателя для данного пользователя
      // Из-за возможных проблем с уникальным индексом, используем более надежный метод
      const allProfiles = await Teacher.find({});
      const profiles = allProfiles.filter(p => p.userId && p.userId.toString() === user._id.toString());
      console.log(`Found ${profiles.length} teacher profiles for user ${user._id} (manual filter):`,
                 profiles.map(p => ({
                   id: p._id,
                   firstName: p.firstName || '(empty)',
                   specLen: p.specialization?.length || 0,
                   createdAt: p.createdAt
                 })));
      
      if (profiles.length === 0) {
        // Нет профилей - создаем новый
        console.log('Creating new teacher profile for user:', user._id);
        profile = new Teacher({
          userId: user._id,
          license: { status: 'active' }
        });
        await profile.save();
      } else if (profiles.length === 1) {
        // Один профиль - используем его
        profile = profiles[0];
        console.log('Found single teacher profile:', profile._id,
                   `firstName: "${profile.firstName}", specialization: ${profile.specialization?.length || 0} items`);
      } else {
        // Несколько профилей - выбираем лучший (с данными)
        // Сначала ищем профиль с заполненными данными (firstName или specialization)
        let bestProfile = profiles.find(p =>
          (p.firstName && p.firstName.trim() !== '') ||
          (p.specialization && p.specialization.length > 0)
        );
        
        console.log('Profile selection - bestProfile with data:', bestProfile ? bestProfile._id : 'none');
        
        // Если не нашли профиль с данными, берем самый старый (первый по дате создания)
        if (!bestProfile) {
          bestProfile = profiles.reduce((oldest, current) => {
            const oldestDate = oldest.createdAt ? new Date(oldest.createdAt) : new Date(0);
            const currentDate = current.createdAt ? new Date(current.createdAt) : new Date(0);
            return oldestDate < currentDate ? oldest : current;
          });
          console.log('Selected oldest profile:', bestProfile._id);
        }
        
        profile = bestProfile;
        console.log(`Selected teacher profile:`, profile._id,
                   `firstName: "${profile.firstName}", specialization: ${profile.specialization?.length || 0} items`);
        
        // Если выбран пустой профиль, но есть профиль с данными (на всякий случай)
        const profileWithData = profiles.find(p =>
          (p.firstName && p.firstName.trim() !== '') ||
          (p.specialization && p.specialization.length > 0)
        );
        if (!profile.firstName && !profile.specialization?.length && profileWithData) {
          console.log('WARNING: Selected empty profile but found profile with data, switching to:', profileWithData._id);
          profile = profileWithData;
        }
      }
    }

    res.json({
      token,
      user: { id: user._id, login: user.login, email: user.email, role: user.role },
      profile: profile ? { _id: profile._id } : null
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Проверка существования пользователя по email и логину
router.post('/check-user', async (req, res) => {
  try {
    const { email, login } = req.body;
    
    const userByEmail = email ? await User.findOne({ email }) : null;
    const userByLogin = login ? await User.findOne({ login }) : null;
    
    res.json({
      exists: !!(userByEmail || userByLogin),
      emailExists: !!userByEmail,
      loginExists: !!userByLogin
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Проверка пароля пользователя
router.post('/verify-password', async (req, res) => {
  try {
    const { login, password } = req.body;
    
    const user = await User.findOne({ $or: [{ login }, { email: login }] });
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    const isValid = await user.comparePassword(password);
    res.json({ isValid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получение текущего пользователя
router.get('/me', authMiddleware, async (req, res) => {
  try {
    console.log('GET /me - userId:', req.userId);
    
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      console.log('User not found for id:', req.userId);
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    console.log('User found:', user.login, user.role);
    
    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id });
      console.log('Student profile:', profile ? 'found' : 'not found');
    } else if (user.role === 'teacher') {
      profile = await Teacher.findOne({ userId: user._id });
      console.log('Teacher profile:', profile ? 'found' : 'not found');
    }
    
    res.json({
      user,
      profile: profile ? { _id: profile._id, ...profile.toObject() } : null
    });
  } catch (error) {
    console.error('Error in GET /me:', error);
    res.status(500).json({ error: error.message });
  }
});

// Проверка статуса бана текущего пользователя
router.get('/ban-status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const isBanned = user.isBanned || (user.bannedUntil && new Date(user.bannedUntil) > new Date());
    const bannedUntil = user.bannedUntil;
    const violationCount = user.violationCount || 0;
    const lastViolationDate = user.lastViolationDate;

    res.json({
      isBanned,
      bannedUntil,
      violationCount,
      lastViolationDate,
      message: isBanned ?
        (user.isBanned ? 'Вы заблокированы навсегда' :
         `Вы заблокированы до ${new Date(bannedUntil).toLocaleString('ru-RU')}`) :
        'Вы не заблокированы'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;