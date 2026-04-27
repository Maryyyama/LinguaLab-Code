import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/App.css';

function TeacherSettingsPage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState({
    name: '',
    language: '',
    license: '',
    nextCheck: ''
  });
  
  // Настройки по умолчанию
  const [settings, setSettings] = useState({
    theme: 'light', // light, dark, system
    twoFactorAuth: false,
    scheduleNotifications: true,
    meetingReminders: true,
    showRating: true,
    showWorkload: 'Только администрации',
    studentVisibility: 'Основная информация',
    colleagueVisibility: 'Полный доступ'
  });

  const [originalSettings, setOriginalSettings] = useState({});

  // Загрузка данных учителя из localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      alert('Доступ запрещен. Требуется авторизация.');
      navigate('/entrance');
      return;
    }
    
    let user = null;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error('Failed to parse user', e);
      navigate('/entrance');
      return;
    }
    
    if (user.role !== 'teacher') {
      alert('Доступ запрещен. Только для преподавателей.');
      navigate('/');
      return;
    }
    
    const teacherName = localStorage.getItem('teacherName');
    
    // Определяем язык учителя и лицензию
    let language = '';
    let license = '';
    let nextCheck = '';
    
    if (teacherName === 'Джон Ричардс' || teacherName === 'Djon_Richards') {
      language = 'english';
      license = '№LXP-4592';
      nextCheck = '01.09.2025';
    } else if (teacherName === 'Ван Сяо' || teacherName === 'Van_Syao') {
      language = 'chinese';
      license = '№LXP-4596';
      nextCheck = '01.09.2026';
    } else if (teacherName === 'Хуан Пере' || teacherName === 'Huan_Pere') {
      language = 'spanish';
      license = '№LXP-4596';
      nextCheck = '01.09.2026';
    } else if (teacherName === 'Ханс Шмидт' || teacherName === 'Hans_Shmidt') {
      language = 'german';
      license = '№LXP-4596';
      nextCheck = '01.09.2026';
    }

    setTeacherInfo({
      name: teacherName,
      language: language,
      license: license,
      nextCheck: nextCheck
    });

    // Загружаем сохраненные настройки из localStorage для конкретного учителя
    const settingsKey = `${language}TeacherSettings`;
    const savedSettings = localStorage.getItem(settingsKey);
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setOriginalSettings(parsed);
    } else {
      setOriginalSettings(settings);
    }

    // Логика для иконок
    const teacherIcon = document.getElementById('teacher-icon');
    if (teacherIcon) {
      teacherIcon.style.display = user.role === 'teacher' ? 'block' : 'none';
    }

    const studentIconLink = document.getElementById('student-icon-link');
    
    if (!token) {
      if (studentIconLink) {
        studentIconLink.addEventListener('click', function(e) {
          e.preventDefault();
          alert('Для доступа к профилю необходимо войти в систему');
          navigate('/entrance');
        });
      }
    }
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Включение режима редактирования
  const handleEdit = () => {
    setOriginalSettings({ ...settings });
    setIsEditing(true);
  };

  // Отмена редактирования
  const handleCancel = () => {
    setSettings(originalSettings);
    setIsEditing(false);
  };

  // Сохранение изменений
  const handleSave = (e) => {
    e.preventDefault();
    
    const settingsKey = `${teacherInfo.language}TeacherSettings`;
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    setOriginalSettings(settings);
    setIsEditing(false);
    
    alert('Настройки успешно сохранены!');
  };

  // Обработчик изменения темы
  const handleThemeChange = (theme) => {
    if (isEditing) {
      setSettings(prev => ({ ...prev, theme }));
    }
  };

  // Обработчик изменения чекбоксов
  const handleCheckboxChange = (key) => {
    if (isEditing) {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  // Обработчик изменения ссылок-переключателей
  const handleLinkToggle = (key, options) => {
    if (isEditing) {
      const currentIndex = options.indexOf(settings[key]);
      const nextIndex = (currentIndex + 1) % options.length;
      setSettings(prev => ({ ...prev, [key]: options[nextIndex] }));
    }
  };

  // Удаление аккаунта
  const handleDeleteAccount = (e) => {
    e.preventDefault();
    if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
      localStorage.clear();
      alert('Аккаунт удален');
      navigate('/');
    }
  };

  // Навигация по страницам
  const goToPersonalInfo = () => {
    const teacherId = localStorage.getItem('teacherId');
    if (teacherId) {
      navigate(`/teacher/personal/${teacherId}`);
    }
  };

  const goToContactInfo = () => {
    const teacherId = localStorage.getItem('teacherId');
    if (teacherId) {
      navigate(`/teacher/contact/${teacherId}`);
    }
  };

  const goToMethodicalWork = () => {
    const teacherId = localStorage.getItem('teacherId');
    if (teacherId) {
      navigate(`/teacher/methodical/${teacherId}`);
    }
  };

  // Опции для выпадающих списков
  const workloadOptions = ['Только администрации', 'Всем', 'Никому'];
  const studentVisibilityOptions = ['Основная информация', 'Полный доступ', 'Только имя'];
  const colleagueVisibilityOptions = ['Полный доступ', 'Основная информация', 'Только имя'];

  return (
    <>
      <Header />
      
      {/* Хлебные крошки */}
      <div className="breadcrumbs">
        Настройки {'>'} Обновить профиль
      </div>

      <main className="main">
        <div className="main__container">
          {/* Сайдбар */}
          <aside className="sidebar">
            <button className="sidebar__btn" onClick={goToPersonalInfo}>Личные данные</button>
            <button className="sidebar__btn" onClick={goToContactInfo}>Контактные данные</button>
            <button className="sidebar__btn" onClick={goToMethodicalWork}>Методическая работа</button>
            <button className="sidebar__btn sidebar__btn--active">Настройки</button>
            <div className="sidebar__license" style={{ marginTop: '24px' }}>
              <b>Лицензия:</b><br />
              Действительна ({teacherInfo.license})<br />
              Следующая проверка: {teacherInfo.nextCheck}
            </div>
          </aside>

          {/* Настройки */}
          <section className="settings">
            {/* Кнопка редактирования */}
            <div className="settings__edit" onClick={!isEditing ? handleEdit : undefined}>
              <span>{isEditing ? 'Редактирование...' : 'Редактировать'}</span>
              <svg width="18" height="18" fill="none">
                <rect width="18" height="18" fill="#fff"/>
                <path d="M13.5 6.5L11.5 4.5L5 11V13H7L13.5 6.5Z" stroke="#BDBDBD" strokeWidth="1.2"/>
              </svg>
            </div>

            <form className="settings__form" onSubmit={handleSave}>
              {/* Тема оформления и безопасность */}
              <div className="settings__row">
                <div className="settings__col">
                  <div className="settings__label">Тема оформления</div>
                  <label className="settings__checkbox">
                    <input 
                      type="checkbox" 
                      checked={settings.theme === 'light'} 
                      onChange={() => handleThemeChange('light')}
                      disabled={!isEditing}
                    /> 
                    Светлая
                  </label>
                  <label className="settings__checkbox">
                    <input 
                      type="checkbox" 
                      checked={settings.theme === 'dark'} 
                      onChange={() => handleThemeChange('dark')}
                      disabled={!isEditing}
                    /> 
                    Тёмная
                  </label>
                  <label className="settings__checkbox">
                    <input 
                      type="checkbox" 
                      checked={settings.theme === 'system'} 
                      onChange={() => handleThemeChange('system')}
                      disabled={!isEditing}
                    /> 
                    Системная
                  </label>
                </div>
                
                <div className="settings__col">
                  <div className="settings__label">Безопасность</div>
                  <div>
                    Двухфакторная аутентификация: 
                    <span 
                      className="settings__link" 
                      onClick={() => isEditing && handleCheckboxChange('twoFactorAuth')}
                      style={{ cursor: isEditing ? 'pointer' : 'default' }}
                    >
                      {settings.twoFactorAuth ? 'Вкл' : 'Выкл'}
                    </span>
                  </div>
                  <div>
                    Смена пароля: 
                    <span 
                      className="settings__link"
                      onClick={() => isEditing && navigate('/change-password')}
                    >
                      Настроить
                    </span>
                  </div>
                </div>
              </div>

              {/* Уведомления и статистика */}
              <div className="settings__row">
                <div className="settings__col">
                  <div className="settings__label">Уведомления</div>
                  <div>Расписание:</div>
                  <div>
                    Оповещение о начале занятий: 
                    <span 
                      className="settings__link"
                      onClick={() => isEditing && handleCheckboxChange('scheduleNotifications')}
                    >
                      {settings.scheduleNotifications ? 'Вкл' : 'Выкл'}
                    </span>
                  </div>
                  <div>
                    Напоминания о совещаниях: 
                    <span 
                      className="settings__link"
                      onClick={() => isEditing && handleCheckboxChange('meetingReminders')}
                    >
                      {settings.meetingReminders ? 'Вкл' : 'Выкл'}
                    </span>
                  </div>
                </div>
                
                <div className="settings__col">
                  <div className="settings__label">Статистика</div>
                  <div>
                    Показывать рейтинг: 
                    <span 
                      className="settings__link"
                      onClick={() => isEditing && handleCheckboxChange('showRating')}
                    >
                      {settings.showRating ? 'Да' : 'Нет'}
                    </span>
                  </div>
                  <div>
                    Отображать нагрузку: 
                    <span 
                      className="settings__link"
                      onClick={() => isEditing && handleLinkToggle('showWorkload', workloadOptions)}
                    >
                      {settings.showWorkload} ▼
                    </span>
                  </div>
                </div>
              </div>

              {/* Приватность */}
              <div className="settings__row">
                <div className="settings__col">
                  <div className="settings__label">Приватность</div>
                  <div>Видимость профиля:</div>
                  <div>
                    Для студентов: 
                    <span 
                      className="settings__link"
                      onClick={() => isEditing && handleLinkToggle('studentVisibility', studentVisibilityOptions)}
                    >
                      {settings.studentVisibility} ▼
                    </span>
                  </div>
                  <div>
                    Для коллег: 
                    <span 
                      className="settings__link"
                      onClick={() => isEditing && handleLinkToggle('colleagueVisibility', colleagueVisibilityOptions)}
                    >
                      {settings.colleagueVisibility} ▼
                    </span>
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="settings__row">
                <div className="settings__col">
                  {isEditing && (
                    <>
                      <button 
                        type="button" 
                        className="form__edit-btn cancel-btn" 
                        onClick={handleCancel}
                        style={{ marginRight: '10px' }}
                      >
                        Отмена
                      </button>
                      <button 
                        type="submit" 
                        className="form__save-btn"
                      >
                        Сохранить
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Удаление аккаунта */}
              <div className="settings__row settings__row--end">
                <button
                  type="button"
                  className="settings__delete"
                  onClick={handleDeleteAccount}
                  style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}
                >
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

export default TeacherSettingsPage;