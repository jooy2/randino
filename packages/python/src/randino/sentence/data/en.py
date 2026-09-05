"""English sentence grammar: the verbs, the predicates and the shapes."""

from randino._internal.parse import words
from randino.sentence.data._types import (
    SentenceFrame,
    SentenceLanguageData,
    SentencePart,
    StateGroup,
    VerbGroup,
)

EN = SentenceLanguageData(
    space=" ",
    capitalize=True,
    terminators={
        "statement": ".",
        "question": "?",
        "exclamation": "!",
        "trailing": "…",
    },
    # One article, and a definite one. English has three ways to open a noun
    # phrase and only `the` is right for every noun in the pools: `a` is wrong in
    # front of a mass noun and a bare plural is wrong in front of a count one.
    articles={
        "n": (("", "the"),),
    },
    verbs=(
        VerbGroup(
            subject=("creature", "person"),
            words=words("""
                runs walks leaps swims flies crawls returns leaves stops rests sleeps laughs
                cries sings dances yawns hides waits stands sits tumbles wanders passes
                approaches dozes stretches listens
            """),
            forms={
                "question": words(
                    """
                run walk leap swim fly crawl return leave stop rest sleep laugh cry sing
                dance yawn hide wait stand sit tumble wander pass approach doze stretch
                listen
            """
                )
            },
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("edible",),
            words=words("""
                eats drinks chews swallows tastes bakes warms shares
            """),
            forms={"question": words("eat drink chew swallow taste bake warm share")},
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                watches finds carries touches guards chooses moves lifts gathers
            """),
            forms={"question": words("watch find carry touch guard choose move lift gather")},
        ),
        VerbGroup(
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("""
                makes mends cleans sells buys builds paints
            """),
            forms={"question": words("make mend clean sell buy build paint")},
        ),
        VerbGroup(
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("""
                remembers forgets imagines counts describes
            """),
            forms={"question": words("remember forget imagine count describe")},
        ),
        VerbGroup(
            subject=("place", "event"),
            words=words("""
                glows flows darkens brightens deepens quiets fades widens
            """),
            forms={"question": words("glow flow darken brighten deepen quiet fade widen")},
        ),
        VerbGroup(
            subject=("thing", "vehicle"),
            words=words("""
                sways glitters falls rolls tilts ages creaks
            """),
            forms={"question": words("sway glitter fall roll tilt age creak")},
        ),
        VerbGroup(
            subject=("vehicle",),
            words=words("""
                runs stops passes returns departs slides
            """),
            forms={"question": words("run stop pass return depart slide")},
        ),
        VerbGroup(
            subject=("idea", "event"),
            words=words("""
                spreads vanishes remains lingers returns gathers
            """),
            forms={"question": words("spread vanish remain linger return gather")},
        ),
        VerbGroup(
            subject=("plant",),
            words=words("""
                grows wilts blooms sways spreads
            """),
            forms={"question": words("grow wilt bloom sway spread")},
        ),
        VerbGroup(
            subject=("body",),
            words=words("""
                trembles moves stiffens aches heals
            """),
            forms={"question": words("tremble move stiffen ache heal")},
        ),
        VerbGroup(
            subject=("edible",),
            words=words("""
                ripens cools boils melts spoils remains
            """),
            forms={"question": words("ripen cool boil melt spoil remain")},
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                big small quick slow quiet loud brave lazy busy hungry sleepy fierce gentle
                clever restless
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
                beautiful strange new common rare
            """),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("""
                wide narrow calm deep dark bright distant steep
            """),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("""
                hard light heavy old smooth clear sturdy hollow
            """),
        ),
        StateGroup(
            subject=("edible",),
            words=words("""
                sweet salty spicy sour hot cold nutty mild
            """),
        ),
        StateGroup(
            subject=("idea",),
            words=words("""
                simple obvious vague endless fleeting stubborn
            """),
        ),
        StateGroup(
            subject=("plant",),
            words=words("""
                green lush fragrant withered
            """),
        ),
        StateGroup(
            subject=("body",),
            words=words("""
                warm cold sore stiff steady
            """),
        ),
    ),
    manners=words("""
        quietly slowly quickly gently suddenly softly again together alone briefly steadily
        boldly carefully eagerly warily calmly neatly side_by_side once_more
    """),
    times=words("""
        at_dawn in_the_morning at_noon in_the_evening at_night today yesterday tomorrow
        in_spring in_summer in_autumn in_winter on_weekends just_now sometimes every_day at_dusk
        before_long
    """),
    connectives=words("and_then so but meanwhile afterwards still later soon even_so at_last"),
    interjections=words("oh, ah, wow, well, look, goodness, my, indeed, honestly,"),
    pronouns={"n": words("it")},
    # English cannot drop a subject, so a sentence about a person names it again.
    pronounless=("person",),
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
                SentencePart("place", head="in", modifiable=True),
            ),
            14,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("state", head="is"),
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
                SentencePart("place", head="in", modifiable=True),
            ),
            7,
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("place", head="in", modifiable=True),
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
        # English asks with do-support, so the auxiliary stands in front of the
        # subject and the verb falls back to its base form — `Does the lion run?`
        # rather than `Runs the lion?`. `is` moves the same way.
        SentenceFrame(
            (SentencePart("subject", head="does", modifiable=True), SentencePart("verb")),
            20,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="does", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            16,
            mood="question",
        ),
        SentenceFrame(
            (SentencePart("subject", head="is", modifiable=True), SentencePart("state")),
            14,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="does", modifiable=True),
                SentencePart("verb"),
                SentencePart("place", head="in", modifiable=True),
            ),
            12,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="does", modifiable=True),
                SentencePart("verb"),
                SentencePart("manner"),
            ),
            10,
            mood="question",
        ),
    ),
)
