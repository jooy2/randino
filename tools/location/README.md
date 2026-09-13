# Writing the location datasets

`node tools/location/index.mjs <sources directory>` writes the location datasets of all three packages out of the files each country publishes, then runs `prettier`, `dart format` and `ruff format` over what it wrote.

Every other dataset starts in the JavaScript package and is ported from there. These cannot: they are thousands of real divisions, and the only copy worth trusting is the publisher's. So the publisher's file is the source, and the three packages are written from it at once, which is also why `tools/parity` never finds them apart.

## What a country needs

A country's divisions go in only when its published list comes with no conditions. Every condition on the data passes to everybody who installs the package, so:

- **No attribution.** CC BY, a government licence that asks for the source to be named, or terms that require a notice beside the data all rule a list out.
- **No uncertain terms.** A list whose terms are not stated, or one its publisher describes as internal, stays out.
- **No disputed territory.** A list that settles a sovereignty question, either way, stays out.

That is two countries today. Japan, Spain, Italy and Germany publish complete lists, but under terms that require the source to be named; the rest did not meet all three.

Country names are held to the same conditions and meet them for every country: the list of codes is the tz database's, which is public domain, and the names are Wikidata's, which are CC0. Neither asks for anything, so `randCountry` names all 249 in every word language.

## The files

Save each under the name in the first column. None of them is committed.

| Save as             | Download                                                                                                                                                                                  | Published by                                                          | Terms                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------ |
| `ko-legal-dong.csv` | [data.go.kr 15063424](https://www.data.go.kr/data/15063424/fileData.do), the CSV file                                                                                                     | 국토교통부, `국토교통부_전국 법정동`                                  | 이용허락범위 제한 없음                                       |
| `us-places.txt`     | [`2026_Gaz_place_national.zip`](https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2026_Gazetteer/2026_Gaz_place_national.zip), unzipped                                            | U.S. Census Bureau, 2026 Gazetteer Files                              | U.S. Government work (17 U.S.C. §105)                        |
| `us-states.txt`     | [`national_state2020.txt`](https://www2.census.gov/geo/docs/reference/codes2020/national_state2020.txt)                                                                                   | U.S. Census Bureau, 2020 FIPS codes                                   | U.S. Government work (17 U.S.C. §105)                        |
| `iso3166.tab`       | `iso3166.tab` from the [tz database](https://www.iana.org/time-zones), which macOS and most Linux systems also ship as `/usr/share/zoneinfo/iso3166.tab`                                        | IANA tz database, ISO 3166-1 alpha-2 codes as of ISO/TC 46 N1127      | Public domain                                                |
| `countries.json`    | The query below, sent to `https://query.wikidata.org/sparql` with `Accept: application/sparql-results+json`                                                                               | Wikidata                                                              | CC0                                                          |

The datasets in the repository were written from these, downloaded on 2026-09-13:

| File                          | SHA-256                                                            |
| ----------------------------- | ------------------------------------------------------------------ |
| `ko-legal-dong.csv`           | `e5657d4b53a16f72e42e9c0d91e84ff2d647e70dc56b9408da6fd057d0da45c3` |
| `2026_Gaz_place_national.zip` | `af678e2d990827c89ee39b98c82de6e90b693c7361ff0e559ae3076670dd2863` |
| `us-states.txt`               | `167942161ec455bf7b0ee81b6ad76c109eb65e63136125d3683f8a44f51bbc66` |
| `iso3166.tab`                 | `837c80785080c8433fd9d4ea87e78f161ac7a40389301c5153d4f90198baeb2a` |
| `countries.json`              | `9ba3b5083351431218073e398c1b5f606116381ce7313950d599f67d81422da5` |

The Wikidata query, which is every current ISO 3166-1 alpha-2 statement and the labels in the nine languages:

```sparql
SELECT ?item ?code ?label WHERE {
  ?item p:P297 ?statement .
  ?statement ps:P297 ?code .
  FILTER NOT EXISTS { ?statement pq:P582 ?ended }
  FILTER NOT EXISTS { ?statement wikibase:rank wikibase:DeprecatedRank }
  FILTER NOT EXISTS { ?item wdt:P576 ?dissolved }
  ?item rdfs:label ?label .
  FILTER(LANG(?label) IN ("en", "ko", "ja", "zh-hans", "zh-cn", "zh", "vi", "es", "it", "de", "ru"))
}
```

Wikidata changes every day, so a query run later returns a different file; the checksum is of the copy these datasets were written from.

## What it keeps

**South Korea.** Every row down to 읍·면·동, and none below: a 리 is where the privacy rule stops. The divisions are the legal ones an address is written with, not the administrative ones a community centre serves. Two things in the file are not how an address writes them, and are changed:

- A 시 with 일반구 holds no 읍·면·동 of its own, and the file writes its districts run together (`수원시장안구`). They are written with a space (`수원시 장안구`), and the 시 itself is left out.
- 세종특별자치시 has no 시·군·구, but the file gives it one (`세종시`). Its 읍·면·동 are put directly under the region.

**United States.** Every incorporated place and census designated place in the fifty states and the District of Columbia. Puerto Rico and the Island Areas have their own ISO 3166 codes and are not states. Each name loses the legal description the file appends to it (`Pasadena city` → `Pasadena`, `Indianapolis city (balance)` → `Indianapolis`), a name listed twice in one state is kept once, and the places are sorted within their state. Counties are not kept: an address does not name one, and the current file does not say which county a place is in.

**Countries.** The 249 codes `iso3166.tab` lists, and no others: Wikidata also puts a code on the reserved `AC`, `CP`, `CQ`, `DG`, `EA`, `EZ`, `TA`, `UN` and `XK`, which ISO has not assigned. Each is named by its Wikidata label in each language, simplified Chinese from `zh-hans` first. Three things are decided rather than read:

- Three codes are on two items each, and the country is the one kept: `AQ` is Antarctica rather than the Antarctic Treaty area, `CY` the country rather than the island, `NL` the Netherlands rather than the Kingdom of the Netherlands. Any other code on two items stops the run.
- A label that starts in lower case, the way the name reads mid-sentence (`isola di Man`, `châu Nam Cực`), is written with a capital.
- Jersey has no Vietnamese, Spanish, Italian or German label, and those languages write it `Jersey`, so it is written that way. A missing label in any other language stops the run.

The country a Korean or English location opens on is read out of this table, `KR` and `US`, so the two generators cannot spell it differently.

Names are composed to NFC, so `Utqiaġvik` compares equal to the one a caller types.

The run fails rather than writing anything when a file has changed shape: new columns, an LSAD the table does not know, a 읍·면·동 name with an unexpected character, a 시 that holds neither districts nor 일반구. Each of those is a decision for a person, not for the script.

## The outline

Each dataset carries its divisions as one string, read by `outline` in `_internal/parse`:

```text
# 서울특별시
## 종로구
청운동 신교동 궁정동 효자동
# 세종특별자치시
반곡동 소담동 보람동
```

`#` opens a division at the first level and `##` one at the second. A line without a marker is a pool at the last level, inside the division opened last, with `_` standing for a space the way it does in every other pool. A pool straight after a `#` line skips the levels between, which is how 세종특별자치시 has no 시·군·구.

## After running it

Run each package's suite and `node tools/parity/index.mjs`. The generated files say at the top that they are generated; a change to what they hold is a change here.
