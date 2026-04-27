import { Link } from 'react-router-dom';

function NewsSection() {
  const news = [
    {
      title: 'Новая система скидок: успейте забрать максимум!',
      date: '12-04-2025',
      excerpt: 'Для многих стоимость изучения иностранного языка является важным критерием при выборе системы обучения'
    },
    {
      title: '«Интерактивная платформа: как это работает?» Отвечает основатель проекта...',
      date: '12-04-2025',
      excerpt: 'Моя команда – профессиональные филологи и педагоги – носители языка преподаватели зарубежных университетов, которые...'
    },
    {
      title: 'Новое слово в изучении иностранных языков: интерактивная платформа...',
      date: '12-04-2025',
      excerpt: 'Для многих стоимость изучения иностранного языка является важным критерием при выборе системы обучения'
    }
  ];

  return (
    <section className="news-section">
      <div className="container">
        <h2 className="section-title">Полезные новости и статьи</h2>
        
        <div className="news-container">
          {news.map((item, index) => (
            <div className="news-card" key={index}>
              <div className="news-content">
                <h3 className="news-title" dangerouslySetInnerHTML={{ __html: item.title }} />
                <p className="news-date">{item.date}</p>
                <p className="news-excerpt">{item.excerpt}</p>
                <Link to="/blog" className="news-link">Подробнее →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewsSection;