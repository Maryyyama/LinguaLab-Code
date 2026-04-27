import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/App.css';

function OplataGermanPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [errors, setErrors] = useState({});
  const [coursePrice, setCoursePrice] = useState('6520 Р');
  const [courseId, setCourseId] = useState('');
  const [courseLevel, setCourseLevel] = useState('beginner');
  const [courseGroup, setCourseGroup] = useState('Standard Group');
  const [loading, setLoading] = useState(false);
  const courseImage = '/media/оплата курса по немецкому.png';

  // Загружаем данные из localStorage при монтировании
  useEffect(() => {
    const savedPrice = localStorage.getItem('coursePrice');
    const savedLanguage = localStorage.getItem('courseLanguage');
    const savedCourseId = localStorage.getItem('currentCourseId');
    const savedLevel = localStorage.getItem('courseLevel');
    const savedGroup = localStorage.getItem('courseGroup');
    
    if (savedPrice) {
      setCoursePrice(`${savedPrice} Р`);
    }
    if (savedCourseId) {
      setCourseId(savedCourseId);
    }
    if (savedLevel) {
      setCourseLevel(savedLevel);
    }
    if (savedGroup) {
      setCourseGroup(savedGroup);
    }
    
    // Если язык не немецкий, но мы на странице немецкого - перенаправляем
    if (savedLanguage && savedLanguage !== 'german') {
      if (savedLanguage === 'english') navigate('/oplata-english');
      else if (savedLanguage === 'spanish') navigate('/oplata-spanish');
      else if (savedLanguage === 'chinese') navigate('/oplata-chinese');
    }
  }, [navigate]);

  // Форматирование номера карты (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    const groups = [];
    
    for (let i = 0; i < digits.length && i < 16; i += 4) {
      groups.push(digits.substr(i, 4));
    }
    
    return groups.join(' ');
  };

  // Форматирование даты (MM/YY)
  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return digits.substr(0, 2) + '/' + digits.substr(2, 2);
    }
    return digits;
  };

  // Валидация даты карты
  const validateExpiry = (expiry) => {
    const digits = expiry.replace(/\D/g, '');
    if (digits.length !== 4) return false;
    
    const month = parseInt(digits.substr(0, 2));
    const year = parseInt('20' + digits.substr(2, 2));
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    if (month < 1 || month > 12) return false;
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiry') {
      formattedValue = formatExpiry(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Проверка существования пользователя по логину
  const checkLoginExists = async (login) => {
    try {
      const checkResult = await api.checkUserExists('', login);
      return checkResult.loginExists;
    } catch (error) {
      console.error('Ошибка проверки логина:', error);
      return false;
    }
  };

  const validateForm = async () => {
    const newErrors = {};
    
    // Проверка логина
    if (!formData.login.trim()) {
      newErrors.login = 'Введите логин';
    } else {
      const exists = await checkLoginExists(formData.login);
      if (!exists) {
        newErrors.login = 'Пользователь с таким логином не найден';
      }
    }
    
    // Проверка номера карты
    const cardDigits = formData.cardNumber.replace(/\D/g, '');
    if (cardDigits.length !== 16) {
      newErrors.cardNumber = 'Введите корректный номер карты (16 цифр)';
    }
    
    // Проверка даты
    if (!formData.expiry) {
      newErrors.expiry = 'Введите дату';
    } else if (!validateExpiry(formData.expiry)) {
      newErrors.expiry = 'Введите корректную дату (ММ/ГГ). Дата не может быть раньше текущего месяца';
    }
    
    // Проверка CVC
    if (formData.cvc.length !== 3) {
      newErrors.cvc = 'Введите корректный CVC (3 цифры)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBuyClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const isValid = await validateForm();
    
    if (isValid) {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          alert('Необходимо войти в систему');
          navigate('/entrance');
          setLoading(false);
          return;
        }

        // Проверка бана пользователя
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const isBanned = user.isBanned || (user.bannedUntil && new Date(user.bannedUntil) > new Date());
        if (isBanned) {
          const until = user.bannedUntil ? new Date(user.bannedUntil).toLocaleString('ru-RU') : 'навсегда';
          alert(`Вы заблокированы и не можете совершать оплату. ${until !== 'навсегда' ? `Блокировка действует до ${until}` : 'Блокировка постоянная.'}`);
          setLoading(false);
          return;
        }

        // Создаем платеж
        const language = localStorage.getItem('courseLanguage') || 'german';
        const level = courseLevel || localStorage.getItem('courseLevel') || 'beginner';
        const group = courseGroup || localStorage.getItem('courseGroup') || 'Standard Group';
        
        const paymentData = {
          courseId: courseId,
          paymentMethod: 'card',
          language,
          level,
          group
        };
        
        const payment = await api.createPayment(paymentData);
        
        if (payment && payment.status === 'completed') {
          alert('Оплата прошла успешно! Вы записаны на курс.');
          navigate('/student-info');
        } else {
          alert('Ошибка при оплате. Попробуйте позже.');
        }
      } catch (error) {
        console.error('Ошибка оплаты:', error);
        alert(error.message || 'Ошибка при оплате. Попробуйте позже.');
      }
    }
    setLoading(false);
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
      <header className="oplata-header">
        <div className="oplata-header__container">
          <Link to="/">
            <img src="/media/логотип LinguaLab.png" alt="LinguaLab" className="oplata-logo" />
          </Link>
          <img 
            src="/media/вернуться.png" 
            alt="Назад" 
            className="oplata-header__back" 
            onClick={handleBackClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </header>

      <main className="oplata-main">
        <section className="oplata-order">
          <div className="oplata-order__form-block">
            <div className="oplata-order__steps">
              <span className="oplata-order__step oplata-order__step--inactive">Счет</span>
              <span className="oplata-order__divider">—</span>
              <span className="oplata-order__step oplata-order__step--active">Оплата</span>
            </div>
            
            <form className="oplata-order__form" onSubmit={handleBuyClick}>
              <h2 className="oplata-order__title">Детали оплаты</h2>
              
              <label className="oplata-order__label">
                Логин*
                <input 
                  type="text" 
                  name="login"
                  className={`oplata-order__input ${errors.login ? 'error' : ''}`} 
                  placeholder="Введите логин" 
                  value={formData.login}
                  onChange={handleChange}
                  required 
                />
                {errors.login && <span className="error-message">{errors.login}</span>}
              </label>
              
              <label className="oplata-order__label">
                Номер карты*
                <input 
                  type="text" 
                  name="cardNumber"
                  className={`oplata-order__input ${errors.cardNumber ? 'error' : ''}`} 
                  placeholder="2200 7017 14 88" 
                  value={formData.cardNumber}
                  onChange={handleChange}
                  maxLength="19"
                  required 
                />
                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
              </label>
              
              <div className="oplata-order__row">
                <label className="oplata-order__label oplata-order__label--short">
                  Дата
                  <input 
                    type="text" 
                    name="expiry"
                    className={`oplata-order__input ${errors.expiry ? 'error' : ''}`} 
                    placeholder="MM/YY" 
                    value={formData.expiry}
                    onChange={handleChange}
                    maxLength="5"
                  />
                  {errors.expiry && <span className="error-message">{errors.expiry}</span>}
                </label>
                
                <label className="oplata-order__label oplata-order__label--short">
                  CVC
                  <input 
                    type="text" 
                    name="cvc"
                    className={`oplata-order__input ${errors.cvc ? 'error' : ''}`} 
                    placeholder="123" 
                    value={formData.cvc}
                    onChange={handleChange}
                    maxLength="3"
                  />
                  {errors.cvc && <span className="error-message">{errors.cvc}</span>}
                </label>
              </div>
              
              <button
                type="button"
                className="oplata-order__cancel"
                onClick={handleCancelClick}
              >
                Отменить заказ
              </button>
            </form>
          </div>

          <div className="oplata-order__course-block">
            <img 
              src={courseImage} 
              alt="German Course" 
              className="oplata-order__course-img" 
            />
            <div className="oplata-order__course-info">
              <span className="oplata-order__course-label">Цена к оформлению:</span>
              <span className="oplata-order__course-price">{coursePrice}</span>
            </div>
            <button 
              className="oplata-order__buy-btn" 
              onClick={handleBuyClick}
              disabled={loading}
            >
              {loading ? 'Обработка...' : 'Купить'}
            </button>
          </div>
        </section>
      </main>

      <footer className="oplata-footer">
        <div className="oplata-footer__container">
          <div className="oplata-footer__col oplata-footer__col--brand">
            <Link to="/">
              <img src="/media/логотип LinguaLab.png" alt="LinguaLab" className="oplata-logo" />
            </Link>
            <p className="oplata-footer__desc">
              LinguaLab — интерактивная платформа для легкого, удобного и быстрого изучения иностранных языков.
            </p>
          </div>
          
          <div className="oplata-footer__col">
            <h3 className="oplata-footer__title">Обучение</h3>
            <ul className="oplata-footer__list">
              <li>Все языки</li>
              <li>Взрослым</li>
              <li>Детям и подросткам</li>
              <li>Мини-курсы</li>
              <li>Тренажеры</li>
              <li>Индивидуальные занятия</li>
            </ul>
          </div>
          
          <div className="oplata-footer__col">
            <h3 className="oplata-footer__title">Информация</h3>
            <ul className="oplata-footer__list">
              <li>О нас</li>
              <li>Отзывы</li>
              <li>Новости</li>
              <li>Частые вопросы</li>
              <li>Условия оплаты</li>
              <li>Контакты</li>
            </ul>
          </div>
          
          <div className="oplata-footer__col">
            <h3 className="oplata-footer__title">Контакты</h3>
            <ul className="oplata-footer__list">
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

export default OplataGermanPage;