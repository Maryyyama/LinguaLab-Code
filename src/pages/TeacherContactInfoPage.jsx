import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../services/api';
import '../styles/App.css';

function TeacherContactInfoPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState({
    name: '',
    avatar: '',
    language: '',
    licenseStatus: '',
    licenseNumber: '',
    licenseExpiry: ''
  });
  const [contactData, setContactData] = useState({
    phone: '',
    email: '',
    city: '',
    address: ''
  });
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.getTeacherById(id);
        const data = response.teacher;

        const fullName = `${data?.firstName || ''} ${data?.lastName || ''}`.trim() || 'Преподаватель';
        const avatar = data?.avatar || data?.photoUrl || `/media/${data?.language || 'препод'}.png`;

        setTeacherInfo({
          name: fullName,
          avatar: avatar,
          language: data?.language || '',
          licenseStatus: data?.license?.status === 'active' ? 'Действительна' : (data?.license?.status || 'Нет данных'),
          licenseNumber: data?.license?.number || 'Нет данных',
          licenseExpiry: data?.license?.expiryDate ? new Date(data.license.expiryDate).toLocaleDateString('ru-RU') : 'Не указано'
        });

        setContactData({
          phone: data?.contacts?.phone || '',
          email: data?.contacts?.email || '',
          city: data?.contacts?.city || '',
          address: data?.contacts?.address || ''
        });
        setOriginalData(data?.contacts || {});

      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [id]);

  const handleSave = async () => {
    // Проверяем, изменились ли данные
    const hasChanges = JSON.stringify(contactData) !== JSON.stringify(originalData);
    if (!hasChanges) {
      console.log('Данные не изменились, сохранение не требуется');
      setIsEditing(false);
      return;
    }

    console.log('Сохранение контактных данных:', contactData);
    
    try {
      // Отправляем запрос на сервер
      const response = await api.updateTeacher(id, { contacts: contactData });
      console.log('Ответ сервера:', response);
      
      // Только после успешного завершения запроса обновляем состояние
      setOriginalData(contactData);
      setIsEditing(false);
      alert('Данные успешно сохранены в базу данных');
    } catch (error) {
      // Детальное логирование ошибки
      console.error('Ошибка сохранения контактных данных:', {
        error,
        message: error.message,
        stack: error.stack,
        teacherId: id,
        contactData
      });
      
      // Показываем пользователю информативное сообщение
      const errorMessage = error.message || 'Неизвестная ошибка';
      if (errorMessage.includes('Network Error') || errorMessage.includes('Failed to fetch')) {
        alert('Ошибка сети. Проверьте подключение к интернету и попробуйте снова.');
      } else if (errorMessage.includes('401') || errorMessage.includes('Сессия')) {
        alert('Сессия истекла. Пожалуйста, войдите снова.');
      } else if (errorMessage.includes('403') || errorMessage.includes('прав')) {
        alert('У вас нет прав для редактирования этих данных.');
      } else {
        alert(`Не удалось сохранить данные: ${errorMessage}`);
      }
      
      // Оставляем пользователя в режиме редактирования, чтобы он мог повторить попытку
      // Не вызываем setIsEditing(false) при ошибке
    }
  };

  const handleCancel = () => {
    setContactData(originalData);
    setIsEditing(false);
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <>
      <Header />
      <div className="breadcrumbs">Контактные данные {'>'} Обновить профиль</div>
      <main className="main">
        <div className="main__container">
          <aside className="sidebar">
            <Link to={`/teacher/personal/${id}`} className="sidebar__btn">Личные данные</Link>
            <button className="sidebar__btn sidebar__btn--active">Контактные данные</button>
            <Link to={`/teacher/methodical/${id}`} className="sidebar__btn">Методическая работа</Link>
            <Link to={`/teacher/settings/${id}`} className="sidebar__btn">Настройки</Link>
            <div className="sidebar__license" style={{ marginTop: '24px' }}>
              <b>Лицензия:</b><br />
              Статус: {teacherInfo.licenseStatus}<br />
              Номер: {teacherInfo.licenseNumber}<br />
              Следующая проверка: {teacherInfo.licenseExpiry}
            </div>
          </aside>

          <section className="contact">
            <div className="contact__card">
              <div className="contact__form-wrapper">

                <div className="teacher-avatar-section" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                  <img src={teacherInfo.avatar} alt={teacherInfo.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h2 style={{ margin: 0 }}>{teacherInfo.name}</h2>
                    {teacherInfo.language && <p style={{ margin: 0, color: '#888' }}>Преподаватель {teacherInfo.language}</p>}
                  </div>
                </div>

                <form className="contact__form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form__group">
                    <label>Телефон</label>
                    <input type="tel" value={contactData.phone} onChange={(e) => setContactData({ ...contactData, phone: e.target.value })} readOnly={!isEditing} placeholder="+7 (___) ___-__-__" />
                  </div>
                  <div className="form__group">
                    <label>Email</label>
                    <input type="email" value={contactData.email} onChange={(e) => setContactData({ ...contactData, email: e.target.value })} readOnly={!isEditing} placeholder="email@example.com" />
                  </div>
                  <div className="form__group">
                    <label>Город</label>
                    <input type="text" value={contactData.city} onChange={(e) => setContactData({ ...contactData, city: e.target.value })} readOnly={!isEditing} placeholder="Введите город" />
                  </div>
                  <div className="form__group">
                    <label>Адрес</label>
                    <input type="text" value={contactData.address} onChange={(e) => setContactData({ ...contactData, address: e.target.value })} readOnly={!isEditing} placeholder="Введите адрес" />
                  </div>

                  <div className="personal__edit" style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px' }}>
                    {!isEditing ? (
                      <button className="personal__edit-btn" onClick={() => setIsEditing(true)}>
                        <img src="/media/редактировать.png" alt="Редактировать" className="edit-icon" />
                        Редактировать
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" className="form__edit-btn" onClick={handleCancel}>Отмена</button>
                        <button type="button" className="form__save-btn" onClick={handleSave}>Сохранить</button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default TeacherContactInfoPage;