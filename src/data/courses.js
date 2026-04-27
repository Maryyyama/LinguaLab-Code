
export const courses = [
  {
    id: 'english-beginner',
    language: 'english',
    level: 'начальный',
    title: 'Английский для начинающих',
    description: 'О курсе',
    afterCourse: [
      'Легко расскажете о себе, представите свою компанию',
      'Сможете поддержать беседу и без труда ориентироваться в бытовых ситуациях',
      'Легко знакомиться и общаться с окружающими',
      'Вы никогда не потеряетесь в языковой среде'
    ],
    forWhom: 'Для начинающих',
    modules: [
      { title: 'about myself / о себе', lessons: 5, points: 50, description: 'Сможете создать, почему представители современных социальных резервов, набирают популярность среди исследователей, а значит, должны быть подвергнуты целой серии независимых исследований...' },
      { title: 'family / семья', lessons: 5, points: 50 },
      { title: 'my day / Мой день', lessons: 5, points: 50 },
      { title: 'numbers / числа', lessons: 5, points: 50 },
      { title: 'conversational situations / Разговорные ситуации', lessons: 5, points: 50 },
      { title: 'leisure / Досуг', lessons: 5, points: 50 },
      { title: 'professional life / Профессиональная жизнь', lessons: 5, points: 50 },
      { title: 'holidays / Праздники', lessons: 5, points: 50 }
    ],
    price: 'От 6 520 Р',
    flagImage: '/media/флаг  америки.png',
    lessons: 40,
    tasks: 365,
    tests: 9,
    expertSessions: 4,
    topStudents: [
      { name: 'Виктор Печкин', score: 300 },
      { name: 'Полина Веткина', score: 270 },
      { name: 'Виктория Журавлева', score: 240 }
    ],
    reviews: [
      { author: 'Артем М.', role: 'Студент', text: 'Занятия курса очень понравились, в основном благодаря необычной системе — и человек настроения и не могу подстраиваться под график индивидуального репетитора или тем более одной группы...', stars: 5 },
      { author: 'Вероника Ш.', role: 'Студент', text: 'Очень понравился курс! Материал подан легко и интересно, можно заниматься в своём ритме...', stars: 5 }
    ],
    similarCourses: [
      { language: 'german', title: 'Немецкий', duration: '45 часов', level: 'начальный', modules: 3, price: 'От 6 520 Р', flag: '/media/Флаг Германии.png' },
      { language: 'english', title: 'Английский', duration: '45 часов', level: 'средний', modules: 3, price: 'От 6 520 Р', flag: '/media/флаг  америки.png' }
    ],
    enrollLink: '/english-payment'
  },
  {
    id: 'english-intermediate',
    language: 'english',
    level: 'средний',
    title: 'Английский для среднего уровня',
    description: 'О курсе',
    afterCourse: [
      'Сможете вести деловые переговоры и презентации на английском языке',
      'Уверенно общаться на профессиональные темы в вашей сфере',
      'Понимать фильмы и сериалы без субтитров',
      'Читать профессиональную литературу на английском языке'
    ],
    forWhom: 'Средний уровень',
    modules: [
      { title: 'business communication / деловое общение', lessons: 6, points: 60, description: 'Изучите основы делового общения, включая деловую переписку, телефонные разговоры и деловые встречи...' },
      { title: 'professional vocabulary / профессиональная лексика', lessons: 6, points: 60 },
      { title: 'presentations / презентации', lessons: 6, points: 60 },
      { title: 'negotiations / переговоры', lessons: 6, points: 60 },
      { title: 'media and culture / медиа и культура', lessons: 6, points: 60 },
      { title: 'advanced grammar / продвинутая грамматика', lessons: 6, points: 60 },
      { title: 'writing skills / письменные навыки', lessons: 6, points: 60 },
      { title: 'exam preparation / подготовка к экзаменам', lessons: 6, points: 60 }
    ],
    price: 'От 8 200 Р',
    flagImage: '/media/флаг  америки.png',
    lessons: 48,
    tasks: 438,
    tests: 12,
    expertSessions: 6,
    topStudents: [
      { name: 'Анна Соколова', score: 480 },
      { name: 'Михаил Петров', score: 450 },
      { name: 'Елена Кузнецова', score: 420 }
    ],
    reviews: [
      { author: 'Дмитрий К.', role: 'Студент', text: 'Курс помог значительно улучшить мой деловой английский. Особенно полезными оказались модули по ведению переговоров и составлению деловой переписки...', stars: 5 },
      { author: 'Ольга М.', role: 'Студент', text: 'Отличный курс для повышения квалификации! Материал хорошо структурирован, преподаватели профессиональные...', stars: 5 }
    ],
    similarCourses: [
      { language: 'german', title: 'Немецкий', duration: '45 часов', level: 'начальный', modules: 3, price: 'От 6 520 Р', flag: '/media/Флаг Германии.png' },
      { language: 'english', title: 'Английский', duration: '45 часов', level: 'средний', modules: 3, price: 'От 6 520 Р', flag: '/media/флаг  америки.png' }
    ],
    enrollLink: '/english-payment'
  },
  {
    id: 'chinese-beginner',
    language: 'chinese',
    level: 'начальный',
    title: 'Китайский для начинающих',
    description: 'О курсе',
    afterCourse: [
      'Вы освоите базовые фразы китайского языка',
      'Научитесь правильно произносить тоновые сочетания',
      'Поймете основы китайской грамматики',
      'Сможете вести простые диалоги на повседневные темы'
    ],
    forWhom: 'Для начинающих',
    modules: [
      { title: 'Введение в китайский язык / 基础介绍', lessons: 5, points: 50, description: 'Вы познакомитесь с китайской фонетикой, научитесь правильно произносить тоновые сочетания и освоите базовый алфавит Пиньинь.' },
      { title: 'Персональная информация / 个人信息', lessons: 5, points: 50 },
      { title: 'Повседневная рутина / 日常生活', lessons: 5, points: 50 },
      { title: 'Числа и время / 数字和时间', lessons: 5, points: 50 },
      { title: 'Покупки / 购物', lessons: 5, points: 50 },
      { title: 'Еда и напитки / 食物和饮料', lessons: 5, points: 50 },
      { title: 'Семья / 家庭', lessons: 5, points: 50 },
      { title: 'Путешествия / 旅行', lessons: 5, points: 50 }
    ],
    price: 'От 6 520 Р',
    flagImage: '/media/флаг китая.png',
    lessons: 40,
    tasks: 365,
    tests: 9,
    expertSessions: 4,
    topStudents: [
      { name: 'Анна Петрова', score: 300 },
      { name: 'Михаил Сидоров', score: 270 },
      { name: 'Елена Кузнецова', score: 240 }
    ],
    reviews: [
      { author: 'Ирина К.', role: 'Студент', text: 'Отличный курс для начинающих! Все объясняется понятно и доступно. Особенно понравились интерактивные задания.', stars: 5 },
      { author: 'Дмитрий В.', role: 'Студент', text: 'Начал изучать китайский с нуля. Курс помог освоить базу быстро и эффективно. Рекомендую всем новичкам!', stars: 5 }
    ],
    similarCourses: [
      { language: 'english', title: 'Английский', duration: '45 часов', level: 'начальный', modules: 3, price: 'От 6 520 Р', flag: '/media/флаг  америки.png' },
      { language: 'german', title: 'Немецкий', duration: '45 часов', level: 'начальный', modules: 3, price: 'От 6 520 Р', flag: '/media/Флаг Германии.png' }
    ],
    enrollLink: '/chinese-payment'
  },
  {
    id: 'chinese-intermediate',
    language: 'chinese',
    level: 'средний',
    title: 'Китайский для среднего уровня',
    description: 'О курсе',
    afterCourse: [
      'Сможете вести беседы на профессиональные темы',
      'Уверенно общаться в бизнес-среде на китайском языке',
      'Понимать фильмы и сериалы без субтитров',
      'Читать профессиональную литературу на китайском языке'
    ],
    forWhom: 'Средний уровень',
    modules: [
      { title: '商务沟通 / Деловое общение', lessons: 6, points: 60, description: 'Изучите основы делового общения на китайском языке, включая деловую переписку, телефонные разговоры и деловые встречи.' },
      { title: '专业词汇 / Профессиональная лексика', lessons: 6, points: 60 },
      { title: '文化与社会 / Культура и общество', lessons: 6, points: 60 },
      { title: '经济与金融 / Экономика и финансы', lessons: 6, points: 60 },
      { title: '科技与创新 / Технологии и инновации', lessons: 6, points: 60 },
      { title: '健康与医学 / Здоровье и медицина', lessons: 6, points: 60 },
      { title: '旅游与地理 / Туризм и география', lessons: 6, points: 60 },
      { title: '考试准备 / Подготовка к экзаменам', lessons: 6, points: 60 }
    ],
    price: 'От 8 200 Р',
    flagImage: '/media/флаг китая.png',
    lessons: 48,
    tasks: 438,
    tests: 12,
    expertSessions: 6,
    topStudents: [
      { name: 'Анна Соколова', score: 480 },
      { name: 'Михаил Петров', score: 450 },
      { name: 'Елена Кузнецова', score: 420 }
    ],
    reviews: [
      { author: 'Дмитрий К.', role: 'Студент', text: 'Курс помог значительно улучшить мой китайский язык. Особенно полезными оказались модули по деловому общению и составлению деловой переписки на китайском языке.', stars: 5 },
      { author: 'Ольга М.', role: 'Студент', text: 'Отличный курс для повышения квалификации! Материал хорошо структурирован, преподаватели профессиональные. Теперь могу уверенно общаться с китайскими коллегами.', stars: 5 }
    ],
    similarCourses: [
      { language: 'english', title: 'Английский', duration: '45 часов', level: 'средний', modules: 3, price: 'От 8 200 Р', flag: '/media/флаг  америки.png' },
      { language: 'german', title: 'Немецкий', duration: '45 часов', level: 'средний', modules: 3, price: 'От 8 200 Р', flag: '/media/Флаг Германии.png' }
    ],
    enrollLink: '/chinese-payment'
  },
  {
    id: 'german-beginner',
    language: 'german',
    level: 'начальный',
    title: 'Немецкий для начинающих',
    description: 'О курсе',
    afterCourse: [
      'Вы сможете представиться на немецком языке',
      'Научитесь вести простые диалоги на бытовые темы',
      'Освоите базовую грамматику немецкого языка',
      'Сможете читать и понимать простые тексты'
    ],
    forWhom: 'Для начинающих',
    modules: [
      { title: 'Begrüßung und Vorstellung / Приветствие и представление', lessons: 5, points: 50, description: 'Вы научитесь правильно приветствовать собеседника, представляться и знакомиться. Освоите основные фразы для первого знакомства.' },
      { title: 'Familie / Семья', lessons: 5, points: 50 },
      { title: 'Tagesablauf / Распорядок дня', lessons: 5, points: 50 },
      { title: 'Zahlen und Uhrzeiten / Числа и время', lessons: 5, points: 50 },
      { title: 'Einkaufen / Покупки', lessons: 5, points: 50 },
      { title: 'Freizeit / Свободное время', lessons: 5, points: 50 },
      { title: 'Reisen / Путешествия', lessons: 5, points: 50 },
      { title: 'Essen und Trinken / Еда и напитки', lessons: 5, points: 50 }
    ],
    price: 'От 6 520 Р',
    flagImage: '/media/Флаг Германии.png',
    lessons: 40,
    tasks: 365,
    tests: 9,
    expertSessions: 4,
    topStudents: [
      { name: 'Анна Петрова', score: 300 },
      { name: 'Михаил Сидоров', score: 270 },
      { name: 'Елена Кузнецова', score: 240 }
    ],
    reviews: [
      { author: 'Ирина К.', role: 'Студент', text: 'Отличный курс для начинающих! Все объясняется понятно и доступно. Особенно понравились интерактивные задания.', stars: 5 },
      { author: 'Дмитрий В.', role: 'Студент', text: 'Начал изучать немецкий с нуля. Курс помог освоить базу быстро и эффективно. Рекомендую всем новичкам!', stars: 5 }
    ],
    similarCourses: [
      { language: 'english', title: 'Английский', duration: '45 часов', level: 'начальный', modules: 3, price: 'От 6 520 Р', flag: '/media/флаг  америки.png' },
      { language: 'spanish', title: 'Испанский', duration: '45 часов', level: 'средний', modules: 3, price: 'От 6 520 Р', flag: '/media/флаг испании.png' }
    ],
    enrollLink: '/german-payment'
  },
  {
    id: 'german-intermediate',
    language: 'german',
    level: 'средний',
    title: 'Немецкий для среднего уровня',
    description: 'О курсе',
    afterCourse: [
      'Сможете вести беседы на профессиональные темы',
      'Уверенно общаться в бизнес-среде на немецком языке',
      'Понимать фильмы и сериалы без субтитров',
      'Читать профессиональную литературу на немецком языке'
    ],
    forWhom: 'Средний уровень',
    modules: [
      { title: 'Beruf und Karriere / Работа и карьера', lessons: 6, points: 60, description: 'Изучите лексику и грамматику, необходимую для общения в профессиональной среде, проведения собеседований и деловых встреч.' },
      { title: 'Reisen und Tourismus / Путешествия и туризм', lessons: 6, points: 60 },
      { title: 'Gesundheit und Medizin / Здоровье и медицина', lessons: 6, points: 60 },
      { title: 'Wirtschaft und Finanzen / Экономика и финансы', lessons: 6, points: 60 },

      { title: 'Kultur und Kunst / Культура и искусство', lessons: 6, points: 60 },
      { title: 'Umwelt und Nachhaltigkeit / Окружающая среда и устойчивое развитие', lessons: 6, points: 60 },
      { title: 'Technologie und Innovation / Технологии и инновации', lessons: 6, points: 60 },
      { title: 'Prüfungsvorbereitung / Подготовка к экзаменам', lessons: 6, points: 60 }
    ],
    price: 'От 8 200 Р',
    flagImage: '/media/Флаг Германии.png',
    lessons: 48,
    tasks: 438,
    tests: 12,
    expertSessions: 6,
    topStudents: [
      { name: 'Анна Соколова', score: 480 },
      { name: 'Михаил Петров', score: 450 },
      { name: 'Елена Кузнецова', score: 420 }
    ],
    reviews: [
      { author: 'Дмитрий К.', role: 'Студент', text: 'Курс помог значительно улучшить мой немецкий язык. Особенно полезными оказались модули по деловому общению и составлению деловой переписки на немецком языке.', stars: 5 },
      { author: 'Ольга М.', role: 'Студент', text: 'Отличный курс для повышения квалификации! Материал хорошо структурирован, преподаватели профессиональные. Теперь могу уверенно общаться с немецкими коллегами.', stars: 5 }
    ],
    similarCourses: [
      { language: 'english', title: 'Английский', duration: '45 часов', level: 'средний', modules: 3, price: 'От 8 200 Р', flag: '/media/флаг  америки.png' },
      { language: 'spanish', title: 'Испанский', duration: '45 часов', level: 'средний', modules: 3, price: 'От 8 200 Р', flag: '/media/флаг испании.png' }
    ],
    enrollLink: '/german-payment'
  },
  {
    id: 'spanish-beginner',
    language: 'spanish',
    level: 'начальный',
    title: 'Испанский для начинающих',
    description: 'О курсе',
    afterCourse: [
      'Вы сможете представиться на испанском языке',
      'Научитесь вести простые диалоги на бытовые темы',
      'Освоите базовую грамматику испанского языка',
      'Сможете читать и понимать простые тексты'
    ],
    forWhom: 'Для начинающих',
    modules: [
      { title: 'Saludos y presentaciones / Приветствия и представления', lessons: 5, points: 50, description: 'Вы научитесь правильно приветствовать собеседника, представляться и знакомиться. Освоите основные фразы для первого знакомства.' },
      { title: 'La familia / Семья', lessons: 5, points: 50 },
      { title: 'Rutina diaria / Повседневная рутина', lessons: 5, points: 50 },
      { title: 'Números y horas / Числа и время', lessons: 5, points: 50 },
      { title: 'Compras / Покупки', lessons: 5, points: 50 },
      { title: 'Tiempo libre / Свободное время', lessons: 5, points: 50 },
      { title: 'Viajes / Путешествия', lessons: 5, points: 50 },
      { title: 'Comida y bebida / Еда и напитки', lessons: 5, points: 50 }
    ],
    price: 'От 6 520 Р',
    flagImage: '/media/флаг испании.png',
    lessons: 40,
    tasks: 365,
    tests: 9,
    expertSessions: 4,
    topStudents: [
      { name: 'Анна Петрова', score: 300 },
      { name: 'Михаил Сидоров', score: 270 },
      { name: 'Елена Кузнецова', score: 240 }
    ],
    reviews: [
      { author: 'Ирина К.', role: 'Студент', text: 'Отличный курс для начинающих! Все объясняется понятно и доступно. Особенно понравились интерактивные задания.', stars: 5 },
      { author: 'Дмитрий В.', role: 'Студент', text: 'Начал изучать испанский с нуля. Курс помог освоить базу быстро и эффективно. Рекомендую всем новичкам!', stars: 5 }
    ],
    similarCourses: [
      { language: 'english', title: 'Английский', duration: '45 часов', level: 'начальный', modules: 3, price: 'От 6 520 Р', flag: '/media/флаг  америки.png' },
      { language: 'german', title: 'Немецкий', duration: '45 часов', level: 'начальный', modules: 3, price: 'От 6 520 Р', flag: '/media/Флаг Германии.png' }
    ],
    enrollLink: '/spanish-payment'
  },
  {
    id: 'spanish-intermediate',
    language: 'spanish',
    level: 'средний',
    title: 'Испанский для среднего уровня',
    description: 'О курсе',
    afterCourse: [
      'Сможете вести свободные беседы на различные темы',
      'Уверенно общаться в профессиональной сфере',
      'Понимать фильмы и сериалы без субтитров',
      'Читать профессиональную литературу на испанском языке'
    ],
    forWhom: 'Средний уровень',
    modules: [
      { title: 'Viajes y turismo / Путешествия и туризм', lessons: 6, points: 60, description: 'Изучите лексику и выражения, связанные с путешествиями, бронированием отелей, ориентированием в городе и культурными достопримечательностями.' },
      { title: 'Comida y cocina / Еда и кулинария', lessons: 6, points: 60 },
      { title: 'Salud y bienestar / Здоровье и благополучие', lessons: 6, points: 60 },
      { title: 'Trabajo y carrera / Работа и карьера', lessons: 6, points: 60 },
      { title: 'Cultura y sociedad / Культура и общество', lessons: 6, points: 60 },
      { title: 'Tecnología y medios / Технологии и СМИ', lessons: 6, points: 60 },
      { title: 'Educación y aprendizaje / Образование и обучение', lessons: 6, points: 60 },
      { title: 'Arte y entretenimiento / Искусство и развлечения', lessons: 6, points: 60 }
    ],
    price: 'От 8 200 Р',
    flagImage: '/media/флаг испании.png',
    lessons: 48,
    tasks: 438,
    tests: 12,
    expertSessions: 6,
    topStudents: [
      { name: 'Мария Гонсалес', score: 480 },
      { name: 'Пабло Рамирес', score: 450 },
      { name: 'Изабель Фернандес', score: 420 }
    ],
    reviews: [
      { author: 'София Р.', role: 'Студент', text: 'Курс помог значительно улучшить мой испанский. Особенно полезными оказались модули по ведению деловых бесед и составлению деловой переписки на испанском языке.', stars: 5 },
      { author: 'Антонио М.', role: 'Студент', text: 'Отличный курс для повышения квалификации! Материал хорошо структурирован, преподаватели профессиональные. Теперь могу свободно общаться с коллегами из Испании.', stars: 5 }
    ],
    similarCourses: [
      { language: 'english', title: 'Английский', duration: '45 часов', level: 'средний', modules: 3, price: 'От 8 200 Р', flag: '/media/флаг  америки.png' },
      { language: 'german', title: 'Немецкий', duration: '45 часов', level: 'средний', modules: 3, price: 'От 8 200 Р', flag: '/media/Флаг Германии.png' }
    ],
    enrollLink: '/spanish-payment'
  }
];