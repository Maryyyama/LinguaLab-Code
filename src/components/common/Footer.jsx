import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/media/логотип LinguaLab.png" alt="LinguaLab" className="footer-logo-img" />
            </Link>
            <p className="footer-description">
              Интерактивная платформа для легкого, удобного и быстрого изучения иностранных языков
            </p>
          </div>
          
          {/* Learning Column */}
          <div className="footer-column">
            <h3 className="footer-title">Обучение</h3>
            <ul className="footer-links">
              <li><Link to="/courses">Все языки</Link></li>
              <li><Link to="/courses/adults">Взрослым</Link></li>
              <li><Link to="/courses/kids">Детям и подросткам</Link></li>
              <li><Link to="/mini-courses">Мини-курсы</Link></li>
              <li><Link to="/trainers">Тренажеры</Link></li>
              <li><Link to="/individual">Индивидуальные занятия</Link></li>
            </ul>
          </div>
          
          {/* Information Column */}
          <div className="footer-column">
            <h3 className="footer-title">Информация</h3>
            <ul className="footer-links">
              <li><Link to="/about">О нас</Link></li>
              <li><Link to="/reviews">Отзывы</Link></li>
              <li><Link to="/news">Новости</Link></li>
              <li><Link to="/faq">Частые вопросы</Link></li>
              <li><Link to="/payment">Условия оплаты</Link></li>
              <li><Link to="/contacts">Контакты</Link></li>
            </ul>
          </div>
          
          {/* Contacts Column */}
          <div className="footer-column">
            <h3 className="footer-title">Контакты</h3>
            <ul className="footer-contacts">
              <li>+7 (333) 156-14-88</li>
              <li><a href="mailto:LinguaLab@mail.ru">LinguaLab@mail.ru</a></li>
              <li>414000, Астрахань, Россия</li>
            </ul>
            <h3 className="footer-title">Лицензирование</h3>
            <ul className="footer-links">
              <li><Link to="/license">Лицензионное соглашение</Link></li>
              <li><Link to="/privacy">Политика конфиденциальности</Link></li>
              <li><Link to="/terms">Условия использования</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;