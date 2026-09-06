"""The de sentence grammar: the verbs, the predicates and the shapes.

Ported verbatim from the JavaScript package; see CLAUDE.md.
"""

from randino._internal.parse import words
from randino.sentence.data._types import (
    ModifierGroup,
    PredicateTense,
    SentenceCalendar,
    SentenceFrame,
    SentenceLanguageData,
    SentencePart,
    SentenceTimes,
    StateGroup,
    VerbGroup,
)

DE = SentenceLanguageData(
    space=" ",
    capitalize=True,
    terminators={"statement": ".", "question": "?", "exclamation": "!", "trailing": "…"},
    quotes={"double": ("„", "“"), "single": ("‚", "‘")},
    articles={
        "m": (("", "ein"),),
        "f": (("", "eine"),),
        "n": (("", "ein"),),
    },
    verbs=(
        VerbGroup(
            field="rise",
            subject=("creature", "person"),
            words=words("erwacht erhebt_sich regt_sich"),
            past=PredicateTense(
                words=words("erwachte erhob_sich regte_sich"),
            ),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            words=words("geht wandert eilt reist"),
            past=PredicateTense(
                words=words("ging wanderte eilte reiste"),
            ),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            words=words("kommt erscheint"),
            past=PredicateTense(
                words=words("kam erschien"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_without=("swimmer", "crawler"),
            words=words("läuft springt bummelt trabt spaziert"),
            past=PredicateTense(
                words=words("lief sprang bummelte trabte spazierte"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            words=words("streift"),
            past=PredicateTense(
                words=words("streifte"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_traits=("swimmer",),
            words=words("schwimmt"),
            past=PredicateTense(
                words=words("schwamm"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature",),
            subject_traits=("flier",),
            words=words("fliegt"),
            past=PredicateTense(
                words=words("flog"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_traits=("crawler",),
            words=words("kriecht"),
            past=PredicateTense(
                words=words("kroch"),
            ),
        ),
        VerbGroup(
            field="wait",
            subject=("creature", "person"),
            words=words("wartet zögert verharrt lauscht lauert"),
            past=PredicateTense(
                words=words("wartete zögerte verharrte lauschte lauerte"),
            ),
        ),
        VerbGroup(
            field="rest",
            subject=("creature", "person"),
            words=words("ruht sitzt liegt rastet lehnt"),
            past=PredicateTense(
                words=words("ruhte saß lag rastete lehnte"),
            ),
        ),
        VerbGroup(
            field="sleep",
            subject=("creature", "person"),
            words=words("schläft schlummert dämmert döst"),
            past=PredicateTense(
                words=words("schlief schlummerte dämmerte döste"),
            ),
        ),
        VerbGroup(
            field="express",
            subject=("creature", "person"),
            words=words("lacht weint gähnt seufzt lächelt summt murmelt ruft"),
            past=PredicateTense(
                words=words("lachte weinte gähnte seufzte lächelte summte murmelte rief"),
            ),
        ),
        VerbGroup(
            field="talk",
            subject=("creature", "person"),
            words=words("plaudert redet schwatzt"),
            past=PredicateTense(
                words=words("plauderte redete schwatzte"),
            ),
        ),
        VerbGroup(
            field="play",
            subject=("creature", "person"),
            words=words("tanzt singt tollt spielt hüpft rollt"),
            past=PredicateTense(
                words=words("tanzte sang tollte spielte hüpfte rollte"),
            ),
        ),
        VerbGroup(
            field="search",
            subject=("creature", "person"),
            words=words("sucht stöbert kramt"),
            past=PredicateTense(
                words=words("suchte stöberte kramte"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("place",),
            words=words("verstummt dunkelt erhellt_sich leert_sich füllt_sich belebt_sich"),
            past=PredicateTense(
                words=words("""
                    verstummte dunkelte erhellte_sich leerte_sich füllte_sich belebte_sich
                """),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            words=words("leuchtet fließt vertieft_sich beginnt endet dauert vergeht"),
            past=PredicateTense(
                words=words("leuchtete floss vertiefte_sich begann endete dauerte verging"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("thing", "vehicle"),
            words=words("schwankt glänzt fällt rollt neigt_sich altert"),
            past=PredicateTense(
                words=words("schwankte glänzte fiel rollte neigte_sich alterte"),
            ),
        ),
        VerbGroup(
            field="move",
            subject=("vehicle",),
            words=words("fährt hält rollt wendet gleitet"),
            past=PredicateTense(
                words=words("fuhr hielt rollte wendete glitt"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("idea", "event"),
            words=words("wächst verschwindet bleibt schwebt vertieft_sich"),
            past=PredicateTense(
                words=words("wuchs verschwand blieb schwebte vertiefte_sich"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("plant",),
            words=words("wächst welkt blüht schwankt sprießt"),
            past=PredicateTense(
                words=words("wuchs welkte blühte schwankte spross"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("body",),
            words=words("zittert bebt erstarrt heilt"),
            past=PredicateTense(
                words=words("zitterte bebte erstarrte heilte"),
            ),
        ),
        VerbGroup(
            field="change",
            subject=("edible",),
            words=words("reift kühlt kocht schmilzt verdirbt"),
            past=PredicateTense(
                words=words("reifte kühlte kochte schmolz verdarb"),
            ),
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("groß klein schnell langsam still laut mutig faul sanft klug wild"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="hungry",
            words=words("hungrig ausgehungert"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="full",
            words=words("satt gesättigt"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="tired",
            words=words("müde schläfrig erschöpft"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="rested",
            words=words("ausgeruht frisch munter"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="content",
            words=words("froh zufrieden glücklich heiter"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="restless",
            words=words("gelangweilt neugierig unruhig rastlos"),
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
            words=words("schön fremd neu häufig selten"),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("weit eng ruhig tief dunkel hell fern steil"),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("hart leicht schwer alt glatt klar stabil"),
        ),
        StateGroup(
            subject=("edible",),
            words=words("süß salzig scharf sauer heiß kalt herzhaft"),
        ),
        StateGroup(
            subject=("idea",),
            words=words("einfach deutlich vage ewig flüchtig"),
        ),
        StateGroup(
            subject=("plant",),
            words=words("grün üppig duftend welk"),
        ),
        StateGroup(
            subject=("body",),
            words=words("warm kalt wund steif"),
        ),
    ),
    modifiers=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                mutig lebhaft sanft fleißig faul schüchtern klug jung alt klein groß still fröhlich
                geduldig flink neugierig
            """),
        ),
        ModifierGroup(
            subject=("person",),
            words=words("jung freundlich streng ernst beschäftigt aufrichtig"),
        ),
        ModifierGroup(
            subject=("creature",),
            words=words("flink wild zahm rundlich winzig"),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("food",),
            words=words("""
                süß scharf warm frisch knusprig würzig duftend heiß salzig weich reif lecker
            """),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("drink",),
            words=words("süß warm kalt kühl heiß duftend frisch stark"),
        ),
        ModifierGroup(
            subject=("thing", "vehicle"),
            words=words("""
                alt neu klein groß leicht schwer glänzend glatt klar stabil hübsch kostbar uralt
            """),
        ),
        ModifierGroup(
            subject=("vehicle",),
            words=words("schnell langsam robust"),
        ),
        ModifierGroup(
            subject=("place",),
            words=words("""
                still weit dunkel hell fremd alt gemütlich abgelegen belebt leise fern nah leer
                einsam sonnig
            """),
        ),
        ModifierGroup(
            subject=("plant",),
            words=words("grün üppig duftend jung welk klein zart frisch"),
        ),
        ModifierGroup(
            subject=("idea",),
            words=words("vage alt neu fremd klar kostbar klein seltsam"),
        ),
        ModifierGroup(
            subject=("event",),
            words=words("lang kurz still sonnig trüb laut plötzlich"),
        ),
        ModifierGroup(
            subject=("body",),
            words=words("klein kalt warm schlank kräftig"),
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
            words=words("schön geheimnisvoll fremd neu"),
        ),
    ),
    manners=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                leise langsam schnell sanft plötzlich kaum allein kurz kühn sorgsam eifrig ruhig
                heftig geduldig leicht fröhlich munter schwerfällig gelassen emsig zügig vergnügt
            """),
        ),
        ModifierGroup(
            subject=("plant", "edible", "thing", "vehicle", "place", "event", "idea", "body"),
            words=words("""
                leise langsam sanft plötzlich kaum wieder noch stetig allmählich nach_und_nach
                schwach weiter
            """),
        ),
    ),
    times=SentenceTimes(
        day=words("""
            bei_Tagesanbruch am_frühen_Morgen am_Morgen am_Vormittag am_Mittag am_Nachmittag
            in_der_Dämmerung am_Abend in_der_Nacht spät_in_der_Nacht um_Mitternacht
        """),
        any=words("""
            im_Frühling im_Sommer im_Herbst im_Winter am_Wochenende an_Feiertagen den_ganzen_Tag
        """),
        past=words("gestern letzte_Woche vor_langer_Zeit einst an_jenem_Tag in_jener_Nacht"),
        present=words("heute gerade_eben morgen nächste_Woche"),
        habitual=words("heutzutage manchmal jeden_Tag jede_Nacht"),
    ),
    homes=words("Haus"),
    connectives={
        "additive": words("und"),
        "contrastive": words("aber doch"),
        "causal": words("denn"),
    },
    traits={
        "flier": words("""
            Vogel Schwalbe Spatz Rabe Falke Adler Pfau Papagei Eule Taube Kranich Schwan Ente Gans
            Biene Libelle Zikade Fliege Mücke Fledermaus Reiher Pelikan Drache Phönix Fee Greif
            Pegasus Engel Walküre
        """),
        "swimmer": words("""
            Krokodil Schildkröte Frosch Kröte Fisch Wal Delfin Hai Krake Tintenfisch Garnele Krabbe
            Walross Robbe Pinguin Meerjungfrau Najade
        """),
        "crawler": words("""
            Krokodil Schlange Eidechse Schildkröte Schnecke Ameise Spinne Wurm Krabbe Basilisk
        """),
    },
    interjections=words("""
        oh, ach, na, mensch, oje, sieh_an, wahrhaftig, hui, herrje, du_meine_Güte, nanu,
    """),
    pronouns={"m": ("er",), "f": ("sie",), "n": ("es",)},
    calendar=SentenceCalendar(
        date="D. MMMM Y",
        months=words("""
            Januar Februar März April Mai Juni Juli August September Oktober November Dezember
        """),
        clock="h:mm Uhr",
        years=(2020, 2030),
        copula=StateGroup(
            subject=("event",),
            words=words("ist"),
            past=PredicateTense(
                words=words("war"),
            ),
        ),
    ),
    frames=(
        SentenceFrame(
            (
                SentencePart("date", head="am"),
                SentencePart("verb"),
                SentencePart("subject", modifiable=True),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("clock", head="um"),
                SentencePart("verb"),
                SentencePart("subject", modifiable=True),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("date", head="am", copula="head"),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("clock", head="um", copula="head"),
            ),
            4,
        ),
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
                SentencePart("verb"),
                SentencePart("manner"),
            ),
            22,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("state", head="ist", past_head="war"),
            ),
            20,
        ),
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("verb"),
                SentencePart("subject", modifiable=True),
            ),
            18,
        ),
        SentenceFrame(
            (
                SentencePart("time"),
                SentencePart("verb"),
                SentencePart("subject", modifiable=True),
                SentencePart("manner"),
            ),
            14,
        ),
        SentenceFrame(
            (
                SentencePart("manner"),
                SentencePart("verb"),
                SentencePart("subject", modifiable=True),
            ),
            16,
        ),
        SentenceFrame(
            (
                SentencePart("manner"),
                SentencePart("verb"),
                SentencePart("subject", modifiable=True),
                SentencePart("time"),
            ),
            10,
        ),
        SentenceFrame(
            (
                SentencePart("verb"),
                SentencePart("subject", modifiable=True),
            ),
            26,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("verb"),
                SentencePart("subject", modifiable=True),
                SentencePart("manner"),
            ),
            20,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="ist", past_head="war", modifiable=True),
                SentencePart("state"),
            ),
            18,
            mood="question",
        ),
    ),
)
