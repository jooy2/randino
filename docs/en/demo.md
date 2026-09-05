# Demo

Everything below runs in your browser. The controls are the options `randName`, `randNickname`, `randWord` and `randSentence` actually take, the code block under the output is the call your settings amount to, and what you see is drawn fresh every time you press Generate.

<Demo />

## What to try

- Set `language` to `en` and `realism` to `invented`. The names still read as English and stop being names anybody has — the generator builds them out of syllable templates instead of drawing from the pool.
- Leave `language` on `all` and press Generate a few times. Nine scripts, and each name's length range is resolved for its own language rather than for the batch.
- Pick `ru` and switch `gender`. Russian is the one language where the choice is visible from the outside: the patronymic and the surname both inflect.
- On the nickname tab, set `theme` to `animal` and `wordSeparator` to `-`. The separator counts toward the length range, so a narrow range drops the modifier rather than truncating a word.
- Set `maxLength` to `8` on an English nickname. The three-word shapes drop out rather than being truncated — length picks the shape, not the words.
- Turn on `randSuffix`. The token is attached after the nickname is finished, which is why the length options never have to account for it.
- On the words tab, pick a `theme` and press Generate. These are the pools a nickname is built from, handed over with nothing added — `randAnimal` and its twenty-four siblings are this call with the theme already chosen.
- Switch the decorator to `randModifier` on the words tab. A modifier in front of a noun is most of what `randNickname` does, and the code block shows the two functions doing it in the open.
- On the sentence tab, set `language` to `de` and then to `ru`, and turn on the details. Neither language offers an `object` or a `place`: both would put the noun in a case its own ending has to change for, so those shapes are not among the ones they declare.
- Type two words into `include` — `brave lion` in English, `사자 조용히` in Korean. Both land in every sentence, and `brave` becomes a modifier or a predicate depending on what the rest of the shape has room for.
- Set `shape` to `simple` and then to `complex`. The sentence gains a phrase rather than a longer word, which is the same thing `minLength` does one character at a time.

## The scope of this page {#what-this-page-is-not}

This page is a demonstration rather than a generator to call from a browser at scale. The library itself has no network calls and no dependencies, so the same code runs on a server, in a build script or in a test fixture exactly as it runs here.

The output is also **not seeded**. There is no way to ask randino for the same batch twice; if you need reproducibility, keep the strings rather than the settings that produced them.

## Where to go next

- [Getting started](./guide/getting-started) — installing it, for whichever of the three packages you use.
- [`randName`](./name/rand-name), [`randNickname`](./nickname/rand-nickname), [`randWord`](./word/rand-word) and [`randSentence`](./sentence/rand-sentence) — every option in the panel above, written out.
- [Supported languages](./guide/languages) — what each language can and cannot do.
