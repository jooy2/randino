# TODO

Work that is planned but not done. A working document: an item is deleted once it has landed in all three packages, the tests, the docs and `tools/parity`, not when the JavaScript side compiles.

Everything here is about `randSentence`. It shipped in the vNext section of the changelogs with the shapes, the verb classes and `include`, and this is the second round of it — the parts that make a sentence read like something a person wrote rather than a well-formed template.

## How to work through this

- **The JavaScript package is the source of truth.** An item lands there first, with its tests, and is then ported to `packages/dart` and `packages/python`.
- **One item, one commit** — or one commit per package where an item is large. `tag: message`, as `CLAUDE.md` describes.
- **`node tools/parity/index.mjs` after every data change.** Every field added to a dataset has to be added to all three dump scripts, or the check reports it as a difference.
- **The demo page is where a change is looked at.** `docs/.vitepress/theme/components/Demo.vue` runs the real library, so a new option belongs in its controls.
- Update this file as you go: check the boxes, and write down what a decision turned out to cost.

## Status

- [x] A. Length bounds are best-effort where they should be exact
- [ ] B. More than one sentence per result, and the sentences hold together
- [ ] C. A person name where a sentence has room for one
- [ ] D. Questions, exclamations and sentences that trail off
- [ ] E. Dialogue and thought, in the language's own quotation marks
- [ ] F. Politeness, which is mostly a Korean question
- [ ] G. Numbers, counters and amounts of money
- [ ] H. An invented noun has no gender, so two languages write no article at all

---

## A. Length bounds are best-effort where they should be exact — done

`randSentence({ language: 'ko', minLength: 30, maxLength: 40 })` returned a 28-character sentence about once in forty. Every phrase was budgeted against pools it does not draw from: `slotBounds` measures the verb pools of every group the language has where one sentence uses one group, and the noun bounds span every theme where one phrase draws from one. The room left for the phrases behind this one was over-stated by the difference, so each phrase claimed less than its share and the last was handed a minimum its own pool could not meet.

What landed:

- The themes and the predicate are settled before any phrase is drawn, and the budget is measured against those.
- An invented word is budgeted against the language's syllable template rather than its pools, a required word's length is exact rather than a range, and a modifier is chosen in the form it agrees in — German was choosing `blau` by its four letters and writing the six of `blauer`.
- `synthWord` builds against the length rather than sampling until something fits. Each piece is chosen from the lengths that leave the rest of the word able to land in the range. A third of the exact lengths English, Spanish, Italian, German and Russian were asked for used to come back wrong; now only the ones the template cannot spell at all do.
- After a miss, a shape whose own range runs past the requested one in the direction that was missed is four times as likely — weighted rather than filtered, so a shape that missed by two characters is still drawn next time.

What is left, and it is not a bug: a range at the very top of what a language can spell is still best-effort, because reaching it needs the longest word of every pool at once. The tests sweep the body of each language's distribution rather than its ends for that reason.

## B. More than one sentence per result, and the sentences hold together

`randSentence({ sentences: 3 })` returns **one** string holding three sentences — `['여우가 사과를 먹는다. 그것은 달다. 여우가 떠난다.']` — not three array entries. `count` stays what it is: how many strings come back.

- `sentences?: number`, default 1, clamped against a new `RAND_SENTENCE_COUNT_MAX` (10 is enough; the length ceiling bounds it anyway).
- `minLength` / `maxLength` describe **the whole string**, whatever the sentence count. The budget is split across the sentences before any of them is drawn, and the last one absorbs the rounding.
- The sentences of one result share a **topic**: the subject noun of the first, its theme and its gender. A later sentence either names it again, refers to it with a pronoun, or draws a fresh subject from the same noun class, and may open with a connective. What it must not do is wander into another class, which is what makes three sentences read as a paragraph rather than three draws.

Data, in `SentenceLanguageData`:

- `connectives: WordPool` — what a sentence opens with when it follows another (`그리고`, `그래서`, `하지만`, `and then`, `そして`, `然后`, `rồi`, `pero`, `poi`, `dann`, `но`).
- `pronouns` — the subject pronoun by gender, nominative only, because that is the only case a subject is ever in. English `it`, Korean `그것`, German `er` / `sie` / `es`, Russian `он` / `она` / `оно`. A language that drops its subject pronoun (Korean, Japanese, Chinese, Spanish, Italian) may also declare the empty string, which is what those languages actually do in a second sentence.

`SentenceDetail` grows two arrays rather than a nested shape, which is what it already does with `phrases` and `slots`:

```ts
export interface SentenceDetail {
    sentence: string;        // every sentence, joined
    sentences: string[];     // one entry per sentence
    phrases: string[];       // every phrase, in order, across all of them
    slots: SentenceSlot[];   // what each phrase does
    types: SentenceType[];   // one entry per sentence (see D)
    language: WordLanguage;
    theme: WordTheme | null; // the topic's theme
}
```

## C. A person name where a sentence has room for one

`randSentence({ includeName: true })` puts a generated person name in a noun phrase whose class is `person`, and writes the sentence without one when the shape it drew has no such phrase. Never forced: a name appears where a name can stand.

- The name comes from `randName`'s generator in the same language — every word language is also a name language, so there is no gap to fill.
- A name is a bare proper noun: no article, no modifier, and the particle Korean puts after it is chosen by `endsWithConsonant` the same way it is for any other word.
- The name's gender is what a modifier and a predicate agree with in Spanish, Italian, Russian and German, so it has to be carried the way a noun's gender already is.
- `SentenceDetail` should report which phrases are names, so a test can assert one appeared.

**The cost, and it is real.** `lib/sentence` does not import `lib/name` today, so a caller who reaches only `randSentence` does not pay for the name pools. A static import makes them part of that reach whether `includeName` is passed or not, roughly doubling what the sentence generator pulls in. There is no dynamic import to hide behind in a synchronous API. Measure it before and after with the same method the 0.4 KB / 33 KB figures in `CLAUDE.md` came from, write the number down, and say so on the docs page.

**It does not weaken the nickname rule.** A nickname is never built from a person name, and that stays true — this is a sentence, the caller asked for it, and it is off by default.

## D. Questions, exclamations and sentences that trail off

`type?: SentenceType | SentenceType[] | 'all'`, default `'statement'`, where the moods are `'statement'`, `'question'`, `'exclamation'` and `'trailing'` (a statement that ends on `…`). `'dialogue'` and `'thought'` join them in E.

**A question is a shape, not a transformation.** That is the same rule the rest of the generator already follows, and it is what keeps the do-support out of the generator: English writes `Does the lion run?` as a shape whose first part carries `head: 'Does'`, and Korean writes `사자가 달리니?` as a shape that is the statement with a different ending on its verb.

- `SentenceFrame.mood?: SentenceMood`, defaulting to `'statement'`. A language writes the question and exclamation shapes it can write, and declares none it cannot.
- `SentenceFrame.tag?: string` — written after the last phrase, before the terminator, with the language's own space in front of it. That is Chinese `吗`, Vietnamese `không` and Japanese `か`, none of which is a phrase.
- `SentenceLanguageData.terminator` becomes `terminators: { statement: '.', question: '?', exclamation: '!', trailing: '…' }`. Spanish opens a question on `¿`, so a mood needs an opener as well.
- Predicates take a different **form**, not a different pool: `VerbGroup` and `StateGroup` gain `forms?: Partial<Record<PredicateForm, WordPool>>`, index-aligned with `words`. English `question` is the base form (`run` beside `runs`); Korean `question` is `달리니` beside `달린다`; Chinese, Vietnamese, Spanish, Italian and Russian declare none, because the form does not change. A test has to assert every declared form pool is the same length as its `words`.

Five of the nine languages need nothing but punctuation for a question. The four that do need more are English (do-support and the base form), German (the verb moves to the front), Korean and Japanese (the ending changes). Write those four carefully and the rest fall out.

Exclamations want an interjection in front of them more often than not — `와, 정말 맛있군!` — so `interjections: WordPool` is worth having, used by exclamation frames alone.

## E. Dialogue and thought, in the language's own quotation marks

`'dialogue'` and `'thought'` join `SentenceType`. Both wrap a sentence in quotation marks; what differs is which marks, and that a spoken line is as often a question as a statement, so the mood underneath is drawn rather than fixed.

- `quote?: 'double' | 'single'` overrides which marks are used. Left out, dialogue takes the language's double marks and thought its single ones.
- `SentenceLanguageData.quotes: { double: readonly [string, string]; single: readonly [string, string] }`. Japanese and Chinese use `「」` and `『』`, not `“”` and `‘’`.
- A quoted line is speech, so it is where politeness (F) actually shows.

Scope it at the marks. A speech tag — `…라고 그는 말했다` — needs a speaker, which is C, and a verb of speaking, which is a pool none of the nine languages has yet. Leave it out and say so.

## F. Politeness, which is mostly a Korean question

`style?: 'plain' | 'polite'`, default `'plain'`, which is what every sentence is written in today.

- Korean is the whole reason: `달린다` beside `달립니다`, and `달리니?` beside `달립니까?`. Written as two more `forms` entries on each group, the same mechanism D introduces, so this item is small once D has landed.
- Japanese is the other one: `走る` beside `走ります`.
- Spanish, Italian, German and Russian have a T-V distinction, but it lives in the second person and every sentence here is third person, so `style` changes nothing in them. English has no such form at all. Say that on the docs page rather than pretending otherwise.
- Combined with a mood, the form key is `politeQuestion` and so on. Fall back along the chain — `politeQuestion` → `question` → `words` — so a language that declares only some of them stays correct.

## G. Numbers, counters and amounts of money

`사과가 12개 있다`, `100,000원의 빚을 갚았다`. Two shapes, and both need data no language has yet.

**A counted noun phrase.** `SentencePart.counted?: boolean`, and `SentenceLanguageData.numeral` says how the language writes it:

- `order` — where the number goes. Korean, Japanese and Chinese put a counter after the noun and its particle (`사과가 12개`); English puts the number in front and pluralizes (`12 apples`).
- `counters` — the counter word per `NounClass`, which is why the classes were worth having: `마리`, `명`, `개`, `권`, `대`. Korean, Japanese, Chinese and Vietnamese.
- `plural` — ordered suffix rules turning a noun into its plural, written the way `agreement` already is, plus the handful of irregulars. English, Spanish and Italian.
- German and Russian declare neither and so carry no counted shape: a German plural is not predictable from the singular, and Russian needs the genitive plural after five. That is the same rule that already keeps German from declaring an object shape.
- A counted phrase drops its article. `12 apples`, not `the 12 apples`.

**An amount of money.** `currency` in the same block — `원`, `dollars`, `円`, `元`, `đồng`, `euros`, `рублей` — and a shape that uses it. Digit grouping is `100,000` in every one of the nine, so one rule covers it. This is the smaller half; do the counted phrase first and this after.

The number itself should be drawn from a range that reads naturally: a handful of apples, a large sum of money. One range per class is too fine; one per `numeral` block is too coarse. Two ranges, a small one for counted things and a large one for money, is probably right.


## H. An invented noun has no gender, so two languages write no article at all

`randSentence({ language: 'es', realism: 'invented' })` writes `Hoy, nuedeiguion tiembla.` where it should write `Hoy, el nuedeiguion tiembla.`, and `Chauquuel denso` where the adjective should agree with whatever gender the noun is taken to have. Italian does the same. German writes the article, because it declares a rule under `n` that the lookup falls back to, but its adjective keeps the base form — `Ein blau …` rather than `Ein blaues …`.

The cause is one line: gender is read out of `nounGender`, which only holds the words in the pools. An invented word is in none of them, so `articleFor` finds no rule and `agree` hands the word straight back. Spanish and Italian declare their articles under `m` and `f` alone, and there is no `n` to fall back to.

The fix is data, in the same shape `agreement` and `articles` already have: `genderRules`, an ordered list of `[ending, gender]` that says what gender a word of that shape is taken to be. Spanish reads `-a`, `-ión` and `-dad` as feminine and everything else as masculine; Italian reads `-a`; Russian reads `-а` / `-я` and `-о` / `-е`. German gender is not predictable from the ending, but `-ung`, `-heit`, `-keit` and `-schaft` are, and a made-up word that matches none of them can be masculine — what matters for a word nobody has seen before is that the article and the adjective agree with each other.

Decide while doing it whether `randModifier` should read the same rules. It documents that a value from outside the pools gets the base form back, and that would change.

---

## Notes for whoever picks this up

- `randSentence` is unreleased. It sits in the vNext section of every changelog, so its shape is still free to change and `SentenceDetail` can grow fields without a deprecation.
- The three ports are not optional. A feature that lands only in JavaScript is the failure mode this repository is built to avoid, and `tools/parity` only catches the data half of it.
- Run the sentence suite twenty times before calling any of this stable. The generator is random and a one-in-a-thousand shape will find CI otherwise.
