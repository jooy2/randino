"""The vi sentence grammar: the verbs, the predicates and the shapes.

Ported verbatim from the JavaScript package; see CLAUDE.md.
"""

from randino._internal.parse import words
from randino.sentence.data._types import (
    ModifierGroup,
    SentenceCalendar,
    SentenceFrame,
    SentenceJoin,
    SentenceLanguageData,
    SentenceNumeral,
    SentenceObjectPronouns,
    SentencePart,
    SentencePastMark,
    SentenceTimes,
    StateGroup,
    VerbGroup,
)

VI = SentenceLanguageData(
    space=" ",
    capitalize=True,
    terminators={"statement": ".", "question": "?", "exclamation": "!", "trailing": "…"},
    quotes={"double": ("“", "”"), "single": ("‘", "’")},
    past_mark=SentencePastMark(head="đã"),
    verbs=(
        VerbGroup(
            field="rise",
            subject=("creature", "person"),
            words=words("thức_dậy tỉnh_giấc đứng_lên ngồi_dậy"),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            requires="destination",
            words=words("đi hướng lên_đường"),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            subject_without=("swimmer", "crawler"),
            requires="destination",
            words=words("chạy rảo_bước"),
        ),
        VerbGroup(
            field="go",
            subject=("creature", "person"),
            words=words("rời_đi khởi_hành ra_đi ra_ngoài"),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            requires="destination",
            words=words("trở_về về_đến tới đến về_tới"),
        ),
        VerbGroup(
            field="arrive",
            subject=("creature", "person"),
            words=words("quay_về trở_lại về_nhà"),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_without=("swimmer", "crawler"),
            words=words("chạy đi_bộ nhảy dạo_chơi đi_dạo"),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            words=words("lang_thang đi_qua"),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_traits=("swimmer",),
            words=words("bơi"),
        ),
        VerbGroup(
            field="move",
            subject=("creature",),
            subject_traits=("flier",),
            words=words("bay"),
        ),
        VerbGroup(
            field="move",
            subject=("creature", "person"),
            subject_traits=("crawler",),
            words=words("bò"),
        ),
        VerbGroup(
            field="wait",
            subject=("creature", "person"),
            words=words("chờ trốn nhìn_quanh ngập_ngừng dừng_lại đứng_yên"),
        ),
        VerbGroup(
            field="rest",
            subject=("creature", "person"),
            words=words("nghỉ_ngơi ngồi nằm tựa cuộn_mình ngả_lưng"),
        ),
        VerbGroup(
            field="sleep",
            subject=("creature", "person"),
            words=words("ngủ thiếp_đi chợp_mắt ngủ_say"),
        ),
        VerbGroup(
            field="express",
            subject=("creature", "person"),
            words=words("cười khóc ngáp thở_dài mỉm_cười ngâm_nga lầm_bầm la_lên"),
        ),
        VerbGroup(
            field="play",
            subject=("creature", "person"),
            words=words("nhảy_múa hát lăn_lộn nô_đùa tung_tăng vui_chơi"),
        ),
        VerbGroup(
            field="think",
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("nhớ quên tưởng_tượng đếm nhớ_lại nhớ_về"),
        ),
        VerbGroup(
            field="look",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("nhìn ngắm ngó xem_xét chạm vuốt_ve săm_soi"),
        ),
        VerbGroup(
            field="search",
            subject=("creature", "person"),
            words=words("tìm_kiếm lục_lọi tìm_quanh sục_sạo"),
        ),
        VerbGroup(
            field="find",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("tìm_thấy phát_hiện nhặt_được tìm_ra"),
        ),
        VerbGroup(
            field="take",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("chọn cầm nắm lấy nhặt nhận"),
        ),
        VerbGroup(
            field="carry",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("mang đem_về khiêng ôm mang_về"),
        ),
        VerbGroup(
            field="hide",
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("giấu cất giữ chôn cất_kỹ"),
        ),
        VerbGroup(
            field="make",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("làm xây chạm_khắc vẽ đan lắp_ráp"),
        ),
        VerbGroup(
            field="tend",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("sửa lau đánh_bóng chỉnh_sửa sắp_xếp tu_sửa"),
        ),
        VerbGroup(
            field="sell",
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("bán bán_đi trao nhượng_lại"),
        ),
        VerbGroup(
            field="buy",
            subject=("person",),
            object=("thing", "vehicle", "edible"),
            words=words("mua mua_về sắm đặt_mua"),
        ),
        VerbGroup(
            field="cook",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("nướng hâm_nóng nấu chế_biến thái bày"),
        ),
        VerbGroup(
            field="eat",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("food",),
            words=words("ăn nhai nếm gặm ăn_hết"),
        ),
        VerbGroup(
            field="drink",
            subject=("creature", "person"),
            object=("edible",),
            object_themes=("drink",),
            words=words("uống nhấp uống_cạn thưởng_thức"),
        ),
        VerbGroup(
            field="change",
            subject=("place",),
            words=words("yên_tĩnh_lại tối_dần sáng_lên đông_vui_lên lặng_đi rực_sáng"),
        ),
        VerbGroup(
            field="change",
            subject=("event",),
            words=words("tỏa_sáng chảy sâu_thêm bắt_đầu kết_thúc kéo_dài trôi_qua"),
        ),
        VerbGroup(
            field="change",
            subject=("thing", "vehicle"),
            words=words("lung_lay lấp_lánh rơi lăn nghiêng cũ_đi"),
        ),
        VerbGroup(
            field="move",
            subject=("vehicle",),
            words=words("chạy dừng_lại đi_qua trở_về khởi_hành trượt"),
        ),
        VerbGroup(
            field="change",
            subject=("idea", "event"),
            words=words("lan_ra biến_mất còn_lại trôi đậm_thêm"),
        ),
        VerbGroup(
            field="change",
            subject=("plant",),
            words=words("mọc héo nở đung_đưa vươn_lên"),
        ),
        VerbGroup(
            field="change",
            subject=("body",),
            words=words("run động tê cứng_lại"),
        ),
        VerbGroup(
            field="change",
            subject=("edible",),
            words=words("chín nguội sôi tan hỏng"),
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                to nhỏ nhanh chậm im_lặng ồn_ào dũng_cảm lười bận dữ hiền thông_minh
            """),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="hungry",
            words=words("đói đói_bụng"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="full",
            words=words("no no_nê"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="tired",
            words=words("mệt buồn_ngủ mệt_mỏi uể_oải"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="rested",
            words=words("sảng_khoái khoan_khoái tràn_đầy_sức_sống"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="content",
            words=words("vui hạnh_phúc hài_lòng vui_vẻ thoải_mái"),
        ),
        StateGroup(
            subject=("creature", "person"),
            condition="restless",
            words=words("buồn_chán tò_mò bồn_chồn lo_lắng"),
        ),
        StateGroup(
            subject=(
                "creature",
                "person",
                "plant",
                "edible",
                "thing",
                "vehicle",
                "place",
                "event",
                "idea",
                "body",
            ),
            words=words("đẹp lạ mới phổ_biến hiếm"),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("rộng hẹp yên_tĩnh sâu tối sáng xa dốc"),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("cứng nhẹ nặng cũ trơn trong_suốt chắc"),
        ),
        StateGroup(
            subject=("edible",),
            words=words("ngọt mặn cay chua nóng lạnh bùi"),
        ),
        StateGroup(
            subject=("idea",),
            words=words("đơn_giản rõ_ràng mơ_hồ vĩnh_cửu thoáng_qua"),
        ),
        StateGroup(
            subject=("plant",),
            words=words("xanh um_tùm thơm héo_úa"),
        ),
        StateGroup(
            subject=("body",),
            words=words("ấm lạnh đau cứng"),
        ),
    ),
    modifiers=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                dũng_cảm hiền_lành chăm_chỉ lười_biếng nhút_nhát thông_minh trẻ già nhỏ to hoạt_bát
                thong_thả nhanh_nhẹn hiếu_kỳ
            """),
        ),
        ModifierGroup(
            subject=("person",),
            words=words("trẻ tốt_bụng nghiêm_khắc nghiêm_túc bận_rộn tận_tâm"),
        ),
        ModifierGroup(
            subject=("creature",),
            words=words("nhanh_nhẹn hung_dữ hiền nhỏ_bé mập_mạp"),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("food",),
            words=words("ngọt cay ấm tươi giòn thơm nóng mặn mềm chín ngon_lành"),
        ),
        ModifierGroup(
            subject=("edible",),
            themes=("drink",),
            words=words("ngọt ấm lạnh mát nóng thơm tươi đậm"),
        ),
        ModifierGroup(
            subject=("thing", "vehicle"),
            words=words("cũ mới nhỏ to nhẹ nặng sáng_bóng nhẵn trong_suốt cứng đẹp quý cổ"),
        ),
        ModifierGroup(
            subject=("vehicle",),
            words=words("nhanh chậm chắc_chắn"),
        ),
        ModifierGroup(
            subject=("place",),
            words=words("""
                yên_tĩnh rộng tối sáng lạ cũ ấm_cúng vắng_vẻ đông_đúc xa gần trống_trải hiu_quạnh
                đầy_nắng
            """),
        ),
        ModifierGroup(
            subject=("plant",),
            words=words("xanh um_tùm thơm non héo cao nhỏ tươi"),
        ),
        ModifierGroup(
            subject=("idea",),
            words=words("mờ_nhạt cũ mới lạ rõ_ràng quý_giá nhỏ kỳ_lạ"),
        ),
        ModifierGroup(
            subject=("event",),
            words=words("dài ngắn yên_ả nắng âm_u ồn_ào bất_ngờ"),
        ),
        ModifierGroup(
            subject=("body",),
            words=words("nhỏ lạnh ấm mảnh_mai khỏe"),
        ),
        ModifierGroup(
            subject=(
                "creature",
                "person",
                "plant",
                "thing",
                "vehicle",
                "place",
                "event",
                "idea",
                "body",
            ),
            words=words("đẹp bí_ẩn lạ mới"),
        ),
    ),
    manners=(
        ModifierGroup(
            subject=("creature", "person"),
            words=words("""
                lặng_lẽ chậm_rãi nhanh_chóng nhẹ_nhàng khẽ một_mình một_lát mạnh_mẽ cẩn_thận háo_hức
                từ_từ vội_vã êm_ái chăm_chú thản_nhiên vui_vẻ bình_thản hối_hả kiên_nhẫn thong_thả
                hớn_hở
            """),
        ),
        ModifierGroup(
            subject=("plant", "edible", "thing", "vehicle", "place", "event", "idea", "body"),
            words=words("""
                lặng_lẽ chậm_rãi từ_từ đột_nhiên khẽ lại đều_đặn dần_dần vẫn mãi nhẹ_nhàng chầm_chậm
                dần
            """),
        ),
    ),
    times=SentenceTimes(
        day=words("""
            lúc_bình_minh sáng_sớm vào_buổi_sáng gần_trưa vào_buổi_trưa vào_buổi_chiều lúc_hoàng_hôn
            vào_buổi_tối vào_ban_đêm đêm_khuya lúc_nửa_đêm
        """),
        any=words("""
            vào_mùa_xuân vào_mùa_hè vào_mùa_thu vào_mùa_đông vào_cuối_tuần vào_ngày_lễ cả_ngày
        """),
        past=words("hôm_qua tuần_trước ngày_xưa hôm_ấy đêm_qua"),
        present=words("hôm_nay vừa_rồi ngày_mai tuần_sau"),
        habitual=words("dạo_này đôi_khi mỗi_ngày mỗi_tối"),
    ),
    homes=words("nhà"),
    join=SentenceJoin(word="rồi"),
    connectives={
        "additive": words("ngoài_ra hơn_nữa"),
        "temporal": words("rồi và_rồi sau_đó cuối_cùng sau_cùng thế_rồi đồng_thời lát_sau"),
        "contrastive": words("nhưng tuy_vậy tuy_nhiên dù_vậy"),
        "causal": words("thế_là vì_thế rốt_cuộc"),
    },
    traits={
        "flier": words("""
            chim én sẻ quạ chim_ưng đại_bàng công vẹt cú bồ_câu hạc thiên_nga vịt ngỗng bướm ong
            chuồn_chuồn ve muỗi ruồi dơi rồng phượng_hoàng tiên thiên_thần hắc_long bạch_long
            thanh_long chu_tước chim_lửa thiên_mã thần_điểu tinh_linh
        """),
        "swimmer": words("""
            cá_sấu rùa ếch cóc cá cá_voi cá_heo cá_mập mực bạch_tuộc tôm cua sứa hải_cẩu cá_chép
            lươn người_cá mỹ_nhân_ngư hải_quái
        """),
        "crawler": words("cá_sấu rắn thằn_lằn rùa ốc kiến nhện giun sâu tằm cua bọ_ngựa"),
    },
    interjections=words(
        "ôi, chà, ồ, trời_ơi, chao_ôi, này, thật_đấy, ái_chà, ê, ơ_kìa, khiếp, ối,"
    ),
    pronouns={"n": ("", "nó")},
    pronounless=("person",),
    object_pronouns=SentenceObjectPronouns(words={"n": ("",)}),
    numeral=SentenceNumeral(
        order="before",
        counters={
            "creature": "con",
            "person": "người",
            "plant": "cây",
            "edible": "cái",
            "thing": "cái",
            "vehicle": "chiếc",
            "place": "nơi",
            "event": "lần",
            "idea": "điều",
            "body": "cái",
        },
        count=(2, 12),
        currency="đồng",
        amounts=(10000, 50000, 100000, 200000, 500000, 1000000, 5000000),
        group=".",
        gap=" ",
    ),
    calendar=SentenceCalendar(
        date="ngày D tháng M năm Y",
        clock="h giờ mm",
        years=(2020, 2030),
        copula=StateGroup(
            subject=("event",),
            words=words("là"),
        ),
    ),
    frames=(
        SentenceFrame(
            (
                SentencePart("date", head="vào", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("clock", head="lúc", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("date", copula="head"),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("clock", copula="head"),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            20,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            18,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("place", head="trong", modifiable=True),
            ),
            14,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="đến", modifiable=True),
            ),
            8,
            fields=("go",),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", modifiable=True),
            ),
            8,
            fields=("arrive",),
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", head="đến", modifiable=True),
            ),
            4,
            fields=("go",),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("destination", modifiable=True),
                SentencePart("manner"),
            ),
            3,
            fields=("arrive",),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("state", head="rất"),
            ),
            12,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("manner"),
            ),
            10,
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
            ),
            8,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
                SentencePart("place", head="trong", modifiable=True),
            ),
            7,
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("place", head="trong", modifiable=True),
            ),
            6,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
                SentencePart("manner"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("time", tail=","),
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("object", modifiable=True),
            ),
            4,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb", head="có"),
            ),
            20,
            mood="question",
            tag="không",
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb", head="có"),
                SentencePart("object", modifiable=True),
            ),
            16,
            mood="question",
            tag="không",
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("state", head="có"),
            ),
            14,
            mood="question",
            tag="không",
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb", head="có"),
                SentencePart("destination", head="đến", modifiable=True),
            ),
            6,
            mood="question",
            tag="không",
            fields=("go",),
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("quantity"),
            ),
            6,
        ),
        SentenceFrame(
            (
                SentencePart("quantity"),
                SentencePart("verb"),
            ),
            5,
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("money"),
            ),
            5,
        ),
    ),
)
