"""Generating sentences, as strings or as details."""

from collections.abc import Sequence
from typing import Literal, overload

from randino._types import (
    RandOutput,
    RandRealism,
    SentenceDetail,
    SentenceQuote,
    SentenceShapeOption,
    SentenceSlotOption,
    SentenceStyle,
    SentenceTypeOption,
    WordLanguageOption,
    WordThemeOption,
)
from randino.sentence._generator import generate_sentence_details


@overload
def rand_sentence(
    *,
    language: WordLanguageOption = ...,
    theme: WordThemeOption = ...,
    shape: SentenceShapeOption = ...,
    slots: SentenceSlotOption = ...,
    include: str | Sequence[str] = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    sentences: int = ...,
    include_name: bool = ...,
    type: SentenceTypeOption = ...,
    quote: SentenceQuote | None = ...,
    style: SentenceStyle | None = ...,
    output: Literal["value"] = ...,
) -> list[str]: ...


@overload
def rand_sentence(
    *,
    language: WordLanguageOption = ...,
    theme: WordThemeOption = ...,
    shape: SentenceShapeOption = ...,
    slots: SentenceSlotOption = ...,
    include: str | Sequence[str] = ...,
    count: int = ...,
    realism: RandRealism = ...,
    min_length: int | None = ...,
    max_length: int | None = ...,
    starts_with: str = ...,
    unique: bool = ...,
    sentences: int = ...,
    include_name: bool = ...,
    type: SentenceTypeOption = ...,
    quote: SentenceQuote | None = ...,
    style: SentenceStyle | None = ...,
    output: Literal["detail"],
) -> list[SentenceDetail]: ...


def rand_sentence(
    *,
    language: WordLanguageOption = "all",
    theme: WordThemeOption = "all",
    shape: SentenceShapeOption = "all",
    slots: SentenceSlotOption = "all",
    include: str | Sequence[str] = (),
    count: int = 1,
    realism: RandRealism = "real",
    min_length: int | None = None,
    max_length: int | None = None,
    starts_with: str = "",
    unique: bool = False,
    sentences: int = 1,
    include_name: bool = False,
    type: SentenceTypeOption = "statement",
    quote: SentenceQuote | None = None,
    style: SentenceStyle | None = None,
    output: RandOutput = "value",
) -> list[str] | list[SentenceDetail]:
    """Generate whole sentences, written the way the language writes them.

    A subject and something said about it. The words are the same everyday vocabulary
    `rand_word` draws from, and person names are never used. A verb states what can do
    it and what it can be done to, so the words of one sentence belong together:
    `여우가 사과를 먹는다` comes out, and the same shape never puts an idea where the
    apple is.

    Args:
        language: Language of the generated sentences. `"all"` mixes every language.
        theme: What the sentence's subject is about.
        shape: How much the sentence says — a subject and its predicate, one phrase
            more, or two. `"all"` leaves it to the language's own frame weights.
        slots: Which parts a shape may carry beside its subject. A shape qualifies when
            it carries at least one of them, so a sequence asks for any of them and
            leaves the choice to chance. `"none"` asks for a subject and its predicate
            alone. A language with no shape for what was asked answers with the closest
            it has — German has no `object` and Russian no `place`, because both would
            put the noun in a case its own ending has to change for.
        include: Words the sentence has to contain, each at least once. A word the
            pools hold goes in the phrase it belongs to; a word from anywhere else is
            used as a noun. A sentence has room for as many of them as it has phrases.
        count: How many sentences to return. Held inside `0`..`RAND_COUNT_MAX`.
        realism: Whether the words are real ones or invented to read like the language.
            The grammar stays real either way; only the vocabulary changes.
        min_length: Minimum length in characters. Defaults to the language's own range.
        max_length: Maximum length in characters.
        starts_with: Keep only sentences whose first character is this one. In a
            language that writes articles, that character is the article's.
        unique: Never return the same sentence twice. May return fewer than `count`
            sentences once the pools run out of combinations.
        sentences: How many sentences one result holds, up to `RAND_SENTENCE_COUNT_MAX`.
            They come back as one string — `count` is still how many strings there are
            — and they are about the same thing: a later sentence names the first one's
            subject again, refers to it with a pronoun, or draws a fresh subject of the
            same kind, and may open on a connective. `min_length` and `max_length`
            describe the whole string whatever this is.
        include_name: Whether a sentence about a person writes a generated name where
            that person would go — `Emma runs quietly.`, `민준이 조용히 달린다.`
            Turning it on narrows the subject to the themes that name people; a `theme`
            you named yourself still wins. The name is a bare given name, and it
            carries its own gender, so what agrees with a subject agrees with it. Off
            by default because it is the one option that reaches the person-name pools.
        type: What the sentences are doing — saying something, asking it, exclaiming it,
            or trailing off. A sequence or `"all"` decides per sentence. A language
            answers with what it has: five of the nine write a question with nothing but
            the mark, and the four that need more — English's do-support, German's verb
            moving to the front, Korean's and Japanese's endings — say so in their own
            shapes.
        quote: Which quotation marks a `"dialogue"` or a `"thought"` is written in. Left
            out, dialogue takes the language's first-level marks and thought its
            second-level ones. Ignored by every other type.
        style: The speech level the sentence is written at, drawn per result when left
            out so that two calls are not the same voice twice. Korean and Japanese are
            the two languages this changes — `달린다` becomes `달려`, `달려요` or
            `달립니다`, question and exclamation included — and the other seven write
            the same sentence at every level.
        output: `"value"` for strings, `"detail"` for a `SentenceDetail` per sentence —
            the phrases in order, what each of them does, the language and the theme.

    Returns:
        A `list[str]`, or a `list[SentenceDetail]` when `output="detail"` — the
        overloads carry that through, so a type checker knows which one it got.

    Example:
        >>> rand_sentence(language="ko", count=2)
        ['검은 고양이가 숲에서 잠잔다.', '여우가 사과를 먹는다.']
        >>> rand_sentence(language="en")
        ['The brave lion runs quietly.']
        >>> rand_sentence(language="en", shape="simple")
        ['The otter swims.']
        >>> rand_sentence(language="ko", include="사자")
        ['사자가 새벽에 떠난다.']
        >>> rand_sentence(language="ko", output="detail")[0].slots
        ('subject', 'place', 'verb')
    """
    details = generate_sentence_details(
        language=language,
        theme=theme,
        shape=shape,
        slots=slots,
        include=include,
        count=count,
        realism=realism,
        min_length=min_length,
        max_length=max_length,
        starts_with=starts_with,
        unique=unique,
        sentences=sentences,
        include_name=include_name,
        type=type,
        quote=quote,
        style=style,
    )

    if output == "detail":
        return details

    return [detail.sentence for detail in details]
