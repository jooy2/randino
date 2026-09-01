# Demo

Everything below runs in your browser. The controls are the options `randName` and `randNickname` actually take, the code block under the output is the call your settings amount to, and the numbers you see are drawn fresh every time you press Generate.

<Demo />

## What to try

- Set `language` to `ko` and drag `style` to `100`. The names stay Korean and stop being names anybody has — the generator builds them out of given-name characters instead of drawing from the pool.
- Leave `language` on `all` and press Generate a few times. Nine scripts, and each name's length range is resolved for its own language rather than for the batch.
- Pick `ru` and switch `gender`. Russian is the one language where the choice is visible from the outside: the patronymic and the surname both inflect.
- On the nickname tab, set `baseWord` to `고양이` with no language. The script of the word picks the language, so it never gets an English modifier.
- Set `maxLength` to `3` on a Korean nickname. The three-word shapes drop out rather than being truncated — length picks the shape, not the words.
- Turn on `randSuffix`. The token is attached after the nickname is finished, which is why the length options never have to account for it.

## What this page is not

A generator you should call from a browser at scale — it is a demonstration. The library itself has no network calls and no dependencies, so the same code runs on a server, in a build script or in a test fixture exactly as it runs here.

The output is also **not seeded**. There is no way to ask randino for the same batch twice; if you need reproducibility, keep the strings rather than the settings that produced them.

## Where to go next

- [Getting started](./guide/getting-started) — installing it, for whichever of the three packages you use.
- [`randName`](./name/rand-name) and [`randNickname`](./nickname/rand-nickname) — every option in the panel above, written out.
- [Supported languages](./guide/languages) — what each language can and cannot do.
