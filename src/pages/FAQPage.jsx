import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/App.css';

function FAQPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState({});

  // Данные для FAQ
  const faqItems = [
    // Вопросы об обучении (learning)
    { id: 1, category: 'learning', question: 'Как проходит обучение на онлайн-курсах?', 
      answer: 'Обучение проходит в формате видео-лекций на нашей интерактивной платформе. После приобретения курса, вы сразу же получаете письмо на почту с доступом в личный кабинет, в котором откроются все уроки приобретённого курса. Каждый урок состоит из видео-лекции по теме и нескольких интерактивных упражнений на отработку материала.' },
    { id: 2, category: 'learning', question: 'Какие языки доступны для изучения?', 
      answer: 'На нашей платформе доступны курсы по английскому, испанскому, китайскому и немецкому языкам.' },
    { id: 3, category: 'learning', question: 'Можно ли поменять курс после начала обучения?', 
      answer: 'Да, вы можете сменить курс в любой момент. Обратитесь в службу поддержки для оформления перехода.' },
    { id: 4, category: 'learning', question: 'Как часто обновляются учебные материалы?', 
      answer: 'Учебные материалы обновляются ежемесячно. Все обновления автоматически появляются в вашем личном кабинете.' },
    { id: 5, category: 'learning', question: 'Предоставляются ли дополнительные материалы для самостоятельной практики?', 
      answer: 'Да, для каждого урока мы предоставляем дополнительные материалы для самостоятельной практики.' },
    { id: 6, category: 'learning', question: 'Есть ли групповые занятия или только индивидуальные?', 
      answer: 'У нас есть как групповые, так и индивидуальные занятия. Вы можете выбрать наиболее подходящий формат при регистрации.' },
    { id: 7, category: 'learning', question: 'Как связаться с преподавателем вне уроков?', 
      answer: 'Вы можете связаться с преподавателем через личный кабинет или по электронной почте в рабочее время.' },
    { id: 8, category: 'learning', question: 'Что делать, если я пропустил занятие?', 
      answer: 'Если вы пропустили занятие, вы можете посмотреть запись урока в личном кабинете в любое удобное время.' },
    { id: 9, category: 'learning', question: 'Есть ли возможность заморозить подписку?', 
      answer: 'Да, вы можете заморозить подписку на время отпуска. Обратитесь в службу поддержки за дополнительной информацией.' },
    { id: 10, category: 'learning', question: 'Какие уровни владения языком охватывают курсы?', 
      answer: 'Наши курсы охватывают уровни от начинающего (A1) до продвинутого (C2) в соответствии с общеевропейской шкалой.' },
    { id: 11, category: 'learning', question: 'Проводятся ли тестирования для определения моего уровня?', 
      answer: 'Да, перед началом обучения вы можете пройти бесплатное тестирование для определения вашего уровня владения языком.' },
    
    // Вопросы о покупке (purchase)
    { id: 12, category: 'purchase', question: 'Какие способы оплаты доступны?', 
      answer: 'Мы принимаем оплату банковскими картами Visa, MasterCard, МИР, а также через электронные кошельки Яндекс.Деньги и Qiwi.' },
    { id: 13, category: 'purchase', question: 'Можно ли вернуть деньги, если курс не подошел?', 
      answer: 'Да, в течение 14 дней с момента покупки вы можете вернуть полную стоимость курса, если не приступили к обучению.' },
    { id: 14, category: 'purchase', question: 'Предоставляется ли скидка при покупке нескольких курсов?', 
      answer: 'Да, при покупке двух и более курсов предоставляется скидка 15%. При покупке четырех курсов - скидка 25%.' }
  ];

  // Фильтрация вопросов по категории
  const filteredItems = faqItems.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

  // Обработчик клика по вопросу (аккордеон)
  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Логика для иконок учителя/ученика
  useEffect(() => {
    const isTeacher = localStorage.getItem('isTeacher') === 'true';
    const teacherIconLink = document.getElementById('teacher-icon-link');
    
    if (isTeacher && teacherIconLink) {
      teacherIconLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '/teacher-info';
      });
    } else if (teacherIconLink) {
      teacherIconLink.style.display = 'none';
    }

    const isUserLoggedIn = localStorage.getItem('isUserLoggedIn');
    const studentIconLink = document.getElementById('student-icon-link');
    
    if (!isUserLoggedIn || isUserLoggedIn !== 'true') {
      if (studentIconLink) {
        studentIconLink.addEventListener('click', function(e) {
          e.preventDefault();
          alert('Для доступа к профилю необходимо войти в систему');
          window.location.href = '/entrance';
        });
      }
    }
  }, []);

  return (
    <>
      <Header />
      <main>
        {/* FAQ SECTION */}
        <section className="faq">
          <div className="container">
            <h1>Часто задаваемые вопросы</h1>
            <p className="faq__subtitle">Отвечаем на горячие вопросы</p>
            
            {/* ВКЛАДКИ ФИЛЬТРОВ */}
            <div className="faq__tabs">
              {[
                { key: 'all', label: 'Все' },
                { key: 'learning', label: 'Вопросы об обучении' },
                { key: 'purchase', label: 'Вопросы о покупке' }
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`tab ${activeCategory === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* АККОРДЕОН С ВОПРОСАМИ */}
            <div className="faq__accordion">
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className={`faq__item ${openItems[item.id] ? 'faq__item--active' : ''}`}
                  data-category={item.category}
                >
                  <div 
                    className="faq__question"
                    onClick={() => toggleItem(item.id)}
                  >
                    {item.question}
                    <span className="faq__icon">{openItems[item.id] ? '−' : '+'}</span>
                  </div>
                  {openItems[item.id] && (
                    <div className="faq__answer">{item.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HELP SECTION */}
        <section className="help">
          <div className="container help__container">
            <img src="/media/девушка на диване.png" alt="Девушка на диване" className="help__img" />
            <div className="help__info">
              <h2>Мы всегда рады помочь!</h2>
              <p>Свяжитесь с нашей командой поддержки студентов по любым вопросам.</p>
              <button 
                className="help__btn"
                onClick={() => navigate('/contacts')}
              >
                Задать вопрос
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default FAQPage;