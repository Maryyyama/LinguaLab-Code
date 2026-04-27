function FastLearningSection() {
  const features = [
    {
      title: 'Интересные уроки',
      image: 'Интересные уроки.png',
      items: [
        'Короткие, но насыщенные уроки до 45 минут',
        'Более глубокий объем знаний, чем в других школах...'
      ]
    },
    {
      title: 'Интерактивные задания',
      image: 'интерактивные занятия.png',
      items: [
        'Практические упражнения и тесты, которые помогают сразу применять новые знания на практике'
      ]
    },
    {
      title: 'Удобный формат обучения',
      image: 'удобный формат.png',
      items: [
        'Полностью автоматический процесс обучения на одной платформе',
        'Доступ к материалам с любого устройства'
      ]
    }
  ];

  return (
    <section className="fast-learning-section">
      <div className="container">
        <h2 className="section-title">Почему вы быстро освоите язык</h2>
        
        {features.map((feature, index) => (
          <div className="learning-feature" key={index}>
            <div className="feature-image">
              <img 
                src={`/media/${feature.image}`} 
                alt={feature.title} 
                className="feature-img" 
              />
            </div>
            <div className="feature-content">
              <h3 className="feature-title">{feature.title}</h3>
              <ul className="feature-list">
                {feature.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FastLearningSection;