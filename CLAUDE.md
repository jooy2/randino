# CLAUDE.md

Guidance for AI agents (and humans) working in this repository. Written in English to match the repo's existing docs (`README.md`, `CONTRIBUTING.md`).

## What randino is

**randino** is a zero-dependency library that generates random **person names**, **nicknames** and **everyday words**, per language. It ships for more than one programming language — TypeScript, Dart and Python — and every one of them generates from the same datasets under the same rules. Separate concerns, deliberately:

- **Names** should read like names a person actually carries (`김민준`, `Emma Clover`). Sample data for forms, seeds, mockups.
- **Nicknames** are the handles someone would pick for a game or a website (`멋진사자`, `MistyOwl`). They are built from everyday words and **never from person names** — that rule is the whole point of keeping the two apart.
- **Words** are those everyday words on their own (`여우`, `Lantern`), one theme at a time. `randWord` takes the theme as an option, and the twenty-five `randAnimal` / `randFood` / … functions are the same generator with the theme already chosen.
- **Sentences** are whole statements in the language's own grammar (`여우가 사과를 먹는다.`, `The brave lion runs quietly.`). They draw the same nouns a nickname does, and what they add is everything a sentence needs beside them — a verb in the form a statement ends on, the particles, the articles and the shapes.

All four are implemented. Keep the generators apart — a shared "generator" abstraction is not wanted — but the options they all take, and the loop that draws until it has `count` results, live in `_internal/generate` and are shared. So are the word pools: `word/data` is the one dataset, and `nickname` consumes it.

Beside them sits **decorate**, which generates nothing on its own: it attaches something to a string you already have. `randSuffix` and `randPrefix` attach a random token (`멋진사자` → `멋진사자_nVtRC`); `randModifier` attaches a word out of the pools (`사자` → `멋진사자`). All three used to be nickname options — `uniqueSuffix*` and `includeModifier` — and all three moved out for the same reason: decorating a string was never a thing about nicknames. **Every decorator works with no value at all**, handing back the token or the word it would have attached, because what it attaches is worth having on its own.

That is the third group, and the three of them are why the split is not generators-and-helpers: a decorator neither generates from nothing nor answers a question. The docs sidebar has **Generators**, **Decorators** and **Utilities** for exactly this reason.

The name generator is a port of the logic behind vutools' [Random Person Name Generator](https://www.vutools.com/tools/text/random-person-name-generator) (`client/src/app/[locale]/tools/text/random-person-name-generator` in the `www-vutools-com` repo), with the same options. Two deliberate differences: the web page's `es-hangul` dependency is replaced by an internal romanizer (see below), and length bounds are resolved per language so `language: 'all'` does not stretch a Korean name to fill a Spanish name's range.

The nickname, word and sentence generators have no upstream — they are this repo's own. Their options mirror the name generator's where they mean the same thing: those live on `RandCommonOptions` (`count`, `realism`, `minLength` / `maxLength`, `startsWith`, `unique`, `output`), and each generator adds only what is its own. `randWord` adds `language` and `theme`; `randNickname` adds those plus `wordSeparator`; `randSentence` adds `shape`, `slots`, `include`, `sentences`, `type`, `quote`, `style` and `includeName`.

**A new generator should add options, not repeat them.** If it counts, filters by a starting character or deduplicates, it calls `collect` in `_internal/generate` and gets all of that for free.

## Repository layout

```
packages/
  javascript/   The npm package (`randino`) — the reference implementation
  dart/         The pub.dev package (`randino`) — a port of it, same data, same rules
  python/       The PyPI package (`randino`) — likewise
docs/           The documentation site (VitePress), English and Korean
tools/          Repository tooling, published nowhere (see below)
```

The **JavaScript package is the source of truth**. A behaviour change starts there, and the ports follow it; a change that lands only on one side is a bug in the making. The datasets are the same: every package holds its own copy, written in its own language's syntax, and `tools/parity` is what keeps the three honest. Each package owns its own `README.md` and `CHANGELOG.md` because npm, pub.dev and PyPI all read those from the package root — the repository's own `README.md` is the only one that describes all of them at once, and there is no changelog at the repository root.

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
    randAnimal.ts …         # public: one per theme, twenty-five of them, one doc page each
    wordLengthRange.ts      # public helper
    wordGenerator.ts        # internal: the generator, and the drawing primitives
    data/
      index.ts              # WORD_DATA, WORD_LANGUAGES, WORD_THEMES
      types.ts              # internal dataset types
      en.ts ko.ts ja.ts zh.ts …   # one file per language, nine of them
  nickname/
    index.ts
    randNickname.ts         # public: string[], or NicknameDetail[] likewise
    nicknameLengthRange.ts  # public helper
    nicknameGenerator.ts    # internal: shapes, length fitting; draws through word/
  sentence/
    index.ts
    randSentence.ts         # public: string[], or SentenceDetail[] likewise
    sentenceLengthRange.ts  # public helper
    sentenceGenerator.ts    # internal: the shapes, the verb selection, the fitting
    story.ts                # internal: the planner that turns a story into beats
    data/
      index.ts              # SENTENCE_DATA, THEME_CLASS, STORIES, FIELD_RULES
      types.ts              # internal dataset types (verbs, states, frames)
      en.ts ko.ts ja.ts …   # one file per language, nine of them
test/
  base.test.ts              # the package's export surface
  decorate.test.ts          # one *.test.ts per category
  name.test.ts
  nickname.test.ts
  sentence.test.ts
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
| `npm run build`  | `format` → `clean` → `tsc` → `minify`                               |
| `npm run lint`   | ESLint (`lint:fix` to fix)                                          |
| `npm run format` | Prettier, in place                                                  |

The tests are TypeScript but import from `../dist`, so they are run through `tsx` and **they need a build** — that is what `npm run test` does first. Node >= 18.

Only `dist/` and the top-level `README.md` / `LICENSE` are published; `.npmignore` keeps `lib/`, `test/`, the config files and the remaining markdown out of the package.

**`build` empties `dist/` first**, because `tsc` writes over what it emits and never deletes. A renamed folder leaves its old output behind — `lib/affix` became `lib/decorate` and `dist/affix` sat there afterwards — and since the whole of `dist/` is published, that is dead code shipped to npm.

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
      data/                 # one file per language, ported verbatim
      romanize.dart
      name_generator.dart
      rand_name.dart …
    word/                   # mirrors lib/word, minus the themed detail forms
      data/                 # one file per language, ported verbatim
      word_generator.dart
      rand_word.dart rand_animal.dart …
    nickname/               # mirrors lib/nickname
    sentence/               # mirrors lib/sentence, plus `randSentenceDetails`
      data/                 # one file per language, ported verbatim
test/
  base_test.dart            # the barrel's export surface, read out of the source
  decorate_test.dart
  name_test.dart
  nickname_test.dart
  sentence_test.dart
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
- `randNameDetails`, `randNicknameDetails`, `randWordDetails` and `randSentenceDetails` still exist here. In the other two packages they are `output: 'detail'` on the generator itself; in Dart, `randName` returns `List<String>` and that is the end of it.
- `randSentence`'s `include` is a `List<String>` where the other two take a string or a list, for the same reason.
- The **twenty-five themed word functions have no detail form.** Twenty-eight functions for one option would be the wrong trade, so `randAnimal` returns `List<String>` and a caller who wants the detail passes `WordTheme.animal` to `randWordDetails`. That asymmetry is documented on every one of them.

Do not try to fake either with `Object` or a generic: `T extends Object` would type-check `randSuffix(3)` and fail at run time, which is worse than a second name. **A new option that changes a return type lands as a second Dart function**, and the `::: lang` blocks on the docs page are where the two shapes are shown side by side.

### Keeping the ports in step

The JavaScript package is the source of truth. A behaviour change lands there first, then in each port, in the same commit where that is practical. Every suite asserts the same properties over the same pools, so a port that drifted shows up as a test that passes on one side and fails on another — which is the point of porting the tests rather than writing new ones.

That catches drifting *behaviour*. It does not catch drifting *data*: a word added to one package's pools and forgotten in the others breaks no property, because every suite asserts over whatever pools its own package happens to hold. `node tools/parity/index.mjs` is what catches that — see the tooling section below.

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
    data/                   # one file per language, ported verbatim
    _romanize.py
    _generator.py
    rand_name.py …
  word/                     # mirrors lib/word
    data/                   # one file per language, ported verbatim
    _generator.py
    rand_word.py rand_animal.py …
  nickname/                 # mirrors lib/nickname
  sentence/                 # mirrors lib/sentence
    data/                   # one file per language, ported verbatim
  py.typed                  # PEP 561 — without it every annotation is ignored
tests/
  test_base.py              # the barrel's export surface, and the no-dependency rule
  test_decorate.py
  test_name.py
  test_nickname.py
  test_sentence.py
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
        WordOptions.vue     # the option table `randWord` and its twenty-five share
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

- **API**, which nests three groups by what a function *does with a string*: **Generators** make one out of nothing, **Decorators** attach something to one you already have (`randSuffix`, `randPrefix`, `randModifier`), and **Utilities** answer a question about a language (`nameLengthRange`, `wordLengthRange`, the two `nameSupports…`). Generators nests once more, into **General** — `randName`, `randNickname`, `randWord`, one per kind of text — and **Words**, the twenty-five themed forms of the last of them. Seventeen in one list would bury the three, and the twenty-five are one function with an argument decided rather than twenty-five ideas.
- **Behaviour** — the prose explaining how a generator's options behave, where there is enough of it to be its own page. `randName` and `randNickname` have one each; `randWord` does not, because it draws one word and its API page says everything there is to say. Its own group rather than more entries under Guide, because it grows alongside Generators and Guide does not.

`data/sidebar.ts` nests as deep as it is written: a `SidebarGroup`'s `items` are pages, or more groups, and `sidebarFor` recurses. **Three levels is the working limit** — API > Generators > Words is the deepest there is. The third level earns itself by splitting one group that had grown past reading, not by being a finer category: twenty-five entries under Generators is a list nobody scans, and `randAnimal` is `randWord` with an argument decided, so `General` and `Words` is the split the functions themselves suggest. Anything that is merely *related* to a page still goes beside it, not under it.

**One page, one function**, which is why there is no `helpers` page holding three of them any more: a page that documents three functions can be named after none of them, so the menu names the page and the reader still has to open it to find out whether what they came for is inside.

There is **no exception for a family of functions**. `randAnimal` … `randProduct` are twenty-five names for `randWord` with its `theme` decided, and they have twenty-five pages: a reader looking for `randAnimal` should find `randAnimal`, not a section of somebody else's page. What that would cost — the same option table written out thirty times, in two locales, with three packages' types in every cell — is paid by `WordOptions.vue` instead, which draws the table once and takes a `theme` prop for the one page that accepts the option rather than answering it. **A page repeated across pages is a component, not a reason to merge the pages.**

Those twenty-five are the **Words** group nested inside Generators, beside the **General** three — in one list with them they would bury them. Words is also the one group the navbar's API dropdown leaves out, and the group says so itself with `sidebarOnly`: `navGroupsFor` gathers a group's pages through its subgroups, and skips the ones marked. The Markdown that is left on each page is what actually differs: what the theme is, and three code samples of it.

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

## Repository tooling (`tools/`)

Scripts that belong to the repository rather than to any one package. Nothing here is published, and no package depends on it.

```
tools/
  parity/
    index.mjs             # the check: read all three, compare, fail on a difference
    dump-javascript.ts    # one dump per package, each writing the canonical shape
    dump_dart.dart
    dump_python.py
    README.md             # what canonical means, and what the check covers
  emit/
    index.mjs             # writes the Dart and Python sentence datasets, then formats them
    sentence-data.ts      # the emitter: reads `SENTENCE_DATA`, writes each port's syntax
    README.md             # what it writes, what it leaves alone
```

The parity check runs from `.github/workflows/run-check-data.yml`, the one workflow that installs all three toolchains at once. The emitter runs by hand.

### `tools/emit` — the sentence datasets are written once

`node tools/emit/index.mjs` reads `SENTENCE_DATA` out of the JavaScript package and writes `packages/dart/lib/src/sentence/data/<code>.dart` and `packages/python/src/randino/sentence/data/<code>.py` for every language, then runs `dart format` and `ruff format` over them. **Edit a sentence dataset in `packages/javascript` and regenerate**, rather than editing the three copies; the emitted files say at the top that they are generated, and a comment worth keeping goes in the JavaScript source.

It covers the sentence datasets alone. The word and name datasets, the `index` files, `THEME_CLASS`, the stories and the field rules are still written by hand in all three, and `tools/parity` is what checks them. A generated file that fails to compile is a bug in `sentence-data.ts`, not something to patch in the file.

### `tools/parity` — the packages hold the same data

`node tools/parity/index.mjs` loads the datasets out of all three packages the way each package loads them, and fails on any difference.

**It compares what the three languages actually parse**, not the files. A pool one language splits differently, an escape that means something else in Dart, a language registered in one `index` and forgotten in another — none of that is visible by reading the three files side by side, and all of it shows up here.

**The dumps normalize what only differs because the languages differ, and nothing else.** A pool entry is `{ n, r }` everywhere; field names are the JavaScript ones; an optional field is present and null rather than absent; `syn` carries its `kind` tag even in the two packages that tell the shapes apart by type. That normalization lives in the three dumps — one per package, each responsible for its own language's spelling — so the comparison itself has nothing to know about any of them. Adding a field to a dataset means adding it to all three dumps, and the check reports a field only one dump writes as a difference, which is the intended failure.

**Do not widen it into a general "the ports agree" check.** It covers the word, sentence and name datasets, the stories and the field rules beside them, the surname romanization map, and the bounds in `constants` and `decorate/data` — the last of which is still written by hand in each package. The nickname shapes are in it now that they are `WordLanguageData.frames`: they were left out while they were a table private to each generator, and being data is what put them in. The sentence datasets are the same story on a larger scale, `THEME_CLASS` included, because a theme moving from one class to another changes what every verb of every language will accept.

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

Sentences are checked the same way, one layer up: every phrase has to decompose into what the generator is allowed to build (an article, a noun, at most one modifier, on the side the language puts it), every verb has to belong to a group that accepts the subject's class, and Korean's `가` / `이` has to match the coda of the word in front of it. `randSentence({ output: 'detail' })` is what makes all three checkable.

Two coincidences are load-bearing and must not be asserted away: a word can be both a modifier and a noun (`무지개`, `Marble`, `自由`), and an invented word can spell a real one by accident (`나` + `비` -> `나비`, so `theme` comes back as `'animal'` at `realism: 'invented'`). Structural assertions survive both; "the first word is not a modifier" does not.

## Behavior worth knowing before changing it

- **Structure beats length.** A length range too narrow for the requested parts is answered with the closest name the generator can build; it never drops a surname or middle name the caller asked for. For space-separated languages the range is satisfied by re-drawing up to `FIT_ATTEMPTS` times, and when all of those miss, `drawParts` is called once more with the range itself: each part is then drawn from the lengths that still leave the parts behind it able to reach it, so `de` at an exact ten characters writes `Maximilian` rather than approaching it. That draw invents nothing — a syllable template cannot be asked to come out a given length — so at `realism: 'invented'` a range only a real name can meet falls back to one. CJK hits the range exactly.
- **`maxLength` is never overshot to reach `minLength`.** Padding with an extra given name stops the moment the pool holds nothing short enough to add, and `missBy` scores an overshoot half a character worse than an undershoot of the same size, so a tie goes to the shorter name. `maxLength` is the bound a caller is holding to — a field limit, a column width — where `minLength` only shapes how a name reads. This is what the padding used to get wrong: with nothing short enough it padded from the whole pool anyway, and `de` at an exact ten characters came back `Cornelia Claudia`.
- **The default range is what the pools hold, not a rounded version of it.** `lengthSpec` used to be a typical span — `en` declared given names of four to eight characters over a pool running from three to ten, `vi` a surname span the pool overshoots at one end and undershoots at the other — so the twelve draws spent themselves re-rolling real names the range called too long, and a Korean given name was pinned to two syllables where `givenLenWeights` asks for one syllable 4% of the time. Widening it to the measured spans also stopped `realism: 'invented'` from leaking real names: the aimed draw invents nothing, and the old default range was tight enough that an English synthesized name missed it once in thirty.
- **The joiner belongs to `nameLengthRange`, not to `lengthSpec`.** A part's span is the part, and the function adds a joiner for each part it switches on. Folding the space into `last` is what made the old numbers unreadable and the drift invisible.
- **`unique` defaults to `false`** so that `count` is always exact. Turning it on trades that for deduplication and can return fewer names.
- **`realism` is consulted per part**, not per batch, so `'mixed'` pairs real and invented parts within one name. It is three levels rather than the 0-100 number it was: the decision is a coin flip per part, and nothing between "always" and "half the time" was worth naming.
- **Length bounds are resolved per language** inside `generateOne`, not once per call. Keep it that way, or mixed-language output regresses.
- **`givenLenWeights` stretching:** asking a CJK language for a range longer than its real names produces long invented given names on purpose. That is a deliberate ask, not a bug. The stretch is off for a curated draw, where the pool — not the range — decides what lengths exist.
- **`realism: 'real'` does not invent to hit a length.** `curatedGiven` takes the whole range and picks the length from the lengths the pool holds, so a weight table that lists a length the pool has none of (Korean lists three-syllable given names and has none) no longer drops one name in twenty-five through to `composeGiven`. A range that only a length the pool lacks can satisfy still invents — there is nothing real to draw.
- **Surnames are weighted where the distribution is steep.** `lastWeights` is a `native:weight` table in tenths of a percent of the population, and only `ko`, `zh` and `vi` have one: 김 covers a fifth of Korea and Nguyễn two fifths of Vietnam, so an even draw over the pool is the loudest way the output stops reading like the language. English, German, Italian, Spanish, Russian and Japanese surnames have a long enough tail that the even draw is already within the right order of magnitude — do not add a table there for symmetry. Surnames the table leaves out keep `LAST_WEIGHT_DEFAULT`, so only the head needs listing; `test/name.test.ts` asserts every weighted surname is still in the pool.

Nicknames:

- **The shapes belong to the language, not to the generator.** `data.frames` is where a language writes out the shapes it allows, in its own word order, with the particle each gap needs. That is what lets Chinese put 的 between a verb and its noun (`奔跑的狮子`) where Korean needs nothing, and what makes a possessive shape a thing `ko`, `ja` and `zh` have and `en` does not — `of` is a word rather than something that attaches to the word in front of it, so a `wordSeparator` would land on the wrong side of it. **A new shape is a frame in the languages that can carry it, never a branch in the generator.**
- **Length picks the shape, not the words.** The frames are filtered to the ones that can land inside the range, then each slot is given the room left after the slots behind it have reserved their minimum. That is why a narrow range drops the modifier instead of truncating a word.
- **`slots` filters the frames, and it filters first.** It names what a shape may put beside the noun, and a frame qualifies when it uses **at least one** of them — an OR, not an AND, because the point of naming two is `['adjective', 'action']`: a modifier with the kind left to chance. AND would ask for a frame carrying both, which no language has. `'none'` reads the other way round and matches the bare noun; an empty array is the same ask. **A request no frame of the language matches leaves every frame in play**, the same best-effort a too-narrow length range gets, and `languagesFor` narrows `language: 'all'` to the languages that can answer before a draw is even made. The filtering happens once per call rather than per attempt: neither the theme nor the range changes it.
- **`NicknameDetail.slots` is a copy of `frame.slots`.** The frames are the language's own data, so handing one out is handing a caller a way to change every nickname after theirs. JavaScript copies, Dart wraps it unmodifiable and Python makes it a tuple; the JS suite asserts it, and the other two lean on their language.
- **The default range is wide on purpose** (`nicknameLengthRange('ko')` is `[1, 13]`): it spans every shape, and the frame weights — not the range — decide what output usually looks like.
- **`wordSeparator` replaces the language's joiner, everywhere.** It is not cosmetic: its length is part of the nickname's, so `frameRange`, `buildWords`, `lengthBounds` and `naturalRange` all read it through `joinerOf` rather than touching `data.joiner`. Reading `data.joiner` directly again is how a separated nickname starts overshooting `maxLength`. It also turns off the boundary-repeat re-draw — `石-霜` does not stutter the way `石霜` does. A frame's own particle is counted beside the separator, in `gapOf`, and is never replaced by it: `사자의 눈물`, never `사자 의 눈물`.
- **Neither a unique suffix nor a modifier is a nickname option.** `randSuffix` attaches a token to any string and `randModifier` attaches a word to one, so `minLength` / `maxLength` describe the whole nickname and nothing has to be excluded from them. What is left on the generator is the part that is genuinely about composing: the shapes, the length fitting, and the boundary re-draw.
- **What `randNickname` adds over the decorators is the frames.** `randModifier(randAnimal())` produces `멋진사자` too, and for a while that was most of what the generator did. The frames are the answer to it: a shape with a particle in it, a word order that is the language's rather than the caller's, and a length range the whole thing has to land inside are things a decorator on one string cannot reach.
- **`randModifier`'s `kind` and `randNickname`'s `slots` are the same distinction at two scales.** `kind` chooses between the two decorating pools, and `slots` chooses between whole shapes. Neither is a flavour setting: an adjective and an action sit in different grammar, which is why Chinese writes `快乐狮子` and `奔跑的狮子`. `ModifierKind` is the two `WordSlot` values that can modify, derived from it in TypeScript and written out in the other two, so the vocabularies cannot drift.
- **`realism` also decides which themes `theme: 'all'` spans.** `LOOSE_THEMES` — `color`, `finance`, `tech` — are word themes like any other, and `randWord` draws from them at any level; what they are not is vocabulary you can put a modifier in front of and still have a handle (`멋진대출`, `BraveInvoice`). `randNickname` leaves them out at `'real'` and puts them back at `'mixed'` and `'invented'`. **A theme the caller named is always honoured**, whatever the realism — the gate is about what `'all'` means, never about overriding the option.
- **`theme` is reported, not asserted.** A word drawn from a theme reports it; an invented word is looked up across all themes, because it can spell a real one by accident, and reports `null` when it is found nowhere.
- **`NicknameDetail.words` is the words and nothing else.** A frame's particle lives in `nickname` alone, so `사자의눈물` reports `['사자', '눈물']` and joining them back does not reproduce it. The three suites assert the weaker property instead: the words appear in order with nothing between them but the separator and a particle the language declares.
- **Two rough spots trigger a re-draw** rather than being shipped: a `startsWith` that no real word in the rolled theme matched (another theme probably has one), and a word ending on the character the next one starts with (`石霜` + `霜雨`). The second is skipped across a gap that has a particle in it, which already keeps the two apart. Both fall back to the closest attempt if every attempt is rough.
- **Invented-word templates stay short.** Two or three syllables per word, because up to three words are joined; `en` is capped at two.

Sentences:

- **The shapes belong to the language, again.** `SentenceLanguageData.frames` writes them out in the language's own order, and each part carries what the language writes around it — a `head` in front (English `in`, Chinese `在`), a `tail` behind (Korean `가`, Japanese `が`). **A language declares only what it can write correctly**: German has no `object` frame and Russian no `place`, because both would put the noun in a case its own ending or its article has to change for. A request neither can answer falls back, and `languagesFor` prefers the ones that can.
- **A verb states what it can take, and that is the whole of the coherence.** `VerbGroup` names the noun classes that can be its subject and its object, the nouns are drawn from those alone, and `THEME_CLASS` maps the twenty-five themes onto ten classes so no noun needs a tag of its own. Adding a verb group means asking what can do it, not what it means. A class with no intransitive group and no state group is a class no sentence can be built around — `test/sentence.test.ts` asserts every class has both.
- **A class too wide is narrowed to themes, on either side of the verb.** `objectThemes` is why a lion eats food and drinks a drink, and `subjectThemes` — on verb groups and state groups alike — is why `익는다` is a thing food does, `울린다` a thing a song does and `깊어진다` a thing a season does, where the class alone would let a soup ripen, a spoon ring and a match deepen. `acceptsSubject` and `subjectThemesOf` read it wherever the class was read before. **A narrowing is not a gap**: a theme narrowed out of one group has to be accepted by another of the same field, and by some state group, and the suites assert it — a song lost `흔들린다` and gained `울린다`, `퍼진다` and `잦아든다`. What a theme cannot do is tell a fish from a bird, and that is what a **trait** is for.
- **A noun may carry a trait, and a verb may ask for one.** `SentenceLanguageData.traits` lists, per language, the nouns that are a `flier`, a `swimmer` or a `crawler`, in the plain form the pools write them; a verb group asks for one with `subjectTraits` (`날아오른다` takes a flier, `헤엄친다` a swimmer, `기어간다` a crawler) or rules some out with `subjectWithout` (`달린다` and `걷는다` take no swimmer and no crawler). A noun listed nowhere has no trait and takes any group that asks for none, which is why the lists are short: they name the exceptions. `acceptsNoun` reads it in `verbGroupsFor` — against the pinned subject, and against the topic a later sentence names again, stands a pronoun for or drops, because a fish left unsaid is still a fish — and `subjectPoolFor` narrows the subject's pool when the noun is drawn, so a flier group draws a sparrow rather than re-rolling until one comes up. The traits live in the sentence data rather than as tags on the word pools: they are what the verbs need to know, the word pools are shared with the nickname generator, and the emitter ports them. **A trait is a narrowing, not a gap**: the suites walk every noun of every theme and assert that every field its class has still has a group that takes it. `lifeless` is the one trait that is a gap on purpose: a word of a creature theme that is no creature — `spell`, `amulet`, `마력` — takes no verb and no state, `acceptsNoun` refuses it for every group and `subjectPoolFor` filters it out of state groups too, and the coverage walk skips it. It is how `myth` keeps its spells for the nickname generator and loses them as subjects. `placeless` is the same kind of gap for a place: `nature` and `space` are the `place` class beside `place` itself, and a wave, a comet and a lightyear are in them beside a river and a moon, so `placePoolFor` leaves them out of every `place` and `destination` part and out of the place a story happens in. Only the seven languages with a place shape list them — German and Russian write no place — and the suites assert that a written place carries no placeless noun. `objectTraits` and `objectWithout` on a verb group ask the same of the object, read by `acceptsObjectNoun` where the object is pinned or required and by `objectPoolFor` where it is drawn — the cache and the theme filter in `objectThemesOf` mirror the subject's. English lists `liquid` and `raw` under its food, and splits `cook` and `eat` into three groups each by what they take. Every language declares the lists and splits its `move` group the same way — legs (`subjectWithout`), anything, swim, fly and crawl — and, where it has one, its destination-taking `go` group into the verbs anyone can head with and the ones that run. A list is written in the form `plain` reads out of the pools, which for English is lowercase. The narrowed pools are cached per group and theme in `subjectPoolFor`: every group a sentence considers reads them for every theme it could take, and filtering the pool each time made the Python suite ten times slower.
- **The predicate is chosen before the nouns.** `compose` picks the verb or state group first, then the subject's theme out of the classes it accepts, then the phrases in frame order. That order is what lets the subject's gender be in hand before the modifier that has to agree with it, and it is why a shape the language cannot head is dropped in `generateOne` rather than papered over.
- **A sentence that drops its subject carries something beside its predicate.** `놀아요.`, `울어.` and `냄새맡는다.` were a third of a Korean paragraph, and a paragraph of one-word lines is a list. `generateOne` takes a shape of three parts or more for a whole sentence whose subject is dropped — the object the sentence before named and this one leaves out counts as a part gone too — and falls back when the language has none. A quoted line and the second clause of a joined sentence are exempt: `“배고파요.”` is what people say. A state sentence had nowhere to grow, so every language declares a `degree` shape (`SentenceSlot.degree`, drawn from `SentenceLanguageData.degrees`: `무척`, `very`, `とても`) and a time-and-state shape; the copula a state part carries moves in front of the degree in `compose` (`is very tired`, `está muy cansado`), so the frames stay written the way the plain state is.
- **A story says when about one sentence in four, and never twice running.** `timeSpent` is what `Draw.dated` reads for a whole sentence: no time part straight after a sentence that named one, and none once the result has named `ceil(count / TIME_SHARE)`. `아침에 … 한낮에 … 저녁에 … 밤에` in six sentences is a timetable.
- **`express` shows what is true of the hero.** `VerbGroup.condition` marks a group as what somebody `content`, `restless`, `tired` or `hungry` does — laughs, sighs, yawns, drools — and `verbGroupsFor` draws only the groups true of the hero just then (`BeatDraw.state`), preferring them over the unconditioned group when any matches; somebody else in a story, whose state nobody knows, gets the unconditioned group and `content`. A meal gives `content` beside `full` for this reason. Outside a story every group is drawn alike.
- **`realism` reaches the words and never the grammar.** An invented sentence keeps its particles, its articles, its agreement and its shape. That is what makes `수줍은 노오가 안개 파저멜을 챙긴다.` still Korean.
- **`vocabulary` reaches the nouns and nothing else.** `WordLanguageData.levels` lists, per language, the `basic` nouns and the `rare` ones — the two ends, with every noun in neither being common — and `levelledNouns` in `wordGenerator.ts` is the one place a pool is narrowed by it: `randWord` draws through it, `randNickname` draws its noun through it, and `nounsOf` in the sentence generator reads it before the singular filter, so the subject, the object, the place and the thing a story is about are all as common as was asked. The caches keyed by group and theme (`subjectPoolFor`, `objectPoolFor`, `placePoolFor`, `nounSpan`) carry the level in their key; `slotBounds` stays measured against the whole pools, because a range is a promise about the language. A level leaving a theme empty falls back to the whole theme, which no theme comes to — `test/word.test.ts` asserts eight basic words per theme per language, that every listed word is in a pool, and that no word is in both lists. The lists were judged once per language by the language's own use (`탈륨` is rare because nobody says it), and they are hand-written in all three packages, which is what `tools/parity` is for. The default is `'full'` for `randWord` and `randNickname`, which are asked for a word, and `'common'` for `randSentence`, which is read: a paragraph about a glassblower and thallium is what `'full'` wrote.
- **Korean particle alternation is a script question, not a language branch.** `endsWithConsonant` in `_internal/script.ts` answers it from the code point, and the data declares both allomorphs as `tail` / `tailAlt`. Any language whose particles alternate on a coda can use it without a line in the generator.
- **A noun with no singular is left out of a sentence entirely.** `nounsOf` filters `p` and `fp` out for a language that inflects: they would need a plural verb beside them, and a second verb pool is a lot of data for a dozen words.
- **`include` places a word by what it can be, not by what it is.** A `Requirement` carries a list of slots, best first, and the shape takes the first still free — which is how `['brave', 'lion', 'quietly']` puts `brave` in the modifier slot rather than the predicate. More required words than the longest shape has phrases means the extras are dropped; that is documented, not fixed.
- **`SentenceDetail.phrases` holds the phrases and nothing else.** The particle or preposition lives in `sentence` alone, so joining them back does not reproduce it. All three suites assert the weaker property instead: the phrases appear in order.
- **`RAND_SENTENCE_LENGTH_MAX` is its own ceiling, and it is per sentence.** Every other generator produces at most three words, so 40 is right for them and would cut most sentences in half. `lengthBounds` takes the ceiling as an argument rather than the sentence generator clamping afterwards. Per sentence rather than per result, because `sentences` asks for up to `RAND_SENTENCE_COUNT_MAX` of them in one string — capping a paragraph of ten at what one sentence may be would answer the ask with ten sentences of twenty characters.
- **A result of several sentences is a paragraph, not several draws.** The first sentence's subject, its class and its gender are the topic; every sentence after it names that noun again, stands a pronoun where it was, or draws a fresh noun of the same class, and may open on a connective. `pronouns` carries `''` as a real entry, meaning the language writes no subject at all, and `pronounless` names the classes a language's written pronoun is wrong for — English `he` and `she` need a gender a job noun does not carry, and `그것`, `それ`, `它` and `nó` are inanimate. A **name** is the exception, and the only subject that does carry a gender: `properName` reports it in every language rather than only where words agree, and `pronounsFor` lets a gendered pool out of `pronounless`. English is the language that needed it — it cannot drop a subject, so a named paragraph named its person in every line.
- **What a sentence opens on is one decision.** An interjection and a connective are the same thing in two moods and a sentence never wants both, so `openerFor` decides it once — and reserves room for it against the budget, because what stands in front is written before a whole sentence rather than instead of any part of it. Russian `тем временем` is thirteen characters, and a third of a range of seventy-five has nowhere to put them. It reads `Flow` for the rest: never a word the result has already opened on, and `OPENER_DAMP` when the sentence before it opened on one too, because two in a row read as a list of asides.
- **A connective is a claim, and `ConnectiveKind` is what it claims.** `additive`, `temporal` and `contrastive` can open any continuation — time passes whatever was said, one more thing is one more thing, and any two things can be set against each other — so `connectivesOf` only ever withholds `causal`, which says this sentence follows from the last and needs the two to be about the same thing and this one to be telling. The kinds are a per-language map like `pronouns` is, and a language declares only what it can write: German has no `temporal`, because `dann` and `danach` are adverbs and an adverb in the first position moves the finite verb. **Adding a connective means deciding what it claims**, not appending it to a list.
- **The kinds are weighted, and a paragraph is what the weights are for.** `TYPE_WEIGHT` and `MARK_WEIGHT` are what `kindFor` draws through, because prose is mostly statements and an even draw over six kinds writes a paragraph of ten questions once every few calls. `QUOTED_BOOST` is what makes a scene of speech mostly speech, and `REPEAT_DAMP` is what ends a run of anything but a plain statement — raised to `Flow.run`, so each repeat is worth less than the last. The same damp is what stops `repeat` following `repeat` in `followFor`, and `NAMED_DAMP` is on top of it, because a person's name is the most conspicuous word a sentence can carry.
- **A paragraph does not say the same thing twice over.** `Flow` is the whole of it, threaded through one result: the register, the last kind and how many of it in a row, the last mark, what the sentences opened on, and whether the last of them named the topic. Beside it `Draw.avoid` carries the predicates and adverbials already spent, in their **plain** form — `끓습니까` and `끓어` are one verb, so remembering what was written would remember nothing — and `predicateFor` prefers what is left of the pool. A preference and not a filter: the length range is applied first, and a pool with nothing unused inside it is drawn from as it always was.
- **A fresh subject usually keeps the topic's theme, not just its class.** `THEME_CHANCE` in `subjectThemesFor`. The class is the bound a paragraph may not leave, because that is what the verb accepts; the theme is what makes it read as one paragraph rather than as a walk through every edible the language holds.
- **A question is a shape, not a mark bolted on.** `SentenceFrame.mood` says what a shape is for, and only the four languages whose grammar actually moves declare one: English's do-support and base form, German's finite verb in the first position, Korean's ending, and the tag Japanese, Chinese and Vietnamese write after the whole clause (`SentenceFrame.tag`). Spanish, Italian and Russian declare no question shape and get their statement shapes back — for them the question **is** the statement. An exclamation is never its own *shape*: a statement's shape plus the mark and an interjection is what an exclamation is in all nine. It can still be its own *form* — Korean closes one on `-구나`, `-네` or `-군` rather than on the statement's `-ㄴ다` — which is `PredicateForm.exclamation` and lives in the pools, not in the frames.
- **A predicate takes a different form, not a different pool.** `VerbGroup.forms` and `StateGroup.forms` are index-aligned with `words`, which is what earns them twice over: a length budget sees what will actually be written, and a word the caller required in the plain form can be translated by its position (`include: '달린다'` with `type: 'question'` is `달리니?`). `FORM_CHAIN` says which form each level writes for each mood, and every chain ends at `words`, so Japanese declares `polite` alone — `走ります` is its formal form and its polite question too, because the `か` that asks is the frame's tag.
- **A form pool entry may list its endings, and index alignment is why.** `달리니|달리나|달리는가` is one entry for one verb, and `oneOf` draws one of them; `endings` is what a length budget spans. The alternative had to go *inside* the entry because the alignment is load-bearing — a second entry for a second ending would put the pool out of step with `words` and break the translation above. Before this, every Korean question in the library closed on `-니`.
- **`SentenceMark` is the kinds a language writes a mark of its own for.** Dialogue and thought are not among them: what they quote is a sentence of another kind, drawn per line, and they add the language's own quotation marks around it. `quotes` is per language and not close to universal — `「」` in Japanese, `„…“` in German, guillemets first in Spanish, Italian and Russian.
- **`style` is the speech level, and Korean is the language with four.** `plain` (해라체), `casual` (해체), `polite` (해요체) and `formal` (합쇼체). 해체 and 해요체 declare one pool each and no mood of their own, because they have none — `달려` asks and tells alike, and only the mark differs. 해라체 and 합쇼체 do move, and `exclamation` and `formalQuestion` are what they move to. Japanese has two levels and maps onto the four; Spanish, Italian, German and Russian have a T–V distinction, but it lives in the second person and every sentence here is third, and English has no such form. Those seven declare no level, and the suites assert that the languages which declare one are exactly the languages whose sentences change.
- **A level is drawn per result, and a quoted line steps outside it.** A line somebody says is never 해라체 — that is the voice of a book, not of a person with a listener — and a thought is addressed to nobody, so it is never polite. `styleFor` is where that is decided, and a `style` the caller named wins everywhere, quoted line included.
- **A counted phrase needs a classifier, not a plural rule.** `numeral.counters` is per noun class, and only the four languages with such a table declare a counted shape. English, Spanish and Italian would need a plural, and a plural rule over these pools produces `12 sadnesses`, `12 bacons` and `12 goggleses` — most of these nouns cannot be counted at all and nothing in any pool says which can. A classifier is what makes an abstraction countable (`슬픔 12가지` is twelve kinds of sadness), so the shape is exactly the languages that have one. German and Russian declare no `numeral`: an amount stands where an object does, and both would need a case their nouns change their own ending for.
- **A quantity is sometimes the subject.** `사과 12개가 익는다` has no separate subject, so `subjectSlotOf`, `takesObject` and `requiredAt` read the shape rather than looking for a `subject` part. Without that, the counted subject is drawn from the verb's *object* classes and Korean produces `카푸치노 4개가 먹는다`. `numeral.amounts` is a pool rather than a range, because a range hands back `73,412 dollars`; `numeral.group` is per language, because Vietnamese, Spanish and Italian group on a full stop, and `numeral.gap` is too, because Korean writes a space everywhere else and still attaches `6개` and `300,000원`.
- **An amount of money stands beside the verbs that handle one.** `MONEY_FIELDS` — `find`, `take`, `carry`, `hide`, `lose` — are the fields a `money` part is drawn with, in all three generators. It used to be every verb whose object may be an idea, on the reasoning that an amount is an idea, and `remembers 5,000 dollars` is what that reasoning wrote.
- **A place takes the preposition it takes.** A frame's `place` part carries one head (`in`), and `SentenceLanguageData.placeHeads` lists, by preposition, the places where that head is wrong: English `on` a bridge, `at` a station, `under` a sky. `placeHeadFor` reads it in `compose` after the noun is drawn and swaps the head, paying the length difference into `used` because the budget was measured against the frame's. Only English declares it; a place listed nowhere keeps the frame's head, and the suites assert every listed place is in a place pool and that a written place carries the head its noun takes.
- **A person's name is the one place a name reaches a sentence.** `includeName` narrows the subject to the themes that name people, and a `theme` the caller named still wins. It costs 22 KB gzipped on any bundle that reaches `randSentence` at all, measured the way the 0.4 KB / 33 KB figures above were — a synchronous API has no dynamic import to hide behind. It does not weaken the rule that a nickname is never built from a person name.
- **A name is drawn unsteered, and two shapes have no room for one.** `randName` reads a length range as a licence to change the name's structure: a CJK given name stretched to fill it (`心敏若花清嫣华娜华梅瑶`), an alphabetic language writing a second given name where one will not reach (`Annette Tanja`). A sentence is asking for a name, not for a length, so it passes no range and `nameSpan` is what the budget measures against. `carriesPerson` is the other half: a counted shape makes its quantity the subject and `서호 3명` counts somebody's name, and a copular shape equates its subject to a day.
- **What is not asked for is drawn, and it is drawn per result.** `type` is every one of the six, weighted; `style` a level; `includeName` a coin flip. Per result rather than per sentence, because a paragraph either has a person in it or does not, and it does not change voice halfway. `realism`, `count`, `sentences` and the lengths keep their defaults — `'real'` is what the other three generators default to, and a paragraph of ten is an ask.
- **A drawn kind is chosen against the room the sentence has, at both ends.** A question is a different shape and a quoted line pays for its marks out of the same budget, so a shape whose shortest is past the top of the budget overshoots whatever it draws and one whose longest is under the bottom falls short however long the words are. `kindFor` filters on both; `nameFits` and `roomFor` do the same for a name, which is much shorter than a noun phrase and cannot reach a range only the longer one can.
- **A paragraph keeps its scene, its person and its register.** The topic carried the subject and nothing else, so a place named in the first sentence changed in the second. `Built.scene` carries a place and an object forward as `Requirement`s, and `planFor` puts each in its own slot — the same machinery the repeated subject already used, so the plan, the exact-length budget and the article all came for free. It carries the bare noun rather than the phrase, so a later sentence writes its own article — and no new modifier, because the noun is `settled`: `in the icy hamlet` becomes `in the hamlet`, never `in the quiet hamlet`. A named topic is only ever named again or stood a pronoun for, because a person is an individual and not a kind of thing. And a result keeps to the register it opened in. Narrated is the closed half — prose about a line never becomes one — while a quoted register admits `NARRATION`, the statement and the trailing statement that go between two lines. A line answered only by another line is one person talking to themselves, and narration that asks is a third voice in a scene that has two.
- **A noun is described once, and an object named once is referred to.** `Requirement.settled` marks a noun the result has already described, and a settled noun takes no modifier however it is written again — `반듯한 소쿠리 … 소중한 소쿠리 … 예쁜 소쿠리` was three baskets. `SentenceLanguageData.objectPronouns` is how a language refers to the object the sentence before named: `''` leaves it out (`ko`, `ja`, `zh`, `vi`), a word stands where the object stood (`en` `it`, `ru` `его` / `её`), and `clitic` puts it in front of the verb (`es`, `it` `lo` / `la`); German declares none and names the noun again. `objectReferenceFor` decides it — always for the second clause of a joined sentence, by the topic's own weights for a whole sentence — and `compose` reads it as `Draw.object`: the part is dropped, the word stands in the object slot, or the clitic is written onto the verb's head, which the detail does not report, the way a particle is not. `Built.object` is what the next sentence checks against. The suites assert a Korean paragraph describes each noun at most once and that no sentence names one object twice.
- **A date is word order as much as it is digits.** `SentenceCalendar` writes the template out — `2026년 9월 5일` largest to smallest, `ngày 5 tháng 9 năm 2026` the other way with a word in front of every part, `5. September 2026` naming its month — and the five that name their months list them. A month goes in last when the template is filled, because a month's name has letters in it that the other two stand for: `März` would lose its `M` to the month number.
- **The copula is a predicate, not a word, and it is written onto its phrase.** It changes for the level and the mood the way a verb does, so it is a `StateGroup` with one entry and its forms, and it states its subject classes the way a verb group does — which is what keeps `버기는 11시 40분이다` out. `11시 40분이다` is one word in Korean and `is at 11:40` is two in English, so `SentencePart.copula` says which side it goes on rather than giving it a slot that would have to be written with no space in front. **A shape with neither a verb nor a state is a copular one** — no flag needed, because every other shape has one or the other. Russian declares no calendar: it equates with a dash, and a dash does not change for a question.
- **해체 and 해요체 ask with `-지` and `-죠`, and never tell with them.** Both endings invite the listener to agree, and a paragraph closing on one in every line read as somebody looking for a nod. So the `casual` and `polite` pools hold the plain ending alone (`달려`, `달려요`), and `casualQuestion` / `politeQuestion` hold both, the way `formalQuestion` sits beside `formal`; `FORM_CHAIN` reaches for the question pool first and falls back to the plain one. Korean's `PAST` endings map carries the same split.
- **A sentence says when once.** A sentence that opens on a temporal connective (`잠시후`, `later`) carries no `time` part — `generateOne` drops those frames the way it already did once the day was spent — and the second clause of a joined sentence inherits that from its first through `Draw.dated`. `SentenceTimes.day` holds one entry per phase: `한낮에` and `정오에` were two, so the day did not move between them.
- **A story never speaks of a habit.** `SentenceTimes.habitual` holds `every day`, `sometimes`, `요즘`; `timeFor` draws from it for a lone sentence and never for a beat of a story, which tells of the one time something happened.
- **A story names its place every other line, at most.** `placed` in `tellStory` remembers whether the clause just written named the place — as a `place` part, a destination, or a scene's subject — and the next beat neither pins nor prefers it. Before this, `운동장` stood in four sentences of five.
- **A beat's pinned nouns reach the first sentence about the hero.** `Follow.scene` carries them once there is a topic, and `BeatDraw.pinned` is how the sentence after an opening scene gets them — `evening` opens on the place changing, so its `arrive … home` step had no follow and drew a fresh destination with a modifier on it.
- **A verb pool is written under three constraints the suites only partly see.** German moves the whole verb token to the front of a question, so a separable prefix is wrong there (`Bricht auf der Fuchs?`): a German verb is one word or a reflexive (`erhebt sich`), never `bricht auf` or `wird still`. Russian agrees its past with the subject's gender by rewriting `л` / `лся` at the end of the token, so every Russian past is an imperfective form ending on them — `уходил`, never `ушёл`, `рос` or `затих`, and never a token closing on a noun. And the Japanese suite tells a plain sentence from a polite one by its ending, so no Japanese verb may end on `ます` (`目を覚ます` reads as `目を覚ました`, a polite past). English and Vietnamese carry their destination head in the frame (`to`, `đến`), so a verb that carries its own (`makes for`) doubles it.
- **The adverbials are where the repetition is, not the shapes.** Seven of the nine spread their output over fourteen to twenty frames with no shape above 16%, and a paragraph still read as repetitive on nine manners and eighteen times. Those pools are roughly double now. German's connectives are the one that stays small: only a coordinating one can open a German clause without moving the finite verb, which is why it declares two of them additive, two contrastive, one causal and none temporal.
- **A manner goes with the doing, not only with the doer.** `ModifierGroup.fields` names the verb fields a group of manners fits — how somebody moves (`성큼성큼`, `on tiptoe`), handles a thing (`꼼꼼히`, `neatly`), looks or thinks (`골똘히`, `intently`), hesitates, is with somebody else (`공손히`, `politely`), feels while they do it (`슬프게`, `sadly`) — and `mannersFor` reads it beside the class, falling back to the class alone and then to everything. Korean and English are sorted into them; a group that names no field fits any doing, which is what the other seven languages' groups still do, and what `정중히 깨어나요` was. Korean's causal connectives are `그래서`, `결국`, `그러니`, `그러기에`, `그런탓에`, `그바람에` and `그덕에`: `그러므로`, `따라서` and `그리하여` are a proof's, and `그러니까` somebody insisting.
- **A paragraph is a story, and the story is data.** `STORIES` in `sentence/data/index.ts` writes each one out as steps: what the hero does (a `VerbField`), or what is true of them (a `Condition`), what has to hold before it (`needs`), and whether the story can do without it. A step may also be somebody else's — `kind: 'other'`, with `actor` naming the story's item (the person met) or the classes a fresh noun is drawn from, narrowed to `actorThemes` — and what they do changes nothing of the hero's state. That is how a stallholder turns up in `errand`, the person met answers in `visit` and `chat`, a sparrow crosses `watch`, the weather turns in `shelter` and a whole `sketch` is a place and what moves in it. A fresh actor is never written by a name (`BeatDraw.nameless`), and after any sentence that was not the hero's the hero is named again rather than dropped (`heroLast`), because `바람이 분다. 조용해진다.` leaves the reader asking who. A story may narrow its hero to themes (`heroThemes`: a sketch is of a forest, not of Pluto) and raise the number of lines it allows (`lines`). `FIELD_RULES` says what each field needs, gives and takes — `eat` needs `holding`, `go` gives `away` and takes `home` — and `story.ts` walks the steps against those conditions to produce a `Plan` of beats, one per sentence, with the optional steps and the `INTERLUDES` filling what the required ones leave. A story that cannot reach `sentences` returns no plan, and the generator falls back to the topic paragraph it wrote before there were stories. **A new story is data, never a branch in the generator**, and a new field is a rule in `FIELD_RULES` plus a `field` on the verb groups that belong to it.
- **A story ends where it ends.** The closing step of a story is a choice of fields — `express`, `think`, `rest`, a `scene` — rather than `rest` / `sleep` every time, because seven of eight stories closing on the hero lying down was every paragraph ending the same way. Nineteen stories, and they differ in where they open (a state, a rise, a scene, a departure), where they happen (at home, out, both), whether anything happens to the hero at all (`watch`, `sketch`) and how they close. A step is padded in a second time only if it can happen twice (`REPEATABLE_FIELDS`, and never a step with a destination): a hero who looks or waits again is still in the story, and one who comes home again never left. `INTERLUDES` carries two that need `away`: the hero moving about where they are, and the place changing — a home story has no place for a scene to be about. A new story is data in all three `index` files, a name in `SentenceStory` in all three packages, a row in the docs table, and — when it carries no object — an entry in the suites' list of what German and Russian can tell.
- **A story may have a second thing, and may move on.** `StoryStep.object` is `'item'` or `'prop'`, and `Story.prop` / `propThemes` say what the prop may be; `propThemesFor` narrows that to the themes some verb of every prop step takes, and `plan` draws the prop's theme once per telling and hands it back as `Plan.prop`. A prop step is never required — `fieldsFor` returns nothing for one when the language has no prop to write, which is what keeps German and Russian from drawing anything at all into the slot — and `Roles.prop` is pinned into prop steps the way `Roles.item` is into item steps. `destination: 'elsewhere'` draws a fresh place and replaces `Roles.place` with it, so every later `place` part and scene is the new one. `BeatDraw.avoid` carries the other role's noun into the object draw, because the prop and the item share themes and `작은 스웨터` looked at and `가벼운 스웨터` found is one sweater described twice. The suites assert the object phrases of a result read as at most two nouns, that a prop step and an `elsewhere` step are never required, and that Korean can write every prop.
- **A person in a story sometimes speaks, and whether anybody does is drawn per result.** `voicesFor` in `story.ts` draws a `VoiceMode` once per telling — `none`, `some` or `scene` (`VOICE_MODE_WEIGHT`) — and marks `Beat.voice` on a person's sentences after the first, never two in a row from one mouth, never past `story.lines ?? VOICE_MAX` (`SCENE_EXTRA` more in a scene). Five voices. A **line** is the hero in the first person, saying what is true of them (a state) or what they just did (`LINE_FIELDS`, which is nearly every act field, reported in the past whatever the story's tense) — only where the language declares `speech`, the first person: `subject` (`''` where the language drops it, `我`, `Tôi`, `I`) and `head` (English `am`, standing in for a state part's `is`). Two beats the plan joined are one line when both are reportable (`pair` in `voicesFor`), and the quotation marks open on the first clause and close on the second. A line names no time of day but keeps its place and its manner, and a line that reports carries something beside its verb (`least` in `generateOne`): `“부엌에서 열쇠를 찾았어!”`, never `“찾았어.”`. A **comment** is the hero saying what they make of the thing or the place — a `look` step, a `talk` step or a scene, told as a state sentence about that noun in the third person — which any language can write. A **notice** is the hero saying what somebody else is doing: the `other` step told in the hero's voice, in the present, exclaimed more often than not (`NOTICE_EXCLAIM`); about the person beside them it is a thought, never said to their face, and never answered. An **ask** is the hero asking the person beside them how they are (`ASKABLE`, a condition the language has a person state for), in the second person the language declares as `listener` — `''` in Korean and Japanese, `你`, `bạn`, `you` with `are`, `du` with `bist`, `''` with `heads` mapping `está` to `estás` in Spanish and `è` to `sei` in Italian, `ты` in Russian — written by `compose` wherever the shape writes the state's copula, in front of the state in a statement and in front of the subject in a question. All nine declare a `listener`; four declare no `speech`, because a question is a state and a copula where a report would have to conjugate every verb. An ask is only marked where it can be answered. A **reply** is somebody answering the line before, from `SentenceLanguageData.replies`, by speech level and by `ReplyCue` — `agree` for a remark or a notice, `cheer` for good news, `care` for `LOW` conditions and for `lose`, `wonder` for more of what was reported, `answer` for an ask — written whole and built from no phrase: it takes the place of the optional step after the line when the rest of the telling still walks without it (`walkFrom`), and only where somebody is there to answer — the hero is out, or the story is about a person. In a scene the hero may speak again straight after being answered, which is what an exchange is. `tell` turns them into `dialogue` or `thought` (`LINE_WEIGHT`, exclaimed at `LINE_EXCLAIM`; an answered line, a report and an ask are always said aloud), with no opener; `compose` reads `Draw.spoken` and `Draw.speech`. A second clause speaks exactly where its first clause did (`speakable`), because the marks are the whole sentence's. Every line of one result is said at one level (`Flow.line`). Coming home is the one line said whole rather than composed: `SentenceLanguageData.homecomings` is `다녀왔어`, `ただいま`, `I'm home` by level, an `arrive`-home step voiced as a line draws from it in every language that declares it — first person or not, since an idiom conjugates nothing — and it is never joined and never answered. A caller who named `type` gets those kinds and no voices at all. The suites assert every quoted sentence of an untyped story is a person's, not first, never two in a row unless the second is an answer or follows one, and that an answer is one of the language's replies and a homecoming one of the language's homecomings — told from a line by those pools rather than by the phrases, because `I thought so` holds the `I` a line after it opens on.
- **A field is a claim about what a verb does to the hero's state, and a new one is three things.** `lose`, `meet` and `talk` are the worked example: a rule in `FIELD_RULES` (losing takes `holding` and gives `restless`, which is what lets `search` follow it causally), a name in `VerbField` in all three packages, and a verb group in every language that can write it — `talk` in all nine, `lose` and `meet` in the seven with an object frame, and `meet` not in Spanish either, because `encuentra el panadero` needs the personal `a` no frame writes. A story a language cannot write a required step of is simply not told there; `heroClassesFor` filters it, and nothing has to be listed. `visit` makes the person met its `item`, because a required step may not be a prop step.
- **The verb is drawn from the field, and the nouns from the story.** A beat's `fields` filter `verbGroupsFor`, so the sentence for a `buy` step says buying. The thing a story is about is a theme chosen at plan time (`itemThemesFor`), narrowed by `VerbGroup.objectThemes` so that a drink is drunk and a pretzel eaten, and once a sentence has put the thing, the place or home on the page they are pinned as `Requirement`s into every beat after. `DESTINATION_THEMES` is `place` alone, and it is where a story happens and where any `destination` part is drawn from, story or not: a hero can walk to the market and not to Pluto, though both are the `place` class. A `place` part on its own still spans the class, because a fox can sleep under a sky. A `scene` step is the one sentence whose subject is not the hero — the place changing — and a named hero has no theme, so `Result.theme` is the hero's theme and not the scene's.
- **A destination is a slot, and only a verb that goes takes one.** `VerbGroup.requires: 'destination'` marks the groups that head somewhere, and a frame with a `destination` part is drawn only for those — `leaves to the market` is what the rest of the field writes there. Korean's `로` / `으로` is `tailLiquid` beside `tail` / `tailAlt`, answered by `endsWithLiquid` in `_internal/script.ts`. `homes` is a pool of the words a hero comes back to, and it is a `bare` requirement: no modifier goes in front of home.
- **Tense is a second set of forms, not a rule.** `VerbGroup.past` and `StateGroup.past` are `PredicateTense` pools index-aligned with `words`, with their own `forms` per mood and level, so `FORM_CHAIN` reads them the same way and `include: '달린다'` with `tense: 'past'` translates by position to `달렸다`. Korean writes them through `conjugate(stems, endings)` in `_internal/parse.ts` — and every other Korean form through `koVerbs` and `koStates` in `data/ko.ts`, which spell the whole paradigm out of a stem and its 해체 form (`달리:달려`, `걷:걸어`), the one form the endings cannot be told from. A Korean verb is two fields, and a state three (the 관형사형 as well, for `-ㄴ가`); the emitter writes the spelt-out pools into the ports. Where the verb does not change, the data says so instead: `pastMark` (Chinese `了` after the verb, Vietnamese `đã` before it), `pastAgreement` (Russian `л` / `ла` / `ло` by the subject's gender), `StateGroup.head` / `pastHead` (Spanish `es` / `era`, `está` / `estaba`) and `SentencePart.pastHead` for a copula written onto a frame. A tense is drawn once per result, and `SentenceTimes` splits the time adverbials into `day` (ordered, so a story can move forward through it — `DAY_STRIDE` is how far one sentence may jump), `any`, `past`, `present` and `habitual`.
- **A modifier is chosen for the noun it describes.** `SentenceLanguageData.modifiers` and `manners` are `ModifierGroup`s by `NounClass`, optionally narrowed to themes, so a drink is `hot` and a mechanic is `patient`. The nickname pools are no longer what a sentence draws its modifiers from; they are only where a word `include` named may still come from. `_modifiers_for` caches by theme rather than class, because a group may narrow itself to themes.
- **Two beats may be one sentence.** `SentenceJoin` is per language — `{ form: 'linking' }` for Korean's `-고` and Japanese's `-て`, `{ word }` for `and`, `y`, `и`, `，然后` — and German declares none. The plan marks a `first` and a `second` beat, the second is drawn with its subject dropped, and `joinClauses` writes the seam. A join is estimated against the shortest the two shapes could be and is given up when it overshoots, so a narrow range writes two sentences and a wide one writes one.
- **A story is told again when it misses the range.** The sentences are drawn one after another against a budget shared out between them and re-shared after each, and a run of short sentences leaves the last one a gap no shape can fill: three Korean sentences at forty to sixty characters fell short once in a hundred and twenty. `STORY_ATTEMPTS` tells the whole story again with a fresh `Flow` and keeps the closest telling.
- **A caller who named `type` gets those kinds; a story otherwise writes statements.** `Settings.typed` is `options.type !== undefined`, `'all'` included, and a story told on its own terms is prose — `STORY_KIND_WEIGHT` lets a step that allows an exclamation or a trailing end get one now and then, and nothing else.

## Adding a sentence language

Every word language has sentence data too, so this is only for a language being added from scratch — do the word language first.

1. Write the **frames** before anything else. A shape is only worth having if the grammar carries it, and the ones the language cannot write correctly are the ones it must not declare. German and Russian are the worked examples: nominative only, because every other case changes the noun or the article.
2. Add `lib/sentence/data/<code>.ts` with a `SentenceLanguageData` object: `space` (a space everywhere but CJK), `capitalize`, `terminators` (one mark per kind) and `openers` if the language marks both ends, `quotes` for both levels of quotation mark, the `articles` if the language has them, `predicateAgrees` if its predicate adjectives inflect, the verb and state groups with whatever `forms` the language actually writes and their `past`, `modifiers` and `manners` as groups by noun class, `times` split into `day`, `any`, `past` and `present`, `homes`, a `join` if the language can write two clauses as one sentence, `connectives` split by what each one claims, `interjections`, `pronouns` and `pronounless`, `replies` by speech level and by `ReplyCue` (an entry closing on `!` or `?` is exclaimed or asked), a `listener` for the second person a question is asked in, `homecomings` for what is said on coming home and `degrees`, a `numeral` block if it can write one, a `calendar` if it can write a date and a copula, and the frames — a `degree` state shape and a time-and-state shape among them.
3. **Verbs go in groups, in the form a plain statement ends on**, and every group names its `field`. Split `express` by what it shows — a `condition` of `content`, `restless`, `tired` or `hungry` — and leave one group without, for a story to fall back on. Aim for the hundreds per language rather than the dozens: a paragraph of three sentences is where a pool of six shows, and every language now holds five hundred to thirteen hundred. Beside the fields, every language declares the narrowed `change` groups the others have — what a time of day, the weather and a match do, what only metal and wood does, what a song does, what a dish does that a drink does not — and the two narrowed `make` groups where it has an object shape. Each group names the classes that can be its subject and — when transitive — its object, and `objectThemes` where the class is too wide (`drink` takes `drink`, not `food`). Every one of the ten classes needs at least one group that accepts it as a subject, and at least one state group that describes it; every field in `FIELD_RULES` that the stories use needs a group, and `test/sentence.test.ts` asserts every story is tellable in every language. A state group that says a condition names it: `hungry`, `full`, `tired`. The past goes in as `past`, index-aligned, or as `pastMark` / `pastAgreement` where the verb itself does not change.
4. **Adverbials are written whole**, particle and all: `새벽에`, `at dawn`, `por la mañana`. They are idiomatic, and splitting them into a noun and a marker would buy nothing. Aim for the twenties in `manners` and `times`: a paragraph of three sentences is where a thin pool shows, and what a sentence opens on shows soonest of all. `times.day` is ordered from dawn to night, because a story moves forward through it. A manner goes in a group by who can do it that way — a place quietens `slowly` and nobody quietens `keenly`. A connective goes in by what it claims — anything that can be read as "therefore" is `causal`, whatever else it also means.
5. **Declare only what the language writes correctly, and leave the rest out.** A question shape only where the grammar moves for one; `forms` only where the predicate changes; `counters` only where a classifier makes a noun countable; no `numeral` at all where a number would need a case; no `calendar` where the copula is not a word that changes. Every omission here is answered by the same fall-back the shapes already use, and every one of them is a language reading better rather than worse.
6. Register it in `SENTENCE_DATA`, add the script regex to `test/sentence.test.ts` — digits, the grouping separator and the quotation marks included — and run `node tools/emit/index.mjs` to write the Dart and Python datasets. Register the language in each port's `index` by hand; the emitter does not touch those.
7. Run `node tools/parity/index.mjs`.

## Adding a name language

1. Add the code to `NameLanguage` in `lib/_types/global.ts`.
2. Add `lib/name/data/<code>.ts` with a `NameLanguageData` object: name order, joiner (`''` for CJK, `' '` otherwise), `hasMiddle`, `roman` mode, `lengthSpec`, and the pools. CJK languages use `givenMale` / `givenFemale` plus `first*` / `rest*` syllables; other scripts use `male` / `female` / `last` plus a `syn` template. Add `lastWeights` only when the language's surnames are steeply distributed — an even draw is already close to reality for the long-tailed ones (see the surname bullet below).
3. Register it in `NAME_DATA` and `NAME_LANGUAGES` in `lib/name/data/index.ts`.
4. If it needs a new romanization mode, add it to `RomanMode` and handle it in `lib/name/romanize.ts`.
5. `lengthSpec` must be **measured, not estimated** — it is the default length range, and a wrong value is silent. Too narrow and the generator re-draws real names away; too wide and it aims at lengths nothing can spell. The `given` span is the given-name pool's, narrowed to the lengths `givenLenWeights` actually asks for where the language has a table; `last` and `middle` are their pools', and Russian's `last` adds the character feminization can put on it. The joiner is **not** in these numbers — `nameLengthRange` adds one per part it switches on. `test/name.test.ts` checks all of it against the pools.
6. Add the language to the README table and to the script regexes in `test/name.test.ts`; the existing per-language tests then cover it.
7. Port all of it to `packages/dart`: the code goes in `NameLanguage`, the dataset in `lib/src/name/data/<code>.dart` and `index.dart`, the regex in `test/name_test.dart`.
8. Port all of it to `packages/python`: the code goes in the `NameLanguage` `Literal` in `src/randino/_types.py`, the dataset in `src/randino/name/data/<code>.py` and `__init__.py`, the script check in `SCRIPT` in `tests/test_name.py`. A language that exists in one package and not another is the failure mode this repository has to avoid, and the three suites are what catch it.
9. Add the row to the tables in `docs/en/guide/languages.md` and `docs/ko/guide/languages.md`, and to the one in the root `README.md`.
10. Run `node tools/parity/index.mjs` from the repository root. The three suites catch a language that exists in one package and not another; only this catches a pool that is one entry short in one of them.

## Adding a word language

Every name language now has word pools too (`ko`, `en`, `ja`, `zh`, `vi`, `es`, `it`, `de`, `ru`), and neither word order nor agreement is a bar any more:

- **Word order lives in the frames.** Vietnamese, Spanish and Italian put the modifier after the noun (`mèo xanh`, `gato azul`) and Vietnamese puts the possessed thing in front of its owner (`đuôi mèo`); both say so in their own `frames`. `modifierFollows` reads that back out of the frames so `randModifier` attaches on the right side, rather than a second field stating an order the frames could contradict.
- **Agreement lives in the data.** A language that inflects tags each noun (`gato:m luna:f`), and `agreement` lists the endings a modifier changes per form. `taggedNouns` splits the tag back off so each word is still typed once, and `agree` applies the first rule that matches — a word no rule matches is already right (`azul`). Rules rather than a function, so `tools/parity` compares them as data. `randModifier` reads the same table: a value it finds in the pools carries a gender, and a value from anywhere else gets the base form back.
- **A noun with no singular is tagged `p`.** `ножницы`, `gafas` and `Jeans` have no singular for a singular modifier to agree with, so `WordGender` carries the language's default plural beside the three genders, and `fp` where the plural inflects for gender as well (`gafas doradas` beside `celos dorados`). Russian and German plurals are the same whatever the gender, so those two only ever use `p`. A form the base form does not already cover **must** have rules — the modifier is written in the singular, and `test/nickname.test.ts` asserts it.
- **A modifier in front of its noun still agrees.** `buildWords` draws the noun ahead of its turn when the language inflects and the frame puts the noun second, so German writes `blauer Wal` and `blaue Katze` correctly. The pre-drawn noun's length is exact rather than a range, which keeps the length fitting as tight as it is everywhere else.
- **German writes its nouns capitalised in the pool** rather than setting `capitalize`, which would capitalise the modifier too. The data is simply correct German.

To add one that clears the bar:

1. Add the code to `WordLanguage` in `lib/_types/global.ts`.
2. Add `lib/word/data/<code>.ts` with a `WordLanguageData` object: `joiner`, `capitalize`, `adjectives` and `actions` in attributive form, `nouns` for every theme in `WORD_THEMES`, `levels` listing the basic and the rare nouns among them (judged by how the language's speakers use the word, eight basic per theme at the least), the `frames` the language's grammar allows, an optional `parts` pool for the frames that ask for one, and a `syn` template (`kind: 'syllable'` for alphabetic scripts, `kind: 'pool'` where one character is one syllable).
3. Register it in `WORD_DATA` and `WORD_LANGUAGES` in `lib/word/data/index.ts`.
4. Write the frames before the pools. A shape is only worth a pool if the grammar carries it: `ja` and `zh` reach `parts` through の and 的 because a bare noun-noun compound does not read, and `en` has no possessive frame because `of` is a word rather than a particle.
5. Aim for 50+ nouns per theme, and more where the vocabulary is there. `ko`, `en`, `ja` and `zh` hold around 2,700 nouns each and the five added since hold around 1,550; the thinnest theme in any language sits in the forties. The pools are what make the output varied, and the combination count is roughly `(adjectives + actions) × nouns × (1 + parts)` — around 40M for the four with a `parts` pool, 0.3M for `es`, `it`, `de` and `ru`, which have none. **Padding a theme with near-synonyms reads worse than a shorter pool**, and inventing a compound to fill it is how `棒麺麭` and `대로변` got in; both were replaced. See the compound rule below — a pool grows by finding words the theme does not have yet, never by qualifying one it already holds.
6. No person names, and no word that is only a name — for `en` this is enforced against the person-name pools, which is why `job` has no `Knight`, `Baker` or `Hunter` and `plant` no `Rose` or `Ivy`. Add the language to the README tables and to `SCRIPT` in `test/word.test.ts` **and** `test/nickname.test.ts`; the existing per-language tests then cover it.
7. A language that inflects tags its nouns and lists its endings: write `nouns` as a `theme -> \`gato:m luna:f\`` map through `taggedNouns`, and give `agreement` the rules per form, `p` (and `fp` where the plural inflects for gender) included if any noun has no singular. Put the noun **first** in the frames where the grammar allows it; where it cannot (`blauer Wal`), `buildWords` draws the noun ahead of its turn instead.
8. Port all of it to `packages/dart` and `packages/python`, the same way a name language is ported.
9. Add the row to the tables in `docs/*/guide/languages.md` and to the root `README.md`.
10. Run `node tools/parity/index.mjs` from the repository root — twenty-five pools in three packages are exactly where one word goes missing unnoticed.

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

This applies to every language, and the failure looks different in each. Korean and Japanese suffix a classifier (`꽃`, `類`, `具`, `体`); Chinese suffixes `系` or `馆`; Vietnamese puts a state in front of a noun (`lá khô`, `nước ấm`); English keeps a British and an American spelling of one word; Russian keeps a diminutive beside its base. `tools/parity` cannot see any of it — the packages agree with each other perfectly while all three hold the same redundant entry. What finds it is comparing a pool **against itself**: within one theme, look for a word that contains another.

## Adding a word theme

A theme is a slice of everyday vocabulary that a modifier can sit in front of. Adding one touches every language at once, because `nouns` is a `Record<WordTheme, WordPool>` — the TypeScript type will not let a language skip it, and the ports assert it instead. **It also adds a public function**, because every theme has one.

1. Add the name to `WordTheme` in `lib/_types/global.ts` and to `WORD_THEMES` in `lib/word/data/index.ts`.
2. Add the pool to **all nine** languages. A theme that only one language can fill is not a theme.
3. **Themes have to be disjoint**, and `test/nickname.test.ts` asserts it. A word in two of them makes the reported `theme` ambiguous, and it makes the detail output report a theme the caller did not ask about. When a new theme claims a word an old one already holds, move it rather than copy it — `place` took the twelve places that were sitting in `concept`, `vehicle` took 자전거 / 기차 / 배 out of `object`, `plant` took the flowers and trees out of `nature`, and `music` took the instruments out of `object` and 리듬 / 선율 / 화음 out of `concept`. Where the two senses are genuinely different words, rename instead of moving: the English toy became `Marbles` so `gem` could keep `Marble`.
4. Watch the word lengths. `wordLengthRange` and `nicknameLengthRange` are both derived from the shortest and longest word in the pools, and `test/word.test.ts` and `test/nickname.test.ts` each pin three of their values, so a Chinese noun outside 2–3 characters or a Korean one outside 1–4 changes a number the tests assert by value.
5. Add the `rand<Theme>` function beside the other twenty-five, export it from `lib/word/index.ts`, and add it to the `THEMED` table in `test/word.test.ts` — that table is asserted to have exactly one entry per theme, so a missing function fails the suite. Update the theme list in `README.md` and the doc comment on `WordTheme`.
6. Do the same in `packages/dart` and `packages/python` — `WordTheme`, the theme list, the pool in all nine language files, and the themed function. Neither Dart's `Map` nor Python's `dict` complains about a missing theme the way the TypeScript `Record` does, which is why both ports assert every language fills every theme.
7. Give it a class in `THEME_CLASS` (`lib/sentence/data/index.ts`), in all three packages. Without one the theme has no verb that will take it, and `test/sentence.test.ts` fails.
8. Decide whether the theme belongs in `LOOSE_THEMES`. A theme a modifier cannot sit in front of without the result reading as a joke goes in, and `randNickname` then only reaches it once `realism` loosens or the caller names it. `color`, `finance` and `tech` are there; everything a nickname can carry stays out.
9. Add the row to `docs/en/word/themes.md` and `docs/ko/word/themes.md`, and to the class table on `docs/*/sentence/index.md`.
10. Run `node tools/parity/index.mjs` from the repository root. A theme adds nine pools to each of three packages, which is twenty-seven chances to drop a word.

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

