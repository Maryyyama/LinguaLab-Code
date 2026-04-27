import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import TeacherPublicView from '../components/teachers/TeacherPublicView';
import api from '../services/api';
import '../styles/App.css';

function GermanTeacherPersonalInfoPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(null); // 'teacher', 'student', 'guest'
  const [teacherData, setTeacherData] = useState({
    name: 'Ханс Шмидт',
    avatar: '/media/ханс шмидт личная инф.png',
    specialization: 'Немецкий язык (носитель языка), деловой немецкий',
    experience: '12 лет',
    education: ['Берлинский университет (магистр немецкой филологии)', 'Сертификат Goethe-Zertifikat (уровень C2)'],
    methodology: 'Коммуникативный подход, изучение через погружение в немецкую культуру',
    groups: [
      'Группа начинающих (A1-A2)',
      'Деловой немецкий (B2-C1)'
    ],
    individualStudents: 15,
    format: 'Онлайн/оффлайн',
    license: 'Действительна (№LXP-4596)',
    nextCheck: '01.09.2026'
  });

  const [privacySettings, setPrivacySettings] = useState(null);

  const [editForm, setEditForm] = useState({
    name: '',
    avatar: null
  });

  // ID преподавателя (хардкод для Ханса Шмидта)
  // Используем валидный ObjectId формата (24 hex символа)
  // В реальном приложении нужно заменить на реальный ID из базы данных
  const teacherId = '69bd714c71dff7d18ddeec5f'; // временный ID, заменить на реальный

  // Проверка авторизации и определение режима просмотра
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Если нет токена — гость
    if (!token) {
      setViewMode('guest');
      // Редирект на вход (по требованию)
      alert('Доступ запрещен. Пожалуйста, войдите в систему.');
      navigate('/login');
      return;
    }

    // Если роль 'teacher' и это владелец страницы
    if (user.role === 'teacher') {
      const teacherLogin = user.login;
      // Проверяем, что это учитель немецкого
      if (teacherLogin !== 'hans_schmidt' && teacherLogin !== 'Ханс Шмидт') {
        // Перенаправляем на правильную страницу
        if (teacherLogin === 'john_richards') navigate('/teacher-info');
        else if (teacherLogin === 'juan_perez') navigate('/teacher/spanish');
        else if (teacherLogin === 'wang_xiao') navigate('/teacher/chinese');
        else navigate('/teacher-info');
        return;
      }
      setViewMode('teacher');
      // Загружаем данные из localStorage
      const savedName = localStorage.getItem('teacherName');
      if (savedName) {
        setTeacherData(prev => ({ ...prev, name: savedName }));
        setEditForm(prev => ({ ...prev, name: savedName }));
      }

      const savedAvatar = localStorage.getItem('teacherAvatar');
      if (savedAvatar) {
        setTeacherData(prev => ({ ...prev, avatar: savedAvatar }));
      }

      setLoading(false);
    } else if (user.role === 'student') {
      // Режим ученика — загружаем публичные данные преподавателя
      setViewMode('student');
      const fetchPublicTeacherData = async () => {
        try {
          setLoading(true);
          // ВАЖНО: Добавляем force=true для принудительного обновления данных
          const response = await api.getTeacherById(teacherId, true); // force=true для обхода кэша
          console.log('Получены данные с сервера:', response);
          
          if (response && response.teacher) {
            setTeacherData(response.teacher);
            setPrivacySettings(response.privacy);
          } else {
            setTeacherData(null);
          }
        } catch (error) {
          console.error('Ошибка загрузки данных преподавателя:', error);
          if (error.message.includes('403')) {
            alert('Для просмотра страницы преподавателя необходимо войти');
            navigate('/entrance');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchPublicTeacherData();
    } else {
      // Другие роли (например, admin) или неизвестная роль — считаем гостем
      setViewMode('guest');
      setLoading(false);
    }
  }, [navigate, teacherId]);

  // Открытие модального окна
  const openModal = () => {
    setEditForm({
      name: teacherData.name,
      avatar: null
    });
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Обработка клика вне модального окна
  const handleModalClick = (e) => {
    if (e.target.classList.contains('modal')) {
      closeModal();
    }
  };

  // Изменение имени в форме
  const handleNameChange = (e) => {
    setEditForm(prev => ({ ...prev, name: e.target.value }));
  };

  // Сохранение имени
  const saveName = () => {
    setTeacherData(prev => ({ ...prev, name: editForm.name }));
    localStorage.setItem('teacherName', editForm.name);
  };

  // Обработка загрузки аватара
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Смена аватара
  const changeAvatar = () => {
    if (editForm.avatar) {
      setTeacherData(prev => ({ ...prev, avatar: editForm.avatar }));
      localStorage.setItem('teacherAvatar', editForm.avatar);
    }
  };

  // Сохранение всех изменений
  const saveAllChanges = () => {
    saveName();
    changeAvatar();
    closeModal();
  };

  // Навигация по страницам
  const goToContactInfo = () => {
    navigate('/teacher/german/contact');
  };

  const goToMethodicalWork = () => {
    navigate('/teacher/german/methodical');
  };

  const goToSettings = () => {
    navigate('/teacher/german/settings');
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  // Если режим 'student' или 'guest' — показываем публичное представление
  if (viewMode === 'student' || viewMode === 'guest') {
    return (
      <>
        <Header />
        <div className="breadcrumbs">
          Публичная страница преподавателя
        </div>
        <main className="main">
          <div className="main__container">
            <TeacherPublicView teacherData={teacherData} privacySettings={privacySettings} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Режим 'teacher' — полный личный кабинет
  return (
    <>
      <Header />
      
      {/* Хлебные крошки */}
      <div className="breadcrumbs">
        Личные данные {' > '} Обновить профиль
      </div>

      <main className="main">
        <div className="main__container">
          {/* Сайдбар */}
          <aside className="sidebar">
            <button className="sidebar__btn sidebar__btn--active">Личные данные</button>
            <button className="sidebar__btn" onClick={goToContactInfo}>Контактные данные</button>
            <button className="sidebar__btn" onClick={goToMethodicalWork}>Методическая работа</button>
            <button className="sidebar__btn" onClick={goToSettings}>Настройки</button>
            <div className="sidebar__license" style={{ marginTop: '24px' }}>
              <b>Лицензия:</b><br />
              {teacherData.license}<br />
              Следующая проверка: {teacherData.nextCheck}
            </div>
          </aside>

          {/* Основной контент */}
          <section className="personal">
            <div className="personal__card">
              {/* Кнопка редактирования */}
              <div className="personal__edit">
                <img src="/media/редактировать.png" alt="Редактировать" className="edit-icon" />
                <button type="button" className="personal__edit-btn" onClick={openModal}>
                  Редактировать
                </button>
              </div>

              <div className="personal__info">
                <div className="personal__avatar-and-blocks">
                  {/* Аватар */}
                  <div className="personal__avatar">
                    <img 
                      src={teacherData.avatar} 
                      alt="Фото преподавателя" 
                      id="teacher-avatar"
                      style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Основная информация */}
                  <div className="personal__block personal__main-info">
                    <b>Основная информация:</b><br />
                    Имя преподавателя: <span id="teacher-name">{teacherData.name}</span>
                    <br /><br />
                    <b>Специализация:</b><br />
                    {teacherData.specialization}
                  </div>

                  {/* Профессиональная информация и нагрузка */}
                  <div className="personal__study-progress-row">
                    <div className="personal__block personal__study-info">
                      <b>Профессиональная информация</b><br />
                      Стаж преподавания: {teacherData.experience}<br />
                      <br />
                      Образование:
                      <ul>
                        {teacherData.education.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                      Методика: {teacherData.methodology}
                    </div>
                    <div className="personal__progress">
                      <b>Текущая нагрузка:</b><br />
                      Группы:
                      <ul>
                        {teacherData.groups.map((group, index) => (
                          <li key={index}>{group}</li>
                        ))}
                      </ul>
                      Индивидуальные ученики: {teacherData.individualStudents}<br />
                      Формат: {teacherData.format}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ссылки */}
              <div className="personal__links">
                <Link to="#">Полная статистика</Link> | <Link to="#">Расписание</Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Модальное окно редактирования профиля */}
      {isModalOpen && (
        <div className="modal" style={{ display: 'block' }} onClick={handleModalClick}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Редактирование профиля</h2>
            
            {/* Смена аватарки */}
            <div className="form-group">
              <label>Аватар:</label>
              <div className="avatar-preview">
                <img 
                  id="avatarPreview" 
                  src={editForm.avatar || teacherData.avatar} 
                  alt="Предпросмотр аватара"
                />
              </div>
              <input 
                type="file" 
                id="avatarUpload" 
                accept="image/*" 
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => document.getElementById('avatarUpload').click()}
              >
                Сменить аватар
              </button>
            </div>
            
            {/* Смена имени */}
            <div className="form-group">
              <label htmlFor="nameInput">Имя:</label>
              <input 
                type="text" 
                id="nameInput" 
                value={editForm.name} 
                onChange={handleNameChange}
              />
            </div>
            
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={saveAllChanges}
            >
              Сохранить изменения
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default GermanTeacherPersonalInfoPage;