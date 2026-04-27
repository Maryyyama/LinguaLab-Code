import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/App.css';

function GermanCoursePage() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(0); // 0 - первый модуль открыт по умолчанию
  const [phone, setPhone] = useState('');
  const [agreement, setAgreement] = useState(false);

  // Данные для модулей
  const modules = [
    { 
      title: 'Begrüßung und Vorstellung', 
      subtitle: 'Приветствие и представление',
      description: 'Вы научитесь правильно приветствовать собеседника, представляться и знакомиться. Освоите основные фразы для первого знакомства.',
      lessons: 5,
      points: 50
    },
    { 
      title: 'Familie', 
      subtitle: 'Семья',
      description: 'Изучите лексику по теме "Семья", научитесь рассказывать о родственниках и описывать их.',
      lessons: 5,
      points: 50
    },
    { 
      title: 'Tagesablauf', 
      subtitle: 'Распорядок дня',
      description: 'Освоите глаголы и выражения для описания повседневных действий, научитесь рассказывать о своем распорядке дня.',
      lessons: 5,
      points: 50
    },
    { 
      title: 'Zahlen und Uhrzeiten', 
      subtitle: 'Числа и время',
      description: 'Научитесь считать до 100, называть время, дни недели и месяцы.',
      lessons: 5,
      points: 50
    },
    { 
      title: 'Einkaufen', 
      subtitle: 'Покупки',
      description: 'Изучите фразы для похода в магазин, названия продуктов и основные числительные для оплаты.',
      lessons: 5,
      points: 50
    },
    { 
      title: 'Freizeit', 
      subtitle: 'Свободное время',
      description: 'Научитесь рассказывать о хобби, спорте и планировании досуга.',
      lessons: 5,
      points: 50
    },
    { 
      title: 'Reisen', 
      subtitle: 'Путешествия',
      description: 'Освоите лексику для путешествий: бронирование отеля, заказ билетов, ориентирование в городе.',
      lessons: 5,
      points: 50
    },
    { 
      title: 'Essen und Trinken', 
      subtitle: 'Еда и напитки',
      description: 'Изучите названия блюд и напитков, научитесь заказывать еду в ресторане и обсуждать вкусы.',
      lessons: 5,
      points: 50
    }
  ];

  // Данные для лучших учеников
  const topStudents = [
    { name: 'Анна Петрова', score: 300 },
    { name: 'Михаил Сидоров', score: 270 },
    { name: 'Елена Кузнецова', score: 240 }
  ];

  // Данные для отзывов
  const reviews = [
    { author: 'Ирина К.', role: 'Студент', text: 'Отличный курс для начинающих! Все объясняется понятно и доступно. Особенно понравились интерактивные задания.', stars: 5 },
    { author: 'Дмитрий В.', role: 'Студент', text: 'Начал изучать немецкий с нуля. Курс помог освоить базу быстро и эффективно. Рекомендую всем новичкам!', stars: 5 }
  ];

  // Данные для похожих курсов
  const similarCourses = [
    { language: 'Английский', flag: 'флаг  америки.png', duration: '45 часов', level: 'начальный', modules: 3, price: '6 520 Р', link: '/courses/english/beginner' },
    { language: 'Испанский', flag: 'флаг испании.png', duration: '45 часов', level: 'средний', modules: 3, price: '6 520 Р', link: '/courses/spanish/intermediate' }
  ];

  // Форматирование телефона
  const formatPhoneNumber = (value) => {
    let digits = value.replace(/\D/g, '');
    
    if (digits.length > 11) {
      digits = digits.substring(0, 11);
    }
    
    let formattedValue = '';
    if (digits.length > 0) {
      formattedValue = '+7 (';
      if (digits.length > 1) {
        formattedValue += digits.substring(1, 4);
      }
      if (digits.length > 4) {
        formattedValue += ') ' + digits.substring(4, 7);
      }
      if (digits.length > 7) {
        formattedValue += '-' + digits.substring(7, 9);
      }
      if (digits.length > 9) {
        formattedValue += '-' + digits.substring(9, 11);
      }
    }
    
    return formattedValue;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!phone) {
      alert('Пожалуйста, введите номер телефона');
      return;
    }
    
    if (!agreement) {
      alert('Пожалуйста, согласитесь с политикой конфиденциальности');
      return;
    }
    
    // Сохраняем данные о курсе в localStorage
    localStorage.setItem('courseLanguage', 'german');
    localStorage.setItem('courseLevel', 'beginner');
    localStorage.setItem('coursePrice', '6520');
    localStorage.setItem('courseGroup', 'Standard Group');
    localStorage.setItem('currentCourseId', 'german-beginner');
    
    // Здесь можно добавить отправку данных на сервер
    alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
    navigate('/german-payment');
  };


  return (
    <>
      <Header />
      
      <main>
        {/* Основная секция курса */}
        <section className="course-main container">
          <div className="course-main__info">
            <h1 className="black-text">Немецкий для начинающих</h1>
            <h2 className="black-text">О курсе</h2>
            <span className="course-main__after">После прохождения курса</span>
            <ul>
              <li className="black-text">Вы сможете представиться на немецком языке</li>
              <li className="black-text">Научитесь вести простые диалоги на бытовые темы</li>
              <li className="black-text">Освоите базовую грамматику немецкого языка</li>
              <li className="black-text">Сможете читать и понимать простые тексты</li>
            </ul>
            <span className="course-main__for">Для начинающих</span>
            
            {/* Программа курса */}
            <div className="course-program">
              <h3>Программа курса</h3>
              <div className="course-program__modules">
                {modules.map((module, index) => (
                  <div 
                    key={index} 
                    className={`module ${activeModule === index ? 'active' : ''}`}
                    onClick={() => setActiveModule(activeModule === index ? -1 : index)}
                  >
                    <div className="module__header">
                      <div className="module__header-content">
                        <span className="module-title">Модуль {index + 1}:</span> {module.title} / {module.subtitle}
                      </div>
                      <span>{module.lessons} уроков / {module.points} баллов</span>
                    </div>
                    {activeModule === index && (
                      <div className="module__body">{module.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Сайдбар с ценой и лучшими учениками */}
          <aside className="course-main__aside">
            {/* Блок с ценой */}
            <div className="course-price">
              <div className="course-price__top">
                <div className="course-price__info">
                  <div className="course-price__label">Стоимость</div>
                  <div className="course-price__value"><b>От 6 520 Р</b></div>
                </div>
                <div className="course-price__flag-wrap">
                  <img src="/media/Флаг Германии.png" alt="Флаг Германии" className="course-price__flag" />
                </div>
              </div>
              <ul className="course-price__list">
                <li>40 уроков</li>
                <li>365 заданий</li>
                <li>9 тестов</li>
                <li>4 занятия с экспертом</li>
              </ul>
              <div className="course-price__btn-wrap">
                <button
                  className="course-price__btn"
                  onClick={() => {
                    localStorage.setItem('courseLanguage', 'german');
                    localStorage.setItem('courseLevel', 'beginner');
                    localStorage.setItem('coursePrice', '6520');
                    localStorage.setItem('courseGroup', 'Standard Group');
                    localStorage.setItem('currentCourseId', 'german-beginner');
                    navigate('/german-payment');
                  }}
                >
                  Записаться на курс
                </button>
              </div>
            </div>

            {/* Лучшие ученики */}
            <div className="course-leaders">
              <h4>Лучшие ученики</h4>
              {topStudents.map((student, index) => (
                <div key={index} className="student-row">
                  <span className="student-num">{index + 1}</span>
                  <span className="student-name">{student.name}</span>
                  <span className="student-score">{student.score} баллов</span>
                </div>
              ))}
              <Link to="#" className="student-stats-link">Смотреть всю статистику</Link>
            </div>
          </aside>
        </section>

        {/* Как проходит обучение */}
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

        {/* Отзывы о курсе */}
        <section className="course-reviews container">
          <h3 className="black-text">Отзывы о курсе</h3>
          <div className="course-reviews__list">
            {reviews.map((review, index) => (
              <div key={index} className="review">
                <div className="review__author">
                  {review.author}<span className="gray-text">{review.role}</span>
                </div>
                <div className="review__text">{review.text}</div>
                <div className="review__stars">{'★'.repeat(review.stars)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Форма записи */}
        <section className="course-signup container">
          <h3>Регистрируйтесь и приступайте к первому бесплатному уроку</h3>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-form__row">
              <input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={handlePhoneChange}
              />
              <button type="submit">Продолжить</button>
            </div>
            <div className="signup-form__policy">
              <input
                type="checkbox"
                id="agreement"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement">
                Отправляя заявку, я соглашаюсь с{' '}
                <Link to="/privacy">политикой конфиденциальности</Link> и{' '}
                <Link to="/terms">пользовательским соглашением</Link>
              </label>
            </div>
          </form>
          <img src="/media/регистрация.png" alt="Регистрация" className="signup-img" />
        </section>

        {/* Похожие курсы */}
        <section className="course-similar container">
          <h3>Похожие курсы</h3>
          <div className="course-similar__list">
            {similarCourses.map((course, index) => (
              <div key={index} className="similar-card">
                <img src={`/media/${course.flag}`} alt={course.language} className="similar-flag" />
                <div className="similar-title">{course.language}</div>
                <div className="similar-info">
                  <div>Длительность: <b>{course.duration}</b></div>
                  <div>Уровень: <b>{course.level}</b></div>
                  <div>Модулей: <b>{course.modules}</b></div>
                </div>
                <div className="similar-footer">
                  <Link to={course.link} className="similar-btn">
                    Узнать подробнее <span className="arrow">→</span>
                  </Link>
                  <div className="similar-price">{course.price}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div style={{ height: '50px' }}></div>
      </main>

      <Footer />
    </>
  );
}

export default GermanCoursePage;