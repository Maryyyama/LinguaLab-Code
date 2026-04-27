import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../services/api';
import '../styles/App.css';

function AboutPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Загрузка преподавателей
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const data = await api.getTeachers();
        setTeachers(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки преподавателей:', err);
        setError('Не удалось загрузить данные преподавателей');
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();

    // Логика для иконки учителя
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

    // Логика для иконки ученика
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

  // Функция handleTeacherClick удалена, так как публичные страницы преподавателей отключены

  // Функция для получения изображения преподавателя
  const getTeacherImage = (teacher) => {
    // Проверяем avatar в userId (основное место хранения)
    const avatarFromUserId = teacher.userId?.avatar;
    // Если аватарка не является дефолтной, используем её
    if (avatarFromUserId && avatarFromUserId !== '/media/default-avatar.png') {
      return avatarFromUserId;
    }
    // Для обратной совместимости проверяем teacher.avatar
    const avatarFromTeacher = teacher.avatar;
    if (avatarFromTeacher && avatarFromTeacher !== '/media/default-avatar.png') {
      return avatarFromTeacher;
    }
    // Если фото не задано или дефолтное, формируем путь динамически на основе имени
    // Проверяем наличие файла с именем преподавателя
    const teacherName = teacher.name || teacher.fullName || (teacher.firstName && teacher.lastName ? `${teacher.firstName} ${teacher.lastName}` : '');
    if (teacherName) {
      // Убираем пробелы и приводим к нижнему регистру для формирования имени файла
      const fileName = teacherName.toLowerCase().replace(/\s+/g, ' ');
      // Проверяем существование файлов с разными расширениями, приоритет у jpg (так как новые аватарки в jpg)
      const possiblePaths = [
        `/media/${fileName}.jpg`,
        `/media/${fileName}.jpeg`,
        `/media/${fileName}.png`,
      ];
      // В реальном приложении здесь можно было бы проверить существование файла,
      // но для простоты возвращаем первый возможный путь
      return possiblePaths[0];
    }
    // Если фото не задано и нет имени, формируем путь на основе языка
    if (teacher.language) {
      // Пробуем найти флаг языка (например, флаг италии.png)
      const languageMap = {
        italian: 'флаг италии',
        french: 'флаг франции',
        chinese: 'флаг китая',
        korean: 'флаг южной кореи',
        japanese: 'флаг японии',
        german: 'Флаг Германии',
        spanish: 'флаг испании',
        english: 'флаг  америки'
      };
      const languageKey = teacher.language.toLowerCase();
      if (languageMap[languageKey]) {
        return `/media/${languageMap[languageKey]}.png`;
      }
      return `/media/${teacher.language}.png`;
    }
    // Фолбэк изображение
    return '/media/препод.png';
  };

  // Функция для получения названия предмета
  const getTeacherSubject = (teacher) => {
    if (teacher.specialization) {
      return teacher.specialization;
    }
    if (teacher.language) {
      const languageMap = {
        'english': 'английского',
        'german': 'немецкого',
        'spanish': 'испанского',
        'chinese': 'китайского',
        'french': 'французского',
        'italian': 'итальянского',
        'japanese': 'японского',
        'korean': 'корейского'
      };
      const lang = teacher.language.toLowerCase();
      return `Преподаватель ${languageMap[lang] || teacher.language}`;
    }
    return 'Преподаватель';
  };

  return (
    <>
      <Header />
      <main>
        {/* ОСНОВНАЯ СЕКЦИЯ "О НАС" */}
        <section className="about-main-section">
          <div className="container">
            <h1>О нас</h1>
            <p className="subtitle">Говори легко – живи свободно!</p>
            
            {/* ПЕРВЫЙ БЛОК: Текст + два изображения */}
            <div className="content-block">
              <div className="text-block">
                <span className="highlight">LinguaLab</span> – интерактивная онлайн-школа иностранных языков
                <p className="regular-text">
                  Это новая, полностью автоматизированная платформа, которая поможет вам прокачать язык для работы, учёбы или общения.<br /><br />
                  Наша система позволяет вам в динамичной игровой форме овладеть иностранным языком, свободно мыслить и говорить, строить предложения, 
                  поддерживать разговор в любом обществе и в любой жизненной ситуации.
                </p>
              </div>
              <div className="image-block">
                <div className="dual-images">
                  <img src="/media/девушка в розовом.png" alt="Девушка с планшетом" />
                  <img src="/media/парень в розовом.png" alt="Парень с планшетом" />
                </div>
              </div>
            </div>
            
            {/* ВТОРОЙ БЛОК: Предметы + текст */}
            <div className="content-block">
              <div className="items-block">
                <img src="/media/академическая шапочка.png" alt="Академическая шапочка" className="cap" />
                <img src="/media/чемодан.png" alt="Чемодан" className="suitcase" />
                <img src="/media/рюкзак.png" alt="Рюкзак" className="backpack" />
              </div>
              <div className="text-block">
                <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px', color: '#000' }}>
                  Для тех, кто сам хочет строить свою жизнь и стремится к мечте!
                </h2>
                <p className="regular-text">
                  Наша школа подойдёт для школьников и студентов, бизнесменов и путешественников, амбициозных предпринимателей и начинающих эмигрантов. 
                  Мы даём вам основы и прочные знания иностранных языков за короткое время и в удобном месте.
                </p>
              </div>
            </div>
            
            {/* ТРЕТИЙ БЛОК: Текст + два изображения */}
            <div className="content-block">
              <div className="text-block">
                <span className="highlight">LinguaLab</span> отличается от классических курсов изучения языка
                <p className="regular-text">
                  Это понятная, нескучная и полностью интерактивная система!<br />
                  Вы сами выбираете где, как и сколько заниматься. Она подойдёт всем, кто хочет за короткий срок качественно изменить свою жизнь, 
                  всем, кто готов искать новые возможности с новым языком!
                </p>
              </div>
              <div className="image-block">
                <div className="dual-images">
                  <img src="/media/девушка в розовых наушниках.png" alt="Девушка за ноутбуком" />
                  <img src="/media/парень в желтых наушниках.png" alt="Парень за ноутбуком" />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* СЕКЦИЯ С ПРЕПОДАВАТЕЛЯМИ */}
        <section className="about-teachers-section">
          <div className="container">
            <h2 className="section-title">Курсы создали профессиональные филологи и педагоги</h2>
            <p className="teachers-description">
              Носители языка, преподаватели зарубежных университетов, которые много лет работают в том числе и в России, 
              владеют методиками преподавания своего языка как иностранного и прекрасно знают нюансы преподавания именно в русскоязычной среде.
            </p>
            
            {loading ? (
              <div className="teachers-loading">
                <p>Загрузка преподавателей...</p>
              </div>
            ) : error ? (
              <div className="teachers-error">
                <p>{error}</p>
                <p>Пожалуйста, попробуйте обновить страницу позже.</p>
              </div>
            ) : teachers.length === 0 ? (
              <div className="teachers-empty">
                <p>Нет данных о преподавателях</p>
              </div>
            ) : (
              <div className="teachers-grid">
                {teachers.map((teacher) => (
                  <div
                    key={teacher._id}
                    className="teacher-card"
                  >
                    <img 
                      src={getTeacherImage(teacher)} 
                      alt={teacher.name || teacher.fullName || 'Преподаватель'} 
                      className="teacher-img" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/media/препод.png';
                      }}
                    />
                    <div className="teacher-name">
                      {teacher.name || teacher.fullName || (teacher.firstName && teacher.lastName ? `${teacher.firstName} ${teacher.lastName}` : 'Преподаватель')}
                    </div>
                    <div className="teacher-subject">
                      {getTeacherSubject(teacher)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* СЕКЦИЯ РЕГИСТРАЦИИ */}
        <section className="registration-container">
          <div className="registration-bg"></div>
          <div className="registration-section">
            <div className="container">
              <div className="registration-content">
                <div className="registration-text">
                  <h2 className="registration-title">
                    Регистрируйтесь и приступайте к первому бесплатному уроку
                  </h2>
                  <form className="form" action="/registration" method="get">
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">Телефон</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        className="form-input" 
                        placeholder="+7 (___) ___ __ __" 
                        required 
                      />
                    </div>
                    <button type="submit" className="submit-btn">Продолжить регистрацию</button>
                    <div className="checkbox-group">
                      <input type="checkbox" id="agreement" className="checkbox" required />
                      <label htmlFor="agreement" className="checkbox-label">
                        Отправляя заявку, я соглашаюсь с 
                        <Link to="/privacy"> политикой конфиденциальности</Link> и 
                        <Link to="/terms"> пользовательским соглашением</Link>
                      </label>
                    </div>
                  </form>
                </div>
                <div className="registration-image">
                  <img src="/media/регистрация.png" alt="Регистрация" className="registration-img" />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* СЕКЦИЯ ЛИЦЕНЗИИ */}
        <section className="about-license-section">
          <div className="container">
            <h2 className="license-title">Лицензионная информация:</h2>
            <ul className="license-list">
              <li>
                <Link to="/license">Официальная лицензия на образовательную деятельность №035-01234-77/00123456 от 20.05.2021, выдана Министерством просвещения РФ</Link>
              </li>
              <li>Аккредитованные программы обучения согласно ФГОС</li>
              <li>Все преподаватели имеют квалификационные сертификаты</li>
              <li>Электронные сертификаты соответствуют требованиям Приказа Минобрнауки №499</li>
              <li>Финансовая гарантия возврата средств через аккредитованный банк-партнёр</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default AboutPage;