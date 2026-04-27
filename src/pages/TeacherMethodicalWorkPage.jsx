import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../services/api';
import { checkUserBan } from '../services/api';
import '../styles/App.css';

function TeacherMethodicalWorkPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState({
    name: '',
    avatar: '',
    language: '',
    licenseStatus: '',
    licenseNumber: '',
    licenseExpiry: ''
  });

  // Данные для таблицы показателей (будут загружены из базы)
  const [metricsData, setMetricsData] = useState([]);

  // Данные для текущего модуля
  const [currentModule, setCurrentModule] = useState({
    title: 'Модуль 3: doy / Мой день',
    deadline: '13-27 мая',
    status: 'В процессе (3 из 5 блоков завершены)',
    tasks: [
      { id: 1, text: 'Подготовить презентацию по теме', completed: true },
      { id: 2, text: 'Разработать упражнения для практики', completed: true },
      { id: 3, text: 'Записать аудиоматериалы', completed: true },
      { id: 4, text: 'Провести тестирование', completed: false },
      { id: 5, text: 'Подготовить домашнее задание', completed: false }
    ]
  });

  // Статусы для плана преподавателя (будут загружены из базы)
  const [teacherPlan, setTeacherPlan] = useState([]);

  // Материалы и ресурсы (будут загружены из базы)
  const [resources, setResources] = useState([]);

  // Прогресс выполнения плана
  const [planProgress, setPlanProgress] = useState('70%');

  // Проверка бана пользователя
  useEffect(() => {
    const checkBan = async () => {
      const isBanned = await checkUserBan();
      if (isBanned) {
        return;
      }
    };
    checkBan();
  }, []);

  // Загрузка данных преподавателя
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const response = await api.getTeacherById(id);
        const teacher = response.teacher;
        if (teacher) {
          const fullName = `${teacher?.firstName || ''} ${teacher?.lastName || ''}`.trim() || 'Преподаватель';
          const avatar = teacher?.avatar || teacher?.photoUrl || '/media/препод.png';
          const language = teacher?.language || teacher?.teaches || '';

          setTeacherInfo({
            name: fullName,
            avatar: avatar,
            language: language,
            licenseStatus: teacher.license?.status === 'active' ? 'Действительна' : (teacher.license?.status || 'Нет данных'),
            licenseNumber: teacher.license?.number || 'Нет данных',
            licenseExpiry: teacher.license?.expiryDate ? new Date(teacher.license.expiryDate).toLocaleDateString('ru-RU') : 'Нет данных'
          });

          // Загрузка данных для таблицы показателей из methodologyWork.metrics
          // Гарантируем, что будет отображено ровно 6 строк
          const placeholderMetrics = [
            { indicator: 'Эффективность методик', value: '95%', dynamics: '▲ +3', norm: '85%', comment: 'Выше среднего по школе' },
            { indicator: 'Инновационность подходов', value: '★★★★★', dynamics: '★ +1', norm: '★★★', comment: 'Автор 5 новых упражнений' },
            { indicator: 'Усвоение материала', value: '4.9/5', dynamics: '▲ +0.3', norm: '4.5', comment: 'Отличные результаты' },
            { indicator: 'Подготовка материалов', value: '9.5/10', dynamics: '▲ +0.5', norm: '8.5', comment: 'Высокое качество' },
            { indicator: 'Вовлеченность учащихся', value: '96%', dynamics: '▲ +6%', norm: '90%', comment: 'Лидер по активности' },
            { indicator: 'Методическая дисциплина', value: '10/10', dynamics: '▲ +1', norm: '9.0', comment: 'Идеальное ведение журнала' }
          ];
          
          if (teacher.methodologyWork?.metrics && teacher.methodologyWork.metrics.length > 0) {
            // Если есть данные из БД, используем их, но гарантируем 6 строк
            const dbMetrics = teacher.methodologyWork.metrics;
            const paddedMetrics = [...dbMetrics];
            // Если меньше 6, добавляем недостающие из placeholderMetrics
            while (paddedMetrics.length < 6) {
              const placeholderIndex = paddedMetrics.length % placeholderMetrics.length;
              paddedMetrics.push({ ...placeholderMetrics[placeholderIndex], indicator: `${placeholderMetrics[placeholderIndex].indicator} (заглушка)` });
            }
            // Обрезаем до 6, если больше
            const finalMetrics = paddedMetrics.slice(0, 6);
            setMetricsData(finalMetrics);
          } else {
            // Если данных нет, используем все 6 заглушек
            setMetricsData(placeholderMetrics);
          }

          // Загрузка плана преподавателя из methodologyWork.plan
          if (teacher.methodologyWork?.plan && teacher.methodologyWork.plan.length > 0) {
            // Добавляем id для каждого элемента плана, если его нет
            const planWithIds = teacher.methodologyWork.plan.map((item, index) => ({
              id: item._id || index + 1,
              task: item.task,
              status: item.status === 'done' ? 'Выполнено' :
                      item.status === 'inprogress' ? 'В процессе' :
                      item.status === 'notstarted' ? 'Не начато' : 'Не начато'
            }));
            setTeacherPlan(planWithIds);
            
            // Рассчитываем прогресс выполнения плана
            const doneCount = planWithIds.filter(item => item.status === 'Выполнено').length;
            const progress = Math.round((doneCount / planWithIds.length) * 100);
            setPlanProgress(`${progress}%`);
          } else {
            // Заглушка, если данных нет
            const defaultPlan = [
              { id: 1, task: 'Разработать 15 карточек с иероглифами', status: 'Выполнено' },
              { id: 2, task: 'Обновить материалы по грамматике', status: 'В процессе' },
              { id: 3, task: 'Проверить аудио-задания студентов', status: 'Не начато' },
              { id: 4, task: 'Подготовить план урока на следующую неделю', status: 'Выполнено' },
              { id: 5, task: 'Разработать тест для модуля 3', status: 'Не начато' }
            ];
            setTeacherPlan(defaultPlan);
            setPlanProgress('60%');
          }

          // Загрузка ресурсов из methodologyWork.resources
          if (teacher.methodologyWork?.resources && teacher.methodologyWork.resources.length > 0) {
            setResources(teacher.methodologyWork.resources);
          } else {
            // Заглушка, если данных нет
            setResources([
              '[PDF] Словарь по теме «Приветствие и знакомство»',
              '[DOCX] Грамматический разбор тонов в китайском языке',
              '[PDF] Методическое пособие по модулю 3',
              '[MP3] Аудиоматериалы для занятия',
              '[YouTube] Видео-разбор сложных тем'
            ]);
          }
        } else {
          // Если учитель не найден, используем заглушку
          setTeacherInfo({
            name: 'Преподаватель',
            avatar: '/media/препод.png',
            language: 'Иностранный язык',
            license: 'Стандартная лицензия преподавателя',
            nextCheck: '01.12.2025'
          });
        }
      } catch (error) {
        console.error('Ошибка загрузки данных преподавателя:', error);
        // В случае ошибки используем заглушку
        setTeacherInfo({
          name: 'Преподаватель',
          avatar: '/media/препод.png',
          language: 'Иностранный язык',
          license: 'Стандартная лицензия преподавателя',
          nextCheck: '01.12.2025'
        });
      } finally {
        setLoading(false);
      }
    };

    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await fetchTeacherData();
    };

    checkAuth();
  }, [id, navigate]);

  const handlePlanCheckboxClick = (id) => {
    setTeacherPlan(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          // Cycle through statuses: notstarted -> inprogress -> done -> notstarted
          let nextStatus;
          if (item.status === 'Не начато') {
            nextStatus = 'В процессе';
          } else if (item.status === 'В процессе') {
            nextStatus = 'Выполнено';
          } else {
            nextStatus = 'Не начато';
          }
          return { ...item, status: nextStatus };
        }
        return item;
      });
      
      // Recalculate progress based on updated array
      const doneCount = updated.filter(item => item.status === 'Выполнено').length;
      const total = updated.length;
      const progress = Math.round((doneCount / total) * 100);
      setPlanProgress(`${progress}%`);
      
      console.log(`Статус задачи ${id} изменен циклически`);
      return updated;
    });
  };

  const handleTaskToggle = (taskId) => {
    setCurrentModule(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
    console.log(`Задача ${taskId} переключена`);
  };

  const handleButtonClick = (buttonName) => {
    console.log(`Кнопка "${buttonName}" нажата`);
    // Заглушка для кнопок
    alert(`Функция "${buttonName}" в разработке`);
  };

  // Функция для получения иконки ресурса
  const getResourceIcon = (resource) => {
    if (resource.includes('[PDF]')) return <img src="/media/pdf.png" alt="PDF" style={{ width: '24px', height: '24px' }} />;
    if (resource.includes('[DOCX]')) return <img src="/media/docx.png" alt="DOCX" style={{ width: '24px', height: '24px' }} />;
    if (resource.includes('[MP3]')) return <img src="/media/mp3.png" alt="MP3" style={{ width: '24px', height: '24px' }} />;
    if (resource.includes('[YouTube]') || resource.includes('[RuTube]')) return <img src="/media/rutube.png" alt="Video" style={{ width: '24px', height: '24px' }} />;
    return '📎';
  };

  // Функция для получения текста ресурса (без префикса)
  const getResourceText = (resource) => {
    return resource.replace(/^\[[^\]]+\]\s*/, '');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p>Загрузка методических работ...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="breadcrumbs">Методическая работа {'>'} Обновить профиль</div>
      <main className="main">
        <div className="main__container">
          <aside className="sidebar">
            <Link to={`/teacher/personal/${id}`} className="sidebar__btn">Личные данные</Link>
            <Link to={`/teacher/contact/${id}`} className="sidebar__btn">Контактные данные</Link>
            <button className="sidebar__btn sidebar__btn--active">Методическая работа</button>
            <Link to={`/teacher/settings/${id}`} className="sidebar__btn">Настройки</Link>
            <div className="sidebar__license" style={{ marginTop: '24px' }}>
              <b>Лицензия:</b><br />
              Статус: {teacherInfo.licenseStatus}<br />
              Номер: {teacherInfo.licenseNumber}<br />
              Следующая проверка: {teacherInfo.licenseExpiry}
            </div>
          </aside>

          <section className="methodical">
            {/* Таблица показателей эффективности */}
            <div className="progress__table-wrapper">
              <table className="progress__table">
                <thead>
                  <tr>
                    <th>Показатель</th>
                    <th>Значение</th>
                    <th>Динамика</th>
                    <th>Норма</th>
                    <th>Комментарий</th>
                  </tr>
                </thead>
                <tbody>
                  {metricsData.map((metric, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'odd-row' : 'even-row'}>
                      <td>{metric.indicator}</td>
                      <td><strong>{metric.value}</strong></td>
                      <td>{metric.dynamics}</td>
                      <td>{metric.norm}</td>
                      <td>{metric.comment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Две колонки: Текущий модуль курса и План преподавателя */}
            <div className="progress__modules">
              {/* ЛЕВАЯ КОЛОНКА: Текущий модуль курса */}
              <div className="module">
                <div className="module__title"><b>Модуль 3: my day / Мой день</b></div>
                <div className="module__stage">
                  <img src="/media/срок.png" alt="Срок" style={{ width: '16px', height: '16px', marginRight: '8px', verticalAlign: 'middle' }} />
                  Срок: {currentModule.deadline}
                </div>
                <div className="module__stage">
                  <img src="/media/статус.png" alt="Статус" style={{ width: '16px', height: '16px', marginRight: '8px', verticalAlign: 'middle' }} />
                  Статус: {currentModule.status}
                </div>
                <ul className="module__tasks">
                  {currentModule.tasks.map(task => (
                    <li key={task.id} className="module__task">
                      <label className="custom-checkbox-label">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleTaskToggle(task.id)}
                          className="custom-checkbox"
                        />
                        <span className={`custom-checkbox-custom ${task.completed ? 'checked' : ''}`}></span>
                        <span className={task.completed ? 'completed' : ''}>
                          {task.text}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                <button
                  className="btn-primary"
                  onClick={() => handleButtonClick('Перейти к модулю')}
                  style={{ marginTop: '16px', width: '100%' }}
                >
                  Перейти к модулю
                </button>
              </div>

              {/* ПРАВАЯ КОЛОНКА: План преподавателя */}
              <div className="achievements">
                <div className="achievements__title">План преподавателя</div>
                <div className="achievements__club">Прогресс выполнения: {planProgress}</div>
                <ul className="module__tasks">
                  {teacherPlan.map(item => {
                    const isCompleted = item.status === 'Выполнено';
                    return (
                      <li key={item.id} className="module__task">
                        <label className="custom-checkbox-label" style={{ width: '100%' }}>
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => handlePlanCheckboxClick(item.id)}
                            className="custom-checkbox"
                          />
                          <span className={`custom-checkbox-custom ${isCompleted ? 'checked' : ''}`}></span>
                          <span className={isCompleted ? 'completed' : ''} style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
                            {item.task}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Блок "Материалы и ресурсы" */}
            <div className="personal-plan">
              <div className="personal-plan__title">Материалы и ресурсы</div>
              <ul className="personal-plan__list">
                {resources.map((resource, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getResourceIcon(resource)}
                    </div>
                    <span>{getResourceText(resource)}</span>
                  </li>
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

export default TeacherMethodicalWorkPage;