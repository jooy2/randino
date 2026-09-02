# The datasets

Every pool the library draws from, written once. The three packages' data files
are generated from here — editing one of those by hand is a change the next
`node tools/codegen/index.mjs` throws away, and CI fails before it gets that
far.

```
data/
  word/en.yaml ja.yaml ko.yaml zh.yaml       the word pools, per language
  name/en.yaml ko.yaml …                     the name pools, per language
  name/syllables.yaml                        the shared invented-name templates
```

## Editing

Add a word, fix a romanization, re-weight a surname — then regenerate:

```
node tools/codegen/index.mjs
```

That rewrites all 42 data files across the three packages and runs each
language's formatter over them. Commit the generated files along with the change
to `data/`: the packages ship without a build step, so what is in the repository
is what npm, pub.dev and PyPI get.

Then run the suites that would notice a mistake:

```
cd packages/javascript && npm run test
cd packages/dart       && dart test
cd packages/python     && pytest
```

## The format

A subset of YAML — scalars, integer pairs, block scalars and nesting. Pools are
whitespace-separated words inside a block scalar, the same way they read in the
generated files:

```yaml
# A comment above a field is carried into all three packages, so this is where
# to explain why a pool holds what it holds.
modifiers: |
  멋진 아름다운 귀여운 용감한 씩씩한
```

- `_` inside an entry stands for a space, so `De_Luca` is one surname.
- `native:roman` pairs carry a reading (`佐藤:Sato`); `native:weight` pairs carry
  a frequency (`김:215`). Which one a field holds is decided by the field, not by
  the syntax.
- `codaOpen: 2` on a syllable template is how many empty codas sit in front of
  the pool — that is what makes an open syllable the likeliest ending.

Line breaks inside a pool do not matter: the generator re-wraps them. Comments
are re-wrapped too, so a sentence can be edited in place without re-breaking it.

## What is not here

The `index` files that register the languages and themes, and the two shared
constant modules. They are a line or two per language, they carry each language's
own doc comments, and `tools/parity` already fails when they disagree — so they
are edited in each package by hand.
