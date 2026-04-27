import { Link } from 'react-router-dom';

function CourseCard({ course, variant = 'catalog' }) {
  // variant может быть 'catalog' (для главной) или 'list' (для списка курсов)
  
  if (variant === 'catalog') {
    return (
      <div className="course-card">
        <img
          src={course.flag}
          alt={`Флаг ${course.name}`}
          className="flag-img"
          onError={(e) => {
            console.log('Ошибка загрузки:', e.target.src);
            e.target.style.display = 'none';
          }}
        />
        <h2>{course.name}</h2>
        <div className="course-details">
          <p>Длительность: {course.duration}</p>
          <p>Уровень: {course.level}</p>
          <p>Модулей: {course.modules}</p>
        </div>
        <div className="course-footer">
          <Link to={`/courses/${course.id}`} className="details-link">Узнать подробнее →</Link>
          <p className="price">От {course.price}</p>
        </div>
      </div>
    );
  }
  
  // Другие варианты отображения если нужны
  return null;
}

export default CourseCard;