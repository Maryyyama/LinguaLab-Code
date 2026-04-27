/**
 * Утилита для проверки соответствия преподавателей языкам
 * Используется при добавлении нового курса или преподавателя
 */

const TEACHER_LANGUAGE_MAP = {
  // Английский язык
  'Джон Ричардс': 'english',
  'john_richards': 'english',
  'Djon_Richards': 'english',
  
  // Китайский язык
  'Ван Сяо': 'chinese',
  'wang_xiao': 'chinese',
  'Van_Syao': 'chinese',
  
  // Корейский язык
  'Ёнхи Хэран': 'korean',
  'younghui_heran': 'korean',
  'Younghui_Heran': 'korean',
  
  // Немецкий язык
  'Ханс Шмидт': 'german',
  'hans_schmidt': 'german',
  'Hans_Shmidt': 'german',
  
  // Испанский язык
  'Хуан Пере': 'spanish',
  'juan_perez': 'spanish',
  'Huan_Pere': 'spanish',
  
  // Итальянский язык
  'Изабелла Риччи': 'italian',
  'isabella_ricci': 'italian',
  'Isabella_Ricci': 'italian',
  
  // Французский язык
  'Пьер Дюпон': 'french',
  'pierre_dupon': 'french',
  'Pierre_Dupon': 'french',
  
  // Японский язык
  'Каору Кобаяси': 'japanese',
  'kaoru_kobayashi': 'japanese',
  'Kaoru_Kobayashi': 'japanese'
};

/**
 * Получить язык преподавателя по его имени
 * @param {string} teacherName - Имя преподавателя или логин
 * @returns {string|null} Код языка или null если не найден
 */
function getTeacherLanguage(teacherName) {
  return TEACHER_LANGUAGE_MAP[teacherName] || null;
}

/**
 * Проверить, соответствует ли преподаватель указанному языку
 * @param {string} teacherName - Имя преподавателя
 * @param {string} language - Код языка для проверки
 * @returns {boolean} true если соответствует
 */
function isTeacherForLanguage(teacherName, language) {
  const teacherLang = getTeacherLanguage(teacherName);
  return teacherLang === language;
}

/**
 * Валидация при создании курса: проверка что преподаватель соответствует языку курса
 * @param {string} teacherName - Имя преподавателя
 * @param {string} courseLanguage - Язык курса
 * @returns {Object} Результат валидации {valid: boolean, message: string}
 */
function validateTeacherForCourse(teacherName, courseLanguage) {
  const teacherLang = getTeacherLanguage(teacherName);
  
  const languageNames = {
    english: 'Английский',
    chinese: 'Китайский',
    korean: 'Корейский',
    german: 'Немецкий',
    spanish: 'Испанский',
    italian: 'Итальянский',
    french: 'Французский',
    japanese: 'Японский'
  };
  
  if (!teacherLang) {
    return {
      valid: false,
      message: `Преподаватель "${teacherName}" не найден в системе. Пожалуйста, проверьте имя преподавателя.`
    };
  }
  
  if (teacherLang !== courseLanguage) {
    return {
      valid: false,
      message: `Преподаватель "${teacherName}" преподает ${languageNames[teacherLang]}, а не ${languageNames[courseLanguage]}. Пожалуйста, выберите соответствующего преподавателя.`
    };
  }
  
  return {
    valid: true,
    message: `Преподаватель "${teacherName}" успешно проверен для языка ${languageNames[courseLanguage]}.`
  };
}

/**
 * Получить всех преподавателей для указанного языка
 * @param {string} language - Код языка
 * @returns {Array} Массив имен преподавателей
 */
function getTeachersByLanguage(language) {
  const teachers = [];
  for (const [name, lang] of Object.entries(TEACHER_LANGUAGE_MAP)) {
    if (lang === language && !name.includes('_') && !name[0].match(/[a-z]/)) {
      // Фильтруем только русские имена (не логины)
      teachers.push(name);
    }
  }
  return teachers;
}

/**
 * Получить все доступные языки с преподавателями
 * @returns {Object} Объект с языками и преподавателями
 */
function getAllLanguagesWithTeachers() {
  const result = {};
  const languageNames = {
    english: 'Английский',
    chinese: 'Китайский',
    korean: 'Корейский',
    german: 'Немецкий',
    spanish: 'Испанский',
    italian: 'Итальянский',
    french: 'Французский',
    japanese: 'Японский'
  };
  
  for (const [langCode, langName] of Object.entries(languageNames)) {
    result[langCode] = {
      name: langName,
      teachers: getTeachersByLanguage(langCode)
    };
  }
  
  return result;
}

module.exports = {
  getTeacherLanguage,
  isTeacherForLanguage,
  validateTeacherForCourse,
  getTeachersByLanguage,
  getAllLanguagesWithTeachers,
  TEACHER_LANGUAGE_MAP
};