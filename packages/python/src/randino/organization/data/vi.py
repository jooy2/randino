"""Vietnamese organizations: the stems, the words for a business and the shapes."""

from randino._internal.parse import words
from randino.organization.data._types import (
    OrganizationLanguageData,
    PoolOrganizationSynthesis,
)

VI = OrganizationLanguageData(
    stems=words("""
        Minh_Phát Phú_Thịnh Thiên_Phú Phúc_An Tân_Phát Đại_Phát Hồng_Phúc Gia_Huy Thái_Sơn
        Trường_An Vĩnh_Phát Quang_Minh Toàn_Thắng Ánh_Dương Hải_Đăng Trường_Thịnh Minh_Khang
        Phú_Gia Lộc_Phát Tiến_Đạt Thịnh_Vượng Hùng_Cường Bảo_Long Nhật_Minh Việt_Hưng
        Vạn_Phúc Ngọc_Lan Hà_Phát Đông_Hải Phú_Quý Thuận_Phát Hưng_Phú Kim_Phát Gia_Phát
        Đại_Thành Tân_Thành Hải_Nam Minh_Châu Sao_Việt Bình_An
    """),
    syn=PoolOrganizationSynthesis(
        pool=words("""
            Phú Thịnh Minh Phát An Gia Huy Lộc Tân Thành Đạt Bảo Nhật Quang Hải Đăng Trường Vĩnh
            Thái Hồng Phúc Ngọc Toàn Thắng Ánh Dương Nam Đông Châu Thuận Tiến Đức Vạn Quý Cường
            Khang Lan
        """),
        avoid=words("Bảo_Việt An_Bình Hưng_Thịnh Nam_Long"),
        joiner=" ",
        min_syllables=2,
        max_syllables=2,
    ),
    industries={
        "tech": words(
            "Công_nghệ Phần_mềm Giải_pháp_Công_nghệ Điện_tử Công_nghệ_Thông_tin Viễn_thông"
        ),
        "manufacturing": words("Sản_xuất Cơ_khí Hóa_chất Nhựa Thép Cơ_khí_Chính_xác"),
        "food": words("Thực_phẩm Chế_biến_Thực_phẩm Nông_sản Thủy_sản Bánh_kẹo Đồ_uống"),
        "retail": words("Thương_mại Bán_lẻ Siêu_thị Xuất_nhập_khẩu Phân_phối"),
        "finance": words("Đầu_tư Tài_chính Quản_lý_Quỹ Bảo_hiểm Đầu_tư_Tài_chính"),
        "construction": words("Xây_dựng Kiến_trúc Bất_động_sản Xây_lắp Tư_vấn_Thiết_kế"),
        "logistics": words("Vận_tải Logistics Giao_nhận Vận_tải_Biển Chuyển_phát_Nhanh Kho_vận"),
        "media": words("Truyền_thông Quảng_cáo Giải_trí Xuất_bản Sản_xuất_Phim Tổ_chức_Sự_kiện"),
        "health": words("Dược_phẩm Thiết_bị_Y_tế Y_tế Dược Công_nghệ_Sinh_học"),
        "energy": words("Năng_lượng Điện_lực Năng_lượng_Mặt_trời Xăng_dầu Khí_đốt Điện_gió"),
    },
    generic=words("Tập_đoàn Thương_mại_Dịch_vụ Đầu_tư_Phát_triển Sản_xuất_Thương_mại"),
    templates={
        "company": ("{industry} {stem}",),
        "nonprofit": (
            "Hội Khuyến học {stem}",
            "Quỹ Từ thiện {stem}",
            "Quỹ Học bổng {stem}",
            "Câu lạc bộ {stem}",
            "Hiệp hội Doanh nghiệp {stem}",
        ),
        "school": (
            "Trường Mầm non {stem}",
            "Trường Tiểu học {stem}",
            "Trường THCS {stem}",
            "Trường THPT {stem}",
            "Trường Cao đẳng {stem}",
            "Trường Đại học {stem}",
        ),
        "government": (
            "Ủy ban nhân dân phường {stem}",
            "Ủy ban nhân dân xã {stem}",
            "Hội đồng nhân dân phường {stem}",
            "Công an phường {stem}",
            "Công an xã {stem}",
        ),
        "public": (
            "Bệnh viện Đa khoa {stem}",
            "Trạm Y tế phường {stem}",
            "Thư viện {stem}",
            "Bảo tàng {stem}",
            "Nhà văn hóa {stem}",
            "Trung tâm Văn hóa Thể thao {stem}",
        ),
    },
    legal_forms=(
        "Công ty TNHH {name}",
        "Công ty Cổ phần {name}",
        "Công ty TNHH MTV {name}",
    ),
)
