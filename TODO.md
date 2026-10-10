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

- **A46. A site check script.** Fail the docs build on a component tag left in `llms*.txt`, a page missing from `SIDEBAR`, and an upper-case export missing from `reference/constants.md`.
- **A47. Stale bundle sizes.** `CLAUDE.md` calls 448 KB the whole library (it is about 613 KB; 448 KB is `randSentence`) and cites a 33 KB figure that is not there; `rand-sentence.md` still says 122.5 and 144.5 KB. Keep the numbers in the getting-started table only, and add `randLocation` (160 KB), `randCountry` (18 KB) and `randOrganization` (14 KB) to it.
- **A48. Stale statements in `CLAUDE.md`.** The deploy triggers contradict each other (lines 545 and 583); "four folders" is 22; General has 10 functions, not five; the Behaviour pages leave out sentence; the Dart and Python trees miss `generate`, `script`, `capacity` and `constants`; the commit section leaves out the `[common]` prefix; the selectors hard-coding the packages are in four places, not one.
- **A49. `CONTRIBUTING.md` is out of date.** It does not say the sentence and location datasets are generated, it contradicts itself on the language of the docs, and its line about the tag separator is garbled.
- **A51. Korean copy.** `ko/demo.md` names the button "Generate" where the UI says "생성"; the home tagline is the one sentence in 해요체 and says "별명"; getting-started says "데코레이터" where everything else says "장식 함수".
- **A52. The `randSentence` docs.** `includeName` is described as off by default in the pages, the JSDoc and both ports' doc comments, where it is drawn per result; the speech paragraph is stale; the `startsWith` section leaves out `ru` and `vi`; "exactly one subject and one predicate" is false; several example sentences are ones the rules now forbid. Regenerate the examples from a build.
- **A53. Name and word examples.** A 27-character name for a 20-to-25 range, `Naoyato`, a Russian name family-first, `거문고` for `maxLength: 2`, eight themed examples from another theme (`randNature`'s `Sunset`), and four themed functions missing from the `randWord` page.
- **A54. The decorator docs.** The nickname page says `randSuffix` makes collisions impossible; the default separator is described as nothing where five languages use a space; the Python `language` row of `randNickname` has the wrong default; 57^8 is 1.1 × 10¹⁴, not 3.7 × 10¹⁴; German has six gender rules, not four; six Korean anchors differ from the English ones.
- **A55. Smaller doc fixes.** The CPU and GPU detail tables type `vendor` as `string`; `randFileExtension`'s JSDoc example leaves out `mimeType`; `randPhone`'s detail overload and Dart's `randPhoneDetails` leave out the warning that a number may be real; the organization page says one in four where it is one in five; the Korean `maxLength: 14` location example cannot be met; the phone page counts Korea's regions differently from the location data; the site code's comments carry stale counts.

### B. Needs a decision

- **B56. `collect` keeps drawing after nothing new can come.** It spends `count * 50 + 500` draws however long they take: `randWord({ language: 'vi', startsWith: 'ư', unique: true, count: 10000 })` is 70 s, and minutes in Python. A stall cutoff ends it, at the cost of rarely returning one result fewer; hoisting the per-draw pool filtering out of the generators needs no decision and can go with it. A test bounding how long an exhausted `unique` takes goes with it, since it fails until the cutoff is in.
- **B57. `minLength` given alone is capped by the default maximum.** `randName({ language: 'en', minLength: 30 })` writes 20 to 21 characters. Moving the omitted bound out of the way, as `randAge` does, changes output.
- **B58. `language: 'all'` and a length range only some languages can meet.** The others answer with their closest entry: `randLocation({ maxLength: 15 })` lands 48%, `randOrganization` 32%, `randWord({ maxLength: 1 })` 28%. Keeping only the languages that fit changes the mix, and should be one rule for every generator.
- **B59. CJK names drop the surname under a tight `maxLength`.** `randName({ language: 'ko', maxLength: 1 })` writes `솔`, where the docs say a surname is never dropped. Change the behaviour or the docs.
- **B60. Japanese and Chinese `startsWith` leaves native script in the roman form.** `startsWith: '鬱'` gives `鬱 Haruto`. Romanize kana, or leave out the languages with no name on that character.
- **B61. Chinese `randModifier` writes an action without 的.** `拥抱狮子` reads as a verb and its object. Writing the frame's particle changes output and the rule that only frames write particles.
- **B62. The Korean romanization is described as Revised Romanization.** RR does not write sound changes inside a given name (`Boknam`); the romanizer writes `Bongnam`. Fix the docs or the behaviour.
- **B63. The top of `sentenceLengthRange` cannot be reached, and multi-sentence results miss the middle of a range.** `ko` reaches 47 of a claimed 55; three sentences miss a mid range 57 to 94% of the time. Re-measuring changes the numbers returned; a fallback changes the output. A test on the middle of a multi-sentence range goes with it, since it fails until one of the two is done.
- **B64. Dart reads an empty set differently.** `randVersion(format: {})` is every format and `randSentence(type: {})` is untyped in Dart only. Aligning either way changes one package.
- **B65. Split the word data for bundling.** `randAnimal` alone is 260 KB, and `randModifier` uses about 87 KB of the 260 KB it pulls. Splitting modifiers and grammar from the nouns by theme touches three packages and `tools/parity`; an invented word is looked up in every theme, which limits what a themed function saves.
- **B66. Encode or split the location data.** Front-coding the US outline is 134 KB to 114 KB gzipped, and emitting region names apart would keep `randRegion` off the outline. Both change the generated files.
- **B67. Merge the duplicated generators.** `cpuGenerator` and `gpuGenerator`, `ramGenerator` and `diskSizeGenerator` are the same code; merging saves about 80 lines per package and no bytes, and runs into the rule against a shared generator abstraction.
- **B68. The site description.** The `<meta>` description, the home hero and the `llms.txt` preamble describe only names, nicknames, words and sentences.
- **B69. Contrast.** The "Get started" button is 3.47:1 and the `--vp-c-text-3` hints 2.87 to 3.37:1, under 4.5:1. Fixing either changes the brand colour or the tone.
- **B70. `CLAUDE.md` is 163 KB.** Moving the per-generator behaviour notes next to each generator removes about 80 KB, and changes where the rules are found.
- **B71. The docs deploy holds a write token in the job that runs `npm ci`.** Splitting build and deploy, or moving to `actions/deploy-pages`, needs the Pages settings changed.

### Found while working

- **A72. Japanese verbs that already carry an object take a second one.** A verb written with its own `を` (`値をつける`) sits in a group that takes an object, so a sentence writes `電話を値をつけます`. Move those verbs to a group without an object, or give the frame the particle the verb needs (`電話に値をつける`), in the JavaScript data; `tools/emit` carries it to the ports.

## Further ideas, not yet agreed

These came up while the system generators were written and were never put to the maintainer. Ask before starting any of them.

- `randRam` could report the memory type (`DDR4`, `DDR5`, `LPDDR5X`) by platform and year.
- `randDiskSize` could keep to the sizes a drive type is sold in, so an eMMC is never 8 TB.
- `randArchitecture` could take a naming scheme (`debian`, `go`, `kernel`) and write the alias that scheme uses instead of the common name.
- `randDevice` could take the same `vendor` filter `randCpu` and `randGpu` now have.
