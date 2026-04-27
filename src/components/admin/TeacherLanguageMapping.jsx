import React from 'react';
import { TEACHERS } from '../../data/teachers';
import './TeacherLanguageMapping.css';

const TeacherLanguageMapping = () => {
  const languageNames = {
    english: 'Английский',
    chinese: 'Китайский',
    korean: 'Корейский',
    german: 'Немецкий',
    spanish: 'Испанский',
    italian: 'Итальянский',
    french: 'Французский',
    japanese: 'Японский'
  };

  const flagImages = {
    english: '/media/флаг  америки.png',
    chinese: '/media/флаг китая.png',
    korean: '/media/флаг южной кореи.png',
    german: '/media/Флаг Германии.png',
    spanish: '/media/флаг испании.png',
    italian: '/media/флаг италии.png',
    french: '/media/флаг франции.png',
    japanese: '/media/флаг японии.png'
  };

  // Группируем преподавателей по языкам
  const teachersByLanguage = TEACHERS.reduce((acc, teacher) => {
    if (!acc[teacher.language]) {
      acc[teacher.language] = [];
    }
    acc[teacher.language].push(teacher);
    return acc;
  }, {});

  return (
    <div className="teacher-language-mapping">
      <h2>Справочник соответствия преподавателей языкам</h2>
      <p className="description">
        Эта система позволяет автоматически определять, какой преподаватель какой язык преподает.
        При добавлении нового курса или преподавателя система будет проверять соответствие.
      </p>
      
      <div className="mapping-grid">
        {Object.entries(teachersByLanguage).map(([languageCode, teachers]) => (
          <div key={languageCode} className="language-card">
            <div className="language-header">
              <img 
                src={flagImages[languageCode] || '/media/default-avatar.png'} 
                alt={languageNames[languageCode]} 
                className="language-flag"
              />
              <h3>{languageNames[languageCode]}</h3>
              <span className="language-code">({languageCode})</span>
            </div>
            
            <div className="teachers-list">
              {teachers.map((teacher, index) => (
                <div key={index} className="teacher-item">
                  <div className="teacher-name">{teacher.name}</div>
                  <div className="teacher-login">Логин: {teacher.login}</div>
                  <div className="teacher-language">Язык: {languageNames[teacher.language]}</div>
                </div>
              ))}
            </div>
            
            <div className="language-info">
              <p>При создании курса на языке "{languageNames[languageCode]}" можно назначить любого из этих преподавателей.</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="usage-instructions">
        <h3>Как использовать систему:</h3>
        <ol>
          <li>При создании нового курса укажите язык курса (например, "english")</li>
          <li>Укажите преподавателя (например, "Джон Ричардс" или "john_richards")</li>
          <li>Система автоматически проверит, что преподаватель соответствует языку курса</li>
          <li>Если преподаватель не соответствует языку, система выдаст ошибку</li>
        </ol>
        
        <h3>Примеры валидных назначений:</h3>
        <ul>
          <li>Язык: <strong>english</strong> → Преподаватель: <strong>Джон Ричардс</strong> ✓</li>
          <li>Язык: <strong>chinese</strong> → Преподаватель: <strong>Ван Сяо</strong> ✓</li>
          <li>Язык: <strong>german</strong> → Преподаватель: <strong>Ханс Шмидт</strong> ✓</li>
        </ul>
        
        <h3>Примеры невалидных назначений:</h3>
        <ul>
          <li>Язык: <strong>english</strong> → Преподаватель: <strong>Ван Сяо</strong> ✗ (Ошибка: Преподаватель преподает Китайский, а не Английский)</li>
          <li>Язык: <strong>spanish</strong> → Преподаватель: <strong>Неизвестный Преподаватель</strong> ✗ (Ошибка: Преподаватель не найден в системе)</li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherLanguageMapping;