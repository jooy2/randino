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
      words: words(r'''
        thức_dậy tỉnh_giấc đứng_lên ngồi_dậy tỉnh_dậy thức_giấc bật_dậy vươn_vai mở_mắt choàng_tỉnh
        trở_dậy
      '''),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'đi hướng lên_đường tiến bước dạo_bước lê_bước lần_mò tiến_bước đi_thẳng'),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      requires: SentenceSlot.destination,
      words: words(r'''
        chạy rảo_bước chạy_vội bước_nhanh đi_bộ leo trèo lao vọt phóng nhảy_lò_cò bước_vội rảo_chân
      '''),
    ),
    VerbGroup(
      field: VerbField.go,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        rời_đi khởi_hành ra_đi ra_ngoài đi_khỏi bỏ_đi rời_bước cất_bước xuất_phát lẻn_đi chuồn_đi
        đi_mất đi_ra biến_đi ra_khỏi_nhà rong_ruổi
      '''),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      requires: SentenceSlot.destination,
      words: words(r'''
        trở_về về_đến tới đến về_tới quay_lại trở_lại về ghé_đến ghé_tới đi_tới tìm_đến tìm_về
        chạy_về chạy_đến chạy_tới về_lại đến_tận tới_tận
      '''),
    ),
    VerbGroup(
      field: VerbField.arrive,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        quay_về trở_lại về_nhà về_tới_nhà xuất_hiện ló_mặt trở_về_nhà quay_về_nhà đến_nơi tới_nơi
        có_mặt
      '''),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectWithout: const <NounTrait>[NounTrait.swimmer, NounTrait.crawler],
      words: words(r'''
        chạy đi_bộ nhảy dạo_chơi đi_dạo chạy_bộ chạy_chậm chạy_nhanh đi_lại bước_đi nhảy_nhót
        diễu_hành đi_nhón_chân lững_thững thong_dong sải_bước đi_khập_khiễng nhảy_cẫng chạy_lon_ton
        chạy_tán_loạn chạy_vòng_quanh bước_dài đi_loanh_quanh chạy_nhảy
      '''),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        lang_thang đi_qua di_chuyển xoay_người lượn_lờ lượn xê_dịch lùi_lại tiến_lên qua_lại
        đi_tới_đi_lui lướt_qua vượt_qua phiêu_bạt đảo_quanh
      '''),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.swimmer],
      words: words(r'bơi bơi_lội lặn nổi ngoi_lên bơi_qua bơi_lượn quẫy vẫy_vùng bơi_đi lội'),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature],
      subjectTraits: const <NounTrait>[NounTrait.flier],
      words: words(r'''
        bay cất_cánh bay_lên vỗ_cánh liệng chao_liệng sà_xuống đậu hạ_cánh bay_đi bay_qua bay_lượn
        bay_vút vút_lên bay_vòng_quanh
      '''),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      subjectTraits: const <NounTrait>[NounTrait.crawler],
      words: words(r'''
        bò trườn bò_lê ngoằn_ngoèo uốn_éo cuộn_mình chui_rúc bò_qua bò_lên bò_ra lết
      '''),
    ),
    VerbGroup(
      field: VerbField.wait,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        chờ trốn nhìn_quanh ngập_ngừng dừng_lại đứng_yên lắng_nghe nín_thở đợi chờ_đợi nán_lại
        lưỡng_lự do_dự chần_chừ rình núp nấp ngó_nghiêng dòm_ngó đứng_chờ ngồi_chờ lấp_ló thập_thò
        canh_chừng đứng_im rình_rập lần_lữa
      '''),
    ),
    VerbGroup(
      field: VerbField.rest,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        nghỉ_ngơi ngồi nằm tựa cuộn_mình ngả_lưng nghỉ ngồi_xuống nằm_xuống ngồi_bệt ngồi_xổm quỳ
        nằm_dài nằm_sấp nằm_ngửa dựa dựa_lưng thư_giãn duỗi_chân nghỉ_chân thở_dốc lấy_hơi
        nghỉ_giải_lao xả_hơi nằm_nghỉ nằm_lăn_ra
      '''),
    ),
    VerbGroup(
      field: VerbField.sleep,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        ngủ thiếp_đi chợp_mắt ngủ_say ngủ_trưa ngủ_gật ngủ_gà_ngủ_gật ngủ_quên ngủ_thiếp ngủ_lịm mơ
        nằm_mơ ngáy chìm_vào_giấc_ngủ nhắm_mắt lịm_đi thiu_thiu_ngủ ngủ_khì ngủ_nướng
      '''),
    ),
    VerbGroup(
      field: VerbField.express,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        cười khóc ngáp thở_dài mỉm_cười ngâm_nga lầm_bầm la_lên cười_khúc_khích cười_khẩy
        cười_toe_toét cười_phá_lên nức_nở sụt_sịt rên_rỉ càu_nhàu lẩm_bẩm huýt_sáo reo_hò hét la_hét
        thở_hắt_ra nhún_vai gật_đầu lắc_đầu cau_mày nhăn_mặt hắt_hơi nấc vỗ_tay nháy_mắt đỏ_mặt
        vẫy_tay rưng_rưng hò_reo thút_thít cười_ngặt_nghẽo
      '''),
    ),
    VerbGroup(
      field: VerbField.talk,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        trò_chuyện nói_chuyện tán_gẫu nói chuyện_trò hàn_huyên tâm_sự thì_thầm thì_thào rì_rầm
        líu_lo ba_hoa buôn_chuyện chào_hỏi bắt_chuyện chuyện_phiếm tán_dóc trao_đổi kể_chuyện
        huyên_thuyên
      '''),
    ),
    VerbGroup(
      field: VerbField.play,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        nhảy_múa hát lăn_lộn nô_đùa tung_tăng vui_chơi chơi chơi_đùa đùa_giỡn giỡn đùa_nghịch
        nghịch_ngợm quay_tròn xoay_tròn lộn_nhào nhào_lộn trốn_tìm đá_bóng nghịch_nước chạy_giỡn
        tung_hứng bày_trò leo_trèo lăn_qua_lăn_lại
      '''),
    ),
    VerbGroup(
      field: VerbField.think,
      subject: const <NounClass>[NounClass.person, NounClass.creature],
      object: const <NounClass>[NounClass.idea, NounClass.event, NounClass.place],
      words: words(r'''
        nhớ quên tưởng_tượng đếm nhớ_lại nhớ_về nghĩ nghĩ_về nghĩ_đến suy_nghĩ_về ngẫm hồi_tưởng
        lo_lắng_về tin tin_vào mong_đợi hiểu thấu_hiểu mơ_về mơ_thấy khao_khát nhung_nhớ mong_nhớ
        hoài_niệm nghiền_ngẫm ngẫm_nghĩ_về cân_nhắc hình_dung mường_tượng nhớ_mãi
      '''),
    ),
    VerbGroup(
      field: VerbField.look,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        nhìn ngắm ngó xem_xét chạm vuốt_ve săm_soi trông nhìn_ngắm nhìn_kỹ ngắm_nghía nhìn_chằm_chằm
        quan_sát soi liếc lườm dòm nhìn_lướt_qua kiểm_tra sờ sờ_mó mó vỗ gõ ngửi cầm_lên_xem lật_xem
        ngó_nghiêng nâng_niu mân_mê chiêm_ngưỡng
      '''),
    ),
    VerbGroup(
      field: VerbField.search,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        tìm_kiếm lục_lọi tìm_quanh sục_sạo tìm lục moi_móc bới dò_dẫm mò_mẫm lùng_sục dò_tìm thăm_dò
        khám_phá rình_mò đảo_mắt_tìm tìm_tòi bới_móc lục_tung
      '''),
    ),
    VerbGroup(
      field: VerbField.find,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        tìm_thấy phát_hiện nhặt_được tìm_ra tìm_được bắt_gặp vớ_được lượm_được moi_ra lôi_ra
        đào_được vớt_được nhặt tìm_lại tìm_lại_được bới_ra khám_phá_ra thấy trông_thấy nhìn_thấy
        lượm
      '''),
    ),
    VerbGroup(
      field: VerbField.take,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        chọn cầm nắm lấy nhặt nhận cầm_lấy nắm_lấy giữ giữ_lấy chộp chộp_lấy vớ vớ_lấy tóm tóm_lấy
        nhấc nhấc_lên nâng nâng_lên gom gom_góp thu_thập lựa lựa_chọn chọn_lấy đón_lấy nhận_lấy bốc
        hái ngoạm giật_lấy ôm_lấy bê bê_lên xách_lên
      '''),
    ),
    VerbGroup(
      field: VerbField.carry,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        mang đem_về khiêng ôm mang_về mang_theo mang_đi đem đem_đi đem_theo xách xách_theo vác
        vác_theo cõng gánh bưng bế kéo lôi đẩy tha tha_về chở vận_chuyển khuân khuân_về chuyển
        đưa_về mang_tới đem_tới lôi_theo kéo_theo
      '''),
    ),
    VerbGroup(
      field: VerbField.hide,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        giấu cất giữ chôn cất_kỹ giấu_kín giấu_đi cất_đi cất_giữ cất_vào lưu_giữ bảo_quản tích_trữ
        dự_trữ để_dành dành_dụm nhét_vào đút_vào bỏ_vào đậy che che_giấu phủ bọc gói_lại bọc_lại vùi
        giữ_gìn canh_giữ trông_coi gìn_giữ xếp_vào chôn_giấu giữ_kỹ giấu_kỹ
      '''),
    ),
    VerbGroup(
      field: VerbField.lose,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.plant, NounClass.edible],
      words: words(r'''
        làm_mất đánh_rơi bỏ_quên mất làm_rơi đánh_mất để_quên để_lạc bỏ_sót làm_lạc để_rơi rơi_mất
        thất_lạc quên_mất tuột_mất đánh_rớt
      '''),
    ),
    VerbGroup(
      field: VerbField.meet,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.person],
      words: words(r'''
        gặp gặp_gỡ chào gặp_lại bắt_gặp tình_cờ_gặp đụng_mặt chạm_mặt thăm ghé_thăm đến_thăm
        viếng_thăm đón đón_tiếp chào_đón tiếp_đón chào_hỏi vẫy_chào ôm ôm_chầm gặp_mặt hội_ngộ
        làm_quen hẹn_gặp
      '''),
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        làm xây chạm_khắc vẽ đan lắp_ráp chế_tạo tạo_ra làm_ra chế_tác sáng_tạo thiết_kế dựng
        dựng_lên xây_dựng ghép lắp lắp_đặt nặn tạo_hình hoàn_thành hoàn_thiện trang_trí tô_điểm
        phác_họa vẽ_nên tạo_nên gọt tạc điêu_khắc làm_nên chế
      '''),
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      objectThemes: const <WordTheme>[WordTheme.object, WordTheme.tool, WordTheme.vehicle],
      words: words(r'''
        rèn đúc hàn đóng đóng_đinh tán_đinh ghép_nối bắt_vít gia_công tiện phay bào
      '''),
    ),
    VerbGroup(
      field: VerbField.make,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing],
      objectThemes: const <WordTheme>[WordTheme.clothing],
      words: words(r'may khâu thêu dệt đan_len cắt_may đơm_khuy lên_gấu'),
    ),
    VerbGroup(
      field: VerbField.tend,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        sửa lau đánh_bóng chỉnh_sửa sắp_xếp tu_sửa sửa_chữa sửa_sang chùi lau_chùi cọ cọ_rửa rửa
        giặt phơi phơi_khô hong_khô quét_dọn dọn dọn_dẹp lau_bụi phủi_bụi tra_dầu bôi_dầu siết
        siết_chặt vặn_chặt điều_chỉnh chỉnh căn_chỉnh kiểm_tra bảo_dưỡng bảo_trì chăm_sóc chăm_chút
        giữ_gìn vá may_vá đánh_bóng_lại làm_mới tân_trang chải mài mài_sắc
      '''),
    ),
    VerbGroup(
      field: VerbField.sell,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        bán bán_đi trao nhượng_lại bán_lại bán_hết bán_tống bán_rao rao_bán chào_bán đem_bán
        mang_bán bày_bán trưng_bày đổi trao_đổi giao giao_cho đưa_cho chuyển_nhượng đấu_giá ra_giá
        định_giá mặc_cả thanh_lý sang_tay nhượng
      '''),
    ),
    VerbGroup(
      field: VerbField.buy,
      subject: const <NounClass>[NounClass.person],
      object: const <NounClass>[NounClass.thing, NounClass.vehicle, NounClass.edible],
      words: words(r'''
        mua mua_về sắm đặt_mua mua_lấy mua_sắm sắm_sửa tậu mua_thêm mua_được chọn_mua đặt đặt_hàng
        đặt_trước trả_tiền_mua mua_vội mua_hết vét mua_gom mua_lại chi_tiền_mua mua_ngay
      '''),
    ),
    VerbGroup(
      field: VerbField.cook,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        nướng hâm_nóng nấu chế_biến thái bày rán chiên xào luộc hấp hầm kho ninh om rang quay
        nấu_chín làm_chín trộn ướp nêm nêm_nếm thêm_gia_vị rắc_muối đảo khuấy lật múc múc_ra dọn
        dọn_ra bày_biện chuẩn_bị hâm hâm_lại làm_nóng thái_nhỏ băm xắt gọt gọt_vỏ rửa_sạch sơ_chế
        nấu_nướng nấu_xong nướng_chín chiên_giòn áp_chảo
      '''),
    ),
    VerbGroup(
      field: VerbField.eat,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        ăn nhai nếm gặm ăn_hết ăn_sạch ăn_xong nếm_thử ăn_thử cắn cắn_một_miếng nhai_ngấu_nghiến
        ngấu_nghiến nuốt nuốt_chửng liếm gặm_nhấm nhấm_nháp thưởng_thức ăn_ngon_lành ăn_từ_từ ăn_no
        ăn_lấy_ăn_để ăn_vội xơi chén đớp tọng ăn_ngon xực nhồm_nhoàm húp
      '''),
    ),
    VerbGroup(
      field: VerbField.drink,
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      object: const <NounClass>[NounClass.edible],
      objectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r'''
        uống nhấp uống_cạn thưởng_thức uống_hết uống_xong uống_thử nhấp_môi nhấp_một_ngụm nhấp_nháp
        nhâm_nhi uống_một_ngụm hớp uống_ừng_ực tu tu_một_hơi uống_cạn_sạch uống_từ_từ uống_vội nốc
        uống_một_hơi húp uống_dần chiêu
      '''),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        yên_tĩnh_lại tối_dần sáng_lên đông_vui_lên lặng_đi rực_sáng thức_giấc chìm_vào_giấc_ngủ
        lặng_im im_ắng im_lìm trở_nên_yên_tĩnh náo_nhiệt_lên nhộn_nhịp_lên rộn_ràng_lên ồn_ào_lên
        vắng_dần vắng_lặng trống_trải trống_không đầy_người đông_nghịt lấp_lánh lung_linh sáng_rực
        đóng_băng tan_băng ướt_sũng khô_cạn chìm_trong_sương chìm_vào_bóng_tối bừng_sáng thay_đổi
        đổi_thay bừng_tỉnh nhộn_nhịp tấp_nập sôi_động_lên sáng_dần sáng_bừng tối_sầm hửng_sáng
      '''),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      words: words(r'''
        tỏa_sáng chảy sâu_thêm bắt_đầu kết_thúc kéo_dài trôi_qua tiếp_tục tiếp_diễn dừng qua_đi
        sắp_đến đến_gần cận_kề tới_gần lùi_xa lắng_xuống dịu_đi mở_ra diễn_ra kéo_dài_thêm lặp_lại
        tái_diễn khép_lại tàn dần_tàn tan_dần dần_kết_thúc trôi_đi ngưng
      '''),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.time],
      words: words(r'''
        rạng_sáng hửng_sáng ngả_chiều xế_bóng trôi xuống_dần lên_dần sang chuyển_mùa sắp_tàn
        len_lỏi_đến lặng_lẽ_đến buông_xuống chầm_chậm_trôi chuyển_dần chín_muồi trở_mình đổi_mùa
      '''),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.weather],
      words: words(r'''
        kéo_đến ập_đến ùa_về tràn_về đổ_xuống trút_xuống tan ngớt tạnh dứt dịu_bớt mạnh_lên
        dữ_dội_hơn bao_phủ giăng_giăng tràn_qua lướt_qua rời_đi quang_dần nổi_lên dấy_lên lan_ra
      '''),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.event],
      subjectThemes: const <WordTheme>[WordTheme.sport],
      words: words(r'''
        khai_mạc khởi_tranh mở_màn hạ_màn bế_mạc tạm_dừng tạm_hoãn tiếp_tục_lại nóng_lên sôi_động
        gay_cấn_hơn kết_thúc_sớm kéo_dài_hơn vào_hồi_gay_cấn được_tổ_chức
      '''),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      subjectThemes: const <WordTheme>[
        WordTheme.object,
        WordTheme.tool,
        WordTheme.clothing,
        WordTheme.product,
        WordTheme.gem,
        WordTheme.vehicle,
      ],
      words: words(r'''
        lung_lay lấp_lánh rơi lăn nghiêng cũ_đi sáng_lên lóe_sáng sáng_lấp_lánh đung_đưa đu_đưa
        lắc_lư rung rung_rinh chao_đảo trượt trượt_xuống rơi_xuống đổ đổ_xuống ngã lật lật_nhào
        lăn_xuống lăn_tròn quay xoay xoay_tròn dừng_lại đứng_yên di_chuyển dịch_chuyển phai_màu
        bạc_màu sờn mòn cũ_kỹ_đi phủ_bụi bám_bụi mờ_đi xỉn_màu biến_dạng cong cong_vênh bay_đi
        bay_lên nảy nảy_lên bật_lên run_rẩy rung_lắc
      '''),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      subjectThemes: const <WordTheme>[WordTheme.object, WordTheme.tool, WordTheme.vehicle],
      words: words(r'''
        gỉ rỉ_sét han_gỉ kêu_cót_két kêu_kẽo_kẹt kêu_lạch_cạch kêu_leng_keng hỏng hư hư_hỏng vỡ
        vỡ_tan vỡ_vụn nứt nứt_toác gãy gãy_đôi lật_úp kẹt mắc_kẹt long_ra lỏng_lẻo rời_ra rã_rời
        bốc_khói trục_trặc
      '''),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.thing],
      subjectThemes: const <WordTheme>[WordTheme.music],
      words: words(r'''
        vang_lên vang vọng vang_vọng ngân ngân_vang ngân_nga văng_vẳng vọng_lại phát_ra cất_lên
        trỗi_dậy nổi_lên tắt_dần lịm_dần tan_dần dứt ngưng_bặt to_dần nhỏ_dần lặp_lại kéo_dài
        tiếp_tục vấn_vương lan_tỏa lan_xa trầm_xuống bổng_lên vút_lên ngân_dài
      '''),
    ),
    VerbGroup(
      field: VerbField.move,
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        chạy dừng_lại đi_qua trở_về khởi_hành trượt lăn_bánh khởi_động nổ_máy chạy_đi rời_bến rời_ga
        rời_đi lướt_qua chạy_qua chạy_tới chạy_đến tiến_vào đi_vào chạy_ra tăng_tốc giảm_tốc
        chậm_lại rẽ ngoặt quay_đầu lùi lùi_lại đỗ đỗ_lại dừng cập_bến vào_ga tới_nơi đến_nơi
        rời_khỏi tiến_lên lao_đi phóng_đi phóng_nhanh xóc lắc_lư rung_lắc lướt_đi trượt_đi tiến_gần
        xa_dần tắt_máy bóp_còi bấm_còi lăn_chậm_lại lao_qua
      '''),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.idea, NounClass.event],
      words: words(r'''
        lan_ra biến_mất còn_lại trôi đậm_thêm lan_rộng lan_tỏa tan_biến tan_đi phai_nhạt nhạt_dần
        đậm_dần mạnh_lên yếu_đi dâng_lên dâng_trào trào_dâng trỗi_dậy hiện_lên hiện_ra ùa_về
        sống_lại trở_lại quay_lại lắng_xuống lắng_lại tích_tụ chồng_chất tràn_ngập bao_trùm
        quẩn_quanh lởn_vởn lóe_lên thoáng_qua bén_rễ nảy_nở nảy_sinh sinh_sôi nhen_nhóm dấy_lên
        dịu_đi dịu_xuống nguôi_ngoai dâng_cao hạ_nhiệt dao_động thăng_trầm kéo_dài tồn_tại đọng_lại
      '''),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        mọc héo nở đung_đưa vươn_lên nảy_mầm đâm_chồi nhú_mầm mọc_lên lớn_lên cao_lên trổ_hoa
        bung_nở nở_rộ khoe_sắc tàn tàn_úa úa khô_héo héo_úa vàng_úa ngả_vàng xanh_lại xanh_tươi_lên
        lay_động rung_rinh phất_phơ đu_đưa lả_lướt nghiêng_ngả vươn_dài vươn_ra bò_lan leo bám_rễ
        ăn_sâu ra_quả kết_trái đơm_trái chín tỏa_hương ngát_hương cúi_xuống rũ_xuống gục_xuống
        đứng_thẳng xum_xuê_lên rụng_lá trút_lá đâm_cành ra_lá kết_nụ ra_nụ chết_khô hồi_sinh
        xanh_trở_lại
      '''),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        run động tê cứng_lại run_rẩy run_lên rùng_mình co_giật giật nhói nhói_lên đau đau_nhức nhức
        nhức_mỏi mỏi ê_ẩm tê_dại ngứa ngứa_ngáy nóng_lên nóng_ran lạnh_đi lạnh_buốt ấm_lên thư_giãn
        thả_lỏng căng căng_cứng gồng_lên cứng_đờ duỗi_ra co_lại gập_lại đổ_mồ_hôi toát_mồ_hôi sưng
        sưng_lên sưng_tấy xẹp_xuống lành lành_lại hồi_phục khỏe_lại rã_rời nặng_trĩu nhẹ_bẫng đập
        đập_nhanh co_rúm duỗi_thẳng cúi_xuống nâng_lên buông_xuống chớp đảo xoay vung lắc rung_lên
        ngọ_nguậy dịu_lại
      '''),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        chín nguội sôi tan hỏng nguội_đi nguội_dần lạnh_đi ấm_lên nóng_lên ấm_dần nóng_dần bốc_khói
        bốc_hơi tỏa_khói tỏa_hương thơm_lừng dậy_mùi vơi_đi vơi_dần cạn hết còn_lại còn_dư dư_ra
        đầy_thêm được_dọn_ra được_bày_ra sẵn_sàng chín_tới đông_lại đặc_lại cứng_lại mềm_ra ôi thiu
        ôi_thiu lên_men đóng_băng sánh_lại loãng_ra lắng_xuống nổi_váng
      '''),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        cháy khét cháy_khét cháy_xém giòn giòn_rụm giòn_lên khô_lại ỉu ỉu_đi mốc lên_mốc chua_đi nở
        nở_phồng phồng_lên chín_kỹ chín_nhừ nhừ chín_vàng vàng_đều chín_đều ra_lò xong vụn_ra vỡ_vụn
        xẹp_xuống chảy_mỡ tơi_ra rã_ra
      '''),
    ),
    VerbGroup(
      field: VerbField.change,
      subject: const <NounClass>[NounClass.edible],
      subjectThemes: const <WordTheme>[WordTheme.drink],
      words: words(r'''
        sủi_bọt sủi nổi_bọt sủi_tăm nổi_bong_bóng tràn tràn_ra đổ_ra sánh sóng_sánh sánh_ra lắc_lư
        đục đục_đi trong_lại lắng_cặn nhạt_đi đậm_lên bay_hơi hết_ga xì_hơi nguội_ngắt loãng_đi
        ấm_nóng lạnh_ngắt
      '''),
    ),
  ],
  states: <StateGroup>[
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        to nhỏ nhanh chậm im_lặng ồn_ào dũng_cảm lười bận dữ hiền thông_minh trẻ già khỏe yếu
        bạo_dạn nhút_nhát e_thẹn kiêu_hãnh hoạt_bát điềm_tĩnh bướng_bỉnh nhanh_nhẹn cảnh_giác
        chắc_chắn thật_thà lanh_lợi
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.hungry,
      words: words(r'đói đói_bụng đói_meo đói_cồn_cào'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.full,
      words: words(r'no no_nê no_căng no_bụng'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.tired,
      words: words(r'mệt buồn_ngủ mệt_mỏi uể_oải kiệt_sức bơ_phờ rã_rời lử_khử'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.rested,
      words: words(r'sảng_khoái khoan_khoái tràn_đầy_sức_sống tỉnh_táo nhẹ_nhõm hăng_hái'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.content,
      words: words(r'''
        vui hạnh_phúc hài_lòng vui_vẻ thoải_mái hân_hoan mãn_nguyện an_lòng phấn_khởi sung_sướng
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      condition: Condition.restless,
      words: words(r'buồn_chán tò_mò bồn_chồn lo_lắng sốt_ruột nôn_nao thấp_thỏm băn_khoăn'),
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
        đẹp lạ mới phổ_biến hiếm đáng_yêu quen_thuộc kỳ_lạ bình_thường đặc_biệt quý_hiếm
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.place, NounClass.event],
      words: words(r'''
        rộng hẹp yên_tĩnh sâu tối sáng xa dốc đông_đúc vắng_vẻ chật_chội trống_trải bát_ngát
        thăm_thẳm mờ_tối bằng_phẳng dài ngắn rực_nắng
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        cứng nhẹ nặng cũ trơn trong_suốt chắc tròn dẹt nhọn mỏng dày mong_manh lộng_lẫy giản_dị
        tinh_xảo thô_ráp bóng_loáng
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.edible],
      words: words(r'''
        ngọt mặn cay chua nóng lạnh bùi đắng đậm nhạt âm_ấm ngon giòn mềm béo thanh_mát
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        đơn_giản rõ_ràng mơ_hồ vĩnh_cửu thoáng_qua phức_tạp sâu_sắc quen_thuộc quý_báu kín_đáo
        nhỏ_nhặt thú_vị khó dễ
      '''),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'xanh um_tùm thơm héo_úa cao non mảnh_khảnh xanh_mướt thưa_thớt rậm_rạp'),
    ),
    StateGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'ấm lạnh đau cứng mềm thô_ráp nhẵn xanh_xao khỏe tê nặng'),
    ),
  ],
  modifiers: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        dũng_cảm hiền_lành chăm_chỉ lười_biếng nhút_nhát thông_minh trẻ già nhỏ to hoạt_bát
        thong_thả nhanh_nhẹn hiếu_kỳ bạo_dạn e_dè thận_trọng bướng_bỉnh ngoan_ngoãn ầm_ĩ vạm_vỡ
        gầy_gò mũm_mĩm buồn_ngủ ranh_mãnh cảnh_giác lặng_lẽ kiêu_hãnh ngây_thơ thật_thà lanh_lợi
        điềm_đạm
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.person],
      words: words(r'''
        trẻ tốt_bụng nghiêm_khắc nghiêm_túc bận_rộn tận_tâm khôn_ngoan khiêm_tốn ít_nói hoạt_ngôn
        lành_nghề nổi_tiếng nghèo giàu ngay_thẳng hòa_nhã đứng_tuổi cởi_mở sắc_sảo
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature],
      words: words(r'''
        nhanh_nhẹn hung_dữ hiền nhỏ_bé mập_mạp lông_xù đốm_đốm vằn_vện gầy_nhom khổng_lồ khéo_léo
        tròn_trịa bóng_mượt thon_dài
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.food],
      words: words(r'''
        ngọt cay ấm tươi giòn thơm nóng mặn mềm chín ngon_lành vàng_ruộm thơm_lừng dẻo_thơm đậm_đà
        thanh_đạm mới_ra_lò nghi_ngút chua_ngọt béo_ngậy mộc_mạc
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.edible],
      themes: const <WordTheme>[WordTheme.drink],
      words: words(r'''
        ngọt ấm lạnh mát nóng thơm tươi đậm âm_ấm sủi_bọt trong_veo đục đắng nhạt chua_dịu nóng_hổi
        mát_lạnh
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.thing, NounClass.vehicle],
      words: words(r'''
        cũ mới nhỏ to nhẹ nặng sáng_bóng nhẵn trong_suốt cứng đẹp quý cổ han_gỉ sờn mòn đánh_bóng
        giản_dị lộng_lẫy thon_dài dẹt tròn nhọn mỏng dày mong_manh bụi_bặm cong tinh_xảo
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.vehicle],
      words: words(r'''
        nhanh chậm chắc_chắn kẽo_kẹt bóng_loáng han_gỉ lắc_lư đồ_sộ cũ_kỹ mới_tinh
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.place],
      words: words(r'''
        yên_tĩnh rộng tối sáng lạ cũ ấm_cúng vắng_vẻ đông_đúc xa gần trống_trải hiu_quạnh đầy_nắng
        chật_hẹp chen_chúc lộng_gió mù_sương râm_mát bụi_bặm ẩm_ướt lởm_chởm dốc bằng_phẳng
        hoang_vắng xanh_mướt thoáng_đãng
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.plant],
      words: words(r'''
        xanh um_tùm thơm non héo cao nhỏ tươi gai_góc nở_rộ chớm_nở leo hoang_dại mảnh_khảnh
        nhạt_màu rủ_xuống sum_suê
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.idea],
      words: words(r'''
        mờ_nhạt cũ mới lạ rõ_ràng quý_giá nhỏ kỳ_lạ nhạt_nhòa đơn_sơ rối_rắm dai_dẳng thoáng_qua
        xa_xôi táo_bạo thầm_kín lặng_lẽ quen_thuộc
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.event],
      words: words(r'''
        dài ngắn yên_ả nắng âm_u ồn_ào bất_ngờ linh_đình giản_dị trang_nghiêm vui_nhộn tẻ_nhạt
        mưa_gió lặng_gió tất_bật chen_chúc rộn_ràng
      '''),
    ),
    ModifierGroup(
      subject: const <NounClass>[NounClass.body],
      words: words(r'''
        nhỏ lạnh ấm mảnh_mai khỏe mềm_mại cứng_đờ ê_ẩm thô_ráp nhẵn_nhụi xanh_xao rắn_rỏi
      '''),
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
      words: words(r'đẹp bí_ẩn lạ mới đáng_yêu quen_mắt kỳ_quặc bình_dị tuyệt_vời mộc_mạc'),
    ),
  ],
  manners: <ModifierGroup>[
    ModifierGroup(
      subject: const <NounClass>[NounClass.creature, NounClass.person],
      words: words(r'''
        lặng_lẽ chậm_rãi nhanh_chóng nhẹ_nhàng khẽ một_mình một_lát mạnh_mẽ cẩn_thận háo_hức từ_từ
        vội_vã êm_ái chăm_chú thản_nhiên vui_vẻ bình_thản hối_hả kiên_nhẫn thong_thả hớn_hở rón_rén
        lấm_lét lững_thững hấp_tấp luống_cuống ngập_ngừng láo_liên loanh_quanh tỉ_mỉ trầm_ngâm cố_ý
        vô_tình bất_giác thoăn_thoắt thoắt_cái phăm_phăm lừ_đừ chậm_chạp đường_hoàng hãnh_diện
        ngượng_ngùng tươi_cười buồn_bã điềm_nhiên lặng_thinh cần_mẫn khéo_léo vụng_về liều_lĩnh
        chật_vật miễn_cưỡng tự_nhiên dịu_dàng thô_bạo lạnh_lùng say_sưa lí_nhí
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
        bất_chợt thoáng_chốc hồi_lâu suốt lạ_thường đặc_biệt hẳn hoàn_toàn nhàn_nhạt thoang_thoảng
        mờ_ảo rõ_rệt rành_rọt lờ_mờ dịu_dàng liên_tục không_ngừng từng_chút lớp_lớp khe_khẽ lắc_lư
        lấp_lánh rì_rào phập_phồng bồng_bềnh êm_đềm
      '''),
    ),
  ],
  times: SentenceTimes(
    day: words(r'''
      lúc_bình_minh sáng_sớm vào_buổi_sáng gần_trưa vào_buổi_trưa vào_buổi_chiều lúc_hoàng_hôn
      vào_buổi_tối vào_ban_đêm đêm_khuya lúc_nửa_đêm
    '''),
    any: words(r'''
      vào_mùa_xuân vào_mùa_hè vào_mùa_thu vào_mùa_đông vào_cuối_tuần vào_ngày_lễ cả_ngày đầu_xuân
      cuối_xuân đầu_hè giữa_hè cuối_hè đầu_thu cuối_thu giữa_đông cuối_đông vào_mùa_mưa vào_mùa_gặt
      vào_ngày_hội vào_ngày_chợ_phiên vào_đêm_trăng_tròn vào_ngày_mưa vào_ngày_nắng vào_ngày_gió
      vào_ngày_sương_mù vào_kỳ_nghỉ
    '''),
    past: words(r'''
      hôm_qua tuần_trước ngày_xưa hôm_ấy đêm_qua hôm_kia tháng_trước năm_ngoái năm_kia
      tuần_trước_nữa lâu_lắm_rồi mới_đây sáng_hôm_ấy tối_hôm_ấy dạo_ấy thuở_ấy mùa_xuân_năm_ngoái
      mùa_hè_năm_ngoái mùa_thu_năm_ngoái mùa_đông_năm_ngoái vài_ngày_trước
    '''),
    present: words(r'''
      hôm_nay vừa_rồi ngày_mai tuần_sau bây_giờ sáng_nay tối_nay đêm_nay ngày_kia tháng_sau năm_sau
      năm_nay tuần_này cuối_tuần_này chốc_nữa
    '''),
    habitual: words(r'''
      dạo_này đôi_khi mỗi_ngày mỗi_tối luôn_luôn thường thường_xuyên hiếm_khi ít_khi thỉnh_thoảng
      đôi_lúc mỗi_sáng mỗi_tuần mỗi_năm ngày_thường thông_thường
    '''),
  ),
  homes: words(r'nhà'),
  join: const SentenceJoin(word: 'rồi'),
  connectives: <ConnectiveKind, WordPool>{
    ConnectiveKind.additive: words(r'ngoài_ra hơn_nữa và thêm_vào_đó bên_cạnh_đó vả_lại'),
    ConnectiveKind.temporal: words(r'''
      rồi và_rồi sau_đó cuối_cùng sau_cùng thế_rồi đồng_thời lát_sau tiếp_đó chẳng_bao_lâu
      ít_lâu_sau bấy_giờ trong_chốc_lát ngay_sau_đó
    '''),
    ConnectiveKind.contrastive: words(
      r'nhưng tuy_vậy tuy_nhiên dù_vậy thế_mà trái_lại ngược_lại có_điều dẫu_vậy',
    ),
    ConnectiveKind.causal: words(r'thế_là vì_thế rốt_cuộc do_đó bởi_vậy cho_nên vì_vậy'),
  },
  traits: <NounTrait, WordPool>{
    NounTrait.flier: words(r'''
      chim én sẻ quạ chim_ưng đại_bàng công vẹt cú bồ_câu hạc thiên_nga vịt ngỗng bướm ong
      chuồn_chuồn ve muỗi ruồi dơi rồng phượng_hoàng tiên thiên_thần hắc_long bạch_long thanh_long
      chu_tước chim_lửa thiên_mã thần_điểu tinh_linh sơn_ca chim_cút gà_lôi đa_đa chim_ruồi hồng_hạc
      cò chim_gõ_kiến chim_sáo chim_chích chim_cắt hải_âu bồ_nông ong_bắp_cày bướm_đêm đom_đóm
      ong_nghệ bọ_rùa
    '''),
    NounTrait.swimmer: words(r'''
      cá_sấu rùa ếch cóc cá cá_voi cá_heo cá_mập mực bạch_tuộc tôm cua sứa hải_cẩu cá_chép lươn
      người_cá mỹ_nhân_ngư hải_quái cá_trích cá_ngừ cá_tuyết cá_hồi cá_trê cá_rô cá_thu cá_đuối hàu
      trai vẹm tôm_hùm sao_biển cá_kiếm cá_ngựa kỳ_giông hải_ly thú_mỏ_vịt
    '''),
    NounTrait.crawler: words(r'''
      cá_sấu rắn thằn_lằn rùa ốc kiến nhện giun sâu tằm cua bọ_ngựa kỳ_nhông tắc_kè kỳ_giông trăn
      rắn_hổ_mang rắn_lục bọ_cánh_cứng châu_chấu dế bọ_chét rết bọ_cạp
    '''),
    NounTrait.lifeless: words(r'''
      phép_thuật ma_lực thần_chú lời_nguyền tiên_tri sấm_truyền kết_giới bùa_hộ_mệnh phong_ấn
      ảo_giác ma_thuật hình_nhân sách_phép chén_thánh gậy_phép trượng vương_trượng
    '''),
    NounTrait.placeless: words(r'''
      cát đá sỏi động_đất san_hô mạch_nước măng_đá nhũ_đá bóng âm_vang hương lửa than_hồng dòng_chảy
      sao mặt_trời sao_chổi sao_băng cực_quang bụi_sao nhật_thực nguyệt_thực thiên_đỉnh vệ_tinh
      cụm_sao chòm_sao quỹ_đạo trọng_lực tự_quay nhật_hoa vết_đen gió_mặt_trời năm_ánh_sáng
      thiên_thể liên_sao định_tinh thiên_cầu hoàng_đạo mưa_sao_băng bụi_vũ_trụ trăng_khuyết
      trăng_tròn trăng_non ánh_trăng ánh_sao sao_bắc_cực sao_hôm sao_mai dòng_nước thủy_triều sóng
      bọt sóng_vỗ thị_sai parsec phương_vị cận_nhật viễn_nhật trọng_trường sao_lùn
    '''),
  },
  interjections: words(r'''
    ôi, chà, ồ, trời_ơi, chao_ôi, này, thật_đấy, ái_chà, ê, ơ_kìa, khiếp, ối, ôi_chao, à, ừ, hả, ơ,
    ái_dà, ơ_hay, thôi_chết, lạ_chưa, quả_nhiên, hóa_ra, coi_kìa,
  '''),
  pronouns: const <WordGender, WordPool>{
    WordGender.n: <String>['', 'nó'],
  },
  pronounless: const <NounClass>[NounClass.person],
  objectPronouns: const SentenceObjectPronouns(
    words: <WordGender, WordPool>{
      WordGender.n: <String>[''],
    },
  ),
  speech: const SentenceSpeech(subject: 'Tôi'),
  degrees: words(r'khá hơi thật cực_kỳ vô_cùng hết_sức thật_là khá_là quá_là siêu'),
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
      SentencePart(SentenceSlot.degree),
      SentencePart(SentenceSlot.state),
    ], 9),
    SentenceFrame(<SentencePart>[
      SentencePart(SentenceSlot.time, tail: ','),
      SentencePart(SentenceSlot.subject, modifiable: true),
      SentencePart(SentenceSlot.state, head: 'rất'),
    ], 5),
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
