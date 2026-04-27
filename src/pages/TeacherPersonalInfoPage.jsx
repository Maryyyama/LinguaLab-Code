import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../services/api';
import '../styles/App.css';

// Функция для склонения слова "год" в зависимости от числа
function getYearsWord(years) {
  if (!years || isNaN(years)) return 'лет';
  
  const lastDigit = years % 10;
  const lastTwoDigits = years % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'лет';
  }
  
  if (lastDigit === 1) {
    return 'год';
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'года';
  }
  
  return 'лет';
}

function TeacherPersonalInfoPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Получаем ID преподавателя из адресной строки
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Состояние теперь пустое, оно заполнится данными с сервера
  const [teacherData, setTeacherData] = useState({
    name: '',
    avatar: '',
    specialization: '',
    experience: '',
    education: [],
    methodology: '',
    groups: [],
    individualStudents: 0,
    format: '',
    licenseStatus: '',
    licenseNumber: '',
    licenseExpiry: ''
  });

  const [editForm, setEditForm] = useState({
    name: '',
    avatar: null
  });

  // Загрузка данных из БД при открытии страницы
  useEffect(() => {
    const fetchTeacherData = async () => {
      // Проверка наличия ID — исправлено
      if (!id || id === 'undefined') {
        console.error('ID преподавателя не передан или равен "undefined"');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Доступ запрещен. Требуется авторизация.');
          navigate('/entrance');
          return;
        }

        // Вызываем API
        const response = await api.getTeacherById(id);
        // API возвращает { teacher: {...}, privacy: {...} }
        const data = response.teacher;

        // Если data пустой — используем дефолтные значения
        if (!data) {
          console.error('Нет данных учителя');
          setLoading(false);
          return;
        }

        const firstName = data.firstName || '';
        const lastName = data.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'Преподаватель';
        const avatar = data.avatar || (data.language ? `/media/${data.language}.png` : '/media/препод.png');
        const specialization = data.specialization?.join(', ') || 'Не указана';
        const experience = data.experience;
        const experienceText = experience ? `${experience} ${getYearsWord(parseInt(experience))}` : 'Не указан';
        const education = data.education?.map(e => `${e.institution} (${e.degree})`) || [];
        const methodology = data.methodology || 'Не указана';
        const groups = data.currentLoad?.groups || [];
        const individualStudents = data.currentLoad?.individualStudents || 0;
        const format = data.schedule?.[0]?.format === 'online' ? 'Онлайн' : 'Онлайн/оффлайн';
        const licenseStatus = data.license?.status === 'active' ? 'Действительна' : (data.license?.status || 'Нет данных');
        const licenseNumber = data.license?.number || 'Нет данных';
        const licenseExpiry = data.license?.expiryDate ? new Date(data.license.expiryDate).toLocaleDateString('ru-RU') : 'Нет данных';

        // Заполняем стейт реальными данными
        setTeacherData({
          name: fullName,
          avatar: avatar,
          specialization: specialization,
          experience: experienceText,
          education: education,
          methodology: methodology,
          groups: groups,
          individualStudents: individualStudents,
          format: format,
          licenseStatus: licenseStatus,
          licenseNumber: licenseNumber,
          licenseExpiry: licenseExpiry
        });

        setEditForm({
          name: fullName,
          avatar: data.avatar || null
        });

      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        
        // Если доступ запрещён (403) или ошибка авторизации
        if (error.message && (error.message.includes('Доступ запрещён') || error.message.includes('Ошибка авторизации'))) {
          // Удаляем невалидный токен
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          alert('Сессия истекла или доступ запрещён. Пожалуйста, войдите снова.');
          navigate('/entrance');
        } else if (error.message && error.message.includes('Failed to fetch')) {
          // Сетевая ошибка или CORS
          alert('Не удалось подключиться к серверу. Проверьте подключение к интернету.');
        } else {
          // Другие ошибки
          alert('Не удалось загрузить данные преподавателя. Пожалуйста, попробуйте позже.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [id, navigate]);

  // Открытие модального окна
  const openModal = () => {
    setEditForm({
      name: teacherData.name,
      avatar: teacherData.avatar
    });
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains('modal')) {
      closeModal();
    }
  };

  const handleNameChange = (e) => {
    setEditForm(prev => ({ ...prev, name: e.target.value }));
  };

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
      const nameParts = editForm.name.trim().split(/\s+/);
      const updateData = new FormData();
      updateData.append('firstName', nameParts[0] || '');
      updateData.append('lastName', nameParts.slice(1).join(' ') || '');

      // Если аватар был изменен (base64 строка), отправляем как файл
      if (editForm.avatar && editForm.avatar.startsWith('data:')) {
        // Преобразование base64 в Blob
        const response = await fetch(editForm.avatar);
        const blob = await response.blob();
        updateData.append('photo', blob, 'avatar.png');
      } else if (editForm.avatar) {
        // Если это URL (старый аватар), отправляем как photoUrl
        updateData.append('photoUrl', editForm.avatar);
      }

      await api.updateTeacher(id, updateData);
      setTeacherData(prev => ({ ...prev, name: editForm.name, avatar: editForm.avatar || prev.avatar }));
      closeModal();
      alert('Данные успешно обновлены!');
    } catch (error) {
      console.error('Server Error Details:', error);
      alert('Ошибка при сохранении данных. Проверьте консоль для подробностей.');
    }
  };

  // Навигация по страницам ТЕПЕРЬ ПЕРЕДАЕТ ID
  const goToContactInfo = () => {
    navigate(`/teacher/contact/${id}`);
  };

  const goToMethodicalWork = () => {
    navigate(`/teacher/methodical/${id}`);
  };

  const goToSettings = () => {
    navigate(`/teacher/settings/${id}`);
  };

  if (loading) {
    return <div className="loading" style={{textAlign: 'center', padding: '50px'}}>Загрузка профиля...</div>;
  }

  return (
    <>
      <Header />
      
      {/* Хлебные крошки */}
      <div className="breadcrumbs">
        Личные данные &gt; Обновить профиль
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
              Статус: {teacherData.licenseStatus}<br />
              Номер: {teacherData.licenseNumber}<br />
              Следующая проверка: {teacherData.licenseExpiry}
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
                      onError={(e) => { e.target.src = '/media/default-teacher.png'; }}
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
                        {teacherData.education.length > 0 ? (
                          teacherData.education.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        ) : (
                          <li>Нет данных об образовании</li>
                        )}
                      </ul>
                      Методика: {teacherData.methodology}
                    </div>
                    <div className="personal__progress">
                      <b>Текущая нагрузка:</b><br />
                      Группы:
                      <ul>
                        {teacherData.groups.length > 0 ? (
                          teacherData.groups.map((group, index) => (
                            <li key={index}>{group}</li>
                          ))
                        ) : (
                          <li>Нет активных групп</li>
                        )}
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
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
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
                style={{ marginTop: '10px' }}
              >
                Сменить аватар
              </button>
            </div>
            
            {/* Смена имени */}
            <div className="form-group" style={{ marginTop: '15px' }}>
              <label htmlFor="nameInput">Имя:</label>
              <input 
                type="text" 
                id="nameInput" 
                value={editForm.name} 
                onChange={handleNameChange}
                className="form-control"
              />
            </div>
            
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={saveAllChanges}
              style={{ marginTop: '20px' }}
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

export default TeacherPersonalInfoPage;