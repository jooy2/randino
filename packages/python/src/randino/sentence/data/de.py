"""German sentence grammar: the verbs, the predicates and the shapes."""

from randino._internal.parse import words
from randino.sentence.data._types import (
    SentenceFrame,
    SentenceLanguageData,
    SentencePart,
    StateGroup,
    VerbGroup,
)

DE = SentenceLanguageData(
    space=" ",
    capitalize=True,
    terminator=".",
    # The indefinite article, and it is what makes the modifiers come out right:
    # after `ein` a German adjective takes the same endings it takes with no
    # article at all — `ein blauer Wal`, `eine blaue Katze`, `ein blaues Haus` —
    # which is exactly what `word/data`'s agreement already writes.
    articles={
        "m": (("", "ein"),),
        "f": (("", "eine"),),
        "n": (("", "ein"),),
    },
    verbs=(
        VerbGroup(
            subject=("creature", "person"),
            words=words("""
                läuft geht springt schwimmt fliegt kriecht ruht schläft lacht weint singt tanzt
                wartet steht sitzt rollt wandert lauscht zögert eilt
            """),
        ),
        VerbGroup(
            subject=("place", "event"),
            words=words("""
                leuchtet fließt dunkelt erhellt vertieft verstummt
            """),
        ),
        VerbGroup(
            subject=("thing", "vehicle"),
            words=words("""
                schwankt glänzt fällt rollt neigt altert
            """),
        ),
        VerbGroup(
            subject=("vehicle",),
            words=words("""
                fährt hält rollt wendet gleitet
            """),
        ),
        VerbGroup(
            subject=("idea", "event"),
            words=words("""
                wächst verschwindet bleibt schwebt vertieft
            """),
        ),
        VerbGroup(
            subject=("plant",),
            words=words("""
                wächst welkt blüht schwankt sprießt
            """),
        ),
        VerbGroup(
            subject=("body",),
            words=words("""
                zittert bebt erstarrt heilt
            """),
        ),
        VerbGroup(
            subject=("edible",),
            words=words("""
                reift kühlt kocht schmilzt verdirbt
            """),
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                groß klein schnell langsam still laut mutig faul müde hungrig sanft klug wild
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
                schön fremd neu häufig selten
            """),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("""
                weit eng ruhig tief dunkel hell fern steil
            """),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("""
                hart leicht schwer alt glatt klar stabil
            """),
        ),
        StateGroup(
            subject=("edible",),
            words=words("""
                süß salzig scharf sauer heiß kalt herzhaft
            """),
        ),
        StateGroup(
            subject=("idea",),
            words=words("""
                einfach deutlich vage ewig flüchtig
            """),
        ),
        StateGroup(
            subject=("plant",),
            words=words("""
                grün üppig duftend welk
            """),
        ),
        StateGroup(
            subject=("body",),
            words=words("""
                warm kalt wund steif
            """),
        ),
    ),
    manners=words("""
        leise langsam schnell sanft plötzlich kaum wieder gemeinsam allein noch kurz stetig kühn
        sorgsam eifrig
    """),
    times=words("""
        bei_Tagesanbruch am_Morgen am_Mittag am_Abend in_der_Nacht heute gestern morgen
        im_Frühling im_Sommer im_Herbst im_Winter am_Wochenende gerade_eben manchmal jeden_Tag
        in_der_Dämmerung
    """),
    # German declares the fewest shapes here, and both reasons are its cases. An
    # object would be accusative and a place dative, and each changes the article
    # and the modifier ending together. What is left is the nominative, and the
    # rule German never breaks: the verb stands second, so a shape that opens on a
    # time puts the subject behind it.
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
                SentencePart("verb"),
                SentencePart("manner"),
            ),
            22,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("state", head="ist"),
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
    ),
)
