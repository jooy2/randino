# randOrganization

Generates the names of organizations that do not exist and returns `count` of them as strings: companies, schools, government offices, public institutions and associations, each written the way its language writes that kind of organization. A company may carry its legal form, `Inc.`, `(주)` or `GmbH`. With [`output: 'detail'`](#the-detail-output) it reports the pieces each name was built from.

::: lang js

```javascript
import { randOrganization } from 'randino';

randOrganization({ language: 'ko', count: 3 });
// ['(주)가람에너지', '윤슬교육지원청', '새솔홀딩스']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randOrganization(language: WordLanguage.ko, count: 3);
// [(주)가람에너지, 윤슬교육지원청, 새솔홀딩스]
```

:::

::: lang py

```python
from randino import rand_organization

rand_organization(language="ko", count=3)
# ['(주)가람에너지', '윤슬교육지원청', '새솔홀딩스']
```

:::

## Options

Every option is optional, and the defaults are what a call with nothing in it uses.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | <Lang js="WordLanguageOption" dart="WordLanguage?" py="WordLanguageOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | Language of the organizations. <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> picks one per result. |
| `type` | <Lang js="OrganizationTypeOption" dart="Set&lt;OrganizationType&gt;?" py="OrganizationTypeOption &#124; None" code /> | <Lang js="'all'" dart="null" py="None" code /> | Which [kinds](#kinds) of organization. Left out, a kind is drawn per result, companies most often. |
| `industry` | <Lang js="OrganizationIndustryOption" dart="OrganizationIndustry?" py="OrganizationIndustryOption" code /> | <Lang js="'all'" dart="null" py="&quot;all&quot;" code /> | What the companies do. See [industries](#industries). |
| <Lang js="includeLegalForm" dart="includeLegalForm" py="include_legal_form" code /> | <Lang js="boolean" dart="bool?" py="bool &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Write a company's [legal form](#legal-forms). Left out, it is decided per company. |
| `count` | <Lang js="number" dart="int" py="int" code /> | `1` | How many organizations to return. Clamped to `0` … `10000`. |
| `realism` | `RandRealism` | <Lang js="`'real'`" dart="`RandRealism.real`" py="`\"real\"`" /> | Whether the [stem](#names-nobody-has) is one the data holds or one invented to read like the language. `mixed` decides per result. |
| <Lang js="minLength" dart="minLength" py="min_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _no bound_ | Minimum length of the whole organization, legal form and all. |
| <Lang js="maxLength" dart="maxLength" py="max_length" code /> | <Lang js="number" dart="int?" py="int &#124; None" code /> | _no bound_ | Maximum length of the whole organization. Clamped to `60`. |
| <Lang js="startsWith" dart="startsWith" py="starts_with" code /> | <Lang js="string" dart="String?" py="str" code /> | <Lang js="—" dart="null" py="&quot;&quot;" code /> | Keep only organizations whose name starts with this character. A legal form written in front of the name is not where the name starts. |
| `unique` | <Lang js="boolean" dart="bool" py="bool" code /> | <Lang js="false" dart="false" py="False" code /> | Never return the same organization twice. |
| `output` | <Lang js="RandOutput" py="RandOutput" code /> | <Lang js="'value'" py="&quot;value&quot;" code /> | Strings, or an `OrganizationDetail` per organization. Dart has no such parameter — see [the detail output](#the-detail-output). |
| `random` | <Lang js="() => number" dart="Random?" py="Callable[[], float] &#124; None" code /> | <Lang js="—" dart="null" py="None" code /> | Where the randomness comes from — see [Choosing the source](../guide/getting-started#choosing-the-source). Defaults to the platform's ordinary generator. |

## Kinds of organization {#kinds}

`type` is one kind, or several to draw from. Left out, every kind is in play, and companies come up most often:

| Kind         | Share | Korean           | English                       |
| ------------ | ----: | ---------------- | ----------------------------- |
| `company`    |   40% | `(주)새솔테크`   | `Greenbriar Logistics Corp.`  |
| `school`     |   20% | `가람초등학교`   | `Oak Hollow University`       |
| `nonprofit`  |   15% | `새솔장학재단`   | `Lakemont Historical Society` |
| `public`     |   15% | `해솔시립도서관` | `Oakmont Public Library`      |
| `government` |   10% | `윤슬교육지원청` | `Westbrook Police Department` |

A `public` institution is one run for the public that is not an office: a library, a hospital, a museum, a transit authority. A `nonprofit` is an association, a foundation or a club.

::: lang js

```javascript
randOrganization({ language: 'de', type: ['school', 'public'], count: 3 });
// ['Gymnasium Eschenhain', 'Berufsschule Rabenstein', 'Stadtbibliothek Tannenhof']
```

:::

::: lang dart

```dart
randOrganization(
  language: WordLanguage.de,
  type: {OrganizationType.school, OrganizationType.public},
  count: 3,
);
// [Gymnasium Eschenhain, Berufsschule Rabenstein, Stadtbibliothek Tannenhof]
```

:::

::: lang py

```python
rand_organization(language="de", type=("school", "public"), count=3)
# ['Gymnasium Eschenhain', 'Berufsschule Rabenstein', 'Stadtbibliothek Tannenhof']
```

:::

Each language writes each kind in its own order and its own words. A Spanish company puts its business in front of its name (`Construcciones Valdecastro`) and a German one behind it (`Bergtal Bau`); a Chinese company opens on the city it is registered in (`重庆恒远仓储有限责任公司`); a Russian school, polyclinic or fire station is known by its number (`Гимназия № 135`); a German association writes `e.V.` as part of its name (`Heimatverein Bergtal e.V.`).

## Industries {#industries}

`industry` is what a company does, and it is written into the name as a word for that business:

| Industry        | English                  | Korean         |
| --------------- | ------------------------ | -------------- |
| `tech`          | Technologies, Software   | 테크, 정보통신 |
| `manufacturing` | Manufacturing, Precision | 정밀, 기계     |
| `food`          | Foods, Bakery            | 식품, 제과     |
| `retail`        | Trading, Mercantile      | 유통, 상사     |
| `finance`       | Capital, Investments     | 캐피탈, 투자   |
| `construction`  | Construction, Builders   | 건설, 건축     |
| `logistics`     | Logistics, Freight       | 물류, 운송     |
| `media`         | Media, Studios           | 미디어, 출판   |
| `health`        | Pharmaceuticals, Medical | 제약, 바이오   |
| `energy`        | Energy, Solar            | 에너지, 전력   |

An industry is a company's, so naming one with `type` left out asks for companies. With `type` naming other kinds as well, it narrows the companies among them and leaves the rest alone.

::: lang js

```javascript
randOrganization({ language: 'en', industry: 'logistics', count: 3 });
// ['Greenbriar Logistics Corp.', 'Larkspur Courier, Inc.', 'Elmwood Courier LLC']
```

:::

::: lang dart

```dart
randOrganization(language: WordLanguage.en, industry: OrganizationIndustry.logistics, count: 3);
// [Greenbriar Logistics Corp., Larkspur Courier, Inc., Elmwood Courier LLC]
```

:::

::: lang py

```python
rand_organization(language="en", industry="logistics", count=3)
# ['Greenbriar Logistics Corp.', 'Larkspur Courier, Inc.', 'Elmwood Courier LLC']
```

:::

With no industry asked for, a company draws one of the ten, except that one in four carries a word that says nothing about its business (`Holdings`, `그룹`, `集团`) and one in five is its name and a legal form and nothing else (`Larkspur, Inc.`). Neither of those reports an industry.

## Legal forms {#legal-forms}

A company may carry the legal form its language writes, in front of the name or behind it:

| Code | Legal forms                                                    |
| ---- | -------------------------------------------------------------- |
| `en` | `Inc.`, `LLC`, `Corp.`, `Co.`, `Ltd.`                          |
| `ko` | `주식회사`, `(주)`, `유한회사`                                 |
| `ja` | `株式会社`, `有限会社`, `合同会社`                             |
| `zh` | `有限公司`, `股份有限公司`, `有限责任公司`                     |
| `vi` | `Công ty TNHH`, `Công ty Cổ phần`, `Công ty TNHH MTV`          |
| `es` | `S.A.`, `S.L.`, `S.A. de C.V.`                                 |
| `it` | `S.r.l.`, `S.p.A.`, `S.n.c.`, `S.a.s.`                         |
| `de` | `GmbH`, `AG`, `GmbH & Co. KG`, `KG`, `UG (haftungsbeschränkt)` |
| `ru` | `ООО`, `АО`, `ПАО`                                             |

Left out, <Lang js="includeLegalForm" dart="includeLegalForm" py="include_legal_form" code /> is a coin flip per company. Turned on, every company carries one; turned off, none does, and a company named by its stem alone stops coming up, since a bare stem is not recognizably a company. Only a company ever carries a legal form.

::: lang js

```javascript
randOrganization({ language: 'ja', type: 'company', includeLegalForm: true, count: 3 });
// ['有限会社東雲キャピタル', '株式会社翔栄', '合同会社若葉乳業']
```

:::

::: lang dart

```dart
randOrganization(
  language: WordLanguage.ja,
  type: {OrganizationType.company},
  includeLegalForm: true,
  count: 3,
);
// [有限会社東雲キャピタル, 株式会社翔栄, 合同会社若葉乳業]
```

:::

::: lang py

```python
rand_organization(language="ja", type="company", include_legal_form=True, count=3)
# ['有限会社東雲キャピタル', '株式会社翔栄', '合同会社若葉乳業']
```

:::

## Names nobody has {#names-nobody-has}

Every organization is put together from parts, so none of them is a real one. The stem — the part that is the organization's own, `새솔` in `새솔테크` — comes from a list per language chosen to be nobody's brand: none of them is the name of a well-known company, alone or with a word for its business behind it. A company is never named after a person either, because a surname with a legal form behind it is exactly how many famous companies are named, and a generator drawing surnames would write some of them.

A generic name can still match a small real business or a school somewhere, the way `Riverside High School` is the name of hundreds of schools. If that matters, `realism: 'invented'` builds the stem from the language's own sounds instead — `Caiwi, Inc.`, `솔람테크` — so the name reads like the language without being any of its words. A first character no stem in the list starts with is answered with an invented stem that does, whatever `realism` is.

## Length {#length}

<Lang js="minLength" dart="minLength" py="min_length" code /> and <Lang js="maxLength" dart="maxLength" py="max_length" code /> describe the whole organization, legal form and all, and have no bound until you set one. The shapes that cannot land inside the range are set aside before one is chosen, so asking a Korean organization for twelve characters or more writes a longer kind (`주식회사 은빛그린에너지`) rather than stretching a short one. A range nothing reaches is answered with the closest organization there is. The ceiling is `60`, because the longest names run past forty characters (`Công ty TNHH MTV Giải pháp Công nghệ Thịnh Vượng`).

## The detail output {#the-detail-output}

::: lang js

```javascript
randOrganization({ language: 'ko', type: 'company', includeLegalForm: true, output: 'detail' });
// [{ organization: '(주)새솔테크', name: '새솔테크', legalForm: '(주)',
//    type: 'company', industry: 'tech', language: 'ko' }]
```

:::

::: lang dart

```dart
randOrganizationDetails(language: WordLanguage.ko, type: {OrganizationType.company}).first;
// OrganizationDetail((주)새솔테크, 새솔테크, (주), company, tech, ko)
```

Dart has neither overloads nor union types, so the detail form is its own function. It takes the same parameters as `randOrganization`.

:::

::: lang py

```python
rand_organization(language="ko", type="company", include_legal_form=True, output="detail")
# [OrganizationDetail(organization='(주)새솔테크', name='새솔테크', legal_form='(주)',
#                     type='company', industry='tech', language='ko')]
```

:::

| Field | Type | Description |
| --- | --- | --- |
| `organization` | <Lang js="string" dart="String" py="str" code /> | The whole name, as the value form returns it. |
| `name` | <Lang js="string" dart="String" py="str" code /> | The name without its legal form, which is what a sign or a list usually shows. |
| <Lang js="legalForm" dart="legalForm" py="legal_form" code /> | <Lang js="string &#124; null" dart="String?" py="str &#124; None" code /> | The legal form on its own, or <Lang js="null" dart="null" py="None" code /> for none. |
| `type` | `OrganizationType` | The kind of organization. |
| `industry` | <Lang js="OrganizationIndustry &#124; null" dart="OrganizationIndustry?" py="OrganizationIndustry &#124; None" code /> | The industry the name says the company is in, or <Lang js="null" dart="null" py="None" code /> when it says none, or the organization is not a company. |
| `language` | `WordLanguage` | The language the organization is written in. |

## See also

- [`randName`](../name/rand-name) — a person to work there.
- [`randLocation`](../location/rand-location) — a real place for it to be in.
