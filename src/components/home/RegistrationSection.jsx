import { useNavigate } from 'react-router-dom';

function RegistrationSection() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/registration');
  };

  return (
    <section className="registration-container">
      <div className="registration-bg"></div>
      <div className="registration-section">
        <div className="container">
          <div className="registration-content">
            <div className="registration-text">
              <h2 className="registration-title">
                Регистрируйтесь и приступайте к первому бесплатному уроку
              </h2>
              <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Телефон</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="form-input" 
                    placeholder="+7 (___) ___ __ __"
                  />
                </div>
                <button type="submit" className="submit-btn">
                  Продолжить регистрацию
                </button>
                <div className="checkbox-group">
                  <input type="checkbox" id="agreement" className="checkbox" required />
                  <label htmlFor="agreement" className="checkbox-label">
                    Отправляя заявку, я соглашаюсь с политикой конфиденциальности и пользовательским соглашением
                  </label>
                </div>
              </form>
            </div>
            <div className="registration-image">
              <img src="/media/регистрация.png" alt="Регистрация" className="registration-img" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegistrationSection;