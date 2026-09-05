// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The sentence dataset for ko.
final SentenceLanguageData ko = SentenceLanguageData(
  space: ' ',
  capitalize: false,
  terminator: '.',
  // Plain declarative — the form a written statement takes, rather than the
  // polite 합니다체 a person would speak.
  verbs: <VerbGroup>[
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        달린다 걷는다 뛴다 헤엄친다 날아오른다 기어간다 돌아온다 떠난다 멈춘다 쉰다 잠잔다
        웃는다 운다 노래한다 춤춘다 하품한다 숨는다 기다린다 일어선다 앉는다 눕는다 뒹군다
        서성인다 지나간다 다가온다 뒤척인다 존다 두리번거린다 어슬렁댄다
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      words: words(r'''
        먹는다 마신다 씹는다 삼킨다 맛본다 굽는다 데운다
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        본다 바라본다 찾는다 줍는다 옮긴다 만진다 감춘다 지킨다 나른다 챙긴다 고른다
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        만든다 고친다 닦는다 판다 산다 손질한다
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'''
        꿈꾼다 기억한다 잊는다 상상한다 헤아린다
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        빛난다 흐른다 저문다 밝아온다 깊어진다 조용해진다 물든다
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        흔들린다 반짝인다 떨어진다 굴러간다 기울어진다 낡아간다
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        달린다 멈춘다 지나간다 돌아온다 출발한다 미끄러진다
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        번진다 사라진다 남는다 스며든다 되풀이된다 짙어진다
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        자란다 시든다 피어난다 흔들린다 뿌리내린다
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        떨린다 움직인다 저린다 굳는다
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        익는다 식는다 끓는다 녹는다 상한다 남는다
      '''),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        크다 작다 빠르다 느리다 조용하다 시끄럽다 용감하다 게으르다 부지런하다 배고프다 졸리다
        사납다 순하다 영리하다
      '''),
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
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        넓다 좁다 고요하다 깊다 어둡다 밝다 아득하다 가파르다
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        단단하다 가볍다 무겁다 낡았다 매끈하다 투명하다 튼튼하다
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        달다 짜다 맵다 시다 뜨겁다 차갑다 고소하다 담백하다
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        어렵다 쉽다 분명하다 흐릿하다 영원하다 덧없다
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        푸르다 무성하다 향기롭다 시들하다
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        따뜻하다 차갑다 아프다 뻣뻣하다
      '''),
    ),
  ],
  manners: words(r'''
      조용히 천천히 빠르게 가만히 슬며시 문득 함께 홀로 다시 계속 잠시 서서히 갑자기 언제나
      여전히 조심스레 힘차게 나란히 살며시 묵묵히 느긋하게 씩씩하게
    '''),
  times: words(r'''
      새벽에 아침에 낮에 저녁에 밤에 한밤중에 오늘 어제 내일 봄에 여름에 가을에 겨울에 주말에
      방금 가끔 매일 해질녘에 이른봄에 늦가을에
    '''),
  // What a sentence opens on when it follows another. Written whole, so a
  // language that wants a comma after its connective writes the comma.
  connectives: words(r'그리고 그래서 하지만 그런데 이윽고 곧 결국 그러자 한편 이내'),
  // Korean leaves the subject out as readily as it writes 그것, and the empty
  // entry is how the data says so.
  pronouns: const <WordGender, WordPool>{
    WordGender.n: <String>['', '그것'],
  },
  pronounless: const <NounClass>[NounClass.person],
  frames: const <SentenceFrame>[
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
  ],
);
