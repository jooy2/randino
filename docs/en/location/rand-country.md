# randCountry

The country a language's locations are in, the way the language writes its own name. There is one per language, so `language: 'all'` is how more than one comes back, and it is the top of every location [`randLocation`](./rand-location) writes.

::: lang js

```javascript
import { randCountry } from 'randino';

randCountry({ language: 'ko' }); // ['대한민국']
randCountry({ count: 3 }); // ['대한민국', '대한민국', 'United States']
```

:::

::: lang dart

```dart
import 'package:randino/randino.dart';

randCountry(language: LocationLanguage.ko); // [대한민국]
randCountry(count: 3); // [대한민국, 대한민국, United States]
```

The detail form is `randCountryDetails`.

:::

::: lang py

```python
from randino import rand_country

rand_country(language="ko")  # ['대한민국']
rand_country(count=3)  # ['대한민국', '대한민국', 'United States']
```

:::

It is not a list of the world's countries. A list like that is a list of which territories count as countries, and that is not a question a random-data library should be answering.

## Options

<LocationOptions />

## See also

- [`randLocation`](./rand-location) — the country with everything below it.
- [`randRegion`](./rand-region) — the level below the country.
