# Disclaimer

randino draws its values at random, and some of them will look like real things: a person's name, a company, a phone number in service, a handle somebody already uses. This page says what those values are, what to use them for, and who answers for what happens when they are used. It covers all three packages, the datasets they ship, this documentation site and its [demo](../demo).

## The license comes first {#license}

randino is released under the [MIT License](https://github.com/jooy2/randino/blob/main/LICENSE). The license grants every permission it states, commercial use included, and this page takes none of them away and adds no condition to them. Its warranty disclaimer and its limit on liability apply as written.

This page says the same thing in plainer words, and adds what the license does not mention: what the generated values are and how to treat them. Where the two read differently, the license governs.

## No warranty {#no-warranty}

randino, its datasets and every value it generates are provided "as is", without warranty of any kind, express or implied. Nobody promises that a value is accurate, complete, current, unique or fit for a particular purpose.

- **The real-world data can be wrong or out of date.** Places, country names, operating systems, devices, processors, graphics processors, app stores, file extensions, MIME types and phone numbering plans were taken from public sources at one point in time. Divisions merge, products are renamed and numbering plans open new blocks, and a release does not follow every change.
- **The default random source is not secure.** Each package's default can be predicted from a handful of its outputs. For a token, a code or anything else that guards access, pass a secure source as `random`, as [Choosing the source](./getting-started#choosing-the-source) shows. Even then, whether a value is strong enough for that job is your call.
- **Nothing is checked against the outside world.** randino looks up no register, directory, phone network or trademark database, so it cannot tell you whether a value is taken, in service or protected.

## Any resemblance to reality is a coincidence {#coincidence}

The values are drawn from pools of words and parts and put together at random. None of them is taken from a record about a person, an account or a business. **Any resemblance to a real person, living or dead, or to a real organization, account, phone number or event is a coincidence of the draw and is not intended.** A match does not mean that the value refers to that person or organization, and it does not mean that randino holds any information about them.

For some generators a match is expected rather than rare:

- **Person names.** Given names and surnames are drawn from pools of names in use, so a full name often belongs to one real person, or to thousands. A name built at `realism: 'invented'` can match a real one too.
- **Nicknames.** A handle can already be in use on a game, a website or a social network, or match a brand.
- **Organizations.** The stems are chosen to be nobody's brand, but a generic name such as `Riverside High School` can still match a real school or a small business. See [Names nobody has](../organization/rand-organization#names-nobody-has).
- **Phone numbers.** A number opens on a block the country really gives out, so it can be in service and belong to somebody. See [Using the numbers](../phone/rand-phone#using-the-numbers).
- **Locations.** Every division is real, which is the point of them. A location never goes down to a street or a building, so it is a place and not anybody's address.
- **Sentences.** A sentence written with [`includeName`](../sentence/rand-sentence#a-persons-name) has a generated name in it, and it is not a statement about anybody who carries that name. Words put together at random can also read as rude or awkward in a context nobody planned for.
- **Version numbers.** A drawn version can match a real release of some piece of software.
- **Records built from several generators.** A name, an age, a gender, a location and a phone number drawn side by side can look like one real person's record. They are still separate random values, and the record is fiction.

## Real products and trademarks {#trademarks}

The system generators, such as [`randOs`](../os/rand-os), [`randDevice`](../device/rand-device), [`randCpu`](../cpu/rand-cpu), [`randGpu`](../gpu/rand-gpu) and [`randAppStore`](../appstore/rand-app-store), write real products by the names they were released under. Those names, model names and trademarks belong to their owners. randino is not affiliated with, endorsed by or sponsored by any of them. A product being in a catalog says nothing about its quality, its availability or its specifications, and a release year or a model name in a catalog can be wrong.

Do not use a value in a way that suggests a product is yours, or that its owner endorses you or your work. Before you adopt a generated name, nickname or organization as the real name of a product, a business, a domain or an account, check it yourself against the trademark registers and the services involved. randino searches none of them.

## What it is for {#intended-use}

randino is made for sample data: test fixtures, seed databases, mockups, prototypes, demos, teaching and research. We recommend keeping its values there, and using the library for research and development rather than as a source of data for a commercial product.

That is a recommendation, not a term of the license. The MIT License allows commercial use, and some features, such as a nickname suggested at sign-up, are meant for a running service. When you put generated values into a commercial product or service, a publication, or anywhere people may take them as real, you do so at your own risk, and checking them first is up to you.

Do not treat a generated value as a fact, and do not put one where real data is required: identity, medical, legal, financial or official records.

## Misuse {#misuse}

Do not use randino or anything it generates to:

- impersonate a real person or organization, or create fake identities, accounts or reviews to deceive people or services
- commit fraud, phishing or any other scam, or get past identity checks, verification codes or anti-abuse systems
- call, text, spam or harass anybody, including whoever holds a drawn phone number
- produce documents or records that are presented as genuine
- defame, harass, threaten or discriminate against anyone
- break a law, or the terms of a service you use

The MIT License forbids no use, and this list does not change that. It states what randino is not for. Anyone who uses it this way is solely responsible for doing so, and many of these uses are illegal on their own.

## Your responsibility {#your-responsibility}

You are responsible for how you use randino and what it generates. That includes:

- checking values before other people see them, and removing any that are wrong or out of place where they appear
- following the laws that apply to you, such as those on privacy and personal data, consumer protection, telecommunications, trademarks and defamation
- following the terms of the services you put values into
- dropping a value that turns out to match a real person's information, and never using that match to contact or identify them

## Limitation of liability {#limitation-of-liability}

To the fullest extent the applicable law allows, **no one involved in randino is liable** for any claim, damage, loss or other liability arising from or in connection with the library, its datasets, the values it generates, this documentation, the demo, or their use. That covers direct, indirect, incidental, special, consequential and punitive damages, whether the claim is in contract, tort or otherwise. "No one involved" means the copyright holder (CDGet), the authors, the contributors, the maintainers and anyone acting for them.

This holds in every case, including when:

- a generated value matches a real person, organization, account, phone number, trademark or event
- a value is inaccurate, out of date or unfit for what it was used for
- you or a third party misuses the library or a value it generated
- a value that was meant to be unpredictable is predicted
- a dispute arises with a person, a rights holder or an authority over a generated value

It holds even when someone involved was told that such a loss was possible. Where a law does not allow a liability to be excluded or limited, it is limited to the least that law allows.

## Reporting a problem {#reporting-a-problem}

If a pool keeps producing something it should not, such as a well-known brand or an offensive word, or a real-world dataset is wrong, [open an issue](https://github.com/jooy2/randino/issues). A word taken out of a pool is gone from the next release, but not from versions already published. The issue tracker is public, so do not put anybody's personal information in an issue.

## Changes to this page {#changes}

This page can change without notice. The version on this site is the current one.
