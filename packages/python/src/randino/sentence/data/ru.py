"""Russian sentence grammar: the verbs, the predicates and the shapes."""

from randino._internal.parse import words
from randino.sentence.data._types import (
    SentenceFrame,
    SentenceLanguageData,
    SentencePart,
    StateGroup,
    VerbGroup,
)

RU = SentenceLanguageData(
    space=" ",
    capitalize=True,
    terminator=".",
    predicate_agrees=True,
    verbs=(
        VerbGroup(
            subject=("creature", "person"),
            words=words("""
                бежит идёт прыгает плывёт летит ползёт возвращается уходит останавливается
                отдыхает спит смеётся плачет поёт танцует прячется ждёт стоит сидит катится
                бродит проходит приближается слушает
            """),
        ),
        VerbGroup(
            subject=("place", "event"),
            words=words("""
                светится течёт темнеет светлеет углубляется затихает
            """),
        ),
        VerbGroup(
            subject=("thing", "vehicle"),
            words=words("""
                качается блестит падает катится клонится стареет
            """),
        ),
        VerbGroup(
            subject=("vehicle",),
            words=words("""
                едет останавливается проезжает возвращается отправляется скользит
            """),
        ),
        VerbGroup(
            subject=("idea", "event"),
            words=words("""
                расходится исчезает остаётся плывёт нарастает
            """),
        ),
        VerbGroup(
            subject=("plant",),
            words=words("""
                растёт вянет цветёт качается тянется
            """),
        ),
        VerbGroup(
            subject=("body",),
            words=words("""
                дрожит движется немеет твердеет
            """),
        ),
        VerbGroup(
            subject=("edible",),
            words=words("""
                зреет остывает кипит тает портится
            """),
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                большой маленький быстрый медленный тихий шумный смелый ленивый голодный сонный
                дикий кроткий умный
            """),
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
            words=words("""
                красивый странный новый редкий
            """),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("""
                широкий узкий спокойный глубокий тёмный светлый далёкий крутой
            """),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("""
                твёрдый лёгкий тяжёлый старый гладкий прозрачный прочный
            """),
        ),
        StateGroup(
            subject=("edible",),
            words=words("""
                сладкий солёный острый кислый горячий холодный
            """),
        ),
        StateGroup(
            subject=("idea",),
            words=words("""
                простой ясный смутный вечный мимолётный
            """),
        ),
        StateGroup(
            subject=("plant",),
            words=words("""
                зелёный пышный душистый увядший
            """),
        ),
        StateGroup(
            subject=("body",),
            words=words("""
                тёплый холодный больной жёсткий
            """),
        ),
    ),
    manners=words("""
        тихо медленно быстро мягко вдруг едва снова вместе одиноко ещё ненадолго ровно смело
        осторожно жадно
    """),
    times=words("""
        на_рассвете утром днём вечером ночью сегодня вчера завтра весной летом осенью зимой
        в_выходные только_что иногда каждый_день в_сумерках
    """),
    # Nominative only, which is why there is neither an object nor a place here: a
    # Russian noun changes its own ending for both, and the endings are the noun's
    # own rather than a rule the pools could carry.
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
                SentencePart("state"),
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
    ),
)
