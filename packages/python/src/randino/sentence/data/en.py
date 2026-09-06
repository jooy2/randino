"""The en sentence grammar: the verbs, the predicates and the shapes.

Ported verbatim from the JavaScript package; see CLAUDE.md.
"""

from randino._internal.parse import words
from randino.sentence.data._types import (
    ModifierGroup,
    PredicateTense,
    SentenceCalendar,
    SentenceFrame,
    SentenceJoin,
    SentenceLanguageData,
    SentenceNumeral,
    SentencePart,
    SentenceTimes,
    StateGroup,
    VerbGroup,
)

EN = SentenceLanguageData(
    space=" ",
    capitalize=True,
    terminators={"statement": ".", "question": "?", "exclamation": "!", "trailing": "…"},
    quotes={"double": ("“", "”"), "single": ("‘", "’")},
    articles={
        "n": (("", "the"),),
    },
    verbs=(
        VerbGroup(
            field="rise",
            subject=("creature", "person"),
            words=words("wakes gets_up rises stirs"),
            forms={
                "question": words("wake get_up rise stir"),
            },
            past=PredicateTense(
                words=words("woke got_up rose stirred"),
                forms={
                    "question": words("wake get_up rise stir"),
                },
            ),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            requires="destination",
            words=words("goes heads runs hurries walks wanders climbs"),
            forms={
                "question": words("go head run hurry walk wander climb"),
            },
            past=PredicateTense(
                words=words("went headed ran hurried walked wandered climbed"),
                forms={
                    "question": words("go head run hurry walk wander climb"),
                },
            ),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            words=words("leaves sets_off departs"),
            forms={
                "question": words("leave set_off depart"),
            },
            past=PredicateTense(
                words=words("left set_off departed"),
                forms={
                    "question": words("leave set_off depart"),
                },
            ),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            requires="destination",
            words=words("returns comes_back gets_back heads_back"),
            forms={
                "question": words("return come_back get_back head_back"),
            },
            past=PredicateTense(
                words=words("returned came_back got_back headed_back"),
                forms={
                    "question": words("return come_back get_back head_back"),
                },
            ),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            words=words("arrives comes_home returns"),
            forms={
                "question": words("arrive come_home return"),
            },
            past=PredicateTense(
                words=words("arrived came_home returned"),
                forms={
                    "question": words("arrive come_home return"),
                },
            ),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            words=words("""
                runs walks leaps swims flies crawls wanders passes strolls roams paces
            """),
            forms={
                "question": words("run walk leap swim fly crawl wander pass stroll roam pace"),
            },
            past=PredicateTense(
                words=words("""
                    ran walked leapt swam flew crawled wandered passed strolled roamed paced
                """),
                forms={
                    "question": words("run walk leap swim fly crawl wander pass stroll roam pace"),
                },
            ),
        ),
        VerbGroup(
            field="wait",
            subject=("creature", "person"),
            words=words("waits hides lingers looks_around hesitates pauses stops"),
            forms={
                "question": words("wait hide linger look_around hesitate pause stop"),
            },
            past=PredicateTense(
                words=words("waited hid lingered looked_around hesitated paused stopped"),
                forms={
                    "question": words("wait hide linger look_around hesitate pause stop"),
                },
            ),
        ),
        VerbGroup(
            field="rest",
            subject=("creature", "person"),
            words=words("rests sits lies_down leans curls_up stretches_out"),
            forms={
                "question": words("rest sit lie_down lean curl_up stretch_out"),
            },
            past=PredicateTense(
                words=words("rested sat lay_down leaned curled_up stretched_out"),
                forms={
                    "question": words("rest sit lie_down lean curl_up stretch_out"),
                },
            ),
        ),
        VerbGroup(
            field="sleep",
            subject=("creature", "person"),
            words=words("sleeps dozes falls_asleep nods_off"),
            forms={
                "question": words("sleep doze fall_asleep nod_off"),
            },
            past=PredicateTense(
                words=words("slept dozed fell_asleep nodded_off"),
                forms={
                    "question": words("sleep doze fall_asleep nod_off"),
                },
            ),
        ),
        VerbGroup(
            field="express",
            subject=("creature", "person"),
            words=words("laughs cries yawns sighs smiles hums mutters shouts"),
            forms={
                "question": words("laugh cry yawn sigh smile hum mutter shout"),
            },
            past=PredicateTense(
                words=words("laughed cried yawned sighed smiled hummed muttered shouted"),
                forms={
                    "question": words("laugh cry yawn sigh smile hum mutter shout"),
                },
            ),
        ),
        VerbGroup(
            field="play",
            subject=("creature", "person"),
            words=words("dances sings tumbles frolics plays bounces skips"),
            forms={
                "question": words("dance sing tumble frolic play bounce skip"),
            },
            past=PredicateTense(
                words=words("danced sang tumbled frolicked played bounced skipped"),
                forms={
                    "question": words("dance sing tumble frolic play bounce skip"),
                },
            ),
        ),
        VerbGroup(
            field="think",
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("remembers forgets imagines counts recalls misses wonders_about"),
            forms={
                "question": words("remember forget imagine count recall miss wonder_about"),
            },
            past=PredicateTense(
                words=words("""
                    remembered forgot imagined counted recalled missed wondered_about
                """),
                forms={
                    "question": words("remember forget imagine count recall miss wonder_about"),
                },
            ),
        ),
        VerbGroup(
            field="look",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("watches looks_at studies examines admires touches strokes"),
            forms={
                "question": words("watch look_at study examine admire touch stroke"),
            },
            past=PredicateTense(
                words=words("watched looked_at studied examined admired touched stroked"),
                forms={
                    "question": words("watch look_at study examine admire touch stroke"),
                },
            ),
        ),
        VerbGroup(
            field="search",
            subject=("creature", "person"),
            words=words("searches looks_around rummages hunts_around"),
            forms={
                "question": words("search look_around rummage hunt_around"),
            },
            past=PredicateTense(
                words=words("searched looked_around rummaged hunted_around"),
                forms={
                    "question": words("search look_around rummage hunt_around"),
                },
            ),
        ),
        VerbGroup(
            field="find",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("finds discovers spots picks_up comes_across"),
            forms={
                "question": words("find discover spot pick_up come_across"),
            },
            past=PredicateTense(
                words=words("found discovered spotted picked_up came_across"),
                forms={
                    "question": words("find discover spot pick_up come_across"),
                },
            ),
        ),
        VerbGroup(
            field="take",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("takes picks grabs gathers chooses gets"),
            forms={
                "question": words("take pick grab gather choose get"),
            },
            past=PredicateTense(
                words=words("took picked grabbed gathered chose got"),
                forms={
                    "question": words("take pick grab gather choose get"),
                },
            ),
        ),
        VerbGroup(
            field="carry",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("carries brings hauls lugs"),
            forms={
                "question": words("carry bring haul lug"),
            },
            past=PredicateTense(
                words=words("carried brought hauled lugged"),
                forms={
                    "question": words("carry bring haul lug"),
                },
            ),
        ),
        VerbGroup(
            field="hide",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("hides tucks_away stores puts_away keeps buries"),
            forms={
                "question": words("hide tuck_away store put_away keep bury"),
            },
            past=PredicateTense(
                words=words("hid tucked_away stored put_away kept buried"),
                forms={
                    "question": words("hide tuck_away store put_away keep bury"),
                },
            ),
        ),
        VerbGroup(
            field="make",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("makes builds crafts carves paints weaves shapes"),
            forms={
                "question": words("make build craft carve paint weave shape"),
            },
            past=PredicateTense(
                words=words("made built crafted carved painted wove shaped"),
                forms={
                    "question": words("make build craft carve paint weave shape"),
                },
            ),
        ),
        VerbGroup(
            field="tend",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("mends cleans polishes fixes tidies oils"),
            forms={
                "question": words("mend clean polish fix tidy oil"),
            },
            past=PredicateTense(
                words=words("mended cleaned polished fixed tidied oiled"),
                forms={
                    "question": words("mend clean polish fix tidy oil"),
                },
            ),
        ),
        VerbGroup(
            field="sell",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("sells hands_over trades_away offers"),
            forms={
                "question": words("sell hand_over trade_away offer"),
            },
            past=PredicateTense(
                words=words("sold handed_over traded_away offered"),
                forms={
                    "question": words("sell hand_over trade_away offer"),
                },
            ),
        ),
        VerbGroup(
            field="buy",
            subject=("person",),
            object=("thing", "vehicle", "edible"),
            words=words("buys purchases picks_up orders"),
            forms={
                "question": words("buy purchase pick_up order"),
            },
            past=PredicateTense(
                words=words("bought purchased picked_up ordered"),
                forms={
                    "question": words("buy purchase pick_up order"),
                },
            ),
        ),
        VerbGroup(
            field="cook",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("bakes warms cooks slices roasts serves"),
            forms={
                "question": words("bake warm cook slice roast serve"),
            },
            past=PredicateTense(
                words=words("baked warmed cooked sliced roasted served"),
                forms={
                    "question": words("bake warm cook slice roast serve"),
                },
            ),
        ),
        VerbGroup(
            field="eat",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("eats chews swallows tastes nibbles devours"),
            forms={
                "question": words("eat chew swallow taste nibble devour"),
            },
            past=PredicateTense(
                words=words("ate chewed swallowed tasted nibbled devoured"),
                forms={
                    "question": words("eat chew swallow taste nibble devour"),
                },
            ),
        ),
        VerbGroup(
            field="drink",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("drink",),
            words=words("drinks sips gulps savors"),
            forms={
                "question": words("drink sip gulp savor"),
            },
            past=PredicateTense(
                words=words("drank sipped gulped savored"),
                forms={
                    "question": words("drink sip gulp savor"),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("place",),
            words=words("quiets darkens brightens empties fills_up glows"),
            forms={
                "question": words("quiet darken brighten empty fill_up glow"),
            },
            past=PredicateTense(
                words=words("quieted darkened brightened emptied filled_up glowed"),
                forms={
                    "question": words("quiet darken brighten empty fill_up glow"),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            words=words("glows flows fades deepens begins ends passes"),
            forms={
                "question": words("glow flow fade deepen begin end pass"),
            },
            past=PredicateTense(
                words=words("glowed flowed faded deepened began ended passed"),
                forms={
                    "question": words("glow flow fade deepen begin end pass"),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("thing", "vehicle"),
            words=words("sways glitters falls rolls tilts ages creaks"),
            forms={
                "question": words("sway glitter fall roll tilt age creak"),
            },
            past=PredicateTense(
                words=words("swayed glittered fell rolled tilted aged creaked"),
                forms={
                    "question": words("sway glitter fall roll tilt age creak"),
                },
            ),
        ),
        VerbGroup(
            field="move",
            subject=("vehicle",),
            words=words("runs stops passes returns departs slides"),
            forms={
                "question": words("run stop pass return depart slide"),
            },
            past=PredicateTense(
                words=words("ran stopped passed returned departed slid"),
                forms={
                    "question": words("run stop pass return depart slide"),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("idea", "event"),
            words=words("spreads vanishes remains lingers returns gathers"),
            forms={
                "question": words("spread vanish remain linger return gather"),
            },
            past=PredicateTense(
                words=words("spread vanished remained lingered returned gathered"),
                forms={
                    "question": words("spread vanish remain linger return gather"),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("plant",),
            words=words("grows wilts blooms sways spreads"),
            forms={
                "question": words("grow wilt bloom sway spread"),
            },
            past=PredicateTense(
                words=words("grew wilted bloomed swayed spread"),
                forms={
                    "question": words("grow wilt bloom sway spread"),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("body",),
            words=words("trembles moves stiffens aches heals"),
            forms={
                "question": words("tremble move stiffen ache heal"),
            },
            past=PredicateTense(
                words=words("trembled moved stiffened ached healed"),
                forms={
                    "question": words("tremble move stiffen ache heal"),
                },
            ),
        ),
        VerbGroup(
            field="change",
            subject=("edible",),
            words=words("ripens cools boils melts spoils remains"),
            forms={
                "question": words("ripen cool boil melt spoil remain"),
            },
            past=PredicateTense(
                words=words("ripened cooled boiled melted spoiled remained"),
                forms={
                    "question": words("ripen cool boil melt spoil remain"),
                },
            ),
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                big small quick slow quiet loud brave lazy busy fierce gentle clever restless
            """),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="hungry",
            words=words("hungry starving peckish"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="full",
            words=words("full satisfied"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="tired",
            words=words("tired sleepy weary drowsy"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="rested",
            words=words("refreshed rested lively"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="content",
            words=words("happy glad content pleased cheerful"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="restless",
            words=words("bored curious uneasy"),
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
            words=words("beautiful strange new common rare"),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("wide narrow calm deep dark bright distant steep"),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("hard light heavy old smooth clear sturdy hollow"),
        ),
        StateGroup(
            subject=("edible",),
            words=words("sweet salty spicy sour hot cold nutty mild"),
        ),
        StateGroup(
            subject=("idea",),
            words=words("simple obvious vague endless fleeting stubborn"),
        ),
        StateGroup(
            subject=("plant",),
            words=words("green lush fragrant withered"),
        ),
        StateGroup(
            subject=("body",),
            words=words("warm cold sore stiff steady"),
        ),
    ),
    modifiers=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                brave lively gentle busy lazy shy clever young old small big quiet cheerful patient
                nimble curious
            """),
        ),
        ModifierGroup(
            subject=("person",),
            words=words("young kind strict earnest weary friendly"),
        ),
        ModifierGroup(
            subject=("creature",),
            words=words("swift fierce tame plump little"),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("food",),
            words=words("""
                sweet spicy warm fresh crisp savory fragrant hot salty soft ripe tasty
            """),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("drink",),
            words=words("sweet warm cold cool hot fragrant fresh strong"),
        ),
        ModifierGroup(
            subject=("thing", "vehicle"),
            words=words("""
                old new small big light heavy shiny smooth clear sturdy pretty precious ancient
            """),
        ),
        ModifierGroup(
            subject=("vehicle",),
            words=words("fast slow rattling"),
        ),
        ModifierGroup(
            subject=("place",),
            words=words("""
                quiet wide dark bright strange old cozy secluded busy silent remote distant nearby
                empty lonely sunny
            """),
        ),
        ModifierGroup(
            subject=("plant",),
            words=words("green lush fragrant young withered tall small tender fresh"),
        ),
        ModifierGroup(
            subject=("idea",),
            words=words("faint old new strange clear precious small odd vague"),
        ),
        ModifierGroup(
            subject=("event",),
            words=words("long short quiet sunny cloudy noisy sudden lazy"),
        ),
        ModifierGroup(
            subject=("body",),
            words=words("small cold warm slender sturdy tender"),
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
            words=words("beautiful mysterious strange new"),
        ),
    ),
    manners=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                quietly slowly quickly gently suddenly softly alone briefly boldly carefully eagerly
                warily calmly neatly warmly firmly patiently lightly wearily cheerfully idly
                restlessly gladly keenly briskly happily
            """),
        ),
        ModifierGroup(
            subject=("plant", "edible", "thing", "vehicle", "place", "event", "idea", "body"),
            words=words("""
                quietly slowly gently suddenly softly again steadily still slightly faintly evenly
                gradually little_by_little
            """),
        ),
    ),
    times=SentenceTimes(
        day=words("""
            at_dawn in_the_early_morning in_the_morning at_midday in_the_afternoon at_dusk
            in_the_evening at_night late_at_night at_midnight
        """),
        any=words("in_spring in_summer in_autumn in_winter on_weekends on_holidays all_day"),
        past=words("yesterday last_week long_ago once that_day the_night_before"),
        present=words("today just_now tomorrow next_week"),
        habitual=words("these_days sometimes every_day every_night"),
    ),
    homes=words("house cottage"),
    join=SentenceJoin(word="and"),
    connectives={
        "additive": words("and_then besides"),
        "temporal": words("meanwhile afterwards later soon at_last before_long"),
        "contrastive": words("but still however yet even_so then_again all_the_same even_then"),
        "causal": words("so therefore in_the_end"),
    },
    interjections=words("""
        oh, ah, wow, well, look, goodness, my, indeed, honestly, gosh, hey, whoa, dear_me,
        good_grief, alas,
    """),
    pronouns={"m": ("he",), "f": ("she",), "n": ("it",)},
    pronounless=("person",),
    numeral=SentenceNumeral(
        order="before",
        counters={},
        count=(2, 12),
        currency="dollars",
        amounts=(100, 500, 1000, 5000, 12000, 25000, 50000, 100000),
        group=",",
        gap=" ",
    ),
    calendar=SentenceCalendar(
        date="MMMM D, Y",
        months=words("""
            January February March April May June July August September October November December
        """),
        clock="h:mm",
        years=(2020, 2030),
        copula=StateGroup(
            subject=("event",),
            words=words("is"),
            past=PredicateTense(
                words=words("was"),
            ),
        ),
    ),
    frames=(
        SentenceFrame(
            (
                SentencePart("date", head="on", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("clock", head="at", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("date", head="on", copula="head"),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("clock", head="at", copula="head"),
            ),
            4,
        ),
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
                SentencePart("verb"),
                SentencePart("destination", head="to", modifiable=True),
            ),
            10,
            fields=("go", "arrive"),
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="to", modifiable=True),
            ),
            5,
            fields=("go", "arrive"),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="to", modifiable=True),
                SentencePart("manner"),
            ),
            4,
            fields=("go", "arrive"),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("state", head="is", past_head="was"),
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
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("manner"),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
                SentencePart("place", head="in", modifiable=True),
            ),
            3,
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="does", past_head="did", modifiable=True),
                SentencePart("verb"),
            ),
            20,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="does", past_head="did", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            16,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="is", past_head="was", modifiable=True),
                SentencePart("state"),
            ),
            14,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="does", past_head="did", modifiable=True),
                SentencePart("verb"),
                SentencePart("place", head="in", modifiable=True),
            ),
            12,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="does", past_head="did", modifiable=True),
                SentencePart("verb"),
                SentencePart("manner"),
            ),
            10,
            mood="question",
        ),
        SentenceFrame(
            (
                SentencePart("subject", head="does", past_head="did", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="to", modifiable=True),
            ),
            6,
            mood="question",
            fields=("go", "arrive"),
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
