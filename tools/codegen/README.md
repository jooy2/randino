# Data codegen

`data/*.yaml` in, the three packages' data files out.

```
node tools/codegen/index.mjs           write the files
node tools/codegen/index.mjs --check   fail if they are not up to date
```

`--check` is what CI runs. It writes the files, compares, restores whatever was
there and exits non-zero on a difference — so a pull request that edits a
generated file by hand fails with the file named.

## Why generate rather than load

Each package could read one JSON file at run time instead. It would cost more
than it saves:

- **Dart could not.** There is no `dart:io` on Flutter Web, so the file would
  have to be an asset, and a library that makes an app edit its `pubspec.yaml`
  is a library nobody wants.
- **The types stop checking.** `nouns: Record<WordTheme, WordPool>` fails to
  compile today when a theme is missing. Read from JSON, it fails at run time.
- **The packages stop being plain libraries.** No build step, nothing to resolve,
  nothing to ship beside the code, is most of what makes them easy to depend on.

So the data is written once and emitted three times, and the emitted files are
committed.

## Layout

```
index.mjs           reads data/, writes every target, runs each formatter
yaml.mjs            the YAML subset data/ is written in — reader and writer
render.mjs          line breaking: pools, comments, the generated-file banner
emit/javascript.mjs one emitter per package
emit/dart.mjs
emit/python.mjs
```

Each emitter writes syntactically valid source and leaves the layout to that
language's formatter — prettier, `dart format`, `ruff format`, all of which
`index.mjs` runs. The two things a formatter will not do are the two `render.mjs`
handles: what is inside a string literal, and how a comment wraps.

## Adding a field to a dataset

1. Add it to the language's `data/*.yaml`.
2. Teach all three emitters to write it, in each language's own spelling.
3. Add it to the three dumps in `tools/parity`, so the check can see it.
4. Regenerate, then run `node tools/parity/index.mjs` and the three suites.

A field only one emitter writes is a field `tools/parity` reports as a
difference, which is the intended failure rather than a surprise.
