import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../services/api';
import '../styles/App.css';

function StudentPersonalInfo() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    avatar: null
  });

  // Получение логина из localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userLogin = user.login || '';

  // Загрузка профиля студента с сервера
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getStudentProfile();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Если у студента нет имени, устанавливаем логин
        if (!data.name && user.login) {
          data.name = user.login;
        }
        
        setStudentData(data);
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        if (error.message.includes('авторизация') || error.message.includes('токен')) {
          alert('Для доступа к профилю необходимо войти в систему');
          navigate('/entrance');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Открытие модального окна
  const openModal = () => {
    setEditForm({
      name: studentData?.name || '',
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

  // Сохранение изменений через API
  const saveAllChanges = async () => {
    try {
      const updatedData = {
        name: editForm.name,
        firstName: editForm.name.split(' ')[0] || '',
        lastName: editForm.name.split(' ').slice(1).join(' ') || '',
        avatar: editForm.avatar
      };
      
      const updated = await api.updateStudentProfile(updatedData);
      setStudentData(updated);
      
      // Обновляем имя в localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.login = editForm.name;
      localStorage.setItem('user', JSON.stringify(user));
      
      setIsModalOpen(false);
      alert('Профиль успешно обновлен');
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      alert(error.message || 'Не удалось обновить профиль');
    }
  };

  // Вспомогательные функции для отображения
  const getLanguageDisplay = (language) => {
    const map = {
      english: 'Английский',
      german: 'Немецкий',
      spanish: 'Испанский',
      chinese: 'Китайский',
      french: 'Французский',
      japanese: 'Японский',
      korean: 'Корейский',
      italian: 'Итальянский'
    };
    return map[language] || language || 'Не выбран';
  };

  const getLevelDisplay = (level) => {
    const map = {
      beginner: 'Начальный',
      intermediate: 'Средний',
      advanced: 'Высокий'
    };
    return map[level] || level || 'Не известно';
  };

  const getGroupDisplay = (group) => {
    return group || 'Стандартная группа';
  };

  // Получаем первый активный курс (если есть)
  const activeCourse = studentData?.enrolledCourses?.find(c => c.status === 'active');
  
  // Формируем данные для отображения
  const displayLanguage = activeCourse ? getLanguageDisplay(activeCourse.language) : (studentData?.language || 'Не выбран');
  const displayLevel = activeCourse ? getLevelDisplay(activeCourse.level) : (studentData?.level || 'Не известно');
  const displayGroup = activeCourse ? getGroupDisplay(activeCourse.group) : (studentData?.group || 'Не выбрана');
  
  // Прогресс по первому активному курсу
  const progress = activeCourse?.progress || { completedLessons: 0, totalLessons: 0, attendance: 0, lastTestScore: 0 };
  
  // Формируем название оплаченного пакета
  const getPaymentPackage = () => {
    if (activeCourse) {
      return `${getLanguageDisplay(activeCourse.language)} (${getLevelDisplay(activeCourse.level)} уровень)`;
    }
    return studentData?.paymentPackage || 'У вас нет оплаченных курсов';
  };

  if (loading) {
    return <div className="loading">Загрузка профиля...</div>;
  }

  if (!studentData) {
    return <div className="error">Профиль не найден</div>;
  }

  return (
    <>
      <Header />
      
      {/* Хлебные крошки */}
      <div className="breadcrumbs">
        Личные данные {'>'} Обновить профиль
      </div>

      <main className="main">
        <div className="main__container">
          {/* Сайдбар */}
          <aside className="sidebar">
            <button className="sidebar__btn sidebar__btn--active">Личные данные</button>
            <Link to="/student-contact" className="sidebar__btn">Контактные данные</Link>
            <Link to="/grade" className="sidebar__btn">Успеваемость</Link>
            <Link to="/student/settings" className="sidebar__btn">Настройки</Link>
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
                    <div className="avatar-placeholder">
                      {studentData.avatar && (
                        <img 
                          src={studentData.avatar} 
                          alt="Аватар" 
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Основная информация */}
                  <div className="personal__block personal__main-info">
                    <b>Основная информация:</b><br />
                    Имя ученика: <span id="student-name">{userLogin || studentData.name || 'Имя не указано'}</span>
                  </div>

                  {/* Учебная информация и прогресс - в одной строке */}
                  <div className="personal__study-progress-row">
                    <div className="personal__block personal__study-info">
                      <b>Учебная информация:</b><br />
                      Изучаемый язык: {displayLanguage}<br />
                      Уровень: {displayLevel}<br />
                      Группа: {displayGroup}
                    </div>
                    <div className="personal__progress">
                      <b>Прогресс:</b><br />
                      {activeCourse ? (
                        <>
                          {getLanguageDisplay(activeCourse.language)} ({getLevelDisplay(activeCourse.level)})<br />
                          Пройдено занятий: {progress.completedLessons} из {progress.totalLessons || 0}<br />
                          Средняя посещаемость: {progress.attendance || 0}%<br />
                          Последний тест: {progress.lastTestScore || 0}/100
                        </>
                      ) : (
                        <div>У вас пока нет курсов. Запишитесь на первый курс!</div>
                      )}
                    </div>
                  </div>

                  {/* Дополнительная информация */}
                  <div className="personal__block personal__additional-info">
                    <b>Дополнительно:</b><br />
                    Дата регистрации: {new Date(studentData.registrationDate).toLocaleDateString('ru-RU')}<br />
                    Формат обучения: {studentData.studyFormat || 'Групповой'}<br />
                    Оплаченный пакет: {getPaymentPackage()}
                  </div>
                </div>
              </div>

              {/* Ссылки */}
              <div className="personal__links">
                <Link to="/grade">Полная статистика</Link> | <Link to="#">Написать преподавателю</Link>
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
                  src={editForm.avatar || studentData.avatar || '/media/Иван.png'} 
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

export default StudentPersonalInfo;