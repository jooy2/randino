# CLAUDE.md

Guidance for AI agents (and humans) working in this repository. Written in English to match the repo's existing docs (`README.md`, `CONTRIBUTING.md`).

## What randino is

**randino** is a zero-dependency library that generates random **person names**, **nicknames** and **everyday words**, per language. It ships for more than one programming language — TypeScript, Dart and Python — and every one of them generates from the same datasets under the same rules. Separate concerns, deliberately:

- **Names** should read like names a person actually carries (`김민준`, `Emma Clover`). Sample data for forms, seeds, mockups.
- **Nicknames** are the handles someone would pick for a game or a website (`멋진사자`, `MistyOwl`). They are built from everyday words and **never from person names** — that rule is the whole point of keeping the two apart.
- **Words** are those everyday words on their own (`여우`, `Lantern`), one theme at a time. `randWord` takes the theme as an option, and the fourteen `randAnimal` / `randFood` / … functions are the same generator with the theme already chosen.

All three are implemented. Keep the generators apart — a shared "generator" abstraction is not wanted — but the options they all take, and the loop that draws until it has `count` results, live in `_internal/generate` and are shared. So are the word pools: `word/data` is the one dataset, and `nickname` consumes it.

Beside them sits **decorate**, which generates nothing on its own: it attaches something to a string you already have. `randSuffix` and `randPrefix` attach a random token (`멋진사자` → `멋진사자_nVtRC`); `randModifier` attaches a word out of the pools (`사자` → `멋진사자`). All three used to be nickname options — `uniqueSuffix*` and `includeModifier` — and all three moved out for the same reason: decorating a string was never a thing about nicknames. **Every decorator works with no value at all**, handing back the token or the word it would have attached, because what it attaches is worth having on its own.

That is the third group, and the three of them are why the split is not generators-and-helpers: a decorator neither generates from nothing nor answers a question. The docs sidebar has **Generators**, **Decorators** and **Utilities** for exactly this reason.

The name generator is a port of the logic behind vutools' [Random Person Name Generator](https://www.vutools.com/tools/text/random-person-name-generator) (`client/src/app/[locale]/tools/text/random-person-name-generator` in the `www-vutools-com` repo), with the same options. Two deliberate differences: the web page's `es-hangul` dependency is replaced by an internal romanizer (see below), and length bounds are resolved per language so `language: 'all'` does not stretch a Korean name to fill a Spanish name's range.

The nickname and word generators have no upstream — they are this repo's own. Their options mirror the name generator's where they mean the same thing: those live on `RandCommonOptions` (`count`, `style`, `minLength` / `maxLength`, `startsWith`, `unique`, `output`), and each generator adds only what is its own. `randWord` adds `language` and `theme`; `randNickname` adds those plus `wordSeparator`.

**A new generator should add options, not repeat them.** If it counts, filters by a starting character or deduplicates, it calls `collect` in `_internal/generate` and gets all of that for free.

## Repository layout

```
packages/
  javascript/   The npm package (`randino`) — the reference implementation
  dart/         The pub.dev package (`randino`) — a port of it, same data, same rules
  python/       The PyPI package (`randino`) — likewise
docs/           The documentation site (VitePress), English and Korean
data/           The datasets, written once (see below) — every package's copy is generated from here
tools/          Repository tooling, published nowhere (see below)
```

The **JavaScript package is the source of truth** for *behaviour*. A behaviour change starts there, and the ports follow it; a change that lands only on one side is a bug in the making. The **datasets are nobody's package**: they live in `data/` and are generated into all three, so a word is added once. Each package owns its own `README.md` and `CHANGELOG.md` because npm, pub.dev and PyPI all read those from the package root — the repository's own `README.md` is the only one that describes all of them at once, and there is no changelog at the repository root.

## The JavaScript package (`packages/javascript`)

```
lib/
  index.ts                  # re-exports every category + the public types
  _types/global.ts          # ALL public types live here (options, results)
  constants.ts              # RAND_COUNT_MAX and the length bounds, shared by all
  _internal/
    utils.ts                # shared random/string helpers, never exported
    parse.ts                # words() / tokens() / romanMap() dataset helpers
    generate.ts             # the common options, and the draw loop (`collect`)
    script.ts               # which language a string is written in, by its script
  decorate/
    index.ts                # the category's public surface
    randSuffix.ts           # public: nothing, a string, or an array -> the same, token attached
    randPrefix.ts           # public: the mirror of it
    randModifier.ts         # public: a word out of the pools instead of a token
    attach.ts               # internal: the one line the affixes differ by, and the
                            #   first-argument rule all three share
    data/index.ts           # AFFIX_CHARSET, the length bounds, the separator
  name/
    index.ts                # the category's public surface
    randName.ts             # public: string[], or NameDetail[] on `output: 'detail'`
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
  word/
    index.ts
    randWord.ts             # public: string[], or WordDetail[] on `output: 'detail'`
    randAnimal.ts …         # public: one per theme, fourteen of them, one doc page each
    wordLengthRange.ts      # public helper
    wordGenerator.ts        # internal: the generator, and the drawing primitives
    data/
      index.ts              # WORD_DATA, WORD_LANGUAGES, WORD_THEMES
      types.ts              # internal dataset types
      en.ts ko.ts ja.ts zh.ts
  nickname/
    index.ts
    randNickname.ts         # public: string[], or NicknameDetail[] likewise
    nicknameLengthRange.ts  # public helper
    nicknameGenerator.ts    # internal: shapes, length fitting; draws through word/
test/
  base.test.ts              # the package's export surface
  decorate.test.ts          # one *.test.ts per category
  name.test.ts
  nickname.test.ts
  word.test.ts
```

### Conventions

- **One public function per file**, named after the function; the category's `index.ts` re-exports them, and `lib/index.ts` re-exports the categories. This mirrors the author's other library, [qsu](https://github.com/jooy2/qsu).
- **Relative imports end in `.js`**, even though the source is `.ts` — the build emits ESM that Node has to resolve at runtime. Type-only imports may omit it.
- **Public types go in `lib/_types/global.ts`** and are exported from `lib/index.ts` with `export type *`. Types that only describe internal data (pools, language datasets) stay next to that data.
- **Internal modules are not exported** from any `index.ts`. Prefix-free names are fine; the `index.ts` files are the API boundary.
- **Every public function takes a single optional options object** and has a JSDoc block with an `@example`. All options have defaults — `randName()` with no arguments must work.
- **Prettier owns formatting** (tabs, single quotes, no trailing commas). Run `npm run format`; `npm run build` runs it first.
- **Zero runtime dependencies.** This is a hard constraint, not a preference. It is why Hangul romanization is implemented in `lib/name/romanize.ts` instead of pulling in `es-hangul`.
- **No module may do anything at import time.** `package.json` declares `sideEffects: false`, which is what lets a bundler drop the pools a caller never reaches — importing only `randSuffix` is 0.4 KB gzipped rather than the 33 KB it was. The declaration is a promise about every file in `lib/`: constants and function declarations, and nothing that runs. A single top-level statement with an effect makes it a lie, and the failure is silent — the bundler drops code the caller needed.

#### Datasets

**`lib/name/data/*.ts` and `lib/word/data/*.ts` are generated from `data/*.yaml`** and open with a banner saying so. Edit the YAML and run `node tools/codegen/index.mjs`; an edit made here directly is thrown away by the next run, and CI fails first. The `index.ts` files that register the languages and themes are *not* generated — those are edited by hand, in all three packages.

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
      decorate/               # mirrors lib/decorate, plus the `…All` list forms
    name/                   # mirrors lib/name in the JavaScript package
      data/                 # one file per language, generated from `data/`
      romanize.dart
      name_generator.dart
      rand_name.dart …
    word/                   # mirrors lib/word, minus the themed detail forms
      data/                 # one file per language, generated from `data/`
      word_generator.dart
      rand_word.dart rand_animal.dart …
    nickname/               # mirrors lib/nickname
test/
  base_test.dart            # the barrel's export surface, read out of the source
  decorate_test.dart
  name_test.dart
  nickname_test.dart
  word_test.dart
example/
  randino_example.dart      # what pub.dev renders on the package's Example tab
```

| Command                | What it does                       |
| ---------------------- | ---------------------------------- |
| `dart test`            | The suite. No build step           |
| `dart analyze`         | CI runs it with `--fatal-infos`    |
| `dart format .`        | Tall style, 100 columns            |
| `dart pub publish --dry-run` | What pub.dev will check      |

### Conventions

- **Named parameters, not an options object.** `randName(language: NameLanguage.ko, count: 3)`. Every parameter is optional and every one has the JavaScript default.
- **A null enum means "every one of them"** — that is how `'all'` crosses over. `NicknameDetail.theme` is the one nullable that means something else (the word is not one the generator knows), and it says so in its doc comment.
- **`LengthRange` replaces `[number, number]`** and compares by value, so a test can assert one directly.
- **File names are `snake_case`, one public function per file**, named after the function. `lib/randino.dart` re-exports them with an explicit `show`.
- **Imports are `package:` imports**, even inside the package — `always_use_package_imports` is on, because a relative import breaks the moment a file moves.
- **Everything public carries a doc comment**, including inside `lib/src`. `public_member_api_docs` is on.
- **No dependencies.** `dart:math` is the only import from outside the package.

### The one thing Dart cannot do the same way

`String.normalize('NFD')` does not exist in Dart and there is no diacritic property to strip against, so `romanize.dart` folds Latin accents through a **written-out table** instead. It covers more than the pools hold on purpose, and `test/name_test.dart` folds every entry of every `RomanMode.fold` pool and asserts the result is ASCII — that test is what keeps a newly added `ư` from silently surviving into a supposedly romanized name. It has already caught one.

### The second thing, and it is every return type that depends on an argument

Dart has neither overloads nor union types, so a function cannot hand back one type for one argument and another type for another. That costs two things, and both are the same limitation:

- `randSuffix` takes a `String` and `randSuffixAll` takes a `List<String>`, where npm and PyPI have one function taking either. The same goes for `randModifier` / `randModifierAll`. And because Dart cannot make a positional parameter optional alongside named ones, the decorators' `value` is **named**: `randSuffix(value: 'a')`, so that `randSuffix()` can mean the bare token.
- `randNameDetails`, `randNicknameDetails` and `randWordDetails` still exist here. In the other two packages they are `output: 'detail'` on the generator itself; in Dart, `randName` returns `List<String>` and that is the end of it.
- The **fourteen themed word functions have no detail form.** Twenty-eight functions for one option would be the wrong trade, so `randAnimal` returns `List<String>` and a caller who wants the detail passes `WordTheme.animal` to `randWordDetails`. That asymmetry is documented on every one of them.

Do not try to fake either with `Object` or a generic: `T extends Object` would type-check `randSuffix(3)` and fail at run time, which is worse than a second name. **A new option that changes a return type lands as a second Dart function**, and the `::: lang` blocks on the docs page are where the two shapes are shown side by side.

### Keeping the ports in step

The JavaScript package is the source of truth for behaviour. A behaviour change lands there first, then in each port, in the same commit where that is practical. (The datasets are not part of this: they are generated from `data/` into all three at once.) Every suite asserts the same properties over the same pools, so a port that drifted shows up as a test that passes on one side and fails on another — which is the point of porting the tests rather than writing new ones.

That catches drifting *behaviour*. Drifting *data* is a separate problem, and it is solved rather than checked: the pools are written once in `data/` and generated into all three packages, so there is no second copy to forget. `node tools/parity/index.mjs` still runs, because a generator can emit something one language reads differently — see the tooling section below.

## The Python package (`packages/python`)

A port of the JavaScript package, not a second design. Same datasets, same rules, same numbers; what differs is the surface, which is Python's.

```
src/randino/
  __init__.py               # the barrel — its `__all__` IS the public API
  _types.py                 # ALL public types (Literals, the two details)
  _internal/
    utils.py                # pick / rand_int / chance / clamp, never exported
    parse.py                # words() / tokens() / weights() / roman_map()
  decorate/                 # mirrors lib/decorate; `@overload` carries the shape
  name/                     # mirrors lib/name in the JavaScript package
    data/                   # one file per language, generated from `data/`
    _romanize.py
    _generator.py
    rand_name.py …
  word/                     # mirrors lib/word
    data/                   # one file per language, generated from `data/`
    _generator.py
    rand_word.py rand_animal.py …
  nickname/                 # mirrors lib/nickname
  py.typed                  # PEP 561 — without it every annotation is ignored
tests/
  test_base.py              # the barrel's export surface, and the no-dependency rule
  test_decorate.py
  test_name.py
  test_nickname.py
  test_word.py
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

- **Keyword-only arguments, not an options object.** `rand_name(language="ko", count=3)`; the `*` in every generator's signature is deliberate, because `rand_name("ja", "female", 5)` is both unreadable and a parameter order frozen into the API. The three `name_*` / `nickname_length_range` helpers are the exception — they take their arguments positionally as well, the way the JavaScript ones do, because they are short enough to read either way.
- **`Literal`, not enums.** `language="ko"` is the same string the npm package takes, and `"all"` survives the crossing intact — which is why Python needs none of Dart's "a null enum means every one of them", and why no argument here has to distinguish "omitted" from "every one of them".
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
    llms.ts                 # `llms.txt` and `llms-full.txt`, written at build time
    theme/                  # the language switch, the packages menu, the demo, the CSS
      components/
        WordOptions.vue     # the option table `randWord` and its fourteen share
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
| `npm run format`        | Prettier, read-only — what CI runs                  |
| `npm run format:fix`    | Prettier, in place                                  |

### One page, every package

A page says the same thing about `randName` whichever package a reader installs; only the code, the option shape and the install line differ. So they are not three sites and not three folders:

- **`::: lang js` … `:::`** wraps a block only one package sees. `::: lang js dart` is a block two of them want.
- **`<Lang js="…" dart="…" py="…" code />`** is the inline form, for a phrase in the middle of a sentence that does not differ. It is what keeps an option table from being written three times, and what carries `min_length` next to `minLength`.

Every variant is in the document and CSS hides all but one, which is what buys the no-flash switch, a hydration-safe render and a search index that carries all of them. Adding a package is an entry in `data/languages.ts`, a branch in `LangMark.vue` for its logo, a line in the one hard-coded selector group in `theme/styles/lang.css`, a row in `packageLinks` in `config.ts` plus a branch in `RegistryMark.vue` for the registry it is published to, and the blocks on whatever pages have something to say about it.

**Function and option names in headings, the sidebar and anchors stay in the JavaScript spelling**, and only the body carries all three. That is not laziness: VitePress builds its outline from the rendered heading and its sidebar from `config.ts`, so a per-package heading would either read as all three names run together or flash the wrong one before hydration — and a cross-page `#anchor` has to resolve for every reader, not just the one who picked JavaScript. The mapping is mechanical (`minLength` → `min_length`) and Getting started states it once.

### The menu is not the folders

`name/`, `nickname/`, `word/` and `decorate/` are four folders because those are four things in the source, and the sidebar deliberately does not repeat that split. A reader looking for `randNickname` is looking for a function, not for the corner of the library it belongs to, so the groups are what a function **is**:

- **API**, which nests three groups by what a function *does with a string*: **Generators** make one out of nothing, **Decorators** attach something to one you already have (`randSuffix`, `randPrefix`, `randModifier`), and **Utilities** answer a question about a language (`nameLengthRange`, `wordLengthRange`, the two `nameSupports…`). Generators nests once more, into **General** — `randName`, `randNickname`, `randWord`, one per kind of text — and **Words**, the fourteen themed forms of the last of them. Seventeen in one list would bury the three, and the fourteen are one function with an argument decided rather than fourteen ideas.
- **Behaviour** — the prose explaining how a generator's options behave, where there is enough of it to be its own page. `randName` and `randNickname` have one each; `randWord` does not, because it draws one word and its API page says everything there is to say. Its own group rather than more entries under Guide, because it grows alongside Generators and Guide does not.

`data/sidebar.ts` nests as deep as it is written: a `SidebarGroup`'s `items` are pages, or more groups, and `sidebarFor` recurses. **Three levels is the working limit** — API > Generators > Words is the deepest there is. The third level earns itself by splitting one group that had grown past reading, not by being a finer category: seventeen entries under Generators is a list nobody scans, and `randAnimal` is `randWord` with an argument decided, so `General` and `Words` is the split the functions themselves suggest. Anything that is merely *related* to a page still goes beside it, not under it.

**One page, one function**, which is why there is no `helpers` page holding three of them any more: a page that documents three functions can be named after none of them, so the menu names the page and the reader still has to open it to find out whether what they came for is inside.

There is **no exception for a family of functions**. `randAnimal` … `randProduct` are fourteen names for `randWord` with its `theme` decided, and they have fourteen pages: a reader looking for `randAnimal` should find `randAnimal`, not a section of somebody else's page. What that would cost — the same option table written out thirty times, in two locales, with three packages' types in every cell — is paid by `WordOptions.vue` instead, which draws the table once and takes a `theme` prop for the one page that accepts the option rather than answering it. **A page repeated across pages is a component, not a reason to merge the pages.**

Those fourteen are the **Words** group nested inside Generators, beside the **General** three — in one list with them they would bury them. Words is also the one group the navbar's API dropdown leaves out, and the group says so itself with `sidebarOnly`: `navGroupsFor` gathers a group's pages through its subgroups, and skips the ones marked. The Markdown that is left on each page is what actually differs: what the theme is, and three code samples of it.

The navbar is the same lists — its API dropdown is Generators, Decorators and Utilities as three labelled sections, built out of `data/sidebar.ts` by `navGroupsFor`, so the menu and the sections it points into cannot drift. Generators there is the three of **General**, because the only other thing in it is `sidebarOnly`. Its **Packages** dropdown is `PackageLinks.vue`, which is where npm, pub.dev and PyPI went when they stopped being three of the four icons in the navbar's right-hand corner; the registry URLs are still derived from the three manifests in `config.ts`, and GitHub is the one social link left. Its marks are `RegistryMark.vue` and not `LangMark.vue` — npm is not JavaScript and PyPI is not Python, and only pub.dev, which brands itself with the Dart logo, has the same drawing in both files.

### The demo runs the real library

`/demo` is not a description of `randName`; it calls it, in the reader's browser. The Vite alias in `config.ts` points the bare specifier `randino` at `packages/javascript/lib/index.ts`, and a four-line plugin rewrites the package's own `./x.js` imports to `./x.ts` — those extensions are deliberate (the built ESM needs them) and Vite cannot resolve them against source files by itself.

**Depending on `randino` from npm would be the wrong shape.** The site documents this repository, so a page describing an option added since the last release would demo a build without it. The cost is that `.github/workflows/publish-documentation.yml` has to redeploy when `packages/javascript/lib/**` changes, which is in its path filter.

`Demo.vue` generates nothing during SSR. A page of random text pre-rendered at build time and re-rendered on hydration is a guaranteed mismatch rather than a likely one, so the first batch is drawn in `onMounted`.

### `llms.txt` is generated, not written

`llms.ts` writes `llms.txt` and `llms-full.txt` into `docs-dist/` from `buildEnd`, the same place `robots.txt` is written. Both come out of `data/sidebar.ts` and the same first-paragraph summary the `<meta>` descriptions use, so a page added to the menu is in them without anyone remembering — a hand-written index is a second table of contents, and the second one goes stale.

They are **English and JavaScript**: llms.txt has no notion of locales, and the `::: lang` blocks are flattened to the reference implementation's half with the mapping to Dart and Python stated once at the top. `data/markdown.ts` holds the one transform that flattening and the `<meta>` descriptions both need.

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

## The datasets (`data/`)

Every pool the library draws from, written once and generated into all three packages.

```
data/
  word/en.yaml ja.yaml ko.yaml zh.yaml    the word pools, per language
  name/en.yaml ko.yaml …                  the name pools, per language (nine)
  name/syllables.yaml                     the shared invented-name templates
  README.md                               the format, and how to edit it
```

**Three packages meant three copies of every pool, and adding a word meant editing all three.** They never actually drifted — but only because somebody kept them in step by hand, and that is not a property, it is a habit. So the pools moved out of the packages: `data/` is where a word is added, and `node tools/codegen/index.mjs` writes it into all 42 data files.

The format is a subset of YAML — scalars, integer pairs, block scalars, nesting — and `data/README.md` is what a contributor reads. Two things are worth knowing here:

- **A comment above a field is carried into all three packages.** The note explaining why Korean's `restMale` leaves out the syllables that would spell 하인 is written once and emitted three times, re-wrapped to each language's marker and indent. That is why the generator has a YAML reader of its own rather than a dependency: a general parser throws the comments away.
- **The `index` files are not generated.** Registering a language is a line or two carrying each language's own doc comments, and `tools/parity` already fails when the three disagree. Generating them would be a lot of emitter for very little editing.

## Repository tooling (`tools/`)

Scripts that belong to the repository rather than to any one package. Nothing here is published, and no package depends on it.

```
tools/
  codegen/
    index.mjs             # reads data/, writes every target, runs each formatter
    yaml.mjs              # the YAML subset data/ is written in, comments kept
    render.mjs            # line breaking: pools, comments, the banner
    emit/javascript.mjs   # one emitter per package
    emit/dart.mjs
    emit/python.mjs
    README.md             # why generate rather than load, and how to extend it
  parity/
    index.mjs             # the check: read all three, compare, fail on a difference
    dump-javascript.ts    # one dump per package, each writing the canonical shape
    dump_dart.dart
    dump_python.py
    README.md             # what canonical means, and what the check covers
```

Both run from `.github/workflows/run-check-data.yml`, the one workflow that installs all three toolchains at once.

### `tools/codegen` — the packages' data files

`node tools/codegen/index.mjs` writes them; `--check` fails when they are out of date, naming the file, and puts back whatever was there so a pull request's own diff survives.

**Each emitter writes syntactically valid source and leaves the layout to that language's formatter** — prettier, `dart format` and `ruff format`, all three of which the generator runs over what it wrote. That is what keeps the emitters small: they decide field order, imports and which helper wraps each pool, and nothing about indentation. The two things a formatter will not do are the two `render.mjs` handles — what is inside a string literal, and how a comment wraps.

**Run-time loading was considered and is the wrong shape here.** Dart has no `dart:io` on Flutter Web, so a JSON file would have to be an asset the *app* configures; `nouns: Record<WordTheme, WordPool>` stops failing at compile time and starts failing at run time; and every package stops being a plain library with nothing to resolve. `tools/codegen/README.md` states this so the question does not get re-opened from scratch.

A field added to a dataset has to be taught to all three emitters **and** to the three dumps in `tools/parity`. A field only one emitter writes is one the parity check reports, which is the intended failure.


### `tools/parity` — the packages hold the same data

`node tools/parity/index.mjs` loads the datasets out of all three packages the way each package loads them, and fails on any difference.

**It is not redundant with the generator.** `codegen --check` compares text: the files on disk against what `data/` says they should be. This compares *what the three languages actually parse*, which is a different claim — an emitter that escapes a quote wrong, or writes a pool one language splits differently, produces files that match `data/` perfectly and still disagree at run time. It is the end-to-end test of the generator, and it is what would catch a package whose hand-edited `index` file forgot to register a language.

**The dumps normalize what only differs because the languages differ, and nothing else.** A pool entry is `{ n, r }` everywhere; field names are the JavaScript ones; an optional field is present and null rather than absent; `syn` carries its `kind` tag even in the two packages that tell the shapes apart by type. That normalization lives in the three dumps — one per package, each responsible for its own language's spelling — so the comparison itself has nothing to know about any of them. Adding a field to a dataset means adding it to all three dumps, and the check reports a field only one dump writes as a difference, which is the intended failure.

**Do not widen it into a general "the ports agree" check.** It covers the word and name datasets, the surname romanization map, and the bounds in `constants` and `decorate/data` — the last of which is still written by hand in each package. The nickname generator's shape weights are deliberately left out — they are private to the generator in the Dart port, and making them public for the sake of a check would be letting the check design the API.

## Testing a random generator

The return value is random, so tests assert the **properties every result must have**, over a sample large enough (`SAMPLE = 60`) that a broken option cannot pass by luck:

- The script matches the language (`/^[가-힣]+$/` for Korean, `\p{Script=Cyrillic}` for Russian, …).
- The structure matches the options — word count for `includeSurname` / `includeMiddleName`, character count for CJK.
- Requested constraints hold for every name: `startsWith`, `minLength` / `maxLength`, `unique`.
- `count` is exact, including the clamped edges (`0`, negatives, above `RAND_COUNT_MAX`).
- Anything genuinely deterministic is asserted by value: `nameLengthRange`, the romanizer's known outputs.

Do not assert an exact generated name, and do not use a fixed seed — there is none. When a property test is flaky, the option is either under-specified or the assertion is wrong; **run the suite 20+ times before calling it stable**, because a 1-in-1000 case will show up in CI otherwise.

Gender is the one option with no directly observable effect in most languages. It is verified through Russian, whose middle name and surname inflect for it (`…ович` / `…овна`, `Иванов` / `Иванова`).

Nicknames are checked against the datasets themselves: `randNickname({ output: 'detail' })` reports the `words` it used, so every word can be asserted to come from the language's pools, and the English pools are asserted to share nothing with the English person-name pools. Korean and Japanese cannot have that last invariant — `하늘`, `별` and `森` are everyday nouns that also happen to be names, and `아름다운하늘` is still nobody's name.

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
- **Neither a unique suffix nor a modifier is a nickname option.** `randSuffix` attaches a token to any string and `randModifier` attaches a word to one, so `minLength` / `maxLength` describe the whole nickname and nothing has to be excluded from them. What is left on the generator is the part that is genuinely about composing: the shapes, the length fitting, and the boundary re-draw.
- **The nickname generator is now the thinnest it has been, and that is worth watching.** `randModifier(randAnimal())` produces `멋진사자` too. What `randNickname` still adds is the trailing-word shapes, a length range the whole thing has to land inside, and the re-draw when two words stutter across their boundary — real, but not much. If it is to stay its own generator it needs something that only a nickname has; that is open work, not a settled design.
- **`theme` is reported, not asserted.** A word drawn from a theme reports it; an invented word is looked up across all themes, because it can spell a real one by accident, and reports `null` when it is found nowhere.
- **Two rough spots trigger a re-draw** rather than being shipped: a `startsWith` that no real word in the rolled theme matched (another theme probably has one), and a word ending on the character the next one starts with (`石霜` + `霜雨`). Both fall back to the closest attempt if every attempt is rough.
- **Invented-word templates stay short.** Two or three syllables per word, because up to three words are joined; `en` is capped at two.

## Adding a name language

**The dataset is written once; everything else is still three packages.** The pools go in `data/`, and the code, the registration and the tests are per package — a language that exists in one package's `index` and not another's is still the failure mode to avoid, and the three suites plus `tools/parity` are what catch it.

1. Write `data/name/<code>.yaml`: `language` (its English name, for the generated doc comments), name order, joiner (`''` for CJK, `' '` otherwise), `hasMiddle`, `roman` mode, `lengthSpec`, and the pools. CJK languages use `givenMale` / `givenFemale` plus `first*` / `rest*` syllables; other scripts use `male` / `female` / `last` plus a `syn` reference into `data/name/syllables.yaml`. Add `lastWeights` only when the language's surnames are steeply distributed — an even draw is already close to reality for the long-tailed ones (see the surname bullet below).
2. `lengthSpec` must match reality — it is the default length range, and a wrong value shows up as padded or truncated names.
3. Run `node tools/codegen/index.mjs`. That writes the dataset into all three packages.
4. Add the code to `NameLanguage` in each package: `lib/_types/global.ts`, the Dart enum, and the `Literal` in `src/randino/_types.py`.
5. Register it in each package's name `index`: `NAME_DATA` / `NAME_LANGUAGES` in `lib/name/data/index.ts`, and the same two in `index.dart` and `__init__.py`. These are the files the generator deliberately leaves alone.
6. If it needs a new romanization mode, add it to `RomanMode` and handle it in each package's romanizer — `lib/name/romanize.ts`, `romanize.dart`, `_romanize.py`. Dart's fold table is written out by hand, so a new Latin-script language needs its diacritics added there.
7. Add the script regex to `test/name.test.ts`, `test/name_test.dart` and `SCRIPT` in `tests/test_name.py`; the existing per-language tests then cover it.
8. Add the row to the tables in `docs/en/guide/languages.md` and `docs/ko/guide/languages.md`, and to the one in the root `README.md`.
9. Run `node tools/parity/index.mjs` and the three suites.

## Adding a word language

The four supported languages (`ko`, `en`, `ja`, `zh`) share one property: a modifier can sit in front of a noun exactly as it is written in the dictionary. **That is the bar for adding another one** — it is a word language and a nickname language at once, because they are the same pools. Italian, German, Russian, Spanish and Vietnamese are name languages but not word languages, and the reason is grammar, not effort:

- Italian, Spanish, Russian and German inflect the modifier for the noun (`gatto azzurro` / `luna azzurra`, `blauer Wal` / `blaue Katze`). Supporting them means tagging every noun with its gender and storing every modifier once per gender — do that, or leave the language out. Half-agreement output is worse than none.
- Vietnamese puts the modifier **after** the noun (`mèo xanh`) and reverses possessive compounds (`đuôi mèo`, not `mèo đuôi`), so it needs a word-order field on `WordLanguageData` before its pools are worth writing.

To add one that clears the bar:

1. Write `data/word/<code>.yaml`: `language`, `joiner`, `capitalize`, `modifiers` in attributive form, `nouns` for every theme in `WORD_THEMES`, an optional `parts` pool, and a `syn` template (`kind: syllable` for alphabetic scripts, `kind: pool` where one character is one syllable).
2. Leave `parts` out unless a bare noun-noun compound reads naturally — that is why `ja` and `zh` have none.
3. Aim for 60+ nouns per theme; the pools are what make the output varied, and the combination count is roughly `modifiers × nouns × (1 + parts)` — around 9M for `ko` and `en`, 145K for `ja` and `zh`, which have no `parts`. `gem`, `sport`, `vehicle` and `product` are the exception (roughly 55 / 46 / 43 / 36 words) — the world holds fewer of those, and padding them with near-synonyms reads worse than a shorter pool.
4. No person names, and no word that is only a name — for `en` this is enforced against the person-name pools, which is why `job` has no `Knight`, `Baker` or `Hunter` and `plant` no `Rose` or `Ivy`.
5. Run `node tools/codegen/index.mjs`.
6. Add the code to `WordLanguage` and register it in the word `index` of all three packages, the same way a name language is registered.
7. Add the language to `SCRIPT` in `test/word.test.ts` **and** `test/nickname.test.ts`, and to the same two suites in the ports; the existing per-language tests then cover it.
8. Add the row to the tables in `docs/*/guide/languages.md` and to the root `README.md`.
9. Run `node tools/parity/index.mjs` and the three suites.

## Adding a word theme

A theme is a slice of everyday vocabulary that a modifier can sit in front of. Adding one touches every language at once, because `nouns` is a `Record<WordTheme, WordPool>` — the TypeScript type will not let a language skip it, and the ports assert it instead. **It also adds a public function**, because every theme has one.

1. Add the name to `WordTheme` in `lib/_types/global.ts` and to `WORD_THEMES` in `lib/word/data/index.ts` — and to the matching two in each port, since neither is generated.
2. Add the pool under `nouns` in **all four** `data/word/*.yaml` files, then run `node tools/codegen/index.mjs`. A theme that only one language can fill is not a theme.
3. **Themes have to be disjoint**, and `test/nickname.test.ts` asserts it. A word in two of them makes the reported `theme` ambiguous, and it makes the detail output report a theme the caller did not ask about. When a new theme claims a word an old one already holds, move it rather than copy it — `place` took the twelve places that were sitting in `concept`, `vehicle` took 자전거 / 기차 / 배 out of `object`, `plant` took the flowers and trees out of `nature`, and `music` took the instruments out of `object` and 리듬 / 선율 / 화음 out of `concept`. Where the two senses are genuinely different words, rename instead of moving: the English toy became `Marbles` so `gem` could keep `Marble`.
4. Watch the word lengths. `wordLengthRange` and `nicknameLengthRange` are both derived from the shortest and longest word in the pools, and `test/word.test.ts` and `test/nickname.test.ts` each pin three of their values, so a Chinese noun outside 2–3 characters or a Korean one outside 1–4 changes a number the tests assert by value.
5. Add the `rand<Theme>` function beside the other fourteen, export it from `lib/word/index.ts`, and add it to the `THEMED` table in `test/word.test.ts` — that table is asserted to have exactly one entry per theme, so a missing function fails the suite. Update the theme list in `README.md` and the doc comment on `WordTheme`.
6. Do the same in `packages/dart` and `packages/python` — `WordTheme`, the theme list, and the themed function. The pools themselves arrive with the generator. Neither Dart's `Map` nor Python's `dict` complains about a missing theme the way the TypeScript `Record` does, which is why both ports assert every language fills every theme.
7. Add the row to `docs/en/word/themes.md` and `docs/ko/word/themes.md`.
8. Run `node tools/parity/index.mjs` and the three suites.

## Commit conventions

`tag: message`, Udacity Git style tags: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, plus informal `package` (deps/config) and `typo`. Write in English, wrap identifiers and paths in backticks, one logical change per commit. Example: `feat: add \`randNickname\` method`.

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

