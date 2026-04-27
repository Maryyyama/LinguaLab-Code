import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/App.css';
import api from '../services/api';

function KoreanPaymentPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedPrice = localStorage.getItem('coursePrice');
    const savedLevel = localStorage.getItem('courseLevel');
    console.log('Страница счета - загружено:', { savedPrice, savedLevel });
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = async () => {
    const newErrors = {};
    
    // Проверка email
    if (!formData.email) {
      newErrors.email = 'Введите email';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Введите корректный email';
    } else {
      // Проверка существования email в базе
      try {
        const checkResult = await api.checkUserExists(formData.email, '');
        if (!checkResult.emailExists) {
          newErrors.email = 'Пользователь с таким email не найден. Зарегистрируйтесь';
        }
      } catch (error) {
        console.error('Ошибка проверки email:', error);
      }
    }
    
    // Проверка пароля
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    } else if (formData.email && validateEmail(formData.email)) {
      // Проверка правильности пароля
      try {
        const verifyResult = await api.verifyPassword(formData.email, formData.password);
        if (!verifyResult.isValid) {
          newErrors.password = 'Неверный пароль';
        }
      } catch (error) {
        console.error('Ошибка проверки пароля:', error);
        if (error.message === 'Пользователь не найден') {
          newErrors.email = 'Пользователь с таким email не найден';
        } else {
          newErrors.password = 'Ошибка проверки пароля';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayClick = async () => {
    setLoading(true);
    const isValid = await validateForm();
    
    if (isValid) {
      const savedPrice = localStorage.getItem('coursePrice');
      const savedLevel = localStorage.getItem('courseLevel');
      const savedCourseId = localStorage.getItem('currentCourseId');
      
      console.log('Переход к оплате с данными:', { savedPrice, savedLevel, savedCourseId });
      
      localStorage.setItem('paymentEmail', formData.email);
      localStorage.setItem('courseLanguage', 'korean');
      localStorage.setItem('coursePrice', savedPrice || '6520');
      localStorage.setItem('currentCourseId', savedCourseId);
      localStorage.setItem('courseLevel', savedLevel || 'beginner');
      navigate('/oplata-korean');
    }
    setLoading(false);
  };

  const handleLoginClick = () => {
    navigate('/entrance');
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/registration');
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    navigate('/courses');
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <header className="payment-header">
        <div className="payment-header__container">
          <Link to="/">
            <img src="/media/логотип LinguaLab.png" alt="LinguaLab" className="payment-logo" />
          </Link>
          <img 
            src="/media/вернуться.png" 
            alt="Назад" 
            className="payment-header__back" 
            onClick={handleBackClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </header>

      <main className="payment-main">
        <section className="payment-order">
          <div className="payment-order__form-block">
            <div className="payment-order__steps">
              <span className="payment-order__step payment-order__step--active">Счет</span>
              <span className="payment-order__divider">—</span>
              <span className="payment-order__step payment-order__step--inactive">Оплата</span>
            </div>
            
            <form className="payment-order__form" onSubmit={(e) => e.preventDefault()}>
              <h2 className="payment-order__title">Данные покупателя</h2>
              
              <label className="payment-order__label">
                Электронная почта
                <input 
                  type="email" 
                  name="email"
                  className={`payment-order__input ${errors.email ? 'error' : ''}`} 
                  placeholder="Электронная почта" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </label>
              
              <label className="payment-order__label">
                Пароль
                <input 
                  type="password" 
                  name="password"
                  className={`payment-order__input ${errors.password ? 'error' : ''}`} 
                  placeholder="Пароль" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </label>
              
              <div className="payment-order__actions">
                <button
                  type="button"
                  className="payment-order__register"
                  onClick={handleRegisterClick}
                >
                  Зарегистрироваться для учетной записи
                </button>
                <button
                  type="button"
                  className="payment-order__login"
                  onClick={handleLoginClick}
                >
                  Войти
                </button>
              </div>
              
              <div className="payment-order__footer">
                <button
                  type="button"
                  className="payment-order__cancel"
                  onClick={handleCancelClick}
                >
                  Отменить заказ
                </button>
                <button
                  type="button"
                  className="payment-order__pay"
                  onClick={handlePayClick}
                  disabled={loading}
                >
                  {loading ? 'Проверка...' : 'Перейти к оплате'}
                </button>
              </div>
            </form>
          </div>

          <div className="payment-order__course-block">
            <img 
              src="/media/оплата курса по корейскому.png" 
              alt="Korean Course" 
              className="payment-order__course-img" 
            />
            <div className="payment-order__course-info">
              <span className="payment-order__course-label">Цена к оформлению:</span>
              <span className="payment-order__course-price">
                {localStorage.getItem('coursePrice') ? `${localStorage.getItem('coursePrice')} Р` : '6520 Р'}
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className="payment-footer">
        <div className="payment-footer__container">
          <div className="payment-footer__col payment-footer__col--brand">
            <Link to="/">
              <img src="/media/логотип LinguaLab.png" alt="LinguaLab" className="payment-logo" />
            </Link>
            <p className="payment-footer__desc">
              LinguaLab — интерактивная платформа для легкого, удобного и быстрого изучения иностранных языков.
            </p>
          </div>
          
          <div className="payment-footer__col">
            <h3 className="payment-footer__title">Обучение</h3>
            <ul className="payment-footer__list">
              <li>Все языки</li>
              <li>Взрослым</li>
              <li>Детям и подросткам</li>
              <li>Мини-курсы</li>
              <li>Тренажеры</li>
              <li>Индивидуальные занятия</li>
            </ul>
          </div>
          
          <div className="payment-footer__col">
            <h3 className="payment-footer__title">Информация</h3>
            <ul className="payment-footer__list">
              <li>О нас</li>
              <li>Отзывы</li>
              <li>Новости</li>
              <li>Частые вопросы</li>
              <li>Условия оплата</li>
              <li>Контакты</li>
            </ul>
          </div>
          
          <div className="payment-footer__col">
            <h3 className="payment-footer__title">Контакты</h3>
            <ul className="payment-footer__list">
              <li>+7 (333) 156-14-88</li>
              <li>Lingualab@mail.ru</li>
              <li>414000, Астрахань, Россия</li>
              <li><b>Лицензирование</b></li>
              <li>Лицензионное соглашение</li>
              <li>Политика конфиденциальности</li>
              <li>Условия использования</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}

export default KoreanPaymentPage;