import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/App.css';

function ChineseTeacherMethodicalWorkPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Данные для таблицы показателей (для китайского учителя)
  const metricsData = [
    { indicator: 'Эффективность методик', value: '95%', dynamics: '▲ +3', norm: '85%', comment: 'Выше среднего по школе' },
    { indicator: 'Усвоение материала', value: '4.9/5', dynamics: '▲ +0.2', norm: '4.5', comment: 'Лучший результат в потоке' },
    { indicator: 'Инновационность подходов', value: '★★★★★', dynamics: '★ +1', norm: '★★★', comment: 'Автор 5 новых упражнений' },
    { indicator: 'Подготовка материалов', value: '9.5/10', dynamics: '▲ +0.5', norm: '8.5', comment: 'Отличная подготовка по китайскому' },
    { indicator: 'Вовлеченность учащихся', value: '96%', dynamics: '▲ +6%', norm: '90%', comment: 'Лидер по активности' },
    { indicator: 'Методическая дисциплина', value: '10/10', dynamics: '▲ +1', norm: '9.0', comment: 'Идеальное ведение журнала' }
  ];

  // Данные для текущего модуля (китайский язык)
  const currentModule = {
    title: 'Модуль: 4, тип: 你好 / Приветствие',
    deadline: '15-29 мая',
    status: 'В процессе (2 из 6 блоков завершены)',
    tasks: [
      'Провести лекции по иероглифике',
      'Подготовить тест по тонам',
      'Проверить письменные задания',
      'Организовать разговорную практику'
    ]
  };

  // Статусы для плана преподавателя (для китайского учителя)
  const [teacherPlan, setTeacherPlan] = useState([
    { id: 1, task: 'Разработать 15 карточек с иероглифами', status: 'done' },
    { id: 2, task: 'Обновить материалы по грамматике', status: 'inprogress' },
    { id: 3, task: 'Проверить аудио-задания студентов', status: 'notstarted' },
    { id: 4, task: 'Запланировать разговорный клуб', status: 'done' }
  ]);

  // Материалы и ресурсы (для китайского языка)
  const resources = [
    '[PDF] Словарь по теме «Приветствие и знакомство»',
    '[DOCX] Грамматический разбор тонов в китайском языке',
    '[MP3] Аудио для упражнения «Введение себя»',
    '[YouTube] Видео разбор ошибок учащихся по китайскому языку (доступ только преподавателям)'
  ];

  // Состояние для выпадающего списка
  const [openDropdown, setOpenDropdown] = useState(null);

  // Проверка авторизации при загрузке страницы
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'teacher') {
      alert('Доступ запрещен. Только для преподавателей.');
      navigate('/');
      return;
    }

    // Проверяем, что это учитель китайского
    const teacherLogin = user.login;
    if (teacherLogin !== 'wang_xiao' && teacherLogin !== 'Ван Сяо') {
      // Перенаправляем на правильную страницу
      if (teacherLogin === 'john_richards') navigate('/teacher/methodical');
      else if (teacherLogin === 'hans_schmidt') navigate('/teacher/german/methodical');
      else if (teacherLogin === 'juan_perez') navigate('/teacher/spanish/methodical');
      else navigate('/teacher/methodical');
      return;
    }

    // Загружаем сохраненные статусы из localStorage
    const savedPlan = localStorage.getItem('chineseTeacherMethodicalPlan');
    if (savedPlan) {
      setTeacherPlan(JSON.parse(savedPlan));
    }

    setLoading(false);
  }, [navigate]);

  // Функция для получения текста статуса
  const getStatusText = (status) => {
    switch(status) {
      case 'done': return 'Выполнено';
      case 'inprogress': return 'В процессе';
      case 'notstarted': return 'Не начато';
      default: return 'Не начато';
    }
  };

  // Функция для получения класса статуса
  const getStatusClass = (status) => {
    switch(status) {
      case 'done': return 'status-done';
      case 'inprogress': return 'status-inprogress';
      case 'notstarted': return 'status-notstarted';
      default: return 'status-notstarted';
    }
  };

  // Изменение статуса задачи
  const changeStatus = (taskId, newStatus) => {
    const updatedPlan = teacherPlan.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTeacherPlan(updatedPlan);
    localStorage.setItem('chineseTeacherMethodicalPlan', JSON.stringify(updatedPlan));
    setOpenDropdown(null);
  };

  // Навигация по страницам
  const goToPersonalInfo = () => {
    navigate('/teacher/chinese');
  };

  const goToContactInfo = () => {
    navigate('/teacher/chinese/contact');
  };

  const goToSettings = () => {
    navigate('/teacher/chinese/settings');
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <>
      <Header />
      
      {/* Хлебные крошки */}
      <div className="breadcrumbs">
        Методическая работа {'>'} Обновить профиль
      </div>

      <main className="main">
        <div className="main__container">
          {/* Сайдбар */}
          <aside className="sidebar">
            <button className="sidebar__btn" onClick={goToPersonalInfo}>Личные данные</button>
            <button className="sidebar__btn" onClick={goToContactInfo}>Контактные данные</button>
            <button className="sidebar__btn sidebar__btn--active">Методическая работа</button>
            <button className="sidebar__btn" onClick={goToSettings}>Настройки</button>
          </aside>

          {/* Контент */}
          <section className="progress">
            <h1 className="progress__title">Методическая работа</h1>
            
            {/* Таблица показателей */}
            <div className="progress__table-wrapper">
              <table className="progress__table">
                <thead>
                  <tr>
                    <th>Показатель</th>
                    <th>Значение</th>
                    <th>Динамика</th>
                    <th>Норматив</th>
                    <th>Комментарий методиста</th>
                  </tr>
                </thead>
                <tbody>
                  {metricsData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.indicator}</td>
                      <td>{row.value}</td>
                      <td>{row.dynamics}</td>
                      <td>{row.norm}</td>
                      <td>{row.comment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Модули и план преподавателя */}
            <div className="progress__modules">
              {/* Текущий модуль */}
              <div className="module">
                <div className="module__title"><b>Текущий модуль курса:</b></div>
                <div className="module__stage">{currentModule.title}</div>
                <div className="module__stage">Срок: {currentModule.deadline}</div>
                <div className="module__stage">Статус: {currentModule.status}</div>
                <ul className="module__tasks">
                  {currentModule.tasks.map((task, index) => (
                    <li key={index} className="module__task">{task}</li>
                  ))}
                </ul>
              </div>

              {/* План преподавателя */}
              <div className="achievements">
                <div className="achievements__title">План преподавателя</div>
                <div className="achievements__club">Прогресс выполнения: 75%</div>
                <ul className="module__tasks">
                  {teacherPlan.map((item) => (
                    <li key={item.id} className="module__task" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{item.task}</span>
                      <div className="status-wrapper" style={{ position: 'relative', display: 'inline-block', marginLeft: '8px' }}>
                        <span 
                          className={`status-badge ${getStatusClass(item.status)}`}
                          onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {getStatusText(item.status)} ▼
                        </span>
                        
                        {/* Выпадающий список */}
                        {openDropdown === item.id && (
                          <div className="status-dropdown">
                            <div 
                              className="dropdown-item status-done-option"
                              onClick={() => changeStatus(item.id, 'done')}
                            >
                              ✅ Выполнено
                            </div>
                            <div 
                              className="dropdown-item status-inprogress-option"
                              onClick={() => changeStatus(item.id, 'inprogress')}
                            >
                              🔄 В процессе
                            </div>
                            <div 
                              className="dropdown-item status-notstarted-option"
                              onClick={() => changeStatus(item.id, 'notstarted')}
                            >
                              ⭕ Не начато
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Материалы и ресурсы */}
            <div className="personal-plan">
              <div className="personal-plan__title">Материалы и ресурсы</div>
              <ul className="personal-plan__list">
                {resources.map((resource, index) => (
                  <li key={index}>{resource}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ChineseTeacherMethodicalWorkPage;