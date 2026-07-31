# CLAUDE.md

Guidance for AI agents (and humans) working in this repository. Written in English to match the repo's existing docs (`README.md`, `CONTRIBUTING.md`).

## What randnick is

**randnick** is a zero-dependency TypeScript library that generates random **person names** and **nicknames**, per language. Two separate concerns, deliberately:

- **Names** should read like names a person actually carries (`김민준`, `Emma Clover`). Sample data for forms, seeds, mockups.
- **Nicknames** are the handles someone would pick for a game or a website (`멋진사자`, `MistyOwl`). They are built from everyday words and **never from person names** — that rule is the whole point of keeping the two apart.

Both generators are implemented. Keep them apart — a shared "generator" abstraction is not wanted, but shared _helpers_ (`lib/_internal`) are.

The name generator is a port of the logic behind vutools' [Random Person Name Generator](https://www.vutools.com/tools/text/random-person-name-generator) (`client/src/app/[locale]/tools/text/random-person-name-generator` in the `www-vutools-com` repo), with the same options. Two deliberate differences: the web page's `es-hangul` dependency is replaced by an internal romanizer (see below), and length bounds are resolved per language so `language: 'all'` does not stretch a Korean name to fill a Spanish name's range.

The nickname generator has no upstream — it is this repo's own. Its options mirror the name generator's where they mean the same thing (`language`, `count`, `style`, `minLength` / `maxLength`, `startsWith`, `unique`), and add `theme`, `includeModifier`, `baseWord` and the `uniqueSuffix*` group.

## Layout

```
lib/
  index.ts                  # re-exports every category + the public types
  _types/global.ts          # ALL public types live here (options, results)
  _internal/
    utils.ts                # shared random/string helpers, never exported
    parse.ts                # words() / tokens() / romanMap() dataset helpers
  name/
    index.ts                # the category's public surface
    randomName.ts           # public: string[]
    randomNameDetails.ts    # public: NameDetail[]
    nameLengthRange.ts      # public helper
    nameSupportsMiddleName.ts
    nameSupportsRoman.ts
    nameGenerator.ts        # internal: the generator itself
    romanize.ts             # internal: native form -> English pronunciation
    data/
      index.ts              # NAME_DATA, NAME_LANGUAGES, bounds
      types.ts              # internal dataset types
      syllables.ts          # syllable templates for invented names
      en.ts ko.ts ja.ts …   # one file per language
  nickname/
    index.ts
    randomNickname.ts       # public: string[]
    randomNicknameDetails.ts
    nicknameLengthRange.ts  # public helper
    nicknameGenerator.ts    # internal: shapes, length fitting, suffix
    data/
      index.ts              # NICKNAME_DATA, languages, themes, bounds
      types.ts
      en.ts ko.ts ja.ts zh.ts
test/
  base.test.ts              # the package's export surface
  name.test.ts              # one *.test.ts per category
  nickname.test.ts
```

## Conventions

- **One public function per file**, named after the function; the category's `index.ts` re-exports them, and `lib/index.ts` re-exports the categories. This mirrors the author's other library, [qsu](https://github.com/jooy2/qsu).
- **Relative imports end in `.js`**, even though the source is `.ts` — the build emits ESM that Node has to resolve at runtime. Type-only imports may omit it.
- **Public types go in `lib/_types/global.ts`** and are exported from `lib/index.ts` with `export type *`. Types that only describe internal data (pools, language datasets) stay next to that data.
- **Internal modules are not exported** from any `index.ts`. Prefix-free names are fine; the `index.ts` files are the API boundary.
- **Every public function takes a single optional options object** and has a JSDoc block with an `@example`. All options have defaults — `randomName()` with no arguments must work.
- **Prettier owns formatting** (tabs, single quotes, no trailing commas). Run `npm run format`; `npm run build` runs it first.
- **Zero runtime dependencies.** This is a hard constraint, not a preference. It is why Hangul romanization is implemented in `lib/name/romanize.ts` instead of pulling in `es-hangul`.

### Datasets

Pools are written as whitespace-separated strings inside a template literal and split by the helpers in `_internal/parse.ts`, so a 120-name pool stays a few lines instead of 120:

```typescript
male: words(`
  James William Oliver Henry
`),
// `_` is a space inside one entry: De_Luca -> 'De Luca'
last: words('Rossi Russo De_Luca'),
// Scripts whose characters carry their own reading use native:roman pairs.
last: tokens('佐藤:Sato 鈴木:Suzuki')
```

## Commands

| Command          | What it does                                                        |
| ---------------- | ------------------------------------------------------------------- |
| `npm run test`   | `tsc` (emit to `dist`), then `node --test` over `test/**` via `tsx` |
| `npm run build`  | `format` → `tsc` → `minify`                                         |
| `npm run lint`   | ESLint (`lint:fix` to fix)                                          |
| `npm run format` | Prettier, in place                                                  |

The tests are TypeScript but import from `../dist`, so they are run through `tsx` and **they need a build** — that is what `npm run test` does first. Node >= 18.

Only `dist/` and the top-level `README.md` / `LICENSE` are published; `.npmignore` keeps `lib/`, `test/`, the config files and the remaining markdown out of the package.

## Testing a random generator

The return value is random, so tests assert the **properties every result must have**, over a sample large enough (`SAMPLE = 60`) that a broken option cannot pass by luck:

- The script matches the language (`/^[가-힣]+$/` for Korean, `\p{Script=Cyrillic}` for Russian, …).
- The structure matches the options — word count for `includeSurname` / `includeMiddleName`, character count for CJK.
- Requested constraints hold for every name: `startsWith`, `minLength` / `maxLength`, `unique`.
- `count` is exact, including the clamped edges (`0`, negatives, above `NAME_COUNT_MAX`).
- Anything genuinely deterministic is asserted by value: `nameLengthRange`, the romanizer's known outputs.

Do not assert an exact generated name, and do not use a fixed seed — there is none. When a property test is flaky, the option is either under-specified or the assertion is wrong; **run the suite 20+ times before calling it stable**, because a 1-in-1000 case will show up in CI otherwise.

Gender is the one option with no directly observable effect in most languages. It is verified through Russian, whose middle name and surname inflect for it (`…ович` / `…овна`, `Иванов` / `Иванова`).

Nicknames are checked against the datasets themselves: `randomNicknameDetails` reports the `words` it used, so every word can be asserted to come from the language's pools, and the English pools are asserted to share nothing with the English person-name pools. Korean and Japanese cannot have that last invariant — `하늘`, `별` and `森` are everyday nouns that also happen to be names, and `아름다운하늘` is still nobody's name.

Two coincidences are load-bearing and must not be asserted away: a word can be both a modifier and a noun (`무지개`, `Marble`, `自由`), and an invented word can spell a real one by accident (`나` + `비` -> `나비`, so `theme` comes back as `'animal'` at `style: 100`). Structural assertions survive both; "the first word is not a modifier" does not.

## Behavior worth knowing before changing it

- **Structure beats length.** A length range too narrow for the requested parts is answered with the closest name the generator can build; it never drops a surname or middle name the caller asked for. For space-separated languages the range is satisfied by re-drawing up to `FIT_ATTEMPTS` times, so a very narrow range is best-effort. CJK hits it exactly.
- **`unique` defaults to `false`** so that `count` is always exact. Turning it on trades that for deduplication and can return fewer names.
- **`style` is consulted per part**, not per batch, so `50` mixes real and invented parts within one name.
- **Length bounds are resolved per language** inside `generateOne`, not once per call. Keep it that way, or mixed-language output regresses.
- **`givenLenWeights` stretching:** asking a CJK language for a range longer than its real names produces long invented given names on purpose. That is a deliberate ask, not a bug.

Nicknames:

- **Length picks the shape, not the words.** `PATTERNS` are filtered to the ones that can land inside the range, then each slot is given the room left after the slots behind it have reserved their minimum. That is why a narrow range drops the modifier instead of truncating a word.
- **The default range is wide on purpose** (`nicknameLengthRange('ko')` is `[1, 12]`): it spans every shape, and the pattern weights — not the range — decide what output usually looks like.
- **The unique suffix is outside the length range.** `minLength` / `maxLength` describe the readable part; the suffix is appended afterwards.
- **`theme` is reported, not asserted.** A word drawn from a theme reports it, a given `baseWord` is looked up across all themes, and an invented word reports `null`.
- **Two rough spots trigger a re-draw** rather than being shipped: a `startsWith` that no real word in the rolled theme matched (another theme probably has one), and a word ending on the character the next one starts with (`石霜` + `霜雨`). Both fall back to the closest attempt if every attempt is rough.
- **Invented-word templates stay short.** Two or three syllables per word, because up to three words are joined; `en` is capped at two.

## Adding a name language

1. Add the code to `NameLanguage` in `lib/_types/global.ts`.
2. Add `lib/name/data/<code>.ts` with a `NameLanguageData` object: name order, joiner (`''` for CJK, `' '` otherwise), `hasMiddle`, `roman` mode, `lengthSpec`, and the pools. CJK languages use `givenMale` / `givenFemale` plus `first*` / `rest*` syllables; other scripts use `male` / `female` / `last` plus a `syn` template.
3. Register it in `NAME_DATA` and `NAME_LANGUAGES` in `lib/name/data/index.ts`.
4. If it needs a new romanization mode, add it to `RomanMode` and handle it in `lib/name/romanize.ts`.
5. `lengthSpec` must match reality — it is the default length range, and a wrong value shows up as padded or truncated names.
6. Add the language to the README table and to the script regexes in `test/name.test.ts`; the existing per-language tests then cover it.

## Adding a nickname language

The four supported languages (`ko`, `en`, `ja`, `zh`) share one property: a modifier can sit in front of a noun exactly as it is written in the dictionary. **That is the bar for adding another one.** Italian, German, Russian, Spanish and Vietnamese are name languages but not nickname languages, and the reason is grammar, not effort:

- Italian, Spanish, Russian and German inflect the modifier for the noun (`gatto azzurro` / `luna azzurra`, `blauer Wal` / `blaue Katze`). Supporting them means tagging every noun with its gender and storing every modifier once per gender — do that, or leave the language out. Half-agreement output is worse than none.
- Vietnamese puts the modifier **after** the noun (`mèo xanh`) and reverses possessive compounds (`đuôi mèo`, not `mèo đuôi`), so it needs a word-order field on `NicknameLanguageData` before its pools are worth writing.

To add one that clears the bar:

1. Add the code to `NicknameLanguage` in `lib/_types/global.ts`.
2. Add `lib/nickname/data/<code>.ts` with a `NicknameLanguageData` object: `joiner`, `capitalize`, `modifiers` in attributive form, `nouns` for every theme in `NICKNAME_THEMES`, an optional `parts` pool, and a `syn` template (`kind: 'syllable'` for alphabetic scripts, `kind: 'pool'` where one character is one syllable).
3. Register it in `NICKNAME_DATA` and `NICKNAME_LANGUAGES` in `lib/nickname/data/index.ts`.
4. Leave `parts` out unless a bare noun-noun compound reads naturally — that is why `ja` and `zh` have none.
5. Aim for 60+ nouns per theme; the pools are what make the output varied, and the combination count is roughly `modifiers × nouns × (1 + parts)` — around 2.9M for `ko` and `en`, 43K for `ja` and `zh`, which have no `parts`. `sport`, `vehicle` and `product` are the exception (roughly 48 / 43 / 36 words) — the world holds fewer of those, and padding them with near-synonyms reads worse than a shorter pool.
6. No person names, and no word that is only a name. Add the language to the README tables and to `SCRIPT` in `test/nickname.test.ts`; the existing per-language tests then cover it.

## Adding a nickname theme

A theme is a slice of everyday vocabulary that a modifier can sit in front of. Adding one touches every language at once, because `nouns` is a `Record<NicknameTheme, WordPool>` — the type will not let a language skip it.

1. Add the name to `NicknameTheme` in `lib/_types/global.ts` and to `NICKNAME_THEMES` in `lib/nickname/data/index.ts`.
2. Add the pool to **all four** languages. A theme that only one language can fill is not a theme.
3. **Themes have to be disjoint.** A word in two of them makes `theme` ambiguous for `baseWord`, and it makes `randomNicknameDetails` report a theme the caller did not ask about. When a new theme claims a word an old one already holds, move it rather than copy it — `place` took the twelve places that were sitting in `concept`, and `vehicle` took 자전거 / 기차 / 배 out of `object`.
4. Watch the word lengths. `nicknameLengthRange` is derived from the shortest and longest word in the pools, and `test/nickname.test.ts` pins three of its values, so a Chinese noun outside 2–3 characters or a Korean one outside 1–4 changes a number the tests assert by value.
5. Update the theme table in `README.md` and the doc comment on `NicknameTheme`. The existing per-theme tests cover the new theme as soon as it is in `NICKNAME_THEMES`.

## Commit conventions

`tag: message`, Udacity Git style tags: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, plus informal `package` (deps/config) and `typo`. Write in English, wrap identifiers and paths in backticks, one logical change per commit. Example: `feat: add \`randomNickname\` method`.

A release is its own commit, `bump version to \`x.y.z\``, and touches `package.json`, the lockfiles and `CHANGELOG.md` — one bullet per user-visible change, newest version on top, dated. Nothing else belongs in it.
