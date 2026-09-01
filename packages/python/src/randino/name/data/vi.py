"""Vietnamese name pools."""

from randino._internal.parse import weights, words
from randino.name.data._types import NameLanguageData, NameLengthSpec
from randino.name.data.syllables import VIETNAMESE_SYLLABLES

VI = NameLanguageData(
    order="family-first",
    joiner=" ",
    has_middle=True,
    roman="fold",
    length_spec=NameLengthSpec(given=(2, 6), last=(3, 7), middle=(3, 6)),
    # Tone marks are part of the name: Dung (female) and Dũng (male) are two
    # different names, so a new entry has to carry the diacritics it is written with.
    male=words("""
        An Bình Cường Dũng Đạt Hải Hùng Khôi Long Minh Nam Phúc Quân Sơn Tuấn Việt Bảo
        Khánh Trung Thắng Duy Kiên Lâm Nghĩa Phong Hiếu Huy Đức Thành Tùng Khang Toàn Trí
        Tú Vinh Nguyên Kiệt Đăng Hưng Thịnh
    """),
    female=words("""
        Anh Chi Dung Hà Hoa Hương Lan Linh Mai Ngọc Nhung Phương Quỳnh Thảo Trang Uyên Vân
        Yến Hạnh Ngân Diệp Giang Loan My Thu Trâm Nhi Như Vy Tuyết Trinh Hiền Huyền Nga
        Oanh Phượng Thúy Tiên Hằng Châu
    """),
    # Share of the population carrying each surname, in tenths of a percent. No
    # language in the set is more lopsided: two Vietnamese names in five are a
    # Nguyễn, so drawing the thirty surnames evenly is the most visible skew there is.
    # Hoàng / Huỳnh and Vũ / Võ are the northern and southern spelling of one
    # surname each, so the share is split between the two entries.
    last_weights=weights("""
        Nguyễn:380 Trần:110 Lê:95 Phạm:71 Phan:45 Hoàng:34 Vũ:26 Đặng:21 Bùi:20 Huỳnh:17
        Đỗ:14 Hồ:13 Ngô:13 Võ:13 Dương:10 Lý:5 Trương:5 Đinh:4 Trịnh:3 Đoàn:3 Lâm:3
    """),
    last=words("""
        Nguyễn Trần Lê Phạm Hoàng Huỳnh Phan Vũ Võ Đặng Bùi Đỗ Hồ Ngô Dương Lý Đinh Trịnh
        Đoàn Lâm Trương Tô Cao Chu Tạ Vương Phùng Tống Triệu Lưu
    """),
    middle_male=words("Văn Hữu Đức Minh Quang Thành Xuân Bá Công Trọng Quốc Nhật Chí Đình Thế"),
    middle_female=words("Thị Ngọc Thanh Thu Kim Hồng Mỹ Diễm Bích Phương Thùy Cẩm Ánh Nhã Hoài"),
    syn=VIETNAMESE_SYLLABLES,
)
