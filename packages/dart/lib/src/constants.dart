/// Bounds every generator shares.
///
/// They used to be `name*` and `nickname*`, one set each, which meant a third
/// generator had to invent a third set holding the same numbers. What a
/// generator produces differs; how many of them you may ask for, and how long
/// you may ask them to be, does not.
library;

import 'package:randino/src/types.dart';

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

/// Upper bound for `minLength` / `maxLength` on the location generators, in
/// characters.
///
/// Its own number rather than [randLengthMax], because a location written out is
/// every level of it at once: the longest today is sixty-nine characters (`The
/// University of Virginia's College at Wise, Virginia, United States`), and a
/// single US place name already runs to forty-four.
const int randLocationLengthMax = 100;

/// Upper bound for `minAge` / `maxAge` on `randAge`, in years.
///
/// The age curve runs out here: the oldest anybody has been verified to live is
/// a little past it, and a sample has no use for a record.
const int randAgeMax = 120;

/// Upper bound for `minLength` / `maxLength` on `randOrganization`, in
/// characters.
///
/// Its own number rather than [randLengthMax], because an organization is a
/// name, a word for its business and a legal form at once, and the longest of
/// them run past forty: `Công ty TNHH MTV Giải pháp Công nghệ Thịnh Vượng`,
/// `Polideportivo Municipal de Encinar del Valle`.
const int randOrganizationLengthMax = 60;

/// The two kinds of machine a system generator tells apart, which is what its
/// `platform` parameter names: [SystemPlatform.desktop] is a PC, a laptop
/// included, and [SystemPlatform.mobile] a phone or a tablet.
const List<SystemPlatform> systemPlatforms = <SystemPlatform>[
  SystemPlatform.desktop,
  SystemPlatform.mobile,
];
