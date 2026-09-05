// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The sentence dataset for ko.
final SentenceLanguageData ko = SentenceLanguageData(
  space: ' ',
  capitalize: false,
  terminators: const <SentenceType, String>{
    SentenceType.statement: '.',
    SentenceType.question: '?',
    SentenceType.exclamation: '!',
    SentenceType.trailing: '…',
  },
  quotes: const <SentenceQuote, List<String>>{
    SentenceQuote.double: <String>['“', '”'],
    SentenceQuote.single: <String>['‘', '’'],
  },
  // Plain declarative — the form a written statement takes, rather than the
  // polite 합니다체 a person would speak.
  verbs: <VerbGroup>[
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        달린다 걷는다 뛴다 헤엄친다 날아오른다 기어간다 돌아온다 떠난다 멈춘다 쉰다 잠잔다 웃는다 운다 노래한다 춤춘다 하품한다 숨는다 기다린다 일어선다 앉는다 눕는다
        뒹군다 서성인다 지나간다 다가온다 뒤척인다 존다 두리번거린다 어슬렁댄다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          달리니|달리나|달리는가 걷니|걷나|걷는가 뛰니|뛰나|뛰는가 헤엄치니|헤엄치나|헤엄치는가 날아오르니|날아오르나|날아오르는가 기어가니|기어가나|기어가는가
          돌아오니|돌아오나|돌아오는가 떠나니|떠나나|떠나는가 멈추니|멈추나|멈추는가 쉬니|쉬나|쉬는가 잠자니|잠자나|잠자는가 웃니|웃나|웃는가 우니|우나|우는가
          노래하니|노래하나|노래하는가 춤추니|춤추나|춤추는가 하품하니|하품하나|하품하는가 숨니|숨나|숨는가 기다리니|기다리나|기다리는가 일어서니|일어서나|일어서는가
          앉니|앉나|앉는가 눕니|눕나|눕는가 뒹구니|뒹구나|뒹구는가 서성이니|서성이나|서성이는가 지나가니|지나가나|지나가는가 다가오니|다가오나|다가오는가
          뒤척이니|뒤척이나|뒤척이는가 조니|조나|조는가 두리번거리니|두리번거리나|두리번거리는가 어슬렁대니|어슬렁대나|어슬렁대는가
        '''),
        PredicateForm.exclamation: words(r'''
          달리는구나|달리네|달리는군 걷는구나|걷네|걷는군 뛰는구나|뛰네|뛰는군 헤엄치는구나|헤엄치네|헤엄치는군 날아오르는구나|날아오르네|날아오르는군
          기어가는구나|기어가네|기어가는군 돌아오는구나|돌아오네|돌아오는군 떠나는구나|떠나네|떠나는군 멈추는구나|멈추네|멈추는군 쉬는구나|쉬네|쉬는군 잠자는구나|잠자네|잠자는군
          웃는구나|웃네|웃는군 우는구나|우네|우는군 노래하는구나|노래하네|노래하는군 춤추는구나|춤추네|춤추는군 하품하는구나|하품하네|하품하는군 숨는구나|숨네|숨는군
          기다리는구나|기다리네|기다리는군 일어서는구나|일어서네|일어서는군 앉는구나|앉네|앉는군 눕는구나|눕네|눕는군 뒹구는구나|뒹구네|뒹구는군 서성이는구나|서성이네|서성이는군
          지나가는구나|지나가네|지나가는군 다가오는구나|다가오네|다가오는군 뒤척이는구나|뒤척이네|뒤척이는군 조는구나|조네|조는군 두리번거리는구나|두리번거리네|두리번거리는군
          어슬렁대는구나|어슬렁대네|어슬렁대는군
        '''),
        PredicateForm.casual: words(r'''
          달려|달리지 걸어|걷지 뛰어|뛰지 헤엄쳐|헤엄치지 날아올라|날아오르지 기어가|기어가지 돌아와|돌아오지 떠나|떠나지 멈춰|멈추지 쉬어|쉬지 잠자|잠자지 웃어|웃지
          울어|울지 노래해|노래하지 춤춰|춤추지 하품해|하품하지 숨어|숨지 기다려|기다리지 일어서|일어서지 앉아|앉지 누워|눕지 뒹굴어|뒹굴지 서성여|서성이지 지나가|지나가지
          다가와|다가오지 뒤척여|뒤척이지 졸아|졸지 두리번거려|두리번거리지 어슬렁대|어슬렁대지
        '''),
        PredicateForm.polite: words(r'''
          달려요|달리죠 걸어요|걷죠 뛰어요|뛰죠 헤엄쳐요|헤엄치죠 날아올라요|날아오르죠 기어가요|기어가죠 돌아와요|돌아오죠 떠나요|떠나죠 멈춰요|멈추죠 쉬어요|쉬죠
          잠자요|잠자죠 웃어요|웃죠 울어요|울죠 노래해요|노래하죠 춤춰요|춤추죠 하품해요|하품하죠 숨어요|숨죠 기다려요|기다리죠 일어서요|일어서죠 앉아요|앉죠 누워요|눕죠
          뒹굴어요|뒹굴죠 서성여요|서성이죠 지나가요|지나가죠 다가와요|다가오죠 뒤척여요|뒤척이죠 졸아요|졸죠 두리번거려요|두리번거리죠 어슬렁대요|어슬렁대죠
        '''),
        PredicateForm.formal: words(r'''
          달립니다 걷습니다 뜁니다 헤엄칩니다 날아오릅니다 기어갑니다 돌아옵니다 떠납니다 멈춥니다 쉽니다 잠잡니다 웃습니다 웁니다 노래합니다 춤춥니다 하품합니다 숨습니다
          기다립니다 일어섭니다 앉습니다 눕습니다 뒹굽니다 서성입니다 지나갑니다 다가옵니다 뒤척입니다 좁니다 두리번거립니다 어슬렁댑니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          달립니까 걷습니까 뜁니까 헤엄칩니까 날아오릅니까 기어갑니까 돌아옵니까 떠납니까 멈춥니까 쉽니까 잠잡니까 웃습니까 웁니까 노래합니까 춤춥니까 하품합니까 숨습니까
          기다립니까 일어섭니까 앉습니까 눕습니까 뒹굽니까 서성입니까 지나갑니까 다가옵니까 뒤척입니까 좁니까 두리번거립니까 어슬렁댑니까
        '''),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      words: words(r'''
        먹는다 마신다 씹는다 삼킨다 맛본다 굽는다 데운다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          먹니|먹나|먹는가 마시니|마시나|마시는가 씹니|씹나|씹는가 삼키니|삼키나|삼키는가 맛보니|맛보나|맛보는가 굽니|굽나|굽는가 데우니|데우나|데우는가
        '''),
        PredicateForm.exclamation: words(r'''
          먹는구나|먹네|먹는군 마시는구나|마시네|마시는군 씹는구나|씹네|씹는군 삼키는구나|삼키네|삼키는군 맛보는구나|맛보네|맛보는군 굽는구나|굽네|굽는군
          데우는구나|데우네|데우는군
        '''),
        PredicateForm.casual: words(r'''
          먹어|먹지 마셔|마시지 씹어|씹지 삼켜|삼키지 맛봐|맛보지 구워|굽지 데워|데우지
        '''),
        PredicateForm.polite: words(r'''
          먹어요|먹죠 마셔요|마시죠 씹어요|씹죠 삼켜요|삼키죠 맛봐요|맛보죠 구워요|굽죠 데워요|데우죠
        '''),
        PredicateForm.formal: words(r'''
          먹습니다 마십니다 씹습니다 삼킵니다 맛봅니다 굽습니다 데웁니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          먹습니까 마십니까 씹습니까 삼킵니까 맛봅니까 굽습니까 데웁니까
        '''),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        본다 바라본다 찾는다 줍는다 옮긴다 만진다 감춘다 지킨다 나른다 챙긴다 고른다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          보니|보나|보는가 바라보니|바라보나|바라보는가 찾니|찾나|찾는가 줍니|줍나|줍는가 옮기니|옮기나|옮기는가 만지니|만지나|만지는가 감추니|감추나|감추는가
          지키니|지키나|지키는가 나르니|나르나|나르는가 챙기니|챙기나|챙기는가 고르니|고르나|고르는가
        '''),
        PredicateForm.exclamation: words(r'''
          보는구나|보네|보는군 바라보는구나|바라보네|바라보는군 찾는구나|찾네|찾는군 줍는구나|줍네|줍는군 옮기는구나|옮기네|옮기는군 만지는구나|만지네|만지는군
          감추는구나|감추네|감추는군 지키는구나|지키네|지키는군 나르는구나|나르네|나르는군 챙기는구나|챙기네|챙기는군 고르는구나|고르네|고르는군
        '''),
        PredicateForm.casual: words(r'''
          봐|보지 바라봐|바라보지 찾아|찾지 주워|줍지 옮겨|옮기지 만져|만지지 감춰|감추지 지켜|지키지 날라|나르지 챙겨|챙기지 골라|고르지
        '''),
        PredicateForm.polite: words(r'''
          봐요|보죠 바라봐요|바라보죠 찾아요|찾죠 주워요|줍죠 옮겨요|옮기죠 만져요|만지죠 감춰요|감추죠 지켜요|지키죠 날라요|나르죠 챙겨요|챙기죠 골라요|고르죠
        '''),
        PredicateForm.formal: words(r'''
          봅니다 바라봅니다 찾습니다 줍습니다 옮깁니다 만집니다 감춥니다 지킵니다 나릅니다 챙깁니다 고릅니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          봅니까 바라봅니까 찾습니까 줍습니까 옮깁니까 만집니까 감춥니까 지킵니까 나릅니까 챙깁니까 고릅니까
        '''),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        만든다 고친다 닦는다 판다 산다 손질한다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          만드니|만드나|만드는가 고치니|고치나|고치는가 닦니|닦나|닦는가 파니|파나|파는가 사니|사나|사는가 손질하니|손질하나|손질하는가
        '''),
        PredicateForm.exclamation: words(r'''
          만드는구나|만드네|만드는군 고치는구나|고치네|고치는군 닦는구나|닦네|닦는군 파는구나|파네|파는군 사는구나|사네|사는군 손질하는구나|손질하네|손질하는군
        '''),
        PredicateForm.casual: words(r'''
          만들어|만들지 고쳐|고치지 닦아|닦지 팔아|팔지 사|사지 손질해|손질하지
        '''),
        PredicateForm.polite: words(r'''
          만들어요|만들죠 고쳐요|고치죠 닦아요|닦죠 팔아요|팔죠 사요|사죠 손질해요|손질하죠
        '''),
        PredicateForm.formal: words(r'''
          만듭니다 고칩니다 닦습니다 팝니다 삽니다 손질합니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          만듭니까 고칩니까 닦습니까 팝니까 삽니까 손질합니까
        '''),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'''
        꿈꾼다 기억한다 잊는다 상상한다 헤아린다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          꿈꾸니|꿈꾸나|꿈꾸는가 기억하니|기억하나|기억하는가 잊니|잊나|잊는가 상상하니|상상하나|상상하는가 헤아리니|헤아리나|헤아리는가
        '''),
        PredicateForm.exclamation: words(r'''
          꿈꾸는구나|꿈꾸네|꿈꾸는군 기억하는구나|기억하네|기억하는군 잊는구나|잊네|잊는군 상상하는구나|상상하네|상상하는군 헤아리는구나|헤아리네|헤아리는군
        '''),
        PredicateForm.casual: words(r'''
          꿈꿔|꿈꾸지 기억해|기억하지 잊어|잊지 상상해|상상하지 헤아려|헤아리지
        '''),
        PredicateForm.polite: words(r'''
          꿈꿔요|꿈꾸죠 기억해요|기억하죠 잊어요|잊죠 상상해요|상상하죠 헤아려요|헤아리죠
        '''),
        PredicateForm.formal: words(r'''
          꿈꿉니다 기억합니다 잊습니다 상상합니다 헤아립니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          꿈꿉니까 기억합니까 잊습니까 상상합니까 헤아립니까
        '''),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        빛난다 흐른다 저문다 밝아온다 깊어진다 조용해진다 물든다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          빛나니|빛나나|빛나는가 흐르니|흐르나|흐르는가 저무니|저무나|저무는가 밝아오니|밝아오나|밝아오는가 깊어지니|깊어지나|깊어지는가 조용해지니|조용해지나|조용해지는가
          물드니|물드나|물드는가
        '''),
        PredicateForm.exclamation: words(r'''
          빛나는구나|빛나네|빛나는군 흐르는구나|흐르네|흐르는군 저무는구나|저무네|저무는군 밝아오는구나|밝아오네|밝아오는군 깊어지는구나|깊어지네|깊어지는군
          조용해지는구나|조용해지네|조용해지는군 물드는구나|물드네|물드는군
        '''),
        PredicateForm.casual: words(r'''
          빛나|빛나지 흘러|흐르지 저물어|저물지 밝아와|밝아오지 깊어져|깊어지지 조용해져|조용해지지 물들어|물들지
        '''),
        PredicateForm.polite: words(r'''
          빛나요|빛나죠 흘러요|흐르죠 저물어요|저물죠 밝아와요|밝아오죠 깊어져요|깊어지죠 조용해져요|조용해지죠 물들어요|물들죠
        '''),
        PredicateForm.formal: words(r'''
          빛납니다 흐릅니다 저뭅니다 밝아옵니다 깊어집니다 조용해집니다 물듭니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          빛납니까 흐릅니까 저뭅니까 밝아옵니까 깊어집니까 조용해집니까 물듭니까
        '''),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        흔들린다 반짝인다 떨어진다 굴러간다 기울어진다 낡아간다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          흔들리니|흔들리나|흔들리는가 반짝이니|반짝이나|반짝이는가 떨어지니|떨어지나|떨어지는가 굴러가니|굴러가나|굴러가는가 기울어지니|기울어지나|기울어지는가
          낡아가니|낡아가나|낡아가는가
        '''),
        PredicateForm.exclamation: words(r'''
          흔들리는구나|흔들리네|흔들리는군 반짝이는구나|반짝이네|반짝이는군 떨어지는구나|떨어지네|떨어지는군 굴러가는구나|굴러가네|굴러가는군 기울어지는구나|기울어지네|기울어지는군
          낡아가는구나|낡아가네|낡아가는군
        '''),
        PredicateForm.casual: words(r'''
          흔들려|흔들리지 반짝여|반짝이지 떨어져|떨어지지 굴러가|굴러가지 기울어져|기울어지지 낡아가|낡아가지
        '''),
        PredicateForm.polite: words(r'''
          흔들려요|흔들리죠 반짝여요|반짝이죠 떨어져요|떨어지죠 굴러가요|굴러가죠 기울어져요|기울어지죠 낡아가요|낡아가죠
        '''),
        PredicateForm.formal: words(r'''
          흔들립니다 반짝입니다 떨어집니다 굴러갑니다 기울어집니다 낡아갑니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          흔들립니까 반짝입니까 떨어집니까 굴러갑니까 기울어집니까 낡아갑니까
        '''),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        달린다 멈춘다 지나간다 돌아온다 출발한다 미끄러진다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          달리니|달리나|달리는가 멈추니|멈추나|멈추는가 지나가니|지나가나|지나가는가 돌아오니|돌아오나|돌아오는가 출발하니|출발하나|출발하는가 미끄러지니|미끄러지나|미끄러지는가
        '''),
        PredicateForm.exclamation: words(r'''
          달리는구나|달리네|달리는군 멈추는구나|멈추네|멈추는군 지나가는구나|지나가네|지나가는군 돌아오는구나|돌아오네|돌아오는군 출발하는구나|출발하네|출발하는군
          미끄러지는구나|미끄러지네|미끄러지는군
        '''),
        PredicateForm.casual: words(r'''
          달려|달리지 멈춰|멈추지 지나가|지나가지 돌아와|돌아오지 출발해|출발하지 미끄러져|미끄러지지
        '''),
        PredicateForm.polite: words(r'''
          달려요|달리죠 멈춰요|멈추죠 지나가요|지나가죠 돌아와요|돌아오죠 출발해요|출발하죠 미끄러져요|미끄러지죠
        '''),
        PredicateForm.formal: words(r'''
          달립니다 멈춥니다 지나갑니다 돌아옵니다 출발합니다 미끄러집니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          달립니까 멈춥니까 지나갑니까 돌아옵니까 출발합니까 미끄러집니까
        '''),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        번진다 사라진다 남는다 스며든다 되풀이된다 짙어진다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          번지니|번지나|번지는가 사라지니|사라지나|사라지는가 남니|남나|남는가 스며드니|스며드나|스며드는가 되풀이되니|되풀이되나|되풀이되는가 짙어지니|짙어지나|짙어지는가
        '''),
        PredicateForm.exclamation: words(r'''
          번지는구나|번지네|번지는군 사라지는구나|사라지네|사라지는군 남는구나|남네|남는군 스며드는구나|스며드네|스며드는군 되풀이되는구나|되풀이되네|되풀이되는군
          짙어지는구나|짙어지네|짙어지는군
        '''),
        PredicateForm.casual: words(r'''
          번져|번지지 사라져|사라지지 남아|남지 스며들어|스며들지 되풀이돼|되풀이되지 짙어져|짙어지지
        '''),
        PredicateForm.polite: words(r'''
          번져요|번지죠 사라져요|사라지죠 남아요|남죠 스며들어요|스며들죠 되풀이돼요|되풀이되죠 짙어져요|짙어지죠
        '''),
        PredicateForm.formal: words(r'''
          번집니다 사라집니다 남습니다 스며듭니다 되풀이됩니다 짙어집니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          번집니까 사라집니까 남습니까 스며듭니까 되풀이됩니까 짙어집니까
        '''),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        자란다 시든다 피어난다 흔들린다 뿌리내린다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          자라니|자라나|자라는가 시드니|시드나|시드는가 피어나니|피어나나|피어나는가 흔들리니|흔들리나|흔들리는가 뿌리내리니|뿌리내리나|뿌리내리는가
        '''),
        PredicateForm.exclamation: words(r'''
          자라는구나|자라네|자라는군 시드는구나|시드네|시드는군 피어나는구나|피어나네|피어나는군 흔들리는구나|흔들리네|흔들리는군 뿌리내리는구나|뿌리내리네|뿌리내리는군
        '''),
        PredicateForm.casual: words(r'''
          자라|자라지 시들어|시들지 피어나|피어나지 흔들려|흔들리지 뿌리내려|뿌리내리지
        '''),
        PredicateForm.polite: words(r'''
          자라요|자라죠 시들어요|시들죠 피어나요|피어나죠 흔들려요|흔들리죠 뿌리내려요|뿌리내리죠
        '''),
        PredicateForm.formal: words(r'''
          자랍니다 시듭니다 피어납니다 흔들립니다 뿌리내립니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          자랍니까 시듭니까 피어납니까 흔들립니까 뿌리내립니까
        '''),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        떨린다 움직인다 저린다 굳는다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          떨리니|떨리나|떨리는가 움직이니|움직이나|움직이는가 저리니|저리나|저리는가 굳니|굳나|굳는가
        '''),
        PredicateForm.exclamation: words(r'''
          떨리는구나|떨리네|떨리는군 움직이는구나|움직이네|움직이는군 저리는구나|저리네|저리는군 굳는구나|굳네|굳는군
        '''),
        PredicateForm.casual: words(r'''
          떨려|떨리지 움직여|움직이지 저려|저리지 굳어|굳지
        '''),
        PredicateForm.polite: words(r'''
          떨려요|떨리죠 움직여요|움직이죠 저려요|저리죠 굳어요|굳죠
        '''),
        PredicateForm.formal: words(r'''
          떨립니다 움직입니다 저립니다 굳습니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          떨립니까 움직입니까 저립니까 굳습니까
        '''),
      },
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        익는다 식는다 끓는다 녹는다 상한다 남는다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          익니|익나|익는가 식니|식나|식는가 끓니|끓나|끓는가 녹니|녹나|녹는가 상하니|상하나|상하는가 남니|남나|남는가
        '''),
        PredicateForm.exclamation: words(r'''
          익는구나|익네|익는군 식는구나|식네|식는군 끓는구나|끓네|끓는군 녹는구나|녹네|녹는군 상하는구나|상하네|상하는군 남는구나|남네|남는군
        '''),
        PredicateForm.casual: words(r'''
          익어|익지 식어|식지 끓어|끓지 녹아|녹지 상해|상하지 남아|남지
        '''),
        PredicateForm.polite: words(r'''
          익어요|익죠 식어요|식죠 끓어요|끓죠 녹아요|녹죠 상해요|상하죠 남아요|남죠
        '''),
        PredicateForm.formal: words(r'''
          익습니다 식습니다 끓습니다 녹습니다 상합니다 남습니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          익습니까 식습니까 끓습니까 녹습니까 상합니까 남습니까
        '''),
      },
    ),
  ],
  // The same six forms for a predicate that describes rather than does. An
  // adjective parts company with a verb in one place: it asks with `-(으)ㄴ가`
  // and `-(으)니` where a verb asks with `-나` and a bare `-니`.
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        크다 작다 빠르다 느리다 조용하다 시끄럽다 용감하다 게으르다 부지런하다 배고프다 졸리다 사납다 순하다 영리하다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          크니|큰가 작으니|작은가 빠르니|빠른가 느리니|느린가 조용하니|조용한가 시끄러우니|시끄러운가 용감하니|용감한가 게으르니|게으른가 부지런하니|부지런한가
          배고프니|배고픈가 졸리니|졸린가 사나우니|사나운가 순하니|순한가 영리하니|영리한가
        '''),
        PredicateForm.exclamation: words(r'''
          크구나|크네|크군 작구나|작네|작군 빠르구나|빠르네|빠르군 느리구나|느리네|느리군 조용하구나|조용하네|조용하군 시끄럽구나|시끄럽네|시끄럽군
          용감하구나|용감하네|용감하군 게으르구나|게으르네|게으르군 부지런하구나|부지런하네|부지런하군 배고프구나|배고프네|배고프군 졸리구나|졸리네|졸리군 사납구나|사납네|사납군
          순하구나|순하네|순하군 영리하구나|영리하네|영리하군
        '''),
        PredicateForm.casual: words(r'''
          커|크지 작아|작지 빨라|빠르지 느려|느리지 조용해|조용하지 시끄러워|시끄럽지 용감해|용감하지 게을러|게으르지 부지런해|부지런하지 배고파|배고프지 졸려|졸리지
          사나워|사납지 순해|순하지 영리해|영리하지
        '''),
        PredicateForm.polite: words(r'''
          커요|크죠 작아요|작죠 빨라요|빠르죠 느려요|느리죠 조용해요|조용하죠 시끄러워요|시끄럽죠 용감해요|용감하죠 게을러요|게으르죠 부지런해요|부지런하죠 배고파요|배고프죠
          졸려요|졸리죠 사나워요|사납죠 순해요|순하죠 영리해요|영리하죠
        '''),
        PredicateForm.formal: words(r'''
          큽니다 작습니다 빠릅니다 느립니다 조용합니다 시끄럽습니다 용감합니다 게으릅니다 부지런합니다 배고픕니다 졸립니다 사납습니다 순합니다 영리합니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          큽니까 작습니까 빠릅니까 느립니까 조용합니까 시끄럽습니까 용감합니까 게으릅니까 부지런합니까 배고픕니까 졸립니까 사납습니까 순합니까 영리합니까
        '''),
      },
    ),
    StateGroup(
      subject: const <NounClass>[
        NounClass.creature,
        NounClass.person,
        NounClass.plant,
        NounClass.edible,
        NounClass.thing,
        NounClass.vehicle,
        NounClass.place,
        NounClass.event,
        NounClass.idea,
        NounClass.body,
      ],
      words: words(r'''
        아름답다 낯설다 새롭다 흔하다 드물다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          아름다우니|아름다운가 낯서니|낯선가 새로우니|새로운가 흔하니|흔한가 드무니|드문가
        '''),
        PredicateForm.exclamation: words(r'''
          아름답구나|아름답네|아름답군 낯설구나|낯서네|낯설군 새롭구나|새롭네|새롭군 흔하구나|흔하네|흔하군 드물구나|드무네|드물군
        '''),
        PredicateForm.casual: words(r'''
          아름다워|아름답지 낯설어|낯설지 새로워|새롭지 흔해|흔하지 드물어|드물지
        '''),
        PredicateForm.polite: words(r'''
          아름다워요|아름답죠 낯설어요|낯설죠 새로워요|새롭죠 흔해요|흔하죠 드물어요|드물죠
        '''),
        PredicateForm.formal: words(r'''
          아름답습니다 낯섭니다 새롭습니다 흔합니다 드뭅니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          아름답습니까 낯섭니까 새롭습니까 흔합니까 드뭅니까
        '''),
      },
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        넓다 좁다 고요하다 깊다 어둡다 밝다 아득하다 가파르다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          넓으니|넓은가 좁으니|좁은가 고요하니|고요한가 깊으니|깊은가 어두우니|어두운가 밝으니|밝은가 아득하니|아득한가 가파르니|가파른가
        '''),
        PredicateForm.exclamation: words(r'''
          넓구나|넓네|넓군 좁구나|좁네|좁군 고요하구나|고요하네|고요하군 깊구나|깊네|깊군 어둡구나|어둡네|어둡군 밝구나|밝네|밝군 아득하구나|아득하네|아득하군
          가파르구나|가파르네|가파르군
        '''),
        PredicateForm.casual: words(r'''
          넓어|넓지 좁아|좁지 고요해|고요하지 깊어|깊지 어두워|어둡지 밝아|밝지 아득해|아득하지 가팔라|가파르지
        '''),
        PredicateForm.polite: words(r'''
          넓어요|넓죠 좁아요|좁죠 고요해요|고요하죠 깊어요|깊죠 어두워요|어둡죠 밝아요|밝죠 아득해요|아득하죠 가팔라요|가파르죠
        '''),
        PredicateForm.formal: words(r'''
          넓습니다 좁습니다 고요합니다 깊습니다 어둡습니다 밝습니다 아득합니다 가파릅니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          넓습니까 좁습니까 고요합니까 깊습니까 어둡습니까 밝습니까 아득합니까 가파릅니까
        '''),
      },
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        단단하다 가볍다 무겁다 낡았다 매끈하다 투명하다 튼튼하다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          단단하니|단단한가 가벼우니|가벼운가 무거우니|무거운가 낡았니|낡았는가 매끈하니|매끈한가 투명하니|투명한가 튼튼하니|튼튼한가
        '''),
        PredicateForm.exclamation: words(r'''
          단단하구나|단단하네|단단하군 가볍구나|가볍네|가볍군 무겁구나|무겁네|무겁군 낡았구나|낡았네|낡았군 매끈하구나|매끈하네|매끈하군 투명하구나|투명하네|투명하군
          튼튼하구나|튼튼하네|튼튼하군
        '''),
        PredicateForm.casual: words(r'''
          단단해|단단하지 가벼워|가볍지 무거워|무겁지 낡았어|낡았지 매끈해|매끈하지 투명해|투명하지 튼튼해|튼튼하지
        '''),
        PredicateForm.polite: words(r'''
          단단해요|단단하죠 가벼워요|가볍죠 무거워요|무겁죠 낡았어요|낡았죠 매끈해요|매끈하죠 투명해요|투명하죠 튼튼해요|튼튼하죠
        '''),
        PredicateForm.formal: words(r'''
          단단합니다 가볍습니다 무겁습니다 낡았습니다 매끈합니다 투명합니다 튼튼합니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          단단합니까 가볍습니까 무겁습니까 낡았습니까 매끈합니까 투명합니까 튼튼합니까
        '''),
      },
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        달다 짜다 맵다 시다 뜨겁다 차갑다 고소하다 담백하다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          다니|단가 짜니|짠가 매우니|매운가 시니|신가 뜨거우니|뜨거운가 차가우니|차가운가 고소하니|고소한가 담백하니|담백한가
        '''),
        PredicateForm.exclamation: words(r'''
          달구나|다네|달군 짜구나|짜네|짜군 맵구나|맵네|맵군 시구나|시네|시군 뜨겁구나|뜨겁네|뜨겁군 차갑구나|차갑네|차갑군 고소하구나|고소하네|고소하군
          담백하구나|담백하네|담백하군
        '''),
        PredicateForm.casual: words(r'''
          달아|달지 짜|짜지 매워|맵지 셔|시지 뜨거워|뜨겁지 차가워|차갑지 고소해|고소하지 담백해|담백하지
        '''),
        PredicateForm.polite: words(r'''
          달아요|달죠 짜요|짜죠 매워요|맵죠 셔요|시죠 뜨거워요|뜨겁죠 차가워요|차갑죠 고소해요|고소하죠 담백해요|담백하죠
        '''),
        PredicateForm.formal: words(r'''
          답니다 짭니다 맵습니다 십니다 뜨겁습니다 차갑습니다 고소합니다 담백합니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          답니까 짭니까 맵습니까 십니까 뜨겁습니까 차갑습니까 고소합니까 담백합니까
        '''),
      },
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        어렵다 쉽다 분명하다 흐릿하다 영원하다 덧없다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          어려우니|어려운가 쉬우니|쉬운가 분명하니|분명한가 흐릿하니|흐릿한가 영원하니|영원한가 덧없으니|덧없는가
        '''),
        PredicateForm.exclamation: words(r'''
          어렵구나|어렵네|어렵군 쉽구나|쉽네|쉽군 분명하구나|분명하네|분명하군 흐릿하구나|흐릿하네|흐릿하군 영원하구나|영원하네|영원하군 덧없구나|덧없네|덧없군
        '''),
        PredicateForm.casual: words(r'''
          어려워|어렵지 쉬워|쉽지 분명해|분명하지 흐릿해|흐릿하지 영원해|영원하지 덧없어|덧없지
        '''),
        PredicateForm.polite: words(r'''
          어려워요|어렵죠 쉬워요|쉽죠 분명해요|분명하죠 흐릿해요|흐릿하죠 영원해요|영원하죠 덧없어요|덧없죠
        '''),
        PredicateForm.formal: words(r'''
          어렵습니다 쉽습니다 분명합니다 흐릿합니다 영원합니다 덧없습니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          어렵습니까 쉽습니까 분명합니까 흐릿합니까 영원합니까 덧없습니까
        '''),
      },
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        푸르다 무성하다 향기롭다 시들하다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          푸르니|푸른가 무성하니|무성한가 향기로우니|향기로운가 시들하니|시들한가
        '''),
        PredicateForm.exclamation: words(r'''
          푸르구나|푸르네|푸르군 무성하구나|무성하네|무성하군 향기롭구나|향기롭네|향기롭군 시들하구나|시들하네|시들하군
        '''),
        PredicateForm.casual: words(r'''
          푸르러|푸르지 무성해|무성하지 향기로워|향기롭지 시들해|시들하지
        '''),
        PredicateForm.polite: words(r'''
          푸르러요|푸르죠 무성해요|무성하죠 향기로워요|향기롭죠 시들해요|시들하죠
        '''),
        PredicateForm.formal: words(r'''
          푸릅니다 무성합니다 향기롭습니다 시들합니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          푸릅니까 무성합니까 향기롭습니까 시들합니까
        '''),
      },
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        따뜻하다 차갑다 아프다 뻣뻣하다
      '''),
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: words(r'''
          따뜻하니|따뜻한가 차가우니|차가운가 아프니|아픈가 뻣뻣하니|뻣뻣한가
        '''),
        PredicateForm.exclamation: words(r'''
          따뜻하구나|따뜻하네|따뜻하군 차갑구나|차갑네|차갑군 아프구나|아프네|아프군 뻣뻣하구나|뻣뻣하네|뻣뻣하군
        '''),
        PredicateForm.casual: words(r'''
          따뜻해|따뜻하지 차가워|차갑지 아파|아프지 뻣뻣해|뻣뻣하지
        '''),
        PredicateForm.polite: words(r'''
          따뜻해요|따뜻하죠 차가워요|차갑죠 아파요|아프죠 뻣뻣해요|뻣뻣하죠
        '''),
        PredicateForm.formal: words(r'''
          따뜻합니다 차갑습니다 아픕니다 뻣뻣합니다
        '''),
        PredicateForm.formalQuestion: words(r'''
          따뜻합니까 차갑습니까 아픕니까 뻣뻣합니까
        '''),
      },
    ),
  ],
  manners: words(r'''
    조용히 천천히 빠르게 가만히 슬며시 문득 함께 홀로 다시 계속 잠시 서서히 갑자기 언제나 여전히 조심스레 힘차게 나란히 살며시 묵묵히 느긋하게 씩씩하게 훌쩍 곧장
    슬쩍 사뿐히 성큼성큼 부지런히 유유히 냉큼 차분히 은근히 대뜸 나직이 느릿느릿 재빨리 가볍게 얌전히 무심히 덤덤히
  '''),
  times: words(r'''
    새벽에 아침에 낮에 저녁에 밤에 한밤중에 오늘 어제 내일 봄에 여름에 가을에 겨울에 주말에 방금 가끔 매일 해질녘에 이른봄에 늦가을에 이른아침에 한낮에 정오에
    초저녁에 자정에 새해에 장마철에 명절에 휴일에 지난주에 다음주에 요즘 한때 오래전에
  '''),
  // What a sentence opens on when it follows another. Written whole, so a
  // language that wants a comma after its connective writes the comma.
  connectives: words(r'''
    그리고 그래서 하지만 그런데 이윽고 곧 결국 그러자 한편 이내 그러나 그러므로 게다가 다만 오히려 어느새 마침내 그제야 그래도
  '''),
  interjections: words(r'''
    아, 오, 와, 어머, 이런, 저런, 세상에, 아이고, 참, 어이쿠, 아이참, 어라, 우와, 이야,
  '''),
  // Korean leaves the subject out as readily as it writes 그것, and the empty
  // Korean counts anything, because a classifier is what makes a noun countable:
  // `가지` turns an abstraction into kinds of it. The counter is spaced off the
  // number, which is what 한글 맞춤법 prescribes as the default.
  numeral: const SentenceNumeral(
    order: NumeralOrder.after,
    counters: <NounClass, String>{
      NounClass.creature: '마리',
      NounClass.person: '명',
      NounClass.plant: '그루',
      NounClass.edible: '개',
      NounClass.thing: '개',
      NounClass.vehicle: '대',
      NounClass.place: '곳',
      NounClass.event: '번',
      NounClass.idea: '가지',
      NounClass.body: '개',
    },
    count: LengthRange(2, 12),
    currency: '원',
    amounts: <int>[1000, 5000, 10000, 30000, 50000, 100000, 300000, 500000, 1000000],
    group: ',',
    gap: '',
  ),
  // entry is how the data says so.
  pronouns: const <WordGender, WordPool>{
    WordGender.n: <String>['', '그것'],
  },
  pronounless: const <NounClass>[NounClass.person],
  // Korean writes a date largest to smallest and a clock the same way, and its
  // copula is written onto the end of what it equates the subject to. Both close
  // on a coda — `일`, `분` — so `이다` never has to contract to `다`.
  calendar: SentenceCalendar(
    date: 'Y년 M월 D일',
    clock: 'h시 mm분',
    years: LengthRange(2020, 2030),
    copula: StateGroup(
      // An event is a thing that happens on a day, and a lion is not.
      subject: <NounClass>[NounClass.event],
      words: <String>['이다'],
      forms: <PredicateForm, WordPool>{
        PredicateForm.question: <String>['이니|인가'],
        PredicateForm.exclamation: <String>['이구나|이네'],
        PredicateForm.casual: <String>['이야|이지'],
        PredicateForm.polite: <String>['이에요|이죠'],
        PredicateForm.formal: <String>['입니다'],
        PredicateForm.formalQuestion: <String>['입니까'],
      },
    ),
  ),
  frames: const <SentenceFrame>[
    // A date and a clock, standing where an adverbial stands.
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.date, tail: '에'),
      SentencePart(SentenceSlot.subject, tail: '가', tailAlt: '이', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.clock, tail: '에'),
      SentencePart(SentenceSlot.subject, tail: '가', tailAlt: '이', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    // And the shape that equates the subject to one: `면접은 2026년 9월 5일이다.`
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: '는', tailAlt: '은'),
      SentencePart(SentenceSlot.date, copula: CopulaSide.tail),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: '는', tailAlt: '은'),
      SentencePart(SentenceSlot.clock, copula: CopulaSide.tail),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: '가', tailAlt: '이', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 20),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: '가', tailAlt: '이', modifiable: true),
      SentencePart(SentenceSlot.object, tail: '를', tailAlt: '을', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 18),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: '가', tailAlt: '이', modifiable: true),
      SentencePart(SentenceSlot.place, tail: '에서', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 14),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: '는', tailAlt: '은', modifiable: true),
      SentencePart(SentenceSlot.state),
    ], 12),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: '가', tailAlt: '이', modifiable: true),
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.verb),
    ], 10),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, tail: '가', tailAlt: '이', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 8),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: '가', tailAlt: '이', modifiable: true),
      SentencePart(SentenceSlot.place, tail: '에서', modifiable: true),
      SentencePart(SentenceSlot.object, tail: '를', tailAlt: '을', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 7),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time),
      SentencePart(SentenceSlot.subject, tail: '가', tailAlt: '이', modifiable: true),
      SentencePart(SentenceSlot.place, tail: '에서', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: '가', tailAlt: '이', modifiable: true),
      SentencePart(SentenceSlot.manner),
      SentencePart(SentenceSlot.object, tail: '를', tailAlt: '을', modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    // Korean asks with a different ending on the same predicate, so the shapes
    // are the statement's and the question forms do the rest.
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: '가', tailAlt: '이', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      20,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: '가', tailAlt: '이', modifiable: true),
        SentencePart(SentenceSlot.object, tail: '를', tailAlt: '을', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      16,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: '는', tailAlt: '은', modifiable: true),
        SentencePart(SentenceSlot.state),
      ],
      14,
      mood: SentenceMood.question,
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, tail: '가', tailAlt: '이', modifiable: true),
        SentencePart(SentenceSlot.place, tail: '에서', modifiable: true),
        SentencePart(SentenceSlot.verb),
      ],
      12,
      mood: SentenceMood.question,
    ),
    // A count and an amount. Money is an object of the verbs that take an idea,
    // which is the class it belongs to.
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: '가', tailAlt: '이', modifiable: true),
      SentencePart(SentenceSlot.quantity, tail: '를', tailAlt: '을'),
      SentencePart(SentenceSlot.verb),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.quantity, tail: '가', tailAlt: '이'),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, tail: '가', tailAlt: '이', modifiable: true),
      SentencePart(SentenceSlot.money, tail: '를', tailAlt: '을'),
      SentencePart(SentenceSlot.verb),
    ], 5),
  ],
);
