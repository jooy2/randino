# 데모

아래의 모든 것은 브라우저에서 직접 실행됩니다. 컨트롤은 `randName`, `randNickname`, `randWord`, `randSentence`, `randLocation`, `randAge`, `randGender`, `randOrganization`, `randDate`, `randPhone`이 실제로 받는 옵션이고, 결과 아래의 코드 블록은 지금 설정이 만들어 내는 호출이며, 보이는 값은 Generate를 누를 때마다 새로 뽑힙니다.

<Demo />

## 이런 것들을 해 보세요 {#what-to-try}

- `language`를 `en`으로, `realism`을 `invented`로 두어 보세요. 이름은 계속 영어처럼 읽히지만 아무도 쓰지 않는 이름이 됩니다. 풀에서 뽑는 대신 음절 템플릿으로 만들기 때문입니다.
- `language`를 `all`로 둔 채 Generate를 몇 번 눌러 보세요. 아홉 개의 문자 체계가 나오며, 각 이름의 길이 범위는 묶음이 아니라 그 이름의 언어를 기준으로 정해집니다.
- `ru`를 고르고 `gender`를 바꿔 보세요. 러시아어는 이 선택이 밖에서 보이는 유일한 언어입니다. 부칭과 성이 모두 성별에 따라 변화합니다.
- 닉네임 탭에서 `theme`을 `animal`로, `wordSeparator`를 `-`로 지정해 보세요. 구분자도 길이에 포함되므로, 범위가 좁으면 단어를 자르는 대신 수식어를 뺍니다.
- 영어 닉네임에서 `maxLength`를 `8`로 낮춰 보세요. 단어가 잘리는 대신 세 단어짜리 형태가 아예 빠집니다. 길이는 단어가 아니라 형태를 고릅니다.
- `randSuffix`를 켜 보세요. 토큰은 닉네임이 완성된 뒤에 붙기 때문에, 길이 옵션이 그것을 신경 쓸 필요가 없습니다.
- 단어 탭에서 `theme`을 고르고 Generate를 눌러 보세요. 닉네임을 만드는 바로 그 단어 풀을 아무것도 더하지 않은 채로 받게 됩니다. `randAnimal`을 비롯한 29개 함수가 테마를 미리 정해 둔 이 호출입니다.
- 단어 탭에서 장식 함수를 `randModifier`로 바꿔 보세요. 명사 앞에 수식어를 붙이는 것이 `randNickname`이 하는 일의 대부분이며, 코드 블록에 그 두 함수가 그대로 드러납니다.
- 문장 탭에서 `language`를 `de`와 `ru`로 바꾸고 상세 정보를 켜 보세요. 두 언어에는 `object`도 `place`도 없습니다. 둘 다 명사 자체의 어미가 바뀌는 격을 요구하므로, 그 형태는 두 언어가 선언한 목록에 아예 없습니다.
- `include`에 두 단어를 넣어 보세요. 한국어라면 `사자 조용히`, 영어라면 `brave lion`입니다. 모든 문장에 두 단어가 들어가며, `brave`는 남은 자리에 따라 수식어가 되기도 하고 서술어가 되기도 합니다.
- `shape`를 `simple`에서 `complex`로 바꿔 보세요. 단어가 길어지는 대신 구가 하나 늘어납니다. `minLength`가 글자 단위로 하는 일을 구 단위로 하는 셈입니다.
- 위치 탭에서 상세 정보를 켜고 Generate를 몇 번 눌러 보세요. 읍·면·동은 옆에 적힌 시·군·구 안에, 시·군·구는 그 시·도 안에 실제로 있습니다. 이름을 조합한 것이 아니라 나라가 공개한 구역이기 때문입니다.
- `randLocation`을 고른 채 `language`를 `ko`로 두고 `includeCountry`를 꺼 보세요. 줄마다 붙던 나라 이름이 빠지고, `startsWith`에 `서`를 넣으면 빈 결과 대신 서울특별시에서 뽑습니다.
- `randDistrict`를 고르고 `language`를 `en`으로 바꿔 보세요. 아무것도 나오지 않습니다. 미국 위치는 도시에서 멈추고, 그 아래 단계는 한국어에만 있습니다. `language`를 `all`로 두면 같은 호출이 한국어로만 뽑습니다.
- `randRegion`을 고르고 `language`를 `ko`, `count`를 `20`으로 두고 `unique`를 켜 보세요. 16개가 나오는데, 이것이 시·도 전부입니다.
- `randCountry`를 고르고 `language`를 `ja`로 둔 뒤 상세 정보를 켜 보세요. ISO 3166-1이 코드를 준 국가와 지역은 9개 언어 모두에 이름이 있어서, 위치 함수 중 이것만 한국어와 영어에 묶이지 않습니다.
- `randCity`에서 `language`를 `ko`, `startsWith`를 `수`로 두어 보세요. 시에 딸린 일반구는 주소에 쓰듯 `수원시 장안구`처럼 시와 함께 나옵니다.
- 나이 탭에서 Generate를 몇 번 누른 뒤 `distribution`을 `uniform`으로 바꿔 보세요. 처음에는 20대에서 50대가 대부분이고, 바꾼 뒤에는 아흔 살이 아홉 살만큼 자주 나옵니다.
- `group`을 `senior`로, `maxAge`를 `40`으로 두어 보세요. 둘을 모두 만족하는 나이가 없으므로 범위를 따라, 빈 결과 대신 0세에서 40세 사이가 나옵니다.
- 성별 탭에서 `includeUnknown`과 `includeNonbinary`를 켜고 `count`를 `50`으로 두어 보세요. 미상은 네다섯 번 나오고, 논바이너리는 100번에 한 번꼴이라 한 번 나오거나 아예 나오지 않습니다.
- `includeNonbinary`를 켠 채 `language`를 `de`로 바꿔 보세요. 독일어는 자국 양식에 있는 세 번째 선택지인 `Divers`를 씁니다.
- 회사·기관 탭에서 `type`을 `company`로 두고 `language`를 `es`와 `de`로 번갈아 바꿔 보세요. 스페인어는 업종을 이름 앞에, 독일어는 뒤에 둡니다. 어순은 생성기가 아니라 그 언어의 템플릿이 정합니다.
- `type`을 `all`로 둔 채 `industry`를 골라 보세요. 업종은 회사에만 있으므로 회사만 나옵니다.
- `language`를 `ko`, `minLength`를 `12`로 두어 보세요. 한국어 조직 이름은 대개 그보다 짧아서, 짧은 이름을 늘이지 않고 법인 형태가 붙은 회사나 종합사회복지관처럼 긴 종류를 고릅니다.
- 상세 정보를 켜고 `language`를 `ko`, `startsWith`를 `해`로 두어 보세요. 앞에 `주식회사`가 붙어도 이름은 그 글자로 시작합니다.
- 날짜 탭에서 `minDate`와 `maxDate`를 모두 `2024-02`로 두세요. 모든 날짜가 2024년 2월 안에 들고 마지막 날은 29일입니다. 문자열 경계는 그달의 첫 밀리초가 아니라 그달 전체를 가리키기 때문입니다.
- `unit`을 `month`, `count`를 `20`으로 두고 `unique`를 켜 보세요. 몇 번을 눌러도 12개만 나옵니다. 1년에는 열두 달뿐이기 때문입니다.
- `format`에 `YYYY년 M월 D일 A h:mm`을 넣고, 이어서 `[Day] D`와 `Day D`를 넣어 보세요. 대괄호 밖의 글자는 토큰으로 읽히므로, 마지막 형식은 `5amy 5`처럼 나옵니다. `D`와 `a`가 모두 토큰이기 때문입니다.
- 전화번호 탭에서 `country`를 `KR`, `US`, `RU`로 번갈아 바꿔 보세요. 나라마다 쓰는 방식이 다릅니다. 하이픈으로 잇거나, 지역 번호를 괄호에 넣거나, 국내 식별번호 `8`을 앞에 둡니다.
- `includeCountryCode`를 켜고 `separator`를 `''`로 두세요. 문자 발송 서비스가 기대하는 E.164 형식이고, 상세 정보에는 다른 옵션과 관계없이 이 형식이 들어 있습니다. 이런 번호는 우연히 실제 번호일 수 있으므로, 테스트 중인 폼에만 쓰고 무언가를 보내는 데는 쓰지 마세요.
- `country`를 `all`로 두고 `fictional`을 켜 보세요. 미국의 `555-01xx`와 독일 연방네트워크청의 드라마 번호만 나옵니다. 영화와 책에 쓰라고 번호를 따로 떼어 둔 나라가 그 둘뿐이기 때문입니다. `KR`을 고르면 실제 번호 대신 아무것도 나오지 않습니다.
- 날짜 탭으로 돌아가 `format`에 `dddd, D MMMM YYYY`를 넣고 `language`를 `de`, `ru`, `ko`로 바꿔 보세요. 이름만 바뀌고 숫자는 그대로입니다. 러시아어는 날짜에 맞게 월을 생격으로 씁니다.
- `utcOffset`을 `+09:00`으로 두고 `format`은 비워 두세요. 날짜가 `Z` 대신 `+09:00`으로 끝나고, `minDate`와 `maxDate`를 같은 날로 두면 모든 날짜가 서울 기준으로 그날 안에 들어갑니다.

## 이 페이지의 범위 {#what-this-page-is-not}

이 페이지는 시연이며, 브라우저에서 대량으로 호출하라고 만든 것이 아닙니다. 라이브러리 자체는 네트워크 호출도 의존성도 없으므로, 여기서 도는 것과 똑같은 코드가 서버에서도 빌드 스크립트에서도 테스트 픽스처에서도 그대로 돕니다.

이 페이지는 **시드 없이** 뽑으므로, Generate를 두 번 누르면 매번 다른 결과가 나옵니다. 직접 부르는 호출은 그렇지 않아도 됩니다. 모든 생성 함수가 `random`을 받으므로, 시드를 준 난수원을 넘기면 실행할 때마다 같은 결과가 나옵니다. 방법은 [난수원 고르기](./guide/getting-started#choosing-the-source)에 있습니다.

## 다음으로 볼 것 {#where-to-go-next}

- [시작하기](./guide/getting-started) — 세 패키지 중 쓰는 것으로 설치하기.
- [`randName`](./name/rand-name), [`randNickname`](./nickname/rand-nickname), [`randWord`](./word/rand-word), [`randSentence`](./sentence/rand-sentence), [`randLocation`](./location/rand-location), [`randAge`](./age/rand-age), [`randGender`](./gender/rand-gender), [`randOrganization`](./organization/rand-organization), [`randDate`](./date/rand-date), [`randPhone`](./phone/rand-phone) — 위 패널에 있는 모든 옵션의 설명.
- [지원 언어](./guide/languages) — 언어마다 할 수 있는 것과 할 수 없는 것.
