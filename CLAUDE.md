# CLAUDE.md

Guidance for AI agents (and humans) working in this repository. Written in English to match the repo's existing docs (`README.md`, `CONTRIBUTING.md`).

## What randino is

**randino** is a zero-dependency library that generates random **person names**, **nicknames**, **everyday words**, **sentences**, **locations**, **ages**, **genders**, **organizations**, **dates**, **phone numbers** and the **names and places of a fictional world**, per language, and the **system values** a sample machine is described by. It ships for more than one programming language — TypeScript, Dart and Python — and every one of them generates from the same datasets under the same rules. Separate concerns, deliberately:

- **Names** should read like names a person actually carries (`김민준`, `Emma Clover`). Sample data for forms, seeds, mockups.
- **Nicknames** are the handles someone would pick for a game or a website (`멋진사자`, `MistyOwl`). They are built from everyday words and **never from person names** — that rule is the whole point of keeping the two apart.
- **Words** are those everyday words on their own (`여우`, `Lantern`), one theme at a time. `randWord` takes the theme as an option, and the thirty-seven `randAnimal` / `randFood` / … functions are the same generator with the theme already chosen.
- **Sentences** are whole statements in the language's own grammar (`여우가 사과를 먹는다.`, `The brave lion runs quietly.`). They draw the same nouns a nickname does, and what they add is everything a sentence needs beside them — a verb in the form a statement ends on, the particles, the articles and the shapes.
- **Locations** are real places, written out from the country down (`대한민국 경기도 수원시 장안구 파장동`, `Pasadena, California, United States`). Nothing about them is invented: every division is one the country publishes, inside the one written beside it, and nothing goes below a Korean 읍·면·동 or a US city — no street, no building, no number. `randLocation` takes the level as an option, and `randCountry` / `randRegion` / `randCity` / `randDistrict` hand back one level's name alone. **Two languages, not nine**, and on purpose — see `packages/javascript/lib/location/CLAUDE.md`. `randCountry` is the exception: it names every ISO 3166-1 country in all nine.
- **Ages** are whole numbers of years for a sample person (`34`), drawn along a curve shaped like a population rather than evenly, so a sample is mostly adults. An age has no language, so `randAge` is the one generator that takes none, and `minAge` / `maxAge` and `group` are its own options in place of the length ones.
- **Genders** are the label a form in the language writes for one (`여성`, `Female`, `Divers`). Male and female split evenly, and the two others — `unknown` and `nonbinary` — come up only when the caller switches them on, and rarely when they do. `nonbinaryIdentity` is the one exception to writing what a form writes: it writes `nonbinary` as the identity a person names themselves by (`Genderfluid`, `에이젠더`).
- **Dates** are instants drawn evenly from a range and written out in UTC (`2024-03-15T14:07:32.481Z`, `2024년 3월 15일`), by a format of the caller's own. `unit` hands back one part of a date as a number instead — `minute` is `0` to `59` — read off a drawn date so it keeps to the range. Its `language` writes only the month and weekday names and the half of the day, and defaults to `'en'` rather than `'all'`: a format is written in one language. `minDate` / `maxDate`, `format`, `unit` and `utcOffset` are its own options.
- **Phone numbers** are written the way their country writes them (`010-4821-####`, `(415) 726-####`, `8 (912) 345-##-##`, the last four digits hidden here the way every page hides them), for the country each word language is spoken in first. Each opens on a block the country's numbering plan really gives out and ends on random digits, so **a drawn number can by chance be somebody's** — the docs and the doc comments say so, and say never to call or text one. `randPhone` takes `country` in place of `language`, and `type`, `includeCountryCode`, `separator` and `fictional` are its own options.
- **System values** describe a sample machine with real products, the one place the library does not invent: an operating system from `randOs` (`Windows 11 Pro 23H2 (Build 22631)`, `macOS Sonoma 14.5`, `Android 14 (API 34)`) a phone, tablet or laptop from `randDevice` (`Apple iPhone 15 Pro`, `Lenovo ThinkPad X1 Carbon Gen 11`), its processor and graphics from `randCpu` and `randGpu` (`Intel Core i7-13700K`, `NVIDIA GeForce RTX 4090`), the architecture it runs from `randArchitecture` (`x86_64`), the memory one is sold with and its kind from `randRam` (`16 GB`, `DDR5`), the kind and size of its storage from `randDiskType` and `randDiskSize` (`SSD`, `1 TB`), the size of its screen from `randResolution` (`1920x1080`), the version numbers of its software from `randVersion` (`2.14.3`, `2024.3.1`), the store its apps come from, from `randAppStore` (`Google Play Store`, `Steam`), the extensions of its files from `randFileExtension` (`.pdf`, `.png`), and the MIME types they are served as from `randMimeType` (`application/pdf`). Apart from a version number, which no catalog could list and which is drawn instead, nothing is made up — every value is a release that came out, written by the name it was released under — so none of them takes a `language`, and they share `platform` (`desktop` or `mobile`) and, where a value has a release year, `minYear` / `maxYear`. The names are the products' own and belong to their owners; the docs say so on every page that lists them.
- **Fictional names and places** are what a story or a game names its characters and its map (`Alice`, `Arsis`, `Kingdom of Edlin`, `Gruger Park`), not what real people in one country are called: `randFictionalName`, and `randFictionalCountry` / `randFictionalRegion` / `randFictionalCity` / `randFictionalDistrict`. A name is spelled in Latin letters first and written by its sound in every other language (`Artemis`, `아르테미스`, `アルテミス`), so every entry of their datasets carries five spellings, one per script. `language` may be a list, which returns each result in every language of it, keyed by code (`{ ko: '아르테미스', en: 'Artemis' }`), for a game that shows one character to every player in the player's own language. They are not `randName` at `realism: 'invented'`, which still reads like one real language, and they carry no name that belongs to one well-known work. See `packages/javascript/lib/fictional/CLAUDE.md`.
- **Organizations** are companies, schools, offices and associations that do not exist (`(주)새솔테크`, `Westbrook High School`, `Гимназия № 135`), each written the way its language writes that kind. Nothing about them is real, and that is the requirement rather than a limitation: the stems are chosen to be nobody's brand, and **no organization is ever built from a person name** — a surname with a legal form behind it is exactly how famous companies are named.

All of them are implemented. Keep the generators apart — a shared "generator" abstraction is not wanted — but the options they all take, and the loop that draws until it has `count` results, live in `_internal/generate` and are shared, along with `collectFrom`, which draws a catalog's results out of the list of them. So are the word pools: `word/data` is the one dataset, and `nickname` consumes it.

Beside them sits **decorate**, which generates nothing on its own: it attaches something to a string you already have. `randSuffix` and `randPrefix` attach a random token (`멋진사자` → `멋진사자_nVtRC`); `randModifier` attaches a word out of the pools (`사자` → `멋진사자`). All three used to be nickname options — `uniqueSuffix*` and `includeModifier` — and all three moved out for the same reason: decorating a string was never a thing about nicknames. **Every decorator works with no value at all**, handing back the token or the word it would have attached, because what it attaches is worth having on its own.

That is the third group, and the three of them are why the split is not generators-and-helpers: a decorator neither generates from nothing nor answers a question. The docs sidebar has **Generators**, **Decorators** and **Utilities** for exactly this reason.

The name generator is a port of the logic behind vutools' [Random Person Name Generator](https://www.vutools.com/tools/text/random-person-name-generator) (`client/src/app/[locale]/tools/text/random-person-name-generator` in the `www-vutools-com` repo), with the same options. Two deliberate differences: the web page's `es-hangul` dependency is replaced by an internal romanizer (`lib/name/romanize.ts`), and length bounds are resolved per language so `language: 'all'` does not stretch a Korean name to fill a Spanish name's range.

The nickname, word, sentence and location generators have no upstream — they are this repo's own. Their options mirror the name generator's where they mean the same thing: those live on `RandCommonOptions` (`count`, `realism`, `minLength` / `maxLength`, `startsWith`, `unique`, `output`), and each generator adds only what is its own. `randWord` adds `language` and `theme`; `randNickname` adds those plus `wordSeparator`; `randSentence` adds `shape`, `slots`, `include`, `sentences`, `type`, `quote`, `style` and `includeName`; `randLocation` adds `language`, `level`, `includeCountry` and `short`, and takes no `realism`, because there is nothing to invent.

**A new generator should add options, not repeat them.** If it counts, filters by a starting character or deduplicates, it calls `collect` in `_internal/generate` and gets all of that for free. One that can list every result it returns calls `collectFrom` instead, with each result's weight.

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
  <category>/CLAUDE.md      # the notes on that generator, for all three packages
  _types/global.ts          # ALL public types live here (options, results)
  constants.ts              # RAND_COUNT_MAX and the length bounds, shared by all
  _internal/
    utils.ts                # shared random/string helpers, never exported
    parse.ts                # words() / tokens() / romanMap() / outline() / rows() dataset helpers
    generate.ts             # the common options, the draw loop (`collect`), and a catalog's (`collectFrom`)
    script.ts               # which language a string is written in, by its script
    capacity.ts             # the sizes memory and storage are sold in, and the units they are whole in
  age/
    index.ts                # the category's public surface
    randAge.ts              # public: number[], or AgeDetail[] on `output: 'detail'`
    ageGenerator.ts         # internal: the candidates per call, the weighted draw
    data/index.ts           # AGE_GROUPS, the band of each group, the curve
  appstore/
    index.ts
    randAppStore.ts         # public: string[], or AppStoreDetail[] on `output: 'detail'`
    appStoreGenerator.ts    # internal: one pool per platform, the weighted draw
    data/index.ts           # APP_STORES: every store, one row each, with its company and weight
  architecture/
    index.ts
    randArchitecture.ts     # public: string[], or ArchitectureDetail[] on `output: 'detail'`
    architectureGenerator.ts # internal: the platform first, the six `includeRare` adds, the name per naming
    data/index.ts           # ARCHITECTURES, ARCHITECTURE_NAMINGS, each one's line, width, weights, names and aliases
  organization/
    index.ts
    randOrganization.ts     # public: string[], or OrganizationDetail[] on `output: 'detail'`
    organizationGenerator.ts # internal: the plan per call, the shapes, the gap filling
    data/
      index.ts              # ORGANIZATION_DATA, the kinds, the industries, the odds
      types.ts              # internal dataset types (templates, synthesis)
      en.ts ko.ts ja.ts …   # one file per language, nine of them
  cpu/
    index.ts
    randCpu.ts              # public: string[], or CpuDetail[] on `output: 'detail'`
    cpuGenerator.ts         # internal: the candidates per call, the maker in front or not
    data/index.ts           # CPUS: every processor, one row each
    data/constants.ts       # CPU_VENDORS, apart from the catalog
  date/
    index.ts
    randDate.ts             # public: string[], number[] on `unit`, or DateDetail[] on `output: 'detail'`
    dateGenerator.ts        # internal: the range, the ISO 8601 reader, the format writer
    data/index.ts           # the default range, the floor and ceiling, the default format, the names
    data/constants.ts       # DATE_UNITS
  fictional/
    index.ts
    randFictionalName.ts    # public: string[], or FictionalNameDetail[] on `output: 'detail'`
    randFictionalCountry.ts …  # public: one per level — country, region, city, district
    spelling.ts             # internal: the five scripts, the joins, the Korean ㄹ rule
    pools.ts                # internal: the tables parsed on first use, `assemble`, the avoid lists
    options.ts              # internal: the language list, the prefix per script, the length range
    nameGenerator.ts        # internal: a given name and a surname, each drawn or invented
    placeGenerator.ts       # internal: a name and a kind, the kind in each language's template
    data/
      index.ts              # the chances, written by hand in all three packages
      names.ts syllables.ts compounds.ts places.ts kinds.ts avoid.ts   # tables, emitted to the ports
  file/
    index.ts
    randFileExtension.ts    # public: string[], or FileExtensionDetail[] on `output: 'detail'`
    randMimeType.ts         # public: string[], or MimeTypeDetail[] on `output: 'detail'`
    fileExtensionGenerator.ts # internal: the candidates per call, the weighted draw
    mimeTypeGenerator.ts    # internal: the same draw over the MIME types the extensions carry
    data/index.ts           # FILE_EXTENSIONS, each with its MIME type
    data/constants.ts       # FILE_CATEGORIES, MIME_TOP_LEVELS
  gpu/
    index.ts
    randGpu.ts              # public: string[], or GpuDetail[] on `output: 'detail'`
    gpuGenerator.ts         # internal: randCpu's draw over the graphics catalog
    data/index.ts           # GPUS: every graphics processor, one row each
    data/constants.ts       # GPU_VENDORS
  gender/
    index.ts
    randGender.ts           # public: string[], or GenderDetail[] on `output: 'detail'`
    genderGenerator.ts      # internal: the codes a call allows, the weighted draw
    data/index.ts           # GENDER_CODES, GENDER_WEIGHTS, GENDER_LABELS per language
  device/
    index.ts
    randDevice.ts           # public: string[], or DeviceDetail[] on `output: 'detail'`
    deviceGenerator.ts      # internal: the candidates per call, the maker written once
    data/index.ts           # DEVICES: every model, one row each
    data/constants.ts       # DEVICE_TYPES, DEVICE_VENDORS
  disk/
    index.ts
    randDiskType.ts         # public: string[], or DiskTypeDetail[] on `output: 'detail'`
    randDiskSize.ts         # public: string[], or DiskSizeDetail[] likewise
    diskTypeGenerator.ts    # internal: the platform first, then the kind it uses
    diskSizeGenerator.ts    # internal: the platform, the kind, then a size of that kind's pool
    data/index.ts           # DISK_TYPES, DISK_UNITS, the labels, the weights, DISK_SCALE, DISK_SIZES per kind
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
      index.ts              # NAME_DATA, bounds
      specs.ts              # NAME_LANGUAGES, NAME_SPECS: everything but the pools, for the helpers
      types.ts              # internal dataset types
      syllables.ts          # syllable templates for invented names
      en.ts ko.ts ja.ts …   # one file per language
  word/
    index.ts
    randWord.ts             # public: string[], or WordDetail[] on `output: 'detail'`
    randAnimal.ts …         # public: one per theme, thirty-seven of them, one doc page each
    wordLengthRange.ts      # public helper
    wordGenerator.ts        # internal: the generator, and the drawing primitives
    data/
      index.ts              # WORD_DATA, WORD_LANGUAGES, WORD_THEMES
      lengths.ts            # GENERATED by tools/lengths: the word and nickname length tables
      types.ts              # internal dataset types
      en.ts ko.ts ja.ts zh.ts …   # one file per language, nine of them: the nouns
      modifiers/            # each language's modifiers, agreement, frames and syn, apart
      nouns/                # es it de ru: the tagged nouns, whose genders randModifier reads
  nickname/
    index.ts
    randNickname.ts         # public: string[], or NicknameDetail[] likewise
    nicknameLengthRange.ts  # public helper
    nicknameGenerator.ts    # internal: shapes, length fitting; draws through word/
  os/
    index.ts
    randOs.ts               # public: string[], or OsDetail[] on `output: 'detail'`
    osGenerator.ts          # internal: the candidates per call, the line, release and build drawn
    data/index.ts           # OS_FAMILIES, OS_RELEASES: every release, one row each
    data/constants.ts       # OS_FAMILY_CODES, named apart from the OS_FAMILIES table
  phone/
    index.ts
    randPhone.ts            # public: string[], or PhoneDetail[] on `output: 'detail'`
    phoneGenerator.ts       # internal: the shape per draw, the groups, the three ways to write them
    data/index.ts           # every country's plan and templates
    data/constants.ts       # PHONE_COUNTRIES, PHONE_TYPES
  random/
    index.ts
    seededRandom.ts         # public: a seeded source for `random` — sfc32, seeded from the seed's text
  ram/
    index.ts
    randRam.ts              # public: string[], or RamDetail[] on `output: 'detail'`
    ramGenerator.ts         # internal: the platform, the size, then the kind of memory sold at it
    data/index.ts           # RAM_SCALE, RAM_SIZES per platform, RAM_TYPE_ENTRIES: each kind, its years and sizes
    data/constants.ts       # RAM_UNITS, RAM_TYPES
  resolution/
    index.ts
    randResolution.ts       # public: string[], or ResolutionDetail[] on `output: 'detail'`
    resolutionGenerator.ts  # internal: one pool per platform, the weighted draw
    data/index.ts           # RESOLUTIONS, every size with its weight per platform
  version/
    index.ts
    randVersion.ts          # public: string[], or VersionDetail[] on `output: 'detail'`
    versionGenerator.ts     # internal: the three formats, the small-number draw, the calendar schemes
    data/index.ts           # VERSION_FORMATS, the part ranges, the pre-releases, CALVER_SCHEMES
  sentence/
    index.ts
    randSentence.ts         # public: string[], or SentenceDetail[] likewise
    sentenceLengthRange.ts  # public helper
    sentenceGenerator.ts    # internal: the shapes, the verb selection, the fitting
    story.ts                # internal: the planner that turns a story into beats
    data/
      index.ts              # SENTENCE_DATA, THEME_CLASS, STORIES, FIELD_RULES
      lengths.ts            # GENERATED by tools/lengths: the sentence length table
      types.ts              # internal dataset types (verbs, states, frames)
      en.ts ko.ts ja.ts …   # one file per language, nine of them
  location/
    index.ts
    randLocation.ts         # public: string[], or LocationDetail[] likewise
    randCountry.ts …        # public: one per level — country, region, city, district
    locationGenerator.ts    # internal: the pools per level, the draw
    regionGenerator.ts      # internal: randRegion's draw, off the regions file alone
    narrow.ts               # internal: startsWith and the length range over a list of names
    shorten.ts              # internal: a division's short name, by the rule in data/short.ts
    data/
      index.ts              # LOCATION_DATA
      constants.ts          # LOCATION_LANGUAGES, LOCATION_LEVELS, the option readers
      types.ts              # internal dataset types
      short.ts              # LOCATION_SHORT: each language's short-name rule, written by hand
      en.ts ko.ts           # GENERATED by tools/location — never edited by hand
      regions.ts            # GENERATED too: each outline's first level, for randRegion
      countries.ts          # GENERATED too: every country, named in every word language
test/
  base.test.ts              # the package's export surface
  age.test.ts               # one *.test.ts per category
  appstore.test.ts
  architecture.test.ts
  cpu.test.ts
  date.test.ts
  decorate.test.ts
  device.test.ts
  disk.test.ts
  file.test.ts
  mime.test.ts
  gender.test.ts
  gpu.test.ts
  organization.test.ts
  location.test.ts
  name.test.ts
  nickname.test.ts
  os.test.ts
  phone.test.ts
  random.test.ts
  ram.test.ts
  resolution.test.ts
  sentence.test.ts
  treeshake.test.ts         # no module in lib does anything on import
  version.test.ts
  word.test.ts
scripts/
  check-side-effects.mjs    # that rule, run over lib by the test and over dist by the build
```

### Conventions

- **One public function per file**, named after the function; the category's `index.ts` re-exports them, and `lib/index.ts` re-exports the categories. This mirrors the author's other library, [qsu](https://github.com/jooy2/qsu).
- **Relative imports end in `.js`**, even though the source is `.ts` — the build emits ESM that Node has to resolve at runtime. Type-only imports may omit it.
- **Public types go in `lib/_types/global.ts`** and are exported from `lib/index.ts` with `export type *`. Types that only describe internal data (pools, language datasets) stay next to that data.
- **Internal modules are not exported** from any `index.ts`. Prefix-free names are fine; the `index.ts` files are the API boundary.
- **Every public function takes a single optional options object** and has a JSDoc block with an `@example`. All options have defaults — `randName()` with no arguments must work, and so must `randName(null)`: the implementation opens on `options ??= {}`, because a default parameter does not catch `null`. A `null` inside the object is an option left out, the way the ports read one.
- **Prettier owns formatting** (tabs, single quotes, no trailing commas). Run `npm run format`; `npm run build` runs it first.
- **Every draw goes through one source, and `random` is how a caller replaces it.** `_internal/utils` holds an ambient source and `withRandom` swaps it for the length of a call; `Math.random` is named in exactly one place. Ambient rather than threaded through every signature, because the alternative is carrying a parameter through some fifty call sites of `pick` — and the library is synchronous from the entry point down, so nothing can interleave. **A new draw calls `pick` / `randInt` / `chance` / `random`, never `Math.random`**, or a caller's source quietly stops being the source: `List.shuffle` and `random.shuffle` are how both ports leaked one. **`seededRandom` is the seeded source the JavaScript package hands a caller**, because `Math.random` takes no seed and Dart's `Random(42)` and Python's `random.Random(42).random` already are one; its numbers are pinned by `test/random.test.ts`, since every fixture built on a seed is made of them, so a change to the generator is a change to every one of those fixtures.
- **Zero runtime dependencies.** This is a hard constraint, not a preference. It is why Hangul romanization is implemented in `lib/name/romanize.ts` instead of pulling in `es-hangul`.
- **No module may do anything at import time.** `package.json` declares `sideEffects: false`, which is what lets a bundler drop the pools a caller never reaches — importing only `randSuffix` is about half a kilobyte gzipped, where the whole library is over 700 KB — the getting-started page's table has the measured numbers, and is the one place they are written down. The declaration is a promise about every file in `lib/`: constants and function declarations, and nothing that runs. A single top-level statement with an effect makes it a lie, and the failure is silent — the bundler drops code the caller needed.
- **And nothing at import time may look like it does something.** A bundler, or a configuration of one, that does not read `sideEffects` decides from the code, and keeps every module whose top level might do something: a call, a `new`, a spread, a property read, an arithmetic operator inside an object — esbuild keeps `{ bytes: 1000 ** 3 }` and drops `{ bytes: 1e9 }`. One such statement in a dataset puts every pool into a bundle that imports `randSuffix` alone. So a call that builds a value at the top level is marked `/*#__PURE__*/`, and a literal that holds calls or spreads — every dataset — is wrapped whole in one marked arrow function called on the spot: `export const EN = /*#__PURE__*/ ((): WordLanguageData => ({ … }))();`. The type goes on the arrow, because a type on the constant no longer checks the literal's property names. **esbuild reads `@__NO_SIDE_EFFECTS__` on a function only within its own file**, so marking `words` once in `parse` does nothing for the datasets that import it; the mark is on each call. `scripts/check-side-effects.mjs` holds the rule: `test/treeshake.test.ts` runs it over `lib`, and `npm run build` runs it over `dist`, where it would notice `terser.config.json` losing `preserve_annotations` and every mark with it.
- **A decorator does not reach the nouns.** Each word language's modifiers, agreement, frames and invented-word template live in `word/data/modifiers/<code>.ts`, which the language's file spreads into `WORD_DATA`; `randModifier` reads `MODIFIER_DATA` and, for the four languages whose modifiers agree with a noun, `NOUN_GENDERS` out of `word/data/nouns/<code>.ts`. One module per language was 253 KB gzipped for a decorator when it was split, against 91 KB after; the four tagged noun files grew with the pools since, and it is 122 KB now. The ports keep one file per language, since nothing there is bundled, and `tools/parity` compares the assembled `WORD_DATA` either way.
- **A public constant does not share a module with a catalog.** A catalog is built by a call at the top of its module (`rows(...)`, `words(...)`), which a bundler cannot prove pure and so keeps whenever anything of that module is imported. `CPU_VENDORS` beside `CPUS` cost an importer 1.7 KB for a list of twelve names; a category's public constants go in its `data/constants.ts`, which `data/index.ts` re-exports for the generators.

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
| `npm run build`  | `format` → `clean` → `tsc` → `minify` → `check:side-effects`        |
| `npm run lint`   | ESLint (`lint:fix` to fix)                                          |
| `npm run format` | Prettier, in place                                                  |

The tests are TypeScript but import from `../dist`, so they are run through `tsx` and **they need a build** — that is what `npm run test` does first. Node >= 22, which is the floor `package.json` declares and the lowest the workflow runs.

Only `dist/` and the top-level `README.md` / `LICENSE` are published; `.npmignore` keeps `lib/`, `scripts/`, `test/`, the config files and the remaining markdown out of the package.

**`build` empties `dist/` first**, because `tsc` writes over what it emits and never deletes. A renamed folder leaves its old output behind — `lib/affix` became `lib/decorate` and `dist/affix` sat there afterwards — and since the whole of `dist/` is published, that is dead code shipped to npm.

## The Dart package (`packages/dart`)

A port of the JavaScript package, not a second design. Same datasets, same rules, same numbers; what differs is the surface, which is Dart's.

```
lib/
  randino.dart              # the barrel — its `show` clauses ARE the public API
  src/
    types.dart              # ALL public types (enums, LengthRange, every detail)
    constants.dart          # the shared bounds, as `lib/constants.ts` has them
    internal/               # mirrors lib/_internal: utils, parse, generate, script, capacity
    age/                    # mirrors lib/age, plus `randAgeDetails`
    appstore/               # mirrors lib/appstore, plus `randAppStoreDetails`
    architecture/           # mirrors lib/architecture, plus `randArchitectureDetails`
    cpu/                    # mirrors lib/cpu, plus `randCpuDetails`
    date/                   # mirrors lib/date, plus `randDateUnit` and `randDateDetails`
    decorate/               # mirrors lib/decorate, plus the `…All` list forms
    device/                 # mirrors lib/device, plus `randDeviceDetails`
    fictional/              # mirrors lib/fictional, plus a `…Details` twin per function
      data/                 # the tables GENERATED by tools/emit; index.dart by hand
    disk/                   # mirrors lib/disk, plus `randDiskTypeDetails` and `randDiskSizeDetails`
    file/                   # mirrors lib/file, plus `randFileExtensionDetails` and `randMimeTypeDetails`
    gender/                 # mirrors lib/gender, plus `randGenderDetails`
    gpu/                    # mirrors lib/gpu, plus `randGpuDetails`
    organization/           # mirrors lib/organization, plus `randOrganizationDetails`
      data/                 # one file per language, ported verbatim
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
    os/                     # mirrors lib/os, plus `randOsDetails`
    phone/                  # mirrors lib/phone, plus `randPhoneDetails`
    ram/                    # mirrors lib/ram, plus `randRamDetails`
    resolution/             # mirrors lib/resolution, plus `randResolutionDetails`
    sentence/               # mirrors lib/sentence, plus `randSentenceDetails`
      data/                 # one file per language, ported verbatim
    version/                # mirrors lib/version, plus `randVersionDetails`
    location/               # mirrors lib/location, plus a `…Details` twin per function
      data/                 # en.dart ko.dart GENERATED by tools/location
test/
  base_test.dart            # the barrel's export surface, read out of the source
  age_test.dart
  appstore_test.dart
  architecture_test.dart
  cpu_test.dart
  date_test.dart
  decorate_test.dart
  device_test.dart
  disk_test.dart
  file_test.dart
  mime_test.dart
  gender_test.dart
  gpu_test.dart
  organization_test.dart
  location_test.dart
  name_test.dart
  nickname_test.dart
  os_test.dart
  phone_test.dart
  ram_test.dart
  resolution_test.dart
  sentence_test.dart
  version_test.dart
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
- **A null enum means "every one of them"** — that is how `'all'` crosses over. An empty set is not null: it reads the way the other two packages read an empty list, which is the value left out (`randVersion(format: {})` is `semver`) or, for a sentence's `type`, every kind named. `NicknameDetail.theme` is the one nullable that means something else (the word is not one the generator knows), and it says so in its doc comment.
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
- `randNameDetails`, `randNicknameDetails`, `randWordDetails`, `randSentenceDetails` and the five location `…Details` functions still exist here. In the other two packages they are `output: 'detail'` on the generator itself; in Dart, `randName` returns `List<String>` and that is the end of it.
- `randSentence`'s `include` is a `List<String>` where the other two take a string or a list, for the same reason.
- A fictional generator's `language` is one `WordLanguage?`, and the list the other two take — which returns a map of every language per result — is `randFictionalNameForms` and the four place `…Forms`, taking the set positionally. The `…Details` take a set, since several languages change nothing there but `forms`.
- `randDate`'s `unit` is `randDateUnit`, because it turns the strings into numbers. It takes the unit positionally — `randDateUnit(DateUnit.minute)` — the way `randModifierAll` takes its list, and every other parameter is named. `minDate` / `maxDate` are `DateTime?` alone, where the other two also take an ISO 8601 string: a `String` beside a `DateTime` is the `Object` parameter this section rules out.
- The **thirty-seven themed word functions have no detail form.** Thirty-seven more functions for one option would be the wrong trade, so `randAnimal` returns `List<String>` and a caller who wants the detail passes `WordTheme.animal` to `randWordDetails`. That asymmetry is documented on every one of them.

Do not try to fake either with `Object` or a generic: `T extends Object` would type-check `randSuffix(3)` and fail at run time, which is worse than a second name. **A new option that changes a return type lands as a second Dart function**, and the `::: lang` blocks on the docs page are where the two shapes are shown side by side.

### Keeping the ports in step

The JavaScript package is the source of truth. A behaviour change lands there first, then in each port, in the same commit where that is practical. Every suite asserts the same properties over the same pools, so a port that drifted shows up as a test that passes on one side and fails on another — which is the point of porting the tests rather than writing new ones.

That catches drifting *behaviour*. It does not catch drifting *data*: a word added to one package's pools and forgotten in the others breaks no property, because every suite asserts over whatever pools its own package happens to hold. `node tools/parity/index.mjs` is what catches that — see the tooling section below.

## The Python package (`packages/python`)

A port of the JavaScript package, not a second design. Same datasets, same rules, same numbers; what differs is the surface, which is Python's.

```
src/randino/
  __init__.py               # the barrel — its `__all__` IS the public API
  _types.py                 # ALL public types (Literals, every detail)
  constants.py              # the shared bounds, as `lib/constants.ts` has them
  _internal/                # mirrors lib/_internal: utils, parse, generate, script, capacity
    table.py                # rows() / items(), apart from parse: see the system bullets
  age/                      # mirrors lib/age
  appstore/                 # mirrors lib/appstore
  architecture/             # mirrors lib/architecture
  cpu/                      # mirrors lib/cpu
  date/                     # mirrors lib/date
  decorate/                 # mirrors lib/decorate; `@overload` carries the shape
  device/                   # mirrors lib/device
  disk/                     # mirrors lib/disk
  fictional/                # mirrors lib/fictional
    data/                   # the tables GENERATED by tools/emit; __init__.py by hand
  file/                     # mirrors lib/file
  gender/                   # mirrors lib/gender
  gpu/                      # mirrors lib/gpu
  organization/             # mirrors lib/organization
    data/                   # one file per language, ported verbatim
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
  os/                       # mirrors lib/os
  phone/                    # mirrors lib/phone
  ram/                      # mirrors lib/ram
  resolution/               # mirrors lib/resolution
  version/                  # mirrors lib/version
  sentence/                 # mirrors lib/sentence
    data/                   # one file per language, ported verbatim
  location/                 # mirrors lib/location
    data/                   # en.py ko.py GENERATED by tools/location
  py.typed                  # PEP 561 — without it every annotation is ignored
tests/
  test_base.py              # the barrel's export surface, and the no-dependency rule
  test_age.py
  test_appstore.py
  test_architecture.py
  test_cpu.py
  test_date.py
  test_decorate.py
  test_device.py
  test_disk.py
  test_file.py
  test_mime.py
  test_gender.py
  test_gpu.py
  test_organization.py
  test_location.py
  test_name.py
  test_nickname.py
  test_os.py
  test_phone.py
  test_ram.py
  test_resolution.py
  test_sentence.py
  test_version.py
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
- **`tuple[int, int]` replaces `[number, number]`**, and every detail is a frozen dataclass with `slots=True`.
- **File names are `snake_case`, one public function per file**, named after the function. `__init__.py` re-exports them and `__all__` is the contract.
- **`import randino` reads nothing.** `__init__.py` imports for the type checker alone, under `TYPE_CHECKING`, and its `__getattr__` imports a module the first time one of its names is asked for, through `_HOMES`. Reading every pool up front took a seventh of a second, whichever generator a caller came for. A new public name goes in all three — the import, `__all__` and `_HOMES` — and `test_base.py` asks for every name of `__all__`, and for one name of each module first in a fresh interpreter: the eager imports read the modules in one order, and that order hid an import cycle.
- **Imports are absolute** (`from randino.name.data import NAME_DATA`), even inside the package, so a moved file breaks loudly rather than silently.
- **Everything public carries a docstring**, including inside `_internal`. Ruff's `D` rules are on, Google convention.
- **`ruff format` owns formatting** — 4 spaces, double quotes, 100 columns. Double quotes rather than the repo's single because that is what the Python ecosystem's formatters emit; each package follows its own language's convention, which is the same reason Dart uses single.
- **No dependencies.** `test_base.py` walks every module's imports and asserts each one is either stdlib or `randino`, because that promise is the one nothing else fails on.
- **The ambient source is a `ContextVar`, not a module global.** A JavaScript call cannot be interrupted, but a Python thread can be, and two threads that each passed their own `random` swapped one global back and forth: a caller who asked for `SystemRandom` was handed draws from somebody else's seed, and one caller's source stayed in place after both had finished. `test_base.py` runs two threads against each other to keep it that way.

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
      markdown.ts           # `<Lang>` and the option tables flattened to text, for llms and <meta>
      wordOptions.ts        # the rows `WordOptions.vue` draws and `llms-full.txt` writes
      locationOptions.ts    # the same for `LocationOptions.vue`
      fictionalOptions.ts   # the same for `FictionalPlaceOptions.vue`
    llms.ts                 # `llms.txt` and `llms-full.txt`, written at build time
    theme/                  # the language switch, the packages menu, the demo, the CSS
      components/
        Demo.vue            # `/demo`, which runs the library in the reader's browser
        WordOptions.vue     # the option table `randWord` and its thirty-seven share
        LocationOptions.vue # the option table `randLocation` and its four levels share
        FictionalPlaceOptions.vue # the option table the four fictional place functions share
        Lang.vue …          # the `<Lang>` switch, the package marks and menus, the layout
  en/  ko/                  # the pages, mirrored
  scripts/
    copy-changelog.mjs      # every package's CHANGELOG.md -> docs/<locale>/changelog.md
    check-anchors.mjs       # every `#fragment` link resolves (see below)
    check-site.mjs          # no markup left in llms*.txt, every page in the menu, every constant documented
  public/                   # the logo, one file per size (see below)
```

| Command                 | What it does                                        |
| ----------------------- | --------------------------------------------------- |
| `npm run dev`           | The dev server                                      |
| `npm run build`         | changelog → VitePress → anchor and site checks, into `docs-dist/` |
| `npm run typecheck`     | `tsc` over `.vitepress`                             |
| `npm run format`        | Prettier, read-only — what CI runs                  |
| `npm run format:fix`    | Prettier, in place                                  |

### One page, every package

A page says the same thing about `randName` whichever package a reader installs; only the code, the option shape and the install line differ. So they are not three sites and not three folders:

- **`::: lang js` … `:::`** wraps a block only one package sees. `::: lang js dart` is a block two of them want.
- **`<Lang js="…" dart="…" py="…" code />`** is the inline form, for a phrase in the middle of a sentence that does not differ. It is what keeps an option table from being written three times, and what carries `min_length` next to `minLength`.

Every variant is in the document and CSS hides all but one, which is what buys the no-flash switch, a hydration-safe render and a search index that carries all of them. Adding a package is an entry in `data/languages.ts`, a branch in `LangMark.vue` for its logo, a line in each of the two hard-coded selector groups in `theme/styles/lang.css` (the page's blocks, and the home page's picker), an entry in `PACKAGES` in `scripts/copy-changelog.mjs` and a key in `OptionVariants` in `data/wordOptions.ts`, a row in `packageLinks` in `config.ts` plus a branch in `RegistryMark.vue` for the registry it is published to, and the blocks on whatever pages have something to say about it.

**Function and option names in headings, the sidebar and anchors stay in the JavaScript spelling**, and only the body carries all three. That is not laziness: VitePress builds its outline from the rendered heading and its sidebar from `config.ts`, so a per-package heading would either read as all three names run together or flash the wrong one before hydration — and a cross-page `#anchor` has to resolve for every reader, not just the one who picked JavaScript. The mapping is mechanical (`minLength` → `min_length`) and Getting started states it once.

### The menu is not the folders

The source is a folder per category, and the sidebar deliberately does not repeat that split. A reader looking for `randNickname` is looking for a function, not for the corner of the library it belongs to, so the groups are what a function **is**:

- **API**, which nests three groups by what a function *does with a string*: **Generators** make one out of nothing, **Decorators** attach something to one you already have (`randSuffix`, `randPrefix`, `randModifier`), and **Utilities** answer a question about a language (`nameLengthRange`, `wordLengthRange`, the two `nameSupports…`) or hand over something an option takes (`seededRandom`). Generators nests once more, into **General** — `randName`, `randNickname`, `randWord`, `randSentence`, `randLocation`, `randAge`, `randGender`, `randOrganization`, `randDate` and `randPhone`, one per kind of value — **System**, the values a sample machine is described by, **Fiction**, the five functions for the names and places of a made-up world, and two groups of one function with an argument decided: **Words**, the thirty-seven themed forms of `randWord`, and **Locations**, the four level forms of `randLocation`.
- **Behaviour** — the prose explaining how a generator's options behave, where there is enough of it to be its own page. `randName`, `randNickname` and `randSentence` have one each; `randWord` does not, because it draws one word and its API page says everything there is to say. Its own group rather than more entries under Guide, because it grows alongside Generators and Guide does not.

`data/sidebar.ts` nests as deep as it is written: a `SidebarGroup`'s `items` are pages, or more groups, and `sidebarFor` recurses. **Three levels is the working limit** — API > Generators > Words is the deepest there is. The third level earns itself by splitting one group that had grown past reading, not by being a finer category: thirty-seven entries under Generators is a list nobody scans, and `randAnimal` is `randWord` with an argument decided, so `General` and `Words` is the split the functions themselves suggest. Anything that is merely *related* to a page still goes beside it, not under it.

**One page, one function**, which is why there is no `helpers` page holding three of them any more: a page that documents three functions can be named after none of them, so the menu names the page and the reader still has to open it to find out whether what they came for is inside.

There is **no exception for a family of functions**. `randAnimal` … `randFurniture` are thirty-seven names for `randWord` with its `theme` decided, and they have thirty-seven pages: a reader looking for `randAnimal` should find `randAnimal`, not a section of somebody else's page. What that would cost — the same option table written out thirty times, in two locales, with three packages' types in every cell — is paid by `WordOptions.vue` instead, which draws the table once and takes a `theme` prop for the one page that accepts the option rather than answering it. **A page repeated across pages is a component, not a reason to merge the pages.**

Those thirty-seven are the **Words** group nested inside Generators, beside **General** — in one list with it they would bury it. `LocationOptions.vue` does the same for `randLocation` and its four level pages, with a `level` prop. `FictionalPlaceOptions.vue` draws the table the four fictional place pages share. Words and Locations are the groups the navbar's API dropdown leaves out, and each says so itself with `sidebarOnly`: `navGroupsFor` gathers a group's pages through its subgroups, and skips the ones marked. The Markdown that is left on each page is what actually differs: what the theme is, and three code samples of it.

The navbar is the same lists — its API dropdown is Generators, System, Decorators and Utilities as four labelled sections, built out of `data/sidebar.ts` by `navGroupsFor`, so the menu and the sections it points into cannot drift. Generators there is **General**, because everything else in it is `sidebarOnly` or, like **System** and **Fiction**, carries an `id` of its own and is a section of the dropdown in its own right; `pagesOf` leaves a subgroup with an `id` to that section. Its **Packages** dropdown is `PackageLinks.vue`, which is where npm, pub.dev and PyPI went when they stopped being three of the four icons in the navbar's right-hand corner; the registry URLs are still derived from the three manifests in `config.ts`, and GitHub is the one social link left. Its marks are `RegistryMark.vue` and not `LangMark.vue` — npm is not JavaScript and PyPI is not Python, and only pub.dev, which brands itself with the Dart logo, has the same drawing in both files.

### The demo runs the real library

`/demo` is not a description of `randName`; it calls it, in the reader's browser. The Vite alias in `config.ts` points the bare specifier `randino` at `packages/javascript/lib/index.ts`, and a four-line plugin rewrites the package's own `./x.js` imports to `./x.ts` — those extensions are deliberate (the built ESM needs them) and Vite cannot resolve them against source files by itself.

**Depending on `randino` from npm would be the wrong shape.** The site documents this repository, so a page describing an option added since the last release would demo a build without it. The cost is that `.github/workflows/publish-documentation.yml` has to redeploy when `packages/javascript/lib/**` changes, which is in its path filter.

`Demo` is registered as an async component, so the library is a chunk of its own that `/demo` alone loads; registered the plain way, every pool was in the theme chunk every page of the site preloads. The plugin returns `moduleSideEffects: false` for the files it resolves, which is the package's own `sideEffects: false` carried across, so the catalogs the demo never reaches stay out of that chunk too.

`Demo.vue` generates nothing during SSR. A page of random text pre-rendered at build time and re-rendered on hydration is a guaranteed mismatch rather than a likely one, so the first batch is drawn in `onMounted`.

### `llms.txt` is generated, not written

`llms.ts` writes `llms.txt` and `llms-full.txt` into `docs-dist/` from `buildEnd`, the same place `robots.txt` is written. Both come out of `data/sidebar.ts` and the same first-paragraph summary the `<meta>` descriptions use, so a page added to the menu is in them without anyone remembering — a hand-written index is a second table of contents, and the second one goes stale.

They are **English and JavaScript**: llms.txt has no notion of locales, and the `::: lang` blocks are flattened to the reference implementation's half with the mapping to Dart and Python stated once at the top. `data/markdown.ts` holds the one transform that flattening and the `<meta>` descriptions both need.

### Two traps

**A Korean heading cannot be linked to by its text.** VitePress slugifies through `NFKD`, so a Hangul heading's id is *decomposed jamo* while anything typed into a Markdown link is composed — identical in an editor, in a diff and in review, and the link scrolls nowhere. Give any Korean heading that is a link target an explicit `{#ascii-anchor}`, matching the English page's anchor where there is one. `scripts/check-anchors.mjs` fails the build otherwise; it runs as part of `npm run build`.

**Every page has to exist in both locales.** `data/sidebar.ts` is one structure with an `en` and a `ko` label per entry, and VitePress fails the build on a dead link — so a page added to one locale and not the other does not get committed by accident.

### The disclaimer is one page

`guide/disclaimer` is where the site says what the values are, what they are for, and that a match with a real person, organization, number or product is a coincidence nobody answers for. The repository's `README.md` and each package's carry a short version of it that links there. A page that warns about real values — a phone number that can be in service, a product name that is a trademark, an organization that can match a real one — keeps its own warning and links to the section of the disclaimer it belongs to.

**A new generator whose values can match something real gets a line on that page**, in both locales: under `#coincidence` when a value can be somebody's, under `#trademarks` when it names a real product. The page is a promise about every generator, and one that is missing from it is the one a reader will ask about.

**No page shows a whole drawn phone number.** An example opens on a block that is really in use, so a whole one can be somebody's, and a published page keeps it there for good. The phone page, the READMEs, the changelogs and the doc comments in all three packages write the last four digits as `#` (`010-4821-####`, `8 (912) 345-##-##`) and say so beside the examples, and the demo hides them the same way on its phone tab. A fictional number, `555-01xx` or a German drama number, is nobody's and is written whole.

### The logo

The artwork lives at `assets/logo-master.png` — outside `docs/public/`, so VitePress does not serve it. `docs/public/` holds what is served, one size per job, all generated from that master:

| File                   | Size    | Where it is used                                  |
| ---------------------- | ------- | ------------------------------------------------- |
| `logo-16.png`          | 16      | favicon                                           |
| `logo-32.png`          | 32      | favicon, and the navbar mark at 24×24             |
| `128x128.png`          | 128     | every `README.md`, displayed at 96×96             |
| `256x256.png`          | 256     | spare, for anything asking for a mid-size mark    |
| `512x512.png`          | 512     | `og:image`, which wants a PNG                     |
| `512x512.webp`         | 512     | the home page hero: 26 KB where the PNG is 193 KB |
| `apple-touch-icon.png` | 180     | iOS home screen — **opaque**, see below           |
| `favicon.ico`          | 16/32/48 | the browsers and Windows surfaces that ask by name |

Regenerating from the master takes two passes over the source before any resizing: the alpha is snapped (the artwork is painted at 254 rather than 255, and a fringe of alpha 1..8 runs to the left edge), then it is cropped to what is left. The WebP is the 512 PNG through `cwebp -q 90 -m 6 -alpha_q 100`, which keeps the alpha lossless.

Two things a regeneration has to keep. The margin is **2%** of the master, not a generous one: the mark is a cube with dots on it, and at 16px every percent of the tile it does not fill is a dot that stops being a dot. And `apple-touch-icon.png` is the one that is **not transparent** — iOS composites a transparent home-screen icon on black, so its background is painted in.

The repository's own `README.md` links the file by a relative path, which is what GitHub resolves; the three package `README.md`s link it by its `raw.githubusercontent.com` URL, because npm, pub.dev and PyPI resolve neither a relative path nor the docs site.

### Deployment

`.github/workflows/publish-documentation.yml` builds the site and deploys `docs-dist/` through GitHub Pages' own deployment on every push to `main` that touches `docs/`, `packages/javascript/lib/**` (the demo bundles it from source), any package's manifest, or any package's `CHANGELOG.md`. Nothing else in `packages/` reaches the site, so nothing else triggers it. It is the only workflow that deploys the site, and it repeats `run-build-docs`' three checks — typecheck, format, build — because a commit landing on `main` directly never saw them.

It is two jobs, and the split is the point. `build` runs `npm ci`, and with it every install script of every dependency, so it holds nothing but a read of the repository and hands the site over as an artifact. `deploy` runs no dependency's code: it takes the artifact and deploys it with `actions/deploy-pages`, on a short-lived token GitHub signs for that job (`pages: write`, `id-token: write`), and every action it uses is pinned to a commit. No long-lived token is stored for the site any more; the `ACCESS_TOKEN` the old `gh-pages` push used is not read. The repository's Pages source has to be "GitHub Actions" for the deploy to land, and the custom domain is the one set in the Pages settings.

Two things it does not hard-code. The custom domain is read out of the npm package's `homepage`, the same field `config.ts` derives the canonical links and the sitemap from, and the deploy fails when the domain Pages is set to differs from it, so the two cannot drift apart. And `run-build-docs` is pull-request-only, so one commit never builds the site twice.

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
    index.mjs             # writes the Dart and Python sentence and fictional datasets, then formats them
    sentence-data.ts      # the emitter: reads `SENTENCE_DATA`, writes each port's syntax
    fictional-data.ts     # the same for the fictional tables, which are one string each
    README.md             # what it writes, what it leaves alone
  location/
    index.mjs             # writes all three packages' location datasets out of the publishers' files
    README.md             # which files, their checksums, and what is kept of them
  lengths/
    index.mjs             # writes the npm package's length tables, then formats them
    lengths.ts            # the writer: measures the pools through the generators' own functions
    README.md             # what each table holds, and when to run it
```

The parity check runs from `.github/workflows/run-check-data.yml`, the one workflow that installs all three toolchains at once. The emitter, the location writer and the length writer run by hand.

### `tools/emit` — the sentence datasets are written once

`node tools/emit/index.mjs` reads `SENTENCE_DATA` out of the JavaScript package and writes `packages/dart/lib/src/sentence/data/<code>.dart` and `packages/python/src/randino/sentence/data/<code>.py` for every language, then runs `dart format` and `ruff format` over them. **Edit a sentence dataset in `packages/javascript` and regenerate**, rather than editing the three copies; the emitted files say at the top that they are generated, and a comment worth keeping goes in the JavaScript source.

It also writes the fictional tables (`packages/dart/lib/src/fictional/data/*.dart`, `packages/python/src/randino/fictional/data/*.py`): each is one string in every package, copied as it is, so the generated file is the JavaScript table in the port's syntax. Their `index` files, with the chances, are written by hand. Beyond those two it writes nothing. The word and name datasets, the `index` files, `THEME_CLASS`, the stories and the field rules are still written by hand in all three, and `tools/parity` is what checks them. A generated file that fails to compile is a bug in `sentence-data.ts`, not something to patch in the file.

### `tools/location` — the locations come from the publisher, not from JavaScript

`node tools/location/index.mjs <sources>` reads the files each country publishes, and the tz and Wikidata files the country table is built from, and writes `lib/location/data/<code>.ts` and `countries.ts`, their Dart and Python counterparts at once, then formats all three. **This is the one dataset the JavaScript package is not the source of**: thousands of real divisions can only be trusted as the publisher wrote them, so the publisher's file is the source and every package is a copy of it. The source files are not committed; `tools/location/README.md` names each one, where it comes from, and the checksum of the copy the repository was written from.

The run stops rather than writes when a file changes shape — new columns, an unknown LSAD, a 시 that holds neither 읍·면·동 nor 일반구 — because each of those is a decision about what a real place is called. A generated file that is wrong is a bug in `index.mjs`, not something to patch in the file.

### `tools/lengths` — the length helpers read a table, not the pools

`node tools/lengths/index.mjs` measures what `wordLengthRange`, `nicknameLengthRange` and `sentenceLengthRange` report and writes it into `lib/word/data/lengths.ts` and `lib/sentence/data/lengths.ts`. Measured at call time, the two numbers put every pool in the bundle of whoever imported a helper — 342 KB gzipped for a word range — which is the same reason `NAME_SPECS` is apart from the name pools. The generators still measure the pools, and each suite compares its table with what its generator measures, so **a change to a pool, a frame or a sentence shape that moves a range fails the suite until the tables are written again.** It is the npm package alone: the ports are not bundled, their helpers read their own pools, and `tools/parity` already compares those pools, so the tables are not in it.

### `tools/parity` — the packages hold the same data

`node tools/parity/index.mjs` loads the datasets out of all three packages the way each package loads them, and fails on any difference.

**It compares what the three languages actually parse**, not the files. A pool one language splits differently, an escape that means something else in Dart, a language registered in one `index` and forgotten in another — none of that is visible by reading the three files side by side, and all of it shows up here.

**The dumps normalize what only differs because the languages differ, and nothing else.** A pool entry is `{ n, r }` everywhere; field names are the JavaScript ones; an optional field is present and null rather than absent; `syn` carries its `kind` tag even in the two packages that tell the shapes apart by type. That normalization lives in the three dumps — one per package, each responsible for its own language's spelling — so the comparison itself has nothing to know about any of them. Adding a field to a dataset means adding it to all three dumps, and the check reports a field only one dump writes as a difference, which is the intended failure.

**Do not widen it into a general "the ports agree" check.** It covers the word, sentence, name and location datasets, the age bands and curve, the date units and default range, the phone plans and templates, the operating system catalog and the weight of each line, the device, processor and graphics catalogs with the makers `vendor` accepts, the operating system lines `family` accepts, the architectures with their weights per platform, names and aliases, the memory sizes per platform and their weights, the kinds of memory with their years and sizes, the disk types and their weights per platform, the disk sizes per kind and their weights, the screen resolutions and their weights per platform, the version formats and the ranges their parts are drawn from, the app stores and their weights per platform, the file extensions with their categories, weights and MIME types, the gender labels and weights, the non-binary identities with their labels and weights, the short-name rule of each location language, the organization datasets and their odds, the fictional tables and their chances, the stories and the field rules beside them, the surname romanization map, and the bounds in `constants` and `decorate/data` — the last of which is still written by hand in each package. The nickname shapes are in it now that they are `WordLanguageData.frames`: they were left out while they were a table private to each generator, and being data is what put them in. The sentence datasets are the same story on a larger scale, `THEME_CLASS` included, because a theme moving from one class to another changes what every verb of every language will accept.

## Testing a random generator

The return value is random, so tests assert the **properties every result must have**, over a sample large enough (`SAMPLE = 60`) that a broken option cannot pass by luck:

- The script matches the language (`/^[가-힣]+$/` for Korean, `\p{Script=Cyrillic}` for Russian, …).
- The structure matches the options — word count for `includeSurname` / `includeMiddleName`, character count for CJK.
- Requested constraints hold for every name: `startsWith`, `minLength` / `maxLength`, `unique`.
- `count` is exact, including the clamped edges (`0`, negatives, above `RAND_COUNT_MAX`).
- Anything genuinely deterministic is asserted by value: `nameLengthRange`, the romanizer's known outputs.

Do not assert an exact generated name. A seed is available now (`random`), and it is still the wrong thing to pin output with: the pools grow, and a word added to one of them moves every draw after it, so a seeded assertion fails on the next dataset commit rather than on a real regression. Seed a test to prove that seeding works, and assert properties everywhere else. When a property test is flaky, the option is either under-specified or the assertion is wrong; **run the suite 20+ times before calling it stable**, because a 1-in-1000 case will show up in CI otherwise.

Gender is the one option with no directly observable effect in most languages. It is verified through Russian, whose middle name and surname inflect for it (`…ович` / `…овна`, `Иванов` / `Иванова`).

Nicknames are checked against the datasets themselves: `randNickname({ output: 'detail' })` reports the `words` it used, so every word can be asserted to come from the language's pools, and the English pools are asserted to share nothing with the English person-name pools. Korean and Japanese cannot have that last invariant — `하늘`, `별` and `森` are everyday nouns that also happen to be names, and `아름다운하늘` is still nobody's name.

Sentences are checked the same way, one layer up: every phrase has to decompose into what the generator is allowed to build (an article, a noun, at most one modifier, on the side the language puts it), every verb has to belong to a group that accepts the subject's class, and Korean's `가` / `이` has to match the coda of the word in front of it. `randSentence({ output: 'detail' })` is what makes all three checkable.

Two coincidences are load-bearing and must not be asserted away: a word can be both a modifier and a noun (`무지개`, `Marble`, `自由`), and an invented word can spell a real one by accident (`나` + `비` -> `나비`, so `theme` comes back as `'animal'` at `realism: 'invented'`). Structural assertions survive both; "the first word is not a modifier" does not.

## Behaviour notes, generator by generator

What each generator does that is worth knowing before changing it, and how to add a language or a theme to it, is kept beside the generator in the npm package, where Claude Code reads it on its own when a file of that folder is opened. The notes hold for all three packages; a port has no copy, so read the file named here before changing a generator in Dart or Python.

| Notes | File |
| ----- | ---- |
| Names, and adding a name language | `packages/javascript/lib/name/CLAUDE.md` |
| Nicknames and the decorators | `packages/javascript/lib/nickname/CLAUDE.md` |
| Words, adding a word language, the compound rule, adding a theme | `packages/javascript/lib/word/CLAUDE.md` |
| Sentences, and adding a sentence language | `packages/javascript/lib/sentence/CLAUDE.md` |
| Locations, and adding a location language | `packages/javascript/lib/location/CLAUDE.md` |
| Ages | `packages/javascript/lib/age/CLAUDE.md` |
| Dates | `packages/javascript/lib/date/CLAUDE.md` |
| Phone numbers | `packages/javascript/lib/phone/CLAUDE.md` |
| Genders | `packages/javascript/lib/gender/CLAUDE.md` |
| Organizations | `packages/javascript/lib/organization/CLAUDE.md` |
| Fictional names and places | `packages/javascript/lib/fictional/CLAUDE.md` |
| System values, every one of them | `packages/javascript/lib/os/CLAUDE.md`, imported by the `CLAUDE.md` of each other system folder |

Three rules are every generator's, and live in `_internal/generate`:

- **`collect` stops after a run of draws that add nothing.** A run with nothing new ends a call, whatever is left of the `count * 50 + 500` budget: a `unique` call whose pool had run out spent the whole of it, which was fifteen seconds in JavaScript and over a minute in Python. **The run is twenty draws for each result found, and never fewer than `COLLECT_STALL`**, because a fixed run cannot tell a pool that has run out from a large one that has not: two thousand left one of the 249 countries out about once in three thousand calls, and a pool of thousands short nearly every time. A pool drawn evenly is left short this way about twice in a billion calls, whatever its size. A pool drawn by weight is not covered — a result far rarer than the rest can still be missed — which is what the next rule is for.
- **A catalog lists its results, and `collectFrom` draws them.** A generator that only picks — the system values, `randGender`, `randAge` — hands `collectFrom` every result it can return, as an entry and a weight: each level's share from `shares`, multiplied down the levels the draw used to pick in turn. An ordinary call draws from the running total of the weights, or by index where every weight is the same. A `unique` one draws and skips repeats until sixteen come in a row, then deals out what is left in the order that draw would find it, each entry waiting a time drawn at the rate of its weight: a wait drawn that way does not remember how long it has run, so switching changes no odds, and the call stops exactly when the list runs out. That is what `collect` could not do for `randOs`, which asked for every release came back short half the time and still did one call in six after the run grew with what had been found; it now returns all of them in under a millisecond. `build` writes a result each time its entry comes up, so no two results are one object.
- **A catalog lists once for each set of options.** `keptOutcomes` keeps the list a call made under a key that names every option the list depends on — the platforms, the years, the makers, whether builds are asked for — and nothing a result is only written by, like a maker in front of a model; `collectFrom` keeps the running total beside each list it is handed. A call of one result reads a table rather than the catalog, which is what makes `randOs()` faster than the draw it replaced rather than slower. A catalog lets its lists go at sixty-four sets of options and lists again, so a caller who moves a year range call by call does not keep one for every range. **An option a new list depends on goes in its key**, or two calls that differ by it share one list. A generator whose results cannot be listed — names, words, sentences, dates, phone numbers, version numbers — stays on `collect`, and so do the locations, whose pools are drawn evenly and run to tens of thousands of entries a call would have to list.
- **A length range narrows `language: 'all'` before a draw.** `languagesFitting` leaves out a language whose own range cannot meet the one asked for while another's can, the way `languagesWriting` leaves out one that cannot write `startsWith`, and keeps every language when none can. Each generator hands it the range its own way: `nameLengthRange`, a word or nickname `naturalRange`, a sentence's range times its count, an organization plan's `fits`, and for locations whether `narrow` found an exact fit (`inRange`).

## Commit conventions

`[scope] tag: message`, where the scope is `[javascript]`, `[dart]` or `[python]` for a change to one package and `[common]` for one that reaches all of them, and a change to the docs site alone takes none. Udacity Git style tags: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, plus informal `package` (deps/config) and `typo`. Write in English, wrap identifiers and paths in backticks, one logical change per commit. Example: `feat: add \`randNickname\` method`.

A release is its own commit, `[javascript] bump version to \`x.y.z\``, and touches the package's manifest, its lockfiles and its `CHANGELOG.md` — one bullet per user-visible change, newest version on top, dated. The entries collect under `## vNext (yyyy--)` as they land, and the release commit puts `## x.y.z (yyyy-mm-dd)` under that heading, which stays behind, empty, for the next one. Nothing else belongs in it. The packages version independently, so a release commit touches one package.

## Releasing

**Publishing is a tag push.** Each release commit is tagged `<package>-v<x.y.z>` — `javascript-v1.3.0`, `dart-v1.3.0`, `python-v1.3.0` — on `main`, after CI has passed on it. A bare `v1.3.0` would not say which package it is, and the packages do not share a version. Pushing the tag starts `.github/workflows/release.yml`, which runs two jobs for the package. The first fails unless the tag names the version in the manifest, writes the release notes from that version's section of the package's `CHANGELOG.md` (`.github/scripts/release-notes.mjs`), and builds the package. The second publishes it to its registry and writes the GitHub release with what the registry received attached: the tarball, the archive pub.dev serves, or the wheel and the source distribution.

**No registry token is stored anywhere.** npm, pub.dev and PyPI each list `release.yml` in this repository, running in the `release` environment, as a trusted publisher, and accept the short-lived token GitHub signs for it. pub.dev also holds the tag pattern `dart-v{{version}}`, and publishes only from a tag push. npm's trusted publisher has to allow `npm publish` under Allowed actions: a new configuration allows only `npm stage publish`, and refuses a direct publish with `403 OIDC permission denied for this action`. Renaming the workflow file or the environment breaks publishing until all three settings are changed to match. Only the publishing job has `id-token: write`, and every action it uses is pinned to a commit rather than a tag, since a tag is a name its owner can move; the job that installs dependencies and builds holds no credential.

Every registry rejects a re-upload of a version that already exists, so the version number is the one thing that cannot be taken back, and pushing the tag is what spends it. A publish the registry already holds is skipped, so a run that failed after publishing is re-run, not re-tagged.

Before tagging, from the package's own directory:

| Package      | Check it                                        | By hand, if the workflow cannot         |
| ------------ | ----------------------------------------------- | --------------------------------------- |
| `javascript` | `npm run lint && npm run test && npm run build` | `npm publish`                           |
| `dart`       | `dart analyze --fatal-infos && dart test`       | `dart pub publish`                      |
| `python`     | `ruff check . && mypy && pytest`                | `rm -rf dist && uv build && uv publish` |

The commands in the last column use the maintainer's own credentials, which belong in the tooling's own config, never in the repository. `uv build` adds to `dist/` without emptying it, and `uv publish` uploads everything in it, so the previous version's files go first. A version published by hand still gets its release from the tag, because the workflow skips the publish it finds already done.
