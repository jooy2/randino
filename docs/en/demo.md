# Demo

Everything below runs in your browser. The controls are the options `randName`, `randNickname`, `randWord`, `randSentence` and `randLocation` actually take, the code block under the output is the call your settings amount to, and what you see is drawn fresh every time you press Generate.

<Demo />

## What to try

- Set `language` to `en` and `realism` to `invented`. The names still read as English and stop being names anybody has — the generator builds them out of syllable templates instead of drawing from the pool.
- Leave `language` on `all` and press Generate a few times. Nine scripts, and each name's length range is resolved for its own language rather than for the batch.
- Pick `ru` and switch `gender`. Russian is the one language where the choice is visible from the outside: the patronymic and the surname both inflect.
- On the nickname tab, set `theme` to `animal` and `wordSeparator` to `-`. The separator counts toward the length range, so a narrow range drops the modifier rather than truncating a word.
- Set `maxLength` to `8` on an English nickname. The three-word shapes drop out rather than being truncated — length picks the shape, not the words.
- Turn on `randSuffix`. The token is attached after the nickname is finished, which is why the length options never have to account for it.
- On the words tab, pick a `theme` and press Generate. These are the pools a nickname is built from, handed over with nothing added — `randAnimal` and its twenty-eight siblings are this call with the theme already chosen.
- Switch the decorator to `randModifier` on the words tab. A modifier in front of a noun is most of what `randNickname` does, and the code block shows the two functions doing it in the open.
- On the sentence tab, set `language` to `de` and then to `ru`, and turn on the details. Neither language offers an `object` or a `place`: both would put the noun in a case its own ending has to change for, so those shapes are not among the ones they declare.
- Type two words into `include` — `brave lion` in English, `사자 조용히` in Korean. Both land in every sentence, and `brave` becomes a modifier or a predicate depending on what the rest of the shape has room for.
- Set `shape` to `simple` and then to `complex`. The sentence gains a phrase rather than a longer word, which is the same thing `minLength` does one character at a time.
- On the locations tab, turn on the details and press Generate a few times. Every district sits inside the city beside it and every city inside its region, because each is one the country publishes rather than a name put together.
- Pick `randDistrict` and set `language` to `en`. Nothing comes back: a US location stops at the city, and only Korean has a level below it. Leave `language` on `all` and the same call draws Korean alone.
- Pick `randRegion`, set `language` to `ko`, `count` to `20` and turn on `unique`. Sixteen come back, which is every 시·도 there is.
- Pick `randCountry` and set `language` to `ja`, then turn on the details. Every country and territory ISO 3166-1 codes has a name in all nine languages, so this is the one location function that is not held to Korean and English.
- Pick `randCity` with `language` on `ko` and `startsWith` on `수`. A 구 that is one of a city's districts is written with its city, `수원시 장안구`, the way an address writes it.

## The scope of this page {#what-this-page-is-not}

This page is a demonstration rather than a generator to call from a browser at scale. The library itself has no network calls and no dependencies, so the same code runs on a server, in a build script or in a test fixture exactly as it runs here.

The page draws **without a seed**, so pressing Generate twice gives two different batches. Your own calls do not have to: every generator takes a `random`, and a seeded one hands back the same batch on every run. [Choosing the source](./guide/getting-started#choosing-the-source) shows how.

## Where to go next

- [Getting started](./guide/getting-started) — installing it, for whichever of the three packages you use.
- [`randName`](./name/rand-name), [`randNickname`](./nickname/rand-nickname), [`randWord`](./word/rand-word), [`randSentence`](./sentence/rand-sentence) and [`randLocation`](./location/rand-location) — every option in the panel above, written out.
- [Supported languages](./guide/languages) — what each language can and cannot do.
