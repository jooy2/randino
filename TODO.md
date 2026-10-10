# TODO

Work agreed on but not started. Each item is one commit across all three packages (JavaScript first, then Dart and Python), with tests, the docs pages in both locales, the three `CHANGELOG.md` files under `## vNext (2026--)`, `CLAUDE.md` where a rule changes, and `node tools/parity/index.mjs` passing. Delete an item from this file in the commit that finishes it, and delete the file once it is empty.

Before committing any item, run the checks of every package (`npm run lint && npm run test` in `packages/javascript`, `dart analyze --fatal-infos && dart test` in `packages/dart`, `ruff check . && ruff format --check . && mypy && pytest` in `packages/python`) and `npm run format && npm run typecheck && npm run build` in `docs`. Run a new property test 20 times before calling it stable. Format the dumps in `tools/parity` with the packages' own settings, never from the repository root: Prettier with `packages/javascript/.prettierrc` at 100 columns, ruff with `packages/python/pyproject.toml`, and the Dart dump by hand, since `dart format` rewrites it wholesale.

## 1. A `family` filter for `randOs`

`randOs` draws a line (family) by weight first, then a release inside it. The lines are `OsFamily` in `packages/javascript/lib/_types/global.ts`, weighted in `OS_FAMILIES` in `packages/javascript/lib/os/data/index.ts`: `windows`, `macos`, `ubuntu`, `fedora` and `debian` on `desktop`, and `android`, `ios` and `ipados` on `mobile`.

- Add `family?: OsFamilyOption`, one line, several or `'all'`, default `'all'`. Resolve it with `resolveMany` the way `randDevice` resolves `type`, so an unknown name is dropped and a list of nothing but unknown names reads as every line.
- It narrows alongside `platform` and `minYear` / `maxYear`. A line named on the other platform (`family: 'ios', platform: 'desktop'`) leaves nothing, and is answered with an empty result, the way a year range nothing came out in is.
- Keep the two-step draw: filter the lines first, then draw a line by its weight among the ones left, then a release inside it. Several lines named keep their relative weights, so `['windows', 'ubuntu']` is still mostly Windows.
- Export an `OS_FAMILIES` list for callers if there is not one yet. Check the name first: `OS_FAMILIES` is already the internal weight table, so the public constant may need another name (`OS_FAMILY_NAMES`, or rename the table), and the parity dumps read the table today.
- Dart: `Set<OsFamily>?`, null or empty meaning every line, in `randOs` and `randOsDetails`. Python: `family: OsFamilyOption = "all"`.
- Tests: every line drawn alone returns only its own releases; a line on the wrong platform returns `[]`; several lines keep the weight order; an unknown name falls back to all.
- Docs: a row in the options table and a short section on `docs/en/os/rand-os.md` and `docs/ko/os/rand-os.md`, a row on both constants pages if a constant is exported, and the READMEs' option tables.

## 2. System tabs on the `/demo` page

`docs/.vitepress/theme/components/Demo.vue` runs the real library in the browser. Its tabs are `TABS` and `TAB_LABELS`, with the labels' strings in `docs/.vitepress/data/i18n.ts`; none of the system generators is there yet.

- Add one tab for the system values rather than one per generator: fourteen more tabs would not fit the row. Inside it, draw one sample machine per row: `randOs`, `randDevice`, `randCpu`, `randGpu`, `randArchitecture`, `randRam`, `randDiskType` and `randDiskSize`, `randResolution`, and the software values `randVersion`, `randAppStore`, `randFileExtension` and `randMimeType`.
- Draw them with one `platform` per machine, so a phone gets a phone's OS, chip, storage and screen, and offer `platform` (`desktop` / `mobile` / both) as the tab's one control.
- Keep the rules the component already follows: nothing is drawn during SSR, the first batch is drawn in `onMounted`, and the tab list keeps its keyboard pattern (arrow keys move between tabs, one tab in the tab order).
- Add the label to both locales in `i18n.ts`. Check the page in the browser pane at desktop and phone width, in light and dark mode.

## 3. Hardware released in 2026

The OS catalog runs to October 2026, and the device, processor and graphics catalogs stop at the end of 2025, because the 2026 hardware could not be confirmed from primary sources when they were written.

- Add the phones, tablets, laptops, processors and graphics processors that went on sale in 2026, each confirmed against the maker's own announcement or product page, with the year the first devices were sold. Do not add a part from a leak, a rumour or a benchmark listing. Keep to the lines each catalog already holds unless a new line clearly belongs.
- The rows live in `packages/javascript/lib/device/data/index.ts`, `lib/cpu/data/index.ts` and `lib/gpu/data/index.ts`, and are copied verbatim into `packages/dart/lib/src/<kind>/data/index.dart` and `packages/python/src/randino/<kind>/data/__init__.py`.
- A new maker in the CPU or GPU catalog also goes into `CpuVendor` / `GpuVendor` and `CPU_VENDORS` / `GPU_VENDORS` in all three packages; the suites fail until it does.
- The suites cap the years at 2025 and must move to 2026: `test/cpu.test.ts`, `test/gpu.test.ts`, `test/device.test.ts` and their Dart and Python counterparts, including the tests that draw `minYear: 2025` and compare against the catalog.
- Update every place that says "the end of 2025": the `randCpu`, `randGpu` and `randDevice` pages in both locales (their catalog tables count the parts per maker and give the year span), the three package READMEs, the bullet in `CLAUDE.md` that names the cutoff, and the counts in the `CHANGELOG.md` entries that are still under `vNext`.
- If a 2026 OS release came out after October 2026, add it the same way, confirmed against the publisher's release notes.

## Audit of 2026-10-10

Every public function, the docs site and the repository documents were reviewed for performance, security, bundle size, bugs, tests and docs. The findings were reproduced before they were listed. The `A` items need no decision and are worked through in batches of thirty, one commit each, with one push at the end of a batch; the `B` items change behaviour or need the maintainer's call, and wait until the `A` items are done. Anything found while working goes under "Found while working" with the next free number. Bundle sizes are esbuild `--bundle --minify` over `dist`, then `gzip -9`.

A fix to a generator added under `vNext` needs no changelog entry of its own, since the version that has the bug has not shipped; correct its existing entry if the entry says something the fix makes untrue.

### A. No decision needed

- **A10. Python's `random` swallows the caller's errors.** `random()` calls the source inside `try`, so a source that raises, or a value that is not callable (`random.Random(42)`), silently becomes `0` and every draw repeats. Call the source outside the `try` and check only what it returns; a non-callable reads as left out, as in JS.
- **A11. Python raises `OverflowError` on a huge integer.** `count=10**400` or `min_year=10**400` raise where every other wrong value falls back. Catch it in `_whole`.
- **A12. The release jobs use actions by tag.** The jobs holding `id-token: write` in `.github/workflows/release.yml` use `actions/checkout@v5`, `actions/setup-node@v6`, `actions/download-artifact@v8` and `dart-lang/setup-dart@v1`. Pin them to commit SHAs, the rule the docs workflow already states.
- **A13. Every docs page downloads the whole library.** `Demo.vue` is registered globally in `docs/.vitepress/theme/index.js`, so the theme chunk is 645 KB gzipped. `defineAsyncComponent` brings it to 25 KB and loads the library on `/demo` only; returning `{ id, moduleSideEffects: false }` from the `randinoSource` plugin in `config.ts` saves 13 KB more on the demo.
- **A14. The name helpers bundle every name pool.** `nameLengthRange`, `nameSupportsMiddleName` and `nameSupportsRoman` read `lengthSpec`, `hasMiddle` and `roman`, and are 18 to 19 KB each because those sit in the same objects as the pools. Move them into a small table of their own.
- **A15. The Japanese sentence data spells out five forms of every verb.** 805 of 847 verbs follow from the dictionary form, and the rest from rules for `〜ていく` and `〜てくる`. Writing the dictionary form and the verb class, the way `koVerbs` does for Korean, saves about 12 KB gzipped on `randSentence`. The parsed data must come out identical; `tools/emit` rewrites the ports.
- **A16. A constant drags in its catalog.** `CPU_VENDORS`, `GPU_VENDORS`, `DEVICE_TYPES`, `FILE_CATEGORIES`, `MIME_TOP_LEVELS`, `PHONE_COUNTRIES` and `DATE_UNITS` sit beside a top-level `rows(...)` or `words(...)` call a bundler cannot drop, so importing the constant alone costs 1.1 to 2.7 KB. Move the constants to modules of their own.
- **A17. The home hero image is 193 KB.** A WebP of `docs/public/512x512.png` is 26 KB. Keep the PNG for `og:image`.
- **A18. Dead code and stray comments.** `nameFits` has an unused `bounds` parameter; `sentenceGenerator.ts` has doc blocks attached to the wrong function near lines 1254, 1315, 3606 and 3698 and duplicated comments near 322 and 3780; `docs/.vitepress/data/sidebar.ts` has an orphaned block above `pagesOf`.
- **A19. Fractional capacity bounds are floored.** `randDiskSize({ unit: 'TB', minSize: 1.5, maxSize: 2.5 })` returns `1 TB`, and `randRam({ maxSize: 0.5 })` returns nothing although 512 MB is 0.5 GB. Compare against the bound as written. `_internal/capacity` in JS and Python.
- **A20. The `startsWith` script check differs between packages.** JS takes a fullwidth `Ａ` as Latin (`Ａiskell`), Python takes `×` and `÷` as Latin. Require a letter as well, and make Python's ranges match `Script=Latin` and `Script=Cyrillic`.
- **A21. Python `rand_word` skips `resolve_length`.** `min_length=nan` returns only the longest words, `min_length=[]` raises, and `realism=['real']` raises `TypeError: unhashable` in every generator that takes `realism`.
- **A22. Python reads non-ASCII digits in date strings.** `\d` matches `２０２４` and Arabic-Indic digits, which JS rejects. Use `re.ASCII`.
- **A23. `unique` with `script: 'roman'` returns duplicates.** The key is the native name, and two native names can romanize alike: 291 of 3,000 unique `vi` roman names repeat. Key on the string returned.
- **A24. `realism: 'real'` invents a name under `startsWith` and a tight `maxLength`.** The aimed draw narrows the pool by length and falls back to synthesis when no entry of that length starts with the character, though a real one exists (`Zeahos Cox` beside `Zachary King`). Fall back to the prefix matches of the whole pool first.
- **A25. Invented Russian surnames are never feminized.** `feminizeRu` runs only on pooled surnames, so `realism: 'invented', gender: 'female'` writes `Чачев`.
- **A26. `randModifier` reads a lowercase German noun as masculine.** `languageOf` tries the capitalized form and finds `Katze`, but `genderOf` looks up `katze` and writes `flinker katze`.
- **A27. An astral `charset` breaks `randSuffix` and `randPrefix`.** JS and Dart index UTF-16 code units, so `charset: '🎲🎯🎮'` writes lone surrogates. Python is right.
- **A28. An explicit `undefined` value makes a decorator ignore its options.** `randSuffix(undefined, { length: 12 })` writes five characters. JS only.
- **A29. A non-string `wordSeparator` breaks the nickname generator.** `randNickname({ wordSeparator: 5 })` throws and `nicknameLengthRange('en', 5)` is `[NaN, NaN]`; Python raises `TypeError`. Read it as left out.
- **A30. With `language: 'all'`, `slots` narrows the languages before `startsWith` does.** `randNickname({ slots: 'part', startsWith: 'б' })` is `[]`, while naming `ru` works. Filter by script first.
- **A31. `randNickname` reads `realism` before resolving it.** `realism: 'bogus'` invents nothing yet opens the loose themes. Derive `loose` from the resolved chance.
- **A32. `Lemonade` is in the English `food` pool.** It belongs in `drink`, in all three packages.
- **A33. A required modifier is dropped when the subject is a name.** `includeName` is drawn per result, and a named subject takes no modifier, so `include: 'brave'` is missing from 112 of 300 results. Do not write a name over a part the plan put a requirement on.
- **A34. The drawn `includeName` overrides an explicit `story`.** A drawn name narrows the hero to people, and `sketch` and `passage` have no person hero, so `story: 'sketch'` is told half the time. Draw a name only when the story asked for can have a person hero.
- **A35. `startsWith` invents nouns at `realism: 'real'` in steered languages.** The subject's theme is chosen before the prefix is considered, and `drawWord`'s `missed` is ignored: `ko '여'` invents 87 of 400 subjects, `zh '大'` 168. Choose among the themes that have a word with the prefix.
- **A36. German quoted lines put the verb first.** A spoken line drops its `time` part after the shape was chosen, and German's verb-second shapes then open on the verb (`„Ist eine Vorstadt sonnig.“`, 102 of 1,037). Leave shapes with a time part out for a spoken line instead.
- **A37. German writes `streckte sich er`.** A pronoun subject after a reflexive verb goes before `sich`. 295 of 10,000 story sentences.
- **A38. `include` is lost in a result of several sentences.** Requirements reach only the first sentence, and a story whose first beat cannot carry the word drops it: `ko include: '조용히'` over three sentences misses 257 of 400. Carry an unplaced requirement to the first beat that can take it.
- **A39. An invented organization stem can spell a famous brand under `startsWith`.** The syllable pools leave out `동`, `한`, `辉`, `恒`, `光` and others so two syllables cannot spell `동아` or `辉瑞`, but `inventStem` puts a caller's prefix back as the first syllable. Make the brands each data file lists into data, and redraw while a stem contains one.
- **A40. `.azw3` has the type of `.azw`.** The type IANA registered for KF8 is `application/vnd.amazon.mobi8-ebook`, which is what the comment and the docs promise.
- **A41. `llms-full.txt` carries 21 raw `<Lang>` tags.** `inlineLang` in `docs/.vitepress/data/markdown.ts` stops at the first `>`, which `js="() => number"` contains.
- **A42. The demo's accessibility.** Its inputs have no visible focus, the whole result list is `aria-live`, nine tabs point `aria-controls` at panels that do not exist, `demoShort` shows literal backticks, and `count` is not clamped.
- **A43. Make the cross-cutting tests table-driven.** Drive the base suites from the export list: no arguments, `count` as `0`, `-1`, `NaN`, `null`, past the maximum, seeded determinism, adversarial sources, unknown and prototype-key strings for every string option. Add a Python two-thread test and a time bound on an exhausted `unique`.
- **A44. The sentence suites pin the options that hide bugs.** The helpers fix `includeName: false`, `type: 'statement'` and `tense: 'present'`. Cover `include` with the default `includeName` and over several sentences, a named `story` by default, `startsWith` at `realism: 'real'`, German verb-second order and reflexives, and the middle of a multi-sentence length range.
- **A45. Organization prefixes.** Check every left-out syllable as `startsWith` against the brand list. The date format cases went in with A7.
- **A46. A site check script.** Fail the docs build on a component tag left in `llms*.txt`, a page missing from `SIDEBAR`, and an upper-case export missing from `reference/constants.md`.
- **A47. Stale bundle sizes.** `CLAUDE.md` calls 448 KB the whole library (it is about 613 KB; 448 KB is `randSentence`) and cites a 33 KB figure that is not there; `rand-sentence.md` still says 122.5 and 144.5 KB. Keep the numbers in the getting-started table only, and add `randLocation` (160 KB), `randCountry` (18 KB) and `randOrganization` (14 KB) to it.
- **A48. Stale statements in `CLAUDE.md`.** The deploy triggers contradict each other (lines 545 and 583); "four folders" is 22; General has 10 functions, not five; the Behaviour pages leave out sentence; the Dart and Python trees miss `generate`, `script`, `capacity` and `constants`; the commit section leaves out the `[common]` prefix; the selectors hard-coding the packages are in four places, not one.
- **A49. `CONTRIBUTING.md` is out of date.** It does not say the sentence and location datasets are generated, it contradicts itself on the language of the docs, and its line about the tag separator is garbled.
- **A50. The constants page leaves out `RAND_SENTENCE_COUNT_MAX`.**
- **A51. Korean copy.** `ko/demo.md` names the button "Generate" where the UI says "생성"; the home tagline is the one sentence in 해요체 and says "별명"; getting-started says "데코레이터" where everything else says "장식 함수".
- **A52. The `randSentence` docs.** `includeName` is described as off by default in the pages, the JSDoc and both ports' doc comments, where it is drawn per result; the speech paragraph is stale; the `startsWith` section leaves out `ru` and `vi`; "exactly one subject and one predicate" is false; several example sentences are ones the rules now forbid. Regenerate the examples from a build.
- **A53. Name and word examples.** A 27-character name for a 20-to-25 range, `Naoyato`, a Russian name family-first, `거문고` for `maxLength: 2`, eight themed examples from another theme (`randNature`'s `Sunset`), and four themed functions missing from the `randWord` page.
- **A54. The decorator docs.** The nickname page says `randSuffix` makes collisions impossible; the default separator is described as nothing where five languages use a space; the Python `language` row of `randNickname` has the wrong default; 57^8 is 1.1 × 10¹⁴, not 3.7 × 10¹⁴; German has six gender rules, not four; six Korean anchors differ from the English ones.
- **A55. Smaller doc fixes.** The CPU and GPU detail tables type `vendor` as `string`; `randFileExtension`'s JSDoc example leaves out `mimeType`; `randPhone`'s detail overload and Dart's `randPhoneDetails` leave out the warning that a number may be real; the organization page says one in four where it is one in five; the Korean `maxLength: 14` location example cannot be met; the phone page counts Korea's regions differently from the location data; the site code's comments carry stale counts.

### B. Needs a decision

- **B56. `collect` keeps drawing after nothing new can come.** It spends `count * 50 + 500` draws however long they take: `randWord({ language: 'vi', startsWith: 'ư', unique: true, count: 10000 })` is 70 s, and minutes in Python. A stall cutoff ends it, at the cost of rarely returning one result fewer; hoisting the per-draw pool filtering out of the generators needs no decision and can go with it.
- **B57. `minLength` given alone is capped by the default maximum.** `randName({ language: 'en', minLength: 30 })` writes 20 to 21 characters. Moving the omitted bound out of the way, as `randAge` does, changes output.
- **B58. `language: 'all'` and a length range only some languages can meet.** The others answer with their closest entry: `randLocation({ maxLength: 15 })` lands 48%, `randOrganization` 32%, `randWord({ maxLength: 1 })` 28%. Keeping only the languages that fit changes the mix, and should be one rule for every generator.
- **B59. CJK names drop the surname under a tight `maxLength`.** `randName({ language: 'ko', maxLength: 1 })` writes `솔`, where the docs say a surname is never dropped. Change the behaviour or the docs.
- **B60. Japanese and Chinese `startsWith` leaves native script in the roman form.** `startsWith: '鬱'` gives `鬱 Haruto`. Romanize kana, or leave out the languages with no name on that character.
- **B61. Chinese `randModifier` writes an action without 的.** `拥抱狮子` reads as a verb and its object. Writing the frame's particle changes output and the rule that only frames write particles.
- **B62. The Korean romanization is described as Revised Romanization.** RR does not write sound changes inside a given name (`Boknam`); the romanizer writes `Bongnam`. Fix the docs or the behaviour.
- **B63. The top of `sentenceLengthRange` cannot be reached, and multi-sentence results miss the middle of a range.** `ko` reaches 47 of a claimed 55; three sentences miss a mid range 57 to 94% of the time. Re-measuring changes the numbers returned; a fallback changes the output.
- **B64. Dart reads an empty set differently.** `randVersion(format: {})` is every format and `randSentence(type: {})` is untyped in Dart only. Aligning either way changes one package.
- **B65. Split the word data for bundling.** `randAnimal` alone is 260 KB, and `randModifier` uses about 87 KB of the 260 KB it pulls. Splitting modifiers and grammar from the nouns by theme touches three packages and `tools/parity`; an invented word is looked up in every theme, which limits what a themed function saves.
- **B66. Encode or split the location data.** Front-coding the US outline is 134 KB to 114 KB gzipped, and emitting region names apart would keep `randRegion` off the outline. Both change the generated files.
- **B67. Merge the duplicated generators.** `cpuGenerator` and `gpuGenerator`, `ramGenerator` and `diskSizeGenerator` are the same code; merging saves about 80 lines per package and no bytes, and runs into the rule against a shared generator abstraction.
- **B68. The site description.** The `<meta>` description, the home hero and the `llms.txt` preamble describe only names, nicknames, words and sentences.
- **B69. Contrast.** The "Get started" button is 3.47:1 and the `--vp-c-text-3` hints 2.87 to 3.37:1, under 4.5:1. Fixing either changes the brand colour or the tone.
- **B70. `CLAUDE.md` is 163 KB.** Moving the per-generator behaviour notes next to each generator removes about 80 KB, and changes where the rules are found.
- **B71. The docs deploy holds a write token in the job that runs `npm ci`.** Splitting build and deploy, or moving to `actions/deploy-pages`, needs the Pages settings changed.

### Found while working

Nothing yet.

## Further ideas, not yet agreed

These came up while the system generators were written and were never put to the maintainer. Ask before starting any of them.

- `randRam` could report the memory type (`DDR4`, `DDR5`, `LPDDR5X`) by platform and year.
- `randDiskSize` could keep to the sizes a drive type is sold in, so an eMMC is never 8 TB.
- `randArchitecture` could take a naming scheme (`debian`, `go`, `kernel`) and write the alias that scheme uses instead of the common name.
- `randDevice` could take the same `vendor` filter `randCpu` and `randGpu` now have.
