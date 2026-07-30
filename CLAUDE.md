# CLAUDE.md

Guidance for AI agents (and humans) working in this repository. Written in English to match the repo's existing docs (`README.md`, `CONTRIBUTING.md`).

## What randnick is

**randnick** is a zero-dependency TypeScript library that generates random **person names** and **nicknames**, per language. Two separate concerns, deliberately:

- **Names** should read like names a person actually carries (`김민준`, `Emma Clover`). Sample data for forms, seeds, mockups.
- **Nicknames** (not implemented yet) are the handles someone would pick for a game or a website.

Status: the name generator is done; the nickname generator is the next feature. Keep the two apart — a shared "generator" abstraction is not wanted, but shared _helpers_ (`lib/_internal`) are.

The name generator is a port of the logic behind vutools' [Random Person Name Generator](https://www.vutools.com/tools/text/random-person-name-generator) (`client/src/app/[locale]/tools/text/random-person-name-generator` in the `www-vutools-com` repo), with the same options. Two deliberate differences: the web page's `es-hangul` dependency is replaced by an internal romanizer (see below), and length bounds are resolved per language so `language: 'all'` does not stretch a Korean name to fill a Spanish name's range.

## Layout

```
lib/
  index.ts                  # re-exports every category + the public types
  _types/global.ts          # ALL public types live here (options, results)
  _internal/utils.ts        # shared random/string helpers, never exported
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
      parse.ts              # words() / tokens() / romanMap() pool helpers
      syllables.ts          # syllable templates for invented names
      en.ts ko.ts ja.ts …   # one file per language
test/
  name.test.ts              # one *.test.ts per category
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

Pools are written as whitespace-separated strings inside a template literal and split by the helpers in `data/parse.ts`, so a 120-name pool stays a few lines instead of 120:

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

| Command          | What it does                                                           |
| ---------------- | ---------------------------------------------------------------------- |
| `npm run test`   | `tsc` (type-check + emit to `dist`), then `node --test` over `test/**` |
| `npm run build`  | `format` → `tsc` → `minify`                                            |
| `npm run lint`   | ESLint (`lint:fix` to fix)                                             |
| `npm run format` | Prettier, in place                                                     |

Tests import from `../dist`, so **they need a build** — that is what `npm run test` does first. Node >= 18.

## Testing a random generator

The return value is random, so tests assert the **properties every result must have**, over a sample large enough (`SAMPLE = 60`) that a broken option cannot pass by luck:

- The script matches the language (`/^[가-힣]+$/` for Korean, `\p{Script=Cyrillic}` for Russian, …).
- The structure matches the options — word count for `includeSurname` / `includeMiddleName`, character count for CJK.
- Requested constraints hold for every name: `startsWith`, `minLength` / `maxLength`, `unique`.
- `count` is exact, including the clamped edges (`0`, negatives, above `NAME_COUNT_MAX`).
- Anything genuinely deterministic is asserted by value: `nameLengthRange`, the romanizer's known outputs.

Do not assert an exact generated name, and do not use a fixed seed — there is none. When a property test is flaky, the option is either under-specified or the assertion is wrong; **run the suite 20+ times before calling it stable**, because a 1-in-1000 case will show up in CI otherwise.

Gender is the one option with no directly observable effect in most languages. It is verified through Russian, whose middle name and surname inflect for it (`…ович` / `…овна`, `Иванов` / `Иванова`).

## Behavior worth knowing before changing it

- **Structure beats length.** A length range too narrow for the requested parts is answered with the closest name the generator can build; it never drops a surname or middle name the caller asked for. For space-separated languages the range is satisfied by re-drawing up to `FIT_ATTEMPTS` times, so a very narrow range is best-effort. CJK hits it exactly.
- **`unique` defaults to `false`** so that `count` is always exact. Turning it on trades that for deduplication and can return fewer names.
- **`style` is consulted per part**, not per batch, so `50` mixes real and invented parts within one name.
- **Length bounds are resolved per language** inside `generateOne`, not once per call. Keep it that way, or mixed-language output regresses.
- **`givenLenWeights` stretching:** asking a CJK language for a range longer than its real names produces long invented given names on purpose. That is a deliberate ask, not a bug.

## Adding a language

1. Add the code to `NameLanguage` in `lib/_types/global.ts`.
2. Add `lib/name/data/<code>.ts` with a `NameLanguageData` object: name order, joiner (`''` for CJK, `' '` otherwise), `hasMiddle`, `roman` mode, `lengthSpec`, and the pools. CJK languages use `givenMale` / `givenFemale` plus `first*` / `rest*` syllables; other scripts use `male` / `female` / `last` plus a `syn` template.
3. Register it in `NAME_DATA` and `NAME_LANGUAGES` in `lib/name/data/index.ts`.
4. If it needs a new romanization mode, add it to `RomanMode` and handle it in `lib/name/romanize.ts`.
5. `lengthSpec` must match reality — it is the default length range, and a wrong value shows up as padded or truncated names.
6. Add the language to the README table and to the script regexes in `test/name.test.ts`; the existing per-language tests then cover it.

## Commit conventions

`tag: message`, Udacity Git style tags: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, plus informal `package` (deps/config) and `typo`. Write in English, wrap identifiers and paths in backticks, one logical change per commit. Example: `feat: add \`randomNickname\` method`.
