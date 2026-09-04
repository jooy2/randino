"""`rand_sentence`: the shapes, the grammar around them, and the words inside them.

The return value is random, so what is asserted is the properties every sentence has to
have, over a sample large enough that a broken option cannot pass by luck.
"""

import re

from randino import (
    RAND_COUNT_MAX,
    WORD_LANGUAGES,
    WORD_THEMES,
    RandRealism,
    SentenceShape,
    SentenceSlot,
    WordLanguage,
    rand_sentence,
    sentence_length_range,
)

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
