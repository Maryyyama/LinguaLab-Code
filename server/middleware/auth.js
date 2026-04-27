const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('Token exists:', !!token);
    
    if (!token) {
      console.log('No token - returning 401');
      return res.status(401).json({ error: 'Требуется авторизация' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token - userId:', decoded.userId, 'role:', decoded.role);
    
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ error: 'Неверный токен' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора' });
  }
  next();
};

const teacherMiddleware = (req, res, next) => {
  if (req.userRole !== 'teacher' && req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Доступ запрещен. Требуются права преподавателя' });
  }
  next();
};

const checkBan = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return next();
    
    // Если истек временный бан - снимаем его
    if (user.bannedUntil && new Date(user.bannedUntil) <= new Date()) {
      user.isBanned = false;
      user.bannedUntil = null;
      await user.save();
      console.log(`✅ Автоматическое снятие бана для ${user.login}`);
      return next();
    }
    
    const isBanned = user.isBanned || (user.bannedUntil && new Date(user.bannedUntil) > new Date());
    
    if (isBanned) {
      if (user.bannedUntil) {
        return res.status(403).json({
          error: `Ваш аккаунт заблокирован до ${new Date(user.bannedUntil).toLocaleString('ru-RU')}`,
          bannedUntil: user.bannedUntil
        });
      } else {
        return res.status(403).json({ error: 'Ваш аккаунт заблокирован навсегда' });
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = { authMiddleware, adminMiddleware, teacherMiddleware, checkBan };