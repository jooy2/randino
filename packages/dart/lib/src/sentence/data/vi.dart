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
  pastMark: const SentencePastMark(head: 'đã'),
  verbs: <VerbGroup>[
    VerbGroup(
      field: VerbField.rise,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'thức_dậy tỉnh_giấc đứng_lên ngồi_dậy'),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'đi chạy hướng lên_đường rảo_bước'),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'rời_đi khởi_hành ra_đi ra_ngoài'),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'trở_về về_đến tới đến về_tới'),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'quay_về trở_lại về_nhà'),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'chạy đi_bộ nhảy bơi bay bò lang_thang đi_qua dạo_chơi đi_dạo'),
    ),
    VerbGroup(
      field: VerbField.wait,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'chờ trốn nhìn_quanh ngập_ngừng dừng_lại đứng_yên'),
    ),
    VerbGroup(
      field: VerbField.rest,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'nghỉ_ngơi ngồi nằm tựa cuộn_mình ngả_lưng'),
    ),
    VerbGroup(
      field: VerbField.sleep,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'ngủ thiếp_đi chợp_mắt ngủ_say'),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'cười khóc ngáp thở_dài mỉm_cười ngâm_nga lầm_bầm la_lên'),
    ),
    VerbGroup(
      field: VerbField.play,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'nhảy_múa hát lăn_lộn nô_đùa tung_tăng vui_chơi'),
    ),
    VerbGroup(
      field: VerbField.think,
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'nhớ quên tưởng_tượng đếm nhớ_lại nhớ_về'),
    ),
    VerbGroup(
      field: VerbField.look,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'nhìn ngắm ngó xem_xét chạm vuốt_ve săm_soi'),
    ),
    VerbGroup(
      field: VerbField.search,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'tìm_kiếm lục_lọi tìm_quanh sục_sạo'),
    ),
    VerbGroup(
      field: VerbField.find,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'tìm_thấy phát_hiện nhặt_được tìm_ra'),
    ),
    VerbGroup(
      field: VerbField.take,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'chọn cầm nắm lấy nhặt nhận'),
    ),
    VerbGroup(
      field: VerbField.carry,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'mang đem_về khiêng ôm mang_về'),
    ),
    VerbGroup(
      field: VerbField.hide,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'giấu cất giữ chôn cất_kỹ'),
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'làm xây chạm_khắc vẽ đan lắp_ráp'),
    ),
    VerbGroup(
      field: VerbField.tend,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'sửa lau đánh_bóng chỉnh_sửa sắp_xếp tu_sửa'),
    ),
    VerbGroup(
      field: VerbField.sell,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'bán bán_đi trao nhượng_lại'),
    ),
    VerbGroup(
      field: VerbField.buy,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle, NounClass.edible],
      words: words(r'mua mua_về sắm đặt_mua'),
    ),
    VerbGroup(
      field: VerbField.cook,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'nướng hâm_nóng nấu chế_biến thái bày'),
    ),
    VerbGroup(
      field: VerbField.eat,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'ăn nhai nếm gặm ăn_hết'),
    ),
    VerbGroup(
      field: VerbField.drink,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r'uống nhấp uống_cạn thưởng_thức'),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.place],
      words: words(r'yên_tĩnh_lại tối_dần sáng_lên đông_vui_lên lặng_đi rực_sáng'),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      words: words(r'tỏa_sáng chảy sâu_thêm bắt_đầu kết_thúc kéo_dài trôi_qua'),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'lung_lay lấp_lánh rơi lăn nghiêng cũ_đi'),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'chạy dừng_lại đi_qua trở_về khởi_hành trượt'),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'lan_ra biến_mất còn_lại trôi đậm_thêm'),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.plant],
      words: words(r'mọc héo nở đung_đưa vươn_lên'),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.body],
      words: words(r'run động tê cứng_lại'),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      words: words(r'chín nguội sôi tan hỏng'),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'to nhỏ nhanh chậm im_lặng ồn_ào dũng_cảm lười bận dữ hiền thông_minh'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'đói đói_bụng'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.full,
      words: words(r'no no_nê'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'mệt buồn_ngủ mệt_mỏi uể_oải'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.rested,
      words: words(r'sảng_khoái khoan_khoái tràn_đầy_sức_sống'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'vui hạnh_phúc hài_lòng vui_vẻ thoải_mái'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'buồn_chán tò_mò bồn_chồn lo_lắng'),
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
      words: words(r'đẹp lạ mới phổ_biến hiếm'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'rộng hẹp yên_tĩnh sâu tối sáng xa dốc'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'cứng nhẹ nặng cũ trơn trong_suốt chắc'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'ngọt mặn cay chua nóng lạnh bùi'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'đơn_giản rõ_ràng mơ_hồ vĩnh_cửu thoáng_qua'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'xanh um_tùm thơm héo_úa'),
    ),
    StateGroup(subject: const <NounClass>[NounClass.body], words: words(r'ấm lạnh đau cứng')),
  ],
  modifiers: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        dũng_cảm hiền_lành chăm_chỉ lười_biếng nhút_nhát thông_minh trẻ già nhỏ to hoạt_bát
        thong_thả nhanh_nhẹn hiếu_kỳ
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.person],
      words: words(r'trẻ tốt_bụng nghiêm_khắc nghiêm_túc bận_rộn tận_tâm'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature],
      words: words(r'nhanh_nhẹn hung_dữ hiền nhỏ_bé mập_mạp'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.food],
      words: words(r'ngọt cay ấm tươi giòn thơm nóng mặn mềm chín ngon_lành'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.drink],
      words: words(r'ngọt ấm lạnh mát nóng thơm tươi đậm'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'cũ mới nhỏ to nhẹ nặng sáng_bóng nhẵn trong_suốt cứng đẹp quý cổ'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'nhanh chậm chắc_chắn'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        yên_tĩnh rộng tối sáng lạ cũ ấm_cúng vắng_vẻ đông_đúc xa gần trống_trải hiu_quạnh đầy_nắng
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'xanh um_tùm thơm non héo cao nhỏ tươi'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'mờ_nhạt cũ mới lạ rõ_ràng quý_giá nhỏ kỳ_lạ'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.event],
      words: words(r'dài ngắn yên_ả nắng âm_u ồn_ào bất_ngờ'),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'nhỏ lạnh ấm mảnh_mai khỏe'),
    ),
    ModifierGroup(
      subject: const <NounClass>[
        NounClass.creature,
        NounClass.person,
        NounClass.plant,
        NounClass.thing,
        NounClass.vehicle,
        NounClass.place,
        NounClass.event,
        NounClass.idea,
        NounClass.body,
      ],
      words: words(r'đẹp bí_ẩn lạ mới'),
    ),
  ],
  manners: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        lặng_lẽ chậm_rãi nhanh_chóng nhẹ_nhàng khẽ một_mình một_lát mạnh_mẽ cẩn_thận háo_hức từ_từ
        vội_vã êm_ái chăm_chú thản_nhiên vui_vẻ bình_thản hối_hả kiên_nhẫn thong_thả hớn_hở
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[
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
        lặng_lẽ chậm_rãi từ_từ đột_nhiên khẽ lại đều_đặn dần_dần vẫn mãi nhẹ_nhàng chầm_chậm dần
      '''),
    ),
  ],
  times: SentenceTimes(
    day: words(r'''
      lúc_bình_minh sáng_sớm vào_buổi_sáng gần_trưa vào_buổi_trưa vào_buổi_chiều lúc_hoàng_hôn
      vào_buổi_tối vào_ban_đêm đêm_khuya lúc_nửa_đêm
    '''),
    any: words(r'''
      vào_mùa_xuân vào_mùa_hè vào_mùa_thu vào_mùa_đông vào_cuối_tuần vào_ngày_lễ cả_ngày
    '''),
    past: words(r'hôm_qua tuần_trước ngày_xưa hôm_ấy đêm_qua'),
    present: words(r'hôm_nay vừa_rồi ngày_mai tuần_sau'),
    habitual: words(r'dạo_này đôi_khi mỗi_ngày mỗi_tối'),
  ),
  homes: words(r'nhà'),
  join: const SentenceJoin(word: 'rồi'),
  connectives: <ConnectiveKind, WordPool>{
    ConnectiveKind.additive: words(r'ngoài_ra hơn_nữa'),
    ConnectiveKind.temporal: words(
      r'rồi và_rồi sau_đó cuối_cùng sau_cùng thế_rồi đồng_thời lát_sau',
    ),
    ConnectiveKind.contrastive: words(r'nhưng tuy_vậy tuy_nhiên dù_vậy'),
    ConnectiveKind.causal: words(r'thế_là vì_thế rốt_cuộc'),
  },
  interjections: words(
    r'ôi, chà, ồ, trời_ơi, chao_ôi, này, thật_đấy, ái_chà, ê, ơ_kìa, khiếp, ối,',
  ),
  pronouns: const <WordGender, WordPool>{
    WordGender.n: <String>['', 'nó'],
  },
  pronounless: const <NounClass>[NounClass.person],
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
  calendar: SentenceCalendar(
    date: 'ngày D tháng M năm Y',
    clock: 'h giờ mm',
    years: const LengthRange(2020, 2030),
    copula: StateGroup(subject: const <NounClass>[NounClass.event], words: <String>['là']),
  ),
  frames: const <SentenceFrame>[
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
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, head: 'đến', modifiable: true),
      ],
      8,
      fields: <VerbField>[VerbField.go],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, modifiable: true),
      ],
      8,
      fields: <VerbField>[VerbField.arrive],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.time, tail: ','),
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, head: 'đến', modifiable: true),
      ],
      4,
      fields: <VerbField>[VerbField.go],
    ),
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb),
        SentencePart(SentenceSlot.destination, modifiable: true),
        SentencePart(SentenceSlot.manner),
      ],
      3,
      fields: <VerbField>[VerbField.arrive],
    ),
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
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time, tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.verb),
      SentencePart(SentenceSlot.object, modifiable: true),
    ], 4),
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
    SentenceFrame(
      <SentencePart>[
        SentencePart(SentenceSlot.subject, modifiable: true),
        SentencePart(SentenceSlot.verb, head: 'có'),
        SentencePart(SentenceSlot.destination, head: 'đến', modifiable: true),
      ],
      6,
      mood: SentenceMood.question,
      tag: 'không',
      fields: <VerbField>[VerbField.go],
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
