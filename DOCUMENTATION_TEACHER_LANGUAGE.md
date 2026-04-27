# Система соответствия преподавателей языкам

## Обзор

Система позволяет автоматически определять, какой преподаватель какой язык преподает. При добавлении нового курса или преподавателя система проверяет соответствие преподавателя и языка курса, предотвращая ошибки назначения.

## Преподаватели и языки

| Преподаватель | Язык | Логин | Альтернативные имена |
|--------------|------|-------|---------------------|
| Джон Ричардс | Английский (english) | john_richards | Djon_Richards |
| Ван Сяо | Китайский (chinese) | wang_xiao | Van_Syao |
| Ёнхи Хэран | Корейский (korean) | younghui_heran | Younghui_Heran |
| Ханс Шмидт | Немецкий (german) | hans_schmidt | Hans_Shmidt |
| Хуан Пере | Испанский (spanish) | juan_perez | Huan_Pere |
| Изабелла Риччи | Итальянский (italian) | isabella_ricci | Isabella_Ricci |
| Пьер Дюпон | Французский (french) | pierre_dupon | Pierre_Dupon |
| Каору Кобаяси | Японский (japanese) | kaoru_kobayashi | Kaoru_Kobayashi |

## Архитектура системы

### 1. Централизованные справочники
- **`src/data/teachers.js`** - справочник на клиентской стороне
- **`server/utils/teacherLanguage.js`** - справочник на серверной стороне

### 2. Модель Course
Обновлена модель `Course` в `server/models/Course.js`:
- Добавлено поле `teacher` (строка) для хранения имени преподавателя
- Добавлено поле `teacherId` (ObjectId) для связи с моделью Teacher

### 3. Валидация в API
- **Создание курса** (`POST /api/courses`): проверка соответствия преподавателя и языка
- **Обновление курса** (`PUT /api/courses/:id`): проверка соответствия преподавателя и языка

## Использование

### 1. Создание курса с проверкой

```javascript
// Пример запроса к API
POST /api/courses
{
  "title": "Английский для начинающих",
  "language": "english",
  "teacher": "Джон Ричардс",
  "level": "beginner",
  "price": 6520
}

// Успешный ответ
{
  "valid": true,
  "message": "Преподаватель 'Джон Ричардс' успешно проверен для языка Английский."
}

// Ошибка при несоответствии
{
  "error": "Преподаватель 'Джон Ричардс' преподает Английский, а не Китайский. Пожалуйста, выберите соответствующего преподавателя."
}
```

### 2. Программная проверка

```javascript
// На клиенте
import { isTeacherForLanguage } from '../data/teachers';

const isValid = isTeacherForLanguage('Джон Ричардс', 'english'); // true
const isInvalid = isTeacherForLanguage('Джон Ричардс', 'chinese'); // false

// На сервере
const { validateTeacherForCourse } = require('./utils/teacherLanguage');
const result = validateTeacherForCourse('Ван Сяо', 'chinese');
console.log(result.valid); // true
console.log(result.message); // "Преподаватель 'Ван Сяо' успешно проверен..."
```

### 3. Получение списка преподавателей по языку

```javascript
// На клиенте
import { getTeachersByLanguage } from '../data/teachers';
const chineseTeachers = getTeachersByLanguage('chinese'); // ['Ван Сяо', 'wang_xiao', 'Van_Syao']

// На сервере
const { getTeachersByLanguage } = require('./utils/teacherLanguage');
const germanTeachers = getTeachersByLanguage('german'); // ['Ханс Шмидт']
```

## Компонент для админ-панели

Создан компонент `TeacherLanguageMapping` для визуализации соответствий:
- Расположение: `src/components/admin/TeacherLanguageMapping.jsx`
- Стили: `src/components/admin/TeacherLanguageMapping.css`
- Отображает всех преподавателей, сгруппированных по языкам
- Показывает примеры валидных и невалидных назначений

## Тестирование

Для проверки работы системы создан тестовый скрипт:
```bash
node test_teacher_language.js
```

Скрипт проверяет:
1. Валидные соответствия преподавателей и языков
2. Невалидные соответствия (ошибки назначения)
3. Неизвестных преподавателей
4. Список всех языков с преподавателями

## Добавление новых преподавателей

### 1. Обновить справочники
Добавить преподавателя в оба файла:
- `src/data/teachers.js` (клиентская часть)
- `server/utils/teacherLanguage.js` (серверная часть)

### 2. Формат добавления
```javascript
// В TEACHER_LANGUAGE_MAPPING
'Новый Преподаватель': 'language_code',
'new_teacher_login': 'language_code',

// В LANGUAGE_TEACHER_MAPPING
language_code: ['Новый Преподаватель', 'new_teacher_login', 'New_Teacher'],

// В TEACHERS массив
{ name: 'Новый Преподаватель', language: 'language_code', languageName: 'Язык', login: 'new_teacher_login' }
```

### 3. Проверить enum в моделях
Убедиться, что язык присутствует в enum:
- `server/models/Teacher.js`: поле `language`
- `server/models/Course.js`: поле `language`

## Преимущества системы

1. **Автоматическая проверка** - предотвращает ошибки назначения преподавателей
2. **Централизованное управление** - все соответствия в одном месте
3. **Гибкость** - поддержка альтернативных имен и логинов
4. **Визуализация** - компонент для админ-панели показывает все соответствия
5. **Расширяемость** - легко добавлять новых преподавателей и языки

## Ограничения

1. Система не проверяет существование преподавателя в базе данных (только соответствие имени)
2. Для полной интеграции требуется обновление интерфейсов создания/редактирования курсов
3. Не поддерживает преподавателей, которые ведут несколько языков (только один язык на преподавателя)

## Дальнейшее развитие

1. Добавить поддержку нескольких языков для одного преподавателя
2. Интегрировать проверку в интерфейс создания курса
3. Добавить историю назначений преподавателей на курсы
4. Создать отчеты по загрузке преподавателей по языкам