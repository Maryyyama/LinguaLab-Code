import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/App.css';

function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: '',
    phone: '',
    email: '',
    password: '',
    passwordRepeat: '',
    role: 'student',
    privacyPolicy: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Форматирование телефона при вводе
  const formatPhoneNumber = (value) => {
    let digits = value.replace(/\D/g, '');
    
    if (digits.length > 11) {
      digits = digits.substring(0, 11);
    }
    
    let formattedValue = '';
    if (digits.length > 0) {
      formattedValue = '+7 (';
      if (digits.length > 1) {
        formattedValue += digits.substring(1, 4);
      }
      if (digits.length > 4) {
        formattedValue += ') ' + digits.substring(4, 7);
      }
      if (digits.length > 7) {
        formattedValue += ' ' + digits.substring(7, 9);
      }
      if (digits.length > 9) {
        formattedValue += ' ' + digits.substring(9, 11);
      }
    }
    
    return formattedValue;
  };

  // Преобразование форматированного телефона в чистый номер (только цифры)
  const cleanPhoneNumber = (formattedPhone) => {
    return formattedPhone.replace(/\D/g, '');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Используем name вместо id для надежности
    if (name === 'phone') {
      setFormData(prev => ({
        ...prev,
        [name]: formatPhoneNumber(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.login) newErrors.login = 'Введите логин';
    if (!formData.phone) newErrors.phone = 'Введите телефон';
    if (!formData.email) newErrors.email = 'Введите email';
    if (!formData.password) newErrors.password = 'Введите пароль';
    if (!formData.passwordRepeat) newErrors.passwordRepeat = 'Повторите пароль';
    
    if (formData.password && formData.passwordRepeat && formData.password !== formData.passwordRepeat) {
      newErrors.passwordRepeat = 'Пароли не совпадают';
    }
    
    if (!formData.privacyPolicy) {
      newErrors.privacyPolicy = 'Необходимо согласие на обработку персональных данных';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    const phoneRegex = /^\+7 \(\d{3}\) \d{3} \d{2} \d{2}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Подготовка данных для API: удаляем passwordRepeat и privacyPolicy, очищаем телефон
      const { passwordRepeat, privacyPolicy, ...userData } = formData;
      const cleanedPhone = cleanPhoneNumber(userData.phone);
      const payload = {
        ...userData,
        phone: cleanedPhone
      };
      
      await api.register(payload);
      alert('Регистрация прошла успешно!');
      navigate('/entrance');
    } catch (err) {
      setErrors({ general: err.message || 'Ошибка регистрации. Попробуйте позже.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="entrance-main">
      <section className="entrance-section">
        <div className="entrance-container">
          
          <div className="entrance-form-block">
            <div className="entrance-logo">
              <Link to="/" className="logo-link">
                <span className="logo-lingua">Lingua</span>
                <span className="logo-lab">Lab</span>
              </Link>
            </div>
            
            <h1 className="entrance-title">Регистрация</h1>
            <p className="entrance-desc">
              На указанный номер поступит звонок с номера +7 (999) 999-XX-XX
            </p>
            
            <form className="entrance-form" onSubmit={handleSubmit}>
              {/* ЛОГИН */}
              <label htmlFor="login" className="entrance-label">Логин*</label>
              <input
                type="text"
                id="login"
                name="login"
                className={`entrance-input ${errors.login ? 'error' : ''}`}
                placeholder="Введите логин"
                value={formData.login}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.login && <div className="error-message">{errors.login}</div>}
              
              {/* ТЕЛЕФОН */}
              <label htmlFor="phone" className="entrance-label">Телефон*</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`entrance-input ${errors.phone ? 'error' : ''}`}
                placeholder="+7 900 123-45-67"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
              
              {/* ПОЧТА */}
              <label htmlFor="email" className="entrance-label">Почта*</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`entrance-input ${errors.email ? 'error' : ''}`}
                placeholder="hopanahopana@mail.ru"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
              
              {/* ПАРОЛЬ */}
              <label htmlFor="password" className="entrance-label">Пароль*</label>
              <input
                type="password"
                id="password"
                name="password"
                className={`entrance-input ${errors.password ? 'error' : ''}`}
                placeholder="************"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
              
              {/* ПОВТОР ПАРОЛЯ - ИСПРАВЛЕНО */}
              <label htmlFor="passwordRepeat" className="entrance-label">Повтор пароля*</label>
              <input
                type="password"
                id="passwordRepeat"
                name="passwordRepeat"
                className={`entrance-input ${errors.passwordRepeat ? 'error' : ''}`}
                placeholder="************"
                value={formData.passwordRepeat}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.passwordRepeat && <div className="error-message">{errors.passwordRepeat}</div>}
              
              {/* ЧЕКБОКС СОГЛАСИЯ - ИСПРАВЛЕНО */}
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="privacyPolicy"
                  name="privacyPolicy"
                  className="entrance-checkbox"
                  checked={formData.privacyPolicy}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="privacyPolicy" className="entrance-checkbox-label">
                  Я согласен(а) на обработку персональных данных
                </label>
              </div>
              {errors.privacyPolicy && <div className="error-message">{errors.privacyPolicy}</div>}
              
              {/* Общая ошибка */}
              {errors.general && <div className="error-message general-error">{errors.general}</div>}
              
              <button 
                type="submit" 
                className="entrance-btn" 
                disabled={loading}
              >
                {loading ? 'Регистрация...' : 'Продолжить'}
              </button>
            </form>
          </div>

          <div className="entrance-image-block">
            <img src="/media/дверь.png" alt="Дверь" className="entrance-door-img" />
          </div>
        </div>
      </section>

      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-lingua">Lingua</span>
                <span className="logo-lab">Lab</span>
              </div>
              <div className="footer-description">
                LinguaLab — интерактивная платформа для легкого, удобного и быстрого изучения иностранных языков.
              </div>
            </div>

            <div>
              <div className="footer-title">Обучение</div>
              <ul className="footer-links">
                <li>Все языки</li>
                <li>Взрослым</li>
                <li>Детям и подросткам</li>
                <li>Мини-курсы</li>
                <li>Тренажёры</li>
                <li>Индивидуальные занятия</li>
              </ul>
            </div>

            <div>
              <div className="footer-title">Информация</div>
              <ul className="footer-links">
                <li>О нас</li>
                <li>Отзывы</li>
                <li>Новости</li>
                <li>Частые вопросы</li>
                <li>Условия оплаты</li>
                <li>Контакты</li>
              </ul>
            </div>

            <div>
              <div className="footer-title">Контакты</div>
              <ul className="footer-contacts">
                <li><b>+7 (333) 156-14-88</b></li>
                <li>LinguaLab@mail.ru</li>
                <li>414000, Астрахань, Россия</li>
              </ul>
              <div className="footer-title">Лицензирование</div>
              <ul className="footer-links">
                <li>Лицензионное соглашение</li>
                <li>Политика конфиденциальности</li>
                <li>Условия использования</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default RegistrationPage;