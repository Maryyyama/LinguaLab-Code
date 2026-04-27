import { useParams, useNavigate } from 'react-router-dom';
import { courses } from '../data/courses.js';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/App.css';

const CoursePage = () => {
  const { language, level } = useParams();
  const navigate = useNavigate();
  const course = courses.find(c => c.language === language && c.level === level);

  if (!course) {
    return (
      <div>
        <Header />
        <main className="container" style={{ padding: '50px', textAlign: 'center' }}>
          <h1>Курс не найден</h1>
          <p>Извините, запрошенный курс не существует.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main>
        {/* Основная секция курса */}
        <section className="course-main container">
          <div className="course-main__info">
            <h1 className="black-text">{course.title}</h1>
            <h2 className="black-text">{course.description}</h2>
            <span className="course-main__after">После прохождения курса</span>
            <ul>
              {course.afterCourse.map((item, idx) => (
                <li key={idx} className="black-text">{item}</li>
              ))}
            </ul>
            <span className="course-main__for">{course.forWhom}</span>
            <div className="course-program">
              <h3>Программа курса</h3>
              <div className="course-program__modules">
                {course.modules.map((module, idx) => (
                  <div key={idx} className={idx === 0 ? 'module active' : 'module'}>
                    <div className="module__header">
                      <div className="module__header-content">
                        <span className="module-title">Модуль {idx + 1}:</span> {module.title}
                      </div>
                      <span>{module.lessons} уроков / {module.points} баллов</span>
                    </div>
                    {module.description && (
                      <div className="module__body">{module.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <aside className="course-main__aside">
            <div className="course-price">
              <div className="course-price__top">
                <div className="course-price__info">
                  <div className="course-price__label">Стоимость</div>
                  <div className="course-price__value"><b>{course.price}</b></div>
                </div>
                <div className="course-price__flag-wrap">
                  <img src={course.flagImage} alt="Флаг" className="course-price__flag" />
                </div>
              </div>
              <ul className="course-price__list">
                <li>{course.lessons} уроков</li>
                <li>{course.tasks} заданий</li>
                <li>{course.tests} тестов</li>
                <li>{course.expertSessions} занятия с экспертом</li>
              </ul>
              <div className="course-price__btn-wrap">
                <button className="course-price__btn" onClick={() => navigate('/score')}>
                  Записаться на курс
                </button>
              </div>
            </div>
            <div className="course-leaders">
              <h4>Лучшие ученики</h4>
              {course.topStudents.map((student, idx) => (
                <div key={idx} className="student-row">
                  <span className="student-num">{idx + 1}</span>
                  <span className="student-name">{student.name}</span>
                  <span className="student-score">{student.score} баллов</span>
                </div>
              ))}
              <a href="/statistics" className="student-stats-link">Смотреть всю статистику</a>
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

        {/* Отзывы */}
        <section className="course-reviews container">
          <h3 className="black-text">Отзывы о курсе</h3>
          <div className="course-reviews__list">
            {course.reviews.map((review, idx) => (
              <div key={idx} className="review">
                <div className="review__author">{review.author}<span className="gray-text">{review.role}</span></div>
                <div className="review__text">{review.text}</div>
                <div className="review__stars">{'★'.repeat(review.stars)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Похожие курсы */}
        <section className="course-similar container">
          <h3>Похожие курсы</h3>
          <div className="course-similar__list">
            {course.similarCourses.map((similar, idx) => (
              <div key={idx} className="similar-card">
                <img src={similar.flag} alt={similar.title} className="similar-flag" />
                <div className="similar-title">{similar.title}</div>
                <div className="similar-info">
                  <div>Длительность: <b>{similar.duration}</b></div>
                  <div>Уровень: <b>{similar.level}</b></div>
                  <div>Модулей: <b>{similar.modules}</b></div>
                </div>
                <div className="similar-footer">
                  <a href="/courses" className="similar-btn">Узнать подробнее <span className="arrow">→</span></a>
                  <div className="similar-price">{similar.price}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div style={{ height: '50px' }}></div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursePage;