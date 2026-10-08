# Demo

Everything below runs in your browser. The controls are the options `randName`, `randNickname`, `randWord`, `randSentence`, `randLocation`, `randAge`, `randGender`, `randOrganization`, `randDate` and `randPhone` actually take, the code block under the output is the call your settings amount to, and what you see is drawn fresh every time you press Generate.

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
- Leave `randLocation` picked, set `language` to `ko` and turn off `includeCountry`. The country stops opening every line, and `startsWith` on `서` now draws from 서울특별시 rather than matching nothing.
- Pick `randDistrict` and set `language` to `en`. Nothing comes back: a US location stops at the city, and only Korean has a level below it. Leave `language` on `all` and the same call draws Korean alone.
- Pick `randRegion`, set `language` to `ko`, `count` to `20` and turn on `unique`. Sixteen come back, which is every 시·도 there is.
- Pick `randCountry` and set `language` to `ja`, then turn on the details. Every country and territory ISO 3166-1 codes has a name in all nine languages, so this is the one location function that is not held to Korean and English.
- Pick `randCity` with `language` on `ko` and `startsWith` on `수`. A 구 that is one of a city's districts is written with its city, `수원시 장안구`, the way an address writes it.
- On the ages tab, press Generate a few times, then set `distribution` to `uniform`. The first draws mostly people from their twenties to their fifties; the second is as likely to hand back a ninety-year-old as a nine-year-old.
- Set `group` to `senior` and `maxAge` to `40`. No age is both, so the range wins and the ages come from 0 to 40 rather than nothing at all.
- On the genders tab, turn on `includeUnknown` and `includeNonbinary` and set `count` to `50`. Unknown comes up four or five times; non-binary once or not at all, since it is about one draw in a hundred.
- Set `language` to `de` with `includeNonbinary` on. German writes `Divers`, the third option its own forms carry.
- On the organizations tab, set `type` to `company` and switch `language` between `es` and `de`. Spanish puts the business in front of the name and German behind it: the order is the language's template, not the generator's.
- Leave `type` on `all` and pick an `industry`. Only companies come back, because an industry is a company's.
- Set `language` to `ko` and `minLength` to `12`. A Korean organization is usually shorter, so the long kinds are chosen, a company with its legal form or a 종합사회복지관, rather than a short name stretched.
- Turn on the details, set `language` to `ko` and `startsWith` to `해`. The name starts with it even where `주식회사` is written in front.
- On the dates tab, set `minDate` and `maxDate` both to `2024-02`. Every date lands in February 2024 and its last day is the 29th, because a string bound names the whole month rather than its first millisecond.
- Set `unit` to `month`, `count` to `20` and turn on `unique`. Twelve come back, however often you press Generate, since a year has no more.
- Type `YYYY년 M월 D일 A h:mm` into `format`, then `[Day] D` and `Day D`. Text outside brackets is read for tokens, so the last one comes out as something like `5amy 5`: both `D` and `a` are tokens.
- On the phone tab, switch `country` between `KR`, `US` and `RU`. Each writes its numbers its own way: dashes, a bracketed area code, the trunk `8` in front.
- Turn on `includeCountryCode` and set `separator` to `''`. That is E.164, the form an SMS gateway expects — and the detail carries it whatever the other options say. A number like this can by chance be real, so it is for a form under test, not for sending anything to.
- Turn on `fictional` with `country` on `all`. Only US and German numbers come back, `555-01xx` and the Bundesnetzagentur's drama numbers, because those are the two countries that set numbers aside for films and books; pick `KR` and nothing comes back at all, rather than a real number.
- Back on the dates tab, type `dddd, D MMMM YYYY` into `format` and switch `language` to `de`, `ru` and `ko`. The names change and the digits stay; Russian writes its month in the genitive, the way a date needs it.
- Set `utcOffset` to `+09:00` and leave `format` empty. The dates end on `+09:00` rather than `Z`, and setting `minDate` and `maxDate` to the same day keeps every date on that day in Seoul.

## The scope of this page {#what-this-page-is-not}

This page is a demonstration rather than a generator to call from a browser at scale. The library itself has no network calls and no dependencies, so the same code runs on a server, in a build script or in a test fixture exactly as it runs here.

The page draws **without a seed**, so pressing Generate twice gives two different batches. Your own calls do not have to: every generator takes a `random`, and a seeded one hands back the same batch on every run. [Choosing the source](./guide/getting-started#choosing-the-source) shows how.

## Where to go next

- [Getting started](./guide/getting-started) — installing it, for whichever of the three packages you use.
- [`randName`](./name/rand-name), [`randNickname`](./nickname/rand-nickname), [`randWord`](./word/rand-word), [`randSentence`](./sentence/rand-sentence), [`randLocation`](./location/rand-location), [`randAge`](./age/rand-age), [`randGender`](./gender/rand-gender), [`randOrganization`](./organization/rand-organization), [`randDate`](./date/rand-date) and [`randPhone`](./phone/rand-phone) — every option in the panel above, written out.
- [Supported languages](./guide/languages) — what each language can and cannot do.
