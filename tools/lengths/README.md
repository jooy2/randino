# Writing the length tables

`node tools/lengths/index.mjs` measures the word pools, the nickname shapes and the sentence shapes of the npm package, writes what it measured into `packages/javascript/lib/word/data/lengths.ts` and `packages/javascript/lib/sentence/data/lengths.ts`, and runs `prettier` over both.

`wordLengthRange`, `nicknameLengthRange` and `sentenceLengthRange` each hand back two numbers. Working them out at call time meant reading the pools, so a bundle that imported only one of them carried every pool too: 342 KB gzipped for a word range and 483 KB for a sentence range. The helpers now read these tables, which hold no pool and make no call at the top level, and each of them bundles in 0.5 to 1.5 KB.

## What it writes

- `WORD_LENGTHS`: the shortest and longest noun of every theme, per language. `wordLengthRange` takes the smallest and largest over the themes and languages it is asked about.
- `NICKNAME_SPANS`: each language's own joiner, and the shortest and longest nickname shape by how many gaps it has between its words, with nothing in a gap but the frame's particle. `nicknameLengthRange` adds the separator's length, or the joiner's, once per gap.
- `SENTENCE_LENGTHS`: the shortest and longest sentence each language can write.

Every number comes from the function the generator itself uses: `naturalRange` in `wordGenerator.ts` and `sentenceGenerator.ts`, and `frameSpans` beside `naturalRange` in `nicknameGenerator.ts`. The generators still measure the pools at run time, since they carry them anyway.

## When to run it

After any change to a noun pool, a nickname frame, a modifier pool, or a sentence shape or pool. `test/word.test.ts`, `test/nickname.test.ts` and `test/sentence.test.ts` each compare their table with what the generator measures, and fail with this command in the message when the two differ. A table out of date is a helper reporting a fallback the generator no longer uses, and nothing else would notice it.

## What it does not write

The Dart and Python packages. Neither is bundled, so both helpers there still measure the pools at call time, and `tools/parity` already compares the pools they measure. The tables are a copy of what the pools say, not data of their own.
