import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../services/api';
import '../styles/App.css';

function GradePage() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверка авторизации и загрузка данных студента
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/entrance');
      return;
    }

    const fetchStudentData = async () => {
      try {
        const student = await api.getStudentProfile();
        setStudentData(student);
      } catch (error) {
        console.error('Ошибка загрузки студента:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading">Загрузка...</div>
        <Footer />
      </>
    );
  }

  // Если у студента нет курсов, показываем сообщение
  if (!studentData?.enrolledCourses?.length) {
    return (
      <>
        <Header />
        <div className="breadcrumbs">Успеваемость {'>'} Обновить профиль</div>
        <main className="main">
          <div className="main__container">
            <aside className="sidebar">
              <Link to="/student-info" className="sidebar__btn">Личные данные</Link>
              <Link to="/student-contact" className="sidebar__btn">Контактные данные</Link>
              <button className="sidebar__btn sidebar__btn--active">Успеваемость</button>
              <Link to="/student/settings" className="sidebar__btn">Настройки</Link>
            </aside>
            <section className="progress">
              <div className="empty-state" style={{ textAlign: 'center', padding: '50px' }}>
                <h3>У вас пока нет курсов</h3>
                <p>Запишитесь на первый курс, чтобы видеть свою успеваемость</p>
                <Link to="/courses" className="btn btn-primary">Выбрать курс</Link>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Преобразование языка для отображения
  const languageDisplay = {
    english: 'Английский',
    german: 'Немецкий',
    spanish: 'Испанский',
    chinese: 'Китайский',
    french: 'Французский',
    japanese: 'Японский',
    korean: 'Корейский',
    italian: 'Итальянский'
  };

  const levelDisplay = {
    beginner: 'Начальный',
    intermediate: 'Средний',
    advanced: 'Высокий'
  };

  return (
    <>
      <Header />
      
      {/* Хлебные крошки */}
      <div className="breadcrumbs">
        Успеваемость {'>'} Обновить профиль
      </div>

      <main className="main">
        <div className="main__container">
          {/* Сайдбар */}
          <aside className="sidebar">
            <Link to="/student-info" className="sidebar__btn">Личные данные</Link>
            <Link to="/student-contact" className="sidebar__btn">Контактные данные</Link>
            <button className="sidebar__btn sidebar__btn--active">Успеваемость</button>
            <Link to="/student/settings" className="sidebar__btn">Настройки</Link>
          </aside>

          {/* Контент успеваемости */}
          <section className="progress">
            <h1 className="progress__title">Успеваемость</h1>
            
            {/* Мои курсы */}
            <div className="progress__table-wrapper">
              <h3 style={{ marginBottom: '15px', padding: '0 16px' }}>Мои курсы</h3>
              <table className="progress__table">
                <thead>
                  <tr>
                    <th>Язык</th>
                    <th>Уровень</th>
                    <th>Группа</th>
                    <th>Прогресс</th>
                    <th>Посещаемость</th>
                    <th>Последний тест</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.enrolledCourses.map((course, idx) => (
                    <tr key={idx}>
                      <td>{languageDisplay[course.language] || course.language}</td>
                      <td>{levelDisplay[course.level] || course.level}</td>
                      <td>{course.group || 'Стандартная группа'}</td>
                      <td>
                        {course.progress.completedLessons} / {course.progress.totalLessons} уроков
                        ({Math.round((course.progress.completedLessons / (course.progress.totalLessons || 1)) * 100)}%)
                      </td>
                      <td>{course.progress.attendance || 0}%</td>
                      <td>{course.progress.lastTestScore || 0}/100</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Текущий модуль (только если есть активный курс) */}
            {studentData.enrolledCourses.some(c => c.status === 'active') && (
              <div className="progress__modules">
                <div className="module">
                  <div className="module__title">
                    <b>Текущий модуль</b>
                  </div>
                  <div className="module__stage">
                    У вас нет активных заданий
                  </div>
                  <div className="module__stage">
                    Начните изучение курса, чтобы видеть прогресс
                  </div>
                  <ul className="module__tasks">
                    <li className="module__task">Прослушать первую лекцию</li>
                    <li className="module__task">Выполнить первое упражнение</li>
                    <li className="module__task">Пройти вводный тест</li>
                  </ul>
                </div>

                {/* Достижения */}
                <div className="achievements">
                  <div className="achievements__title">Достижения и сертификаты</div>
                  <div className="achievements__club">
                    Разговорный клуб <span>0%</span>
                  </div>
                  <div className="achievements__progress-bar">
                    <span style={{ width: '0%' }}></span>
                  </div>
                  <div className="achievements__cert">
                    Сертификат появится после завершения курса
                  </div>
                  <button className="achievements__btn" disabled>
                    Скачать сертификат
                  </button>
                </div>
              </div>
            )}

            {/* Личный план обучения */}
            <div className="personal-plan">
              <div className="personal-plan__title">Личный план обучения</div>
              <div className="personal-plan__progress">
                Выполнение плана 0%
              </div>
              <div className="personal-plan__progress-bar">
                <span style={{ width: '0%' }}></span>
              </div>
              <ul className="personal-plan__list">
                <li>
                  <span className="personal-plan__icon">
                    <img src="/media/Читать по 5 книг в месяц.png" alt="Читать" />
                  </span>
                  <div className="personal-plan__text">
                    <b>Читать по 5 книг в месяц</b>
                    <span>Фокус: современная литература и статьи</span>
                  </div>
                </li>
                <li>
                  <span className="personal-plan__icon">
                    <img src="/media/Письменная практика.png" alt="Письменная практика" />
                  </span>
                  <div className="personal-plan__text">
                    <b>Письменная практика</b>
                    <span>Писать 2 эссе в неделю (темы: культура, путешествия, футуризм)</span>
                  </div>
                </li>
                <li>
                  <span className="personal-plan__icon">
                    <img src="/media/Аудирование.png" alt="Аудирование" />
                  </span>
                  <div className="personal-plan__text">
                    <b>Аудирование</b>
                    <span>Конспектировать 5 новых аудио в день</span>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default GradePage;