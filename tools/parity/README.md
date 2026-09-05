# Data parity

Every package holds its own copy of the datasets — the same pools, written in
its own language's syntax. That is deliberate: each package stays a plain
library with no build step, no data file to ship and nothing to resolve at run
time. What it costs is that a word added to one package and not the others is
invisible until somebody reads all three.

`node tools/parity/index.mjs` reads the datasets out of the three packages as
they actually load them, and fails if they disagree.

## Canonical shape

The three packages describe the same data in three different ways, and the
differences are the languages', not the data's:

| | JavaScript | Dart | Python |
| --- | --- | --- | --- |
| A pool entry with a reading | `{ n, r }` | `NameEntry(n, r)` | `NameToken(n, r)` |
| Field names | `hasMiddle` | `hasMiddle` | `has_middle` |
| Which synthesis a language uses | a `kind` field | a sealed class | two classes |
| The name order | `'family-first'` | `NameOrder.familyFirst` | `"family-first"` |

So each package gets a dump of its own — `dump-javascript.ts`, `dump_dart.dart`,
`dump_python.py` — and each one is responsible for writing its language's
spelling out in one shape both others can be compared against:

- Field names are the JavaScript ones, which is the spelling the docs, the
  sidebar and every anchor already use.
- A pool entry is always `{ "n": …, "r": … }`, with `r` null where the language
  romanizes by rule rather than per entry.
- An optional field is always present and null when it is not set, so "left out"
  and "set to nothing" cannot be confused for each other.
- `syn` always carries the `kind` tag, even in the two packages that tell the
  shapes apart by type.
- A field that is optional in one package and defaulted in another is written
  the same way in all three: a sentence part's `head`, `tail` and `tailAlt` are
  `""` where the language writes nothing, and `modifiable` and `bare` are always
  a boolean.

`index.mjs` compares the JavaScript dump against the other two, one leaf field
at a time. The JavaScript package is the source of truth, so a difference is
always reported as the other package's.

## What it covers

The word datasets, the sentence datasets, the name datasets, the surname
romanization map, and the bounds every generator shares (`constants` and
`decorate/data`). That is everything written once per package as data.

That includes the nickname shapes. They used to be a table private to each
generator and were left out for it; they are `WordLanguageData.frames` today —
per language, with the particle each gap needs — so the slots, the particles and
the weights are all data, and all compared.

The sentence datasets are the same story on a larger scale: the verbs with the
noun classes each group takes, the predicate adjectives, the adverbs, the
articles and the shapes, in nine languages. `THEME_CLASS` is compared with them,
because a theme moving from one class to another changes what every verb of
every language will accept. The connectives are compared per `ConnectiveKind`
rather than as one list, so a word that claims a consequence in one package and
a contrast in another is a difference.

## Running it

Each package has to be set up first, the same way its own test suite needs it:

```
cd packages/javascript && npm ci
cd packages/dart       && dart pub get
cd packages/python     && uv pip install -e ".[dev]"
```

Then, from the repository root:

```
node tools/parity/index.mjs
```

It picks up `packages/python/.venv` when one is there; set `PARITY_PYTHON` to
point it at a different interpreter.
