// Bounds every generator shares. They used to be `NAME_*` and `NICKNAME_*`, one
// pair each, which meant a third generator had to invent a third pair holding
// the same numbers. What a generator produces differs; how many of them you may
// ask for, and how long you may ask them to be, does not.

/**
 * Upper bound for `count` on every generator. Generation is cheap, but an
 * unbounded count with `unique: true` can spend a long time re-drawing from an
 * exhausted pool.
 */
export const RAND_COUNT_MAX = 10000;

/** Lower bound for `minLength` / `maxLength` on every generator, in characters. */
export const RAND_LENGTH_MIN = 1;

/** Upper bound for `minLength` / `maxLength` on every generator, in characters. */
export const RAND_LENGTH_MAX = 40;

/**
 * Upper bound for `minLength` / `maxLength` on `randSentence`, in characters.
 * Its own number rather than `RAND_LENGTH_MAX`, because a sentence is many words
 * and their particles where a name, a word and a nickname are at most three — a
 * ceiling of 40 would cut most sentences of every language in half.
 */
export const RAND_SENTENCE_LENGTH_MAX = 200;
