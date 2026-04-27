import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/App.css';

function BlogPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [mainBlockVisible, setMainBlockVisible] = useState(true);

  // Данные для карточек блога
  const blogCards = [
    // Новости (4 шт)
    { id: 1, category: 'news', title: 'Открыта регистрация на летние курсы 2025', date: '15-04-2026', description: 'Запись на интенсивные летние курсы по всем языкам уже открыта. Специальные цены до 30 апреля!', link: '/news/1' },
    { id: 2, category: 'news', title: 'Открыт набор на курс французского языка для начинающих', date: '15-04-2026', description: 'Новый курс французского языка уже доступен на нашей платформе. Запишитесь на пробный урок бесплатно!', link: '/news/1' },
    { id: 3, category: 'news', title: 'Стартуют занятия по японскому языку уровня Intermediate', date: '18-04-2026', description: 'Открыт набор в группу по японскому языку для студентов со средним уровнем. Присоединяйтесь!', link: '/news/2' },
    { id: 4, category: 'news', title: 'Новый курс делового английского для профессионалов', date: '20-04-2026', description: 'Специализированный курс для бизнесменов и специалистов. Практические кейсы из реальной деловой среды.', link: '/news/3' },
    
    // Статьи (2 шт)
    { id: 5, category: 'articles', title: '"Истории успеха: как наши студенты достигли своих целей в изучении языка"', date: '12-04-2026', description: 'Вдохновитесь реальными историями успеха студентов, которые с помощью нашей платформы…', link: '#' },
    { id: 6, category: 'articles', title: '"Интерактивная платформа: как это работает?" Отвечает основатель проекта…', date: '12-04-2026', description: 'Мой коллега – профессиональный филолог и лингвист - носитель языка преподавал зарубежным университетах, которые…', link: '#' }
  ];

  // Фильтрация карточек
  const filteredCards = blogCards.filter(card => 
    activeFilter === 'all' || card.category === activeFilter
  );

  // Эффект для скрытия/показа основного блока
  useEffect(() => {
    if (activeFilter === 'all' || activeFilter === 'news') {
      setMainBlockVisible(true);
    } else {
      setMainBlockVisible(false);
    }
  }, [activeFilter]);

  // Логика для иконок учителя/ученика (как в других страницах)
  useEffect(() => {
    const isTeacher = localStorage.getItem('isTeacher') === 'true';
    const teacherIcon = document.getElementById('teacher-icon');
    if (teacherIcon) {
      teacherIcon.style.display = isTeacher ? 'block' : 'none';
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

  return (
    <>
      <Header />
      <main className="main">
        <div className="container">
          {/* ЗАГОЛОВОК */}
          <h1 className="blog__title">
            Блог<br />
            <span>LinguaLab</span>
          </h1>
          <p className="blog__subtitle">Будьте в курсе наших событий. Следите за нашими новостями</p>
          
          {/* ФИЛЬТРЫ */}
          <div className="blog__filters">
            {['all', 'news', 'articles'].map(filter => (
              <button
                key={filter}
                className={`filter ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === 'all' ? 'Все' :
                 filter === 'news' ? 'Новости' : 'Статьи'}
              </button>
            ))}
          </div>

          {/* ГЛАВНЫЙ БЛОК (виден только при фильтре 'all' или 'news') */}
          {mainBlockVisible && (
            <div className="blog__main-block" data-category="news">
              <div className="main-block__content">
                <h2 className="main-block__title">Открыта регистрация на летние курсы 2026</h2>
                <div className="main-block__date">15-04-2026</div>
                <p className="main-block__desc">
                  Запись на интенсивные летние курсы по всем языкам уже открыта. Специальные цены до 30 апреля!
                </p>
                <div className="main-block__tags">
                  <span className="tag">Новости</span>
                </div>
                <Link to="/news/1" className="main-block__more">
                  Подробнее <span className="arrow">→</span>
                </Link>
              </div>
              <div className="main-block__img">
                <img src="/media/парень с книгой.png" alt="Парень с книгой" />
              </div>
            </div>
          )}

          {/* СЕТКА КАРТОЧЕК */}
          <div className="blog__cards">
            {filteredCards.map(card => (
              <div key={card.id} className="card" data-category={card.category}>
                <h3>{card.title}</h3>
                <div className="card__date">{card.date}</div>
                <p>{card.description}</p>
                <Link to={card.link} className="card__more">
                  Подробнее <span className="arrow">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default BlogPage;