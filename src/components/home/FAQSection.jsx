function FAQSection() {
  return (
    <section className="faq-section">
      <div className="container">
        <h2 className="section-title">Отвечаем на частые вопросы</h2>
      </div>
      
      <div className="faq-main-question">
        <div className="container">
          <div className="faq-text-wrapper">
            <h3>Как проходит обучение на онлайн-курсах?</h3>
            <p>
              Обучение проходит в формате видео-лекций на нашей интерактивной платформе. 
              После приобретения курса, вы сразу же получаете письмо на почту с доступом 
              в личный кабинет, в котором уже открыты все уроки приобретенного курса. 
              Каждый урок состоит из видео-лекции по теме и нескольких десятков 
              интерактивных заданий на отработку материала.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="faq-questions">
          <div className="faq-question-item">
            <h4>Я покупаю пакет уроков или онлайн-курс, сколько он действует?</h4>
          </div>
          <div className="faq-question-item">
            <h4>Как быстро я достигну результатов?</h4>
          </div>
          <div className="faq-question-item">
            <h4>Когда я могу начать обучение?</h4>
          </div>
          <div className="faq-question-item">
            <h4>Как проходит обучение на индивидуальных занятиях?</h4>
          </div>
        </div>
        
        <button className="faq-button" onClick={() => window.location.href='/contacts'}>
          Задать вопрос
        </button>
      </div>
    </section>
  );
}

export default FAQSection;