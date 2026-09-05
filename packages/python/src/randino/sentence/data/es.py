"""Spanish sentence grammar: the verbs, the predicates and the shapes."""

from randino._internal.parse import words
from randino.sentence.data._types import (
    SentenceFrame,
    SentenceLanguageData,
    SentencePart,
    StateGroup,
    VerbGroup,
)

ES = SentenceLanguageData(
    space=" ",
    capitalize=True,
    terminators={
        "statement": ".",
        "question": "?",
        "exclamation": "!",
        "trailing": "…",
    },
    # The one language here that marks a question and an exclamation at both
    # ends, which is why the openers exist at all.
    openers={"question": "¿", "exclamation": "¡"},
    # The definite article, by the noun's gender. The feminine entries in front of
    # the default are the nouns that begin on a stressed a- and take `el` for the
    # sound of it; the two that only start the same way are listed above them, so
    # the first match is still the right one.
    articles={
        "m": (("", "el"),),
        "f": (
            ("aguamarina", "la"),
            ("aguanieve", "la"),
            ("agua", "el"),
            ("alma", "el"),
            ("ancla", "el"),
            ("hacha", "el"),
            ("águila", "el"),
            ("", "la"),
        ),
    },
    predicate_agrees=True,
    verbs=(
        VerbGroup(
            subject=("creature", "person"),
            words=words("""
                corre camina salta nada vuela repta regresa parte se_detiene descansa duerme ríe
                llora canta baila se_esconde espera se_levanta se_sienta rueda vaga pasa
                se_acerca escucha
            """),
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("edible",),
            words=words("""
                come bebe mastica prueba hornea calienta
            """),
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                mira busca recoge lleva toca guarda elige mueve reúne
            """),
        ),
        VerbGroup(
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("""
                hace repara limpia vende compra construye
            """),
        ),
        VerbGroup(
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("""
                recuerda olvida imagina cuenta
            """),
        ),
        VerbGroup(
            subject=("place", "event"),
            words=words("""
                brilla fluye oscurece aclara se_ahonda se_calma
            """),
        ),
        VerbGroup(
            subject=("thing", "vehicle"),
            words=words("""
                se_mece reluce cae rueda se_inclina envejece
            """),
        ),
        VerbGroup(
            subject=("vehicle",),
            words=words("""
                circula se_detiene pasa regresa parte resbala
            """),
        ),
        VerbGroup(
            subject=("idea", "event"),
            words=words("""
                se_extiende desaparece permanece flota se_ahonda
            """),
        ),
        VerbGroup(
            subject=("plant",),
            words=words("""
                crece se_marchita florece se_mece brota
            """),
        ),
        VerbGroup(
            subject=("body",),
            words=words("""
                tiembla se_mueve se_entumece sana
            """),
        ),
        VerbGroup(
            subject=("edible",),
            words=words("""
                madura se_enfría hierve se_derrite se_estropea
            """),
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                grande pequeño rápido lento silencioso ruidoso valiente perezoso ocupado
                hambriento soñoliento fiero manso listo
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
                hermoso extraño nuevo común raro
            """),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("""
                ancho estrecho tranquilo profundo oscuro claro lejano empinado
            """),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("""
                duro ligero pesado viejo liso transparente robusto
            """),
        ),
        StateGroup(
            subject=("edible",),
            words=words("""
                dulce salado picante ácido caliente frío sabroso
            """),
        ),
        StateGroup(
            subject=("idea",),
            words=words("""
                sencillo evidente vago eterno fugaz
            """),
        ),
        StateGroup(
            subject=("plant",),
            words=words("""
                verde frondoso fragante marchito
            """),
        ),
        StateGroup(
            subject=("body",),
            words=words("""
                cálido frío dolorido rígido
            """),
        ),
    ),
    manners=words("""
        en_silencio despacio rápidamente suavemente de_repente apenas otra_vez juntos a_solas
        todavía brevemente firmemente audazmente con_cuidado ansiosamente de_nuevo
    """),
    times=words("""
        al_amanecer por_la_mañana al_mediodía por_la_tarde por_la_noche hoy ayer mañana
        en_primavera en_verano en_otoño en_invierno los_fines_de_semana hace_poco a_veces
        cada_día al_anochecer
    """),
    # Written with the comma the ones that need one take.
    connectives=words("y_luego pero entonces además, sin_embargo, después por_fin mientras_tanto,"),
    interjections=words("ay, oh, vaya, caramba, madre_mía, mira, desde_luego,"),
    # Spanish carries its subject in the verb ending, so a second sentence about
    # the same thing writes no pronoun at all.
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
                SentencePart("place", head="en", modifiable=True),
            ),
            14,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("state", head="es"),
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
                SentencePart("place", head="en", modifiable=True),
            ),
            7,
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("place", head="en", modifiable=True),
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
    ),
)
