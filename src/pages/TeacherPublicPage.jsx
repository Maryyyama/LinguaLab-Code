import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import TeacherPublicView from '../components/teachers/TeacherPublicView';
import api from '../services/api';
import '../styles/App.css';

function TeacherPublicPage() {
  const { teacherId } = useParams();
  const [teacherData, setTeacherData] = useState(null);
  const [privacySettings, setPrivacySettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeacherPublic = async () => {
      try {
        const response = await api.getTeacherById(teacherId);
        if (response && response.teacher) {
          setTeacherData(response.teacher);
          setPrivacySettings(response.privacy);
        } else {
          throw new Error('Нет данных');
        }
      } catch (err) {
        console.error('Ошибка загрузки публичного профиля:', err);
        setError('Не удалось загрузить данные преподавателя.');
        // Используем моковые данные для демонстрации
        setTeacherData({
          name: 'Преподаватель',
          avatar: '/media/препод.png',
          specialization: 'Специализация не указана',
          experience: 'Не указан',
          education: [],
          methodology: 'Методика не указана',
          groups: [],
          individualStudents: 0,
          format: 'Онлайн/оффлайн'
        });
        setPrivacySettings({
          showFullName: true,
          showSpecialization: true,
          showExperience: true,
          showEducation: true,
          showMethodology: true,
          showGroups: false,
          showIndividualStudents: false,
          showFormat: true,
          showContactInfo: false,
          showToGuests: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherPublic();
  }, [teacherId]);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <Header />
      <main className="main">
        <div className="main__container">
          {/* Публичный вид без боковой панели */}
          <TeacherPublicView 
            teacherData={teacherData} 
            privacySettings={privacySettings} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default TeacherPublicPage;