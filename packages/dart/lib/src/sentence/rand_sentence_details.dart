import 'dart:math';

import 'package:randino/src/sentence/sentence_generator.dart';
import 'package:randino/src/types.dart';

/// Generate sentences along with the pieces each one was built from.
///
/// A second function rather than an option, because Dart has no way to make one
/// function's return type depend on an argument. It takes the same parameters as
/// `randSentence` and returns a [SentenceDetail] per sentence — the phrases in
/// order, what each of them does, the language and the subject's theme.
///
/// The particles are left out of [SentenceDetail.phrases], so joining them back
/// does not reproduce the sentence.
///
///
/// [sentences] puts more than one sentence in one result — they come back as one
/// string, and `count` is still how many strings there are. They tell one story:
/// a later sentence is about the first one's subject, names it again or refers to
/// it with a pronoun, and what it says follows from what the ones before it said.
/// `minLength` and `maxLength` describe the whole string whatever this is.
///
/// [includeName] writes a generated person's name where a sentence has room for
/// one — `Emma runs quietly.`, `민준이 조용히 달린다.` It narrows the subject to
/// the themes that name people; a [theme] you named yourself still wins. The
/// name is a bare given name, and it carries its own gender, so what agrees with
/// a subject agrees with it.
///
/// [type] says what the sentences are doing — saying something, asking it,
/// exclaiming it, quoting somebody, or trailing off. A null set, or one holding
/// more than one kind, decides per sentence, and that decision is weighted rather
/// than even, because prose is: a statement is far and away the most likely, a
/// line somebody says comes next, and a question or an exclamation is the rarest
/// of them. A language answers with what it has: five of the nine write a
/// question with nothing but the mark, and the four that need more — English's
/// do-support, German's verb moving to the front, Korean's and Japanese's
/// endings — say so in their own shapes.
///
/// [sentences] is how many sentences one result holds, and a result of several
/// reads as one paragraph rather than as several draws that landed together. It
/// keeps the register it opened in, so a scene of speech is lines with prose
/// between them; it spends its verbs before it repeats one; it names a person and
/// then leaves them alone; and it never opens two of its sentences on the same
/// word.
///
/// [quote] overrides which quotation marks a `dialogue` or a `thought` is
/// written in. Left out, dialogue takes the language's first-level marks and
/// thought its second-level ones.
///
/// [style] is the speech level the sentence is written at, drawn per result when
/// left out so that two calls are not the same voice twice. Korean and Japanese
/// are the two languages this changes — `달린다` becomes `달려`, `달려요` or
/// `달립니다`, question and exclamation included — and the other seven write the
/// same sentence at every level.
///
/// [tense] is when it happened, drawn per result when left out so that a
/// paragraph is told in one tense throughout. `SentenceTense.past` is how a story
/// is told: `여우가 시장으로 갔다`, `The fox went to the market`. Every language
/// writes it the way its own grammar does — a changed verb, a verb that agrees
/// with its subject, or a word beside a verb that does not change.
///
/// [story] is which story a result of several sentences tells, drawn per result
/// when left out from the stories the language can tell about the subject asked
/// for. With [sentences] above 1 the sentences are one sequence of things that
/// happen — the hero goes somewhere, finds something there, brings it back — and
/// what each sentence says follows from what the ones before it said. Ignored by
/// a result of one sentence.
///
/// ```dart
/// randSentenceDetails(language: WordLanguage.ko);
/// // [SentenceDetail(검은 고양이가 숲에서 잠잔다., [검은 고양이, 숲, 잠잔다], ko, animal)]
/// ```
List<SentenceDetail> randSentenceDetails({
  WordLanguage? language,
  WordTheme? theme,
  SentenceShape? shape,
  Set<SentenceSlot>? slots,
  List<String> include = const <String>[],
  int count = 1,
  RandRealism realism = RandRealism.real,
  RandVocabulary vocabulary = RandVocabulary.common,
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
  int sentences = 1,
  bool? includeName,
  Set<SentenceType>? type,
  SentenceQuote? quote,
  SentenceStyle? style,
  SentenceTense? tense,
  SentenceStory? story,

  /// Where the randomness comes from: `Random.secure()` for a value nobody may
  /// predict, `Random(42)` for one that has to come out the same every run.
  Random? random,
}) => generateSentenceDetails(
  language: language,
  theme: theme,
  shape: shape,
  slots: slots,
  include: include,
  count: count,
  realism: realism,
  vocabulary: vocabulary,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
  sentences: sentences,
  includeName: includeName,
  type: type,
  quote: quote,
  style: style,
  tense: tense,
  story: story,
  random: random,
);
