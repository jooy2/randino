"""The ru sentence grammar: the verbs, the predicates and the shapes.

Ported verbatim from the JavaScript package; see CLAUDE.md.
"""

from randino._internal.parse import words
from randino.sentence.data._types import (
    ModifierGroup,
    PredicateTense,
    SentenceFrame,
    SentenceJoin,
    SentenceLanguageData,
    SentencePart,
    SentenceTimes,
    StateGroup,
    VerbGroup,
)

RU = SentenceLanguageData(
    space=" ",
    capitalize=True,
    terminators={"statement": ".", "question": "?", "exclamation": "!", "trailing": "…"},
    quotes={"double": ("«", "»"), "single": ("„", "“")},
    predicate_agrees=True,
    past_agreement={
        "f": (("лся", "лась"), ("л", "ла")),
        "n": (("лся", "лось"), ("л", "ло")),
    },
    verbs=(
        VerbGroup(
            field="rise",
            subject=("creature", "person"),
            words=words("просыпается встаёт поднимается"),
            past=PredicateTense(
                words=words("проснулся встал поднялся"),
            ),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            words=words("направляется удаляется отправляется спешит"),
            past=PredicateTense(
                words=words("направился удалился отправился поспешил"),
            ),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            words=words("возвращается прибывает появляется"),
            past=PredicateTense(
                words=words("вернулся прибыл появился"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_without=("swimmer", "crawler"),
            words=words("бежит прыгает гуляет шагает"),
            past=PredicateTense(
                words=words("бежал прыгал гулял шагал"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            words=words("бродит проходит"),
            past=PredicateTense(
                words=words("бродил проходил"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_traits=("swimmer",),
            words=words("плывёт"),
            past=PredicateTense(
                words=words("плыл"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature",),
            subject_traits=("flier",),
            words=words("летит"),
            past=PredicateTense(
                words=words("летел"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_traits=("crawler",),
            words=words("ползёт"),
            past=PredicateTense(
                words=words("ползал"),
            ),
        ),
        VerbGroup(
            field="wait",
            subject=("creature", "person"),
            words=words("ждёт прячется оглядывается медлит останавливается"),
            past=PredicateTense(
                words=words("ждал прятался оглядывался медлил остановился"),
            ),
        ),
        VerbGroup(
            field="rest",
            subject=("creature", "person"),
            words=words("отдыхает сидит лежит прислоняется устраивается"),
            past=PredicateTense(
                words=words("отдыхал сидел лежал прислонился устроился"),
            ),
        ),
        VerbGroup(
            field="sleep",
            subject=("creature", "person"),
            words=words("спит дремлет засыпает"),
            past=PredicateTense(
                words=words("спал дремал заснул"),
            ),
        ),
        VerbGroup(
            field="express",
            subject=("creature", "person"),
            words=words("смеётся плачет зевает вздыхает улыбается напевает бормочет кричит"),
            past=PredicateTense(
                words=words("смеялся плакал зевал вздыхал улыбался напевал бормотал кричал"),
            ),
        ),
        VerbGroup(
            field="play",
            subject=("creature", "person"),
            words=words("танцует поёт катается играет резвится подпрыгивает"),
            past=PredicateTense(
                words=words("танцевал пел катался играл резвился подпрыгивал"),
            ),
        ),
        VerbGroup(
            field="search",
            subject=("creature", "person"),
            words=words("ищет роется осматривается шарит"),
            past=PredicateTense(
                words=words("искал рылся осматривался шарил"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("place",),
            words=words("успокаивается темнеет светлеет пустеет наполняется оживает"),
            past=PredicateTense(
                words=words("успокоился потемнел посветлел опустел наполнился ожил"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            words=words("""
                светится струится углубляется начинается заканчивается длится проходит
            """),
            past=PredicateTense(
                words=words("светился струился углубился начался закончился длился проходил"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("thing", "vehicle"),
            words=words("качается блестит падает катится клонится стареет"),
            past=PredicateTense(
                words=words("качался блестел упал катился клонился старел"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("vehicle",),
            words=words("едет останавливается проезжает возвращается отправляется скользит"),
            past=PredicateTense(
                words=words("ехал останавливался проезжал возвращался отправлялся скользил"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("idea", "event"),
            words=words("расходится исчезает остаётся плывёт нарастает"),
            past=PredicateTense(
                words=words("расходился исчезал остался плыл нарастал"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("plant",),
            words=words("подрастает вянет расцветает качается тянется"),
            past=PredicateTense(
                words=words("подрастал вял расцветал качался тянулся"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("body",),
            words=words("дрожит движется немеет твердеет"),
            past=PredicateTense(
                words=words("дрожал двигался немел твердел"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("edible",),
            words=words("зреет остывает кипит тает портится"),
            past=PredicateTense(
                words=words("зрел остыл кипел растаял испортился"),
            ),
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                большой маленький быстрый медленный тихий шумный смелый ленивый дикий кроткий умный
            """),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="hungry",
            words=words("голодный"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="full",
            words=words("сытый"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="tired",
            words=words("усталый сонный утомлённый"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="rested",
            words=words("бодрый свежий отдохнувший"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="content",
            words=words("довольный счастливый радостный спокойный"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="restless",
            words=words("скучающий любопытный беспокойный тревожный"),
        ),
        StateGroup(
            subject=(
                "creature",
                "person",
                "plant",
                "edible",
                "thing",
                "vehicle",
                "place",
                "event",
                "idea",
                "body",
            ),
            words=words("красивый странный новый редкий"),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("широкий узкий спокойный глубокий тёмный светлый далёкий крутой"),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("твёрдый лёгкий тяжёлый старый гладкий прозрачный прочный"),
        ),
        StateGroup(
            subject=("edible",),
            words=words("сладкий солёный острый кислый горячий холодный"),
        ),
        StateGroup(
            subject=("idea",),
            words=words("простой ясный смутный вечный мимолётный"),
        ),
        StateGroup(
            subject=("plant",),
            words=words("зелёный пышный душистый увядший"),
        ),
        StateGroup(
            subject=("body",),
            words=words("тёплый холодный больной жёсткий"),
        ),
    ),
    modifiers=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                смелый живой добрый занятой ленивый робкий умный молодой старый маленький большой
                тихий весёлый терпеливый ловкий любопытный
            """),
        ),
        ModifierGroup(
            subject=("person",),
            words=words("молодой добрый строгий серьёзный занятой честный"),
        ),
        ModifierGroup(
            subject=("creature",),
            words=words("быстрый свирепый ручной пухлый крохотный"),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("food",),
            words=words("""
                сладкий острый тёплый свежий хрустящий вкусный душистый горячий солёный мягкий
                спелый сытный
            """),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("drink",),
            words=words("сладкий тёплый холодный прохладный горячий душистый свежий крепкий"),
        ),
        ModifierGroup(
            subject=("thing", "vehicle"),
            words=words("""
                старый новый маленький большой лёгкий тяжёлый блестящий гладкий прозрачный твёрдый
                красивый ценный древний
            """),
        ),
        ModifierGroup(
            subject=("vehicle",),
            words=words("быстрый медленный крепкий"),
        ),
        ModifierGroup(
            subject=("place",),
            words=words("""
                тихий широкий тёмный светлый чужой старый уютный укромный людный безмолвный далёкий
                близкий пустой одинокий солнечный
            """),
        ),
        ModifierGroup(
            subject=("plant",),
            words=words("""
                зелёный пышный душистый молодой увядший высокий маленький нежный свежий
            """),
        ),
        ModifierGroup(
            subject=("idea",),
            words=words("смутный старый новый чужой ясный ценный маленький странный"),
        ),
        ModifierGroup(
            subject=("event",),
            words=words("долгий короткий тихий солнечный пасмурный шумный внезапный"),
        ),
        ModifierGroup(
            subject=("body",),
            words=words("маленький холодный тёплый тонкий крепкий"),
        ),
        ModifierGroup(
            subject=(
                "creature",
                "person",
                "plant",
                "thing",
                "vehicle",
                "place",
                "event",
                "idea",
                "body",
            ),
            words=words("красивый таинственный чужой новый"),
        ),
    ),
    manners=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                тихо медленно быстро мягко вдруг едва одиноко ненадолго ровно смело осторожно жадно
                спокойно весело терпеливо легко чётко бодро лениво упрямо охотно шумно неспешно
            """),
        ),
        ModifierGroup(
            subject=("plant", "edible", "thing", "vehicle", "place", "event", "idea", "body"),
            words=words("""
                тихо медленно мягко вдруг едва снова ещё мерно постепенно слабо понемногу всё_ещё
                чуть
            """),
        ),
    ),
    times=SentenceTimes(
        day=words("""
            на_рассвете ранним_утром утром до_полудня в_полдень днём после_полудня в_сумерках
            вечером ночью поздней_ночью в_полночь
        """),
        any=words("весной летом осенью зимой в_выходные в_праздники весь_день"),
        past=words("вчера на_прошлой_неделе давно однажды в_тот_день в_ту_ночь"),
        present=words("сегодня только_что завтра на_следующей_неделе"),
        habitual=words("нынче иногда каждый_день каждую_ночь"),
    ),
    homes=words("дом"),
    join=SentenceJoin(word="и"),
    connectives={
        "additive": words("и_потом кроме_того"),
        "temporal": words("затем наконец потом тем_временем вскоре"),
        "contrastive": words("но однако а зато всё_же"),
        "causal": words("поэтому в_итоге значит"),
    },
    traits={
        "flier": words("""
            птица ласточка воробей ворон сокол орёл павлин попугай сова голубь журавль лебедь утка
            гусь бабочка пчела стрекоза цикада муха комар летучая_мышь цапля пеликан дракон феникс
            фея грифон пегас ангел валькирия
        """),
        "swimmer": words("""
            крокодил черепаха лягушка жаба рыба кит дельфин акула осьминог кальмар креветка краб
            морж тюлень пингвин русалка кракен наяда
        """),
        "crawler": words("крокодил змея ящерица черепаха улитка муравей паук червь краб василиск"),
    },
    interjections=words("ах, ох, эх, ух, боже, гляди, право, ой, ух_ты, батюшки, надо_же, эй,"),
    pronouns={"m": ("он",), "f": ("она",), "n": ("оно",)},
    frames=(
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            26,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("manner"),
                SentencePart("verb"),
            ),
            20,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("state", past_head="был"),
            ),
            20,
        ),
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            18,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("manner"),
            ),
            16,
        ),
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("subject", modifiable=True),
                SentencePart("manner"),
                SentencePart("verb"),
            ),
            12,
        ),
        SentenceFrame(
            (
                SentencePart("manner"),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            14,
        ),
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("subject", modifiable=True),
                SentencePart("state", past_head="был"),
            ),
            12,
        ),
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("manner"),
            ),
            10,
        ),
    ),
)
