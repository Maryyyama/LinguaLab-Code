
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/App.css';
import '../styles/admin_panel.css';

function AdminPanelPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' или 'edit'
  const [currentEditId, setCurrentEditId] = useState(null);
  
  // ========== ДАННЫЕ ДЛЯ КУРСОВ ==========
  const [courses, setCourses] = useState([]);

  // Форма для курса
  const [courseForm, setCourseForm] = useState({
    name: '',
    language: 'Немецкий',
    flagImage: '/media/Флаг Германии.png',
    level: 'Начальный',
    students: 0,
    price: '',
    duration: '',
    modules: 8
  });

  // ========== ДАННЫЕ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ ==========
  const [users, setUsers] = useState([]);

  // ========== ДАННЫЕ ДЛЯ ПРЕПОДАВАТЕЛЕЙ (обновленные) ==========
  const [teachers, setTeachers] = useState([]);

  // Форма для преподавателя (обновленная согласно требованиям)
  const [teacherForm, setTeacherForm] = useState({
    // Поля для создания пользователя (только при добавлении)
    login: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Поля профиля преподавателя
    specialization: '',
    qualification: 'Высшая категория',
    experience: '',
    status: 'active',
    language: 'english',
    education: ''
  });


  // ========== ДАННЫЕ ДЛЯ ФИНАНСОВ ==========
  const [invoices, setInvoices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Форма для счета
  const [invoiceForm, setInvoiceForm] = useState({
    client: '',
    amount: '',
    course: '',
    dueDate: ''
  });

  // ========== ДАННЫЕ ДЛЯ ОТЧЕТОВ ==========
  // eslint-disable-next-line no-unused-vars
  const [attendanceStats, setAttendanceStats] = useState([
    { course: 'Английский для начинающих', attendance: '92%', students: 89, completed: 78 },
    { course: 'Немецкий для среднего уровня', attendance: '88%', students: 38, completed: 33 },
    { course: 'Китайский для начинающих', attendance: '95%', students: 52, completed: 49 }
  ]);

  // eslint-disable-next-line no-unused-vars
  const [teacherActivity, setTeacherActivity] = useState([
    { teacher: 'Джон Ричардс', hours: 42, students: 35, rating: 4.8 },
    { teacher: 'Ван Сяо', hours: 38, students: 28, rating: 4.9 },
    { teacher: 'Хуан Пере', hours: 35, students: 30, rating: 4.7 },
    { teacher: 'Ханс Шмидт', hours: 40, students: 32, rating: 4.8 }
  ]);

  // eslint-disable-next-line no-unused-vars
  const [teacherLoad, setTeacherLoad] = useState([
    { teacher: 'Джон Ричардс', load: '85%', groups: 3, individuals: 5 },
    { teacher: 'Ван Сяо', load: '70%', groups: 2, individuals: 8 },
    { teacher: 'Хуан Пере', load: '75%', groups: 2, individuals: 12 },
    { teacher: 'Ханс Шмидт', load: '80%', groups: 3, individuals: 15 }
  ]);

  // ========== ДАННЫЕ ДЛЯ КОНТЕНТА ==========
  const [articles, setArticles] = useState([
    { id: 1, title: 'Новости школы', content: 'Последние новости и обновления', category: 'news', date: '15.03.2024' },
    { id: 2, title: 'Блог', content: 'Полезные статьи и материалы', category: 'blog', date: '12.03.2024' },
    { id: 3, title: 'FAQ', content: 'Часто задаваемые вопросы', category: 'faq', date: '10.03.2024' }
  ]);

  // Форма для статьи
  const [articleForm, setArticleForm] = useState({
    title: '',
    content: '',
    category: 'news',
    date: ''
  });

  // ========== НАСТРОЙКИ СИСТЕМЫ ==========
  const [settings, setSettings] = useState({
    currentPassword: '',
    adminPassword: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');
  const [settingsMessage, setSettingsMessage] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [answerText, setAnswerText] = useState({});
  
  // ========== БАН ПОЛЬЗОВАТЕЛЕЙ ==========
  const [banDropdownOpen, setBanDropdownOpen] = useState(null); // userId или null

  // ========== ОБНУЛЕНИЕ КУРСА СТУДЕНТА ==========
  const [resetCourseModalOpen, setResetCourseModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentCourses, setStudentCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  // ========== УПРАВЛЕНИЕ ОТЗЫВАМИ КУРСОВ ==========
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
  const [selectedCourseReviews, setSelectedCourseReviews] = useState([]);
  const [selectedCourseIdForReviews, setSelectedCourseIdForReviews] = useState(null);

  // ========== ИНИЦИАЛИЗАЦИЯ ==========
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Загружаем все данные
        const [coursesData, teachersData, usersData, statsData, paymentsData, requestsData] = await Promise.all([
          api.getCourses(),
          api.getTeachers(),
          api.getAdminUsers(),
          api.getAdminStats(),
          api.getAllPayments(),
          api.getRequests()
        ]);
        
        setCourses(coursesData);
        setTeachers(teachersData);
        setUsers(usersData);
        setTotalIncome(statsData.revenue || 0);
        setPayments(paymentsData);
        setRequests(requestsData);
        
        // Обновляем финансовые данные
        updateFinanceData(paymentsData);
        
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  // Загрузка настроек при переходе в раздел настроек (оставлено для возможного расширения)
  useEffect(() => {
    // Ничего не загружаем, так как оставили только смену пароля
  }, [activeSection]);

  // ========== СОХРАНЕНИЕ ДАННЫХ ==========
  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
  };

  const saveInvoices = (updatedInvoices) => {
    setInvoices(updatedInvoices);
  };

  // ========== НАВИГАЦИЯ ==========
  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setShowCourseForm(false);
    setShowArticleForm(false);
    setShowTeacherForm(false);
    setShowInvoiceForm(false);
  };

  // ========== УПРАВЛЕНИЕ КУРСАМИ ==========
  const handleAddCourse = () => {
    setFormMode('add');
    setCourseForm({
      name: '',
      language: 'Немецкий',
      flagImage: '/media/Флаг Германии.png',
      level: 'Начальный',
      students: 0,
      price: '',
      duration: '',
      modules: 8
    });
    setShowCourseForm(true);
  };

  const handleEditCourse = (course) => {
    setFormMode('edit');
    setCurrentEditId(course._id || course.id);
    
    // Обратное маппинг уровней с английского на русский для формы
    const levelReverseMap = {
      'beginner': 'Начальный',
      'intermediate': 'Средний',
      'advanced': 'Высокий'
    };
    
    // Обратное маппинг языков с английского на русский для формы
    const languageReverseMap = {
      'english': 'Английский',
      'german': 'Немецкий',
      'spanish': 'Испанский',
      'chinese': 'Китайский',
      'french': 'Французский',
      'japanese': 'Японский',
      'korean': 'Корейский',
      'italian': 'Итальянский'
    };
    
    // Преобразуем уровень для формы
    const formLevel = levelReverseMap[course.level] || course.level;
    
    // Преобразуем язык для формы
    const formLanguage = languageReverseMap[course.language] || course.language;
    
    // Убедимся, что есть поле flagImage, иначе установим по умолчанию
    const flagImage = course.flagImage || getFlagByLanguage(formLanguage);
    
    // Для уровня "advanced" устанавливаем цену 15000
    const formPrice = course.level === 'advanced' ? '15000' : (course.price || '');
    
    setCourseForm({
      ...course,
      level: formLevel,
      language: formLanguage,
      price: formPrice,
      flagImage
    });
    setShowCourseForm(true);
  };

  // Функция для получения пути к флагу по языку
  const getFlagByLanguage = (language) => {
    const flagMap = {
      'Немецкий': '/media/Флаг Германии.png',
      'Английский': '/media/флаг  америки.png',
      'Испанский': '/media/флаг испании.png',
      'Китайский': '/media/флаг китая.png',
      'Итальянский': '/media/флаг италии.png',
      'Французский': '/media/флаг франции.png',
      'Японский': '/media/флаг японии.png',
      'Корейский': '/media/флаг южной кореи.png'
    };
    return flagMap[language] || '/media/placeholder.jpeg';
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот курс?')) {
      try {
        await api.deleteCourse(courseId);
        setCourses(courses.filter(c => (c._id || c.id) !== courseId));
        alert('Курс удален');
      } catch (error) {
        alert(`Ошибка: ${error.message}`);
      }
    }
  };

  // ========== УПРАВЛЕНИЕ ОТЗЫВАМИ ==========
  const openReviewsModal = async (courseId) => {
    try {
      // Загружаем курс, чтобы получить отзывы
      const course = await api.getCourse(courseId);
      setSelectedCourseIdForReviews(courseId);
      setSelectedCourseReviews(course.reviews || []);
      setReviewsModalOpen(true);
    } catch (error) {
      alert(`Ошибка загрузки отзывов: ${error.message}`);
    }
  };

  const closeReviewsModal = () => {
    setReviewsModalOpen(false);
    setSelectedCourseReviews([]);
    setSelectedCourseIdForReviews(null);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      return;
    }
    try {
      await api.deleteReview(selectedCourseIdForReviews, reviewId);
      // Обновляем локальный список отзывов
      setSelectedCourseReviews(prev => prev.filter(r => r._id !== reviewId));
      // Также обновляем отзывы в общем списке курсов
      setCourses(prev => prev.map(c => {
        if ((c._id || c.id) === selectedCourseIdForReviews) {
          return {
            ...c,
            reviews: (c.reviews || []).filter(r => r._id !== reviewId)
          };
        }
        return c;
      }));
      alert('Отзыв удален');
    } catch (error) {
      alert(`Ошибка удаления отзыва: ${error.message}`);
    }
  };

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseForm(prev => {
      const updated = { ...prev, [name]: value };
      // Если изменился язык, обновляем флаг
      if (name === 'language') {
        updated.flagImage = getFlagByLanguage(value);
      }
      // Если изменился уровень на "Высокий", устанавливаем цену 15000
      if (name === 'level' && value === 'Высокий') {
        updated.price = '15000';
      }
      return updated;
    });
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    
    // Преобразуем данные для бэкенда
    const prepareCourseData = (data) => {
      // Маппинг уровней с русского на английский
      const levelMap = {
        'Начальный': 'beginner',
        'Средний': 'intermediate',
        'Высокий': 'advanced'
      };
      
      // Очистка цены: удаляем пробелы, "Р", "руб" и преобразуем в число
      const priceStr = String(data.price || '').replace(/\s/g, '').replace(/[^\d]/g, '');
      let price = parseInt(priceStr) || 0;
      
      // Для уровня "Высокий" устанавливаем цену 15000
      if (data.level === 'Высокий' || levelMap[data.level] === 'advanced') {
        price = 15000;
      }
      
      // Дефолтные значения для страницы "О курсе"
      const defaultModulesList = [];
      // Создаем 8 модулей с заглушками
      for (let i = 1; i <= 8; i++) {
        defaultModulesList.push({
          title: `Модуль ${i}`,
          subtitle: `Изучение ${data.language}`,
          description: `В этом модуле вы изучите основы ${data.language} на уровне ${data.level}.`,
          lessons: 5,
          points: 10
        });
      }
      
      return {
        title: data.name,
        language: data.language, // будет преобразовано на бэкенде через languageMap
        flagImage: data.flagImage,
        coverImage: data.flagImage, // дублируем для обложки
        level: levelMap[data.level] || data.level,
        price,
        duration: data.duration,
        modules: parseInt(data.modules) || 8,
        students: parseInt(data.students) || 0,
        afterCourse: ['Сертификат', 'Доступ к материалам', 'Поддержка преподавателя'],
        forWhom: 'Курс подходит для всех, кто хочет изучить язык с нуля или улучшить свои навыки.',
        modulesList: defaultModulesList,
        topStudents: [
          { name: 'Анна Иванова', score: 98 },
          { name: 'Петр Сидоров', score: 95 },
          { name: 'Мария Козлова', score: 93 }
        ],
        reviews: [],
        status: 'active'
      };
    };
    
    const preparedData = prepareCourseData(courseForm);
    
    try {
      if (formMode === 'add') {
        const newCourse = await api.createCourse(preparedData);
        setCourses([...courses, newCourse]);
        alert('Курс успешно добавлен!');
      } else {
        const updatedCourse = await api.updateCourse(currentEditId, preparedData);
        setCourses(courses.map(c => (c._id || c.id) === currentEditId ? updatedCourse : c));
        alert('Курс успешно обновлен!');
      }
      setShowCourseForm(false);
    } catch (error) {
      alert(`Ошибка: ${error.message}`);
    }
  };
  // ========== УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ==========

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }
    try {
      await api.deleteUser(userId);
      // Обновляем локальное состояние
      const updatedUsers = users.filter(u => u._id !== userId && u.id !== userId);
      setUsers(updatedUsers);
      alert('Пользователь успешно удален');
    } catch (error) {
      alert(`Ошибка удаления пользователя: ${error.message}`);
    }
  };

  // Бан пользователя
  const handleBanUser = async (userId, duration) => {
    try {
      await api.banUser(userId, duration);
      // Обновляем локальное состояние
      const updatedUsers = users.map(u => {
        if (u._id === userId || u.id === userId) {
          const updatedUser = { ...u };
          if (duration === null) {
            updatedUser.isBanned = true;
            updatedUser.bannedUntil = null;
          } else {
            updatedUser.bannedUntil = new Date(Date.now() + duration * 60 * 1000);
            updatedUser.isBanned = false;
          }
          return updatedUser;
        }
        return u;
      });
      setUsers(updatedUsers);
      setBanDropdownOpen(null);
      alert(`Пользователь заблокирован${duration ? ` на ${duration} минут` : ' навсегда'}`);
    } catch (error) {
      alert(`Ошибка бана: ${error.message}`);
    }
  };

  // Разбан пользователя
  const handleUnbanUser = async (userId) => {
    try {
      await api.unbanUser(userId);
      // Обновляем локальное состояние
      const updatedUsers = users.map(u => {
        if (u._id === userId || u.id === userId) {
          return { ...u, isBanned: false, bannedUntil: null };
        }
        return u;
      });
      setUsers(updatedUsers);
      alert('Пользователь разблокирован');
    } catch (error) {
      alert(`Ошибка разбана: ${error.message}`);
    }
  };

  // Сброс нарушений пользователя
  const handleResetViolations = async (userId) => {
    try {
      await api.resetViolations(userId);
      // Обновляем локальное состояние
      const updatedUsers = users.map(u => {
        if (u._id === userId || u.id === userId) {
          return { ...u, violationCount: 0, lastViolationDate: null };
        }
        return u;
      });
      setUsers(updatedUsers);
      alert('Нарушения пользователя сброшены');
    } catch (error) {
      alert(`Ошибка сброса нарушений: ${error.message}`);
    }
  };

  // Переключение видимости выпадающего меню бана
  const toggleBanDropdown = (userId) => {
    setBanDropdownOpen(banDropdownOpen === userId ? null : userId);
  };

  // ========== ОБНУЛЕНИЕ КУРСА СТУДЕНТА ==========
  // Открытие модального окна для обнуления курса
  const openResetCourseModal = async (studentId) => {
    try {
      setSelectedStudentId(studentId);
      setSelectedCourseId('');
      // Загружаем курсы студента
      const courses = await api.getStudentCourses(studentId);
      setStudentCourses(courses);
      setResetCourseModalOpen(true);
    } catch (error) {
      alert(`Ошибка загрузки курсов: ${error.message}`);
    }
  };

  // Закрытие модального окна
  const closeResetCourseModal = () => {
    setResetCourseModalOpen(false);
    setSelectedStudentId(null);
    setStudentCourses([]);
    setSelectedCourseId('');
  };

  // Обработчик обнуления курса
  const handleResetCourse = async () => {
    if (!selectedCourseId) {
      alert('Выберите курс для обнуления');
      return;
    }
    if (!selectedStudentId) {
      alert('Студент не выбран');
      return;
    }
    if (!window.confirm('Вы уверены, что хотите обнулить этот курс у студента? Это действие нельзя отменить.')) {
      return;
    }
    try {
      await api.deleteStudentCourse(selectedStudentId, selectedCourseId);
      // Обновляем локальное состояние: удаляем курс из списка курсов студента
      setStudentCourses(studentCourses.filter(c => c.courseId !== selectedCourseId));
      alert('Курс успешно обнулен');
      // Закрываем модальное окно, если у студента больше нет курсов
      if (studentCourses.length <= 1) {
        closeResetCourseModal();
      }
    } catch (error) {
      alert(`Ошибка обнуления курса: ${error.message}`);
    }
  };

  // ========== УПРАВЛЕНИЕ ПРЕПОДАВАТЕЛЯМИ ==========
  const handleDeleteTeacher = async (teacherId) => {
    console.log('Deleting teacher with ID:', teacherId, typeof teacherId);
    // Check for undefined, null, empty string, or the string "undefined"
    if (!teacherId || teacherId === 'undefined' || teacherId === 'null') {
      alert('Ошибка: ID преподавателя не определен');
      return;
    }
    // Also check if it looks like a MongoDB ObjectId (24 hex chars)
    if (!/^[0-9a-fA-F]{24}$/.test(teacherId)) {
      console.warn('Teacher ID does not look like a valid MongoDB ObjectId:', teacherId);
      // We'll still try to delete, but warn in console
    }
    if (window.confirm('Вы уверены, что хотите уволить этого преподавателя?')) {
      try {
        await api.deleteTeacher(teacherId);
        setTeachers(teachers.filter(t => t._id !== teacherId));
        alert('Преподаватель уволен');
      } catch (error) {
        alert(`Ошибка: ${error.message}`);
      }
    }
  };

  // Функция для автоматического форматирования номера телефона в российском формате
  const formatPhoneNumber = (input) => {
    // Удаляем все нецифровые символы
    const digits = input.replace(/\D/g, '');
    
    // Если номер начинается с 7 или 8 (российский код), обрабатываем как российский номер
    let formatted = digits;
    if (digits.startsWith('7') || digits.startsWith('8')) {
      // Берем максимум 11 цифр (код страны + 10 цифр номера)
      const maxDigits = digits.substring(0, 11);
      
      // Форматируем по шаблону +7 (XXX) XXX-XX-XX
      if (maxDigits.length <= 1) {
        formatted = '+7';
      } else if (maxDigits.length <= 4) {
        formatted = `+7 (${maxDigits.substring(1, 4)}`;
      } else if (maxDigits.length <= 7) {
        formatted = `+7 (${maxDigits.substring(1, 4)}) ${maxDigits.substring(4, 7)}`;
      } else if (maxDigits.length <= 9) {
        formatted = `+7 (${maxDigits.substring(1, 4)}) ${maxDigits.substring(4, 7)}-${maxDigits.substring(7, 9)}`;
      } else {
        formatted = `+7 (${maxDigits.substring(1, 4)}) ${maxDigits.substring(4, 7)}-${maxDigits.substring(7, 9)}-${maxDigits.substring(9, 11)}`;
      }
    } else if (digits.length > 0) {
      // Для других форматов просто ограничиваем длину и добавляем +
      formatted = `+${digits.substring(0, 15)}`;
    }
    
    return formatted;
  };

  const handleTeacherChange = (e) => {
    const { name, value } = e.target;
    
    // Автоматическое форматирование номера телефона
    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      setTeacherForm(prev => ({ ...prev, [name]: formattedPhone }));
    } else {
      setTeacherForm(prev => ({ ...prev, [name]: value }));
    }
  };



  // ========== ОБНОВЛЕННАЯ ФУНКЦИЯ ДЛЯ ОТКРЫТИЯ ФОРМЫ ДОБАВЛЕНИЯ ==========
  const handleAddTeacher = () => {
    setFormMode('add');
    setTeacherForm({
      login: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialization: '',
      qualification: 'Высшая категория',
      experience: '',
      status: 'active',
      language: 'english',
      education: ''
    });
    setShowTeacherForm(true);
  };

  // ========== ОБНОВЛЕННАЯ ФУНКЦИЯ ДЛЯ РЕДАКТИРОВАНИЯ ==========
  const handleEditTeacher = (teacher) => {
    setFormMode('edit');
    setCurrentEditId(teacher._id);
    setTeacherForm({
      specialization: teacher.specialization || '',
      qualification: teacher.qualification || 'Высшая категория',
      experience: teacher.experience || '',
      status: teacher.status || 'Активен',
      language: teacher.language || 'english',
      education: teacher.education || '',
      login: '',
      password: '',
      firstName: teacher.firstName || '',
      lastName: teacher.lastName || '',
      email: teacher.email || '',
      phone: teacher.phone || '',
    });
    setShowTeacherForm(true);
  };

  // ========== ОБНОВЛЕННАЯ ФУНКЦИЯ СОХРАНЕНИЯ ==========
  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (formMode === 'add') {
        // Отправляем обычный объект (без файлов и FormData)
        const newTeacher = await api.createTeacher(teacherForm);
        setTeachers([...teachers, newTeacher]);
        alert('Преподаватель успешно добавлен!');
      } else {
        const editableFields = {
          specialization: teacherForm.specialization,
          qualification: teacherForm.qualification,
          experience: teacherForm.experience,
          status: teacherForm.status
        };
        const updatedTeacher = await api.updateTeacher(currentEditId, editableFields);
        setTeachers(teachers.map(t => t.id === currentEditId ? updatedTeacher : t));
        alert('Преподаватель успешно обновлен!');
      }
      setShowTeacherForm(false);
    } catch (error) {
      alert(`Ошибка: ${error.message}`);
    }
  };

  // ========== УПРАВЛЕНИЕ ФИНАНСАМИ ==========
  const handleAddInvoice = () => {
    setFormMode('add');
    setInvoiceForm({ client: '', amount: '', course: '', dueDate: '' });
    setShowInvoiceForm(true);
  };

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoiceForm(prev => ({ ...prev, [name]: value }));
  };

  const handleInvoiceSubmit = (e) => {
    e.preventDefault();
    
    const newInvoice = {
      id: invoices.length + 1,
      number: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      client: invoiceForm.client,
      amount: invoiceForm.amount,
      status: 'Ожидает',
      date: new Date().toLocaleDateString('ru-RU'),
      dueDate: invoiceForm.dueDate,
      course: invoiceForm.course
    };
    
    const updatedInvoices = [...invoices, newInvoice];
    saveInvoices(updatedInvoices);
    setShowInvoiceForm(false);
    alert('Счет успешно выставлен!');
  };

  const handleInvoiceStatusChange = (invoiceId, newStatus) => {
    const updatedInvoices = invoices.map(i => 
      i.id === invoiceId ? { ...i, status: newStatus } : i
    );
    saveInvoices(updatedInvoices);
  };

  // ========== ОТЧЕТЫ ==========
  const generateAttendanceReport = () => {
    const report = attendanceStats.map(stat => 
      `${stat.course}: Посещаемость ${stat.attendance}, Студентов: ${stat.students}, Завершили: ${stat.completed}`
    ).join('\n');
    alert('Отчет по посещаемости:\n' + report);
  };

  const generateTeacherActivityReport = () => {
    const report = teacherActivity.map(act => 
      `${act.teacher}: Часов ${act.hours}, Студентов: ${act.students}, Рейтинг: ${act.rating}`
    ).join('\n');
    alert('Отчет по активности преподавателей:\n' + report);
  };

  const generateTeacherLoadReport = () => {
    const report = teacherLoad.map(load => 
      `${load.teacher}: Загрузка ${load.load}, Групп: ${load.groups}, Индивидуальных: ${load.individuals}`
    ).join('\n');
    alert('Отчет по загруженности преподавателей:\n' + report);
  };

  // ========== УПРАВЛЕНИЕ КОНТЕНТОМ ==========
  const handleAddArticle = () => {
    setFormMode('add');
    setArticleForm({
      title: '', content: '', category: 'news',
      date: new Date().toLocaleDateString('ru-RU')
    });
    setShowArticleForm(true);
  };

  const handleEditArticle = (article) => {
    setFormMode('edit');
    setCurrentEditId(article.id);
    setArticleForm(article);
    setShowArticleForm(true);
  };

  const handleDeleteArticle = (articleId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      const updatedArticles = articles.filter(a => a.id !== articleId);
      setArticles(updatedArticles);
    }
  };

  const handleArticleChange = (e) => {
    const { name, value } = e.target;
    setArticleForm(prev => ({ ...prev, [name]: value }));
  };

  const handleArticleSubmit = (e) => {
    e.preventDefault();
    
    let updatedArticles;
    
    if (formMode === 'add') {
      const newArticle = { ...articleForm, id: articles.length + 1 };
      updatedArticles = [...articles, newArticle];
    } else {
      updatedArticles = articles.map(a => a.id === currentEditId ? { ...a, ...articleForm } : a);
    }
    
    setArticles(updatedArticles);
    setShowArticleForm(false);
    alert(`Статья успешно ${formMode === 'add' ? 'добавлена' : 'обновлена'}!`);
  };

  // ========== НАСТРОЙКИ ==========
  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
    if (name === 'adminPassword' || name === 'confirmPassword') setPasswordError('');
  };

  const handleSaveSettings = async () => {
    // Сброс сообщений
    setPasswordError('');
    setSettingsMessage('');
    setSettingsError('');

    // Если не указан новый пароль, то ничего не делаем
    if (!settings.adminPassword && !settings.currentPassword && !settings.confirmPassword) {
      setSettingsMessage('Нет изменений для сохранения');
      return;
    }

    // Валидация паролей
    if (settings.adminPassword && settings.adminPassword !== settings.confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }

    // Проверка: если указан новый пароль, то текущий пароль обязателен
    if (settings.adminPassword && !settings.currentPassword) {
      setPasswordError('Для смены пароля необходимо указать текущий пароль');
      return;
    }

    // Если указан текущий пароль, но новый пароль не указан, то это ошибка
    if (settings.currentPassword && !settings.adminPassword) {
      setPasswordError('Укажите новый пароль');
      return;
    }

    setLoadingSettings(true);

    try {
      const token = localStorage.getItem('token');
      
      // Отправляем запрос на смену пароля (используем абсолютный URL с портом 5001)
      const passwordRes = await fetch('http://localhost:5001/api/settings/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: settings.currentPassword,
          newPassword: settings.adminPassword,
          confirmPassword: settings.confirmPassword
        })
      });

      if (!passwordRes.ok) {
        const errorData = await passwordRes.json();
        throw new Error(errorData.error || 'Ошибка при смене пароля');
      }

      // Успех
      setSettingsMessage('Пароль успешно изменён!');
      // Сброс полей паролей
      setSettings(prev => ({
        ...prev,
        currentPassword: '',
        adminPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setSettingsError(err.message);
    } finally {
      setLoadingSettings(false);
    }
  };

  // ========== УПРАВЛЕНИЕ ПЛАТЕЖАМИ ==========
  const loadPayments = async () => {
    setLoadingPayments(true);
    try {
      const data = await api.getAllPayments();
      setPayments(data);
    } catch (error) {
      console.error('Ошибка загрузки платежей:', error);
      alert('Не удалось загрузить платежи');
    } finally {
      setLoadingPayments(false);
    }
  };

  // Обновление финансовых данных на основе платежей
  const updateFinanceData = (payments) => {
    if (!payments || payments.length === 0) {
      setInvoices([]);
      setTransactions([]);
      setTotalIncome(0);
      setTotalExpenses(0);
      return;
    }

    // Преобразуем платежи в счета
    const invoiceList = payments.map((payment, index) => {
      const statusMap = {
        'completed': 'Оплачен',
        'pending': 'Ожидает',
        'failed': 'Просрочен',
        'refunded': 'Возврат'
      };
      return {
        id: payment._id || index + 1,
        number: `INV-${new Date(payment.paymentDate || payment.createdAt).getFullYear()}-${String(index + 1).padStart(3, '0')}`,
        client: payment.userId ? `${payment.userId.firstName || ''} ${payment.userId.lastName || ''}`.trim() || payment.userId.email : 'Неизвестный клиент',
        amount: `${payment.amount} Р`,
        status: statusMap[payment.status] || payment.status,
        date: new Date(payment.paymentDate || payment.createdAt).toLocaleDateString('ru-RU'),
        dueDate: new Date(payment.paymentDate || payment.createdAt).toLocaleDateString('ru-RU')
      };
    });

    // Преобразуем платежи в транзакции
    const transactionList = payments.map((payment, index) => ({
      id: payment._id || index + 1,
      date: new Date(payment.paymentDate || payment.createdAt).toLocaleDateString('ru-RU'),
      description: `Оплата курса - ${payment.courseId?.title || payment.courseId || 'Неизвестный курс'}`,
      amount: `+${payment.amount} Р`,
      type: 'income'
    }));

    // Добавим статические расходы (можно потом заменить на API)
    const expenseTransactions = [
      { id: 'exp1', date: '13.03.2024', description: 'Выплата преподавателю - Джон Ричардс', amount: '-25 000 Р', type: 'expense' }
    ];

    const allTransactions = [...transactionList, ...expenseTransactions];

    // Вычисляем доходы (сумма завершенных платежей)
    const income = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (parseInt(p.amount) || 0), 0);

    // Расходы (пока статические)
    const expenses = 125000;

    setInvoices(invoiceList);
    setTransactions(allTransactions);
    setTotalIncome(income);
    setTotalExpenses(expenses);
  };

  const handlePaymentStatusChange = async (paymentId, newStatus) => {
    try {
      await api.updatePaymentStatus(paymentId, newStatus);
      setPayments(payments.map(p => p._id === paymentId ? { ...p, status: newStatus } : p));
      alert('Статус платежа обновлен');
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
      alert('Не удалось обновить статус платежа');
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот платеж?')) return;
    try {
      await api.deletePayment(paymentId);
      setPayments(payments.filter(p => p._id !== paymentId));
      alert('Платеж удален');
    } catch (error) {
      console.error('Ошибка удаления платежа:', error);
      alert('Не удалось удалить платеж');
    }
  };

  // ========== УПРАВЛЕНИЕ ЗАЯВКАМИ ==========
  const loadRequests = async () => {
    setLoadingRequests(true);
    try {
      const data = await api.getRequests();
      setRequests(data);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
      alert('Не удалось загрузить заявки');
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleAnswerRequest = async (id, answer) => {
    if (!answer.trim()) {
      alert('Введите ответ');
      return;
    }
    try {
      await api.answerRequest(id, answer);
      alert('Ответ отправлен');
      loadRequests(); // обновить список
      setAnswerText(prev => ({...prev, [id]: ''}));
    } catch (error) {
      console.error('Ошибка отправки ответа:', error);
      alert('Ошибка: ' + error.message);
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту заявку?')) return;
    try {
      await api.deleteRequest(id);
      setRequests(requests.filter(req => req._id !== id));
      alert('Заявка удалена');
    } catch (error) {
      console.error('Ошибка удаления заявки:', error);
      alert('Не удалось удалить заявку');
    }
  };

  // Загружаем платежи при переходе в раздел
  useEffect(() => {
    if (activeSection === 'payments' || activeSection === 'finance') {
      loadPayments();
    }
  }, [activeSection]);

  // Обновляем финансовые данные при изменении платежей
  useEffect(() => {
    if (payments.length > 0) {
      updateFinanceData(payments);
    }
  }, [payments]);

 if (loading) {
   return <div className="admin-loading">Загрузка...</div>;
 }

 return (
   <>
     <header className="admin-header">
        <div className="admin-container">
          <div className="admin-logo">
            <span className="logo-lingua">Lingua</span><span className="logo-lab">Lab</span> Admin
          </div>
          <div className="admin-user">
            <span>Администратор</span>
            <button onClick={handleLogout} className="admin-logout-btn">Выйти</button>
          </div>
        </div>
      </header>

      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <ul>
              <li><a href="#dashboard" className={activeSection === 'dashboard' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleSectionChange('dashboard'); }}>Главная</a></li>
              <li><a href="#users" className={activeSection === 'users' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleSectionChange('users'); }}>Пользователи</a></li>
              <li><a href="#teachers" className={activeSection === 'teachers' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleSectionChange('teachers'); }}>Преподаватели</a></li>
              <li><a href="#courses" className={activeSection === 'courses' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleSectionChange('courses'); }}>Курсы</a></li>
              {/* <li><a href="#content" className={activeSection === 'content' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleSectionChange('content'); }}>Контент</a></li> */}
              {/* <li><a href="#finance" className={activeSection === 'finance' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleSectionChange('finance'); }}>Финансы</a></li> */}
              <li><a href="#payments" className={activeSection === 'payments' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleSectionChange('payments'); }}>Платежи</a></li>
              <li><a href="#requests" className={activeSection === 'requests' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleSectionChange('requests'); }}>Заявки</a></li>
              {/* <li><a href="#reports" className={activeSection === 'reports' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleSectionChange('reports'); }}>Отчеты</a></li> */}
              <li><a href="#settings" className={activeSection === 'settings' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleSectionChange('settings'); }}>Настройки</a></li>
            </ul>
          </nav>
        </aside>

        <main className="admin-main">
          {/* ГЛАВНАЯ */}
          {activeSection === 'dashboard' && (
            <section className="admin-section active">
              <h1>Главная панель управления</h1>
              <div className="admin-stats">
                <div className="admin-stat-card">
                  <h3>Пользователи</h3>
                  <p>{users.length}</p>
                </div>
                <div className="admin-stat-card">
                  <h3>Преподаватели</h3>
                  <p>{teachers.length}</p>
                </div>
                <div className="admin-stat-card">
                  <h3>Курсы</h3>
                  <p>{courses.length}</p>
                </div>
                <div className="admin-stat-card">
                  <h3>Доход</h3>
                  <p>{totalIncome.toLocaleString()} Р</p>
                </div>
              </div>
            </section>
          )}

          {/* ПОЛЬЗОВАТЕЛИ */}
          {activeSection === 'users' && (
            <section className="admin-section active">
              <h1>Управление пользователями</h1>
              <div className="admin-actions">
                {/* Кнопка добавления убрана - админ не должен добавлять пользователей */}
              </div>
              

              <div className="admin-table-container">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Логин</th>
                      <th>Email</th>
                      <th>Телефон</th>
                      <th>Роль</th>
                      <th>Статус</th>
                      <th>Дата регистрации</th>
                      <th>Нарушений</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id || user.id}>
                        <td>{user._id?.substring(0, 8)}...</td>
                        <td>{user.login || user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.role === 'student' ? 'Студент' : user.role === 'teacher' ? 'Преподаватель' : user.role === 'admin' ? 'Админ' : user.role}</td>
                        <td>
                          {(() => {
                            const isBanned = user.isBanned || (user.bannedUntil && new Date(user.bannedUntil) > new Date());
                            const isActive = user.status === 'active' || user.status === 'Активен';
                            if (isBanned) {
                              const until = user.bannedUntil ? new Date(user.bannedUntil).toLocaleString('ru-RU') : 'навсегда';
                              return (
                                <span style={{ color: 'red', fontWeight: 'bold' }}>
                                  Забанен {until !== 'навсегда' ? `до ${until}` : ''}
                                </span>
                              );
                            } else {
                              return (
                                <span style={{ color: isActive ? 'green' : 'red' }}>
                                  {isActive ? 'Активен' : 'Заблокирован'}
                                </span>
                              );
                            }
                          })()}
                        </td>
                        <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : user.date}</td>
                        <td>
                          <span style={{
                            color: user.violationCount > 0 ? 'orange' : 'green',
                            fontWeight: user.violationCount > 0 ? 'bold' : 'normal'
                          }}>
                            {user.violationCount || 0}
                          </span>
                          {user.lastViolationDate && (
                            <div style={{ fontSize: '0.8em', color: '#666' }}>
                              {new Date(user.lastViolationDate).toLocaleDateString('ru-RU')}
                            </div>
                          )}
                        </td>
                        <td>
                          <button className="admin-btn admin-icon-btn admin-btn-danger" onClick={() => handleDeleteUser(user._id || user.id)} title="Удалить">
                            <img src="/media/delete.png" alt="Удалить" width="24" height="24" />
                          </button>
                          {(() => {
                            const userId = user._id || user.id;
                            const isBanned = user.isBanned || (user.bannedUntil && new Date(user.bannedUntil) > new Date());
                            if (!isBanned) {
                              return (
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                  <button className="admin-btn admin-icon-btn admin-btn-warning" onClick={() => toggleBanDropdown(userId)} title="Забанить">
                                    <img src="/media/ban.png" alt="Забанить" width="24" height="24" />
                                  </button>
                                  {banDropdownOpen === userId && (
                                    <div className="status-dropdown">
                                      <div className="dropdown-item" onClick={() => handleBanUser(userId, 5)}>5 мин</div>
                                      <div className="dropdown-item" onClick={() => handleBanUser(userId, 15)}>15 мин</div>
                                      <div className="dropdown-item" onClick={() => handleBanUser(userId, 30)}>30 мин</div>
                                      <div className="dropdown-item" onClick={() => handleBanUser(userId, 60)}>1 час</div>
                                      <div className="dropdown-item" onClick={() => handleBanUser(userId, 1440)}>1 день</div>
                                      <div className="dropdown-item" onClick={() => handleBanUser(userId, null)}>Навсегда</div>
                                    </div>
                                  )}
                                </div>
                              );
                            } else {
                              return (
                                <button className="admin-btn admin-icon-btn admin-btn-success" onClick={() => handleUnbanUser(userId)} title="Разбанить">
                                  <img src="/media/вернуться.png" alt="Разбанить" width="24" height="24" />
                                </button>
                              );
                            }
                          })()}
                          {user.role === 'student' && (
                            <button className="admin-btn admin-icon-btn" onClick={() => openResetCourseModal(user._id || user.id)} title="Обнулить курс">
                              <img src="/media/reset-course.png" alt="Обнулить курс" width="24" height="24" />
                            </button>
                          )}
                          {(user.violationCount || 0) > 0 && (
                            <button className="admin-btn admin-icon-btn" onClick={() => handleResetViolations(user._id || user.id)} title="Сбросить нарушения">
                              <img src="/media/reset-violations.png" alt="Сбросить нарушения" width="24" height="24" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </section>
          )}

          {/* ПРЕПОДАВАТЕЛИ */}
          {activeSection === 'teachers' && (
            <section className="admin-section active">
              <h1>Управление преподавателями</h1>
              <div className="admin-actions">
                <button className="admin-btn" onClick={handleAddTeacher}>➕ Добавить преподавателя</button>
              </div>
              
              {showTeacherForm && (
                <div className="teacher-form-modal">
                  <h2>{formMode === 'add' ? 'Добавить преподавателя' : 'Редактировать преподавателя'}</h2>
                  <form onSubmit={handleTeacherSubmit} className="teacher-form-grid">
                    {/* Поля для создания пользователя (только при добавлении) */}
                    {formMode === 'add' && (
                      <>
                        <div className="form-group">
                          <label>Логин *</label>
                          <div className="input-with-icon">
                            <input type="text" name="login" value={teacherForm.login} onChange={handleTeacherChange} required placeholder="Введите логин" />
                            <img src="/media/логин.png" alt="логин" className="icon" />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Временный пароль *</label>
                          <div className="input-with-icon">
                            <input type="password" name="password" value={teacherForm.password} onChange={handleTeacherChange} required placeholder="Введите временный пароль" />
                            <img src="/media/пароль.png" alt="пароль" className="icon" />
                          </div>
                        </div>
                        <div className="form-group double">
                          <div className="form-group">
                            <label>Имя *</label>
                            <input type="text" name="firstName" value={teacherForm.firstName} onChange={handleTeacherChange} required placeholder="Имя" />
                          </div>
                          <div className="form-group">
                            <label>Фамилия *</label>
                            <input type="text" name="lastName" value={teacherForm.lastName} onChange={handleTeacherChange} required placeholder="Фамилия" />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Email *</label>
                          <div className="input-with-icon">
                            <input type="email" name="email" value={teacherForm.email} onChange={handleTeacherChange} required placeholder="example@mail.com" />
                            <img src="/media/почта.png" alt="email" className="icon" />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Телефон</label>
                          <div className="input-with-icon">
                            <input type="text" name="phone" value={teacherForm.phone} onChange={handleTeacherChange} placeholder="+7 (999) 123-45-67" />
                            <img src="/media/телефон.png" alt="телефон" className="icon" />
                          </div>
                        </div>
                      </>
                    )}


                    <div className="form-group full-width">
                      <label>Специализация *</label>
                      <input type="text" name="specialization" value={teacherForm.specialization} onChange={handleTeacherChange} required placeholder="Например, Английский язык, бизнес-английский" />
                    </div>

                    <div className="form-group double">
                      <div className="form-group">
                        <label>Квалификация *</label>
                        <select name="qualification" value={teacherForm.qualification} onChange={handleTeacherChange}>
                          <option value="Высшая категория">Высшая категория</option>
                          <option value="Первая категория">Первая категория</option>
                          <option value="Вторая категория">Вторая категория</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Опыт (лет)</label>
                        <input type="number" name="experience" value={teacherForm.experience} onChange={handleTeacherChange} placeholder="0" min="0" />
                      </div>
                    </div>

                    <div className="form-group double">
                      <div className="form-group">
                        <label>Язык преподавания *</label>
                        <select name="language" value={teacherForm.language} onChange={handleTeacherChange}>
                          <option value="english">Английский</option>
                          <option value="german">Немецкий</option>
                          <option value="spanish">Испанский</option>
                          <option value="chinese">Китайский</option>
                          <option value="french">Французский</option>
                          <option value="japanese">Японский</option>
                          <option value="korean">Корейский</option>
                          <option value="italian">Итальянский</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Статус *</label>
                        <select name="status" value={teacherForm.status} onChange={handleTeacherChange}>
                          <option value="active">Активен</option>
                          <option value="blocked">Заблокирован</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Образование</label>
                      <textarea name="education" value={teacherForm.education} onChange={handleTeacherChange} placeholder="Дипломы, курсы, сертификаты (можно оставить пустым)" rows="3" />
                    </div>

                    <div className="form-actions full-width">
                      <button type="submit" className="admin-btn admin-btn-primary">Сохранить</button>
                      <button type="button" onClick={() => setShowTeacherForm(false)} className="admin-btn admin-btn-outline">Отмена</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Имя</th>
                      <th>Специализация</th>
                      <th>Квалификация</th>
                      <th>Опыт</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher, index) => {
                      // Get teacher ID with fallback
                      const teacherId = teacher._id || `teacher-${index}`;
                      // Get teacher name from userId or teacher object
                      const teacherName = teacher.userId?.firstName && teacher.userId?.lastName
                        ? `${teacher.userId.firstName} ${teacher.userId.lastName}`
                        : teacher.name || teacher.fullName || `Преподаватель ${index + 1}`;
                      // Get avatar from userId or teacher object
                      const teacherAvatar = teacher.userId?.avatar || teacher.avatar;
                      
                      return (
                        <tr key={teacherId}>
                          <td>{teacher._id ? teacher._id.substring(0, 8) + '...' : 'N/A'}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {teacherAvatar && (
                                <img
                                  src={teacherAvatar}
                                  alt={teacherName}
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid #ddd'
                                  }}
                                />
                              )}
                              {teacherName}
                            </div>
                          </td>
                          <td>{teacher.specialization}</td>
                          <td>{teacher.qualification}</td>
                          <td>{teacher.experience}</td>
                          <td>
                            <span style={{ color: teacher.status === 'Активен' ? 'green' : 'red' }}>
                              {teacher.status}
                            </span>
                          </td>
                          <td>
                            <button className="admin-btn admin-btn-small" onClick={() => handleEditTeacher(teacher)}>
                              <img src="/media/edit.png" alt="редактировать" className="table-icon" />
                            </button>
                            <button className="admin-btn admin-btn-small admin-btn-danger" onClick={() => handleDeleteTeacher(teacher._id)}>
                              <img src="/media/delete.png" alt="удалить" className="table-icon" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* КУРСЫ */}
          {activeSection === 'courses' && (
            <section className="admin-section active">
              <h1>Управление курсами</h1>
              <div className="admin-actions">
                <button className="admin-btn" onClick={handleAddCourse}>➕ Добавить курс</button>
              </div>
              
              {showCourseForm && (
                <div className="teacher-form-modal">
                  <h2>{formMode === 'add' ? 'Добавить курс' : 'Редактировать курс'}</h2>
                  <form onSubmit={handleCourseSubmit} className="teacher-form-grid">
                    <div className="form-group full-width">
                      <label>Название курса *</label>
                      <div className="input-with-icon">
                        <input type="text" name="name" value={courseForm.name} onChange={handleCourseChange} required placeholder="Например, Английский для начинающих" />
                        <img src="/media/курс.png" alt="название" className="icon" />
                      </div>
                    </div>

                    <div className="form-group double">
                      <div className="form-group">
                        <label>Язык *</label>
                        <div className="input-with-icon">
                          <select name="language" value={courseForm.language} onChange={handleCourseChange}>
                            <option value="Немецкий">Немецкий</option>
                            <option value="Английский">Английский</option>
                            <option value="Испанский">Испанский</option>
                            <option value="Китайский">Китайский</option>
                            <option value="Итальянский">Итальянский</option>
                            <option value="Французский">Французский</option>
                            <option value="Японский">Японский</option>
                            <option value="Корейский">Корейский</option>
                          </select>
                          <img src="/media/язык.png" alt="язык" className="icon" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Уровень *</label>
                        <div className="input-with-icon">
                          <select name="level" value={courseForm.level} onChange={handleCourseChange}>
                            <option value="Начальный">Начальный</option>
                            <option value="Средний">Средний</option>
                            <option value="Высокий">Высокий</option>
                          </select>
                          <img src="/media/уровень.png" alt="уровень" className="icon" />
                        </div>
                      </div>
                    </div>

                    <div className="form-group double">
                      <div className="form-group">
                        <label>Длительность *</label>
                        <div className="input-with-icon">
                          <input type="text" name="duration" value={courseForm.duration} onChange={handleCourseChange} placeholder="45 часов" required />
                          <img src="/media/длительность.png" alt="длительность" className="icon" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Цена *</label>
                        <div className="input-with-icon">
                          <input type="text" name="price" value={courseForm.price} onChange={handleCourseChange} placeholder="6 520 Р" required />
                          <img src="/media/цена.png" alt="цена" className="icon" />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Количество модулей *</label>
                      <div className="input-with-icon">
                        <input type="number" name="modules" value={courseForm.modules} onChange={handleCourseChange} min="1" max="20" required />
                        <img src="/media/модуль.png" alt="модули" className="icon" />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Флаг языка (автоматически)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={courseForm.flagImage} alt="флаг" style={{ width: '40px', height: 'auto' }} />
                        <span>Флаг будет выбран автоматически в зависимости от языка</span>
                      </div>
                    </div>

                    <div className="form-actions full-width">
                      <button type="submit" className="admin-btn admin-btn-primary">Сохранить курс</button>
                      <button type="button" onClick={() => setShowCourseForm(false)} className="admin-btn admin-btn-outline">Отмена</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Название</th>
                      <th>Язык</th>
                      <th>Уровень</th>
                      <th>Студенты</th>
                      <th>Цена</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course, index) => {
                      const courseId = course._id || course.id || `course-${index}`;
                      return (
                        <tr key={courseId}>
                          <td>{courseId ? (courseId.length > 8 ? courseId.substring(0, 8) + '...' : courseId) : 'N/A'}</td>
                          <td>{course.name}</td>
                          <td>{course.language}</td>
                          <td>{course.level}</td>
                          <td>{course.students}</td>
                          <td>{course.price}</td>
                          <td>
                            <button className="admin-btn admin-btn-small" onClick={() => handleEditCourse(course)}>
                              <img src="/media/edit.png" alt="редактировать" className="table-icon" />
                            </button>
                            <button className="admin-btn admin-btn-small admin-btn-danger" onClick={() => handleDeleteCourse(courseId)}>
                              <img src="/media/delete.png" alt="удалить" className="table-icon" />
                            </button>
                            <button className="admin-btn admin-btn-small admin-btn-info" onClick={() => openReviewsModal(courseId)}>
                              <img src="/media/отзыв.png" alt="отзывы" className="table-icon" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* КОНТЕНТ */}
          {/* {activeSection === 'content' && (
            <section className="admin-section active">
              <h1>Управление контентом</h1>
              <div className="admin-actions">
                <button className="admin-btn" onClick={handleAddArticle}>➕ Добавить статью</button>
              </div>
              
              {showArticleForm && (
                <div className="admin-article-form">
                  <h2>{formMode === 'add' ? 'Добавить статью' : 'Редактировать статью'}</h2>
                  <form onSubmit={handleArticleSubmit}>
                    <div className="admin-form-group">
                      <label>Заголовок</label>
                      <input type="text" name="title" value={articleForm.title} onChange={handleArticleChange} required />
                    </div>
                    <div className="admin-form-group">
                      <label>Содержание</label>
                      <textarea name="content" value={articleForm.content} onChange={handleArticleChange} rows="5" required />
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group" style={{ flex: 1 }}>
                        <label>Категория</label>
                        <select name="category" value={articleForm.category} onChange={handleArticleChange}>
                          <option value="news">Новости</option>
                          <option value="blog">Блог</option>
                          <option value="faq">FAQ</option>
                        </select>
                      </div>
                      <div className="admin-form-group" style={{ flex: 1 }}>
                        <label>Дата</label>
                        <input type="text" name="date" value={articleForm.date} onChange={handleArticleChange} required />
                      </div>
                    </div>
                    <div className="admin-form-actions">
                      <button type="submit" className="admin-btn admin-btn-primary">Сохранить</button>
                      <button type="button" onClick={() => setShowArticleForm(false)} className="admin-btn">Отмена</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="admin-content-list">
                {articles.map(article => (
                  <div key={article.id} className="admin-content-item">
                    <h3>{article.title}</h3>
                    <p style={{ color: '#888' }}>{article.date}</p>
                    <p>{article.content.substring(0, 100)}...</p>
                    <div className="admin-content-actions">
                      <button className="admin-btn admin-btn-small" onClick={() => handleEditArticle(article)}>✏️</button>
                      <button className="admin-btn admin-btn-small admin-btn-danger" onClick={() => handleDeleteArticle(article.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )} */}

          {/* ФИНАНСЫ */}
          {/* {activeSection === 'finance' && (
            <section className="admin-section active">
              <h1>Финансовый мониторинг</h1>
              
              <div className="admin-stats">
                <div className="admin-stat-card">
                  <h3>Доходы</h3>
                  <p>{totalIncome.toLocaleString()} Р</p>
                </div>
                <div className="admin-stat-card">
                  <h3>Расходы</h3>
                  <p>{totalExpenses.toLocaleString()} Р</p>
                </div>
                <div className="admin-stat-card">
                  <h3>Прибыль</h3>
                  <p>{(totalIncome - totalExpenses).toLocaleString()} Р</p>
                </div>
              </div>

              <div className="admin-actions">
                <button className="admin-btn" onClick={handleAddInvoice}>💰 Выставить счет</button>
              </div>

              {showInvoiceForm && (
                <div className="admin-article-form">
                  <h2>Выставить новый счет</h2>
                  <form onSubmit={handleInvoiceSubmit}>
                    <div className="admin-form-group">
                      <label>Клиент</label>
                      <input type="text" name="client" value={invoiceForm.client} onChange={handleInvoiceChange} required />
                    </div>
                    <div className="admin-form-group">
                      <label>Сумма</label>
                      <input type="text" name="amount" value={invoiceForm.amount} onChange={handleInvoiceChange} placeholder="6 520 Р" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Курс</label>
                      <input type="text" name="course" value={invoiceForm.course} onChange={handleInvoiceChange} required />
                    </div>
                    <div className="admin-form-group">
                      <label>Срок оплаты</label>
                      <input type="text" name="dueDate" value={invoiceForm.dueDate} onChange={handleInvoiceChange} placeholder="01.04.2024" required />
                    </div>
                    <div className="admin-form-actions">
                      <button type="submit" className="admin-btn admin-btn-primary">Выставить счет</button>
                      <button type="button" onClick={() => setShowInvoiceForm(false)} className="admin-btn">Отмена</button>
                    </div>
                  </form>
                </div>
              )}

              <h2>Счета</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>№</th>
                      <th>Клиент</th>
                      <th>Сумма</th>
                      <th>Статус</th>
                      <th>Дата</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map(invoice => (
                      <tr key={invoice.id}>
                        <td>{invoice.number}</td>
                        <td>{invoice.client}</td>
                        <td>{invoice.amount}</td>
                        <td>
                          <select
                            value={invoice.status}
                            onChange={(e) => handleInvoiceStatusChange(invoice.id, e.target.value)}
                            style={{
                              padding: '0.25rem',
                              borderRadius: '4px',
                              border: '1px solid #ddd'
                            }}
                          >
                            <option value="Оплачен">Оплачен</option>
                            <option value="Ожидает">Ожидает</option>
                            <option value="Просрочен">Просрочен</option>
                          </select>
                        </td>
                        <td>{invoice.date}</td>
                        <td>
                          <button className="admin-btn admin-btn-small admin-btn-danger">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 style={{ marginTop: '2rem' }}>Последние транзакции</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Описание</th>
                      <th>Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t.id}>
                        <td>{t.date}</td>
                        <td>{t.description}</td>
                        <td style={{ color: t.type === 'income' ? 'green' : 'red' }}>
                          {t.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )} */}

          {/* ПЛАТЕЖИ */}
          {activeSection === 'payments' && (
            <section className="admin-section active">
              <h1>Управление платежами</h1>
              <div className="admin-actions">
                <button className="admin-btn" onClick={loadPayments}><img src="/media/reset-violations.png" alt="обновить" className="table-icon" /> Обновить</button>
              </div>
              
              {loadingPayments ? (
                <div className="admin-loading">Загрузка платежей...</div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Студент</th>
                        <th>Курс</th>
                        <th>Сумма</th>
                        <th>Метод</th>
                        <th>Статус</th>
                        <th>Дата</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                            Нет платежей
                          </td>
                        </tr>
                      ) : (
                        payments.map(payment => (
                          <tr key={payment._id}>
                            <td>{payment._id?.substring(0, 8)}...</td>
                            <td>
                              {payment.userId?.firstName} {payment.userId?.lastName}
                              <br />
                              <small>{payment.userId?.email}</small>
                            </td>
                            <td>{payment.courseId?.title || payment.courseId}</td>
                            <td>{payment.amount} Р</td>
                            <td>{payment.paymentMethod}</td>
                            <td>
                              <select
                                value={payment.status}
                                onChange={(e) => handlePaymentStatusChange(payment._id, e.target.value)}
                                style={{
                                  padding: '0.25rem',
                                  borderRadius: '4px',
                                  border: '1px solid #ddd'
                                }}
                              >
                                <option value="pending">Ожидает</option>
                                <option value="completed">Завершен</option>
                                <option value="failed">Ошибка</option>
                                <option value="refunded">Возврат</option>
                              </select>
                            </td>
                            <td>{new Date(payment.paymentDate || payment.createdAt).toLocaleDateString('ru-RU')}</td>
                            <td>
                              <button
                                className="admin-btn admin-btn-small admin-btn-danger"
                                onClick={() => handleDeletePayment(payment._id)}
                              >
                                <img src="/media/delete.png" alt="удалить" className="table-icon" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* ЗАЯВКИ */}
          {activeSection === 'requests' && (
            <section className="admin-section active">
              <h1>Управление заявками</h1>
              <div className="admin-actions">
                <button className="admin-btn" onClick={loadRequests}><img src="/media/reset-violations.png" alt="обновить" className="table-icon" /> Обновить</button>
              </div>
              
              {loadingRequests ? (
                <div className="admin-loading">Загрузка заявок...</div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Телефон</th>
                        <th>Вопрос</th>
                        <th>Сообщение</th>
                        <th>Статус</th>
                        <th>Ответ</th>
                        <th>Дата</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.length === 0 ? (
                        <tr>
                          <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                            Нет заявок
                          </td>
                        </tr>
                      ) : (
                        requests.map(request => (
                          <tr key={request._id}>
                            <td>{request._id?.substring(0, 8)}...</td>
                            <td>{request.name}</td>
                            <td>{request.phone}</td>
                            <td>{request.question}</td>
                            <td>{request.message}</td>
                            <td>
                              <span className={`admin-status ${request.status === 'answered' ? 'admin-status-success' : 'admin-status-warning'}`}>
                                {request.status === 'answered' ? 'Отвечено' : 'Новое'}
                              </span>
                            </td>
                            <td>
                              {request.status === 'pending' && (
                                <div className="admin-answer-form">
                                  <textarea
                                    placeholder="Введите ответ..."
                                    value={answerText[request._id] || ''}
                                    onChange={(e) => setAnswerText({...answerText, [request._id]: e.target.value})}
                                    rows="2"
                                    style={{ width: '200px', padding: '0.25rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                  />
                                  <button
                                    onClick={() => handleAnswerRequest(request._id, answerText[request._id])}
                                    className="admin-btn admin-btn-small admin-btn-primary"
                                  >
                                    Отправить ответ
                                  </button>
                                </div>
                              )}
                              {request.status === 'answered' && request.answer && (
                                <div className="admin-answer-display">
                                  <strong>Ответ:</strong> {request.answer}
                                  <div className="admin-answer-date">Отвечено: {new Date(request.answeredAt).toLocaleDateString('ru-RU')}</div>
                                </div>
                              )}
                            </td>
                            <td>{new Date(request.createdAt).toLocaleDateString('ru-RU')}</td>
                            <td>
                              <button
                                className="admin-btn admin-btn-small admin-btn-danger"
                                onClick={() => deleteRequest(request._id)}
                              >
                                <img src="/media/delete.png" alt="удалить" className="table-icon" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* ОТЧЕТЫ */}
          {/* {activeSection === 'reports' && (
            <section className="admin-section active">
              <h1>Отчеты и статистика</h1>

              <div className="admin-actions">
                <button className="admin-btn" onClick={generateAttendanceReport}>📊 Отчет по посещаемости</button>
                <button className="admin-btn" onClick={generateTeacherActivityReport}>👨‍🏫 Отчет по активности преподавателей</button>
                <button className="admin-btn" onClick={generateTeacherLoadReport}>📈 Отчет по загруженности</button>
              </div>

              <h2>Посещаемость курсов</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Курс</th>
                      <th>Посещаемость</th>
                      <th>Студентов</th>
                      <th>Завершили</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceStats.map((stat, index) => (
                      <tr key={index}>
                        <td>{stat.course}</td>
                        <td>{stat.attendance}</td>
                        <td>{stat.students}</td>
                        <td>{stat.completed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 style={{ marginTop: '2rem' }}>Активность преподавателей</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Преподаватель</th>
                      <th>Часов</th>
                      <th>Студентов</th>
                      <th>Рейтинг</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherActivity.map((ta, index) => (
                      <tr key={index}>
                        <td>{ta.teacher}</td>
                        <td>{ta.hours}</td>
                        <td>{ta.students}</td>
                        <td>{ta.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 style={{ marginTop: '2rem' }}>Загруженность преподавателей</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Преподаватель</th>
                      <th>Загрузка</th>
                      <th>Групп</th>
                      <th>Индивидуальных</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherLoad.map((load, index) => (
                      <tr key={index}>
                        <td>{load.teacher}</td>
                        <td>{load.load}</td>
                        <td>{load.groups}</td>
                        <td>{load.individuals}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )} */}

          {/* НАСТРОЙКИ */}
          {activeSection === 'settings' && (
            <section className="admin-section active">
              <h1>Настройки системы</h1>
              
              <div className="admin-settings">
                <div className="admin-setting-group">
                  <h3>Смена пароля администратора</h3>
                  <div className="admin-setting-item">
                    <label>Текущий пароль</label>
                    <input type="password" name="currentPassword" value={settings.currentPassword} onChange={handleSettingChange} placeholder="Введите текущий пароль" />
                  </div>
                  <div className="admin-setting-item">
                    <label>Новый пароль</label>
                    <input type="password" name="adminPassword" value={settings.adminPassword} onChange={handleSettingChange} placeholder="Введите новый пароль" />
                  </div>
                  <div className="admin-setting-item">
                    <label>Подтверждение пароля</label>
                    <input type="password" name="confirmPassword" value={settings.confirmPassword} onChange={handleSettingChange} placeholder="Повторите новый пароль" />
                  </div>
                  {passwordError && <div style={{ color: '#E42125' }}>{passwordError}</div>}
                </div>
              </div>

              {/* Сообщения об успехе/ошибке */}
              {settingsMessage && (
                <div style={{ color: '#2E7D32', marginBottom: '1rem', fontWeight: 'bold' }}>
                  {settingsMessage}
                </div>
              )}
              {settingsError && (
                <div style={{ color: '#E42125', marginBottom: '1rem', fontWeight: 'bold' }}>
                  {settingsError}
                </div>
              )}

              <button
                className="admin-btn admin-btn-primary"
                onClick={handleSaveSettings}
                disabled={loadingSettings}
              >
                {loadingSettings ? 'Сохранение...' : 'Сохранить настройки'}
              </button>
            </section>
          )}

          {/* Модальное окно управления отзывами курса */}
          {reviewsModalOpen && (
            <div className="modal-overlay" style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div className="modal-content" style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '800px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}>
                <h2>Управление отзывами курса</h2>
                <p>Все отзывы ({selectedCourseReviews.length}):</p>
                
                {selectedCourseReviews.length === 0 ? (
                  <p>Отзывов пока нет.</p>
                ) : (
                  <div className="admin-table-container" style={{ marginTop: '1rem' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Автор</th>
                          <th>Роль</th>
                          <th>Текст</th>
                          <th>Звёзды</th>
                          <th>Дата</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCourseReviews.map(review => (
                          <tr key={review._id}>
                            <td>{review.author}</td>
                            <td>{review.role}</td>
                            <td
                              style={{
                                maxWidth: '400px',
                                wordBreak: 'break-word',
                                whiteSpace: 'normal',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                              title={review.text}
                            >
                              {review.text.length > 100 ? `${review.text.substring(0, 100)}...` : review.text}
                            </td>
                            <td>{'★'.repeat(review.stars)}</td>
                            <td>{new Date(review.date).toLocaleDateString('ru-RU')}</td>
                            <td>
                              <button
                                className="admin-btn admin-btn-small admin-btn-danger"
                                onClick={() => handleDeleteReview(review._id)}
                              >
                                <img src="/media/delete.png" alt="удалить" className="table-icon" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    className="admin-btn admin-btn-secondary"
                    onClick={closeReviewsModal}
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Модальное окно обнуления курса студента */}
          {resetCourseModalOpen && (
            <div className="modal-overlay" style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div className="modal-content" style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}>
                <h2>Обнуление курса студента</h2>
                <p>Выберите курс для обнуления:</p>
                
                {studentCourses.length === 0 ? (
                  <p>У студента нет активных курсов.</p>
                ) : (
                  <>
                    <div className="admin-form-group">
                      <label>Курс:</label>
                      <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem' }}
                      >
                        <option value="">-- Выберите курс --</option>
                        {studentCourses.map(course => (
                          <option key={course.courseId} value={course.courseId}>
                            {course.title} ({course.language}, уровень: {course.level}) - прогресс: {typeof course.progress === 'object' ? (course.progress.completedLessons || 0) + '/' + (course.progress.totalLessons || 0) + ' уроков' : (course.progress || 0) + '%'}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                      <button
                        className="admin-btn admin-btn-secondary"
                        onClick={closeResetCourseModal}
                      >
                        Отмена
                      </button>
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={handleResetCourse}
                        disabled={!selectedCourseId}
                      >
                        Обнулить курс
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default AdminPanelPage;
