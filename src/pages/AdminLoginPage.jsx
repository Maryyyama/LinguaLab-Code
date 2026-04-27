import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/App.css';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Проверка, не авторизован ли уже пользователь
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isAdminLoggedIn === 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Очищаем ошибку при вводе
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { login, password } = formData;
    
    // Проверка логина и пароля администратора
    if (login === 'admin' && password === 'admin52') {
      // Сохраняем статус авторизации в localStorage
      localStorage.setItem('isAdminLoggedIn', 'true');
      alert('Вход в админ-панель выполнен успешно!');
      navigate('/admin');
    } else {
      setError('Неверный логин или пароль!');
    }
  };

  return (
    <main className="entrance-main">
      <section className="entrance-section">
        <div className="entrance-container">
          
          {/* ФОРМА ВХОДА */}
          <div className="entrance-form-block">
            <div className="entrance-logo">
              <Link to="/" className="logo-link">
                <span className="logo-lingua">Lingua</span>
                <span className="logo-lab">Lab</span>
              </Link>
            </div>
            
            <h1 className="entrance-title">Вход в админ-панель</h1>
            <p className="entrance-desc">Введите логин и пароль для входа в админ-панель</p>
            
            <form className="entrance-form" onSubmit={handleSubmit}>
              <label htmlFor="login" className="entrance-label">Логин</label>
              <input
                type="text"
                id="login"
                name="login"
                className={`entrance-input ${error ? 'error' : ''}`}
                placeholder="Введите логин"
                value={formData.login}
                onChange={handleChange}
                required
              />
              
              <label htmlFor="password" className="entrance-label">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                className={`entrance-input ${error ? 'error' : ''}`}
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
                required
              />
              
              {error && <div className="error-message">{error}</div>}
              
              <button type="submit" className="entrance-btn">Войти</button>
            </form>
          </div>

          {/* ИЗОБРАЖЕНИЕ ДВЕРИ СПРАВА */}
          <div className="entrance-image-block">
            <img src="/media/дверь.png" alt="Дверь" className="entrance-door-img" />
          </div>
        </div>
      </section>

      {/* ФУТЕР */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-lingua">Lingua</span>
                <span className="logo-lab">Lab</span>
              </div>
              <div className="footer-description">
                LinguaLab — интерактивная платформа для легкого, удобного и быстрого изучения иностранных языков.
              </div>
            </div>

            {/* Обучение */}
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

            {/* Информация */}
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

            {/* Контакты */}
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

export default AdminLoginPage;