import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/App.css';

function SpanishCourseIntermediatePage() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(0); // 0 - первый модуль открыт по умолчанию
  const [phone, setPhone] = useState('');
  const [agreement, setAgreement] = useState(false);

  // Данные для модулей
  const modules = [
    { 
      title: 'Viajes y turismo', 
      subtitle: 'Путешествия и туризм',
      description: 'Изучите лексику и выражения, связанные с путешествиями, бронированием отелей, ориентированием в городе и культурными достопримечательностями.',
      lessons: 6,
      points: 60
    },
    { 
      title: 'Comida y cocina', 
      subtitle: 'Еда и кулинария',
      description: 'Освоите лексику для заказа еды, обсуждения рецептов, посещения ресторанов и рынков. Изучите традиционные испанские блюда.',
      lessons: 6,
      points: 60
    },
    { 
      title: 'Salud y bienestar', 
      subtitle: 'Здоровье и благополучие',
      description: 'Изучите медицинскую лексику, научитесь описывать симптомы, записываться к врачу и обсуждать вопросы здоровья и здорового образа жизни.',
      lessons: 6,
      points: 60
    },
    { 
      title: 'Trabajo y carrera', 
      subtitle: 'Работа и карьера',
      description: 'Познакомьтесь с лексикой для профессионального общения, составления резюме, прохождения собеседований и деловой переписки.',
      lessons: 6,
      points: 60
    },
    { 
      title: 'Cultura y sociedad', 
      subtitle: 'Культура и общество',
      description: 'Изучите культурные особенности испаноязычных стран, традиции, праздники и социальные нормы. Научитесь обсуждать культурные темы.',
      lessons: 6,
      points: 60
    },
    { 
      title: 'Tecnología y medios', 
      subtitle: 'Технологии и СМИ',
      description: 'Освоите лексику из мира технологий, социальных сетей и СМИ. Научитесь обсуждать новости и технологические тренды.',
      lessons: 6,
      points: 60
    },
    { 
      title: 'Educación y aprendizaje', 
      subtitle: 'Образование и обучение',
      description: 'Изучите лексику, связанную с образованием, курсами, обучением и академической средой. Научитесь обсуждать образовательные темы.',
      lessons: 6,
      points: 60
    },
    { 
      title: 'Arte y entretenimiento', 
      subtitle: 'Искусство и развлечения',
      description: 'Познакомьтесь с лексикой для обсуждения искусства, музыки, кино и развлечений. Изучите испанских художников и деятелей культуры.',
      lessons: 6,
      points: 60
    }
  ];

  // Данные для лучших учеников
  const topStudents = [
    { name: 'Мария Гонсалес', score: 480 },
    { name: 'Пабло Рамирес', score: 450 },
    { name: 'Изабель Фернандес', score: 420 }
  ];

  // Данные для отзывов
  const reviews = [
    { author: 'София Р.', role: 'Студент', text: 'Курс помог значительно улучшить мой испанский. Особенно полезными оказались модули по ведению деловых бесед и составлению деловой переписки на испанском языке.', stars: 5 },
    { author: 'Антонио М.', role: 'Студент', text: 'Отличный курс для повышения квалификации! Материал хорошо структурирован, преподаватели профессиональные. Теперь могу свободно общаться с коллегами из Испании.', stars: 5 }
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
    localStorage.setItem('courseLanguage', 'spanish');
    localStorage.setItem('courseLevel', 'intermediate');
    localStorage.setItem('coursePrice', '8200');
    localStorage.setItem('courseGroup', 'Intermediate Group');
    localStorage.setItem('currentCourseId', 'spanish-intermediate');
    
    // Здесь можно добавить отправку данных на сервер
    alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
    navigate('/spanish-payment');
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
            <h1 className="black-text">Испанский для среднего уровня</h1>
            <h2 className="black-text">О курсе</h2>
            <span className="course-main__after">После прохождения курса</span>
            <ul>
              <li className="black-text">Сможете вести свободные беседы на различные темы</li>
              <li className="black-text">Уверенно общаться в профессиональной сфере</li>
              <li className="black-text">Понимать фильмы и сериалы без субтитров</li>
              <li className="black-text">Читать профессиональную литературу на испанском языке</li>
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
                  <img src="/media/флаг испании.png" alt="Флаг Испании" className="course-price__flag" />
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
                    localStorage.setItem('courseLanguage', 'spanish');
                    localStorage.setItem('courseLevel', 'intermediate');
                    localStorage.setItem('coursePrice', '8200');
                    localStorage.setItem('courseGroup', 'Intermediate Group');
                    localStorage.setItem('currentCourseId', 'spanish-intermediate');
                    navigate('/spanish-payment');
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

export default SpanishCourseIntermediatePage;