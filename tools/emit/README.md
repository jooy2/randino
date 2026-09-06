# Emitting the ported datasets

`node tools/emit/index.mjs` writes the Dart and Python **sentence** datasets out of the JavaScript ones, then runs `dart format` and `ruff format` over the files it wrote.

The JavaScript package is the source of truth. Every language's sentence data is a few hundred lines of verb groups, state groups, modifier groups, adverbials, frames and their past forms, and the two ports hold a copy of each in their own syntax. A pool edited in one copy and not the others is exactly the drift `tools/parity` exists to catch; this tool is what makes the fix one edit rather than three.

## What it writes

One file per language: `packages/dart/lib/src/sentence/data/<code>.dart` and `packages/python/src/randino/sentence/data/<code>.py`. Everything in `SentenceLanguageData` is carried over, in the shape each port's types expect, and a few things are spelled the way that port spells them:

- A Korean-style tense, where every past form is one stem and one ending shared by the whole group, is written through `conjugate` rather than as a second pool, the way the JavaScript source writes it.
- A pool is wrapped to 100 columns inside `words(...)`, with `_` standing for a space inside one entry, the same convention every dataset already uses.
- A field the JavaScript type leaves optional is written only when the source sets it, so the emitted file reads like one written by hand.

## What it does not write

Only the sentence datasets. The word and name datasets, `SENTENCE_DATA`'s own `index` files, `THEME_CLASS`, the stories and the field rules are still written by hand in each package, and the emitter does not touch a language it does not find in `SENTENCE_DATA`.

The emitted files carry no comments of their own. A remark worth keeping belongs in the JavaScript source, where it is read; the ports say at the top that they are generated.

## After running it

Run `node tools/parity/index.mjs` from the repository root, then each port's suite. A generated file that fails to compile is an emitter bug, and belongs in `sentence-data.ts` rather than in the file.
