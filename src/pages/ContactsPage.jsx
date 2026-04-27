import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../services/api';
import '../styles/App.css';

function ContactsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    question: '',
    message: '',
    agreement: false
  });
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [myRequests, setMyRequests] = useState([]);
  const [loadingMyRequests, setLoadingMyRequests] = useState(false);

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    
    let result = '+7';
    if (digits.length > 1) result += ' (' + digits.slice(1, 4);
    if (digits.length > 4) result += ') ' + digits.slice(4, 7);
    if (digits.length > 7) result += '-' + digits.slice(7, 9);
    if (digits.length > 9) result += '-' + digits.slice(9, 11);
    
    return result;
  };

  const cleanPhoneNumber = (phone) => phone.replace(/\D/g, '');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, phone: formatted }));
      setPhoneError('');
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Необходимо войти в систему');
      navigate('/entrance');
      return;
    }

    // Проверка телефона (без проверки бана из localStorage)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.phone) {
      const formPhoneClean = cleanPhoneNumber(formData.phone);
      const userPhoneClean = cleanPhoneNumber(user.phone);
      
      if (formPhoneClean !== userPhoneClean) {
        setPhoneError('Номер телефона не совпадает с номером, указанным при регистрации');
        return;
      }
    }

    if (!formData.agreement) {
      alert('Пожалуйста, согласитесь с политикой конфиденциальности');
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        name: formData.name,
        phone: formData.phone,
        question: formData.question,
        message: formData.message
      };
      await api.createRequest(requestData);
      alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
      setFormData({ name: '', phone: '', question: '', message: '', agreement: false });
      setPhoneError('');
      setSubmitError('');
      
      // Обновляем список заявок
      const data = await api.getMyRequests();
      setMyRequests(data);
      
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      
      // Проверяем, является ли ошибка ответом от сервера с информацией о бане
      if (error.message && error.message.includes('запрещенные слова')) {
        setSubmitError(error.message);
        // Обновляем данные пользователя в localStorage после бана
        try {
          const updatedUser = await api.getCurrentUser();
          localStorage.setItem('user', JSON.stringify(updatedUser.user));
          // Если бан навсегда, разлогиниваем
          if (updatedUser.user.isBanned && !updatedUser.user.bannedUntil) {
            setTimeout(() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/entrance');
            }, 3000);
          }
        } catch (e) {
          console.error('Не удалось обновить данные пользователя:', e);
        }
      } else {
        setSubmitError(error.message || 'Не удалось отправить заявку. Пожалуйста, попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Логика для иконок учителя/ученика
  useEffect(() => {
    const isTeacher = localStorage.getItem('isTeacher') === 'true';
    const teacherIconLink = document.getElementById('teacher-icon-link');
    
    if (isTeacher && teacherIconLink) {
      teacherIconLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '/teacher-info';
      });
    } else if (teacherIconLink) {
      teacherIconLink.style.display = 'none';
    }

    const isUserLoggedIn = localStorage.getItem('isUserLoggedIn');
    const studentIconLink = document.getElementById('student-icon-link');
    
    if (!isUserLoggedIn || isUserLoggedIn !== 'true') {
      if (studentIconLink) {
        studentIconLink.addEventListener('click', function(e) {
          e.preventDefault();
          alert('Для доступа к профилю необходимо войти в систему');
          window.location.href = '/entrance';
        });
      }
    }
  }, []);

  // Загрузка моих заявок
  useEffect(() => {
    const loadMyRequests = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      setLoadingMyRequests(true);
      try {
        const data = await api.getMyRequests();
        setMyRequests(data);
      } catch (error) {
        console.error('Ошибка загрузки моих заявок:', error);
      } finally {
        setLoadingMyRequests(false);
      }
    };
    
    loadMyRequests();
  }, []);

  return (
    <>
      <Header />
      <main className="main">
        <div className="container contacts__container">
          <div className="contacts__left">
            <h1>Контакты</h1>
            <p className="contacts__subtitle">Мы на связи в любое удобное время</p>
            <div className="contacts__card">
              <img src="/media/по телефону.png" alt="Телефон" className="contacts__icon" />
              <div>
                <div className="contacts__card-title">По телефону</div>
                <div className="contacts__card-text">+7 (123) 456 78 90</div>
              </div>
            </div>
            <div className="contacts__card">
              <img src="/media/по электронной почте.png" alt="Почта" className="contacts__icon" />
              <div>
                <div className="contacts__card-title">По электронной почте</div>
                <div className="contacts__card-text">
                  LinguaLab@gmail.com<br />
                  LinguaLab@mail.ru
                </div>
              </div>
            </div>
            <div className="contacts__card">
              <img src="/media/в соц.сетях.png" alt="Соцсети" className="contacts__icon" />
              <div>
                <div className="contacts__card-title">В соцсетях</div>
                <div className="contacts__socials">
                  <a href="https://t.me/lingualab" target="_blank" rel="noopener noreferrer">
                    <img src="/media/телеграмм.png" alt="Telegram" />
                  </a>
                  <a href="https://wa.me/71234567890" target="_blank" rel="noopener noreferrer">
                    <img src="/media/ватсап.png" alt="WhatsApp" />
                  </a>
                  <a href="https://vk.com/lingualab" target="_blank" rel="noopener noreferrer">
                    <img src="/media/вк.png" alt="VK" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="contacts__right">
            <form className="contacts__form" onSubmit={handleSubmit}>
              <div className="contacts__form-title">Нужна помощь с выбором курса?</div>
              <div className="contacts__form-subtitle">Оставьте заявку и мы подберем индивидуальное решение</div>
              
              <div className="contacts__form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Имя"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+7 (___) ___ __ __"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {phoneError && (
                <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>
                  {phoneError}
                </div>
              )}
              
              <div className="contacts__form-row">
                <select
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  required
                  className="contacts__select"
                >
                  <option value="">Выберите тему вопроса</option>
                  <option value="Выбор курса">Выбор курса</option>
                  <option value="Техническая поддержка">Техническая поддержка</option>
                  <option value="Вопрос по оплате">Вопрос по оплате</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>
              
              <div className="contacts__form-row">
                <label className="contacts__checkbox">
                  <input
                    type="checkbox"
                    name="agreement"
                    checked={formData.agreement}
                    onChange={handleChange}
                    required
                  />
                  <span>
                    Отправляя заявку, я соглашаюсь с{' '}
                    <Link to="/privacy">политикой конфиденциальности и пользовательским соглашением</Link>
                  </span>
                </label>
              </div>
              
              <textarea
                name="message"
                placeholder="Сообщение (не обязательно)"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
              
              <button type="submit" className="contacts__submit" disabled={loading}>
                {loading ? 'Отправка...' : 'Отправить заявку'}
              </button>
              {submitError && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '10px', textAlign: 'center' }}>
                  {submitError}
                </div>
              )}
            </form>

            {/* Секция "Мои вопросы" */}
            <div className="contacts__my-requests">
              <h3 className="contacts__my-requests-title">Мои вопросы</h3>
              {loadingMyRequests ? (
                <div className="contacts__loading">Загрузка ваших вопросов...</div>
              ) : myRequests.length === 0 ? (
                <div className="contacts__no-requests">
                  У вас пока нет отправленных вопросов.
                </div>
              ) : (
                <div className="contacts__requests-list">
                  {myRequests.map((request) => (
                    <div key={request._id} className="contacts__request-card">
                      <div className="contacts__request-header">
                        <div className="contacts__request-topic">
                          <strong>Тема:</strong> {request.question}
                        </div>
                        <div className="contacts__request-date">
                          {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                        <div className={`contacts__request-status ${request.status === 'answered' ? 'contacts__request-status-answered' : 'contacts__request-status-pending'}`}>
                          {request.status === 'answered' ? 'Отвечено' : 'Ожидает ответа'}
                        </div>
                      </div>
                      <div className="contacts__request-message">
                        <strong>Сообщение:</strong> {request.message || '(без сообщения)'}
                      </div>
                      {request.status === 'answered' && request.answer && (
                        <div className="contacts__request-answer">
                          <strong>Ответ администратора:</strong> {request.answer}
                          <div className="contacts__request-answer-date">
                            Отвечено: {new Date(request.answeredAt).toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ContactsPage;