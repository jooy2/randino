# Constants

The lists the generators accept, and the hard bounds every numeric option is clamped to. Nothing here throws: a `count` of `-10` returns nothing and a `count` of a million returns ten thousand.

## Shared bounds

Every generator counts, clamps and deduplicates the same way, so the bounds are one set rather than one per generator.

::: lang js

```javascript
import {
	RAND_AGE_MAX,
	RAND_COUNT_MAX,
	RAND_LENGTH_MAX,
	RAND_LENGTH_MIN,
	RAND_LOCATION_LENGTH_MAX,
	RAND_ORGANIZATION_LENGTH_MAX,
	RAND_SENTENCE_LENGTH_MAX
} from 'randino';
```

| Name                           | Type     | Value   |
| ------------------------------ | -------- | ------- |
| `RAND_LENGTH_MIN`              | `number` | `1`     |
| `RAND_LENGTH_MAX`              | `number` | `40`    |
| `RAND_SENTENCE_LENGTH_MAX`     | `number` | `200`   |
| `RAND_LOCATION_LENGTH_MAX`     | `number` | `100`   |
| `RAND_ORGANIZATION_LENGTH_MAX` | `number` | `60`    |
| `RAND_AGE_MAX`                 | `number` | `120`   |
| `RAND_COUNT_MAX`               | `number` | `10000` |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| Name                        | Type  | Value   |
| --------------------------- | ----- | ------- |
| `randLengthMin`             | `int` | `1`     |
| `randLengthMax`             | `int` | `40`    |
| `randSentenceLengthMax`     | `int` | `200`   |
| `randLocationLengthMax`     | `int` | `100`   |
| `randOrganizationLengthMax` | `int` | `60`    |
| `randAgeMax`                | `int` | `120`   |
| `randCountMax`              | `int` | `10000` |

:::

::: lang py

```python
from randino import (
    RAND_AGE_MAX,
    RAND_COUNT_MAX,
    RAND_LENGTH_MAX,
    RAND_LENGTH_MIN,
    RAND_LOCATION_LENGTH_MAX,
    RAND_ORGANIZATION_LENGTH_MAX,
    RAND_SENTENCE_LENGTH_MAX,
)
```

| Name                           | Type  | Value   |
| ------------------------------ | ----- | ------- |
| `RAND_LENGTH_MIN`              | `int` | `1`     |
| `RAND_LENGTH_MAX`              | `int` | `40`    |
| `RAND_SENTENCE_LENGTH_MAX`     | `int` | `200`   |
| `RAND_LOCATION_LENGTH_MAX`     | `int` | `100`   |
| `RAND_ORGANIZATION_LENGTH_MAX` | `int` | `60`    |
| `RAND_AGE_MAX`                 | `int` | `120`   |
| `RAND_COUNT_MAX`               | `int` | `10000` |

:::

The length options are clamped into `1 … 40`, counted in characters of what the generator returns, except on `randSentence`, whose ceiling is `200`, on the location generators, whose ceiling is `100`, and on `randOrganization`, whose ceiling is `60`. A sentence is many words where a name, a word and a nickname are at most three, a location is every level of it written out at once, and an organization is a name, a word for its business and a legal form. `randAge` takes no length and clamps its ages into `0 … 120` instead, and `randDate` clamps its range into the years 1 to 9999. `count` is clamped into `0 … 10000`, because an unbounded count with `unique` on can spend a long time re-drawing from an exhausted pool.

## Names

::: lang js

```javascript
import { NAME_LANGUAGES } from 'randino';
```

| Name             | Type             | Value                         |
| ---------------- | ---------------- | ----------------------------- |
| `NAME_LANGUAGES` | `NameLanguage[]` | Every supported name language |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| Name            | Type                 | Value                         |
| --------------- | -------------------- | ----------------------------- |
| `nameLanguages` | `List<NameLanguage>` | Every supported name language |

:::

::: lang py

```python
from randino import NAME_LANGUAGES
```

| Name             | Type                     | Value                         |
| ---------------- | ------------------------ | ----------------------------- |
| `NAME_LANGUAGES` | `tuple[NameLanguage, …]` | Every supported name language |

:::

## Nicknames

::: lang js

```javascript
import { WORD_LANGUAGES, WORD_THEMES } from 'randino';
```

| Name             | Type             | Value                             |
| ---------------- | ---------------- | --------------------------------- |
| `WORD_LANGUAGES` | `WordLanguage[]` | Every supported nickname language |
| `WORD_THEMES`    | `WordTheme[]`    | All twenty-nine themes            |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| Name            | Type                 | Value                             |
| --------------- | -------------------- | --------------------------------- |
| `wordLanguages` | `List<WordLanguage>` | Every supported nickname language |
| `wordThemes`    | `List<WordTheme>`    | All twenty-nine themes            |

:::

::: lang py

```python
from randino import WORD_LANGUAGES, WORD_THEMES
```

| Name             | Type                     | Value                             |
| ---------------- | ------------------------ | --------------------------------- |
| `WORD_LANGUAGES` | `tuple[WordLanguage, …]` | Every supported nickname language |
| `WORD_THEMES`    | `tuple[WordTheme, …]`    | All twenty-nine themes            |

:::

## Locations

::: lang js

```javascript
import { LOCATION_LANGUAGES, LOCATION_LEVELS } from 'randino';
```

| Name                 | Type                 | Value                                       |
| -------------------- | -------------------- | ------------------------------------------- |
| `LOCATION_LANGUAGES` | `LocationLanguage[]` | `['en', 'ko']`                              |
| `LOCATION_LEVELS`    | `LocationLevel[]`    | `['country', 'region', 'city', 'district']` |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| Name                | Type                     | Value                             |
| ------------------- | ------------------------ | --------------------------------- |
| `locationLanguages` | `List<LocationLanguage>` | Every supported location language |
| `locationLevels`    | `List<LocationLevel>`    | Every level, largest first        |

:::

::: lang py

```python
from randino import LOCATION_LANGUAGES, LOCATION_LEVELS
```

| Name | Type | Value |
| --- | --- | --- |
| `LOCATION_LANGUAGES` | `tuple[LocationLanguage, …]` | `('en', 'ko')` |
| `LOCATION_LEVELS` | `tuple[LocationLevel, …]` | `('country', 'region', 'city', 'district')` |

:::

## Ages

::: lang js

```javascript
import { AGE_GROUPS } from 'randino';
```

| Name         | Type         | Value                                  |
| ------------ | ------------ | -------------------------------------- |
| `AGE_GROUPS` | `AgeGroup[]` | `['child', 'teen', 'adult', 'senior']` |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| Name        | Type             | Value                       |
| ----------- | ---------------- | --------------------------- |
| `ageGroups` | `List<AgeGroup>` | Every group, youngest first |

:::

::: lang py

```python
from randino import AGE_GROUPS
```

| Name         | Type                 | Value                                  |
| ------------ | -------------------- | -------------------------------------- |
| `AGE_GROUPS` | `tuple[AgeGroup, …]` | `('child', 'teen', 'adult', 'senior')` |

:::

The ages each group covers are on the [`randAge`](../age/rand-age#groups) page.

## Dates

::: lang js

```javascript
import { DATE_UNITS } from 'randino';
```

| Name | Type | Value |
| --- | --- | --- |
| `DATE_UNITS` | `DateUnit[]` | `['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond']` |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| Name        | Type             | Value                     |
| ----------- | ---------------- | ------------------------- |
| `dateUnits` | `List<DateUnit>` | Every unit, largest first |

:::

::: lang py

```python
from randino import DATE_UNITS
```

| Name | Type | Value |
| --- | --- | --- |
| `DATE_UNITS` | `tuple[DateUnit, …]` | `('year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond')` |

:::

What each unit returns is on the [`randDate`](../date/rand-date#units) page.

## Phone numbers

::: lang js

```javascript
import { PHONE_COUNTRIES, PHONE_TYPES } from 'randino';
```

| Name              | Type             | Value                                                    |
| ----------------- | ---------------- | -------------------------------------------------------- |
| `PHONE_COUNTRIES` | `PhoneCountry[]` | `['US', 'KR', 'JP', 'CN', 'VN', 'ES', 'IT', 'DE', 'RU']` |
| `PHONE_TYPES`     | `PhoneType[]`    | `['mobile', 'landline']`                                 |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| Name             | Type                 | Value                                          |
| ---------------- | -------------------- | ---------------------------------------------- |
| `phoneCountries` | `List<PhoneCountry>` | Every country, in the order of `wordLanguages` |
| `phoneTypes`     | `List<PhoneType>`    | `mobile`, then `landline`                      |

:::

::: lang py

```python
from randino import PHONE_COUNTRIES, PHONE_TYPES
```

| Name | Type | Value |
| --- | --- | --- |
| `PHONE_COUNTRIES` | `tuple[PhoneCountry, …]` | `('US', 'KR', 'JP', 'CN', 'VN', 'ES', 'IT', 'DE', 'RU')` |
| `PHONE_TYPES` | `tuple[PhoneType, …]` | `('mobile', 'landline')` |

:::

How each country writes its numbers is on the [`randPhone`](../phone/rand-phone#countries) page.

## System

::: lang js

```javascript
import { DEVICE_TYPES, DISK_TYPES, DISK_UNITS, RAM_UNITS, SYSTEM_PLATFORMS } from 'randino';
```

| Name               | Type               | Value                                   |
| ------------------ | ------------------ | --------------------------------------- |
| `SYSTEM_PLATFORMS` | `SystemPlatform[]` | `['desktop', 'mobile']`                 |
| `DEVICE_TYPES`     | `DeviceType[]`     | `['phone', 'tablet', 'laptop']`         |
| `RAM_UNITS`        | `RamUnit[]`        | `['MB', 'GB']`                          |
| `DISK_TYPES`       | `DiskType[]`       | `['hdd', 'ssd', 'sshd', 'emmc', 'ufs']` |
| `DISK_UNITS`       | `DiskUnit[]`       | `['MB', 'GB', 'TB']`                    |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| Name              | Type                   | Value                                    |
| ----------------- | ---------------------- | ---------------------------------------- |
| `systemPlatforms` | `List<SystemPlatform>` | `desktop`, then `mobile`                 |
| `deviceTypes`     | `List<DeviceType>`     | `phone`, `tablet`, then `laptop`         |
| `ramUnits`        | `List<RamUnit>`        | `mb`, then `gb`                          |
| `diskTypes`       | `List<DiskType>`       | `hdd`, `ssd`, `sshd`, `emmc`, then `ufs` |
| `diskUnits`       | `List<DiskUnit>`       | `mb`, `gb`, then `tb`                    |

:::

::: lang py

```python
from randino import DEVICE_TYPES, DISK_TYPES, DISK_UNITS, RAM_UNITS, SYSTEM_PLATFORMS
```

| Name               | Type                       | Value                                   |
| ------------------ | -------------------------- | --------------------------------------- |
| `SYSTEM_PLATFORMS` | `tuple[SystemPlatform, …]` | `('desktop', 'mobile')`                 |
| `DEVICE_TYPES`     | `tuple[DeviceType, …]`     | `('phone', 'tablet', 'laptop')`         |
| `RAM_UNITS`        | `tuple[RamUnit, …]`        | `('MB', 'GB')`                          |
| `DISK_TYPES`       | `tuple[DiskType, …]`       | `('hdd', 'ssd', 'sshd', 'emmc', 'ufs')` |
| `DISK_UNITS`       | `tuple[DiskUnit, …]`       | `('MB', 'GB', 'TB')`                    |

:::

Which kind of machine each platform covers is on the [`randOs`](../os/rand-os#catalog) page, and what each device type holds on the [`randDevice`](../device/rand-device#catalog) page.

## Organizations

::: lang js

```javascript
import { ORGANIZATION_INDUSTRIES, ORGANIZATION_TYPES } from 'randino';
```

| Name | Type | Value |
| --- | --- | --- |
| `ORGANIZATION_TYPES` | `OrganizationType[]` | `['company', 'nonprofit', 'school', 'government', 'public']` |
| `ORGANIZATION_INDUSTRIES` | `OrganizationIndustry[]` | All ten industries |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| Name                     | Type                         | Value                        |
| ------------------------ | ---------------------------- | ---------------------------- |
| `organizationTypes`      | `List<OrganizationType>`     | Every kind, a business first |
| `organizationIndustries` | `List<OrganizationIndustry>` | All ten industries           |

:::

::: lang py

```python
from randino import ORGANIZATION_INDUSTRIES, ORGANIZATION_TYPES
```

| Name | Type | Value |
| --- | --- | --- |
| `ORGANIZATION_TYPES` | `tuple[OrganizationType, …]` | `('company', 'nonprofit', 'school', 'government', 'public')` |
| `ORGANIZATION_INDUSTRIES` | `tuple[OrganizationIndustry, …]` | All ten industries |

:::

## Affixes

::: lang js

```javascript
import {
	AFFIX_CHARSET,
	AFFIX_LENGTH_DEFAULT,
	AFFIX_LENGTH_MAX,
	AFFIX_SEPARATOR_DEFAULT
} from 'randino';
```

| Name                      | Type     | Value                        |
| ------------------------- | -------- | ---------------------------- |
| `AFFIX_LENGTH_DEFAULT`    | `number` | `5`                          |
| `AFFIX_LENGTH_MAX`        | `number` | `32`                         |
| `AFFIX_SEPARATOR_DEFAULT` | `string` | `'_'`                        |
| `AFFIX_CHARSET`           | `string` | The default token characters |

:::

::: lang dart

```dart
import 'package:randino/randino.dart';
```

| Name                    | Type     | Value                        |
| ----------------------- | -------- | ---------------------------- |
| `affixLengthDefault`    | `int`    | `5`                          |
| `affixLengthMax`        | `int`    | `32`                         |
| `affixSeparatorDefault` | `String` | `'_'`                        |
| `affixCharset`          | `String` | The default token characters |

:::

::: lang py

```python
from randino import (
    AFFIX_CHARSET,
    AFFIX_LENGTH_DEFAULT,
    AFFIX_LENGTH_MAX,
    AFFIX_SEPARATOR_DEFAULT,
)
```

| Name                      | Type  | Value                        |
| ------------------------- | ----- | ---------------------------- |
| `AFFIX_LENGTH_DEFAULT`    | `int` | `5`                          |
| `AFFIX_LENGTH_MAX`        | `int` | `32`                         |
| `AFFIX_SEPARATOR_DEFAULT` | `str` | `"_"`                        |
| `AFFIX_CHARSET`           | `str` | The default token characters |

:::

The charset is alphanumerics **minus the pairs that misread**: no `0` or `O`, no `1`, `l` or `I`. An affix is something somebody reads off a screen and types into another one, and those five characters are where that goes wrong.

Narrow it or extend it through <Lang js="charset" dart="charset" py="charset" code />. Starting from the default rather than from the alphabet keeps that property:

::: lang js

```javascript
import { AFFIX_CHARSET, randSuffix } from 'randino';

// Digits only.
randSuffix('MistyOwl', { charset: '0123456789' });

// The default, minus the upper case.
randSuffix('MistyOwl', { charset: AFFIX_CHARSET.replace(/[A-Z]/g, '') });
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

// Digits only.
randSuffix('MistyOwl', charset: '0123456789');

// The default, minus the upper case.
randSuffix('MistyOwl', charset: affixCharset.replaceAll(RegExp('[A-Z]'), ''));
```

:::

::: lang py

```python
from randino import AFFIX_CHARSET, rand_suffix

# Digits only.
rand_suffix("MistyOwl", charset="0123456789")

# The default, minus the upper case.
rand_suffix("MistyOwl", charset="".join(c for c in AFFIX_CHARSET if not c.isupper()))
```

:::

## Types

::: lang js

Every public type is exported alongside the functions, so an options object can be typed on its own:

```typescript
import type {
	AgeDetail,
	AgeDistribution,
	AgeGroup,
	AgeGroupOption,
	GenderCode,
	GenderDetail,
	NameDetail,
	NameGender,
	NameGenderOption,
	NameLanguage,
	NameLanguageOption,
	NameScript,
	NicknameDetail,
	OrganizationDetail,
	OrganizationIndustry,
	OrganizationIndustryOption,
	OrganizationType,
	OrganizationTypeOption,
	OsDetail,
	PhoneCountry,
	PhoneCountryOption,
	PhoneDetail,
	PhoneType,
	PhoneTypeOption,
	RamDetail,
	RamUnit,
	RamUnitOption,
	SystemPlatform,
	SystemPlatformOption,
	WordLanguage,
	WordLanguageOption,
	WordTheme,
	WordThemeOption,
	CountryDetail,
	CpuDetail,
	DateDetail,
	DateInput,
	DateUnit,
	DeviceDetail,
	DeviceType,
	DeviceTypeOption,
	DiskSizeDetail,
	DiskType,
	DiskTypeDetail,
	DiskUnit,
	DiskUnitOption,
	LocationDetail,
	LocationLanguage,
	LocationLanguageOption,
	LocationLevel,
	RandAgeOptions,
	RandCountryOptions,
	RandCpuOptions,
	RandDateOptions,
	RandDeviceOptions,
	RandDiskSizeOptions,
	RandDiskTypeOptions,
	RandGenderOptions,
	RandLocationOptions,
	RandNameOptions,
	RandNicknameOptions,
	RandOrganizationOptions,
	RandOsOptions,
	RandPhoneOptions,
	RandRamOptions,
	RandOutput
} from 'randino';

const options: RandNameOptions = { language: 'ko', count: 3 };
```

The `…Option` types are the union of a language or theme with `'all'`, so `NameLanguageOption` is `NameLanguage | 'all'`. Use the narrower one wherever `'all'` is not a valid answer, which is what the helpers do.

:::

::: lang dart

Every public type is exported alongside the functions:

```dart
import 'package:randino/randino.dart';

// Enums
AgeGroup, AgeDistribution, DateUnit, DeviceType, DiskType, DiskUnit, GenderCode
NameLanguage, NameGender, NameScript
OrganizationType, OrganizationIndustry
PhoneCountry, PhoneType
RamUnit, SystemPlatform
WordLanguage, WordTheme
LocationLanguage, LocationLevel

// Values
LengthRange, AgeDetail, CpuDetail, DateDetail, DeviceDetail, DiskSizeDetail, DiskTypeDetail, GenderDetail, NameDetail, NicknameDetail, LocationDetail, CountryDetail,
OrganizationDetail, OsDetail, PhoneDetail, RamDetail
```

There is no `…Option` type and no `all` member: **a null enum is what means "every one of them"**, so the parameter you do not write is already the mixed draw. That also means the helpers take the same type the generators do, rather than a narrower one.

:::

::: lang py

Every public type is importable alongside the functions, and the package ships a `py.typed` marker so a checker reads them:

```python
from randino import (
    AgeDetail,
    AgeDistribution,
    AgeGroup,
    AgeGroupOption,
    GenderCode,
    GenderDetail,
    NameDetail,
    NameGender,
    NameGenderOption,
    NameLanguage,
    NameLanguageOption,
    NameScript,
    NicknameDetail,
    OrganizationDetail,
    OrganizationIndustry,
    OrganizationIndustryOption,
    OrganizationType,
    OrganizationTypeOption,
    OsDetail,
    PhoneCountry,
    PhoneCountryOption,
    PhoneDetail,
    PhoneType,
    PhoneTypeOption,
    RamDetail,
    RamUnit,
    RamUnitOption,
    SystemPlatform,
    SystemPlatformOption,
    WordLanguage,
    WordLanguageOption,
    WordTheme,
    WordThemeOption,
    CountryDetail,
    CpuDetail,
    DateDetail,
    DateInput,
    DateUnit,
    DeviceDetail,
    DeviceType,
    DeviceTypeOption,
    DiskSizeDetail,
    DiskType,
    DiskTypeDetail,
    DiskUnit,
    DiskUnitOption,
    LocationDetail,
    LocationLanguage,
    LocationLanguageOption,
    LocationLevel,
    RandOutput,
)

language: NameLanguageOption = "ko"
```

They are `Literal` types rather than classes, so `"kr"` is rejected where `NameLanguage` is expected. The `…Option` types add `"all"`, so `NameLanguageOption` is `NameLanguage | Literal["all"]`. Use the narrower one wherever `"all"` is not a valid answer.

There is no options type to import: the arguments are keyword-only rather than an object, so there is nothing to annotate.

:::

## See also

- [Supported languages](../guide/languages) — what each language code covers.
- [Themes](../word/themes) — what each theme holds.
