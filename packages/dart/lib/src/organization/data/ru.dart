// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/organization/data/types.dart';
import 'package:randino/src/types.dart';

/// The Russian organization dataset.
final OrganizationLanguageData ru = OrganizationLanguageData(
  stems: words(r'''
    Меридиан Восход Рассвет Радуга Заря Альтаир Вега Кедр Волна Изумруд Гранит
    Магистраль Перспектива Импульс Сфера Партнёр Форвард Альянс Феникс Ника Норд Арктика
    Сокол Орбита Спектр Вершина Исток Родник Лотос Фортуна Пульсар Галактика Стимул
    Ресурс Континент Омега Дельта Сигма Тайга Колос
  '''),
  syn: OrganizationSyllableSynthesis(
    onset: words(r'б в г д з к л м н п р с т ст тр кр гр'),
    vowel: words(r'а е и о у а о я'),
    coda: ['', '', ...words(r'н р л с т к м')],
    minSyllables: 2,
    maxSyllables: 3,
  ),
  numbers: (1, 150),
  industries: <OrganizationIndustry, List<String>>{
    OrganizationIndustry.tech: words(r'Софт Технологии Системы Электроника Телеком'),
    OrganizationIndustry.manufacturing: words(r'Пром Маш Металл Хим Пласт'),
    OrganizationIndustry.food: words(r'Продукт Агро Хлеб Молоко Фуд'),
    OrganizationIndustry.retail: words(r'Трейд Торг Маркет Снаб Опт'),
    OrganizationIndustry.finance: words(r'Инвест Капитал Финанс Страх Кредит'),
    OrganizationIndustry.construction: words(r'Строй Девелопмент Монтаж Проект Дом'),
    OrganizationIndustry.logistics: words(r'Транс Логистик Экспресс Авто Карго'),
    OrganizationIndustry.media: words(r'Медиа Пресс Студио Принт Реклама'),
    OrganizationIndustry.health: words(r'Фарм Мед Био Медтехника Здоровье'),
    OrganizationIndustry.energy: words(r'Энерго Нефть Газ Солар Электро'),
  },
  generic: words(r'Групп Холдинг Плюс Центр Сервис'),
  templates: <OrganizationType, List<String>>{
    OrganizationType.company: <String>['{stem}-{industry}'],
    OrganizationType.nonprofit: <String>[
      'Фонд «{stem}»',
      'Благотворительный фонд «{stem}»',
      'Ассоциация «{stem}»',
      'Клуб «{stem}»',
      'Спортивный клуб «{stem}»',
      'Общественная организация «{stem}»',
    ],
    OrganizationType.school: <String>[
      'Детский сад № {number}',
      'Детский сад «{stem}»',
      'Школа № {number}',
      'Гимназия № {number}',
      'Лицей № {number}',
      'Колледж «{stem}»',
      'Частная школа «{stem}»',
    ],
    OrganizationType.government: <String>[
      'Пожарная часть № {number}',
      'Отдел полиции № {number}',
      'Налоговая инспекция № {number}',
      'Участковая избирательная комиссия № {number}',
    ],
    OrganizationType.public: <String>[
      'Городская больница № {number}',
      'Городская поликлиника № {number}',
      'Библиотека № {number}',
      'Дом культуры «{stem}»',
      'Спорткомплекс «{stem}»',
    ],
  },
  legalForms: <String>['ООО «{name}»', 'АО «{name}»', 'ПАО «{name}»'],
);
