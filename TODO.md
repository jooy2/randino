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

## Further ideas, not yet agreed

These came up while the system generators were written and were never put to the maintainer. Ask before starting any of them.

- `randRam` could report the memory type (`DDR4`, `DDR5`, `LPDDR5X`) by platform and year.
- `randDiskSize` could keep to the sizes a drive type is sold in, so an eMMC is never 8 TB.
- `randArchitecture` could take a naming scheme (`debian`, `go`, `kernel`) and write the alias that scheme uses instead of the common name.
- `randDevice` could take the same `vendor` filter `randCpu` and `randGpu` now have.
