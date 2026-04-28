<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="60" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="60" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="60" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="60" />
</div>

<h1 align="center">✨LinguaLab✨</h1>
<h3 align="center">Платформа для изучения иностранных языков</h3>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

---

## 📖 О проекте

**LinguaLab** - это полноценный веб-сайт для изучения иностранных языков. Пользователи могут выбирать курсы, проходить тесты, отслеживать прогресс. Преподаватели могут управлять контентом.

Проект выполнен в рамках дипломной работы. **Дизайн сначала создан в Figma**, затем реализован в коде.

---

## 🎨 Дизайн в Figma

> Проект начинался с макета. Весь интерфейс сначала был спроектирован в Figma, а потом перенесён в код.

<p align="center">
  <a href="https://www.figma.com/design/JcOLyq64uVXBusenM40VMy/LinguaLab?node-id=524-72">
    <img src="https://img.shields.io/badge/📐-Открыть_макет_в_Figma-C9A87C?style=for-the-badge" />
  </a>
</p>

<!-- Сюда потом добавишь скриншот макета -->
<!-- ![Макет LinguaLab](screenshot.png) -->

---

## 🛠 Стек технологий

### Frontend
| Технология | Описание |
|------------|----------|
| **React 18** | Библиотека для пользовательских интерфейсов |
| **React Router** | Маршрутизация между страницами |
| **Axios** | HTTP-запросы к бэкенду |
| **CSS Modules** | Стилизация компонентов |

### Backend
| Технология | Описание |
|------------|----------|
| **Node.js + Express** | Серверная логика и REST API |
| **MongoDB Atlas** | Облачная база данных |
| **Mongoose** | ODM для работы с MongoDB |
| **JWT + Bcrypt** | Аутентификация и хеширование паролей |

---

## 🚀 Как запустить локально

### Требования
- Node.js (v18+)
- MongoDB Atlas (бесплатный кластер) или локальный MongoDB

### Установка

```bash
# 1. Клонируй репозиторий
git clone https://github.com/Maryyyama/LinguaLab-Code.git
cd LinguaLab-Code

# 2. Установи зависимости
npm install

# 3. Создай файл .env в папке server/ со следующим содержимым:
PORT=5000
MONGODB_URI=mongodb+srv://ТВОЙ_ЛОГИН:ТВОЙ_ПАРОЛЬ@cluster.mongodb.net/lingualab
JWT_SECRET=твой_секретный_ключ

# 4. Запусти проект
npm run dev
