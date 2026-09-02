// Bounds and defaults for `randSuffix` and `randPrefix`. They are the nickname
// package's old `NICKNAME_SUFFIX_*` constants, which stopped belonging to
// nicknames the moment the suffix became something you attach to any string.
//
// `randModifier` is the third decorator and takes none of these: what it
// attaches is a word out of the pools, not a token out of a charset.

/** Characters in an affix when no `length` is asked for. */
export const AFFIX_LENGTH_DEFAULT = 5;

/** Bound for `length`. */
export const AFFIX_LENGTH_MAX = 32;

/** Placed between the value and its affix when no `separator` is asked for. */
export const AFFIX_SEPARATOR_DEFAULT = '_';

// Affix characters, minus the pairs that are easy to misread (0/O, 1/l/I) —
// these end up in usernames people read aloud and type back in.
export const AFFIX_CHARSET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
