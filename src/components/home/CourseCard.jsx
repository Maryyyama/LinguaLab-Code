import { Link } from 'react-router-dom';

function CourseCard({ language, flag, price = '6 520 ₽' }) {
  return (
    <div className="course-card">
      <img src={`/media/${flag}`} alt={`Флаг ${language}`} className="flag-img" />
      <h2>{language}</h2>
      <div className="course-details">
        <p>Длительность: 45 часов</p>
        <p>Уровень: начальный</p>
        <p>Модулей: 3</p>
      </div>
      <div className="course-footer">
        <Link to="/courses" className="details-link">Узнать подробнее →</Link>
        <p className="price">От {price}</p>
      </div>
    </div>
  );
}

export default CourseCard;