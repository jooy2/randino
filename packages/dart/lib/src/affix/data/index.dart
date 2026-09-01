/// Bounds and defaults for [randSuffix] and [randPrefix].
///
/// They are the nickname library's old `nicknameSuffix*` constants, which
/// stopped belonging to nicknames the moment the suffix became something you
/// attach to any string.
library;

/// Characters in an affix when no length is asked for.
const int affixLengthDefault = 5;

/// Upper bound for the affix length.
const int affixLengthMax = 32;

/// Placed between the value and its affix when no separator is asked for.
const String affixSeparatorDefault = '_';

/// Affix characters, minus the pairs that are easy to misread (0/O, 1/l/I) —
/// these end up in names people read aloud and type back in.
const String affixCharset = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
