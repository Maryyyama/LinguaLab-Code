import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/App.css';

function EntrancePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);
   setError('');
   
   try {
     const data = await api.login(formData);
     console.log('Login response:', data); // Выводим структуру ответа
     localStorage.setItem('token', data.token);
     localStorage.setItem('user', JSON.stringify(data.user));
     
     if (data.user.role === 'admin') {
       navigate('/admin');
     } else if (data.user.role === 'teacher') {
       // Берём ID из ответа логина
       let teacherId = data.profile?._id;
       
       if (!teacherId) {
         // Пытаемся найти teacherId через запрос к API учителей
         try {
           const teachers = await api.getTeachers();
           const teacher = teachers.find(t => t.userId?._id === data.user.id || t.userId === data.user.id);
           if (teacher) {
             teacherId = teacher._id;
             console.log('Found teacher ID via API:', teacherId);
           } else {
             console.error('Teacher not found in teachers list');
           }
         } catch (err) {
           console.error('Failed to fetch teachers:', err);
         }
       }
       
       if (teacherId) {
         localStorage.setItem('teacherId', teacherId);
         navigate(`/teacher/personal/${teacherId}`);
       } else {
         console.error('Teacher ID not found in login response:', data);
         alert('Ошибка: ID преподавателя не найден. Обратитесь к администратору.');
       }
     } else {
       navigate('/');
     }
   } catch (err) {
     setError(err.message);
   } finally {
     setLoading(false);
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
            
            <h1 className="entrance-title">Вход в кабинет</h1>
            <p className="entrance-desc">Введите логин и пароль для входа в личный кабинет</p>
            
            <form className="entrance-form" onSubmit={handleSubmit}>
              <label htmlFor="login" className="entrance-label">Логин</label>
              <input
                type="text"
                id="login"
                name="login"
                className="entrance-input"
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
                className="entrance-input"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
                required
              />
              
              <button type="submit" className="entrance-btn" disabled={loading}>
                {loading ? 'Вход...' : 'Войти'}
              </button>
              {error && <div className="error-message">{error}</div>}
            </form>
            
            <div className="entrance-or"><span>или</span></div>
            
            {/* СОЦИАЛЬНЫЕ КНОПКИ */}
            <div className="entrance-socials">
              <button className="entrance-social entrance-social-gosuslugi">
                <img src="/media/госуслуги.png" alt="Госуслуги" />
                Войти через Госуслуги
              </button>
              <button className="entrance-social entrance-social-vk">
                <img src="/media/вк.png" alt="Вконтакте" />
                Войти через Вконтакте
              </button>
              <button className="entrance-social entrance-social-ya">
                <img src="/media/яндекс.png" alt="ЯндексID" />
                Войти через ЯндексID
              </button>
            </div>
            
            <div className="entrance-register">
              Нет аккаунта?
              <Link to="/registration" className="entrance-register-link">
                Зарегистрироваться
              </Link>
            </div>
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

export default EntrancePage;