"""`rand_sentence`: the shapes, the grammar around them, and the words inside them.

The return value is random, so what is asserted is the properties every sentence has to
have, over a sample large enough that a broken option cannot pass by luck.
"""

import re

from randino import (
    RAND_COUNT_MAX,
    RAND_SENTENCE_COUNT_MAX,
    WORD_LANGUAGES,
    WORD_THEMES,
    RandRealism,
    SentenceDetail,
    SentenceQuote,
    SentenceShape,
    SentenceSlot,
    SentenceStyle,
    SentenceType,
    WordLanguage,
    WordTheme,
    name_length_range,
    rand_sentence,
    sentence_length_range,
)
from randino.name.data import NAME_DATA

# The datasets are internal, but a sentence is only as good as the grammar behind
# it — these checks read the pools a sentence is allowed to draw from.
from randino.sentence._generator import shape_of
from randino.sentence.data import SENTENCE_DATA, THEME_CLASS
from randino.sentence.data._types import PredicateForm, PredicateForms, SentenceMark
from randino.word._generator import agree
from randino.word.data import WORD_DATA
from randino.word.data._types import WordGender, WordPool

SAMPLE = 60

SCRIPT: dict[WordLanguage, re.Pattern[str]] = {
    "en": re.compile(r"^[A-Za-z0-9' ,.?!…“”‘’]+$"),
    "ko": re.compile(r"^[가-힣0-9 ,.?!…“”‘’]+$"),
    "ja": re.compile(r"^[々぀-ヿ一-鿿0-9,。、？！…「」『』]+$"),
    "zh": re.compile(r"^[々一-鿿0-9,。，？！…“”‘’]+$"),
    "vi": re.compile(r"^[a-zA-ZÀ-ỹ0-9 ,.?!…“”‘’]+$"),
    "es": re.compile(r"^[a-zA-ZÀ-ÿ0-9 ,.?!…¿¡«»“”]+$"),
    "it": re.compile(r"^[a-zA-ZÀ-ÿ0-9' ,.?!…«»“”]+$"),
    "de": re.compile(r"^[a-zA-ZÀ-ÿß0-9 ,.?!…„“‚‘]+$"),
    "ru": re.compile(r"^[Ѐ-ӿ0-9 ,.?!…«»„“]+$"),
}

SHAPES: tuple[SentenceShape, ...] = ("simple", "detailed", "complex")


def plain(language: WordLanguage, word: str) -> str:
    """A word as a sentence writes it — English stores its pools capitalized."""
    return word[:1].lower() + word[1:] if WORD_DATA[language].capitalize else word


def inflected(language: WordLanguage, pool: tuple[str, ...]) -> list[str]:
    """Every form a modifier can take beside a noun of the language."""
    data = WORD_DATA[language]
    genders: tuple[WordGender, ...] = tuple(data.agreement or ())

    return [*pool, *(agree(data, word, gender) for gender in genders for word in pool)]


STYLES: tuple[SentenceStyle, ...] = ("plain", "casual", "polite", "formal")

STYLE_FORMS: tuple[PredicateForm, ...] = ("casual", "polite", "formal", "formalQuestion")
"""The form keys a level reaches for.

`question` and `exclamation` are 해라체's own and say nothing about whether a language
has levels at all — English declares `question` and has none.
"""

FORM_CHAIN: dict[SentenceStyle, dict[SentenceMark, tuple[PredicateForm, ...]]] = {
    "plain": {
        "statement": (),
        "trailing": (),
        "question": ("question",),
        "exclamation": ("exclamation",),
    },
    "casual": {
        "statement": ("casual",),
        "trailing": ("casual",),
        "question": ("casual", "question"),
        "exclamation": ("casual", "exclamation"),
    },
    "polite": {
        "statement": ("polite",),
        "trailing": ("polite",),
        "question": ("polite", "question"),
        "exclamation": ("polite", "exclamation"),
    },
    "formal": {
        "statement": ("formal", "polite"),
        "trailing": ("formal", "polite"),
        "question": ("formalQuestion", "formal", "polite", "question"),
        "exclamation": ("formal", "polite", "exclamation"),
    },
}
"""The generator's own chain, written out again so a change has to be made twice."""


def endings(pool: WordPool) -> list[str]:
    """Every ending an entry lists: `달리니|달리나` is one entry and two endings."""
    return [ending for entry in pool for ending in entry.split("|")]


def forms_of(
    words: WordPool, forms: PredicateForms, style: SentenceStyle, mark: SentenceMark
) -> list[str]:
    """The predicates one group can write at one level and mood."""
    for key in FORM_CHAIN[style][mark]:
        pool = forms.get(key)

        if pool:
            return endings(pool)

    return list(words)


def every_form(words: WordPool, forms: PredicateForms) -> list[str]:
    """Every predicate a group can write at any level and any mood."""
    return [*words, *(ending for pool in forms.values() for ending in endings(pool))]


def pool_for(language: WordLanguage, slot: SentenceSlot) -> set[str]:
    """Every word the language may put in a phrase of `slot`."""
    data = SENTENCE_DATA[language]

    if slot == "verb":
        return {word for group in data.verbs for word in every_form(group.words, group.forms)}

    if slot == "state":
        states = tuple(
            word for group in data.states for word in every_form(group.words, group.forms)
        )

        return set(inflected(language, states) if data.predicate_agrees else states)

    if slot == "manner":
        return set(data.manners)

    if slot == "time":
        return set(data.times)

    return {
        plain(language, word) for theme in WORD_THEMES for word in WORD_DATA[language].nouns[theme]
    }


def modifiers_for(language: WordLanguage) -> set[str]:
    """The modifiers a noun phrase may carry, in every form they can take."""
    return {plain(language, word) for word in inflected(language, WORD_DATA[language].adjectives)}


def articles_for(language: WordLanguage) -> list[str]:
    """Every article the language can open a noun phrase with."""
    articles = SENTENCE_DATA[language].articles

    if articles is None:
        return []

    return [article for rules in articles.values() for _, article in rules]


def explains(language: WordLanguage, phrase: str) -> bool:
    """Whether a noun phrase is exactly what the generator is allowed to build.

    An article, a noun, and at most one modifier on the side the language puts it. Split
    by hand rather than on whitespace, because a pool entry can hold a space of its own
    — Vietnamese `hơi thở` is one word — and Japanese and Chinese write no space at all.
    """
    space = SENTENCE_DATA[language].space
    nouns = pool_for(language, "subject")
    modifiers = modifiers_for(language)
    rest = phrase

    for article in articles_for(language):
        opening = article if article.endswith("'") else article + space

        if rest.startswith(opening):
            rest = rest[len(opening) :]
            break

    if rest in nouns:
        return True

    for at in range(1, len(rest)):
        if space and rest[at : at + len(space)] != space:
            continue

        left = rest[:at]
        right = rest[at + len(space) :]

        if (left in modifiers and right in nouns) or (left in nouns and right in modifiers):
            return True

    return False


def test_rand_sentence_returns_one_sentence_by_default() -> None:
    sentences = rand_sentence()

    assert len(sentences) == 1
    assert sentences[0]


def test_rand_sentence_returns_exactly_count_sentences() -> None:
    assert len(rand_sentence(count=25)) == 25
    assert rand_sentence(count=0) == []
    assert rand_sentence(count=-10) == []
    assert len(rand_sentence(count=RAND_COUNT_MAX + 500)) == RAND_COUNT_MAX


def test_every_language_writes_sentences_in_its_own_script_and_closes_them() -> None:
    for language in WORD_LANGUAGES:
        terminator = SENTENCE_DATA[language].terminators["statement"]

        realisms: tuple[RandRealism, ...] = ("real", "invented")

        for realism in realisms:
            for sentence in rand_sentence(
                type="statement",
                include_name=False,
                language=language,
                realism=realism,
                count=SAMPLE,
            ):
                assert SCRIPT[language].match(sentence), f"{language}: {sentence}"
                assert sentence.endswith(terminator), f"{language}: {sentence}"
                assert "  " not in sentence, f"{language}: {sentence}"
                assert " ." not in sentence, f"{language}: {sentence}"


def test_a_language_with_articles_writes_one_invented_word_or_not() -> None:
    """Spanish and Italian write an article in front of an invented noun too.

    An invented noun is in no pool, so it has no entry in `noun_gender` — and both
    declare their articles under `m` and `f` alone, with no `n` to fall back to. Both
    wrote no article at all in front of one until the gender was read off the ending.
    """
    for language in WORD_LANGUAGES:
        articles = SENTENCE_DATA[language].articles

        if articles is None:
            continue

        written = {article for rules in articles.values() for _, article in rules}

        for realism in ("real", "invented"):
            for sentence in rand_sentence(
                type="statement",
                include_name=False,
                language=language,
                realism=realism,
                count=SAMPLE,
            ):
                carries = any(
                    # An elided article runs into the word behind it — `l'orso`.
                    article in sentence.lower()
                    if article.endswith("'")
                    else re.search(rf"(^|\s){article}\s", sentence, re.IGNORECASE)
                    for article in written
                )

                assert carries, f"{language} {realism}: {sentence}"


def test_a_language_that_capitalizes_opens_its_sentences_on_a_capital() -> None:
    for language in WORD_LANGUAGES:
        if not SENTENCE_DATA[language].capitalize:
            continue

        for sentence in rand_sentence(language=language, count=SAMPLE):
            assert sentence[0] == sentence[0].upper(), sentence


def test_the_mixed_language_uses_every_language_it_knows() -> None:
    used = set()

    for detail in rand_sentence(output="detail", count=600):
        assert SCRIPT[detail.language].match(detail.sentence), detail.sentence
        used.add(detail.language)

    assert len(used) == len(WORD_LANGUAGES)


def test_every_phrase_is_written_out_of_the_languages_own_pools() -> None:
    for language in WORD_LANGUAGES:
        predicates: tuple[SentenceSlot, ...] = ("verb", "state", "manner", "time")
        fixed: dict[SentenceSlot, set[str]] = {
            slot: pool_for(language, slot) for slot in predicates
        }

        for detail in rand_sentence(
            type="statement", include_name=False, output="detail", language=language, count=200
        ):
            assert len(detail.phrases) == len(detail.slots), detail.sentence

            for index, phrase in enumerate(detail.phrases):
                slot = detail.slots[index]
                # Only the opening phrase can have been capitalized, and it is put
                # back the way the pools hold it before being looked up.
                written = phrase[:1].lower() + phrase[1:] if index == 0 else phrase
                pool = fixed.get(slot)

                if pool is not None:
                    assert written in pool or phrase in pool, (
                        f"{language}: {phrase} is not in the {slot} pools ({detail.sentence})"
                    )

                    continue

                if slot == "money":
                    assert is_money(language, phrase), (
                        f"{language}: {phrase} is not an amount ({detail.sentence})"
                    )

                    continue

                # A counted phrase is a noun phrase with a number on it, so the number
                # comes off before the pools are asked about the rest.
                assert explains(language, strip_count(language, written)), (
                    f"{language}: {phrase} is not a {slot} the pools can build ({detail.sentence})"
                )


def test_the_phrases_appear_in_the_sentence_in_order() -> None:
    for language in WORD_LANGUAGES:
        for detail in rand_sentence(output="detail", language=language, count=120):
            at = 0

            for phrase in detail.phrases:
                found = detail.sentence.find(phrase, at)

                assert found >= at, f"{language}: {phrase} in {detail.sentence}"
                at = found + len(phrase)


def test_a_sentence_has_one_predicate_and_it_is_a_verb_or_a_state() -> None:
    for language in WORD_LANGUAGES:
        for detail in rand_sentence(output="detail", language=language, count=120):
            predicates = [slot for slot in detail.slots if slot in ("verb", "state")]

            assert len(predicates) == 1, detail.sentence
            # A shape that counts what it is about has no separate subject: the
            # counted phrase is what the verb agrees with.
            assert "subject" in detail.slots or "quantity" in detail.slots, detail.sentence


def test_a_verb_only_takes_the_subject_and_object_its_group_allows() -> None:
    for language in WORD_LANGUAGES:
        data = SENTENCE_DATA[language]

        for detail in rand_sentence(
            type="statement", include_name=False, output="detail", language=language, count=200
        ):
            if "verb" not in detail.slots or detail.theme is None:
                continue

            at = detail.slots.index("verb")
            # A quantity beside a subject is an object with a number on it, and an
            # amount is an object of the class money belongs to.
            transitive = (
                "object" in detail.slots
                or "money" in detail.slots
                or ("quantity" in detail.slots and "subject" in detail.slots)
            )
            # A verb can sit in more than one group, so the sentence is right when
            # one of its groups accounts for it.
            groups = [
                group
                for group in data.verbs
                if detail.phrases[at] in every_form(group.words, group.forms)
                and (group.object is not None) == transitive
            ]

            assert groups, f"{language}: {detail.sentence}"
            assert any(THEME_CLASS[detail.theme] in group.subject for group in groups), (
                f"{language}: {detail.theme} cannot be the subject ({detail.sentence})"
            )


def test_korean_picks_the_particle_its_noun_asks_for() -> None:
    alternating = {"가": "이", "를": "을", "는": "은"}

    for detail in rand_sentence(output="detail", language="ko", count=300):
        for phrase in detail.phrases:
            ends = detail.sentence.find(phrase) + len(phrase)

            if ends >= len(detail.sentence):
                continue

            after = detail.sentence[ends]
            last = ord(phrase[-1])
            coda = 0xAC00 <= last <= 0xD7A3 and (last - 0xAC00) % 28 != 0

            if after in alternating:
                assert not coda, f"{phrase}{after} needs {alternating[after]}"

            if after in alternating.values() and after != "은":
                assert coda, f"{phrase}{after} needs the other form"


def test_theme_decides_what_the_subject_is_about() -> None:
    for theme in WORD_THEMES:
        for detail in rand_sentence(
            type="statement",
            include_name=False,
            output="detail",
            language="ko",
            theme=theme,
            count=20,
        ):
            assert detail.theme == theme, detail.sentence


def test_shape_decides_how_much_the_sentence_says() -> None:
    for language in WORD_LANGUAGES:
        for shape in SHAPES:
            assert any(shape_of(frame) == shape for frame in SENTENCE_DATA[language].frames), (
                f"{language} has no {shape} shape"
            )

            for detail in rand_sentence(
                type="statement",
                include_name=False,
                output="detail",
                language=language,
                shape=shape,
                count=30,
            ):
                parts = len(detail.phrases)
                actual = "simple" if parts <= 2 else "detailed" if parts == 3 else "complex"

                assert actual == shape, f"{language}: {detail.sentence}"


def test_slots_decides_what_the_sentence_carries_beside_its_subject() -> None:
    wanted: tuple[SentenceSlot, ...] = ("object", "place", "time", "manner", "state")

    for slot in wanted:
        for language in WORD_LANGUAGES:
            able = any(
                part.slot == slot
                for frame in SENTENCE_DATA[language].frames
                for part in frame.parts
            )

            if not able:
                continue

            for detail in rand_sentence(
                type="statement",
                include_name=False,
                output="detail",
                language=language,
                slots=slot,
                count=30,
            ):
                assert slot in detail.slots, f"{language} {slot}: {detail.sentence}"

    for detail in rand_sentence(
        type="statement", include_name=False, output="detail", slots=(), count=120
    ):
        assert len(detail.phrases) <= 2, detail.sentence


def test_include_puts_every_word_it_was_given_into_every_sentence() -> None:
    cases: list[tuple[WordLanguage, list[str]]] = [
        ("ko", ["사자"]),
        ("ko", ["사자", "조용히"]),
        ("ko", ["멋진", "사자", "조용히"]),
        ("en", ["lion"]),
        ("en", ["brave", "lion", "quietly"]),
        ("ja", ["猫"]),
        ("zh", ["狮子"]),
        ("es", ["gato"]),
        ("de", ["Wolf"]),
        ("ru", ["кит"]),
        ("it", ["gatto"]),
        ("vi", ["mèo"]),
    ]

    for language, include in cases:
        for sentence in rand_sentence(
            type="statement", include_name=False, language=language, include=include, count=40
        ):
            for word in include:
                assert word.lower() in sentence.lower(), (
                    f"{language}: {word} missing from {sentence}"
                )


def test_include_takes_a_word_the_pools_have_never_heard_of() -> None:
    for sentence in rand_sentence(language="ko", include="깜냥이", count=30):
        assert "깜냥이" in sentence


def test_a_required_word_holds_its_place_against_a_name_and_a_counter() -> None:
    """`include` names a word the sentence has to contain, and a name cannot take it."""
    # `include_name` narrows the subject to a person and writes a name where one goes,
    # and for a while that included writing over a word the caller had required — a
    # sentence that does not contain what `include` asked for.
    for sentence in rand_sentence(language="ko", include="깜냥이", include_name=True, count=60):
        assert "깜냥이" in sentence, sentence

    # And the word keeps its own theme when the shape counts it. A counted shape has no
    # `subject` part — its quantity is the subject — so looking for one regardless left
    # `사과` with the counter a person takes.
    for sentence in rand_sentence(
        language="ko", include="사과", include_name=True, slots="quantity", count=60
    ):
        assert not re.search(r"사과\s*\d+명", sentence), f"{sentence} counts an apple in people"


def test_a_name_in_a_sentence_is_as_long_as_the_languages_names_are() -> None:
    """A name is drawn unsteered, so it is the length the language's names are."""
    # `rand_name` stretches a CJK given name to fill a range longer than its real ones,
    # which is a deliberate ask when a caller makes it. A sentence is not making it:
    # handing the name generator the room a phrase happens to have produced eleven
    # characters of invented Chinese where a name goes.
    for language in ("ko", "ja", "zh"):
        low, high = name_length_range(language, False)

        for detail in rand_sentence(
            language=language, include_name=True, sentences=2, count=120, output="detail"
        ):
            for name in detail.names:
                assert low <= len(name) <= high, (
                    f"{language}: '{name}' is {len(name)}, outside {low}-{high}"
                )


def test_include_picks_the_language_the_word_is_written_in() -> None:
    for detail in rand_sentence(output="detail", include="고양이", count=40):
        assert detail.language == "ko", detail.sentence
        assert "고양이" in detail.sentence


def test_a_narrow_range_is_met_anywhere_in_the_language_s_own_range() -> None:
    """A narrow window, swept across what the language is observed to produce.

    The wide ranges below are met by most shapes the language has. A narrow one is what
    caught the budget measuring a phrase against every pool of the language rather than
    the one it draws from. Swept across the observed lengths rather than across
    `sentence_length_range`, whose ends are the shortest and longest sentence the shapes
    could spell — the very top of it needs the longest word of every pool at once, which
    is a fit no draw is going to find.

    A miss is still possible and the assertion says so: German's shortest shape tops out
    around seventeen characters and the same shape with a modifier starts above
    twenty-two, so a window in between is one the language has almost nothing to put in.
    What has to hold is that a miss is rare and small. The bug this replaced missed by
    six characters one time in forty.
    """
    misses: list[str] = []
    drawn = 0

    # Swept over one kind of sentence rather than over what the defaults draw. A named
    # sentence is much shorter than an unnamed one — `Yvonne` where a noun phrase writes
    # `die schlanke Wolke` — and a question is a different shape again, so the middle
    # 90% of the mixture is a band that neither of them covers on its own.
    for language in WORD_LANGUAGES:
        seen = sorted(
            len(sentence)
            for sentence in rand_sentence(
                language=language, type="statement", include_name=False, count=400
            )
        )
        lowest = seen[int(len(seen) * 0.05)]
        highest = seen[int(len(seen) * 0.95)]
        step = max(2, (highest - lowest) // 8)

        for min_length in range(lowest, highest - 4, step):
            max_length = min(highest, min_length + 5)

            for sentence in rand_sentence(
                language=language,
                type="statement",
                include_name=False,
                min_length=min_length,
                max_length=max_length,
                count=30,
            ):
                drawn += 1
                over = len(sentence) - max_length
                distance = over if over > 0 else min_length - len(sentence)

                if distance <= 0:
                    continue

                miss = f"{language} {min_length}-{max_length}: {sentence} ({len(sentence)})"
                misses.append(miss)

                # Four rather than three, and German is why, as it was at three. Its
                # short shape reaches a window like 18–23 only with a long enough noun,
                # and the theme is settled before the noun is drawn — so a run of
                # fourteen attempts that all rolled a short-noun theme (`color` is `Rot`
                # and `Blau`) settles short. The fitting reweights the shape after a
                # miss but not the theme, and that is what would move the number rather
                # than another character of tolerance.
                assert distance <= 4, f"off by {distance}: {miss}"

    assert len(misses) * 200 <= drawn, (
        f"{len(misses)} of {drawn} outside the range: {' | '.join(misses[:5])}"
    )


def test_sentences_respect_the_length_range() -> None:
    ranges: list[tuple[WordLanguage, int, int]] = [
        ("ko", 8, 16),
        ("ko", 20, 34),
        ("en", 14, 30),
        ("en", 40, 70),
        ("ja", 6, 14),
        ("zh", 5, 12),
        ("vi", 12, 28),
        ("es", 14, 34),
        ("it", 14, 34),
        ("de", 14, 34),
        ("ru", 10, 26),
    ]

    for language, low, high in ranges:
        for sentence in rand_sentence(
            language=language,
            min_length=low,
            max_length=high,
            count=SAMPLE,
        ):
            assert low <= len(sentence) <= high, (
                f"{language} {low}-{high}: {sentence} ({len(sentence)})"
            )


def test_sentences_start_with_starts_with() -> None:
    cases: list[tuple[WordLanguage, str]] = [("ko", "사"), ("ja", "空"), ("zh", "雨")]

    for language, prefix in cases:
        sentences = rand_sentence(language=language, starts_with=prefix, count=20)

        assert sentences, f"{language} {prefix}"

        for sentence in sentences:
            assert sentence.startswith(prefix), f"{language}: {sentence}"


def test_unique_never_repeats_a_sentence() -> None:
    sentences = rand_sentence(language="ko", unique=True, count=300)

    assert len(set(sentences)) == len(sentences)


def sentence_of(detail: SentenceDetail) -> list[int]:
    """Which sentence of a result each phrase belongs to.

    `phrases` and `slots` are one flat list across every sentence, which is what they
    are for — but a question like "is this counted phrase the subject of its own
    sentence" needs the boundaries back, and the phrases appear in order, so walking
    them against `sentences` finds them.
    """
    out: list[int] = []
    at = 0
    cursor = 0

    for phrase in detail.phrases:
        while at < len(detail.sentences) - 1 and detail.sentences[at].find(phrase, cursor) < 0:
            at += 1
            cursor = 0

        found = detail.sentences[at].find(phrase, cursor)
        cursor = cursor if found < 0 else found + len(phrase)
        out.append(at)

    return out


def strip_count(language: WordLanguage, phrase: str) -> str:
    """A counted phrase with its number taken off.

    What is left is the noun phrase every other check already knows how to read.
    """
    data = SENTENCE_DATA[language]
    numeral = data.numeral

    if numeral is None:
        return phrase

    space = re.escape(data.space)
    gap = re.escape(numeral.gap)
    counters = [re.escape(word) for word in numeral.counters.values()]
    number = rf"\d[\d{re.escape(numeral.group)}]*"
    group = f"{number}(?:{gap}(?:{'|'.join(counters)}))?" if counters else number

    return re.sub(f"^{group}{space}", "", re.sub(f"{space}{group}$", "", phrase))


def is_money(language: WordLanguage, phrase: str) -> bool:
    """Whether a phrase is an amount, written the way the language writes it."""
    data = SENTENCE_DATA[language]
    numeral = data.numeral

    if numeral is None:
        return False

    pattern = (
        rf"^\d[\d{re.escape(numeral.group)}]*"
        f"{re.escape(numeral.gap)}{re.escape(numeral.currency)}$"
    )

    return re.fullmatch(pattern, phrase) is not None


def upper_first(word: str) -> str:
    """How a capitalizing language writes the first word of a sentence."""
    return word[:1].upper() + word[1:]


def pronouns_of(language: WordLanguage) -> set[str]:
    """Every subject pronoun the language can write, in both cases."""
    written = [word for pool in SENTENCE_DATA[language].pronouns.values() for word in pool if word]

    return {*written, *(upper_first(word) for word in written)}


def nouns_in(language: WordLanguage, phrase: str) -> set[str]:
    """Every noun a phrase could have been built around, as far as the pools can tell.

    The same decomposition `explains` makes, kept instead of thrown away — and every
    one of them rather than the first, because a word can be both a noun and a modifier
    and two of them beside each other parse both ways: Vietnamese `Sâu ấm` is a warm
    worm and a deep teapot, and only the generator knows which it meant. Empty for a
    phrase built on a word no pool holds, which is what an invented subject is.
    """
    space = SENTENCE_DATA[language].space
    nouns = pool_for(language, "subject")
    modifiers = modifiers_for(language)
    found: set[str] = set()
    rest = phrase

    for article in articles_for(language):
        opening = article if article.endswith("'") else article + space

        if rest.startswith(opening):
            rest = rest[len(opening) :]
            break

    if rest in nouns:
        found.add(rest)

    for at in range(1, len(rest)):
        if space and rest[at : at + len(space)] != space:
            continue

        left = rest[:at]
        right = rest[at + len(space) :]

        if left in modifiers and right in nouns:
            found.add(right)

        if left in nouns and right in modifiers:
            found.add(left)

    return found


def theme_of_noun(language: WordLanguage, noun: str) -> WordTheme | None:
    """The theme whose pool holds a noun, in the form a sentence writes it."""
    for theme in WORD_THEMES:
        if any(plain(language, word) == noun for word in WORD_DATA[language].nouns[theme]):
            return theme

    return None


def test_a_paragraph_keeps_its_scene_its_person_and_its_register() -> None:
    """A place, a thing and a person named once are the same ones all the way down."""
    # A place named in the first sentence is where the rest of it happens, and a thing it
    # was about is the thing it stays about. Before this the topic was the subject and
    # nothing else, so the place changed every line.
    for detail in rand_sentence(
        language="ko", sentences=4, slots=["place", "object"], count=120, output="detail"
    ):
        for slot in ("place", "object"):
            drawn = [
                nouns_in("ko", phrase)
                for phrase, each in zip(detail.phrases, detail.slots, strict=True)
                if each == slot
            ]

            # Every one of them reads as the same noun: a later sentence writes its own
            # modifier, so the phrases differ and the noun does not.
            for found in drawn[1:]:
                assert found & drawn[0], f"{slot} changed: {detail.sentence}"

    # A person is an individual rather than a kind of thing, so a paragraph about one is
    # about that one. `fresh` would quietly make it about somebody else.
    for detail in rand_sentence(
        language="ko", sentences=4, include_name=True, count=120, output="detail"
    ):
        assert len(set(detail.names)) == min(1, len(detail.names)), detail.sentence

    # And it stays in the register it opened in: a line somebody says is a line, and
    # prose about it may ask and exclaim without becoming a line.
    for detail in rand_sentence(language="ko", sentences=4, count=200, output="detail"):
        quoted = [type_ in ("dialogue", "thought") for type_ in detail.types]

        assert all(one == quoted[0] for one in quoted), (
            f"the register changed mid-paragraph: {'/'.join(detail.types)}"
        )


def test_sentences_puts_more_than_one_sentence_in_one_result() -> None:
    for language in WORD_LANGUAGES:
        data = SENTENCE_DATA[language]

        for detail in rand_sentence(
            type="statement",
            include_name=False,
            language=language,
            sentences=3,
            count=40,
            output="detail",
        ):
            assert len(detail.sentences) == 3, detail.sentence
            assert data.space.join(detail.sentences) == detail.sentence

            for sentence in detail.sentences:
                assert sentence.endswith(data.terminators["statement"]), f"{language}: {sentence}"
                assert SCRIPT[language].match(sentence), f"{language}: {sentence}"
                # Every sentence closes exactly once, so two of them were never run
                # together into one entry.
                # Counted after the grouped numbers are taken out: Vietnamese, Spanish
                # and Italian group on a full stop, so `5.000.000` is three of them and
                # none is a terminator.
                assert (
                    re.sub(r"\d[\d.,]*\d", "#", sentence).count(data.terminators["statement"]) == 1
                ), f"{language}: {sentence}"
                assert "  " not in sentence, f"{language}: {sentence}"

    for detail in rand_sentence(type="statement", include_name=False, count=20, output="detail"):
        assert len(detail.sentences) == 1
        assert detail.sentences[0] == detail.sentence


def test_sentences_is_clamped_and_count_still_says_how_many_strings_there_are() -> None:
    for asked, expected in (
        (0, 1),
        (-3, 1),
        (RAND_SENTENCE_COUNT_MAX + 5, RAND_SENTENCE_COUNT_MAX),
    ):
        for detail in rand_sentence(language="ko", sentences=asked, count=10, output="detail"):
            assert len(detail.sentences) == expected, detail.sentence

    assert len(rand_sentence(sentences=4, count=7)) == 7


def test_the_length_range_describes_the_whole_result() -> None:
    ranges: tuple[tuple[WordLanguage, int, int, int], ...] = (
        ("ko", 2, 24, 40),
        ("ko", 3, 40, 60),
        ("en", 2, 40, 70),
        ("ja", 3, 24, 42),
        ("zh", 2, 14, 28),
        ("de", 2, 34, 60),
        ("ru", 3, 40, 75),
    )

    for language, sentences, min_length, max_length in ranges:
        for sentence in rand_sentence(
            language=language,
            sentences=sentences,
            min_length=min_length,
            max_length=max_length,
            count=SAMPLE,
        ):
            assert min_length <= len(sentence) <= max_length, (
                f"{language} x{sentences} {min_length}-{max_length}: {sentence}"
            )


def test_the_sentences_of_one_result_are_about_the_same_kind_of_thing() -> None:
    # A paragraph is not three draws. Every sentence after the first names that first
    # subject again, stands a pronoun where it was, or draws another noun of the same
    # class — so a paragraph that opens on a creature never wanders into an idea
    # halfway through.
    for language in WORD_LANGUAGES:
        pronouns = pronouns_of(language)

        for detail in rand_sentence(language=language, sentences=3, count=60, output="detail"):
            if detail.theme is None:
                continue

            wanted = THEME_CLASS[detail.theme]
            # A shape that counts what it is about has no separate subject, so the
            # counted phrase is the one that has to stay on topic. It is checked only in
            # the opening sentence, and only when that sentence has no subject of its
            # own — the one case where it provably is the subject.
            belongs = sentence_of(detail)
            opens = not any(
                slot == "subject" and belongs[i] == 0 for i, slot in enumerate(detail.slots)
            )
            subjects = 0

            for index, (phrase, slot) in enumerate(zip(detail.phrases, detail.slots, strict=True)):
                if slot != "subject" and not (slot == "quantity" and belongs[index] == 0 and opens):
                    continue

                subjects += 1

                if phrase in pronouns:
                    continue

                # Any of the three sentences can be the one a phrase opens, so both
                # cases are tried rather than only the first phrase of the result.
                bare = strip_count(language, phrase)
                found = nouns_in(language, bare) | nouns_in(language, bare[:1].lower() + bare[1:])
                themes = [
                    theme
                    for theme in (theme_of_noun(language, noun) for noun in found)
                    if theme is not None
                ]

                assert not themes or any(THEME_CLASS[theme] == wanted for theme in themes), (
                    f"{language}: '{phrase}' reads as {themes} where the result is about a "
                    f"{wanted} ({detail.sentence})"
                )

            assert subjects >= 1, detail.sentence


def test_a_connective_opens_a_sentence_that_follows_another() -> None:
    for language in WORD_LANGUAGES:
        data = SENTENCE_DATA[language]
        openers = [
            (upper_first(word) if data.capitalize else word) + data.space
            for word in data.connectives
        ]
        seen = 0

        for detail in rand_sentence(language=language, sentences=3, count=120, output="detail"):
            assert not any(detail.sentences[0].startswith(opener) for opener in openers), (
                f"{language}: the first sentence opens on a connective ({detail.sentence})"
            )

            seen += sum(
                any(sentence.startswith(opener) for opener in openers)
                for sentence in detail.sentences[1:]
            )

        # And the language can actually write one, which is what makes the check above
        # worth anything.
        assert seen > 0, f"{language} never wrote a connective"


def test_a_language_whose_nouns_carry_a_gender_has_a_pronoun_for_each_of_them() -> None:
    for language in WORD_LANGUAGES:
        data = SENTENCE_DATA[language]
        genders: tuple[WordGender, ...] = tuple((WORD_DATA[language].agreement or {}).keys())

        assert data.connectives, f"{language} has no connectives"
        assert "n" in data.pronouns or genders, f"{language} has no pronoun to fall back to"

        for gender in genders:
            assert data.pronouns.get(gender) or data.pronouns.get("n"), (
                f"{language}: nothing stands in for a {gender} subject"
            )


def given_names(language: WordLanguage, gender: str) -> set[str]:
    """The given names the language can write, by gender.

    The pools `rand_sentence` reaches through `include_name`. CJK languages keep whole
    given names under `given_male` / `given_female`; the others draw from `male` /
    `female`.
    """
    data = NAME_DATA[language]
    pool = (
        (data.given_male or data.male) if gender == "male" else (data.given_female or data.female)
    )

    return {entry if isinstance(entry, str) else entry.n for entry in (pool or ())}


def test_include_name_writes_a_person_name_where_a_sentence_has_room_for_one() -> None:
    for language in WORD_LANGUAGES:
        space = SENTENCE_DATA[language].space

        for detail in rand_sentence(
            language=language, include_name=True, count=SAMPLE, output="detail"
        ):
            assert detail.names, f"{language}: no name in {detail.sentence}"

            for name in detail.names:
                assert name in detail.phrases, f"{language}: {name} is not a phrase"
                assert name in detail.sentence

            # A name is a bare proper noun, so nothing opens the phrase it stands in.
            if "subject" not in detail.slots:
                continue

            at = detail.slots.index("subject")

            if detail.phrases[at] in detail.names:
                for article in articles_for(language):
                    assert f"{article}{space}{detail.phrases[at]}" not in detail.sentence, (
                        f"{language}: '{article}' in front of a name ({detail.sentence})"
                    )

    # Off when it is asked to be off, and drawn when it is not asked at all.
    for detail in rand_sentence(type="statement", include_name=False, count=60, output="detail"):
        assert detail.names == (), detail.sentence

    carried = sum(
        1 for detail in rand_sentence(language="ko", count=200, output="detail") if detail.names
    )

    assert 20 < carried < 180, f"{carried} of 200 carried a name"


def test_a_name_comes_out_of_the_languages_own_given_name_pools() -> None:
    for language in WORD_LANGUAGES:
        known = given_names(language, "male") | given_names(language, "female")

        for detail in rand_sentence(
            language=language, include_name=True, count=SAMPLE, output="detail"
        ):
            for name in detail.names:
                # English writes its pools capitalized and a sentence opens on a
                # capital, so the name is looked up the way the pool holds it.
                assert name in known or upper_first(name) in known, (
                    f"{language}: '{name}' is in no given-name pool ({detail.sentence})"
                )


def test_a_theme_the_caller_named_wins_over_include_name() -> None:
    # A name can only stand where a person would. Asked for beside a theme that names
    # no people, the sentence is about that theme and carries no name.
    for detail in rand_sentence(
        language="en", theme="animal", include_name=True, count=SAMPLE, output="detail"
    ):
        assert detail.theme == "animal", detail.sentence
        assert detail.names == (), detail.sentence


def test_a_predicate_agrees_with_the_gender_of_the_name_it_describes() -> None:
    # The one thing a name has to carry beside its letters. Spanish, Italian and
    # Russian inflect a predicate adjective, and a name is in no pool for `gender_of`
    # to read a gender out of.
    for language in WORD_LANGUAGES:
        data = SENTENCE_DATA[language]
        lexicon = WORD_DATA[language]

        if not data.predicate_agrees or lexicon.agreement is None:
            continue

        male = given_names(language, "male")
        female = given_names(language, "female")
        states = [word for group in data.states for word in group.words]
        forms: dict[str, set[str]] = {
            gender: {agree(lexicon, word, gender) for word in states} for gender in ("m", "f")
        }
        checked = 0

        for detail in rand_sentence(
            language=language, include_name=True, slots="state", count=200, output="detail"
        ):
            if "state" not in detail.slots or "subject" not in detail.slots:
                continue

            subject = detail.phrases[detail.slots.index("subject")]

            if subject not in detail.names:
                continue

            gender = "m" if subject in male else ("f" if subject in female else None)

            if gender is None:
                continue

            checked += 1
            state = detail.phrases[detail.slots.index("state")]

            assert state in forms[gender], (
                f"{language}: '{state}' does not agree with {subject} ({detail.sentence})"
            )

        assert checked > 0, f"{language}: no named subject was described"


def test_korean_picks_the_particle_a_name_asks_for_too() -> None:
    for detail in rand_sentence(language="ko", include_name=True, count=200, output="detail"):
        if "subject" not in detail.slots:
            continue

        at = detail.slots.index("subject")
        name = detail.phrases[at]

        if name not in detail.names:
            continue

        after = detail.sentence[detail.sentence.index(name) + len(name)]
        last = ord(name[-1])
        coda = 0xAC00 <= last <= 0xD7A3 and (last - 0xAC00) % 28 != 0

        if after in ("가", "는"):
            assert not coda, f"{name}{after} ({detail.sentence})"

        if after in ("이", "은"):
            assert coda, f"{name}{after} ({detail.sentence})"


def test_type_decides_what_the_sentence_is_doing_and_what_it_closes_on() -> None:
    # The four a language writes a mark of its own for; a quoted line takes the mark of
    # whatever it quotes, and has its own test below.
    types: tuple[SentenceMark, ...] = ("statement", "question", "exclamation", "trailing")
    every: tuple[SentenceType, ...] = (*types, "dialogue", "thought")

    for language in WORD_LANGUAGES:
        data = SENTENCE_DATA[language]

        for type_ in types:
            for detail in rand_sentence(
                language=language, type=type_, count=SAMPLE, output="detail"
            ):
                assert detail.types == (type_,), detail.sentence
                assert detail.sentence.endswith(data.terminators[type_]), (
                    f"{language} {type_}: {detail.sentence}"
                )
                assert SCRIPT[language].match(detail.sentence), detail.sentence

                opener = data.openers.get(type_)

                if opener:
                    assert detail.sentence.startswith(opener), detail.sentence

    # Nothing asked for is every kind, decided per sentence.
    drawn = {
        type_ for detail in rand_sentence(count=400, output="detail") for type_ in detail.types
    }

    assert len(drawn) == len(every), sorted(drawn)

    seen = {
        type_
        for detail in rand_sentence(
            language="ko", type="all", sentences=3, count=120, output="detail"
        )
        for type_ in detail.types
    }

    assert len(seen) == len(every)


def test_a_question_is_a_shape_not_a_mark_bolted_onto_a_statement() -> None:
    # The languages whose grammar moves for a question say so in their own frames, and
    # the shape has to be one of those rather than the statement's.
    carries: dict[WordLanguage, str] = {
        # English do-support, and the base form behind it.
        "en": r"^(Does|Is) ",
        # Korean changes the ending on the predicate itself. Which ending is the
        # level's business — 해라체 asks with `-니`, `-나` and `-(으)ㄴ가` — so the level
        # is pinned below and the shape is what is under test.
        "ko": r"(니|나|가)\?$",
        # A tag Japanese, Chinese and Vietnamese write after the whole clause.
        "ja": r"か？$",
        "zh": r"吗？$",
        "vi": r"không\?$",
    }

    for language, shape in carries.items():
        for sentence in rand_sentence(
            language=language, type="question", style="plain", count=SAMPLE
        ):
            assert re.search(shape, sentence), f"{language}: {sentence}"

    # German moves its finite verb to the front, so the question opens on the predicate
    # or on the `ist` that stands in for one.
    verbs = pool_for("de", "verb")

    for sentence in rand_sentence(language="de", type="question", count=SAMPLE):
        first = sentence.split(" ")[0].lower()

        assert first in verbs or first == "ist", f"de: {sentence}"


def test_a_question_form_pool_is_the_same_length_as_the_words_it_restates() -> None:
    # Index-aligned is the whole contract: a verb keeps its meaning across the forms,
    # and a word the caller required is translated by its position.
    for language in WORD_LANGUAGES:
        data = SENTENCE_DATA[language]

        groups: list[tuple[WordPool, PredicateForms]] = [
            *((group.words, group.forms) for group in data.verbs),
            *((group.words, group.forms) for group in data.states),
        ]

        for words, forms in groups:
            for form, pool in forms.items():
                assert len(pool) == len(words), (
                    f"{language}: the {form} pool is {len(pool)} beside {len(words)}"
                )
                assert all(pool), f"{language}: the {form} pool has a blank"


def test_a_predicate_is_written_in_the_form_its_type_asks_for() -> None:
    # The question form where the group declares one, and the plain words where it does
    # not — English states need none, because the shape moves `is` to the front and
    # leaves `green` alone.
    for language in WORD_LANGUAGES:
        data = SENTENCE_DATA[language]
        verb_forms = [
            w for g in data.verbs for w in forms_of(g.words, g.forms, "plain", "question")
        ]
        state_forms = [
            w for g in data.states for w in forms_of(g.words, g.forms, "plain", "question")
        ]
        expected: dict[SentenceSlot, set[str]] = {
            "verb": set(verb_forms),
            # A predicate adjective that agrees comes out in the form its subject asked
            # for, question or not.
            "state": set(
                inflected(language, tuple(state_forms)) if data.predicate_agrees else state_forms
            ),
        }

        for detail in rand_sentence(
            language=language, type="question", style="plain", count=120, output="detail"
        ):
            for index, (phrase, slot) in enumerate(zip(detail.phrases, detail.slots, strict=True)):
                if slot not in ("verb", "state"):
                    continue

                written = phrase[:1].lower() + phrase[1:] if index == 0 else phrase
                pool = expected[slot]

                assert written in pool or phrase in pool, (
                    f"{language}: '{phrase}' is not the {slot} form a question asks for"
                )


def test_include_puts_a_required_predicate_in_the_form_the_type_asks_for() -> None:
    # The pools are index-aligned so that a word named in the statement form can be said
    # the other way rather than written out wrong.
    written: dict[SentenceStyle, tuple[str, ...]] = {
        "plain": ("달리니", "달리나", "달리는가"),
        "casual": ("달려", "달리지"),
        "polite": ("달려요", "달리죠"),
        "formal": ("달립니까",),
    }

    for style, forms in written.items():
        for sentence in rand_sentence(
            language="ko", include="달린다", type="question", style=style, count=30
        ):
            assert any(form in sentence for form in forms), f"{style}: {sentence}"
            assert "달린다" not in sentence, sentence

    for sentence in rand_sentence(
        language="en", include="runs", type="question", style="plain", count=30
    ):
        assert re.search(r"\brun\b", sentence), sentence


def test_an_interjection_opens_an_exclamation_and_nothing_else() -> None:
    for language in WORD_LANGUAGES:
        data = SENTENCE_DATA[language]
        openers = [
            (upper_first(word) if data.capitalize else word) + data.space
            for word in data.interjections
        ]

        mark = data.openers.get("exclamation", "")

        def opens(sentence: str, openers: list[str] = openers, mark: str = mark) -> bool:
            body = sentence[len(mark) :] if mark else sentence

            return any(body.startswith(opener) for opener in openers)

        seen = sum(
            opens(sentence)
            for sentence in rand_sentence(language=language, type="exclamation", count=120)
        )

        assert seen > 0, f"{language} never wrote an interjection"

        for sentence in rand_sentence(
            type="statement", include_name=False, language=language, count=120
        ):
            assert not opens(sentence), f"{language}: a statement opened on one ({sentence})"


def test_every_language_can_write_every_type_inside_its_own_length_range() -> None:
    for language in WORD_LANGUAGES:
        low, high = sentence_length_range(language)
        types: tuple[SentenceType, ...] = ("question", "exclamation", "trailing")

        for type_ in types:
            for sentence in rand_sentence(language=language, type=type_, count=40):
                assert low <= len(sentence) <= high, (
                    f"{language} {type_}: {sentence} ({len(sentence)}) outside {low}-{high}"
                )


def test_a_quoted_line_is_a_sentence_in_the_languages_own_marks() -> None:
    for language in WORD_LANGUAGES:
        data = SENTENCE_DATA[language]
        marks = list(data.terminators.values())
        pairs: dict[SentenceType, SentenceQuote] = {"dialogue": "double", "thought": "single"}

        for type_, kind in pairs.items():
            open_mark, close_mark = data.quotes[kind]

            for detail in rand_sentence(
                language=language, type=type_, count=SAMPLE, output="detail"
            ):
                assert detail.types == (type_,), detail.sentence
                assert detail.sentence.startswith(open_mark), f"{language}: {detail.sentence}"
                assert detail.sentence.endswith(close_mark), f"{language}: {detail.sentence}"
                assert SCRIPT[language].match(detail.sentence), detail.sentence

                # What is quoted is a whole sentence, closed the way its own kind closes
                # — a spoken line is as often asking as telling.
                inner = detail.sentence[len(open_mark) : -len(close_mark)]

                assert any(inner.endswith(mark) for mark in marks), (
                    f"{language}: '{inner}' closes on no mark"
                )


def test_a_quoted_line_is_as_often_asking_as_telling() -> None:
    # The mark under a quote is drawn per line rather than fixed, so a hundred of them
    # are not a hundred statements.
    data = SENTENCE_DATA["en"]
    closes = {sentence[-2] for sentence in rand_sentence(language="en", type="dialogue", count=200)}

    assert data.terminators["statement"] in closes
    assert data.terminators["question"] in closes
    assert data.terminators["exclamation"] in closes


def test_quote_picks_the_marks_whatever_the_type() -> None:
    kinds: tuple[SentenceQuote, ...] = ("double", "single")
    quoted: tuple[SentenceType, ...] = ("dialogue", "thought")

    for language in WORD_LANGUAGES:
        quotes = SENTENCE_DATA[language].quotes

        for kind in kinds:
            open_mark, close_mark = quotes[kind]

            for type_ in quoted:
                for sentence in rand_sentence(language=language, type=type_, quote=kind, count=20):
                    assert sentence.startswith(open_mark), f"{language} {type_} {kind}: {sentence}"
                    assert sentence.endswith(close_mark), f"{language} {type_} {kind}: {sentence}"

        # The two levels are two different pairs, or the option means nothing.
        assert quotes["double"] != quotes["single"], f"{language} quotes"


def test_style_is_the_speech_level_and_korean_is_the_one_with_four_of_them() -> None:
    # What each level closes on, where a mark is what the level actually is. 해라체 and
    # 해체 are left out on purpose: 해체 is the stem with `-아/-어` contracted onto it,
    # so a pattern over its endings would only restate the pool, and the test below
    # reads the pools themselves. What is worth asserting about those two is the other
    # half — that neither ever closes on a polite ending.
    closes: dict[WordLanguage, dict[SentenceStyle, str]] = {
        "ko": {"polite": r"(요|죠)[.?!…”’]$", "formal": r"(니다|니까)[.?!…”’]$"},
        # A Japanese verb closes on ます and an adjective on です.
        "ja": {
            "polite": r"(ます|です)か?[。？！…」』]$",
            "formal": r"(ます|です)か?[。？！…」』]$",
        },
    }
    addressed: dict[WordLanguage, str] = {
        "ko": r"(요|죠|니다|니까)[.?!…”’]$",
        "ja": r"(ます|です)か?[。？！…」』]$",
    }
    types: tuple[SentenceType, ...] = ("statement", "question")

    for language in WORD_LANGUAGES:
        data = SENTENCE_DATA[language]
        declares = any(
            key in forms
            for forms in (
                *(group.forms for group in data.verbs),
                *(group.forms for group in data.states),
            )
            for key in STYLE_FORMS
        )

        assert declares == (language in closes), (
            f"{language} {'declares' if declares else 'declares no'} forms for a level"
        )

        for style in STYLES:
            pattern = closes.get(language, {}).get(style)

            for type_ in types:
                for sentence in rand_sentence(
                    language=language, type=type_, style=style, count=SAMPLE
                ):
                    if pattern:
                        assert re.search(pattern, sentence), (
                            f"{language} {style} {type_}: {sentence}"
                        )
                    elif language in addressed:
                        assert not re.search(addressed[language], sentence), (
                            f"{language} {style} {type_} addresses somebody: {sentence}"
                        )


def test_a_predicate_comes_out_of_the_pool_its_level_and_mood_land_on() -> None:
    languages: tuple[WordLanguage, ...] = ("ko", "ja")
    types: tuple[SentenceMark, ...] = ("statement", "question", "exclamation")

    for language in languages:
        data = SENTENCE_DATA[language]

        for style in STYLES:
            for mark in types:
                pools: dict[SentenceSlot, set[str]] = {
                    "verb": {
                        w for g in data.verbs for w in forms_of(g.words, g.forms, style, mark)
                    },
                    "state": {
                        w for g in data.states for w in forms_of(g.words, g.forms, style, mark)
                    },
                }

                for detail in rand_sentence(
                    language=language, type=mark, style=style, count=60, output="detail"
                ):
                    for phrase, slot in zip(detail.phrases, detail.slots, strict=True):
                        if slot not in ("verb", "state"):
                            continue

                        assert phrase in pools[slot], (
                            f"{language} {style} {mark}: '{phrase}' is not a {style} {slot}"
                        )


def test_a_number_is_written_against_its_counter_the_way_the_language_writes_it() -> None:
    """Korean attaches a counter to digits; the four that write the gap write a space."""
    # 한글 맞춤법 제43항 spaces a unit noun off a spelled-out number and then allows the
    # attached form with Arabic numerals, which is what anyone writing `6개` does.
    # Japanese and Chinese have no space anywhere.
    gaps: dict[WordLanguage, str] = {
        "ko": "",
        "ja": "",
        "zh": "",
        "vi": " ",
        "en": " ",
        "es": " ",
        "it": " ",
    }

    for language in WORD_LANGUAGES:
        numeral = SENTENCE_DATA[language].numeral

        assert (numeral.gap if numeral else None) == gaps.get(language), language

    # And the sentences agree with the table: nothing stands between the digits and the
    # counter or the currency in the three that attach them.
    for language in ("ko", "ja", "zh"):
        for detail in rand_sentence(
            language=language, slots=["quantity", "money"], count=SAMPLE, output="detail"
        ):
            assert not re.search(r"\d\s", detail.sentence), (
                f"{language}: '{detail.sentence}' spaces a number off what it counts"
            )


def test_slots_quantity_counts_a_noun_with_the_counter_its_kind_takes() -> None:
    # Only the four languages with a classifier table declare a counted shape. A
    # classifier is what makes a noun countable at all — `슬픔 12 가지` is twelve kinds
    # of sadness — which is why English, Spanish and Italian do not: they would need a
    # plural, and a plural of `sadness` is not a word.
    counting = [
        language
        for language in WORD_LANGUAGES
        if (SENTENCE_DATA[language].numeral or None) is not None
        and bool(SENTENCE_DATA[language].numeral.counters)  # type: ignore[union-attr]
    ]

    assert counting == ["ko", "ja", "zh", "vi"]

    for language in counting:
        data = SENTENCE_DATA[language]
        numeral = data.numeral
        assert numeral is not None
        counters = set(numeral.counters.values())

        for detail in rand_sentence(
            type="statement",
            include_name=False,
            language=language,
            slots="quantity",
            count=SAMPLE,
            output="detail",
        ):
            assert "quantity" in detail.slots, f"{language}: {detail.sentence}"

            phrase = detail.phrases[detail.slots.index("quantity")]
            found = re.search(rf"\d+{re.escape(numeral.gap)}(\S+)", phrase)

            assert found, f"{language}: '{phrase}' carries no number"
            assert found.group(1) in counters, (
                f"{language}: '{found.group(1)}' is not a counter ({detail.sentence})"
            )

            number = int(re.search(r"\d+", phrase).group(0))  # type: ignore[union-attr]

            assert numeral.count[0] <= number <= numeral.count[1], (
                f"{language}: {number} is outside {numeral.count}"
            )

            # A counted phrase drops its article and takes no modifier.
            for article in articles_for(language):
                assert not phrase.startswith(article + data.space), f"{language}: {phrase}"

            assert strip_count(language, phrase) in pool_for(language, "subject"), (
                f"{language}: '{phrase}' is not a bare noun and a count"
            )

    # German and Russian declare no numeral at all, so asking falls back to the shapes
    # they do have rather than inventing a case they cannot write.
    for language in ("de", "ru"):
        assert SENTENCE_DATA[language].numeral is None, language

        for detail in rand_sentence(
            type="statement",
            include_name=False,
            language=language,
            slots="quantity",
            count=30,
            output="detail",
        ):
            assert "quantity" not in detail.slots, detail.sentence


def test_slots_money_writes_an_amount_the_language_actually_writes() -> None:
    paying = [language for language in WORD_LANGUAGES if SENTENCE_DATA[language].numeral]

    assert paying == ["en", "ko", "ja", "zh", "vi", "es", "it"]

    for language in paying:
        numeral = SENTENCE_DATA[language].numeral
        assert numeral is not None
        amounts = set(numeral.amounts)

        for detail in rand_sentence(
            type="statement",
            include_name=False,
            language=language,
            slots="money",
            count=SAMPLE,
            output="detail",
        ):
            assert "money" in detail.slots, f"{language}: {detail.sentence}"

            phrase = detail.phrases[detail.slots.index("money")]

            assert is_money(language, phrase), f"{language}: '{phrase}' is not an amount"

            digits = phrase.replace(numeral.group, "")

            assert int(re.search(r"\d+", digits).group(0)) in amounts, (  # type: ignore[union-attr]
                f"{language}: '{phrase}' is not an amount the language writes"
            )

    # The two that cannot: an amount would be an object, and neither declares an object
    # shape, because both would need a case their nouns change for.
    for language in ("de", "ru"):
        for detail in rand_sentence(
            type="statement",
            include_name=False,
            language=language,
            slots="money",
            count=30,
            output="detail",
        ):
            assert "money" not in detail.slots, detail.sentence


def test_an_amount_stands_where_the_verbs_that_take_an_idea_can_take_it() -> None:
    # Money is an idea, which is what decides the verbs it can stand beside.
    for language in WORD_LANGUAGES:
        data = SENTENCE_DATA[language]

        for detail in rand_sentence(language=language, slots="money", count=60, output="detail"):
            if "verb" not in detail.slots or "money" not in detail.slots:
                continue

            verb = detail.phrases[detail.slots.index("verb")]
            groups = [group for group in data.verbs if verb in every_form(group.words, group.forms)]

            assert any("idea" in (group.object or ()) for group in groups), (
                f"{language}: {verb} takes no idea ({detail.sentence})"
            )


def test_a_grouped_number_is_written_the_way_the_language_groups_it() -> None:
    for language in WORD_LANGUAGES:
        numeral = SENTENCE_DATA[language].numeral

        if numeral is None:
            continue

        for sentence in rand_sentence(
            type="statement", include_name=False, language=language, slots="money", count=40
        ):
            found = re.search(r"\d[\d.,\s]*\d", sentence)
            digits = found.group(0) if found else ""

            # Three digits between separators, and no other separator in sight.
            assert re.fullmatch(rf"\d{{1,3}}({re.escape(numeral.group)}\d{{3}})*", digits), (
                f"{language}: '{digits}' ({sentence})"
            )


def test_the_detail_form_reports_what_the_sentence_was_built_from() -> None:
    for detail in rand_sentence(output="detail", language="en", count=SAMPLE):
        assert detail.sentence
        assert detail.language == "en"
        assert len(detail.phrases) >= 2
        assert len(detail.phrases) == len(detail.slots)
        assert detail.theme is None or detail.theme in WORD_THEMES


def test_sentence_length_range_reports_what_the_language_can_produce() -> None:
    for language in WORD_LANGUAGES:
        low, high = sentence_length_range(language)

        assert 1 <= low < high, f"{language}: {low}-{high}"

        for sentence in rand_sentence(language=language, count=SAMPLE):
            assert low <= len(sentence) <= high, (
                f"{language}: {sentence} ({len(sentence)}) outside {low}-{high}"
            )

    every_low, every_high = sentence_length_range()

    assert every_low == min(sentence_length_range(code)[0] for code in WORD_LANGUAGES)
    assert every_high == max(sentence_length_range(code)[1] for code in WORD_LANGUAGES)


def test_every_noun_class_the_frames_can_ask_for_has_a_predicate_to_go_with_it() -> None:
    for language in WORD_LANGUAGES:
        data = SENTENCE_DATA[language]
        subjects = {noun for group in data.verbs for noun in group.subject}
        described = {noun for group in data.states for noun in group.subject}

        for theme in WORD_THEMES:
            noun = THEME_CLASS[theme]

            assert noun in subjects, f"{language}: no verb takes a {noun} subject"
            assert noun in described, f"{language}: no state describes a {noun}"
