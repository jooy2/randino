# Sentences

[`randSentence`](./rand-sentence) writes a whole statement rather than a name or a handle: a subject, and something said about it. This page is how it decides what may stand where. For the options themselves, see the [reference page](./rand-sentence).

## How the verb picks the nouns {#the-words-of-one-sentence-belong-together}

What keeps the words of one sentence together is the verb. Every verb states which kinds of noun can do it, and, when it is transitive, which kinds it can be done to. The nouns are then drawn from those alone.

So `여우가 사과를 먹는다` is a sentence the generator can build and `여우가 철학을 먹는다` is not: `먹는다` accepts something edible and nothing else.

No noun carries a tag for this. The twenty-five [themes](../word/themes) already say what a word is, so each theme maps to one **noun class**, the same way in every language:

| Class      | Themes                                                  |
| ---------- | ------------------------------------------------------- |
| `creature` | `animal`, `myth`                                        |
| `person`   | `job`                                                   |
| `plant`    | `plant`                                                 |
| `edible`   | `food`, `drink`                                         |
| `thing`    | `object`, `tool`, `clothing`, `product`, `gem`, `music` |
| `vehicle`  | `vehicle`                                               |
| `place`    | `place`, `nature`, `space`                              |
| `event`    | `weather`, `sport`, `time`                              |
| `idea`     | `concept`, `emotion`, `finance`, `tech`, `color`        |
| `body`     | `body`                                                  |

A verb that says `creature` and `person` can be done by a lion and by a locksmith, and by nothing else. That is the whole mechanism, and it is why the sentences read as sentences rather than as filled-in templates.

It is not a promise that every sentence means something. A lion can bake a pudding here, and an ocarina can glitter at dusk. What the classes rule out is the sentence that does not parse as a thought at all.

## The shapes each language declares {#the-shapes-belong-to-the-language}

Every language writes out the shapes its own grammar allows, in its own word order, with the particle or preposition each phrase needs. Korean closes on its verb, English puts it second, and Chinese frames the action before it:

| Language | A sentence                                          |
| -------- | --------------------------------------------------- |
| Korean   | `검은 고양이가 숲에서 잠잔다.`                      |
| Japanese | `ハンバーガーが暗礁で冷める。`                      |
| Chinese  | `巨乌贼又品尝朱红椰汁。`                            |
| English  | `The angler cleans the towel in the ivory balcony.` |
| German   | `Im Frühling blüht eine Chrysantheme noch.`         |

Two consequences follow.

First, a language declares only what it can write correctly. German has no shape with an object and Russian none with a place, because both would put the noun in a case its own ending has to change for, and the pools hold one form of each word. A request neither can answer falls back to the closest shape they do have, and with no `language` the ones that can answer are preferred.

Second, a particle belongs to the phrase rather than to the sentence. Korean picks between `가` and `이` by whether the word in front of it closes on a consonant, so `사자가` and `사슴이` come out right without either particle being stored twice. Italian picks between `l'`, `lo` and `il` by the sound the noun opens on. German writes its verb second, so a shape that opens on a time puts the subject behind it: `Am Morgen schläft ein Wolf.`

## Length and the shape {#length-picks-the-shape}

`minLength` and `maxLength` bound the whole sentence, punctuation included. The shapes that cannot land inside the range are dropped first, and each phrase is then drawn against the room left once the phrases behind it have reserved their shortest.

So a narrow range drops a modifier rather than truncating a word, and a wide one puts modifiers back. [`sentenceLengthRange`](./sentence-length-range) reports what a language can produce with no bounds at all.

`shape` is the same idea in coarser units, counting phrases rather than characters. It is usually what a caller means by a short or a long sentence.

## What `realism` reaches {#what-realism-changes-and-what-it-does-not}

`realism` decides where the words come from. At `'invented'` the nouns and modifiers are built from the language's own sounds, and the grammar around them does not move: the particles, the articles, the agreement and the shapes are the language's at every level.

So the vocabulary of `수줍은 노오가 안개 파저멜을 챙긴다.` is not Korean, while its grammar is.

## Where a sentence differs from a nickname

[`randNickname`](../nickname/rand-nickname) puts words beside each other; a sentence says something about one of them. Three things follow:

- A nickname runs its words together on purpose (`멋진사자`); a sentence writes the spaces the language writes.
- A nickname has no verb, so it never has to agree with anything. A sentence's predicate does.
- `randNickname` takes a `wordSeparator`, because a handle is a string somebody types. A sentence has none — the spacing is the language's.

They share the pools, and nothing else.

## See also

- [`randSentence`](./rand-sentence) — every option, written out.
- [`sentenceLengthRange`](./sentence-length-range) — the range the bounds default to.
- [Nicknames](../nickname/) — the other generator built on the same words.
