const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB подключена: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Ошибка подключения к MongoDB: ${error.message}`);
    console.log('⚠️ Сервер продолжает работу без базы данных');
    // Не завершаем процесс, чтобы сервер мог работать
  }
};

module.exports = connectDB;