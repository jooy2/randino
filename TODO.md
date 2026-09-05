# TODO

A second round on `randSentence`, from reading its Korean output. Every item is
its own commit; the JavaScript package is the source of truth and the two ports
follow it. `node tools/parity/index.mjs` after every data change, and every new
dataset field goes into all three dump scripts.

`randSentence` is still unreleased (`vNext`), so a default or a vocabulary can
change without costing anything.

## Working rules

- One item, one commit — or one commit per package where an item is large.
- The demo runs the real library, so a new option belongs in its controls.
- Korean first where an item is about Korean grammar, then the other eight.
  "A language declares only what it writes correctly" still decides what each
  one gets.
- Run the sentence suite 20+ times before calling anything stable.
- Check the boxes as you go, and write down what a decision turned out to cost.
- An item is deleted only once it has landed in all three packages, the tests,
  the docs and `tools/parity`.

## A. A number and its counter are written together

`증류주 6 개`, `골인 9 번` and `300,000 원` are all wrong: Korean attaches a
counter and a currency to the digits in front of it. Japanese and Chinese are
already right because their `space` is empty, and Vietnamese, English, Spanish
and Italian genuinely do write the gap — so this is not one rule, it is a thing
each language declares.

- [x] `SentenceNumeral` gains `gap`, the string between the number and what it
      counts. `''` for `ko`, `ja` and `zh`; `' '` for `vi`, `en`, `es`, `it`.
- [x] `countText` and `moneyText` read it instead of `data.space`.
- [x] All three packages, all three parity dumps, and a test that asserts the
      Korean output has no space in it.

The length budget reads it too — `countSpan` and `moneySpan` were adding
`data.space.length` for a gap that is now empty in three languages, which would
have made every counted phrase in them reserve a character it never writes.

## B. `style` becomes the speech level, and the endings vary

Every plain question ends `~니?` and every polite one `~ㅂ니까?`; an exclamation
is a statement with `!` after it. Korean does not work that way.

- [x] `SentenceStyle` becomes four levels rather than two: `plain` (해라체),
      `casual` (해체), `polite` (해요체), `formal` (합쇼체). The old `'polite'`
      meant 합쇼체 and becomes `formal`.
- [x] A form pool entry may list alternatives with `|`, one of which is drawn.
      That keeps `forms` index-aligned with `words` — which is what lets a
      required word be translated by position — while `달리니|달리나|달리는가`
      is still one entry for one verb.
- [x] Korean writes the levels it actually has, per mood: question endings
      beyond `~니?`, and an exclamation ending of its own (`~구나!`, `~네!`,
      `~군!`) rather than a statement with a mark.
- [x] Japanese maps its two forms onto the four levels; the other seven declare
      nothing and every level gives the same sentence back, the way `polite`
      already behaves there.
- [x] Dialogue and thought stop being a quoted statement. A line somebody says
      is drawn at a spoken level, a thought at the levels a person thinks in,
      with the endings that go with them.

What it cost, and what came out of it:

- **Six form keys, not the twelve a level-by-mood matrix would need.** 해체 and
  해요체 have no separate question or exclamation — `달려` asks and tells alike
  — so each of them is one pool. That, and the `|` alternatives, is what kept
  Korean to three new pools per group rather than nine: 147 predicates written
  out four more ways, against 147 × 9 if every mood needed its own.
- **The random default for `style` landed here rather than in C**, because
  `styleFor` has to answer "what level is this line" for a dialogue line whether
  or not the caller named one. Splitting it would have meant writing the same
  decision twice.
- Nine tests across each suite assumed two levels. The ones that pin a form now
  pin a level with it, and the ones that only wanted "is this a predicate at all"
  read every form of the group. The 해라체 and 해체 halves of the level test are
  asserted by what they never write (a polite ending) rather than by a pattern
  over their endings, which would only have restated the pool.
- A first pass had `아름답니?` and `작니?`. An adjective takes `-(으)니`, so the
  ㅂ-irregular stems soften (`아름다우니`) and the other consonant-final ones take
  the `으` (`작으니`). Nineteen entries fixed before the data was generated.

## C. Random is the default

- [x] `type` defaults to all six rather than `'statement'`, `style` to a level
      drawn per result, and `includeName` to a coin flip. `realism`, `count`,
      `sentences` and the lengths keep the defaults they have — `'real'` is what
      the other three generators default to and a paragraph of ten is an ask.
- [x] The demo gets the same: every select that can be random says so, and says
      so by default.

What it cost, and the four bugs the new default turned up:

- **A drawn kind has to be chosen against the room the sentence has.** A
  question is a different shape and a quoted line pays for its marks out of the
  same budget, so drawing the kind first and discovering that afterwards gave
  `‘Họa sĩ có ồn ào không?’` out of a range of 12 to 17. `kindFor` filters the
  kinds to the ones whose shapes fit, and falls back to all of them the way
  every other narrowing here does.
- **A name is settled the same way.** A named sentence is much shorter than an
  unnamed one — `Yvonne` where a noun phrase writes `die schlanke Wolke` — so
  `roomFor` measures a named result against the name's own lengths and
  `nameFits` declines to draw one into a range only the longer shape can reach.
- **`includeName` was writing over a word `include` had named.** `include:
  '깜냥이'` came back as a sentence that did not contain `깜냥이`. A requirement
  holds its place now.
- **A word required into a counted subject lost its theme.** A counted shape has
  no `subject` part — its quantity is the subject — and `requiredAt` was looking
  for one regardless, so `사과` was counted in `명`.
- Thirty-odd tests across the three suites read the old default. The ones about
  something else pin `type: 'statement', includeName: false`; the ones about the
  defaults were rewritten to assert what is drawn. The narrow-range sweep now
  samples its windows from one kind, because the middle 90% of a bimodal
  mixture is a band neither mode covers.
- The German short-shape miss is at four characters rather than three now.
  Measured at zero in 22,200 draws of that sweep; the cause is unchanged and
  written in the test — the fitting reweights the shape after a miss but not
  the theme.

## D. A paragraph remembers its scene

`"채영이 홀로 뒹군다!" 그리고 드무니? 채영이 사이더를 맛보니? "곧 다솜이 살며시
쉰다!"` — the person changes, a sentence loses its subject, and the mood flips
every line. The topic carries the subject and nothing else; the object, the
place and the time are drawn fresh each sentence.

- [x] The topic becomes the scene: the subject, and whatever else the first
      sentence put on the page. A place or a thing that has been named stays
      that place or that thing.
- [x] A name that has been introduced is the person the rest of the paragraph is
      about. A fresh person is a new name, so `fresh` is not what a paragraph
      about somebody should mostly draw.
- [x] The mood is the paragraph's, not the sentence's. A line of dialogue
      followed by a thought followed by a question is four moods in four
      sentences, and no paragraph reads like that.

How it landed:

- **The scene is a map of requirements, not a new mechanism.** `planFor` already
  took the repeated subject and put it in its own slot; it takes a map now, and
  the place and the object go in beside it. Everything downstream — the plan,
  the exact-length budget, the article and the modifier — was already written
  for a required word.
- **The bare noun rather than the phrase.** A later sentence writes its own
  article and may put a different modifier in front, so `in the icy hamlet`
  becomes `in the hamlet` rather than repeating the words. That reads as the
  same place, which is what was wanted.
- **`fresh` is gone for a named topic.** Nothing else was needed: English has no
  pronoun for a person the pools can gender, so it repeats the name; Korean and
  the four others that drop their subject stand nothing there.
- **The register, not the type.** Keeping the exact type would have made a
  paragraph a list. Quoted and narrated are the two registers, and inside the
  narrated one the type still varies with the opening one preferred.
- Two more that fell out of it: a topic pinned to `subject` was dropped by a
  counted shape, which has no `subject` part, and `서호 3명` counted somebody's
  name. `planFor` reads `subjectSlotOf` now, and a counted shape is left out
  when a name is asked for.

## E. A sentence can be about a date, a time or an amount

- [x] `date` and `clock` slots, written the way each language writes them
      (`2026년 9월 5일에`, `11시 40분에`).
- [x] A copular shape — `약속 시간은 11시 40분이다.` — which is a frame family
      none of the nine has yet. A language declares it only if it can write it.

What the copula turned out to be:

- **A predicate, not a word.** It has to change for the level and the mood the
  way a verb does, or a copular sentence is the one flat thing in a library that
  just stopped being flat. So `SentenceCalendar.copula` is a `StateGroup` with
  one entry and its forms, and it states its subject classes the way a verb
  group does — which is what keeps `버기는 11시 40분이다` out.
- **Written onto the phrase, not standing as one.** `11시 40분이다` is one word
  in Korean and `is at 11:40` is two in English, so a slot of its own would have
  had to be written with no space in front, which nothing else does.
  `SentencePart.copula` says which side instead, and a copula in front still
  lets the phrase keep its own preposition (`ist am 5. März`).
- **A shape with neither a verb nor a state is a copular one.** No flag needed:
  every other shape has one or the other, so the absence is the signal.
- Russian is the one language that declares no calendar. It equates with a dash,
  and a dash does not change for a question or a level.

## F. More shapes, and more ways to say the same thing

- [ ] More frames per language, so one shape does not carry most of the output.
- [ ] Wider `connectives`, `interjections`, `manners` and `times` pools.
