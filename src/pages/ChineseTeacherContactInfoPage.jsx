import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/App.css';

function ChineseTeacherContactInfoPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [contactData, setContactData] = useState({
    phone: '+86 138 0013 8000',
    email: 'wangxiao@lingualab.cn',
    city: 'Пекин',
    address: 'улица Цзяньгосо, д. 15'
  });
  
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Форматирование китайского телефона при вводе
  const formatChinesePhoneNumber = (value) => {
    let digits = value.replace(/\D/g, '');
    
    if (digits.length > 13) {
      digits = digits.substring(0, 13);
    }
    
    let formattedValue = '';
    if (digits.length > 0) {
      formattedValue = '+86';
      if (digits.length > 3) {
        formattedValue += ' ' + digits.substring(3, 6);
      }
      if (digits.length > 6) {
        formattedValue += ' ' + digits.substring(6, 10);
      }
      if (digits.length > 10) {
        formattedValue += ' ' + digits.substring(10, 13);
      }
    }
    
    return formattedValue;
  };

  // Проверка авторизации при загрузке страницы
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'teacher') {
      alert('Доступ запрещен. Только для преподавателей.');
      navigate('/');
      return;
    }

    // Проверяем, что это учитель китайского
    const teacherLogin = user.login;
    if (teacherLogin !== 'wang_xiao' && teacherLogin !== 'Ван Сяо') {
      // Перенаправляем на правильную страницу
      if (teacherLogin === 'john_richards') navigate('/teacher/contact');
      else if (teacherLogin === 'hans_schmidt') navigate('/teacher/german/contact');
      else if (teacherLogin === 'juan_perez') navigate('/teacher/spanish/contact');
      else navigate('/teacher/contact');
      return;
    }

    // Загружаем сохраненные контактные данные из localStorage
    const savedContacts = localStorage.getItem('chineseTeacherContacts');
    if (savedContacts) {
      const parsed = JSON.parse(savedContacts);
      setContactData(parsed);
      setOriginalData(parsed);
    } else {
      setOriginalData(contactData);
    }

    setLoading(false);
  }, [navigate, contactData]);

  // Обработчик изменений в полях ввода
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Изменение поля:', name, value);
    
    let newValue = value;
    
    // Форматируем телефон при вводе
    if (name === 'phone') {
      newValue = formatChinesePhoneNumber(value);
    }
    
    setContactData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Очищаем ошибку для этого поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Скрываем сообщение об успешном сохранении при изменении
    if (saveSuccess) {
      setSaveSuccess(false);
    }
  };

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    
    // Проверка телефона
    const phoneRegex = /^\+86 \d{3} \d{4} \d{4}$/;
    if (!phoneRegex.test(contactData.phone)) {
      newErrors.phone = 'Введите корректный китайский номер в формате +86 XXX XXXX XXXX';
    }
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      newErrors.email = 'Введите корректный email адрес';
    }
    
    // Проверка города
    if (!contactData.city.trim()) {
      newErrors.city = 'Город не может быть пустым';
    }
    
    // Проверка адреса
    if (!contactData.address.trim()) {
      newErrors.address = 'Адрес не может быть пустым';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Включение режима редактирования
  const handleEdit = () => {
    console.log('Режим редактирования включен');
    setOriginalData({ ...contactData });
    setIsEditing(true);
    setErrors({});
    setSaveSuccess(false);
  };

  // Отмена редактирования (возврат к исходным данным)
  const handleCancel = () => {
    console.log('Редактирование отменено');
    setContactData(originalData);
    setIsEditing(false);
    setErrors({});
    setSaveSuccess(false);
  };

  // Сохранение изменений
  const handleSave = (e) => {
    e.preventDefault();
    console.log('Сохранение данных');
    
    if (!validateForm()) {
      console.log('Ошибки валидации:', errors);
      return;
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('chineseTeacherContacts', JSON.stringify(contactData));
    setOriginalData(contactData);
    setIsEditing(false);
    setSaveSuccess(true);
    
    // Показываем сообщение об успешном сохранении на 3 секунды
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Навигация по страницам
  const goToPersonalInfo = () => {
    navigate('/teacher/chinese');
  };

  const goToMethodicalWork = () => {
    navigate('/teacher/chinese/methodical');
  };

  const goToSettings = () => {
    navigate('/teacher/chinese/settings');
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <>
      <Header />
      
      {/* Хлебные крошки */}
      <div className="breadcrumbs">
        Контактные данные {'>'} Обновить профиль
      </div>

      <main className="main">
        <div className="main__container">
          {/* Сайдбар */}
          <aside className="sidebar">
            <button className="sidebar__btn" onClick={goToPersonalInfo}>Личные данные</button>
            <button className="sidebar__btn sidebar__btn--active">Контактные данные</button>
            <button className="sidebar__btn" onClick={goToMethodicalWork}>Методическая работа</button>
            <button className="sidebar__btn" onClick={goToSettings}>Настройки</button>
          </aside>

          {/* Контактная информация */}
          <section className="contact">
            <div className="contact__card">
              <div className="contact__form-wrapper">
                {/* Сообщение об успешном сохранении */}
                {saveSuccess && (
                  <div className="success-message">
                    Данные успешно сохранены!
                  </div>
                )}
                
                <form className="contact__form" onSubmit={handleSave}>
                  {/* Телефон */}
                  <div className="form__row">
                    <div className="form__group">
                      <label htmlFor="phone">Номер телефона</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={contactData.phone}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        disabled={!isEditing}
                        className={errors.phone ? 'error' : ''}
                        placeholder="+86 ___ ____ ____"
                      />
                      {errors.phone && <div className="error-message">{errors.phone}</div>}
                    </div>
                  </div>

                  {/* Почта */}
                  <div className="form__group">
                    <label htmlFor="email">Почта</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactData.email}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      disabled={!isEditing}
                      className={errors.email ? 'error' : ''}
                      placeholder="email@example.com"
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>

                  {/* Город */}
                  <div className="form__group">
                    <label htmlFor="city">Город проживания</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={contactData.city}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      disabled={!isEditing}
                      className={errors.city ? 'error' : ''}
                      placeholder="Введите город"
                    />
                    {errors.city && <div className="error-message">{errors.city}</div>}
                  </div>

                  {/* Адрес */}
                  <div className="form__group">
                    <label htmlFor="address">Адрес проживания</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={contactData.address}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      disabled={!isEditing}
                      className={errors.address ? 'error' : ''}
                      placeholder="Введите адрес"
                    />
                    {errors.address && <div className="error-message">{errors.address}</div>}
                  </div>

                  {/* Кнопки действий */}
                  <div className="form__actions">
                    {!isEditing ? (
                      <button
                        type="button"
                        className="form__edit-btn"
                        onClick={handleEdit}
                      >
                        <img src="/media/редактировать.png" alt="Редактировать" className="edit-icon" />
                        Редактировать
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="form__edit-btn cancel-btn"
                          onClick={handleCancel}
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

export default ChineseTeacherContactInfoPage;