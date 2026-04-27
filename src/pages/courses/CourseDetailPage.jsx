import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import '../../styles/App.css';

const CourseDetailPage = () => {
  const params = useParams();
  console.log('Все параметры URL:', params);
  
  // Получаем id из параметров (поддерживаем разные варианты)
  const courseId = params.id || params.courseId;
  console.log('ID курса из URL:', courseId);
  
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewStars, setReviewStars] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        console.error('ID курса не передан в URL');
        setError('ID курса не указан');
        setLoading(false);
        return;
      }
      
      try {
        console.log(`Запрос к API: /api/courses/${courseId}`);
        setLoading(true);
        const data = await api.getCourse(courseId);
        console.log('Полученные данные курса:', data);
        setCourse(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки курса:', err);
        setError(err.message);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);

  // Отладочный вывод для проверки данных
  useEffect(() => {
    console.log('=== ДАННЫЕ КУРСА ===');
    console.log('title:', course?.title);
    console.log('modulesList:', course?.modulesList);
    console.log('flagImage:', course?.flagImage);
    console.log('coverImage:', course?.coverImage);
    console.log('modulesList length:', course?.modulesList?.length);
  }, [course]);

  const handleOpenReviewForm = () => {
    if (!isLoggedIn) {
      alert('Чтобы оставить отзыв, необходимо войти в систему');
      navigate('/entrance');
      return;
    }
    setShowReviewForm(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    console.log('courseId для отзыва:', courseId); // Проверка ID
    
    if (!reviewText.trim()) {
      alert('Пожалуйста, введите текст отзыва');
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.addReview(courseId, {
        text: reviewText,
        stars: reviewStars
      });
      console.log('Результат добавления отзыва:', result);
      
      // Обновляем курс, чтобы отобразить новый отзыв
      const updatedCourse = await api.getCourse(courseId);
      setCourse(updatedCourse);
      
      setReviewText('');
      setReviewStars(5);
      setShowReviewForm(false);
      alert('Спасибо за отзыв!');
    } catch (error) {
      console.error('Ошибка при добавлении отзыва:', error);
      
      // Проверка на бан за запрещенные слова
      if (error.message && error.message.includes('запрещенные слова')) {
        alert(error.message);
        // Обновляем данные пользователя в localStorage
        try {
          const updatedUser = await api.getCurrentUser();
          localStorage.setItem('user', JSON.stringify(updatedUser.user));
          // Если бан навсегда, разлогиниваем
          if (updatedUser.user.isBanned && !updatedUser.user.bannedUntil) {
            setTimeout(() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/entrance';
            }, 3000);
          }
        } catch (e) {
          console.error('Не удалось обновить данные пользователя:', e);
        }
      } else {
        alert(error.message || 'Не удалось добавить отзыв');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: '50px', textAlign: 'center' }}>
          <h2>Загрузка курса...</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: '50px', textAlign: 'center' }}>
          <h1>Курс не найден</h1>
          <p>{error || 'Извините, запрошенный курс не существует.'}</p>
          <Link to="/courses" className="btn" style={{ color: '#E42125', textDecoration: 'underline' }}>
            Вернуться к курсам
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <section className="course-main container">
          <div className="course-main__info">
            <h1 className="black-text">{course.title}</h1>
            <h2 className="black-text">О курсе</h2>
            <span className="course-main__after">После прохождения курса</span>
            <ul>
              {course.afterCourse && course.afterCourse.map((item, idx) => (
                <li key={idx} className="black-text">{item}</li>
              ))}
            </ul>
            <span className="course-main__for">{course.forWhom}</span>
            
            <div className="course-program">
              <h3>Программа курса</h3>
              <div className="course-program__modules">
                {course.modulesList && course.modulesList.length > 0 ? (
                  course.modulesList.map((module, idx) => (
                    <div key={idx} className={idx === 0 ? 'module active' : 'module'}>
                      <div className="module__header">
                        <div className="module__header-content">
                          <span className="module-title">Модуль {idx + 1}:</span>
                          {module.title} / {module.subtitle}
                        </div>
                        <span>{module.lessons} уроков / {module.points} баллов</span>
                      </div>
                      {module.description && (
                        <div className="module__body">{module.description}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-data">Программа курса в разработке</div>
                )}
              </div>
            </div>
          </div>
          
          <aside className="course-main__aside">
            <div className="course-price">
              <div className="course-price__top">
                <div className="course-price__info">
                  <div className="course-price__label">Стоимость</div>
                  <div className="course-price__value"><b>{course.price} Р</b></div>
                </div>
                <div className="course-price__flag-wrap">
                  <img
                    src={course.flagImage || '/media/placeholder.png'}
                    alt="Флаг"
                    className="course-price__flag"
                    onError={(e) => { e.target.src = '/media/placeholder.png'; }}
                  />
                </div>
              </div>
              <ul className="course-price__list">
                <li>{course.lessons} уроков</li>
                <li>{course.tasks} заданий</li>
                <li>{course.tests} тестов</li>
                <li>{course.expertSessions} занятия с экспертом</li>
              </ul>
              <div className="course-price__btn-wrap">
                <button
                  className="course-price__btn"
                  onClick={() => {
                    console.log('=== СОХРАНЕНИЕ ДАННЫХ КУРСА ===');
                    console.log('course.language:', course.language);
                    console.log('course.level:', course.level);
                    console.log('course.price:', course.price);
                    
                    // Принудительно перезаписываем localStorage
                    localStorage.setItem('courseLanguage', course.language);
                    localStorage.setItem('courseLevel', course.level);
                    
                    const priceValue = typeof course.price === 'string'
                      ? course.price.replace(/\D/g, '')
                      : String(course.price);
                    localStorage.setItem('coursePrice', priceValue);
                    
                    localStorage.setItem('courseGroup', course.group || 'Standard Group');
                    localStorage.setItem('currentCourseId', course.id || course._id);
                    
                    console.log('Сохранено в localStorage:');
                    console.log('courseLevel:', localStorage.getItem('courseLevel'));
                    console.log('coursePrice:', localStorage.getItem('coursePrice'));
                    
                    const paymentPath =
                      course.language === 'english' ? '/english-payment' :
                      course.language === 'german' ? '/german-payment' :
                      course.language === 'chinese' ? '/chinese-payment' :
                      course.language === 'spanish' ? '/spanish-payment' :
                      course.language === 'french' ? '/french-payment' :
                      course.language === 'japanese' ? '/japanese-payment' :
                      course.language === 'korean' ? '/korean-payment' :
                      course.language === 'italian' ? '/italian-payment' :
                      '/courses';
                    navigate(paymentPath);
                  }}
                >
                  Записаться на курс
                </button>
              </div>
            </div>
            
            <div className="course-leaders">
              <h4>Лучшие ученики</h4>
              {course.topStudents && course.topStudents.map((student, idx) => (
                <div key={idx} className="student-row">
                  <span className="student-num">{idx + 1}</span>
                  <span className="student-name">{student.name}</span>
                  <span className="student-score">{student.score} баллов</span>
                </div>
              ))}
              <Link to="/courses" className="student-stats-link">Смотреть всю статистику</Link>
            </div>
          </aside>
        </section>

        <section className="course-how container">
          <h3>Как проходит обучение</h3>
          <div className="course-how__items">
            <div className="course-how__item">
              <img src="/media/Онлайн-платформа для обучения и выполнения  заданий.png" alt="Онлайн-платформа" />
              <div>Онлайн-платформа для обучения и выполнения заданий</div>
            </div>
            <div className="course-how__item">
              <img src="/media/Полностью интерактивный формат.png" alt="Интерактивный формат" />
              <div>Полностью интерактивный формат</div>
            </div>
            <div className="course-how__item">
              <img src="/media/Видео-чат для общения  с сокурсниками.png" alt="Видео-чат" />
              <div>Видео-чат для общения с сокурсниками</div>
            </div>
          </div>
        </section>

        <section className="course-reviews container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="black-text">Отзывы о курсе</h3>
            <button
              className="add-review-btn"
              onClick={handleOpenReviewForm}
            >
              ✍️ Оставить отзыв
            </button>
          </div>

          {/* Форма добавления отзыва */}
          {showReviewForm && (
            <div className="review-form">
              <h4 style={{ marginBottom: '15px', color: '#333' }}>Ваш отзыв</h4>
              
              {/* Оценка звездами */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ marginRight: '15px', fontWeight: '500' }}>Оценка:</label>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    onClick={() => setReviewStars(star)}
                    style={{
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: star <= reviewStars ? '#FFD700' : '#ddd',
                      marginRight: '5px'
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              
              {/* Текст отзыва */}
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Напишите ваш отзыв о курсе..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  border: '1px solid #ffd6db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  marginBottom: '15px'
                }}
              />
              
              {/* Кнопки */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  style={{
                    background: '#E42125',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {submitting ? 'Отправка...' : 'Отправить отзыв'}
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  style={{
                    background: '#fff',
                    color: '#666',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    cursor: 'pointer'
                  }}
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Существующие отзывы */}
          <div className="course-reviews__list">
            {course.reviews && course.reviews.map((review, idx) => (
              <div key={idx} className="review">
                <div className="review__author">
                  {review.author}<span className="gray-text">{review.role}</span>
                </div>
                <div className="review__text">{review.text}</div>
                <div className="review__stars">{'★'.repeat(review.stars)}</div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: '50px' }}></div>
      </main>
      <Footer />
    </>
  );
};

export default CourseDetailPage;