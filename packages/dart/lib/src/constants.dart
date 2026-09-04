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

/// Upper bound for `minLength` / `maxLength` on `randSentence`, in characters.
///
/// Its own number rather than [randLengthMax], because a sentence is many words
/// and their particles where a name, a word and a nickname are at most three — a
/// ceiling of 40 would cut most sentences of every language in half.
const int randSentenceLengthMax = 200;
