const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const path = require('path');

dotenv.config({ path: __dirname + '/.env' });

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/students');
const paymentRoutes = require('./routes/payments');
const teacherRoutes = require('./routes/teachers');
const requestRoutes = require('./routes/requests');
const userRoutes = require('./routes/users');
const settingsRoutes = require('./routes/settings');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Cron-задача: каждую минуту проверять истекшие баны
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    // Находим пользователей, у которых время бана истекло
    const expiredBans = await User.find({
      isBanned: true,
      bannedUntil: { $lt: now, $ne: null }
    });
    
    if (expiredBans.length > 0) {
      console.log(`🕐 Снятие бана для ${expiredBans.length} пользователей...`);
      
      for (const user of expiredBans) {
        user.isBanned = false;
        user.bannedUntil = null;
        await user.save();
        console.log(`✅ Пользователь ${user.login} разбанен (срок истек)`);
      }
    }
  } catch (error) {
    console.error('Ошибка при снятии бана:', error);
  }
});

console.log('⏰ Cron-задача для снятия банов запущена (каждую минуту)');

app.use(cors({
  origin: function (origin, callback) {
    // Разрешаем запросы без origin (например, от curl) и с localhost
    const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cache-Control', 'Pragma', 'Expires']
}));

// Middleware для логирования тела запроса
app.use((req, res, next) => {
  const oldWrite = res.write;
  const oldEnd = res.end;
  const chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);
    return oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks).toString('utf8');
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Request headers:', req.headers);
    console.log('Request body raw:', req.body);
    console.log('Response body:', body);
    oldEnd.apply(res, arguments);
  };

  next();
});

app.use(express.json());

// Статическая раздача медиафайлов (аватары преподавателей)
app.use('/media', express.static(path.join(__dirname, '..', 'media')));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Сервер работает' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📡 http://localhost:${PORT}/api/health`);
});