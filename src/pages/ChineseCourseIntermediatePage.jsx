import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/App.css';

function ChineseCourseIntermediatePage() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(0); // 0 - первый модуль открыт по умолчанию
  const [phone, setPhone] = useState('');
  const [agreement, setAgreement] = useState(false);

  // Данные для модулей
  const modules = [
    { 
      title: '商务沟通', 
      subtitle: 'Деловое общение',
      description: 'Изучите основы делового общения на китайском языке, включая деловую переписку, телефонные разговоры и деловые встречи.',
      lessons: 6,
      points: 60
    },
    { 
      title: '专业词汇', 
      subtitle: 'Профессиональная лексика',
      description: 'Освоите профессиональную лексику для различных сфер деятельности: IT, медицина, юриспруденция, маркетинг.',
      lessons: 6,
      points: 60
    },
    { 
      title: '文化与社会', 
      subtitle: 'Культура и общество',
      description: 'Изучите культурные особенности Китая, традиции, обычаи и социальные нормы. Научитесь обсуждать культурные темы.',
      lessons: 6,
      points: 60
    },
    { 
      title: '经济与金融', 
      subtitle: 'Экономика и финансы',
      description: 'Познакомьтесь с финансовой лексикой, научитесь обсуждать экономические темы, читать финансовые отчеты на китайском.',
      lessons: 6,
      points: 60
    },
    { 
      title: '科技与创新', 
      subtitle: 'Технологии и инновации',
      description: 'Изучите лексику из мира технологий, IT, искусственного интеллекта и инноваций. Научитесь обсуждать технологические тренды в Китае.',
      lessons: 6,
      points: 60
    },
    { 
      title: '健康与医学', 
      subtitle: 'Здоровье и медицина',
      description: 'Освоите медицинскую терминологию, научитесь описывать симптомы, записываться к врачу и обсуждать вопросы здоровья.',
      lessons: 6,
      points: 60
    },
    { 
      title: '旅游与地理', 
      subtitle: 'Туризм и география',
      description: 'Изучите лексику для путешествий по Китаю, бронирования отелей, общения в аэропорту и с туристическими агентами.',
      lessons: 6,
      points: 60
    },
    { 
      title: '考试准备', 
      subtitle: 'Подготовка к экзаменам',
      description: 'Подготовьтесь к международным экзаменам по китайскому языку HSK: стратегии выполнения заданий, тренировочные тесты, разбор ошибок.',
      lessons: 6,
      points: 60
    }
  ];

  // Данные для лучших учеников
  const topStudents = [
    { name: 'Анна Соколова', score: 480 },
    { name: 'Михаил Петров', score: 450 },
    { name: 'Елена Кузнецова', score: 420 }
  ];

  // Данные для отзывов
  const reviews = [
    { author: 'Дмитрий К.', role: 'Студент', text: 'Курс помог значительно улучшить мой китайский язык. Особенно полезными оказались модули по деловому общению и составлению деловой переписки на китайском языке.', stars: 5 },
    { author: 'Ольга М.', role: 'Студент', text: 'Отличный курс для повышения квалификации! Материал хорошо структурирован, преподаватели профессиональные. Теперь могу уверенно общаться с китайскими коллегами.', stars: 5 }
  ];

  // Данные для похожих курсов
  const similarCourses = [
    { language: 'Английский', flag: 'флаг  америки.png', duration: '45 часов', level: 'средний', modules: 3, price: '8 200 Р', link: '/courses/english-intermediate' },
    { language: 'Немецкий', flag: 'Флаг Германии.png', duration: '45 часов', level: 'средний', modules: 3, price: '8 200 Р', link: '/courses/german-intermediate' }
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
    localStorage.setItem('courseLanguage', 'chinese');
    localStorage.setItem('courseLevel', 'intermediate');
    localStorage.setItem('coursePrice', '8200');
    localStorage.setItem('courseGroup', 'Intermediate Group');
    localStorage.setItem('currentCourseId', 'chinese-intermediate');
    
    // Здесь можно добавить отправку данных на сервер
    alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
    navigate('/chinese-payment');
  };

  // Проверка авторизации и логика для иконок
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
          navigate('/entrance');
        });
      }
    }
  }, [navigate]);

  return (
    <>
      <Header />
      
      <main>
        {/* Основная секция курса */}
        <section className="course-main container">
          <div className="course-main__info">
            <h1 className="black-text">Китайский для среднего уровня</h1>
            <h2 className="black-text">О курсе</h2>
            <span className="course-main__after">После прохождения курса</span>
            <ul>
              <li className="black-text">Сможете вести беседы на профессиональные темы</li>
              <li className="black-text">Уверенно общаться в бизнес-среде на китайском языке</li>
              <li className="black-text">Понимать фильмы и сериалы без субтитров</li>
              <li className="black-text">Читать профессиональную литературу на китайском языке</li>
            </ul>
            <span className="course-main__for">Средний уровень</span>
            
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
                  <div className="course-price__value"><b>От 8 200 Р</b></div>
                </div>
                <div className="course-price__flag-wrap">
                  <img src="/media/флаг китая.png" alt="Флаг Китая" className="course-price__flag" />
                </div>
              </div>
              <ul className="course-price__list">
                <li>48 уроков</li>
                <li>438 заданий</li>
                <li>12 тестов</li>
                <li>6 занятий с экспертом</li>
              </ul>
              <div className="course-price__btn-wrap">
                <button
                  className="course-price__btn"
                  onClick={() => {
                    // Сохраняем данные о курсе в localStorage
                    localStorage.setItem('courseLanguage', 'chinese');
                    localStorage.setItem('courseLevel', 'intermediate');
                    localStorage.setItem('coursePrice', '8200');
                    localStorage.setItem('courseGroup', 'Intermediate Group');
                    localStorage.setItem('currentCourseId', 'chinese-intermediate');
                    navigate('/chinese-payment');
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
              <img src="/media/Онлайн-платформа для обучения и выполнения заданий.png" alt="Онлайн-платформа" />
              <div>Онлайн-платформа для обучения и выполнения заданий</div>
            </div>
            <div className="course-how__item">
              <img src="/media/Полностью интерактивный формат.png" alt="Интерактивный формат" />
              <div>Полностью интерактивный формат</div>
            </div>
            <div className="course-how__item">
              <img src="/media/Видео-чат для общения с сокурсниками.png" alt="Видео-чат" />
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

export default ChineseCourseIntermediatePage;