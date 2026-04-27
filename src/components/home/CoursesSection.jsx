import CourseCard from './CourseCard';

function CoursesSection() {
  const courses = [
    { language: 'Немецкий', flag: 'Флаг Германии.png' },
    { language: 'Китайский', flag: 'флаг китая.png' },
    { language: 'Испанский', flag: 'флаг испании.png' }
  ];

  return (
    <section className="courses-section">
      <div className="courses-container">
        {courses.map((course, index) => (
          <CourseCard 
            key={index}
            language={course.language}
            flag={course.flag}
          />
        ))}
      </div>
    </section>
  );
}

export default CoursesSection;