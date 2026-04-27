const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    default: 'LinguaLab'
  },
  adminEmail: {
    type: String,
    required: true,
    default: 'admin@lingualab.ru'
  },
  contactPhone: {
    type: String,
    default: ''
  },
  contactAddress: {
    type: String,
    default: ''
  },
  metaDescription: {
    type: String,
    default: ''
  },
  metaKeywords: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Гарантируем, что будет только один документ настроек
  collection: 'settings',
  versionKey: false
});

// Middleware для обновления updatedAt перед сохранением
SettingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Статический метод для получения единственного документа настроек
SettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    // Создаем настройки по умолчанию, если их нет
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', SettingsSchema);