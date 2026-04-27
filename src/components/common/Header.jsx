import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5001/api';

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      console.log('loadUser - token exists:', !!storedToken);
      
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('loadUser - response status:', response.status);
        
        if (response.ok) {
          let data = {};
          try {
            data = await response.json();
          } catch (jsonError) {
            console.error('Failed to parse successful response:', jsonError);
            throw new Error('Некорректный ответ от сервера');
          }
          
          console.log('loadUser - data received:', data);
          const userData = data.user;
          const profileData = data.profile;
          
          if (!userData) {
            console.error('No user data in response');
            throw new Error('Нет данных пользователя');
          }
          
          console.log('loadUser - user role:', userData.role);
          // Сохраняем пользователя с профилем в одном объекте для удобства
          const userWithProfile = { ...userData, profile: profileData };
          setUser(userWithProfile);
          localStorage.setItem('user', JSON.stringify(userWithProfile));
          
          if (userData.role === 'teacher') {
            const teacherName = userData.login || userData.name;
            localStorage.setItem('teacherName', teacherName);
            // Сохраняем ID преподавателя для навигации
            if (profileData?._id) {
              localStorage.setItem('teacherId', profileData._id);
              console.log('Teacher ID saved:', profileData._id);
            }
            console.log('Teacher name saved:', teacherName);
          }
        } else {
          let errorData = {};
          try {
            errorData = await response.json();
          } catch (jsonError) {
            console.error('Failed to parse error response:', jsonError);
            errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
          }
          console.error('API error:', errorData);
          throw new Error(errorData.error || 'Ошибка загрузки пользователя');
        }
      } catch (error) {
        console.error('Ошибка загрузки пользователя:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('teacherName');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleTeacherClick = (e) => {
    e.preventDefault();
    
    // Сначала пробуем взять ID из user.profile._id
    let teacherId = user?.profile?._id;
    
    // Если нет — пробуем взять из localStorage (после логина)
    if (!teacherId) {
      teacherId = localStorage.getItem('teacherId');
    }
    
    // Если всё равно нет — ищем в списке преподавателей
    if (!teacherId) {
      console.error('Teacher ID not found');
      // Не перенаправляем на старые маршруты, остаёмся на месте
      alert('Не удалось определить ID преподавателя. Обратитесь к администратору.');
      return;
    }
    
    navigate(`/teacher/personal/${teacherId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('teacherName');
    localStorage.removeItem('teacherId');
    setUser(null);
    setToken(null);
    navigate('/entrance');
  };

  if (loading) {
    return null;
  }

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" className="logo-link">
            <img src="/media/логотип LinguaLab.png" alt="LinguaLab" className="logo-img" />
          </Link>
        </div>
        
        <nav className="main-nav">
          <ul className="nav-list">
            <li><Link to="/courses">Курсы</Link></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>О нас</NavLink></li>
            <li><NavLink to="/blog" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Блог</NavLink></li>
            <li><NavLink to="/faq" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Часто задаваемые вопросы</NavLink></li>
            <li><NavLink to="/contacts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Контакты</NavLink></li>
          </ul>
        </nav>
        
        <div className="header-right">
          <div className="header-icons">
            {user && user.role === 'teacher' && (
              <button id="teacher-icon" onClick={handleTeacherClick} className="header-icon-btn">
                <img src="/media/учитель.png" alt="Учитель" className="header-icon" />
              </button>
            )}
            {user && user.role === 'student' && (
              <Link to="/student-info" id="student-icon-link">
                <img src="/media/ученик.png" alt="Ученик" className="header-icon" />
              </Link>
            )}
          </div>
          <div className="auth">
            {token ? (
              <button className="login-btn" onClick={handleLogout}>
                <img src="/media/выйти.png" alt="Выйти" className="login-img" />
              </button>
            ) : (
              <Link to="/entrance" className="login-btn">
                <img src="/media/войти.png" alt="Войти" className="login-img" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;