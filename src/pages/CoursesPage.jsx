import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/App.css';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLanguage, setActiveLanguage] = useState('all');
  const [levelFilters, setLevelFilters] = useState({
    beginner: true,
    intermediate: true,
    advanced: true, // показывать advanced по умолчанию, если они есть
  });
  const [purposeFilters, setPurposeFilters] = useState({
    school: false,
    students: false,
    communication: false,
    business: false,
    travel: false,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getCourses({ status: 'active' });
        setCourses(data);
      } catch (error) {
        console.error('Ошибка загрузки курсов:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Фильтрация курсов
  const filteredCourses = courses.filter(course => {
    if (activeLanguage !== 'all' && course.language !== activeLanguage) {
      return false;
    }

    const levelKey = course.level; // 'beginner', 'intermediate', 'advanced'
    if (!levelFilters[levelKey]) return false;

    // Фильтр по целям
    // Если ни одна цель не выбрана, пропускаем фильтрацию
    const selectedPurposes = Object.keys(purposeFilters).filter(purpose => purposeFilters[purpose]);
    if (selectedPurposes.length > 0) {
      // Маппинг целей к уровням
      const purposeToLevels = {
        school: ['beginner'],
        students: ['intermediate', 'advanced'],
        communication: ['beginner', 'intermediate'],
        business: ['intermediate', 'advanced'],
        travel: ['beginner', 'intermediate'],
      };
      
      // Проверяем, подходит ли курс хотя бы под одну выбранную цель
      const matchesPurpose = selectedPurposes.some(purpose => {
        const allowedLevels = purposeToLevels[purpose];
        return allowedLevels.includes(course.level);
      });
      
      if (!matchesPurpose) return false;
    }

    return true;
  });

  // Проверяем, есть ли курсы с уровнем "advanced" среди всех курсов (независимо от фильтров)
  const hasAdvancedCourses = courses.some(course => course.level === 'advanced');
  
  // Группируем курсы по языку для построчного отображения
  const languageOrder = ['english', 'german', 'spanish', 'chinese', 'french', 'japanese', 'korean', 'italian'];
  const allLevels = ['beginner', 'intermediate', 'advanced'];
  // Определяем, какие уровни показывать: если есть advanced курсы, то 3 колонки, иначе 2
  const displayLevels = hasAdvancedCourses ? allLevels : ['beginner', 'intermediate'];
  
  // Создаем структуру: для каждого языка массив курсов по уровням
  const coursesByLanguage = {};
  
  languageOrder.forEach(lang => {
    coursesByLanguage[lang] = {};
    allLevels.forEach(level => {
      coursesByLanguage[lang][level] = filteredCourses.find(c => c.language === lang && c.level === level) || null;
    });
  });

  // Получение уникальных языков из курсов для фильтра
  const uniqueLanguages = [...new Set(courses.map(course => course.language))].filter(Boolean);
  
  // Преобразование уровня для отображения
  const levelDisplay = {
    beginner: 'Начальный',
    intermediate: 'Средний',
    advanced: 'Высокий'
  };

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

  if (loading) {
    return <div className="container">Загрузка курсов...</div>;
  }

  return (
    <>
      <Header />
      <main className="courses-page">
        <div className="container">
          {/* ЗАГОЛОВОК */}
          <h1 className="courses-main-title">Курсы</h1>
          
          {/* ФИЛЬТРЫ ЯЗЫКОВ - динамические */}
          <div className="courses-language-filters-line">
            <button
              className={`lang-link ${activeLanguage === 'all' ? 'active' : ''}`}
              onClick={() => setActiveLanguage('all')}
            >
              Всё
            </button>
            {uniqueLanguages.map(lang => (
              <span key={lang}>
                <span className="lang-separator">|</span>
                <button
                  className={`lang-link ${activeLanguage === lang ? 'active' : ''}`}
                  onClick={() => setActiveLanguage(lang)}
                >
                  {languageDisplay[lang] || lang}
                </button>
              </span>
            ))}
          </div>

          {/* ОСНОВНОЙ КОНТЕНТ: КАРТОЧКИ СЛЕВА + САЙДБАР СПРАВА */}
          <div className="courses-content-layout">
            {/* КАРТОЧКИ КУРСОВ - построчно по языкам */}
            <div className={`courses-rows ${hasAdvancedCourses ? 'three-columns' : ''}`}>
               {languageOrder.map(lang => {
                 // Проверяем, есть ли хотя бы один курс для этого языка
                 const hasAnyCourse = allLevels.some(level => coursesByLanguage[lang][level] !== null);
                 if (!hasAnyCourse) return null;
                 
                 return (
                   <div key={lang} className="course-language-row">
                     {displayLevels.map(level => {
                       const course = coursesByLanguage[lang][level];
                       if (!course) {
                         // Пустая ячейка для отсутствующего курса
                         return <div key={`${lang}-${level}`} className="course-card empty-course" />;
                       }
                       
                       return (
                         <div key={course.id || course._id} className="course-card">
                           <img
                             src={course.flagImage || course.flag}
                             alt={languageDisplay[course.language] || course.title}
                             className="flag-img"
                             onError={(e) => {
                               e.target.src = '/media/placeholder.png';
                             }}
                           />
                           <h2>{course.title || languageDisplay[course.language]}</h2>
                           <div className="course-details">
                             <p>Длительность: {course.duration}</p>
                             <p>Уровень: {levelDisplay[course.level] || course.level}</p>
                             <p>Модуль: {course.modules}</p>
                           </div>
                           <div className="course-footer">
                             <Link to={`/courses/${course.id || course._id}`} className="details-link">
                               Узнать подробнее →
                             </Link>
                             <p className="price">От {course.price} руб.</p>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 );
               })}
            </div>

            {/* САЙДБАР С ФИЛЬТРАМИ - СПРАВА */}
            <aside className="courses-sidebar">
              {/* БЛОК УРОВЕНЬ */}
              <div className="sidebar-block">
                <h3 className="sidebar-title">Уровень</h3>
                <div className="sidebar-checkboxes">
                  {[
                    { key: 'beginner', label: 'Начальный' },
                    { key: 'intermediate', label: 'Средний' },
                    { key: 'advanced', label: 'Высокий' }
                  ].map(({ key, label }) => (
                    <label key={key} className="sidebar-checkbox">
                      <input
                        type="checkbox"
                        checked={levelFilters[key]}
                        onChange={() => setLevelFilters(prev => ({
                          ...prev,
                          [key]: !prev[key]
                        }))}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* БЛОК ДЛЯ КАКИХ ЦЕЛЕЙ */}
              <div className="sidebar-block">
                <h3 className="sidebar-title">Для каких целей</h3>
                <div className="sidebar-checkboxes">
                  {[
                    { key: 'school', label: 'Школа' },
                    { key: 'students', label: 'Студенты' },
                    { key: 'communication', label: 'Общение' },
                    { key: 'business', label: 'Бизнес' },
                    { key: 'travel', label: 'Путешествие' }
                  ].map(({ key, label }) => (
                    <label key={key} className="sidebar-checkbox">
                      <input
                        type="checkbox"
                        checked={purposeFilters[key]}
                        onChange={() => setPurposeFilters(prev => ({
                          ...prev,
                          [key]: !prev[key]
                        }))}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* Стрелка назад */}
          <div className="back-arrow">
            <Link to="/">
              <img src="/media/вернуться.png" alt="Назад" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CoursesPage;