import React from 'react';
import './TeacherPublicView.css';

function TeacherPublicView({ teacherData, privacySettings }) {
  const defaultSettings = {
    showFullName: true,
    showSpecialization: true,
    showExperience: true,
    showEducation: true,
    showMethodology: true,
    showGroups: false,
    showIndividualStudents: false,
    showFormat: true,
    showContactInfo: false
  };
  
  const settings = { ...defaultSettings, ...privacySettings };
  
  console.log('TeacherPublicView - settings:', settings);
  console.log('TeacherPublicView - teacherData:', teacherData);
  
  if (!teacherData) {
    return <div className="teacher-public-container">Данные преподавателя недоступны</div>;
  }

  return (
    <div className="teacher-public-container">
      <div className="teacher-public-header">
        <img
          src={teacherData.avatar || '/media/default-avatar.png'}
          alt={teacherData.name || 'Преподаватель'}
          className="teacher-public-avatar"
        />
        <h1>{settings.showFullName ? (teacherData.name || 'Преподаватель') : 'Преподаватель'}</h1>
        {settings.showSpecialization && teacherData.specialization && (
          <p className="teacher-public-specialization">{teacherData.specialization}</p>
        )}
      </div>
      
      <div className="teacher-public-content">
        {settings.showExperience && teacherData.experience && (
          <div className="info-block">
            <h3>Стаж преподавания</h3>
            <p>{teacherData.experience}</p>
          </div>
        )}
        
        {settings.showEducation && teacherData.education && teacherData.education.length > 0 && (
          <div className="info-block">
            <h3>Образование</h3>
            <ul>{teacherData.education.map((edu, i) => <li key={i}>{edu}</li>)}</ul>
          </div>
        )}
        
        {settings.showMethodology && teacherData.methodology && (
          <div className="info-block">
            <h3>Методика преподавания</h3>
            <p>{teacherData.methodology}</p>
          </div>
        )}
        
        {settings.showGroups && teacherData.groups && teacherData.groups.length > 0 && (
          <div className="info-block">
            <h3>Группы</h3>
            <ul>{teacherData.groups.map((group, i) => <li key={i}>{group}</li>)}</ul>
          </div>
        )}
        
        {settings.showIndividualStudents && teacherData.individualStudents !== null && (
          <div className="info-block">
            <h3>Индивидуальные ученики</h3>
            <p>{teacherData.individualStudents}</p>
          </div>
        )}
        
        {settings.showFormat && teacherData.format && (
          <div className="info-block">
            <h3>Формат занятий</h3>
            <p>{teacherData.format}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherPublicView;