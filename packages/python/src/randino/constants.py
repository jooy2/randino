"""Bounds every generator shares.

They used to be `NAME_*` and `NICKNAME_*`, one set each, which meant a third
generator had to invent a third set holding the same numbers. What a generator
produces differs; how many of them you may ask for, and how long you may ask
them to be, does not.
"""

RAND_COUNT_MAX = 10000
"""Upper bound for `count` on every generator.

Generation is cheap, but an unbounded count with `unique=True` can spend a long
time re-drawing from an exhausted pool.
"""

RAND_LENGTH_MIN = 1
"""Lower bound for `min_length` / `max_length` on every generator, in characters."""

RAND_LENGTH_MAX = 40
"""Upper bound for `min_length` / `max_length` on every generator, in characters."""

RAND_SENTENCE_LENGTH_MAX = 200
"""Upper bound for `min_length` / `max_length` on `rand_sentence`, per sentence.

In characters, and its own number rather than `RAND_LENGTH_MAX`, because a sentence is
many words and their particles where a name, a word and a nickname are at most three —
a ceiling of 40 would cut most sentences of every language in half.

Per sentence rather than per result, because `sentences` asks for more than one of them
in one string: a paragraph of ten is allowed ten times this, and capping the paragraph
at what one sentence may be would answer the ask with ten sentences of twenty
characters.
"""

RAND_SENTENCE_COUNT_MAX = 10
"""Upper bound for `sentences` on `rand_sentence` — how many sentences one result holds.

Ten is already a paragraph, and every one of them still has to land inside the result's
own length range.
"""
