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

- [ ] `SentenceStyle` becomes four levels rather than two: `plain` (해라체),
      `casual` (해체), `polite` (해요체), `formal` (합쇼체). The old `'polite'`
      meant 합쇼체 and becomes `formal`.
- [ ] A form pool entry may list alternatives with `|`, one of which is drawn.
      That keeps `forms` index-aligned with `words` — which is what lets a
      required word be translated by position — while `달리니|달리나|달리는가`
      is still one entry for one verb.
- [ ] Korean writes the levels it actually has, per mood: question endings
      beyond `~니?`, and an exclamation ending of its own (`~구나!`, `~네!`,
      `~군!`) rather than a statement with a mark.
- [ ] Japanese maps its two forms onto the four levels; the other seven declare
      nothing and every level gives the same sentence back, the way `polite`
      already behaves there.
- [ ] Dialogue and thought stop being a quoted statement. A line somebody says
      is drawn at a spoken level, a thought at the levels a person thinks in,
      with the endings that go with them.

## C. Random is the default

- [ ] `type` defaults to all six rather than `'statement'`, `style` to a level
      drawn per result, and `includeName` to a coin flip. `realism`, `count`,
      `sentences` and the lengths keep the defaults they have — `'real'` is what
      the other three generators default to and a paragraph of ten is an ask.
- [ ] The demo gets the same: every select that can be random says so, and says
      so by default.

## D. A paragraph remembers its scene

`"채영이 홀로 뒹군다!" 그리고 드무니? 채영이 사이더를 맛보니? "곧 다솜이 살며시
쉰다!"` — the person changes, a sentence loses its subject, and the mood flips
every line. The topic carries the subject and nothing else; the object, the
place and the time are drawn fresh each sentence.

- [ ] The topic becomes the scene: the subject, and whatever else the first
      sentence put on the page. A place or a thing that has been named stays
      that place or that thing.
- [ ] A name that has been introduced is the person the rest of the paragraph is
      about. A fresh person is a new name, so `fresh` is not what a paragraph
      about somebody should mostly draw.
- [ ] The mood is the paragraph's, not the sentence's. A line of dialogue
      followed by a thought followed by a question is four moods in four
      sentences, and no paragraph reads like that.

## E. A sentence can be about a date, a time or an amount

- [ ] `date` and `clock` slots, written the way each language writes them
      (`2026년 9월 5일에`, `11시 40분에`).
- [ ] A copular shape — `약속 시간은 11시 40분이다.` — which is a frame family
      none of the nine has yet. A language declares it only if it can write it.

## F. More shapes, and more ways to say the same thing

- [ ] More frames per language, so one shape does not carry most of the output.
- [ ] Wider `connectives`, `interjections`, `manners` and `times` pools.
