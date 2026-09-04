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
  int? minLength,
  int? maxLength,
  String? startsWith,
  bool unique = false,
}) => generateSentenceDetails(
  language: language,
  theme: theme,
  shape: shape,
  slots: slots,
  include: include,
  count: count,
  realism: realism,
  minLength: minLength,
  maxLength: maxLength,
  startsWith: startsWith,
  unique: unique,
);
