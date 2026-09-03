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
    # Share of the population carrying each surname, in tenths of a percent. No
    # language in the set is more lopsided: two Vietnamese names in five are a
    # Nguyễn, so drawing the thirty surnames evenly is the most visible skew there
    # is. Hoàng / Huỳnh and Vũ / Võ are the northern and southern spelling of one
    # surname each, so the share is split between the two entries.
    last_weights=weights("""
        Nguyễn:380 Trần:110 Lê:95 Phạm:71 Phan:45 Hoàng:34 Vũ:26 Đặng:21 Bùi:20 Huỳnh:17
        Đỗ:14 Hồ:13 Ngô:13 Võ:13 Dương:10 Lý:5 Trương:5 Đinh:4 Trịnh:3 Đoàn:3 Lâm:3
    """),
    last=words("""
        Nguyễn Trần Lê Phạm Hoàng Huỳnh Phan Vũ Võ Đặng Bùi Đỗ Hồ Ngô Dương Lý Đinh
        Trịnh Đoàn Lâm Trương Tô Cao Chu Tạ Vương Phùng Tống Triệu Lưu Lương Mai Đào Hà
        Quách Thái Bành Đàm Nghiêm Kiều Giang Diệp Lại Uông Chử Sái Khổng Mạc Nhâm Ông
        Quản Sầm Tăng Thân Từ Ứng Viên Xa Yên Bạch Châu Cù Doãn Hứa Khương Lục Ninh Phí
        Quang
    """),
    # Tone marks are part of the name: Dung (female) and Dũng (male) are two
    # different names, so a new entry has to carry the diacritics it is written
    # with.
    male=words("""
        An Bình Cường Dũng Đạt Hải Hùng Khôi Long Minh Nam Phúc Quân Sơn Tuấn Việt Bảo
        Khánh Trung Thắng Duy Kiên Lâm Nghĩa Phong Hiếu Huy Đức Thành Tùng Khang Toàn
        Trí Tú Vinh Nguyên Kiệt Đăng Hưng Thịnh Anh Bách Chiến Chương Đại Danh Dương
        Giang Hà Hiển Hoàng Hưởng Khải Khoa Kỳ Lộc Lợi Luân Lương Mạnh Nghị Ngọc Nhân
        Nhật Phát Quang Quốc Sang Sinh Sỹ Tài Tâm Tân Thái Thiện Thông Thuận Tiến Tín
        Trọng Trường Tuân Tuyên Văn Vĩnh Vượng Xuân Ý Hòa
    """),
    female=words("""
        Anh Chi Dung Hà Hoa Hương Lan Linh Mai Ngọc Nhung Phương Quỳnh Thảo Trang Uyên
        Vân Yến Hạnh Ngân Diệp Giang Loan My Thu Trâm Nhi Như Vy Tuyết Trinh Hiền Huyền
        Nga Oanh Phượng Thúy Tiên Hằng Châu Ái Bích Cẩm Châm Chinh Dao Diễm Diệu Đào Hạ
        Hân Hoài Hồng Huệ Hường Khanh Khuê Kiều Lam Lệ Liên Liễu Ly Mận Mỹ Nguyệt Nhàn
        Phụng Quyên Quyền Sương Tâm Thắm Thanh Thủy Trà Trúc Tuyền Vi Xuân Yên Ánh Bảo
    """),
    middle_male=words("""
        Văn Hữu Đức Minh Quang Thành Xuân Bá Công Trọng Quốc Nhật Chí Đình Thế Anh Bảo
        Duy Gia Hoàng Hùng Khắc Khánh Mạnh Ngọc Phú Phước Quý Sỹ Tấn Thái Thiên Trung
        Tuấn Việt
    """),
    middle_female=words("""
        Thị Ngọc Thanh Thu Kim Hồng Mỹ Diễm Bích Phương Thùy Cẩm Ánh Nhã Hoài Bảo Chi
        Diệu Đan Giang Hà Hải Hạnh Huyền Khánh Lan Linh Mai Minh Như Quỳnh Thảo Tuyết
        Yến
    """),
    syn=VIETNAMESE_SYLLABLES,
)
