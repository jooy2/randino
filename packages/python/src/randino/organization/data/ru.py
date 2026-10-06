"""Russian organizations: the stems, the words for a business and the shapes."""

from randino._internal.parse import words
from randino.organization.data._types import (
    OrganizationLanguageData,
    SyllableOrganizationSynthesis,
)

RU = OrganizationLanguageData(
    stems=words("""
        Меридиан Восход Рассвет Радуга Заря Альтаир Вега Кедр Волна Изумруд Гранит
        Магистраль Перспектива Импульс Сфера Партнёр Форвард Альянс Феникс Ника Норд Арктика
        Сокол Орбита Спектр Вершина Исток Родник Лотос Фортуна Пульсар Галактика Стимул
        Ресурс Континент Омега Дельта Сигма Тайга Колос
    """),
    syn=SyllableOrganizationSynthesis(
        onset=words("б в г д з к л м н п р с т ст тр кр гр"),
        vowel=words("а е и о у а о я"),
        coda=("", "", *words("н р л с т к м")),
        min_syllables=2,
        max_syllables=3,
    ),
    numbers=(1, 150),
    industries={
        "tech": words("Софт Технологии Системы Электроника Телеком"),
        "manufacturing": words("Пром Маш Металл Хим Пласт"),
        "food": words("Продукт Агро Хлеб Молоко Фуд"),
        "retail": words("Трейд Торг Маркет Снаб Опт"),
        "finance": words("Инвест Капитал Финанс Страх Кредит"),
        "construction": words("Строй Девелопмент Монтаж Проект Дом"),
        "logistics": words("Транс Логистик Экспресс Авто Карго"),
        "media": words("Медиа Пресс Студио Принт Реклама"),
        "health": words("Фарм Мед Био Медтехника Здоровье"),
        "energy": words("Энерго Нефть Газ Солар Электро"),
    },
    generic=words("Групп Холдинг Плюс Центр Сервис"),
    templates={
        "company": ("{stem}-{industry}",),
        "nonprofit": (
            "Фонд «{stem}»",
            "Благотворительный фонд «{stem}»",
            "Ассоциация «{stem}»",
            "Клуб «{stem}»",
            "Спортивный клуб «{stem}»",
            "Общественная организация «{stem}»",
        ),
        "school": (
            "Детский сад № {number}",
            "Детский сад «{stem}»",
            "Школа № {number}",
            "Гимназия № {number}",
            "Лицей № {number}",
            "Колледж «{stem}»",
            "Частная школа «{stem}»",
        ),
        "government": (
            "Пожарная часть № {number}",
            "Отдел полиции № {number}",
            "Налоговая инспекция № {number}",
            "Участковая избирательная комиссия № {number}",
        ),
        "public": (
            "Городская больница № {number}",
            "Городская поликлиника № {number}",
            "Библиотека № {number}",
            "Дом культуры «{stem}»",
            "Спорткомплекс «{stem}»",
        ),
    },
    legal_forms=(
        "ООО «{name}»",
        "АО «{name}»",
        "ПАО «{name}»",
    ),
)
