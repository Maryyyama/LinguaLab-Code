const { check, validationResult } = require('express-validator');

// Валидация регистрации
const registerValidation = [
  check('email').isEmail().withMessage('Введите корректный email'),
  check('password').isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов'),
  check('firstName').notEmpty().withMessage('Имя обязательно'),
  check('lastName').notEmpty().withMessage('Фамилия обязательна'),
];

// Валидация входа
const loginValidation = [
  check('email').isEmail().withMessage('Введите корректный email'),
  check('password').notEmpty().withMessage('Пароль обязателен'),
];

// Валидация курса
const courseValidation = [
  check('title').notEmpty().withMessage('Название курса обязательно'),
  check('description').notEmpty().withMessage('Описание обязательно'),
  check('language').isIn(['english', 'german', 'spanish', 'chinese', 'french', 'japanese', 'korean']).withMessage('Недопустимый язык'),
  check('price').isFloat({ min: 0 }).withMessage('Цена должна быть положительным числом'),
  check('startDate').isISO8601().withMessage('Дата начала должна быть в формате ISO'),
];

// Валидация платежа
const paymentValidation = [
  check('courseId').notEmpty().withMessage('ID курса обязательно'),
  check('paymentMethod').isIn(['card', 'bank_transfer', 'yandex_money', 'qiwi', 'paypal']).withMessage('Недопустимый метод оплаты'),
];

// Обработка ошибок валидации
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  courseValidation,
  paymentValidation,
  validate,
};