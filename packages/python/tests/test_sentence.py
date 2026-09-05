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
    SentenceShape,
    SentenceSlot,
    WordLanguage,
    WordTheme,
    rand_sentence,
    sentence_length_range,
)
from randino.name.data import NAME_DATA

# The datasets are internal, but a sentence is only as good as the grammar behind
# it — these checks read the pools a sentence is allowed to draw from.
from randino.sentence._generator import shape_of
from randino.sentence.data import SENTENCE_DATA, THEME_CLASS
from randino.word._generator import agree
from randino.word.data import WORD_DATA
from randino.word.data._types import WordGender

SAMPLE = 60

SCRIPT: dict[WordLanguage, re.Pattern[str]] = {
    "en": re.compile(r"^[A-Za-z' ,.]+$"),
    "ko": re.compile(r"^[가-힣 .]+$"),
    "ja": re.compile(r"^[々぀-ヿ一-鿿。]+$"),
    "zh": re.compile(r"^[々一-鿿。]+$"),
    "vi": re.compile(r"^[a-zA-ZÀ-ỹ ,.]+$"),
    "es": re.compile(r"^[a-zA-ZÀ-ÿ ,.]+$"),
    "it": re.compile(r"^[a-zA-ZÀ-ÿ' ,.]+$"),
    "de": re.compile(r"^[a-zA-ZÀ-ÿß ,.]+$"),
    "ru": re.compile(r"^[Ѐ-ӿ ,.]+$"),
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


def pool_for(language: WordLanguage, slot: SentenceSlot) -> set[str]:
    """Every word the language may put in a phrase of `slot`."""
    data = SENTENCE_DATA[language]

    if slot == "verb":
        return {word for group in data.verbs for word in group.words}

    if slot == "state":
        states = tuple(word for group in data.states for word in group.words)

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
        terminator = SENTENCE_DATA[language].terminator

        realisms: tuple[RandRealism, ...] = ("real", "invented")

        for realism in realisms:
            for sentence in rand_sentence(language=language, realism=realism, count=SAMPLE):
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
            for sentence in rand_sentence(language=language, realism=realism, count=SAMPLE):
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

        for detail in rand_sentence(output="detail", language=language, count=200):
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

                assert explains(language, written), (
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
            assert "subject" in detail.slots, detail.sentence


def test_a_verb_only_takes_the_subject_and_object_its_group_allows() -> None:
    for language in WORD_LANGUAGES:
        data = SENTENCE_DATA[language]

        for detail in rand_sentence(output="detail", language=language, count=200):
            if "verb" not in detail.slots or detail.theme is None:
                continue

            at = detail.slots.index("verb")
            transitive = "object" in detail.slots
            # A verb can sit in more than one group, so the sentence is right when
            # one of its groups accounts for it.
            groups = [
                group
                for group in data.verbs
                if detail.phrases[at] in group.words and (group.object is not None) == transitive
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
        for detail in rand_sentence(output="detail", language="ko", theme=theme, count=20):
            assert detail.theme == theme, detail.sentence


def test_shape_decides_how_much_the_sentence_says() -> None:
    for language in WORD_LANGUAGES:
        for shape in SHAPES:
            assert any(shape_of(frame) == shape for frame in SENTENCE_DATA[language].frames), (
                f"{language} has no {shape} shape"
            )

            for detail in rand_sentence(output="detail", language=language, shape=shape, count=30):
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

            for detail in rand_sentence(output="detail", language=language, slots=slot, count=30):
                assert slot in detail.slots, f"{language} {slot}: {detail.sentence}"

    for detail in rand_sentence(output="detail", slots=(), count=120):
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
        for sentence in rand_sentence(language=language, include=include, count=40):
            for word in include:
                assert word.lower() in sentence.lower(), (
                    f"{language}: {word} missing from {sentence}"
                )


def test_include_takes_a_word_the_pools_have_never_heard_of() -> None:
    for sentence in rand_sentence(language="ko", include="깜냥이", count=30):
        assert "깜냥이" in sentence


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

    for language in WORD_LANGUAGES:
        seen = sorted(len(sentence) for sentence in rand_sentence(language=language, count=400))
        lowest = seen[int(len(seen) * 0.05)]
        highest = seen[int(len(seen) * 0.95)]
        step = max(2, (highest - lowest) // 8)

        for min_length in range(lowest, highest - 4, step):
            max_length = min(highest, min_length + 5)

            for sentence in rand_sentence(
                language=language, min_length=min_length, max_length=max_length, count=30
            ):
                drawn += 1
                over = len(sentence) - max_length
                distance = over if over > 0 else min_length - len(sentence)

                if distance <= 0:
                    continue

                miss = f"{language} {min_length}-{max_length}: {sentence} ({len(sentence)})"
                misses.append(miss)

                assert distance <= 2, f"off by {distance}: {miss}"

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


def test_sentences_puts_more_than_one_sentence_in_one_result() -> None:
    for language in WORD_LANGUAGES:
        data = SENTENCE_DATA[language]

        for detail in rand_sentence(language=language, sentences=3, count=40, output="detail"):
            assert len(detail.sentences) == 3, detail.sentence
            assert data.space.join(detail.sentences) == detail.sentence

            for sentence in detail.sentences:
                assert sentence.endswith(data.terminator), f"{language}: {sentence}"
                assert SCRIPT[language].match(sentence), f"{language}: {sentence}"
                # Every sentence closes exactly once, so two of them were never run
                # together into one entry.
                assert sentence.count(data.terminator) == 1, f"{language}: {sentence}"
                assert "  " not in sentence, f"{language}: {sentence}"

    for detail in rand_sentence(count=20, output="detail"):
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
            subjects = 0

            for phrase, slot in zip(detail.phrases, detail.slots, strict=True):
                if slot != "subject":
                    continue

                subjects += 1

                if phrase in pronouns:
                    continue

                # Any of the three sentences can be the one a phrase opens, so both
                # cases are tried rather than only the first phrase of the result.
                found = nouns_in(language, phrase) | nouns_in(
                    language, phrase[:1].lower() + phrase[1:]
                )
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

    # Off by default, and the pools are not reached at all.
    for detail in rand_sentence(count=60, output="detail"):
        assert detail.names == (), detail.sentence


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
