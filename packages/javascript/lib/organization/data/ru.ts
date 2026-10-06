import { words } from '../../_internal/parse.js';
import type { OrganizationLanguageData } from './types.js';

export const RU: OrganizationLanguageData = {
	// The single words a Russian firm, club or kindergarten is named after. What
	// is left out is every name a well-known company or institution already
	// carries, alone or with a word for its business behind it (Альфа, Вектор,
	// Атлант, Алмаз, Полюс, Эталон, Гарант, Кристалл).
	stems: words(`
		Меридиан Восход Рассвет Радуга Заря Альтаир Вега Кедр Волна Изумруд Гранит
		Магистраль Перспектива Импульс Сфера Партнёр Форвард Альянс Феникс Ника Норд
		Арктика Сокол Орбита Спектр Вершина Исток Родник Лотос Фортуна Пульсар
		Галактика Стимул Ресурс Континент Омега Дельта Сигма Тайга Колос
	`),
	syn: {
		kind: 'syllable',
		onset: words('б в г д з к л м н п р с т ст тр кр гр'),
		vowel: words('а е и о у а о я'),
		coda: ['', '', ...words('н р л с т к м')],
		minSyllables: 2,
		maxSyllables: 3
	},
	// A school, a polyclinic or a fire station is known by its number.
	numbers: [1, 150],
	// The pieces a Russian company name joins to its own with a hyphen:
	// `Меридиан-Строй`, `Восход-Агро`.
	industries: {
		tech: words('Софт Технологии Системы Электроника Телеком'),
		manufacturing: words('Пром Маш Металл Хим Пласт'),
		food: words('Продукт Агро Хлеб Молоко Фуд'),
		retail: words('Трейд Торг Маркет Снаб Опт'),
		finance: words('Инвест Капитал Финанс Страх Кредит'),
		construction: words('Строй Девелопмент Монтаж Проект Дом'),
		logistics: words('Транс Логистик Экспресс Авто Карго'),
		media: words('Медиа Пресс Студио Принт Реклама'),
		health: words('Фарм Мед Био Медтехника Здоровье'),
		energy: words('Энерго Нефть Газ Солар Электро')
	},
	generic: words('Групп Холдинг Плюс Центр Сервис'),
	templates: {
		company: ['{stem}-{industry}'],
		school: [
			'Детский сад № {number}',
			'Детский сад «{stem}»',
			'Школа № {number}',
			'Гимназия № {number}',
			'Лицей № {number}',
			'Колледж «{stem}»',
			'Частная школа «{stem}»'
		],
		government: [
			'Пожарная часть № {number}',
			'Отдел полиции № {number}',
			'Налоговая инспекция № {number}',
			'Участковая избирательная комиссия № {number}'
		],
		public: [
			'Городская больница № {number}',
			'Городская поликлиника № {number}',
			'Библиотека № {number}',
			'Дом культуры «{stem}»',
			'Спорткомплекс «{stem}»'
		],
		nonprofit: [
			'Фонд «{stem}»',
			'Благотворительный фонд «{stem}»',
			'Ассоциация «{stem}»',
			'Клуб «{stem}»',
			'Спортивный клуб «{stem}»',
			'Общественная организация «{stem}»'
		]
	},
	legalForms: ['ООО «{name}»', 'АО «{name}»', 'ПАО «{name}»']
};
