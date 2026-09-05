import 'package:randino/src/sentence/sentence_generator.dart';
import 'package:randino/src/types.dart';

/// Generate whole sentences — a subject and something said about it, written the
/// way the language writes it.
///
/// The words are the same everyday vocabulary `randWord` draws from, and person
/// names are never used. A verb states what can do it and what it can be done
/// to, so the words of one sentence belong together: `여우가 사과를 먹는다`
/// comes out, and the same shape never puts an idea where the apple is.
///
/// Every parameter is optional. A null [language] mixes every supported
/// language, a null [theme] draws its subject from every theme, and a null
/// [shape] leaves the size of the sentence to the language's own frame weights.
///
/// [slots] names the parts a shape may carry beside its subject — an object, a
/// place, a time, a manner, a state. A shape qualifies when it carries at least
/// one of them, an empty set asks for a subject and its predicate alone, and a
/// language with no shape for what was asked answers with the closest it has.
///
/// [include] lists words the sentence has to contain, each at least once. A word
/// the pools hold goes in the phrase it belongs to; a word from anywhere else is
/// used as a noun.
///
///
/// [sentences] puts more than one sentence in one result — they come back as one
/// string, and `count` is still how many strings there are. They are about the
/// same thing: a later sentence names the first one's subject again, refers to
/// it with a pronoun, or draws a fresh subject of the same kind, and may open on
/// a connective. `minLength` and `maxLength` describe the whole string whatever
/// this is.
///
/// [includeName] writes a generated person's name where a sentence has room for
/// one — `Emma runs quietly.`, `민준이 조용히 달린다.` It narrows the subject to
/// the themes that name people; a [theme] you named yourself still wins. The
/// name is a bare given name, and it carries its own gender, so what agrees with
/// a subject agrees with it.
///
/// [type] says what the sentences are doing — saying something, asking it,
/// exclaiming it, or trailing off. A set of them decides per sentence, and null
/// means statements. A language answers with what it has: five of the nine write
/// a question with nothing but the mark, and the four that need more — English's
/// do-support, German's verb moving to the front, Korean's and Japanese's
/// endings — say so in their own shapes.
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
/// ```dart
/// randSentence(language: WordLanguage.ko, count: 2);
/// // ['검은 고양이가 숲에서 잠잔다.', '여우가 사과를 먹는다.']
/// randSentence(language: WordLanguage.en);
/// // ['The brave lion runs quietly.']
/// randSentence(language: WordLanguage.en, shape: SentenceShape.simple);
/// // ['The otter swims.']
/// randSentence(language: WordLanguage.ko, include: <String>['사자']);
/// // ['사자가 새벽에 떠난다.']
/// ```
List<String> randSentence({
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
  int sentences = 1,
  bool? includeName,
  Set<SentenceType>? type,
  SentenceQuote? quote,
  SentenceStyle? style,
}) =>
    generateSentenceDetails(
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
      sentences: sentences,
      includeName: includeName,
      type: type,
      quote: quote,
      style: style,
    ).map((detail) => detail.sentence).toList();
