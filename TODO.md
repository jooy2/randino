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
- [x] B. More than one sentence per result, and the sentences hold together
- [x] C. A person name where a sentence has room for one
- [x] D. Questions, exclamations and sentences that trail off
- [x] E. Dialogue and thought, in the language's own quotation marks
- [x] F. Politeness, which is mostly a Korean question
- [x] G. Numbers, counters and amounts of money
- [x] H. An invented noun has no gender, so two languages write no article at all

---

## A. Length bounds are best-effort where they should be exact — done

`randSentence({ language: 'ko', minLength: 30, maxLength: 40 })` returned a 28-character sentence about once in forty. Every phrase was budgeted against pools it does not draw from: `slotBounds` measures the verb pools of every group the language has where one sentence uses one group, and the noun bounds span every theme where one phrase draws from one. The room left for the phrases behind this one was over-stated by the difference, so each phrase claimed less than its share and the last was handed a minimum its own pool could not meet.

What landed:

- The themes and the predicate are settled before any phrase is drawn, and the budget is measured against those.
- An invented word is budgeted against the language's syllable template rather than its pools, a required word's length is exact rather than a range, and a modifier is chosen in the form it agrees in — German was choosing `blau` by its four letters and writing the six of `blauer`.
- `synthWord` builds against the length rather than sampling until something fits. Each piece is chosen from the lengths that leave the rest of the word able to land in the range. A third of the exact lengths English, Spanish, Italian, German and Russian were asked for used to come back wrong; now only the ones the template cannot spell at all do.
- After a miss, a shape whose own range runs past the requested one in the direction that was missed is four times as likely — weighted rather than filtered, so a shape that missed by two characters is still drawn next time.

What is left, and it is not a bug: a range at the very top of what a language can spell is still best-effort, because reaching it needs the longest word of every pool at once. The tests sweep the body of each language's distribution rather than its ends for that reason.

## B. More than one sentence per result, and the sentences hold together — done

`randSentence({ sentences: 3 })` returns **one** string holding three sentences, `count` still says how many strings come back, and `minLength` / `maxLength` describe the whole string — shared out across the sentences before any of them is drawn, with the last absorbing the rounding.

What landed, and what it turned out to cost:

- `sentences`, clamped against `RAND_SENTENCE_COUNT_MAX` (10). **`RAND_SENTENCE_LENGTH_MAX` became a ceiling per sentence rather than per result**, which was not in the plan: capping a ten-sentence paragraph at 200 characters answers the ask with ten sentences of twenty, which is not what anyone means by it.
- The topic is the first sentence's subject, its theme, its class and its gender. A later sentence repeats it, stands a pronoun where it was, or draws a fresh noun of the same class — `repeat` / `pronoun` / `fresh`, weighted 25 / 40 / 35.
- `connectives` and `pronouns` per language, as planned. Two things the plan did not have:
  - **`pronounless`**, the classes a language's written pronoun is wrong for. English is the reason — `he` and `she` need a gender a job noun does not carry, and `they` needs a plural verb the pools are not written in — and `그것`, `それ`, `它` and `nó` are inanimate, so those four list `person` too. A pronoun reference for such a class narrows to the empty entry: the language drops the subject where it can, and names the topic again where it cannot.
  - **German's `connectives` are the coordinating ones alone** (`und`, `aber`, `doch`, `denn`). Anything else — `dann`, `danach`, `schließlich` — takes the first position of the clause and sends the finite verb behind it, and German already has a time-first frame, so a connective in front would have put two constituents before the verb. A connective cannot bolt a shape on; the frames write shapes.
- **A dropped subject removes the whole phrase**, not just its word — its article, its modifier and its particle with it, or `가 달린다` comes out. `compose` builds its own list of the parts the sentence actually writes, keyed back to the frame for the plan, and every budget below it is measured against that list rather than against the frame.
- **A connective has to be reserved before the sentence is drawn.** It is written in front of a whole sentence rather than instead of any part of it, so one the budget cannot spare overshoots the range by exactly its length; Russian `тем временем` is thirteen characters, and a third of a range of seventy-five has nowhere to put them. `followFor` only offers the connectives that leave room for the shortest sentence the shapes could spell — and because that floor needs the shortest word of every pool at once and no draw reaches it, a sentence that still misses is rebuilt without the connective. Both were found by the `ru x3 40-75` case failing one run in five.
- `SentenceDetail` grew `sentences` alone; `types` waits for D.

The demo page has the control, the length placeholders scale with it, and `tools/parity` compares `connectives`, `pronouns` and `pronounless` across all three packages.

## C. A person name where a sentence has room for one — done

`randSentence({ includeName: true })` writes a generated person's name where the sentence has room for one, and writes the sentence without one when it does not.

What landed:

- **The option narrows the subject rather than forcing a phrase.** A name can only stand where a person could, so turning it on narrows the subject to the person-class themes — which is one line in `subjectThemesFor`, and everything downstream follows from it: the verb groups filter to the ones that take a person subject, and so do the shapes. A `theme` the caller named still wins, so `theme: 'animal'` with `includeName` is a sentence about a lion and carries no name.
- **Only the subject.** No language's verb groups declare `person` as an object class and no frame puts a person in a place phrase, so an object or a place is never a person and biasing them would buy nothing. That is why the change is as small as it is.
- **A bare given name**, not the full name `randName()` would give: a sentence about someone uses the name they are called by, and a surname in every clause reads like a roster. No article, no modifier, and Korean's particle chosen by `endsWithConsonant` on the name itself.
- **The gender comes with it.** A name is in no pool, so `genderOf` has nothing to read; `properName` hands back the gender the name was drawn for, and only for a language whose words agree at all. `Celeste è affamata` beside `Ivano è raro`, and the three suites assert it against the given-name pools.
- `startsWith` reaches the name too, through `randName`'s own `startsWith`.
- `SentenceDetail.names`, and a named subject reports `theme: null` — a name belongs to no theme. `Topic` carries `named`, so a paragraph's `repeat` writes the name again rather than putting an article in front of it, and a name subject fixes the topic's class to `person` without a theme to derive it from.

**The cost, measured.** Bundling only `randSentence` with esbuild and gzipping, the way `CLAUDE.md`'s 0.4 KB / 33 KB figures were: **122.5 KB before, 144.5 KB after — +22.0 KB, +18%**, paid by every caller of `randSentence` whether they pass the option or not.

The plan guessed this would roughly double what the generator pulls in. **It does not, and the guess was wrong for an interesting reason**: the sentence generator already carries the whole word pools, which is 110 KB of the 122.5, and the name pools are 22 KB beside them. What doubles is a bundle that reaches `randName` alone (22.3 KB); a bundle that already reaches a sentence barely notices. The number is written down on the docs page, in an admonition rather than a footnote, because it is the kind of thing a reader finds out too late.


## D. Questions, exclamations and sentences that trail off — done

`type` takes `'statement'` (the default), `'question'`, `'exclamation'` and `'trailing'`, one of them, a set of them, or `'all'` — decided per sentence, so a paragraph can ask something and then answer it. `SentenceDetail.types` reports which each one was.

What landed, and what the plan got right:

- **`SentenceFrame.mood` and `SentenceFrame.tag`, as written.** The plan's own line — "write those four carefully and the rest fall out" — held exactly. English needed do-support and the base form, German the verb in the first position, Korean the ending, and Japanese, Chinese and Vietnamese a tag. Spanish, Italian and Russian declare no question shape at all, and the existing fall-back to the statement shapes is not a compromise there: for those three the question **is** the statement.
- `terminators` and `openers`, `VerbGroup.forms` / `StateGroup.forms`, and `interjections`, all as planned. The form pools are index-aligned with `words`, and that alignment earns itself twice: once for the length budget, and once for `include: '달린다'` with `type: 'question'`, which comes out `달리니?` rather than `달린다?` because the required word can be translated by its position.
- **English states need no form at all**, which the plan did not say. `Is the lion brave?` moves `is` into the shape and leaves `brave` alone, so only English's verbs got a form pool. That is 99 base forms for English and 154 `-니` forms for Korean, and nothing else in any language.

Three things the plan did not have:

- **An exclamation is not its own shape.** A statement's shape plus the mark and an interjection is what an exclamation is in all nine languages, so `SentenceMood` has two values rather than three and only questions declare shapes of their own. Writing exclamative endings — Korean `-구나`, Japanese `-なあ` — would be another 300 hand-written forms for a mood the punctuation already carries.
- **What a sentence opens on is one decision, not two.** An interjection and a connective are the same thing in two moods, and a sentence never wants both, so `openerFor` replaced the connective half of `followFor` and the budget reservation is written once.
- **`frameRange` measures against the longest mark the language writes**, not the statement's. `…` is one character in every language here and `。` is one too, but Spanish `¿…?` is two, and a shape chosen against the shorter one is a shape that overshoots.

The derivation was mechanical and then read by eye: Korean's `-니` follows two rules (`-는다` → `-니`, and dropping the `ㄴ` coda otherwise), with the ㄹ-irregular `달다` → `다니` the only exception; English's base forms needed two hand-fixes, `dozes` → `doze` and `aches` → `ache`, where the `-es` rule fires on a stem that already ends in a silent `e`.

## E. Dialogue and thought, in the language's own quotation marks — done

`'dialogue'` and `'thought'` join `SentenceType`, both wrap a sentence in quotation marks, and `quote` overrides which pair. Scoped at the marks, as planned: there is no speech tag, and the docs page says so.

What landed:

- **`SentenceMark` is the type the plan implied but did not name.** Dialogue and thought have no mark of their own, so `terminators` and `openers` are keyed by the four kinds that do, and `Draw` carries `mark` beside `type` — what the caller asked for, and what the sentence actually closes on. TypeScript writes it as `Exclude<SentenceType, 'dialogue' | 'thought'>`, Python as its own `Literal`, and Dart says it in a doc comment, which is the usual three-way split.
- `quotes` per language, as planned — and **one correction to the plan's data**. It named `「」` and `『』` for Chinese as well as Japanese; these pools are simplified Chinese, and horizontal simplified text writes `“”`. The corner brackets are Taiwan and Hong Kong. The comment in `zh.ts` says so.
- The plan named only Japanese and Chinese as the interesting cases; German turned out to be one too (`„…“` opens low and closes high, so the pair is not symmetrical), as did Spanish, Italian and Russian, which reach for guillemets before anything else.
- The mark under a quote is drawn from statement, question and exclamation. `trailing` is left out of that set: a quoted line that trails off reads as an unfinished quotation rather than as somebody trailing off, and three is enough for the property the plan wanted — that a spoken line is as often a question as a statement. The three suites assert exactly that over 200 lines.

## F. Politeness, which is mostly a Korean question — done

`style` takes `'plain'` (the default) and `'polite'`, written as two more `forms` entries on each group. The plan called this small once D had landed, and it was: the generator change is one function.

What landed:

- **Korean and Japanese, and nothing else.** The plan's read was right on all seven other languages, and the suites now assert it rather than the docs merely claiming it: the languages that declare polite forms are exactly the languages whose sentences change under `style`.
- **The fallback chain is one step longer than planned.** `politeQuestion` → **`polite`** → `question` → `words`, rather than `politeQuestion` → `question` → `words`. That extra step is what lets Japanese declare `polite` alone — `走ります` is its polite question too, because the `か` that asks is the frame's tag rather than part of the verb — instead of duplicating an 88-entry pool under a second key in three packages. Korean declares both keys, so the chain never reaches past `politeQuestion` there.
- **Korean derives, Japanese does not.** Korean's `-ㅂ니다` / `-습니다` follows from the stem and its coda, with `ㄹ` dropping first (`달다` → `답니다`, `낯설다` → `낯섭니다`); every one of the 308 forms was generated and then read. Japanese's masu form needs the verb's conjugation class, which the plain form does not carry — `集める` is ichidan and `滑る` is godan and both end in `る` — so all 88 are written out by hand. The adjectives derive (`だ` → `です`, else `+ です`).

## G. Numbers, counters and amounts of money — done

`slots` gains `'quantity'` and `'money'`. `SentenceLanguageData.numeral` says how a language writes a number: where it stands, the counter each noun class takes, what money is counted in, what separates the thousands, and the two number ranges.

**The survey rewrote the plan, and this is the item where reading the data first mattered most.** The plan had counted phrases in seven languages with `plural` rules for English, Spanish and Italian. Reading the English pools before writing anything showed the plural is the *smaller* half of that problem:

- Already-plural entries: `Goggles`, `Scissors`, `Trousers`, `Crossroads`, `Physics`, `Darts`, `Bleachers`.
- Mass nouns: `Bacon`, `Cotton`, `Spinach`, `Brass`, `Moss`, `Grief`, `Slush`.
- Abstractions: `Sadness`, `Loneliness`, `Kindness`, `Wistfulness`.

A plural rule turns those into `12 goggleses`, `12 bacons` and `12 sadnesses`. **Nothing in any pool says which nouns are countable**, and adding that tag is 2,700 nouns × nine languages — a dataset the size of the noun pools themselves, for one shape. So `plural` is gone from the design, and the counted shape is the four languages with a `counters` table: a classifier is what makes a noun countable, and `슬픔 12 가지` is twelve kinds of sadness. Every one of the ten classes has a counter in all four, so those languages can count anything in their pools.

Money has no countability question — it counts money — so it is every language with an object shape, which is seven. German and Russian have none, for the case reason that already keeps them from declaring an object shape at all.

Three smaller corrections to the plan:

- **Digit grouping is not `100,000` everywhere.** Vietnamese, Spanish and Italian group on a full stop, so `group` is per language. That also cost the multi-sentence test an assumption: `5.000.000` holds three full stops and none of them is a terminator.
- **Amounts are a pool, not a range.** A range hands back `73,412 dollars`, and nobody writes that. `count` stays a range, because every small integer reads fine.
- **A quantity is sometimes the subject.** `사과 12 개가 익는다` has no separate subject, so `subjectSlotOf` and `takesObject` read the shape rather than looking for a `subject` part — without that, the counted subject was drawn from the verb's *object* classes and Korean produced `카푸치노 4 개가 먹는다`.

The suites gained `sentenceOf`, which walks the flat `phrases` list back into sentences: a counted phrase is the subject of its own sentence only when that sentence has none, and the flat lists cannot say which sentence a phrase is in without it.

## H. An invented noun has no gender, so two languages write no article at all — done

`randSentence({ language: 'es', realism: 'invented' })` wrote `Hoy, nuedeiguion tiembla.` with no article at all, and `Chauquuel denso` with the adjective in whatever form the pool stored. Italian did the same; German wrote its article, because it declares a rule under `n` that the lookup falls back to, but kept the base adjective — `Ein blau …`.

`genderRules` is what a language now says about a word it has never seen, in the same ordered `[ending, gender]` shape `agreement` and `articles` already have. Spanish reads `-a`, `-ión`, `-dad`, `-tad`, `-umbre` and `-triz` as feminine; Italian `-a`, `-zione` and `-tà`; Russian `-а` / `-я` and `-о` / `-е`; German the four suffixes that are predictable, and everything else as masculine. `randModifier` reads them too, so `randModifier('casa', { language: 'es' })` is `casa cálida`.

Two more things turned up while doing it, and both are fixed:

- An invented word was not written the way its pool is. German capitalizes its nouns and nothing else, so it writes them capitalized in the pool rather than setting `capitalize` — and `drawWord` only ever consulted `capitalize`, so `randWord({ language: 'de', realism: 'invented' })` came back `mütert` beside the `Klugheit` of the pools. `poolCapitalizes` reads it off the pool, the way `modifierFollows` reads a word order off the frames.
- An invented word was rarely the length it was asked for. See A.


---

## Notes for whoever picks this up

- `randSentence` is unreleased. It sits in the vNext section of every changelog, so its shape is still free to change and `SentenceDetail` can grow fields without a deprecation.
- The three ports are not optional. A feature that lands only in JavaScript is the failure mode this repository is built to avoid, and `tools/parity` only catches the data half of it.
- Run the sentence suite twenty times before calling any of this stable. The generator is random and a one-in-a-thousand shape will find CI otherwise.
