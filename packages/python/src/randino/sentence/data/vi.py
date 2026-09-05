"""Vietnamese sentence grammar: the verbs, the predicates and the shapes."""

from randino._internal.parse import words
from randino.sentence.data._types import (
    SentenceCalendar,
    SentenceFrame,
    SentenceLanguageData,
    SentenceNumeral,
    SentencePart,
    StateGroup,
    VerbGroup,
)

VI = SentenceLanguageData(
    space=" ",
    capitalize=True,
    terminators={
        "statement": ".",
        "question": "?",
        "exclamation": "!",
        "trailing": "…",
    },
    quotes={"double": ("“", "”"), "single": ("‘", "’")},
    verbs=(
        VerbGroup(
            subject=("creature", "person"),
            words=words("""
                chạy đi_bộ nhảy bơi bay bò trở_về rời_đi dừng_lại nghỉ_ngơi ngủ cười
                khóc hát nhảy_múa trốn chờ đứng ngồi lăn lang_thang đi_qua đến_gần
                lắng_nghe
            """),
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("edible",),
            words=words("""
                ăn uống nhai nếm nướng hâm_nóng
            """),
        ),
        VerbGroup(
            subject=("creature", "person"),
            object=("thing", "plant", "edible"),
            words=words("""
                nhìn tìm nhặt mang chạm giữ chọn di_chuyển thu_thập
            """),
        ),
        VerbGroup(
            subject=("person",),
            object=("thing", "vehicle"),
            words=words("""
                làm sửa lau bán mua xây
            """),
        ),
        VerbGroup(
            subject=("person", "creature"),
            object=("idea", "event", "place"),
            words=words("""
                nhớ quên tưởng_tượng đếm
            """),
        ),
        VerbGroup(
            subject=("place", "event"),
            words=words("""
                tỏa_sáng chảy tối_dần sáng_lên sâu_thêm lặng_đi
            """),
        ),
        VerbGroup(
            subject=("thing", "vehicle"),
            words=words("""
                lung_lay lấp_lánh rơi lăn nghiêng cũ_đi
            """),
        ),
        VerbGroup(
            subject=("vehicle",),
            words=words("""
                chạy dừng_lại đi_qua trở_về khởi_hành trượt
            """),
        ),
        VerbGroup(
            subject=("idea", "event"),
            words=words("""
                lan_ra biến_mất còn_lại trôi đậm_thêm
            """),
        ),
        VerbGroup(
            subject=("plant",),
            words=words("""
                mọc héo nở đung_đưa vươn_lên
            """),
        ),
        VerbGroup(
            subject=("body",),
            words=words("""
                run động tê cứng_lại
            """),
        ),
        VerbGroup(
            subject=("edible",),
            words=words("""
                chín nguội sôi tan hỏng
            """),
        ),
    ),
    states=(
        StateGroup(
            subject=("creature", "person"),
            words=words("""
                to nhỏ nhanh chậm im_lặng ồn_ào dũng_cảm lười bận đói buồn_ngủ dữ
                hiền thông_minh
            """),
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
            words=words("""
                đẹp lạ mới phổ_biến hiếm
            """),
        ),
        StateGroup(
            subject=("place", "event"),
            words=words("""
                rộng hẹp yên_tĩnh sâu tối sáng xa dốc
            """),
        ),
        StateGroup(
            subject=("thing", "vehicle"),
            words=words("""
                cứng nhẹ nặng cũ trơn trong_suốt chắc
            """),
        ),
        StateGroup(
            subject=("edible",),
            words=words("""
                ngọt mặn cay chua nóng lạnh bùi
            """),
        ),
        StateGroup(
            subject=("idea",),
            words=words("""
                đơn_giản rõ_ràng mơ_hồ vĩnh_cửu thoáng_qua
            """),
        ),
        StateGroup(
            subject=("plant",),
            words=words("""
                xanh um_tùm thơm héo_úa
            """),
        ),
        StateGroup(
            subject=("body",),
            words=words("""
                ấm lạnh đau cứng
            """),
        ),
    ),
    manners=words("""
        lặng_lẽ chậm_rãi nhanh_chóng nhẹ_nhàng đột_nhiên khẽ lại cùng_nhau một_mình
        một_lát đều_đặn mạnh_mẽ cẩn_thận háo_hức
    """),
    times=words("""
        lúc_bình_minh vào_buổi_sáng vào_buổi_trưa vào_buổi_chiều vào_ban_đêm hôm_nay hôm_qua
        ngày_mai vào_mùa_xuân vào_mùa_hè vào_mùa_thu vào_mùa_đông vào_cuối_tuần vừa_rồi
        đôi_khi mỗi_ngày lúc_hoàng_hôn
    """),
    connectives=words("rồi và_rồi nhưng thế_là sau_đó cuối_cùng đồng_thời tuy_vậy"),
    interjections=words("ôi, chà, ồ, trời_ơi, chao_ôi, này, thật_đấy,"),
    pronouns={"n": ("", "nó")},
    pronounless=("person",),
    # Vietnamese puts the classifier in front of the noun and the number in front
    # of that, so the whole group reads `12 con mèo`.
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
    # Vietnamese writes a date smallest to largest, with a word in front of every part,
    # and its copula as a word of its own.
    calendar=SentenceCalendar(
        date="ngày D tháng M năm Y",
        clock="h giờ mm",
        years=(2020, 2030),
        copula=StateGroup(
            # An event is a thing that happens on a day, and a lion is not.
            subject=("event",),
            words=words("là"),
        ),
    ),
    frames=(
        # A date and a clock, standing where an adverbial stands.
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
        # And the shape that equates the subject to one: `Trận đấu là 11 giờ 40.`
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
        # Vietnamese wraps the predicate: có in front of it, không after the clause.
        SentenceFrame(
            (SentencePart("subject", modifiable=True), SentencePart("verb", head="có")),
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
            (SentencePart("subject", modifiable=True), SentencePart("state", head="có")),
            14,
            mood="question",
            tag="không",
        ),
        SentenceFrame(
            (
                SentencePart("subject", modifiable=True),
                SentencePart("verb"),
                SentencePart("quantity"),
            ),
            6,
        ),
        SentenceFrame((SentencePart("quantity"), SentencePart("verb")), 5),
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
