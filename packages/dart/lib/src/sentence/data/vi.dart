// Ported verbatim from the JavaScript package; see CLAUDE.md.

import 'package:randino/src/internal/parse.dart';
import 'package:randino/src/sentence/data/types.dart';
import 'package:randino/src/types.dart';
import 'package:randino/src/word/data/types.dart';

/// The sentence dataset for vi.
final SentenceLanguageData vi = SentenceLanguageData(
  space: ' ',
  capitalize: true,
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
  verbs: <VerbGroup>[
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        chạy đi_bộ nhảy bơi bay bò trở_về rời_đi dừng_lại nghỉ_ngơi ngủ cười khóc hát
        nhảy_múa trốn chờ đứng ngồi lăn lang_thang đi_qua đến_gần lắng_nghe
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      words: words(r'''
        ăn uống nhai nếm nướng hâm_nóng
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        nhìn tìm nhặt mang chạm giữ chọn di_chuyển thu_thập
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        làm sửa lau bán mua xây
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'''
        nhớ quên tưởng_tượng đếm
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        tỏa_sáng chảy tối_dần sáng_lên sâu_thêm lặng_đi
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        lung_lay lấp_lánh rơi lăn nghiêng cũ_đi
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        chạy dừng_lại đi_qua trở_về khởi_hành trượt
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        lan_ra biến_mất còn_lại trôi đậm_thêm
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        mọc héo nở đung_đưa vươn_lên
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        run động tê cứng_lại
      '''),
    ),
    VerbGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        chín nguội sôi tan hỏng
      '''),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        to nhỏ nhanh chậm im_lặng ồn_ào dũng_cảm lười bận đói buồn_ngủ dữ hiền
        thông_minh
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
        đẹp lạ mới phổ_biến hiếm
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        rộng hẹp yên_tĩnh sâu tối sáng xa dốc
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        cứng nhẹ nặng cũ trơn trong_suốt chắc
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        ngọt mặn cay chua nóng lạnh bùi
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        đơn_giản rõ_ràng mơ_hồ vĩnh_cửu thoáng_qua
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        xanh um_tùm thơm héo_úa
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        ấm lạnh đau cứng
      '''),
    ),
  ],
  manners: words(r'''
      lặng_lẽ chậm_rãi nhanh_chóng nhẹ_nhàng đột_nhiên khẽ lại cùng_nhau một_mình
      một_lát đều_đặn mạnh_mẽ cẩn_thận háo_hức
    '''),
  times: words(r'''
      lúc_bình_minh vào_buổi_sáng vào_buổi_trưa vào_buổi_chiều vào_ban_đêm hôm_nay hôm_qua
      ngày_mai vào_mùa_xuân vào_mùa_hè vào_mùa_thu vào_mùa_đông vào_cuối_tuần vừa_rồi
      đôi_khi mỗi_ngày lúc_hoàng_hôn
    '''),
  connectives: words(r'rồi và_rồi nhưng thế_là sau_đó cuối_cùng đồng_thời tuy_vậy'),
  interjections: words(r'ôi, chà, ồ, trời_ơi, chao_ôi, này, thật_đấy,'),
  pronouns: const <WordGender, WordPool>{
    WordGender.n: <String>['', 'nó'],
  },
  pronounless: const <NounClass>[NounClass.person],
  // Vietnamese puts the classifier in front of the noun and the number in front
  // of that, so the whole group reads `12 con mèo`.
  numeral: const SentenceNumeral(
    order: NumeralOrder.before,
    counters: <NounClass, String>{
      NounClass.creature: 'con',
      NounClass.person: 'người',
      NounClass.plant: 'cây',
      NounClass.edible: 'cái',
      NounClass.thing: 'cái',
      NounClass.vehicle: 'chiếc',
      NounClass.place: 'nơi',
      NounClass.event: 'lần',
      NounClass.idea: 'điều',
      NounClass.body: 'cái',
    },
    count: LengthRange(2, 12),
    currency: 'đồng',
    amounts: <int>[10000, 50000, 100000, 200000, 500000, 1000000, 5000000],
    group: '.',
    gap: ' ',
  ),
  // Vietnamese writes a date smallest to largest, with a word in front of every
  // part, and its copula as a word of its own.
  calendar: SentenceCalendar(
    date: 'ngày D tháng M năm Y',
    clock: 'h giờ mm',
    years: LengthRange(2020, 2030),
    copula: StateGroup(
      // An event is a thing that happens on a day, and a lion is not.
      subject: <NounClass>[NounClass.event],
      words: <String>['là'],
    ),
  ),
  frames: const <SentenceFrame>[
    // A date and a clock, standing where an adverbial stands.
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.date, head: 'vào', tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.clock, head: 'lúc', tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 5),
    // And the shape that equates the subject to one: `Trận đấu là 11 giờ 40.`
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.date, copula: CopulaSide.head),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.clock, copula: CopulaSide.head),
    ], 4),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 20),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
    ], 18),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.place, head: 'trong', modifiable: true),
    ], 14),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, head: 'rất'),
    ], 12),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.manner),
    ], 10),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time, tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
    ], 8),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
      SentencePart(SentenceSlot.place, head: 'trong', modifiable: true),
    ], 7),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time, tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.place, head: 'trong', modifiable: true),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
      SentencePart(SentenceSlot.manner),
    ], 5),
    // Vietnamese wraps the predicate: có in front of it, không after the clause.
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb, head: 'có'),
      ],
      20,
      mood: SentenceMood.question,
      tag: 'không',
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb, head: 'có'),
        SentencePart(SentenceSlot.object, modifiable: true),
      ],
      16,
      mood: SentenceMood.question,
      tag: 'không',
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.state, head: 'có'),
      ],
      14,
      mood: SentenceMood.question,
      tag: 'không',
    ),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.quantity),
    ], 6),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.quantity),
      SentencePart(SentenceSlot.verb),
    ], 5),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.money),
    ], 5),
  ],
);
