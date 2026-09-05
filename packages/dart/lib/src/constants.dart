/// Bounds every generator shares.
///
/// They used to be `name*` and `nickname*`, one set each, which meant a third
/// generator had to invent a third set holding the same numbers. What a
/// generator produces differs; how many of them you may ask for, and how long
/// you may ask them to be, does not.
library;

/// Upper bound for `count` on every generator.
///
/// Generation is cheap, but an unbounded count with `unique: true` can spend a
/// long time re-drawing from an exhausted pool.
const int randCountMax = 10000;

/// Lower bound for `minLength` / `maxLength` on every generator, in characters.
const int randLengthMin = 1;

/// Upper bound for `minLength` / `maxLength` on every generator, in characters.
const int randLengthMax = 40;

/// Upper bound for `minLength` / `maxLength` on `randSentence`, per sentence, in
/// characters.
///
/// Its own number rather than [randLengthMax], because a sentence is many words
/// and their particles where a name, a word and a nickname are at most three — a
/// ceiling of 40 would cut most sentences of every language in half.
///
/// Per sentence rather than per result, because `sentences` asks for more than
/// one of them in one string: a paragraph of ten is allowed ten times this, and
/// capping the paragraph at what one sentence may be would answer the ask with
/// ten sentences of twenty characters.
const int randSentenceLengthMax = 200;

/// Upper bound for `sentences` on `randSentence` — how many sentences one result
/// string may hold.
///
/// Ten is already a paragraph, and every one of them still has to land inside the
/// result's own length range.
const int randSentenceCountMax = 10;
