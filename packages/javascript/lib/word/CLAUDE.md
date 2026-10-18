# Words

Notes on how the word pools and `randWord` behaves and why, for whoever changes it. They describe the npm package, which is the source of truth, and hold for the Dart and Python ports too: a behaviour that lands in one lands in all three. The repository's own `CLAUDE.md` covers everything that is not one generator's.

## A draw reads a pool, it does not rework it

A pool is a module constant, so what is worked out from one is kept with it: its bounds (`poolBounds`), what it holds on a first character (`startingWith`), the adjectives and actions joined (`modifiersOf`), and a name pool by the length of its names (`lengthsOf` in `name/`). `pickWord` draws straight from the pool when the range takes all of it, which is every call that names no length. Working any of these out again per draw copied the pool each time, and `randModifier` was forty times slower for it. A cache keyed on a pool's identity needs a pool that keeps its identity, which is why `randModifier` joins its data once per language rather than spreading it into a fresh object per call.

## Adding a word language

Every name language now has word pools too (`ko`, `en`, `ja`, `zh`, `vi`, `es`, `it`, `de`, `ru`), and neither word order nor agreement is a bar any more:

- **Word order lives in the frames.** Vietnamese, Spanish and Italian put the modifier after the noun (`mèo xanh`, `gato azul`) and Vietnamese puts the possessed thing in front of its owner (`đuôi mèo`); both say so in their own `frames`. `modifierFollows` reads that back out of the frames so `randModifier` attaches on the right side, rather than a second field stating an order the frames could contradict.
- **Agreement lives in the data.** A language that inflects tags each noun (`gato:m luna:f`), and `agreement` lists the endings a modifier changes per form. `taggedNouns` splits the tag back off so each word is still typed once, and `agree` applies the first rule that matches — a word no rule matches is already right (`azul`). Rules rather than a function, so `tools/parity` compares them as data. `randModifier` reads the same table: a value it finds in the pools carries a gender, and a value from anywhere else gets the base form back.
- **A noun with no singular is tagged `p`.** `ножницы`, `gafas` and `Jeans` have no singular for a singular modifier to agree with, so `WordGender` carries the language's default plural beside the three genders, and `fp` where the plural inflects for gender as well (`gafas doradas` beside `celos dorados`). Russian and German plurals are the same whatever the gender, so those two only ever use `p`. A form the base form does not already cover **must** have rules — the modifier is written in the singular, and `test/nickname.test.ts` asserts it.
- **A modifier in front of its noun still agrees.** `buildWords` draws the noun ahead of its turn when the language inflects and the frame puts the noun second, so German writes `blauer Wal` and `blaue Katze` correctly. The pre-drawn noun's length is exact rather than a range, which keeps the length fitting as tight as it is everywhere else.
- **German writes its nouns capitalised in the pool** rather than setting `capitalize`, which would capitalise the modifier too. The data is simply correct German.

To add one that clears the bar:

1. Add the code to `WordLanguage` in `lib/_types/global.ts`.
2. Add `lib/word/data/<code>.ts` with a `WordLanguageData` object: `joiner`, `capitalize`, `adjectives` and `actions` in attributive form, `nouns` for every theme in `WORD_THEMES`, `levels` listing the basic and the rare nouns among them (judged by how the language's speakers use the word, eight basic per theme at the least), the `frames` the language's grammar allows, an optional `parts` pool for the frames that ask for one, and a `syn` template (`kind: 'syllable'` for alphabetic scripts, `kind: 'pool'` where one character is one syllable). In the npm package the object is two modules: `lib/word/data/modifiers/<code>.ts` holds `joiner`, `capitalize`, `adjectives`, `actions`, `genderRules`, `agreement`, `frames` and `syn` as `<CODE>_MODIFIERS`, registered in `MODIFIER_DATA`, and `<code>.ts` spreads it beside the nouns, the levels and `parts`; a language that inflects writes its tagged nouns in `lib/word/data/nouns/<code>.ts` and adds its genders to `NOUN_GENDERS`, so that `randModifier` bundles without the rest.
3. Register it in `WORD_DATA` and `WORD_LANGUAGES` in `lib/word/data/index.ts`.
4. Write the frames before the pools. A shape is only worth a pool if the grammar carries it: `ja` and `zh` reach `parts` through の and 的 because a bare noun-noun compound does not read, and `en` has no possessive frame because `of` is a word rather than a particle.
5. Aim for 100+ nouns per theme, and more where the vocabulary is there. Every language holds around 4,700 to 5,400 nouns. The thinnest themes are `fruit`, in the fifties and sixties, and `planet` in Chinese and Japanese, which can only hold the 29 and 41 names those languages have a settled form for. The pools are what make the output varied, and the combination count is the sum over the language's frames of the product of their slots — 57M to 227M for the five with a `parts` pool, 140M to 146M for `es` and `it`, and 1.6M for `de` and `ru`, whose three frames are the shortest of any language. **Padding a theme with near-synonyms reads worse than a shorter pool**, and inventing a compound to fill it is how `棒麺麭` and `대로변` got in; both were replaced. See the compound rule below — a pool grows by finding words the theme does not have yet, never by qualifying one it already holds.
6. Add its script to `SCRIPTS` in `lib/_internal/script.ts` if the language is new to the repository — see step 7 of the name-language list, which is the same table.
7. No person names, and no word that is only a name — for `en` this is enforced against the person-name pools, which is why `job` has no `Knight`, `Baker` or `Hunter` and `plant` no `Rose` or `Ivy`. Add the language to the README tables and to `SCRIPT` in `test/word.test.ts` **and** `test/nickname.test.ts`; the existing per-language tests then cover it.
8. A language that inflects tags its nouns and lists its endings: write `nouns` as a map from each theme to its tagged nouns (`gato:m luna:f`) through `taggedNouns`, and give `agreement` the rules per form, `p` (and `fp` where the plural inflects for gender) included if any noun has no singular. Put the noun **first** in the frames where the grammar allows it; where it cannot (`blauer Wal`), `buildWords` draws the noun ahead of its turn instead.
9. Port all of it to `packages/dart` and `packages/python`, the same way a name language is ported.
10. Add the language's row to `DATE_NAMES` — its months, its weekdays from Monday, and the two halves of a day, in the form a date writes them — in all three packages. Then add the country the language is spoken in first to `PhoneCountry` and `PHONE_DATA`, with its mobile blocks, a dozen real area codes and its two templates, in all three packages. The base suites assert one phone country per word language.
11. Add the language's row to `GENDER_LABELS` and its `organization/data/<code>` file — stems checked against brands, the business words for every industry, a template for every kind and its legal forms — in all three packages. `randGender` and `randOrganization` cover every word language, and both suites assert it.
12. Add the row to the tables in `docs/*/guide/languages.md` and to the root `README.md`.
13. Run `node tools/lengths/index.mjs` from the repository root, which measures the new pools into the tables `wordLengthRange` and `nicknameLengthRange` read.
14. Run `node tools/parity/index.mjs` from the repository root — thirty-seven pools in three packages are exactly where one word goes missing unnoticed.

### The compound rule: one entry per thing

A compound belongs in a pool only when it names **something the base word does not**. When it names the same thing with a qualifier in front, the base word wins — it is the one people actually reach for, and both entries in one theme is the same thing drawn twice.

```text
Drop:  민들레꽃 beside 민들레 · 국화꽃 beside 국화 · 연두색 beside 연두 · 은하계 beside 은하
       杜鹃花 beside 杜鹃 · 銀河系 beside 銀河 · 小汽车 beside 汽车 · мостик beside мост
       lá non / lá rụng / lá khô beside lá · nước ấm / nước nóng / nước đá beside nước
       Omelette beside Omelet · Slippers beside Slipper · Crossroad beside Crossroads
Keep:  밧줄 · 리본 · 끈 — three objects, three roles, no compound needed between them
       가방끈, 지우개털, 만두피, 책갈피 — a part or a by-product is its own thing
       彗星 / 流星 / 惑星 beside 星 · 霧雨 / 梅雨 beside 雨 — the language names these separately
       Debt / Debtor · Knee / Kneecap · 銀 / 水銀 — different referents that share a character
```

The test is not whether the compound is a real word — `풋사과` and `햇사과` are both real, and both are still `사과`. It is whether a speaker naming the thing would say the compound or the base. Say the base out loud first; if it already answers, the compound is padding.

The rule is applied strictly, and the young, the size, the sex, the stage and the season of a base are all qualifiers: `오리새끼` and `새끼양` beside their bases, `Duckling` beside `Duck`, `초봄` and `한여름` beside the seasons, `봄비` beside `비`, `금괴` and `은박` beside the metals, `Moonlight` beside `Moon`. What stays is a word of its own for the young (`강아지`, `송아지`, `Puppy`), a distinct species or kind (`북극곰`, `소나무`, `금붕어`), and a part that is a thing of its own (`꽃잎`).

This applies to every language, and the failure looks different in each. Korean and Japanese suffix a classifier (`꽃`, `類`, `具`, `体`); Chinese suffixes `系` or `馆`; Vietnamese puts a state in front of a noun (`lá khô`, `nước ấm`); English keeps a British and an American spelling of one word; Russian keeps a diminutive beside its base. `tools/parity` cannot see any of it — the packages agree with each other perfectly while all three hold the same redundant entry. What finds it is comparing a pool **against itself**: within one theme, look for a word that contains another.

## Weighting a theme's levels

A draw is even over the pool, which is right for nearly every theme and wrong for one whose everyday words are a handful beside dozens a specialist knows. `LEVEL_WEIGHTS` in `lib/word/data/index.ts` names those themes and what each level weighs; `weightedNouns` picks a level by its weight times its size, then a word inside it, and falls back to the whole pool when the level has no word the range or `startsWith` allows. `planet` is the one listed — the eight planets and Pluto beside some ninety exoplanets — and an even draw named an exoplanet four times in five. Only `randWord` and its themed forms read it: a sentence keeps to the common words already. An invented word is still written the way the whole theme is, which is what `drawWord`'s `casing` is for — a level of all capitals in a theme that is not would otherwise capitalise it. Weights are data, so `tools/parity` compares them.

## Adding a word theme

A theme is a slice of everyday vocabulary that a modifier can sit in front of. Adding one touches every language at once, because `nouns` is a `Record<WordTheme, WordPool>` — the TypeScript type will not let a language skip it, and the ports assert it instead. **It also adds a public function**, because every theme has one.

1. Add the name to `WordTheme` in `lib/_types/global.ts` and to `WORD_THEMES` in `lib/word/data/index.ts`.
2. Add the pool to **all nine** languages. A theme that only one language can fill is not a theme.
3. **Themes have to be disjoint**, and `test/nickname.test.ts` asserts it. A word in two of them makes the reported `theme` ambiguous, and it makes the detail output report a theme the caller did not ask about. When a new theme claims a word an old one already holds, move it rather than copy it — `place` took the twelve places that were sitting in `concept`, `vehicle` took 자전거 / 기차 / 배 out of `object`, `plant` took the flowers and trees out of `nature`, and `music` took the instruments out of `object` and 리듬 / 선율 / 화음 out of `concept`. Eight themes came at once the same way: `monster` took every creature out of `myth`, `genre` the kinds of music out of `music`, `building` the buildings and rooms out of `place`, `ingredient`, `vegetable` and `fruit` everything in `food` that is not a prepared dish, `beauty` the make-up out of `product`, and `planet` the planets' names out of `space`. Where the two senses are genuinely different words, rename instead of moving: the English toy became `Marbles` so `gem` could keep `Marble`.
4. Watch the word lengths. `wordLengthRange` and `nicknameLengthRange` are both derived from the shortest and longest word in the pools, and `test/word.test.ts` and `test/nickname.test.ts` each pin three of their values, so a Chinese noun outside 2–3 characters or a Korean one outside 1–4 changes a number the tests assert by value. Both helpers read the tables in `data/lengths.ts` rather than the pools, so they bundle without them: run `node tools/lengths/index.mjs` from the repository root once the pools are in, and the new theme is in the tables. The suites fail until it is.
5. Add the `rand<Theme>` function beside the others, export it from `lib/word/index.ts`, and add it to the `THEMED` table in `test/word.test.ts` — that table is asserted to have exactly one entry per theme, so a missing function fails the suite. Update the theme list in `README.md` and the doc comment on `WordTheme`.
6. Do the same in `packages/dart` and `packages/python` — `WordTheme`, the theme list, the pool in all nine language files, and the themed function. Neither Dart's `Map` nor Python's `dict` complains about a missing theme the way the TypeScript `Record` does, which is why both ports assert every language fills every theme.
7. Give it a class in `THEME_CLASS` (`lib/sentence/data/index.ts`), in all three packages. Without one the theme has no verb that will take it, and `test/sentence.test.ts` fails.
8. Decide whether the theme belongs in `LOOSE_THEMES`. A theme a modifier cannot sit in front of without the result reading as a joke goes in, and `randNickname` then only reaches it once `realism` loosens or the caller names it. `color`, `finance` and `tech` are there; everything a nickname can carry stays out.
9. Add the row to `docs/en/word/themes.md` and `docs/ko/word/themes.md`, and to the class table on `docs/*/sentence/index.md`.
10. Run `node tools/parity/index.mjs` from the repository root. A theme adds nine pools to each of three packages, which is twenty-seven chances to drop a word.
