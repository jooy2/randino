# CLAUDE.md

Guidance for AI agents (and humans) working in this repository. Written in English to match the repo's existing docs (`README.md`, `CONTRIBUTING.md`).

## What randino is

**randino** is a zero-dependency library that generates random **person names** and **nicknames**, per language. It ships for more than one programming language — TypeScript, Dart and Python — and every one of them generates from the same datasets under the same rules. Two separate concerns, deliberately:

- **Names** should read like names a person actually carries (`김민준`, `Emma Clover`). Sample data for forms, seeds, mockups.
- **Nicknames** are the handles someone would pick for a game or a website (`멋진사자`, `MistyOwl`). They are built from everyday words and **never from person names** — that rule is the whole point of keeping the two apart.

Both generators are implemented. Keep them apart — a shared "generator" abstraction is not wanted, but shared _helpers_ (`_internal`) are.

The name generator is a port of the logic behind vutools' [Random Person Name Generator](https://www.vutools.com/tools/text/random-person-name-generator) (`client/src/app/[locale]/tools/text/random-person-name-generator` in the `www-vutools-com` repo), with the same options. Two deliberate differences: the web page's `es-hangul` dependency is replaced by an internal romanizer (see below), and length bounds are resolved per language so `language: 'all'` does not stretch a Korean name to fill a Spanish name's range.

The nickname generator has no upstream — it is this repo's own. Its options mirror the name generator's where they mean the same thing (`language`, `count`, `style`, `minLength` / `maxLength`, `startsWith`, `unique`), and add `theme`, `includeModifier`, `baseWord` and the `uniqueSuffix*` group.

## Repository layout

```
packages/
  javascript/   The npm package (`randino`) — the reference implementation
  dart/         The pub.dev package (`randino`) — a port of it, same data, same rules
  python/       The PyPI package (`randino`) — likewise
docs/           The documentation site (VitePress), English and Korean
```

The **JavaScript package is the source of truth**. A behaviour change starts there, and the ports follow it; a change that lands only on one side is a bug in the making. Each package owns its own `README.md` and `CHANGELOG.md` because npm, pub.dev and PyPI all read those from the package root — the repository's own `README.md` is the only one that describes all of them at once, and there is no changelog at the repository root.

## The JavaScript package (`packages/javascript`)

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

### Conventions

- **One public function per file**, named after the function; the category's `index.ts` re-exports them, and `lib/index.ts` re-exports the categories. This mirrors the author's other library, [qsu](https://github.com/jooy2/qsu).
- **Relative imports end in `.js`**, even though the source is `.ts` — the build emits ESM that Node has to resolve at runtime. Type-only imports may omit it.
- **Public types go in `lib/_types/global.ts`** and are exported from `lib/index.ts` with `export type *`. Types that only describe internal data (pools, language datasets) stay next to that data.
- **Internal modules are not exported** from any `index.ts`. Prefix-free names are fine; the `index.ts` files are the API boundary.
- **Every public function takes a single optional options object** and has a JSDoc block with an `@example`. All options have defaults — `randomName()` with no arguments must work.
- **Prettier owns formatting** (tabs, single quotes, no trailing commas). Run `npm run format`; `npm run build` runs it first.
- **Zero runtime dependencies.** This is a hard constraint, not a preference. It is why Hangul romanization is implemented in `lib/name/romanize.ts` instead of pulling in `es-hangul`.

#### Datasets

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

### Commands

Run from `packages/javascript`; there is no workspace root that forwards them.

| Command          | What it does                                                        |
| ---------------- | ------------------------------------------------------------------- |
| `npm run test`   | `tsc` (emit to `dist`), then `node --test` over `test/**` via `tsx` |
| `npm run build`  | `format` → `tsc` → `minify`                                         |
| `npm run lint`   | ESLint (`lint:fix` to fix)                                          |
| `npm run format` | Prettier, in place                                                  |

The tests are TypeScript but import from `../dist`, so they are run through `tsx` and **they need a build** — that is what `npm run test` does first. Node >= 18.

Only `dist/` and the top-level `README.md` / `LICENSE` are published; `.npmignore` keeps `lib/`, `test/`, the config files and the remaining markdown out of the package.

## The Dart package (`packages/dart`)

A port of the JavaScript package, not a second design. Same datasets, same rules, same numbers; what differs is the surface, which is Dart's.

```
lib/
  randino.dart              # the barrel — its `show` clauses ARE the public API
  src/
    types.dart              # ALL public types (enums, LengthRange, the two details)
    internal/
      utils.dart            # pick / randInt / chance / clamp, never exported
      parse.dart            # words() / pairs() / weightMap() / romanMap()
    name/                   # mirrors lib/name in the JavaScript package
      data/                 # one file per language, ported verbatim
      romanize.dart
      name_generator.dart
      random_name.dart …
    nickname/               # mirrors lib/nickname
test/
  base_test.dart            # the barrel's export surface, read out of the source
  name_test.dart
  nickname_test.dart
```

| Command                | What it does                       |
| ---------------------- | ---------------------------------- |
| `dart test`            | The suite. No build step           |
| `dart analyze`         | CI runs it with `--fatal-infos`    |
| `dart format .`        | Tall style, 100 columns            |
| `dart pub publish --dry-run` | What pub.dev will check      |

### Conventions

- **Named parameters, not an options object.** `randomName(language: NameLanguage.ko, count: 3)`. Every parameter is optional and every one has the JavaScript default.
- **A null enum means "every one of them"** — that is how `'all'` crosses over. `NicknameDetail.theme` is the one nullable that means something else (the word is not one the generator knows), and it says so in its doc comment.
- **`LengthRange` replaces `[number, number]`** and compares by value, so a test can assert one directly.
- **File names are `snake_case`, one public function per file**, named after the function. `lib/randino.dart` re-exports them with an explicit `show`.
- **Imports are `package:` imports**, even inside the package — `always_use_package_imports` is on, because a relative import breaks the moment a file moves.
- **Everything public carries a doc comment**, including inside `lib/src`. `public_member_api_docs` is on.
- **No dependencies.** `dart:math` is the only import from outside the package.

### The one thing Dart cannot do the same way

`String.normalize('NFD')` does not exist in Dart and there is no diacritic property to strip against, so `romanize.dart` folds Latin accents through a **written-out table** instead. It covers more than the pools hold on purpose, and `test/name_test.dart` folds every entry of every `RomanMode.fold` pool and asserts the result is ASCII — that test is what keeps a newly added `ư` from silently surviving into a supposedly romanized name. It has already caught one.

### Keeping the ports in step

The JavaScript package is the source of truth. A behaviour change lands there first, then in each port, in the same commit where that is practical. Every suite asserts the same properties over the same pools, so a port that drifted shows up as a test that passes on one side and fails on another — which is the point of porting the tests rather than writing new ones.

## The Python package (`packages/python`)

A port of the JavaScript package, not a second design. Same datasets, same rules, same numbers; what differs is the surface, which is Python's.

```
src/randino/
  __init__.py               # the barrel — its `__all__` IS the public API
  _types.py                 # ALL public types (Literals, the two details)
  _internal/
    utils.py                # pick / rand_int / chance / clamp, never exported
    parse.py                # words() / tokens() / weights() / roman_map()
  name/                     # mirrors lib/name in the JavaScript package
    data/                   # one file per language, ported verbatim
    _romanize.py
    _generator.py
    random_name.py …
  nickname/                 # mirrors lib/nickname
  py.typed                  # PEP 561 — without it every annotation is ignored
tests/
  test_base.py              # the barrel's export surface, and the no-dependency rule
  test_name.py
  test_nickname.py
```

| Command                | What it does                     |
| ---------------------- | -------------------------------- |
| `pytest`               | The suite. No build step         |
| `ruff check .`         | Lint (`--fix` to fix)            |
| `ruff format .`        | 4 spaces, double quotes, 100 columns |
| `mypy`                 | Strict, over `src` and `tests`   |
| `python -m build`      | What PyPI will receive           |

Set up with `uv venv && uv pip install -e ".[dev]"`, or the `pip` equivalent.

### Conventions

- **Keyword-only arguments, not an options object.** `random_name(language="ko", count=3)`; the `*` in every generator's signature is deliberate, because `random_name("ja", "female", 5)` is both unreadable and a parameter order frozen into the API. The three `name_*` / `nickname_length_range` helpers are the exception — they take their arguments positionally as well, the way the JavaScript ones do, because they are short enough to read either way.
- **`Literal`, not enums.** `language="ko"` is the same string the npm package takes, and `"all"` survives the crossing intact — which is why Python needs none of Dart's "a null enum means every one of them". The one `None` that means something is `random_nickname`'s `language`: omitted, a `base_word` picks the language it is written in. That is `undefined` vs `'all'` in the npm package too, not an invention.
- **`tuple[int, int]` replaces `[number, number]`**, and the two details are frozen dataclasses with `slots=True`.
- **File names are `snake_case`, one public function per file**, named after the function. `__init__.py` re-exports them and `__all__` is the contract.
- **Imports are absolute** (`from randino.name.data import NAME_DATA`), even inside the package, so a moved file breaks loudly rather than silently.
- **Everything public carries a docstring**, including inside `_internal`. Ruff's `D` rules are on, Google convention.
- **`ruff format` owns formatting** — 4 spaces, double quotes, 100 columns. Double quotes rather than the repo's single because that is what the Python ecosystem's formatters emit; each package follows its own language's convention, which is the same reason Dart uses single.
- **No dependencies.** `test_base.py` walks every module's imports and asserts each one is either stdlib or `randino`, because that promise is the one nothing else fails on.

### Where the port is closer to JavaScript than Dart is

`fold()` is `unicodedata.normalize("NFD")` with the combining marks dropped — exactly what the npm package does. Dart has no normalization and carries a written-out table instead, so the Dart-only fold-coverage test has no counterpart here.

## The documentation site (`docs/`)

VitePress, in English and Korean, at [randino.cdget.com](https://randino.cdget.com). It documents every package from one set of pages.

```
docs/
  .vitepress/
    config.ts               # locales, sidebar wiring, SEO, the `::: lang` container
    data/
      languages.ts          # the packages, and the no-flash head script
      language.ts           # the reader's choice, as one value the site shares
      sidebar.ts            # the menu, written out — two locale columns, one structure
      i18n.ts               # the few strings the site's own components render
    theme/                  # the language switch, the packages menu, the CSS that displays one variant
  en/  ko/                  # the pages, mirrored
  scripts/
    copy-changelog.mjs      # every package's CHANGELOG.md -> docs/<locale>/changelog.md
    check-anchors.mjs       # every `#fragment` link resolves (see below)
  public/                   # the logo, one file per size (see below)
```

| Command                 | What it does                                        |
| ----------------------- | --------------------------------------------------- |
| `npm run dev`           | The dev server                                      |
| `npm run build`         | changelog → VitePress → anchor check, into `docs-dist/` |
| `npm run typecheck`     | `tsc` over `.vitepress`                             |
| `npm run format:fix`    | Prettier, in place                                  |

### One page, every package

A page says the same thing about `randomName` whichever package a reader installs; only the code, the option shape and the install line differ. So they are not three sites and not three folders:

- **`::: lang js` … `:::`** wraps a block only one package sees. `::: lang js dart` is a block two of them want.
- **`<Lang js="…" dart="…" py="…" code />`** is the inline form, for a phrase in the middle of a sentence that does not differ. It is what keeps an option table from being written three times, and what carries `min_length` next to `minLength`.

Every variant is in the document and CSS hides all but one, which is what buys the no-flash switch, a hydration-safe render and a search index that carries all of them. Adding a package is an entry in `data/languages.ts`, a branch in `LangMark.vue` for its logo, a line in the one hard-coded selector group in `theme/styles/lang.css`, a row in `packageLinks` in `config.ts` for the registry it is published to, and the blocks on whatever pages have something to say about it.

**Function and option names in headings, the sidebar and anchors stay in the JavaScript spelling**, and only the body carries all three. That is not laziness: VitePress builds its outline from the rendered heading and its sidebar from `config.ts`, so a per-package heading would either read as all three names run together or flash the wrong one before hydration — and a cross-page `#anchor` has to resolve for every reader, not just the one who picked JavaScript. The mapping is mechanical (`minLength` → `min_length`) and Getting started states it once.

### The menu is not the folders

`name/` and `nickname/` are two folders because the two generators are two things, and the sidebar deliberately does not repeat that split: the four generators and the two helper pages are one **API** group, and the prose explaining how the options behave sits under **Guide**. A reader looking for `randomNickname` is looking for a function, not for the half of the library it belongs to.

The navbar is the same list — its API dropdown is built out of `data/sidebar.ts` by `navGroupFor`, so the menu and the section it points into cannot drift. Its **Packages** dropdown is `PackageLinks.vue`, which is where npm, pub.dev and PyPI went when they stopped being three of the four icons in the navbar's right-hand corner; the registry URLs are still derived from the three manifests in `config.ts`, and GitHub is the one social link left.

### Two traps

**A Korean heading cannot be linked to by its text.** VitePress slugifies through `NFKD`, so a Hangul heading's id is *decomposed jamo* while anything typed into a Markdown link is composed — identical in an editor, in a diff and in review, and the link scrolls nowhere. Give any Korean heading that is a link target an explicit `{#ascii-anchor}`, matching the English page's anchor where there is one. `scripts/check-anchors.mjs` fails the build otherwise; it runs as part of `npm run build`.

**Every page has to exist in both locales.** `data/sidebar.ts` is one structure with an `en` and a `ko` label per entry, and VitePress fails the build on a dead link — so a page added to one locale and not the other does not get committed by accident.

### The logo

The artwork lives at `assets/logo-master.png` — outside `docs/public/`, so VitePress does not serve it. `docs/public/` holds what is served, one size per job, all generated from that master:

| File                   | Size    | Where it is used                                  |
| ---------------------- | ------- | ------------------------------------------------- |
| `logo-16.png`          | 16      | favicon                                           |
| `logo-32.png`          | 32      | favicon, and the navbar mark at 24×24             |
| `128x128.png`          | 128     | every `README.md`, displayed at 96×96             |
| `256x256.png`          | 256     | spare, for anything asking for a mid-size mark    |
| `512x512.png`          | 512     | the home page hero, and `og:image`                |
| `apple-touch-icon.png` | 180     | iOS home screen — **opaque**, see below           |
| `favicon.ico`          | 16/32/48 | the browsers and Windows surfaces that ask by name |

Regenerating from the master takes two passes over the source before any resizing: the alpha is snapped (the artwork is painted at 254 rather than 255, and a fringe of alpha 1..8 runs to the left edge), then it is cropped to what is left.

Two things a regeneration has to keep. The margin is **2%** of the master, not a generous one: the mark is a cube with dots on it, and at 16px every percent of the tile it does not fill is a dot that stops being a dot. And `apple-touch-icon.png` is the one that is **not transparent** — iOS composites a transparent home-screen icon on black, so its background is painted in.

The repository's own `README.md` links the file by a relative path, which is what GitHub resolves; the three package `README.md`s link it by its `raw.githubusercontent.com` URL, because npm, pub.dev and PyPI resolve neither a relative path nor the docs site.

### Deployment

`.github/workflows/publish-documentation.yml` builds the site and pushes `docs-dist/` to the `gh-pages` branch on every push to `main` that touches `docs/`, any package's manifest, or any package's `CHANGELOG.md`. Nothing else in `packages/` reaches the site, so nothing else triggers it. It is the only workflow that deploys, and it repeats `run-build-docs`' three checks — typecheck, format, build — because a commit landing on `main` directly never saw them.

Two things it does not hard-code. The custom domain is read out of the npm package's `homepage`, the same field `config.ts` derives the canonical links and the sitemap from, so the `CNAME` it writes cannot drift from the URL the pages claim. And `run-build-docs` is pull-request-only, so one commit never builds the site twice.

The push needs `secrets.ACCESS_TOKEN`, a token with write access to this repository. It is a repository secret, so the workflow is the only thing that can deploy — a fork running it finds nothing and stops at that step.

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
- **`givenLenWeights` stretching:** asking a CJK language for a range longer than its real names produces long invented given names on purpose. That is a deliberate ask, not a bug. The stretch is off for a curated draw, where the pool — not the range — decides what lengths exist.
- **`style: 0` does not invent to hit a length.** `curatedGiven` takes the whole range and picks the length from the lengths the pool holds, so a weight table that lists a length the pool has none of (Korean lists three-syllable given names and has none) no longer drops one name in twenty-five through to `composeGiven`. A range that only a length the pool lacks can satisfy still invents — there is nothing real to draw.
- **Surnames are weighted where the distribution is steep.** `lastWeights` is a `native:weight` table in tenths of a percent of the population, and only `ko`, `zh` and `vi` have one: 김 covers a fifth of Korea and Nguyễn two fifths of Vietnam, so an even draw over the pool is the loudest way the output stops reading like the language. English, German, Italian, Spanish, Russian and Japanese surnames have a long enough tail that the even draw is already within the right order of magnitude — do not add a table there for symmetry. Surnames the table leaves out keep `LAST_WEIGHT_DEFAULT`, so only the head needs listing; `test/name.test.ts` asserts every weighted surname is still in the pool.

Nicknames:

- **Length picks the shape, not the words.** `PATTERNS` are filtered to the ones that can land inside the range, then each slot is given the room left after the slots behind it have reserved their minimum. That is why a narrow range drops the modifier instead of truncating a word.
- **The default range is wide on purpose** (`nicknameLengthRange('ko')` is `[1, 12]`): it spans every shape, and the pattern weights — not the range — decide what output usually looks like.
- **`wordSeparator` replaces the language's joiner, everywhere.** It is not cosmetic: its length is part of the nickname's, so `patternRange`, `buildWords`, `lengthBounds` and `naturalRange` all read it through `joinerOf` rather than touching `data.joiner`. Reading `data.joiner` directly again is how a separated nickname starts overshooting `maxLength`. It also turns off the boundary-repeat re-draw — `石-霜` does not stutter the way `石霜` does.
- **The unique suffix is outside the length range.** `minLength` / `maxLength` describe the readable part; the suffix is appended afterwards.
- **`theme` is reported, not asserted.** A word drawn from a theme reports it, a given `baseWord` is looked up across all themes, and an invented word reports `null`.
- **Two rough spots trigger a re-draw** rather than being shipped: a `startsWith` that no real word in the rolled theme matched (another theme probably has one), and a word ending on the character the next one starts with (`石霜` + `霜雨`). Both fall back to the closest attempt if every attempt is rough.
- **Invented-word templates stay short.** Two or three syllables per word, because up to three words are joined; `en` is capped at two.

## Adding a name language

1. Add the code to `NameLanguage` in `lib/_types/global.ts`.
2. Add `lib/name/data/<code>.ts` with a `NameLanguageData` object: name order, joiner (`''` for CJK, `' '` otherwise), `hasMiddle`, `roman` mode, `lengthSpec`, and the pools. CJK languages use `givenMale` / `givenFemale` plus `first*` / `rest*` syllables; other scripts use `male` / `female` / `last` plus a `syn` template. Add `lastWeights` only when the language's surnames are steeply distributed — an even draw is already close to reality for the long-tailed ones (see the surname bullet below).
3. Register it in `NAME_DATA` and `NAME_LANGUAGES` in `lib/name/data/index.ts`.
4. If it needs a new romanization mode, add it to `RomanMode` and handle it in `lib/name/romanize.ts`.
5. `lengthSpec` must match reality — it is the default length range, and a wrong value shows up as padded or truncated names.
6. Add the language to the README table and to the script regexes in `test/name.test.ts`; the existing per-language tests then cover it.
7. Port all of it to `packages/dart`: the code goes in `NameLanguage`, the dataset in `lib/src/name/data/<code>.dart` and `index.dart`, the regex in `test/name_test.dart`.
8. Port all of it to `packages/python`: the code goes in the `NameLanguage` `Literal` in `src/randino/_types.py`, the dataset in `src/randino/name/data/<code>.py` and `__init__.py`, the script check in `SCRIPT` in `tests/test_name.py`. A language that exists in one package and not another is the failure mode this repository has to avoid, and the three suites are what catch it.
9. Add the row to the tables in `docs/en/guide/languages.md` and `docs/ko/guide/languages.md`, and to the one in the root `README.md`.

## Adding a nickname language

The four supported languages (`ko`, `en`, `ja`, `zh`) share one property: a modifier can sit in front of a noun exactly as it is written in the dictionary. **That is the bar for adding another one.** Italian, German, Russian, Spanish and Vietnamese are name languages but not nickname languages, and the reason is grammar, not effort:

- Italian, Spanish, Russian and German inflect the modifier for the noun (`gatto azzurro` / `luna azzurra`, `blauer Wal` / `blaue Katze`). Supporting them means tagging every noun with its gender and storing every modifier once per gender — do that, or leave the language out. Half-agreement output is worse than none.
- Vietnamese puts the modifier **after** the noun (`mèo xanh`) and reverses possessive compounds (`đuôi mèo`, not `mèo đuôi`), so it needs a word-order field on `NicknameLanguageData` before its pools are worth writing.

To add one that clears the bar:

1. Add the code to `NicknameLanguage` in `lib/_types/global.ts`.
2. Add `lib/nickname/data/<code>.ts` with a `NicknameLanguageData` object: `joiner`, `capitalize`, `modifiers` in attributive form, `nouns` for every theme in `NICKNAME_THEMES`, an optional `parts` pool, and a `syn` template (`kind: 'syllable'` for alphabetic scripts, `kind: 'pool'` where one character is one syllable).
3. Register it in `NICKNAME_DATA` and `NICKNAME_LANGUAGES` in `lib/nickname/data/index.ts`.
4. Leave `parts` out unless a bare noun-noun compound reads naturally — that is why `ja` and `zh` have none.
5. Aim for 60+ nouns per theme; the pools are what make the output varied, and the combination count is roughly `modifiers × nouns × (1 + parts)` — around 9M for `ko` and `en`, 145K for `ja` and `zh`, which have no `parts`. `gem`, `sport`, `vehicle` and `product` are the exception (roughly 55 / 46 / 43 / 36 words) — the world holds fewer of those, and padding them with near-synonyms reads worse than a shorter pool.
6. No person names, and no word that is only a name — for `en` this is enforced against the person-name pools, which is why `job` has no `Knight`, `Baker` or `Hunter` and `plant` no `Rose` or `Ivy`. Add the language to the README tables and to `SCRIPT` in `test/nickname.test.ts`; the existing per-language tests then cover it.
7. Port all of it to `packages/dart` and `packages/python`, the same way a name language is ported.
8. Add the row to the tables in `docs/*/guide/languages.md` and to the root `README.md`.

## Adding a nickname theme

A theme is a slice of everyday vocabulary that a modifier can sit in front of. Adding one touches every language at once, because `nouns` is a `Record<NicknameTheme, WordPool>` — the TypeScript type will not let a language skip it, and the ports assert it instead.

1. Add the name to `NicknameTheme` in `lib/_types/global.ts` and to `NICKNAME_THEMES` in `lib/nickname/data/index.ts`.
2. Add the pool to **all four** languages. A theme that only one language can fill is not a theme.
3. **Themes have to be disjoint**, and `test/nickname.test.ts` asserts it. A word in two of them makes `theme` ambiguous for `baseWord`, and it makes `randomNicknameDetails` report a theme the caller did not ask about. When a new theme claims a word an old one already holds, move it rather than copy it — `place` took the twelve places that were sitting in `concept`, `vehicle` took 자전거 / 기차 / 배 out of `object`, `plant` took the flowers and trees out of `nature`, and `music` took the instruments out of `object` and 리듬 / 선율 / 화음 out of `concept`. Where the two senses are genuinely different words, rename instead of moving: the English toy became `Marbles` so `gem` could keep `Marble`.
4. Watch the word lengths. `nicknameLengthRange` is derived from the shortest and longest word in the pools, and `test/nickname.test.ts` pins three of its values, so a Chinese noun outside 2–3 characters or a Korean one outside 1–4 changes a number the tests assert by value.
5. Update the theme table in `README.md` and the doc comment on `NicknameTheme`. The existing per-theme tests cover the new theme as soon as it is in `NICKNAME_THEMES`.
6. Do the same in `packages/dart` and `packages/python` — `NicknameTheme`, the theme list, and the pool in all four language files. Neither Dart's `Map` nor Python's `dict` complains about a missing theme the way the TypeScript `Record` does, which is why both ports' `test_nickname` asserts every language fills every theme.
7. Add the row to `docs/en/nickname/themes.md` and `docs/ko/nickname/themes.md`.

## Commit conventions

`tag: message`, Udacity Git style tags: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, plus informal `package` (deps/config) and `typo`. Write in English, wrap identifiers and paths in backticks, one logical change per commit. Example: `feat: add \`randomNickname\` method`.

A release is its own commit, `bump version to \`x.y.z\``, and touches the package's manifest, its lockfiles and its `CHANGELOG.md` — one bullet per user-visible change, newest version on top, dated. Nothing else belongs in it. The packages version independently, so a release commit touches one package.

## Releasing

**Publishing is manual, from a maintainer's machine.** No workflow publishes any of the three; CI only tests and deploys the documentation site. Every registry rejects a re-upload of a version that already exists, so the version number is the one thing that cannot be taken back.

Before uploading anything, from the package's own directory:

| Package      | Check it                                            | Then                          |
| ------------ | --------------------------------------------------- | ----------------------------- |
| `javascript` | `npm run lint && npm run test && npm run build`      | `npm publish`                 |
| `dart`       | `dart analyze --fatal-infos && dart test` | `dart pub publish`  |
| `python`     | `ruff check . && mypy && pytest`                     | `uv build && uv publish`      |

Both `dart pub publish` and `uv publish` have a rehearsal worth using — `--dry-run` for the former, and TestPyPI (`uv publish --publish-url https://test.pypi.org/legacy/`) for the latter, which is the only way to see a first upload land without spending the real version. `twine check dist/*` reads the built metadata the way PyPI will.

The credentials are the maintainer's own and belong in the tooling's own config, never in the repository.

