import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/App.css';

function StudentContactInfo() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [contactData, setContactData] = useState({
    phone: '',
    email: '',
    city: '',
    address: ''
  });
  const [originalData, setOriginalData] = useState({});

  // Загрузка данных при монтировании
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/entrance');
      return;
    }

    // Загружаем контактные данные
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const savedContacts = localStorage.getItem(`studentContacts_${user.id || user._id}`);
      if (savedContacts) {
        const parsed = JSON.parse(savedContacts);
        setContactData(parsed);
        setOriginalData(parsed);
      }
    } catch (error) {
      console.error('Ошибка загрузки контактных данных:', error);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setContactData(originalData);
    setIsEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem(`studentContacts_${user.id || user._id}`, JSON.stringify(contactData));
    setOriginalData(contactData);
    setIsEditing(false);
    alert('Данные успешно сохранены!');
  };

  return (
    <>
      <Header />
      <div className="breadcrumbs">Контактные данные {'>'} Обновить профиль</div>
      <main className="main">
        <div className="main__container">
          <aside className="sidebar">
            <Link to="/student-info" className="sidebar__btn">Личные данные</Link>
            <button className="sidebar__btn sidebar__btn--active">Контактные данные</button>
            <Link to="/grade" className="sidebar__btn">Успеваемость</Link>
            <Link to="/student/settings" className="sidebar__btn">Настройки</Link>
          </aside>
          <section className="contact">
            <div className="contact__card">
              <div className="contact__form-wrapper">
                <form className="contact__form" onSubmit={handleSave}>
                  <div className="form__group">
                    <label htmlFor="phone">Номер телефона</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={contactData.phone || ''}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                  <div className="form__group">
                    <label htmlFor="email">Почта</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactData.email || ''}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="form__group">
                    <label htmlFor="city">Город проживания</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={contactData.city || ''}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      placeholder="Введите город"
                    />
                  </div>
                  <div className="form__group">
                    <label htmlFor="address">Адрес проживания</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={contactData.address || ''}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      placeholder="Введите адрес"
                    />
                  </div>
                  <div className="form__actions">
                    {!isEditing ? (
                      <button type="button" className="form__edit-btn" onClick={handleEdit}>
                        <img src="/media/редактировать.png" alt="Редактировать" className="edit-icon" />
                        Редактировать
                      </button>
                    ) : (
                      <>
                        <button type="button" className="form__edit-btn" onClick={handleCancel}>Отмена</button>
                        <button type="submit" className="form__save-btn">Сохранить</button>
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

export default StudentContactInfo;