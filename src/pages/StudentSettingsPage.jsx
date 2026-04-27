import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/App.css';

function StudentSettingsPage() {
  const navigate = useNavigate();

  // Проверка авторизации
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/entrance');
      return;
    }
  }, [navigate]);

  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'Только преподавателям',
    gradeVisibility: 'Только преподавателям'
  });

  // Загрузка сохраненных настроек
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user._id;
    
    const savedTheme = localStorage.getItem(`theme_${userId}`);
    if (savedTheme) setTheme(savedTheme);
    
    const savedNotifications = localStorage.getItem(`notifications_${userId}`);
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    
    const savedPrivacy = localStorage.getItem(`privacy_${userId}`);
    if (savedPrivacy) setPrivacy(JSON.parse(savedPrivacy));
  }, []);

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem(`theme_${user.id || user._id}`, selectedTheme);
  };

  const handleNotificationToggle = (type) => {
    const updated = { ...notifications, [type]: !notifications[type] };
    setNotifications(updated);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem(`notifications_${user.id || user._id}`, JSON.stringify(updated));
  };

  const handlePrivacyChange = (type, value) => {
    const updated = { ...privacy, [type]: value };
    setPrivacy(updated);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem(`privacy_${user.id || user._id}`, JSON.stringify(updated));
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
      localStorage.clear();
      alert('Аккаунт удален');
      navigate('/');
    }
  };

  const handleEdit = () => {
    alert('Режим редактирования будет доступен в следующей версии');
  };

  return (
    <>
      <Header />
      <div className="breadcrumbs">Настройки {'>'} Обновить профиль</div>
      <main className="main">
        <div className="main__container">
          <aside className="sidebar">
            <Link to="/student-info" className="sidebar__btn">Личные данные</Link>
            <Link to="/student-contact" className="sidebar__btn">Контактные данные</Link>
            <Link to="/grade" className="sidebar__btn">Успеваемость</Link>
            <button className="sidebar__btn sidebar__btn--active">Настройки</button>
          </aside>

          <section className="settings">
            <div className="settings__edit" onClick={handleEdit}>
              <span>Редактировать</span>
              <svg width="18" height="18" fill="none">
                <rect width="18" height="18" fill="#fff"/>
                <path d="M13.5 6.5L11.5 4.5L5 11V13H7L13.5 6.5Z" stroke="#BDBDBD" strokeWidth="1.2"/>
              </svg>
            </div>

            <form className="settings__form">
              <div className="settings__row">
                <div className="settings__col">
                  <div className="settings__label">Тема оформления</div>
                  <label className="settings__checkbox">
                    <input type="checkbox" checked={theme === 'light'} onChange={() => handleThemeChange('light')} />
                    Светлая
                  </label>
                  <label className="settings__checkbox">
                    <input type="checkbox" checked={theme === 'dark'} onChange={() => handleThemeChange('dark')} />
                    Тёмная
                  </label>
                  <label className="settings__checkbox">
                    <input type="checkbox" checked={theme === 'system'} onChange={() => handleThemeChange('system')} />
                    Системная
                  </label>
                </div>

                <div className="settings__col">
                  <div className="settings__label">Безопасность</div>
                  <div>
                    Двухфакторная аутентификация:
                    <span className="settings__link" onClick={() => alert('Функция будет доступна позже')}>Выкл</span>
                  </div>
                  <div>
                    Смена пароля:
                    <span className="settings__link" onClick={() => alert('Функция будет доступна позже')}>Настроить</span>
                  </div>
                </div>
              </div>

              <div className="settings__row">
                <div className="settings__col">
                  <div className="settings__label">Уведомления</div>
                  <div>
                    Email-уведомления:
                    <span className="settings__link" onClick={() => handleNotificationToggle('email')}>
                      {notifications.email ? 'Вкл' : 'Выкл'}
                    </span>
                  </div>
                  <div>
                    SMS-уведомления:
                    <span className="settings__link" onClick={() => handleNotificationToggle('sms')}>
                      {notifications.sms ? 'Вкл' : 'Выкл'}
                    </span>
                  </div>
                  <div>
                    Push-уведомления:
                    <span className="settings__link" onClick={() => handleNotificationToggle('push')}>
                      {notifications.push ? 'Вкл' : 'Выкл'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="settings__row">
                <div className="settings__col">
                  <div className="settings__label">Приватность</div>
                  <div>
                    Видимость профиля:
                    <span className="settings__link" onClick={() => {
                      const options = ['Только преподавателям', 'Всем пользователям', 'Только мне'];
                      const currentIndex = options.indexOf(privacy.profileVisibility);
                      const nextIndex = (currentIndex + 1) % options.length;
                      handlePrivacyChange('profileVisibility', options[nextIndex]);
                    }}>
                      {privacy.profileVisibility} ▼
                    </span>
                  </div>
                  <div>
                    Видимость успеваемости:
                    <span className="settings__link" onClick={() => {
                      const options = ['Только преподавателям', 'Всем пользователям', 'Только мне'];
                      const currentIndex = options.indexOf(privacy.gradeVisibility);
                      const nextIndex = (currentIndex + 1) % options.length;
                      handlePrivacyChange('gradeVisibility', options[nextIndex]);
                    }}>
                      {privacy.gradeVisibility} ▼
                    </span>
                  </div>
                </div>
              </div>

              <div className="settings__row settings__row--end">
                <button type="button" className="settings__delete" onClick={handleDeleteAccount}>
                  Удалить аккаунт
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default StudentSettingsPage;