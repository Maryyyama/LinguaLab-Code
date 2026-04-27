/**
 * Централизованный справочник соответствия преподавателей языкам
 * Используется для определения, какой преподаватель какой язык преподает
 * При добавлении нового курса или преподавателя система будет понимать, кто есть кто
 */

export const TEACHER_LANGUAGE_MAPPING = {
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
 * Обратное отображение: язык -> преподаватели
 */
export const LANGUAGE_TEACHER_MAPPING = {
  english: ['Джон Ричардс', 'john_richards', 'Djon_Richards'],
  chinese: ['Ван Сяо', 'wang_xiao', 'Van_Syao'],
  korean: ['Ёнхи Хэран', 'younghui_heran', 'Younghui_Heran'],
  german: ['Ханс Шмидт', 'hans_schmidt', 'Hans_Shmidt'],
  spanish: ['Хуан Пере', 'juan_perez', 'Huan_Pere'],
  italian: ['Изабелла Риччи', 'isabella_ricci', 'Isabella_Ricci'],
  french: ['Пьер Дюпон', 'pierre_dupon', 'Pierre_Dupon'],
  japanese: ['Каору Кобаяси', 'kaoru_kobayashi', 'Kaoru_Kobayashi']
};

/**
 * Получить язык преподавателя по его имени/логину
 * @param {string} teacherName - Имя преподавателя или логин
 * @returns {string|null} Код языка или null если не найден
 */
export function getTeacherLanguage(teacherName) {
  return TEACHER_LANGUAGE_MAPPING[teacherName] || null;
}

/**
 * Получить всех преподавателей для указанного языка
 * @param {string} language - Код языка
 * @returns {Array} Массив имен преподавателей
 */
export function getTeachersByLanguage(language) {
  return LANGUAGE_TEACHER_MAPPING[language] || [];
}

/**
 * Проверить, соответствует ли преподаватель языку
 * @param {string} teacherName - Имя преподавателя
 * @param {string} language - Код языка для проверки
 * @returns {boolean} true если соответствует
 */
export function isTeacherForLanguage(teacherName, language) {
  const teacherLang = getTeacherLanguage(teacherName);
  return teacherLang === language;
}

/**
 * Полный список преподавателей с их языками
 */
export const TEACHERS = [
  { name: 'Джон Ричардс', language: 'english', languageName: 'Английский', login: 'john_richards' },
  { name: 'Ван Сяо', language: 'chinese', languageName: 'Китайский', login: 'wang_xiao' },
  { name: 'Ёнхи Хэран', language: 'korean', languageName: 'Корейский', login: 'younghui_heran' },
  { name: 'Ханс Шмидт', language: 'german', languageName: 'Немецкий', login: 'hans_schmidt' },
  { name: 'Хуан Пере', language: 'spanish', languageName: 'Испанский', login: 'juan_perez' },
  { name: 'Изабелла Риччи', language: 'italian', languageName: 'Итальянский', login: 'isabella_ricci' },
  { name: 'Пьер Дюпон', language: 'french', languageName: 'Французский', login: 'pierre_dupon' },
  { name: 'Каору Кобаяси', language: 'japanese', languageName: 'Японский', login: 'kaoru_kobayashi' }
];