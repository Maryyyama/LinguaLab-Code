function HowItWorksSection() {
  const steps = [
    {
      title: 'Регистрация',
      description: 'Выберите интересующий язык и регистрируйтесь',
      image: 'регистрация(блоондинка).png'
    },
    {
      title: 'Настройка профиля',
      description: 'Заполните личные данные и настройте аккаунт',
      image: 'настройка профиля.png'
    },
    {
      title: 'Обучение',
      description: 'Всё! Приступайте к первому бесплатному уроку',
      image: 'обучение.png'
    }
  ];

  return (
    <section className="how-it-works-section">
      <div className="container">
        <h2 className="section-title">Как это работает?</h2>
        
        <div className="steps-container">
          {steps.map((step, index) => (
            <div className="step-card" key={index}>
              <div className="step-image">
                <img src={`/media/${step.image}`} alt={step.title} className="step-img" />
              </div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;