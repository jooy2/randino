"""Italian sentence grammar: the verbs, the predicates and the shapes."""

from randino._internal.parse import words
from randino.sentence.data._types import (
    SentenceFrame,
    SentenceLanguageData,
    SentenceNumeral,
    SentencePart,
    StateGroup,
    VerbGroup,
)

IT = SentenceLanguageData(
    space=" ",
    capitalize=True,
    terminators={
        "statement": ".",
        "question": "?",
        "exclamation": "!",
        "trailing": "…",
    },
    quotes={"double": ("«", "»"), "single": ("“", "”")},
    # The definite article, which Italian picks by gender and by the sound the
    # noun opens on: `l'` before a vowel, `lo` before an s plus a consonant, and
    # `il` for everything else. The elided form carries its own boundary.
    articles={
        "m": (
            ("a", "l'"),
            ("e", "l'"),
            ("i", "l'"),
            ("o", "l'"),
            ("u", "l'"),
            ("gn", "lo"),
            ("pn", "lo"),
            ("ps", "lo"),
            ("x", "lo"),
            ("y", "lo"),
            ("z", "lo"),
            ("sb", "lo"),
            ("sc", "lo"),
            ("sd", "lo"),
            ("sf", "lo"),
            ("sg", "lo"),
            ("sl", "lo"),
            ("sm", "lo"),
            ("sn", "lo"),
            ("sp", "lo"),
            ("sq", "lo"),
            ("sr", "lo"),
            ("st", "lo"),
            ("sv", "lo"),
            ("", "il"),
        ),
        "f": (
            ("a", "l'"),
            ("e", "l'"),
            ("i", "l'"),
            ("o", "l'"),
            ("u", "l'"),
            ("", "la"),
        ),
    },
    predicate_agrees=True,
    verbs=(
        VerbGroup(
            subject=("creature", "person"),
            words=words("""
                corre cammina salta nuota vola striscia torna parte si_ferma riposa dorme ride
                piange canta balla si_nasconde aspetta si_alza si_siede rotola vaga passa
                si_avvicina ascolta
            """),
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("edible",),
            words=words("""
                mangia beve mastica assaggia cuoce scalda
            """),
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                guarda cerca raccoglie porta tocca custodisce sceglie sposta raduna
            """),
        ),
        VerbGroup(
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("""
                costruisce ripara pulisce vende compra dipinge
            """),
        ),
        VerbGroup(
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("""
                ricorda dimentica immagina conta
            """),
        ),
        VerbGroup(
            subject=("place", "event"),
            words=words("""
                brilla scorre si_oscura si_schiarisce si_approfondisce si_calma
            """),
        ),
        VerbGroup(
            subject=("thing", "vehicle"),
            words=words("""
                oscilla luccica cade rotola si_inclina invecchia
            """),
        ),
        VerbGroup(
            subject=("vehicle",),
            words=words("""
                viaggia si_ferma passa torna parte scivola
            """),
        ),
        VerbGroup(
            subject=("idea", "event"),
            words=words("""
                si_diffonde svanisce rimane fluttua cresce
            """),
        ),
        VerbGroup(
            subject=("plant",),
            words=words("""
                cresce appassisce fiorisce oscilla germoglia
            """),
        ),
        VerbGroup(
            subject=("body",),
            words=words("""
                trema si_muove si_intorpidisce guarisce
            """),
        ),
        VerbGroup(
            subject=("edible",),
            words=words("""
                matura si_raffredda bolle si_scioglie si_guasta
            """),
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                grande piccolo veloce lento silenzioso rumoroso coraggioso pigro affamato
                assonnato feroce mite arguto sveglio
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
                bello strano nuovo comune raro
            """),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("""
                ampio stretto tranquillo profondo scuro chiaro lontano ripido
            """),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("""
                duro leggero pesante vecchio liscio trasparente robusto
            """),
        ),
        StateGroup(
            subject=("edible",),
            words=words("""
                dolce salato piccante aspro caldo freddo saporito
            """),
        ),
        StateGroup(
            subject=("idea",),
            words=words("""
                semplice evidente vago eterno fugace
            """),
        ),
        StateGroup(
            subject=("plant",),
            words=words("""
                verde rigoglioso profumato appassito
            """),
        ),
        StateGroup(
            subject=("body",),
            words=words("""
                caldo freddo dolente rigido
            """),
        ),
    ),
    manners=words("""
        in_silenzio lentamente rapidamente dolcemente improvvisamente appena di_nuovo insieme
        da_solo ancora brevemente costantemente audacemente con_cura avidamente
    """),
    times=words("""
        all'alba al_mattino a_mezzogiorno di_sera di_notte oggi ieri domani in_primavera
        in_estate in_autunno in_inverno nel_fine_settimana poco_fa a_volte ogni_giorno
        al_tramonto
    """),
    connectives=words("e_poi ma allora inoltre, tuttavia, dopo infine intanto,"),
    interjections=words("oh, ah, ehi, caspita, mamma_mia, guarda, davvero,"),
    numeral=SentenceNumeral(
        order="before",
        counters={},
        count=(2, 12),
        currency="euro",
        amounts=(100, 500, 1000, 5000, 12000, 25000, 50000, 100000),
        group=".",
    ),
    # Pro-drop, the same as Spanish: `esso` exists and nobody writes it.
    pronouns={"n": ("",)},
    frames=(
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            20,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            18,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("place", head="in", modifiable=True, bare=True),
            ),
            14,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("state", head="è"),
            ),
            12,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("manner"),
            ),
            10,
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            8,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
                SentencePart("place", head="in", modifiable=True, bare=True),
            ),
            7,
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("place", head="in", modifiable=True, bare=True),
            ),
            6,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
                SentencePart("manner"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("money"),
            ),
            6,
        ),
    ),
)
