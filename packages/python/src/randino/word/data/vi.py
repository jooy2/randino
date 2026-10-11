"""Vietnamese word pools."""

from randino._internal.parse import words
from randino.word.data._types import SyllableSynthesis, WordFrame, WordLanguageData, WordLevels

VI = WordLanguageData(
    joiner=" ",
    capitalize=False,
    adjectives=words("""
        xanh đỏ vàng trắng đen tím nâu hồng xám lớn nhỏ cao thấp dài ngắn rộng hẹp dày
        mỏng nặng nhẹ nhanh chậm mạnh yếu cứng mềm nóng lạnh ấm mát khô ướt sạch mới cũ
        trẻ già đẹp hiền dữ vui buồn hiếm quý sáng tối ngọt đắng cay mặn chua thơm êm
        sắc tròn vuông xa gần sâu nông giàu nghèo lạ quen tươi im_lặng ồn_ào dịu_dàng
        can_đảm thông_minh tự_do vĩnh_cửu trong_suốt kỳ_lạ huyền_bí cô_đơn rực_rỡ
        lấp_lánh mờ_ảo dữ_dội nhẹ_nhàng vững_chãi tinh_khôi hoang_dã bình_yên lặng_lẽ
        rộn_ràng nhanh_nhẹn chậm_rãi mạnh_mẽ yếu_ớt xinh_xắn duyên_dáng thanh_tao
        cổ_kính hiện_đại bất_tận rỗng_không gồ_ghề mượt_mà óng_ánh trầm_mặc thảnh_thơi
        tinh_nghịch nghiêm_trang ung_dung hồn_nhiên táo_bạo thận_trọng khôn_ngoan
        lanh_lợi cần_mẫn lười_biếng nhút_nhát vô_tư thẳng_thắn kín_đáo lộng_lẫy giản_dị
        gan_dạ trung_thành kiên_nhẫn cảnh_giác khéo_léo vững_vàng ôn_hòa phóng_khoáng
        cởi_mở trầm_lặng bướng_bỉnh chất_phác ranh_mãnh kiên_cường đài_các lông_xù
        bóng_loáng tròn_trịa nặng_trịch nhẹ_bẫng lạnh_ngắt nóng_hổi thơm_phức ngọt_lịm
        chua_lè đắng_ngắt loang_lổ kẻ_sọc han_gỉ sờn_cũ mới_tinh cũ_kỹ dày_dặn
        mỏng_manh dẹt nhọn_hoắt cong_queo thẳng_tắp thon_dài ngắn_ngủn êm_dịu ồn_ã
        lặng_thinh trong_trẻo vang_dội trầm_đục du_dương réo_rắt khàn_khàn ấm_áp
        buốt_giá oi_ả khô_ráo ẩm_lạnh u_ám quang_đãng lộng_gió mù_mịt đẫm_sương
        trắng_sương ánh_sao ánh_trăng rêu_phong dây_leo bóng_trúc thông_reo phong_đỏ
        sen_thơm cúc_nhạt lan_u lau_trắng sậy_vàng ngọc_bích san_hô ngà_voi hắc_diện
        pha_lê bạc_trắng đồng_xanh thiếc_bạc chì_xám mã_não son_phấn xanh_đá vàng_nghệ
        đất_son chàm_đậm nguyệt_bạch thiên_thanh cánh_sen xa_xăm nhỏ_nhặt tráng_lệ
        mộc_mạc tinh_xảo thô_mộc mảnh_dẻ cường_tráng rộng_rãi dốc_đứng
    """),
    actions=words("""
        ngủ chạy bay bơi hát nhảy cười khóc đi đứng ngồi nằm ăn uống đọc viết vẽ học làm
        nghỉ chờ tìm gọi nghe nhìn nhớ quên mơ thức trốn đuổi bắt ném kéo đẩy mở đóng
        xây sửa trồng hái nấu nướng dệt may đan chèo lái leo lăn trôi chảy cháy tan nở
        tàn rơi đợi dạo lượn săn gieo gặt gánh vác đội cõng bồng ôm vuốt xoa gõ đập chặt
        cắt khâu thêu nhuộm phơi giặt quét lau rửa xay giã sàng lọc đo đếm ghi kể ngâm
        ngân gảy thổi đánh vỗ reo hò thầm_thì lang_thang bay_lượn tỏa_sáng nhấp_nháy
        đung_đưa dập_dờn rung_rinh thấp_thoáng vụt_qua ngẩng_lên cúi_xuống quay_lại
        bước_tới dừng_lại
        tỉnh_giấc trở_dậy đứng_lên ngồi_xuống thu_mình nép_vào lùi_lại dừng_chân
        rảo_bước sải_bước băng_qua quay_về rời_đi khuất_dạng rón_bước loạng_choạng
        nhảy_nhót ngó_quanh ngước_nhìn nhìn_xuống dõi_theo chăm_chú chạm_khẽ vuốt_phẳng
        sắp_xếp chăm_chút cọ_rửa lau_chùi đánh_bóng đan_kết khâu_vá cắt_tỉa dán_lại
        gấp_lại mở_ra khép_lại lấp_đầy dốc_cạn rót_đầy bày_biện khuấy_đều ninh_nhừ
        xào_nấu hâm_nóng để_nguội nếm_thử nuốt_chửng khắc_chạm nhuộm_màu quét_sơn
        mài_giũa cân_nhắc ngẫm_lại nhấm_nháp
    """),
    nouns={
        "animal": words("""
            mèo chó hổ sư_tử báo cáo sói gấu gấu_trúc rái_cá thỏ sóc voi hươu nai ngựa lừa
            bò trâu dê cừu lợn khỉ vượn cá_sấu rắn thằn_lằn rùa ếch cóc chim én sẻ quạ
            chim_ưng đại_bàng công vẹt cú bồ_câu hạc thiên_nga vịt ngỗng gà cá cá_voi cá_heo
            cá_mập mực bạch_tuộc tôm cua sò ốc bướm ong kiến nhện chuồn_chuồn ve muỗi ruồi
            giun sâu tằm dơi chồn nhím lạc_đà hà_mã tê_giác hươu_cao_cổ chuột sứa hải_cẩu
            đà_điểu bọ_ngựa cá_chép lươn lợn_rừng tuần_lộc linh_dương hải_ly thú_mỏ_vịt
            chuột_túi vượn_cáo tinh_tinh khỉ_đầu_chó heo_vòi sóc_bay chuột_chũi lửng cầy
            sơn_ca chim_cút gà_lôi đa_đa chim_ruồi hồng_hạc cò chim_gõ_kiến chim_sáo
            chim_chích chim_cắt hải_âu bồ_nông cá_trích cá_ngừ cá_tuyết cá_hồi cá_trê cá_rô
            cá_thu cá_đuối hàu trai vẹm tôm_hùm sao_biển cá_kiếm cá_ngựa bọ_cánh_cứng
            châu_chấu dế ong_bắp_cày bướm_đêm đom_đóm rết bọ_cạp bọ_chét ong_nghệ bọ_rùa
            kỳ_nhông tắc_kè kỳ_giông trăn rắn_hổ_mang rắn_lục ngựa_vằn gấu_bắc_cực
            chim_cánh_cụt hải_mã khỉ_đột đười_ươi cá_vàng cá_lóc ba_ba ốc_sên gián mối
            gà_tây diều_hâu báo_săn linh_miêu linh_cẩu chó_rừng gấu_mèo chồn_hôi bò_rừng
            nai_sừng_tấm sơn_dương tê_tê voọc cu_li chuột_lang sư_tử_biển bê nghé ngan
            kền_kền sếu diệc vạc chim_cốc chim_bói_cá chim_yến cu_gáy chào_mào họa_mi
            vành_khuyên chim_khướu cá_cơm cá_mòi cá_basa cá_tra cá_rô_phi cá_chim cá_bống
            cá_trắm cá_mè cá_nóc cá_hề cá_mú cá_bơn ghẹ hến nghêu sò_điệp bào_ngư nhím_biển
            hải_sâm kỳ_đà nhái nòng_nọc sâu_bướm cào_cào bọ_xít bọ_que bọ_hung cà_cuống rệp
            chấy đỉa khủng_long
        """),
        "object": words("""
            chai bút tẩy ô đèn gương chìa_khóa ổ_khóa túi cúc kim chỉ cọ giấy vở thư tem
            con_dấu bản_đồ ống_nhòm kính_hiển_vi máy_ảnh phim thẻ buồm neo lều đèn_pin diêm
            nến chậu ấm chén thìa đĩa nồi bánh_răng dây_cót ruy_băng giỏ chổi còi dây xô
            quạt khiên lưới cần_câu lọ chuông_gió hạc_giấy đồng_hồ_cát phễu bình gáo mẹt nia
            rổ khay hộp thùng vại chum la_bàn móc_khóa ghim dây_thừng móc đinh ốc_vít đai_ốc
            vòng_đệm bản_lề then_cài xích khóa_kéo trâm_cài vòng_tay nhẫn cặp_sách ba_lô
            rương bát chày cối kẹp bấc kính_lúp khuy_bấm sổ_tay bút_chì bút_bi ví hộp_bút
            ống_hút cốc đũa dao thớt muôi nắp bình_nước phích tăm bật_lửa gạt_tàn đèn_lồng
            lồng_chim bìa phong_bì bưu_thiếp sách tờ_báo tạp_chí từ_điển nhật_ký dây_chuyền
            hoa_tai vòng_cổ kẹp_tóc băng_dính keo_dán kẹp_giấy bút_dạ phấn thùng_rác giẻ_lau
            khăn_tay đèn_dầu nam_châm ống_nhổ chảo vung túi_xách quà thiệp ảnh nĩa mâm rá
            thúng hũ nút_chai bút_máy bút_xóa bút_màu gọt_bút_chì dập_ghim kim_băng dây_thun
            bao_tải nhang bát_hương tẩu gậy cờ băng_rôn biển_báo huy_hiệu vương_miện
            quả_địa_cầu bảng_đen chổi_lông_gà hót_rác chuỗi_hạt bình_xịt tờ_rơi áp_phích
            chặn_giấy pháo_hoa vương_trượng
        """),
        "nature": words("""
            biển sông hồ thác thung_lũng núi đồi đồng_cỏ rừng hang sa_mạc cát đá sỏi núi_lửa
            động_đất sông_băng san_hô đầm_lầy suối vịnh cồn_cát đỉnh_núi thảo_nguyên đầm
            cửa_sông châu_thổ đảo bán_đảo eo_đất quần_đảo cao_nguyên vách_đá khe_núi bãi_cát
            bãi_đá rạn_san_hô đáy_biển vực_sâu mạch_nước hố_sụt măng_đá nhũ_đá gờ_đá bóng
            âm_vang hương lửa than_hồng dòng_chảy bờ_biển bãi_bồi đồng_bằng lãnh_nguyên
            đầm_phá ốc_đảo hẻm_núi bãi_biển eo_biển kênh thủy_triều sóng bọt khe_hở
            lòng_chảo trũng đèo chân_núi bãi_lầy gành_đá vũng cửa_hang bầu_trời mặt_đất
            đại_dương ao ruộng cánh_đồng bãi_cỏ bụi_rậm gò dốc ghềnh bùn đất_sét phù_sa băng
            núi_băng rừng_ngập_mặn bờ_sông lòng_sông sườn_núi mỏm_đá nước_ngầm bụi tro khói
            hơi_nước bóng_tối ánh_sáng hóa_thạch thiên_nhiên đồng_hoang suối_nước_nóng
            cửa_biển dung_nham sạt_lở sóng_thần mương đất dãy_núi mũi_đất đầu_nguồn hạ_lưu
            phụ_lưu rạch đá_ngầm đất_liền lục_địa cát_lún hố miệng_núi_lửa bắc_cực nam_cực
        """),
        "plant": words("""
            cây lá hoa rễ hạt quả rêu dương_xỉ tre thông phong anh_đào hoa_hồng hoa_sen
            hoa_cúc hoa_mai hoa_lan bồ_công_anh hướng_dương hoa_súng cỏ cành mầm chồi nụ
            cánh_hoa phấn_hoa vòng_gỗ quả_thông quả_sồi bạch_quả liễu bạch_dương tùng bách
            sồi dẻ tảo bồn_cây hàng_rào_cây bó_hoa cỏ_dại xương_rồng lô_hội thân_cây vỏ_cây
            nhựa_cây gai tầm_gửi nguyệt_quế cây_táo bạch_đàn tần_bì du đoạn cây_gạo keo
            mộc_lan trà_mi thược_dược phong_lữ cẩm_chướng cúc_họa_mi anh_túc dạ_lan_hương
            thủy_tiên hoa_ly cỏ_ba_lá sậy tầm_ma kế linh_lan tử_đằng phượng hoa_giấy hoa_đào
            hoa_ban hoa_sữa cây_đa bàng cau trầu mía lúa bèo lục_bình cỏ_tranh hoa_nhài
            cẩm_tú_cầu dâm_bụt bằng_lăng xoan gỗ nhụy_hoa cây_bụi tán_lá bồ_kết tràm đước
            hoa_đồng_tiền hoa_mười_giờ hoa_quỳnh uất_kim_hương oải_hương thạch_thảo
            hoa_loa_kèn mẫu_đơn dã_quỳ ti_gôn dừa_cạn hoa_sứ hoa_huệ hoa_lay_ơn
            tử_đinh_hương trinh_nữ phi_lao lim vạn_tuế thốt_nốt trúc nứa cỏ_lau dây_leo
            bìm_bìm cỏ_may bồ_đề ngọc_lan hoàng_lan sen_đá lưỡi_hổ trầu_bà cây_cảnh gốc ngọn
            bào_tử rơm địa_y
        """),
        "gem": words("""
            vàng bạc đồng sắt thép đồng_thau thiếc kẽm bạch_kim thủy_tinh pha_lê thạch_anh
            mã_não hổ_phách ngọc_trai ngọc_bích ngọc đá_vôi đá_bazan đá_lửa thiên_thạch
            quặng đá_quý vân_mẫu huỳnh_thạch lưu_huỳnh ngà sa_khoáng than_chì thủy_ngân
            thạch_cao đá_phiến hồng_ngọc lục_bảo đá_mắt_mèo đá_mặt_trăng ngọc_lam kim_cương
            san_hô_đỏ niken titan nhôm chì vonfram coban crom mangan liti urani đá_cẩm_thạch
            đá_sa_thạch đá_phiến_sét đá_ong đá_bọt đá_cuội khoáng_vật tinh_thể đá_hoa_cương
            bô_xít than_đá muối_mỏ đá_bùn đá_tảng phỉ_thúy gang inox hợp_kim kim_loại
            khoáng_sản hoàng_ngọc lam_ngọc thạch_anh_tím ngọc_hồng_lựu opal lưu_ly xà_cừ
            đá_xanh đá_dăm đá_hộc magiê phèn đá_vỏ_chai zircon đá_trầm_tích cao_lanh mica
            thạch_tín natri kali mắt_hổ vôi diêm_tiêu đá_phấn sứ gốm vàng_trắng silic
            đá_núi_lửa đất_hiếm paladi đồng_đen
        """),
        "concept": words("""
            tự_do hòa_bình công_lý chân_lý trí_tuệ ký_ức tưởng_tượng câu_chuyện thơ phác_họa
            ngữ_pháp lô_gic vật_lý hóa_học sinh_học triết_học toán_học hình_học đại_số
            lịch_sử thần_thoại ngụ_ngôn tục_ngữ câu_đố bí_mật lời_hứa chuyến_đi phiêu_lưu
            hải_trình khám_phá thí_nghiệm câu_hỏi câu_trả_lời tranh_luận hội_nghị lễ_hội
            chiều_kích cân_bằng hài_hòa nghi_lễ phong_tục văn_hóa ngôn_ngữ chữ_cái mật_mã
            lưu_trữ lịch chân_trời trực_giác lý_trí phán_đoán học_thuyết định_lý tiên_đề
            giả_thuyết nghịch_lý khuôn_mẫu tiền_đề suy_luận diễn_dịch quy_nạp loại_suy ẩn_dụ
            biểu_tượng chủ_đề tự_sự biên_niên chứng_ngôn tuyên_ngôn đồng_thuận thỏa_hiệp
            giao_ước hiệp_ước liên_minh huyết_thống di_sản truyền_thống ngưỡng_cửa mở_đầu
            kết_cục vần_thơ văn_xuôi tiểu_thuyết tiểu_luận luận_đề tổng_hợp phân_tích
            phương_pháp lý_thuyết thực_hành kỹ_thuật nghệ_thuật khoa_học đạo_đức mỹ_học
            hùng_biện ngữ_nghĩa chính_tả thư_pháp xác_tín ngẫu_nhiên số_phận vận_may
            lương_tâm bản_thể vật_chất hình_thức nguyên_nhân kết_quả trật_tự hỗn_độn
            giới_hạn nguồn_cội kiến_thức ý_tưởng ý_nghĩa quan_điểm niềm_tin đạo_lý lẽ_phải
            nhân_quả luân_hồi giáo_dục pháp_luật dân_chủ trách_nhiệm danh_dự truyền_thuyết
            cổ_tích giấc_mơ ý_thức tinh_thần thói_quen bài_học kinh_nghiệm địa_lý văn_học
            kịch hội_họa điêu_khắc kiến_trúc sự_thật công_bằng bình_đẳng quyền_lợi nghĩa_vụ
            chính_trị xã_hội tôn_giáo tâm_linh tâm_lý_học ngữ_văn tin_học ngoại_ngữ từ_vựng
            truyện_ngắn kịch_bản khái_niệm định_nghĩa mục_tiêu kế_hoạch chiến_lược giải_pháp
            vấn_đề quy_tắc nguyên_tắc lý_do mục_đích thành_công ước_mơ lý_tưởng sức_khỏe
            cái_chết duyên nghiệp thế_giới vẻ_đẹp quy_luật hệ_thống cấu_trúc bằng_chứng
            ý_kiến thông_tin tin_tức trí_nhớ cảm_hứng tài_năng kỹ_năng bản_năng cá_tính
            quyền_lực chiến_tranh cách_mạng độc_lập thiền mỹ_thuật điện_ảnh nhiếp_ảnh
            thời_trang ẩm_thực du_lịch truyện_tranh sử_thi ảo_giác
        """),
        "myth": words("""
            phép_thuật ma_lực thần_chú lời_nguyền tiên_tri sấm_truyền kết_giới bùa_hộ_mệnh
            phong_ấn hình_nhân ma_thuật sách_phép chén_thánh gậy_phép trượng bùa_yêu
            thần_dược thuốc_tiên đũa_thần thảm_bay đèn_thần gương_thần ngọc_ước điềm_báo
            phép_lạ thiên_đường địa_ngục âm_phủ long_cung bùa_chú bùa_ngải phép_màu ma_pháp
            yêu_thuật tà_thuật bói_toán chiêm_tinh giả_kim_thuật thuật_chiêu_hồn luyện_đan
            tiên_đan bàn_đào triệu_hồi dịch_chuyển_tức_thời tàng_hình biến_hình thần_thông
            phân_thân nội_công bí_kíp linh_khí hào_quang trận_pháp nước_thánh thánh_tích
            bảo_vật thần_khí bảo_kiếm quả_cầu_pha_lê hòn_đá_phù_thủy chổi_bay áo_tàng_hình
            thiên_giới thiên_đình cõi_tiên bồng_lai suối_vàng niết_bàn cực_lạc ma_giới
            địa_đàng luyện_ngục cầu_ô_thước cầu_nại_hà sổ_sinh_tử bát_quái phong_thủy tử_vi
            quẻ_bói cấm_thuật huyễn_thuật chú_ngữ nỏ_thần long_châu cung_hoàng_đạo
        """),
        "monster": words("""
            rồng phượng_hoàng kỳ_lân tiên yêu_tinh ma quỷ oan_hồn thần thiên_thần ác_quỷ
            người_cá quái_vật ác_thú thần_thú ma_vương long_vương hắc_long bạch_long bạch_hổ
            chu_tước huyền_vũ cửu_vĩ_hồ chim_lửa người_sói ma_cà_rồng xác_sống người_lùn
            quỷ_lùn tinh_linh thủy_thần sơn_thần hải_thần lôi_thần phong_thần nhân_mã
            nhân_sư thiên_mã hải_quái thần_điểu linh_hồn yêu_nữ mãng_xà khổng_lồ thủy_quái
            thổ_địa hà_bá hồ_ly thần_hộ_mệnh linh_thú ma_trơi quỷ_sứ thiên_binh bụt
            thiên_lôi táo_quân thần_tài tử_thần thần_mặt_trời thuồng_luồng cương_thi
            yêu_quái nữ_thần xác_ướp ma_da ma_xó dạ_xoa la_sát ma_lai ma_rừng ma_trành ma_gà
            quỷ_nhập_tràng giao_long ngạ_quỷ hung_thần long_mã tì_hưu nghê người_tuyết
            người_ngoài_hành_tinh chằn_tinh mộc_tinh ngư_tinh cô_hồn âm_binh thành_hoàng
            thần_đèn thần_tình_yêu tổng_lãnh_thiên_thần ông_ba_bị thiên_cẩu quái_điểu golem
            orc troll gargoyle griffin hydra kraken chimera basilisk
        """),
        "job": words("""
            hiệp_sĩ thợ_săn kẻ_trộm hải_tặc thủy_thủ đầu_bếp thợ_rèn thám_tử nhà_thơ họa_sĩ
            vũ_công chú_hề lữ_khách tu_sĩ nhà_giả_kim cung_thủ kiếm_sĩ võ_sĩ tướng_quân
            binh_sĩ lính_gác vua nữ_hoàng hoàng_tử công_chúa hoàng_đế quản_gia thị_nữ
            người_hầu thương_nhân nông_dân ngư_dân mục_đồng tiều_phu lái_đò phu_xe hoa_tiêu
            phi_công kỹ_sư lao_công lính_cứu_hỏa cảnh_sát bác_sĩ y_tá dược_sĩ thú_y
            giáo_viên học_sinh thủ_thư nhà_báo nhà_văn dịch_giả ca_sĩ diễn_viên đạo_diễn
            nhạc_công thợ_mỏ thợ_mộc thợ_gốm thợ_may thầy_tế học_giả tiến_sĩ trọng_tài
            nghệ_sĩ_xiếc luật_sư thẩm_phán kế_toán thủ_quỹ người_bán bồi_bàn gác_cổng tài_xế
            thợ_máy thợ_ống_nước thợ_hồ thợ_kính thợ_kim_hoàn thợ_giày thợ_cắt_tóc thợ_cạo
            thợ_bánh đồ_tể nhà_khảo_cổ nhà_sinh_học nhà_địa_chất nhà_thực_vật sử_gia
            triết_gia văn_thư thợ_xay thợ_thùng thợ_dệt thợ_sơn nhà_du_hành giáo_sư nha_sĩ
            kiến_trúc_sư nhà_khoa_học nhà_thiên_văn biên_tập_viên người_mẫu nhiếp_ảnh_gia
            nhà_thiết_kế lập_trình_viên thợ_điện thợ_hàn thợ_khóa thợ_lặn thợ_nhuộm thợ_in
            tiếp_viên lễ_tân hướng_dẫn_viên huấn_luyện_viên vận_động_viên bảo_vệ nhân_viên
            giám_đốc thư_ký chủ_quán bà_đỡ thầy_thuốc nhà_sư linh_mục hiệu_trưởng
            thuyền_trưởng nhà_thám_hiểm thị_trưởng đại_sứ cận_vệ sứ_giả gia_sư bảo_mẫu
            công_nhân ảo_thuật_gia nghệ_sĩ nhạc_sĩ nhà_điêu_khắc cai_ngục đao_phủ kẻ_cướp
            gián_điệp sát_thủ đạo_sĩ pháp_sư thầy_bói nhà_tiên_tri hiền_giả phù_thủy
            nhạc_trưởng phi_hành_gia thầy_cúng bà_đồng thầy_mo nhà_chiêm_tinh công_an bộ_đội
            phóng_viên phiên_dịch kỹ_thuật_viên shipper tiểu_thương doanh_nhân chủ_tịch
            thủ_tướng bộ_trưởng tổng_thống sinh_viên giảng_viên nhà_nghiên_cứu
            phát_thanh_viên nhà_ngoại_giao nhà_toán_học nhà_vật_lý nhà_hóa_học
            người_làm_vườn quản_lý trưởng_phòng thu_ngân bưu_tá người_giúp_việc ni_cô mục_sư
            nhà_soạn_nhạc thanh_tra kiểm_lâm
        """),
        "music": words("""
            đàn_piano ghi_ta trống chuông đàn_tranh bài_hát điệu_múa nhịp_điệu giai_điệu
            hòa_âm sáo kèn kèn_trumpet đàn_hạc đàn_cello đàn_viola vĩ_cầm chũm_chọe
            trống_lắc mộc_cầm phong_cầm khẩu_cầm đàn_bầu đàn_nhị đàn_nguyệt bản_nhạc
            nốt_nhạc dấu_lặng âm_giai hợp_xướng đơn_ca hòa_tấu độc_tấu buổi_diễn khúc_kết
            âm_sắc nhịp_phách dàn_nhạc chương_nhạc song_ca tam_ca tứ_tấu ngũ_tấu quãng_tám
            bán_âm khóa_nhạc khuông_nhạc tổng_phổ máy_nhịp đại_hồ_cầm kèn_trombone kèn_tuba
            kèn_túi đàn_cầm cồng chiêng đàn_đá sáo_mèo đàn_tỳ_bà đàn_tam trống_cơm đối_âm
            luyến_âm nhịp_độ điệp_khúc khổ_thơ ca_khúc hợp_ca cao_độ trường_độ âm_vực
            đàn_sến kèn_lá lời_ca nhạc_cụ karaoke hợp_âm mõ trống_đồng đàn_organ
            kèn_saxophone quãng tông ban_nhạc buổi_hòa_nhạc album nhạc_phim ba_lê âm_nhạc
            đàn_ukulele kèn_clarinet đàn_mandolin đàn_đáy đàn_môi khèn kèn_bầu song_loan
            đàn_bass bộ_gõ dây_đàn phím_đàn dùi_trống miếng_gảy giá_nhạc đĩa_nhạc đĩa_than
            băng_cát_xét bản_thu_âm bản_phối bản_hit đĩa_đơn giọng_hát giọng_nam_cao
            giọng_nữ_cao giọng_trầm nhạc_dạo cao_trào màn_trình_diễn liveshow tràng_pháo_tay
            hát_rong dấu_thăng dấu_giáng ngân_rung phần_đệm beat nhạc_nền nhạc_chuông
        """),
        "genre": words("""
            nhạc_pop nhạc_rock nhạc_jazz nhạc_blues nhạc_rap hip_hop nhạc_cổ_điển
            nhạc_đồng_quê nhạc_điện_tử EDM ballad bolero nhạc_trẻ nhạc_vàng nhạc_đỏ nhạc_sến
            nhạc_tiền_chiến nhạc_thiếu_nhi nhạc_xuân nhạc_không_lời nhạc_thiền nhạc_indie
            nhạc_dance nhạc_kịch nhạc_thính_phòng tình_khúc Kpop Jpop Cpop dân_ca đồng_dao
            ca_dao vè khúc_hát_ru hò quan_họ ca_trù chèo tuồng cải_lương xẩm ca_huế nhã_nhạc
            đờn_ca_tài_tử hát_xoan chầu_văn ví_giặm bài_chòi hát_then ngâm_thơ thánh_ca
            thánh_thi tụng_ca quốc_ca hành_khúc giao_hưởng concerto sonata opera operetta
            oratorio cantata cầu_hồn_khúc dạ_khúc khúc_dạo_đầu khúc_mở_màn luyện_khúc fugue
            toccata điệu_valse minuet mazurka polonaise cuồng_tưởng_khúc tổ_khúc scherzo
            rondo aria madrigal motet bình_ca biến_tấu baroque nhạc_soul nhạc_funk
            nhạc_disco nhạc_reggae nhạc_punk nhạc_phúc_âm rhythm_and_blues rock_and_roll
            hard_rock soft_rock alternative_rock indie_rock progressive_rock
            psychedelic_rock garage_rock folk_rock surf_rock grunge britpop post_rock
            shoegaze emo heavy_metal death_metal black_metal thrash_metal doom_metal
            power_metal metalcore nu_metal city_pop synthpop dance_pop electropop dream_pop
            indie_pop teen_pop art_pop power_pop bubblegum_pop latin_pop nhạc_house
            deep_house tech_house progressive_house electro_house acid_house future_house
            tropical_house vinahouse techno minimal_techno trance psytrance dubstep
            drum_and_bass breakbeat trap future_bass hardstyle hardcore electro ambient
            chillout downtempo trip_hop lofi synthwave vaporwave eurodance eurobeat nu_disco
            big_room moombahton bebop swing smooth_jazz bluegrass ska dancehall reggaeton
            salsa samba bossa_nova tango flamenco fado cumbia bachata mambo rumba
            cha_cha_cha polka acoustic new_age
        """),
        "place": words("""
            chợ quảng_trường thành_phố làng ngõ cầu vườn công_viên cảng bến_tàu sân_chơi
            bể_bơi vườn_thú đường_hầm cầu_vượt ngã_tư đường_dạo nông_trại trang_trại hào
            bến_phà đê bãi_cắm_trại xóm nghĩa_trang hội_chợ khu_phố ngoại_ô đại_lộ lối_đi
            lối_tắt ngã_ba bến_đò đập_nước cống cầu_dẫn bãi_đỗ_xe hàng_rào sân giếng bãi_rác
            mỏ công_trường phố vỉa_hè quốc_lộ đường_cao_tốc đài_phun_nước tượng_đài thị_trấn
            thủ_đô quê nông_thôn biên_giới con_đường hẻm thôn ấp xã huyện tỉnh quận phường
            thị_xã đô_thị kinh_đô cầu_tàu đê_chắn_sóng chợ_nổi phố_đi_bộ vòng_xuyến hầm_chui
            đường_ray đường_mòn khu_vui_chơi vườn_bách_thảo vườn_quốc_gia khu_bảo_tồn mộ
            sân_golf trạm_xe_buýt cửa_khẩu trạm_thu_phí khu_công_nghiệp khu_dân_cư phế_tích
            di_tích cầu_khỉ đường_băng đồn_điền đồng_muối bờ_kè cột_mốc lãnh_thổ vùng
            quốc_gia dải_phân_cách làn_đường trạm_dừng_chân tỉnh_lộ khu_du_lịch địa_điểm
            cổng_làng
        """),
        "building": words("""
            thư_viện bảo_tàng nhà_hát trường_học nhà_ga sân_bay hải_đăng lâu_đài tường_thành
            cung_điện chùa đền tháp gác_mái tầng_hầm mái_nhà sân_trong hiên nhà_kính lều_gỗ
            đài_quan_sát sân_vận_động nhà_thi_đấu thủy_cung nhà_tắm bưu_điện ngân_hàng
            bệnh_viện hiệu_thuốc hiệu_sách tiệm_bánh quán_cà_phê nhà_hàng bếp phòng_ngủ
            phòng_khách hành_lang cầu_thang pháo_đài nhà_thờ tu_viện thành_lũy biệt_thự
            dinh_thự nhà_nguyện am lăng_mộ hầm_mộ thánh_đường nhà_trọ quán_trọ quán_ăn
            quán_rượu cối_xay_gió lò_rèn xưởng nhà_kho chuồng nhà_sàn trạm_gác phòng lớp_học
            văn_phòng cửa_hàng siêu_thị tiệm_cắt_tóc rạp_phim rạp_xiếc khách_sạn bến_xe
            trạm_xăng cổng ban_công sân_thượng doanh_trại nhà_tù tòa_án tòa_nhà chung_cư
            ký_túc_xá nhà_máy phòng_thí_nghiệm phòng_khám nhà_vệ_sinh phòng_ăn sảnh túp_lều
            nhà_tranh đình miếu sân_khấu ống_khói căn_hộ nhà_phố nhà_ống nhà_cấp_bốn chòi
            lán penthouse officetel nhà_liền_kề nhà_riêng phòng_trọ nhà_nghỉ homestay resort
            bất_động_sản mặt_bằng lô_đất thổ_cư cao_ốc nhà_chọc_trời nhà_tập_thể mẫu_giáo
            nhà_trẻ trường_đại_học trung_tâm_thương_mại nhà_văn_hóa trụ_sở tòa_thị_chính
            đồn_công_an trạm_cứu_hỏa đại_sứ_quán lãnh_sự_quán trạm_y_tế viện_dưỡng_lão
            trại_trẻ_mồ_côi tiệm_tạp_hóa cửa_hàng_tiện_lợi tiệm_vàng tiệm_may tiệm_giặt
            tiệm_hoa tiệm_net tiệm_cầm_đồ quán_bar quán_nhậu căng_tin nhà_ăn spa
            thẩm_mỹ_viện phủ từ_đường thiền_viện phòng_tập cung_thiên_văn đài_thiên_văn
            sòng_bạc vũ_trường phòng_trà phòng_xông_hơi ga_ra nhà_chờ sân_ga lò_gạch
            phòng_thu kho_thóc cối_xay_nước kim_tự_tháp nhà_rông nhà_dài thủy_đình lầu
            tháp_chuông phòng_làm_việc phòng_chờ phòng_họp phòng_thay_đồ phòng_thờ thang_máy
            thang_cuốn gác_xép mái_hiên tường cửa_sổ cửa sàn_nhà trần_nhà tầng móng_nhà
            mái_vòm xà_nhà lan_can bậc_thềm khán_phòng hội_trường giảng_đường khán_đài nhà
        """),
        "food": words("""
            cơm mì phở bún bánh_mì bánh_bao bánh_xèo bánh_chưng nem chả giò_lụa sữa_chua
            sô_cô_la kẹo thạch bánh_quy bánh_ngọt bánh_pudding bánh_rán bánh_kếp bánh_kem
            mứt dưa_muối kim_chi cháo xôi chè bánh_trôi thịt_nướng gỏi_cuốn bánh_cuốn
            bánh_đúc bánh_gai bánh_tét canh súp lẩu bánh_nướng bánh_khúc bánh_tro bánh_bèo
            bánh_nậm bún_bò bún_riêu miến hủ_tiếu bánh_giò bánh_bột_lọc bánh_dày cốm
            xúc_xích canh_chua bún_chả cơm_tấm mì_quảng pizza mì_tôm khoai_tây_chiên kem
            bánh_canh bánh_cam bánh_da_lợn bánh_flan bánh_bông_lan bánh_trung_thu bánh_pía
            bánh_khọt bánh_căn bánh_hỏi bánh_ít bánh_quẩy bánh_chuối bánh_gối bánh_đa
            bánh_phồng_tôm bim_bim bỏng_ngô kẹo_mút kẹo_cao_su kẹo_bông cơm_rang cơm_gà
            cơm_nắm cơm_lam bún_ốc mì_xào hoành_thánh há_cảo sủi_cảo xíu_mại bò_kho bít_tết
            bò_lúc_lắc gà_rán vịt_quay heo_quay thịt_kho cá_kho chả_cá nem_chua nem_nướng
            gỏi trứng_ốp_la hột_vịt_lộn tào_phớ hamburger mì_ý sushi cà_ri lạp_xưởng ô_mai
            bánh_bò bánh_đậu_xanh bánh_cốm bánh_sừng_bò tiramisu
        """),
        "ingredient": words("""
            muối đường tiêu đậu_phụ trứng phô_mai tương_ớt nước_mắm mắm_tôm lúa_mạch_đen
            lúa_mạch yến_mạch đậu_lăng đậu_gà đậu_xanh đậu_nành hạt_dẻ đậu_phộng hạt_điều
            thịt_bò thịt_gà thịt_lợn vừng gạo bột giăm_bông bánh_tráng mật_ong dầu_ăn
            nước_tương hạt_sen thịt_vịt thịt_cừu thịt_ba_chỉ sườn thịt_băm chân_giò đùi_gà
            cánh_gà ức_gà mỡ thịt_xông_khói pa_tê kem_tươi sữa_đặc nếp lúa_mì tinh_bột kê
            cao_lương mạch_nha bột_ngọt hạt_nêm nước_dùng nước_cốt_dừa dầu_hào tương_cà
            mayonnaise mù_tạt giấm mẻ ớt_bột quế hoa_hồi đinh_hương ngũ_vị_hương thảo_quả
            vani hạt_bí hạt_dưa hạt_hướng_dương hạt_chia hạt_mắc_ca hạt_dẻ_cười đậu_đỏ
            đậu_đen váng_đậu tôm_khô cá_khô hải_sản mật_mía nui nước_sốt chao bơ_đậu_phộng
            trân_châu si_rô hương_thảo mùi_tây nghệ_tây hạnh_nhân óc_chó sả gừng riềng nghệ
            rong_biển
        """),
        "vegetable": words("""
            tỏi hành khoai cà_rốt dưa_chuột bí_đỏ cải_thảo rau_xà_lách rau_bina nấm ngô
            cà_chua ớt_chuông cà_tím bí_ngòi súp_lơ atisô măng_tây tỏi_tây củ_cải củ_dền
            cần_tây rau rau_muống bắp_cải đậu ớt giá_đỗ măng khoai_tây khoai_lang
            bông_cải_xanh húng_quế bạc_hà thì_là rau_mùi hẹ rau_răm tía_tô kinh_giới diếp_cá
            lá_lốt rau_má sắn cải_xanh cải_ngọt cải_cúc rau_dền rau_ngót rau_lang mồng_tơi
            rau_đay rau_cần cải_xoong su_hào su_su bí_đao bầu mướp mướp_đắng đậu_bắp
            đậu_cô_ve đậu_đũa đậu_Hà_Lan củ_sen củ_đậu củ_kiệu khoai_môn hành_tây cà_pháo
            nấm_rơm nấm_hương nấm_kim_châm nấm_mỡ mộc_nhĩ ngó_sen bắp_chuối rau_thơm ngò_gai
            thiên_lý rau_rút
        """),
        "fruit": words("""
            bơ táo dâu nho dưa_hấu đào hồng quýt chanh chuối xoài lê mận lựu mộc_qua mơ bưởi
            kiwi đu_đủ dứa mít sầu_riêng nhãn chôm_chôm măng_cụt cam me sim ổi mâm_xôi ô_liu
            dừa thanh_long vải_thiều chanh_leo bòn_bon chà_là sung hồng_xiêm vú_sữa na
            mãng_cầu_xiêm khế sơ_ri cherry việt_quất dâu_tằm dưa_lưới dưa_lê táo_tàu táo_mèo
            quất sấu trám dâu_da nhót
        """),
        "sport": words("""
            bóng_đá bóng_chày bóng_rổ bóng_chuyền bóng_bàn quần_vợt cầu_lông gôn bowling
            bi_a bơi_lội điền_kinh thể_dục karate judo kiếm_đạo đấu_vật quyền_anh đấu_kiếm
            bắn_cung bắn_súng cưỡi_ngựa chèo_thuyền lướt_sóng trượt_tuyết khúc_côn_cầu
            bóng_bầu_dục leo_núi nhảy_dây vợt khung_thành huy_chương cúp vô_địch chung_kết
            vòng_loại cổ_vũ lật_ngược hiệp_phụ luyện_tập trượt_băng nhảy_cầu phi_tiêu
            chạy_bộ vượt_rào ném_lao ném_đĩa tiếp_sức bảng_điểm mũ_bảo_hiểm phạm_lỗi nhảy_xa
            nhảy_cao xà_kép lễ_khai_mạc lễ_bế_mạc nhảy_dù bóng_nước đấu_tập cú_móc hạ_đo_ván
            vật_ngã lộn_nhào khởi_động hội_ý đua_thuyền ném_tạ nhảy_sào ván_nhún thảm_tập
            ngựa_gỗ tiền_đạo hậu_vệ sân_bóng đường_chạy phạt_đền phạt_góc thẻ_vàng tỷ_số hòa
            chiến_thắng thất_bại kỷ_lục giải_đấu giải_vô_địch cầu_môn cầu_mây đá_cầu
            võ_thuật taekwondo vovinam thể_hình yoga marathon đua_xe_đạp đua_xe đua_ngựa
            patin trượt_ván lặn thể_thao thi_đấu trận_đấu đội cầu_thủ thủ_môn cổ_động_viên
            khán_giả đường_đua vạch_đích quả_bóng tạ xà_đơn giải_thưởng đội_tuyển hiệp
            bàn_thắng cú_sút đường_chuyền việt_vị thẻ_đỏ thế_vận_hội thể_dục_dụng_cụ
            chạy_việt_dã ba_môn_phối_hợp cử_tạ kickboxing võ_cổ_truyền sumo aikido wushu
            thái_cực_quyền bóng_ném futsal thể_thao_điện_tử đạp_xe câu_cá đá_phạt ném_biên
            bàn_phản_lưới tiền_vệ đội_trưởng cầu_thăng_bằng vật_tay bi_sắt pickleball
            bán_kết tứ_kết vòng_bảng cú_đấm võ_đài đai_đen
        """),
        "vehicle": words("""
            xe_đạp tàu_hỏa thuyền xe_trượt ô_tô xe_buýt taxi xe_tải xe_máy xe_ga máy_bay
            trực_thăng phi_thuyền tên_lửa tàu_ngầm du_thuyền tàu_hàng tàu_khách thuyền_buồm
            bè tàu_chiến xe_tăng xe_ngựa xe_kéo xe_đẩy xe_nâng máy_kéo máy_xúc xe_cứu_hỏa
            xe_cảnh_sát cáp_treo tàu_điện toa_xe đầu_máy dù kiệu xe_ba_bánh xe_van
            xe_bán_tải xe_limousine xe_ủi_tuyết tàu_một_ray tàu_hai_thân tàu_phá_băng
            tàu_dầu sà_lan tàu_thăm_dò tàu_đổ_bộ tàu_con_thoi xe_địa_hình xe_một_bánh
            xe_tang xe_nôi xe_tưới_nước tàu_tuần_tra tàu_lặn xuồng toa_giường xe_thổ_mộ
            xe_mui_trần xe_ben xe_trộn cần_cẩu xe_lu máy_gặt ván_trượt xe_đạp_điện
            thuyền_thúng ghe xuồng_ba_lá tàu_hộ_tống tàu_khu_trục tàu_cao_tốc tàu_lượn
            xe_bồn xe_rác xe_khách xe_ôm xe_thồ xe_điện xe_lăn xe_cứu_thương xe_bò xe_lam
            xích_lô mô_tô xe_đua xe_thể_thao xe_bọc_thép tàu_điện_ngầm tàu_thủy tàu_sân_bay
            tàu_cá tàu_kéo thuyền_rồng thuyền_độc_mộc ca_nô phà tiêm_kích drone
            khinh_khí_cầu dù_lượn xe_cút_kít xe_cứu_hộ kayak xuồng_máy xe_ba_gác tắc_ráng
            vỏ_lãi xe_lôi đò xe_công_nông xe_giường_nằm thuyền_cứu_sinh máy_bay_ném_bom
            tàu_đệm_khí máy_ủi xe_container mô_tô_nước cáng
        """),
        "product": words("""
            máy_tính bàn_phím màn_hình máy_in loa tai_nghe micrô điện_thoại sạc pin
            điều_khiển tủ_lạnh máy_giặt máy_hút_bụi quạt_máy điều_hòa lò_sưởi máy_lọc_nước
            nồi_cơm_điện lò_vi_sóng lò_nướng máy_xay máy_tạo_ẩm máy_hút_ẩm bàn_chải xà_phòng
            máy_chiếu máy_quét nồi_hấp máy_rửa_bát máy_sấy chuông_cửa nhiệt_kế bình_cứu_hỏa
            bóng_đèn dây_nối ổ_cắm nước_giặt nước_xả móc_áo khăn_tắm áo_tắm_dài vòi_sen
            vòi_nước cây_lau_nhà cốc_đong thìa_đong cây_cán_bột máy_trộn ti_vi cân bàn_là
            máy_nướng nồi_chiên máy_ép ấm_điện bộ_đồ_ăn khăn_ăn giá_bát bồn_rửa bồn_tắm
            gương_soi hộp_đựng lọ_muối đế_lót khay_đá máy_tính_bảng laptop chuột_máy_tính
            ổ_cứng thẻ_nhớ máy_chơi_game đồng_hồ đồng_hồ_báo_thức máy_ghi_âm máy_quay camera
            bếp_ga bếp_từ máy_pha_cà_phê bình_giữ_nhiệt bình_nóng_lạnh quạt_trần máy_hút_mùi
            máy_massage kem_đánh_răng sữa_tắm thuốc khẩu_trang giấy_vệ_sinh khăn_giấy tã
            bình_sữa túi_ni_lông nước_rửa_bát thuốc_tẩy bột_giặt sơn hộp_cơm máy_bơm
            máy_phát_điện dây_điện công_tắc ắc_quy lốp thuốc_lá vé thẻ_sim radio
            máy_photocopy tủ_đông nồi_áp_suất webcam đồng_hồ_thông_minh máy_lọc_không_khí
            pin_dự_phòng nước_lau_sàn nước_rửa_tay băng_vệ_sinh tăm_bông chỉ_nha_khoa
            nước_súc_miệng lăn_khử_mùi khăn_ướt vợt_muỗi phích_cắm ăng_ten đầu_đĩa
            máy_tính_cầm_tay bình_ga màng_bọc_thực_phẩm cặp_lồng khăn_mặt bông_tắm
        """),
        "beauty": words("""
            son dao_cạo dầu_gội nước_hoa máy_sấy_tóc kem_dưỡng dũa_móng sữa_rửa_mặt
            kem_chống_nắng dầu_xả máy_cạo_râu lược mỹ_phẩm trang_điểm chăm_sóc_da phấn_phủ
            kem_nền kem_che_khuyết_điểm phấn_má bút_kẻ_mắt chì_kẻ_mày chì_kẻ_môi mascara
            phấn_mắt son_dưỡng son_bóng kem_lót phấn_nước xịt_khoáng nước_tẩy_trang
            bông_tẩy_trang nước_hoa_hồng serum tinh_chất sữa_dưỡng_thể mặt_nạ_giấy
            tẩy_tế_bào_chết tinh_dầu sáp_vuốt_tóc keo_xịt_tóc thuốc_nhuộm_tóc uốn_tóc
            duỗi_tóc máy_uốn_tóc máy_ép_tóc cọ_trang_điểm bông_phấn kẹp_mi mi_giả nhíp
            bấm_móng_tay sơn_móng_tay làm_móng gội_đầu mát_xa tóc_giả tẩy_lông phun_xăm
            nối_mi bọt_cạo_râu ủ_tóc dầu_dưỡng_tóc kem_mắt kem_trị_mụn miếng_dán_mụn
            phấn_bắt_sáng tạo_khối kiểu_tóc máy_rửa_mặt lô_cuốn_tóc nước_rửa_móng móng_giả
            phấn_rôm kem_tay nặn_mụn cắt_tóc búi_tóc tóc_mái tóc_đuôi_ngựa bím_tóc xịt_thơm
            làm_đẹp thẩm_mỹ nâng_mũi cắt_mí botox tắm_trắng gel_vuốt_tóc tông_đơ
        """),
        "color": words("""
            đỏ_son hồng_đào cam_đất vàng_nghệ vàng_chanh xanh_lá xanh_rêu xanh_ngọc xanh_lam
            xanh_biển xanh_da_trời chàm tím_than tím_hoa_cà nâu_đất nâu_cà_phê be xám_tro
            xám_khói trắng_ngà trắng_sữa đen_tuyền bạc_kim đỏ_gạch đỏ_ruby hồng_phấn
            hồng_sen cam_cháy vàng_kim vàng_mơ vàng_đồng màu_lục_bảo xám_bạc màu_ngọc_lam
            màu_hổ_phách màu_cát màu_mực màu_máu lam_biếc tím_biếc nâu_đỏ xám_xanh
            trắng_ngần hồng_cam vàng_hoe huyết_dụ đỏ_cam màu_đỏ màu_xanh màu_vàng màu_trắng
            màu_đen màu_tím màu_nâu màu_hồng màu_xám màu_cam màu_bạc màu_kem xanh_ô_liu
            xanh_lơ xanh_bạc_hà xanh_cổ_vịt tím_oải_hương tím_huế đỏ_đô đỏ_cờ đỏ_tía
            vàng_cam vàng_rơm nâu_gỗ nâu_sô_cô_la nâu_hạt_dẻ nâu_vàng xám_lông_chuột xám_chì
            trắng_bạc đen_huyền màu_pastel màu_neon sắc_độ tông_màu bảng_màu màu_sắc
            xanh_dương xanh_navy đỏ_mận đỏ_san_hô vàng_nắng vàng_bơ vàng_mù_tạt trắng_sứ
            trắng_tuyết đen_than xanh_cốm xanh_nõn_chuối xanh_lá_mạ xanh_két xanh_coban
            xanh_hòa_bình tím_cà nâu_cánh_gián màu_da màu_gỉ_sắt đơn_sắc xanh_bơ vàng_đất
            đỏ_gụ tím_hoa_sim trắng_ngọc_trai xám_xi_măng xám_than hồng_ruốc màu_cà_phê_sữa
        """),
        "finance": words("""
            sổ_cái hóa_đơn biên_lai trái_phiếu cổ_phiếu cổ_tức lãi_suất khoản_vay thế_chấp
            tiền_gửi tiết_kiệm tài_khoản số_dư ngân_sách kiểm_toán tài_sản nợ_phải_trả
            doanh_thu lợi_nhuận thặng_dư thâm_hụt khoản_nợ tín_dụng tiền_tệ tỷ_giá lợi_suất
            thuế_quan hoàn_thuế phí_bảo_hiểm lương_hưu bảng_lương tiền_lương tiền_thưởng
            nhượng_quyền sáp_nhập thâu_tóm cứu_trợ két_sắt kho_bạc chuyển_tiền quyết_toán
            thấu_chi sao_kê sổ_tiết_kiệm chủ_nợ con_nợ người_đi_vay định_giá thẩm_định
            lạm_phát suy_thoái thanh_khoản phá_sản của_trời_cho trợ_cấp phụ_cấp chi_phí
            vòng_quay chiết_khấu trả_góp sổ_quỹ hợp_đồng văn_tự hối_phiếu hạn_ngạch
            khoản_phí thuế tiền_phạt tiền_cọc của_hồi_môn thừa_kế tiền_thuê kho_báu giàu_có
            nghèo_khó tích_lũy phụ_thu doanh_số lỗ vốn quỹ tiền_lãi sổ_nợ tiền_mặt tiền
            tiền_xu tiền_giấy đô_la thẻ_tín_dụng ví_điện_tử chuyển_khoản séc cổ_đông
            nhà_đầu_tư đầu_tư chứng_khoán thị_trường giá_cả giảm_giá khuyến_mãi thanh_toán
            bảo_hiểm thu_nhập chi_tiêu tiền_tiêu_vặt heo_đất lì_xì của_cải tài_chính kinh_tế
            thương_mại xuất_khẩu nhập_khẩu cổ_phần sổ_đỏ tiền_boa tiền_lẻ học_phí tiền_điện
            giá_trị tăng_trưởng khủng_hoảng tiền_giả cầm_đồ nợ_xấu bảo_lãnh tín_chấp lãi_kép
            ngoại_tệ tiền_ảo doanh_nghiệp công_ty tập_đoàn thương_hiệu đơn_hàng giao_dịch
            sàn_giao_dịch báo_giá nợ_công tiền_chuộc bồi_thường hối_lộ rửa_tiền trốn_thuế
            hoàn_tiền phiếu_giảm_giá
        """),
        "tech": words("""
            máy_chủ bộ_nhớ_đệm bộ_đệm điểm_ảnh mã_hóa gói_tin giao_thức hàng_đợi ngăn_xếp
            con_trỏ phần_sụn sổ_đăng_ký băng_thông độ_trễ cổng_kết_nối tường_lửa mạng_con
            tên_máy tải_trọng mã_kiểm_tra lược_đồ bản_sao_lưu cụm_máy phân_mảnh bản_sao
            ảnh_chụp vùng_chứa hộp_cát đường_ống kho_mã trình_gỡ_lỗi lệnh_tắt mảng ma_trận
            số_nguyên cú_pháp mã_máy lệnh ngắt thanh_ghi tốc_độ_bit thông_lượng bắt_tay
            trung_gian điểm_cuối giải_mã băm kết_xuất bộ_tô_bóng kết_cấu đa_giác khung_dây
            khung_nhìn bộ_đệm_khung tám_bit đường_lên đường_xuống định_tuyến chuyển_mạch
            bắc_cầu hệ_thống_tệp phân_vùng thư_mục liên_kết_mềm khôi_phục di_trú nhân
            tiến_trình phiên truy_vấn chỉ_mục bảng cột hàng trường nút đồ_thị danh_sách
            tập_hợp mô_đun tiện_ích bản_vá nhánh phiên_bản bản_dựng kiểm_thử hồ_sơ ngưỡng
            sự_kiện tín_hiệu luồng bộ_lọc gói_cài kho_lệnh mã_nguồn nhãn_dán mạng internet
            wifi phần_mềm phần_cứng ứng_dụng trang_web trình_duyệt mật_khẩu email tin_nhắn
            dữ_liệu cơ_sở_dữ_liệu thuật_toán lập_trình lỗi virus tin_tặc bảo_mật đám_mây
            trí_tuệ_nhân_tạo robot chip bộ_xử_lý bo_mạch bộ_nhớ hệ_điều_hành cập_nhật
            tải_xuống đăng_nhập mã_vạch cảm_biến mạch_điện bóng_bán_dẫn mạng_xã_hội
            đường_truyền cáp_quang bộ_định_tuyến tệp chatbot học_máy bit byte tên_miền
            máy_khách giao_diện trình_soạn_thảo thư_rác mã_độc lỗ_hổng xác_thực hộp_thư
            đường_dẫn trang_chủ công_cụ_tìm_kiếm bình_luận lượt_thích bài_đăng livestream
            video ảnh_đại_diện đồng_bộ bán_dẫn bluetooth định_vị thực_tế_ảo ổ_đĩa máy_ảo
            trình_biên_dịch biến vòng_lặp trung_tâm_dữ_liệu
        """),
        "weather": words("""
            mây gió mưa tuyết sương_giá sương_mù sương cầu_vồng hoàng_hôn sét sấm mưa_rào
            gió_mùa bão lốc_xoáy bão_tuyết mưa_phùn gió_giật mưa_đá mưa_tuyết tia_nắng
            ảo_ảnh quầng_sáng giọt_mưa băng_giá sương_muối nắng_nóng đợt_nóng đợt_lạnh
            gió_bấc gió_nồm gió_lào áp_thấp áp_cao thời_tiết khí_hậu nhiệt_độ độ_ẩm khí_áp
            trời_quang trời_râm bóng_râm cơn_giông chớp vòi_rồng mưa_ngâu mưa_dầm băng_tan
            trời_nồm oi_bức rét_đậm rét_hại trời_âm_u quầng_trăng ráng_chiều hạn_hán lũ_lụt
            triều_cường gió_chướng nắng bão_cát cuồng_phong trời_lạnh tuyết_lở mưa_axit
            mưa_bóng_mây giá_rét hanh_khô không_khí khí_quyển tầng_ozon dự_báo mùa_mưa
            mùa_khô tia_cực_tím bụi_mịn bông_tuyết lũ_quét gió_heo_may mây_tích điểm_sương
            gió_tín_phong nước_dâng xoáy_thuận mắt_bão mây_tầng mây_ti mây_vũ_tích hạn_mặn
            biến_đổi_khí_hậu hiệu_ứng_nhà_kính giọt_sương mưa_băng mây_ngũ_sắc khói_mù
            ngập_úng ráng_mỡ_gà rãnh_áp_thấp mùa_bão mùa_lũ
        """),
        "space": words("""
            sao mặt_trăng mặt_trời thiên_hà sao_chổi sao_băng cực_quang bụi_sao dải_ngân_hà
            nhật_thực nguyệt_thực thiên_đỉnh vũ_trụ hành_tinh vệ_tinh tinh_vân cụm_sao
            chòm_sao quỹ_đạo trọng_lực tự_quay nhật_hoa vết_đen gió_mặt_trời bề_mặt_trăng
            năm_ánh_sáng thiên_thể liên_sao định_tinh thiên_cầu hoàng_đạo hố_đen
            mưa_sao_băng bụi_vũ_trụ hệ_mặt_trời chân_không trăng_khuyết trăng_tròn trăng_non
            sao_bắc_cực thị_sai parsec thiên_để phương_vị cận_nhật viễn_nhật quang_cầu
            sắc_cầu tầng_điện_ly tầng_đối_lưu trọng_trường sao_lùn sao_đôi tàu_vũ_trụ
            thiên_văn vành_đai_sao đĩa_sao lỗ_sâu sao_siêu_mới tiểu_hành_tinh sao_neutron
            vụ_nổ_lớn vật_chất_tối kính_thiên_văn trạm_vũ_trụ bão_mặt_trời bắc_đẩu
            sao_thiên_lang tinh_tú không_gian trục hố_thiên_thạch sao_xung chuẩn_tinh
            hành_tinh_lùn không_trọng_lực tinh_cầu tia_vũ_trụ bức_xạ đĩa_bay sao_thần_nông
            trăng_máu siêu_trăng ngoại_hành_tinh năng_lượng_tối phản_vật_chất sóng_hấp_dẫn
            chân_trời_sự_kiện điểm_kỳ_dị từ_quyển nhật_quyển sao_ngưu_lang sao_chức_nữ
            sao_tua_rua sao_biến_quang rác_vũ_trụ vũ_trụ_học cụm_thiên_hà xích_vĩ xích_kinh
        """),
        "planet": words("""
            sao_Thủy sao_Kim Trái_Đất sao_Hỏa sao_Mộc sao_Thổ sao_Thiên_Vương sao_Hải_Vương
            sao_Diêm_Vương Ceres Eris Haumea Makemake Sedna Quaoar Orcus Gonggong Salacia
            Varuna Ixion Vesta Pallas Juno Hygiea Psyche Eros Bennu Ryugu Itokawa Apophis
            Arrokoth Theia Vulcan Phaeton Dimidium Spe Orbitar Fortitudo Ægir Amateru Dagon
            Meztli Smertrios Phobetor Tassili Madriu Yanyan Tondra Eburonia Yvaga Mastika
            Bendida Nakanbé Awasis Wangshu Pipitea Asye Veles Boinayel Eyeke Cayahuanca
            Hämarik Abol Bélisama Mintome Toge Santamasa Noifasui Chura Buru Staburags
            Baiduri Cuptor Xólotl Hairu Laligurans Kererū Albmi Perwana Pollera Viculus
            Samagiya Ramajay Khomsa Barajeel Cruinlagh Ibirapitá Madalitso Bambaruush Tahay
            Awohali Enaiposha Phailinsiam Levantes Najsakopajk Qingluan Cuancoá Astrolábos
            Ahra Aumatex Ixbalanqué Surt Haik Mulchatna Makombé Zembretta Bocaprins Agouto
        """),
        "time": words("""
            bình_minh chạng_vạng hạ_chí đông_chí xuân_phân thu_phân mùa khoảnh_khắc
            vĩnh_hằng tương_lai sát_na năm_tháng ngày_lễ buổi_sáng buổi_trưa buổi_chiều
            buổi_tối nửa_đêm chính_ngọ rạng_sáng sáng_sớm hôm_qua hôm_nay ngày_mai ngày_kia
            hôm_kia quá_khứ hiện_tại thế_kỷ thập_kỷ kỷ_nguyên thời_đại cuối_tuần năm_nay
            năm_ngoái năm_sau mùa_xuân mùa_hè mùa_thu mùa_đông giây_lát giao_thừa rằm
            sinh_nhật thời_hạn ngày_xưa tiết_khí lập_xuân lập_hạ lập_thu lập_đông thời_khắc
            thời_gian thiên_thu thời_thơ_ấu tuổi_trẻ tuổi_già quãng_đời bây_giờ sau_này phút
            giây giờ chu_kỳ ca vòng giai_đoạn chặng niên_đại thế_hệ tuần_trăng khắc chiều_tà
            ngày_thường ngày_nghỉ nửa_ngày độ_dài ngày đêm tuần tháng năm tháng_giêng
            tháng_chạp tết trung_thu giáng_sinh năm_mới giờ_cao_điểm dịp kỳ_nghỉ nghỉ_hè
            học_kỳ năm_học tuổi trung_niên cuộc_đời kiếp thời_kỳ thời_điểm thiên_niên_kỷ
            mùa_gặt tuần_trước tuần_sau mùng_một ngày_giỗ ngày_cưới thứ_hai thứ_ba thứ_tư
            thứ_năm thứ_sáu thứ_bảy chủ_nhật hạn_chót kỷ_niệm trung_cổ tiền_sử cổ_đại
            thanh_minh đoan_ngọ vu_lan tuần_trăng_mật múi_giờ âm_lịch dương_lịch
        """),
        "emotion": words("""
            can_đảm tò_mò cô_độc hoài_niệm khát_khao đồng_cảm trắc_ẩn lòng_biết_ơn
            khiêm_nhường kiên_nhẫn chuyên_cần thận_trọng điều_độ kiên_cường chính_trực
            chân_thành kinh_ngạc kính_sợ thanh_thản tình_bạn đoàn_kết ganh_đua niềm_vui
            nỗi_buồn cơn_giận nỗi_sợ ngạc_nhiên hân_hoan hạnh_phúc sung_sướng ngây_ngất
            an_ủi nhẹ_nhõm hy_vọng tuyệt_vọng đau_thương u_sầu ảm_đạm nỗi_cô_đơn hối_tiếc
            ăn_năn tội_lỗi xấu_hổ tự_hào kiêu_ngạo đố_kỵ ghen_tuông tham_lam ham_muốn đam_mê
            tình_cảm trìu_mến dịu_dàng ấm_áp tử_tế cảm_thông thương_hại tin_tưởng nghi_ngờ
            hoài_nghi lo_lắng bồn_chồn khiếp_sợ hoảng_loạn thịnh_nộ phẫn_nộ bực_bội khó_chịu
            chán_nản thờ_ơ nhiệt_huyết hăng_hái phấn_khích háo_hức quyết_tâm ý_chí tự_tin
            khiêm_tốn điềm_tĩnh bình_tĩnh can_trường rụt_rè hớn_hở tâm_trạng đắng_cay
            oán_hận căm_ghét khinh_thường ngờ_vực chán_chường sầu_muộn tủi_hờn khuây_khỏa
            sùng_kính khoan_dung độ_lượng thiện_chí mến_mộ ác_cảm hoan_hỉ mãn_nguyện
            thấp_thỏm bồi_hồi sửng_sốt hối_hận day_dứt khát_vọng rạo_rực nôn_nao ngưỡng_mộ
            tình_yêu nỗi_nhớ tình_thương hồi_hộp hài_lòng thất_vọng bất_an ngại_ngùng
            hờn_dỗi bối_rối lòng_tốt lòng_tự_trọng cảm_xúc nỗi_đau thù_hận sảng_khoái
            nhàm_chán bàng_hoàng tự_ti cảm_động tủi_thân áp_lực căng_thẳng đau_khổ bình_yên
            an_nhiên vô_tư ích_kỷ kính_trọng lãng_mạn chung_thủy phản_bội trống_rỗng
            rung_động
        """),
        "body": words("""
            đầu trán lông_mày lông_mi mí_mắt mũi lỗ_mũi má cằm hàm môi lưỡi răng lợi tai
            dái_tai cổ gáy vai khuỷu_tay cổ_tay lòng_bàn_tay đốt_ngón ngón_tay ngón_cái
            móng_tay nắm_tay ngực xương_sườn bụng rốn cột_sống eo hông đùi đầu_gối ống_chân
            bắp_chân mắt_cá gót ngón_chân móng_chân xương hộp_sọ cơ_bắp gân dây_chằng khớp
            sụn tim phổi gan dạ_dày thận lá_lách ruột bàng_quang não thần_kinh tĩnh_mạch
            động_mạch mao_mạch máu thịt da lỗ_chân_lông tóc râu nước_mắt mồ_hôi nước_bọt
            hơi_thở mạch nhịp_tim xương_đòn xương_gò_má màng_nhĩ nhãn_cầu nếp_nhăn tàn_nhang
            sẹo vết_bầm phồng_rộp chai_tay thái_dương vòm_miệng amidan thanh_quản hầu
            khí_quản thực_quản cơ_hoành xương_ức xương_bả đốt_sống khung_chậu xương_đùi
            xương_chày xương_mác cánh_tay cẳng_tay mu_bàn_chân nách bẹn khoeo mống_mắt
            con_ngươi giác_mạc võng_mạc vách_ngăn lưỡi_gà mắt tay chân bàn_tay bàn_chân lưng
            mông lông răng_nanh cổ_họng tế_bào gen bắp_tay nốt_ruồi mụn lúm_đồng_tiền mặt
            miệng lòng_bàn_chân ngón_trỏ ngón_út da_đầu ráy_tai gàu ruột_thừa tụy túi_mật
            tuyến_giáp tử_cung phế_quản hồng_cầu bạch_cầu hạch yết_hầu nhân_trung ria_mép
            tóc_mai vân_tay cơ_thể vết_thương vết_xước
        """),
        "clothing": words("""
            mũ giày găng khăn_quàng kính_mắt dép_lê dép_xăng_đan quần_áo áo_khoác áo_măng_tô
            áo_vest áo_sơ_mi áo_cánh áo_dài quần quần_bò quần_soóc váy váy_đầm áo_gi_lê
            áo_len áo_nỉ áo_hoodie tất đồ_lót đồ_ngủ tạp_dề cà_vạt nơ thắt_lưng bốt ủng
            đồng_phục lễ_phục com_lê áo_tứ_thân nón_lá áo_bà_ba khăn_rằn áo_tơi áo_mưa
            đồ_bơi đồ_lặn đồ_bảo_hộ áo_ấm áo_leo_núi đồ_thể_thao tay_áo cổ_áo vạt_áo lớp_lót
            vải vải_lanh lụa bông nhung dạ da_thuộc lông_thú mũ_lưỡi_trai mũ_bảo_hộ
            khăn_voan khăn_choàng bịt_tai áo_đuôi_tôm áo_lễ áo_chẽn váy_lót yếm xà_cạp guốc
            dép_xỏ_ngón áo_nịt khăn_trùm mũ_ba_góc mũ_trụ mũ_trùm viền khố áo_choàng
            quần_lửng áo áo_phông áo_ba_lỗ áo_ngực áo_gió áo_cưới chân_váy quần_tây dép
            giày_thể_thao giày_cao_gót mũ_cối kính_râm dây_giày đế_giày mũ_phớt áo_blouse
            áo_giáp áo_cà_sa áo_the khăn_xếp bikini áo_phao áo_polo quần_đùi quần_lót
            quần_tất đầm_dạ_hội giày_lười giày_búp_bê dép_quai_hậu túi_áo trang_phục
            áo_blazer áo_cardigan áo_hai_dây đồ_bộ khăn_mỏ_quạ dây_đeo_quần
        """),
        "tool": words("""
            rìu xẻng cưa thang cờ_lê kìm đục đe ống_bễ dùi ê_tô thước_thủy thước_cặp
            thước_đo_góc thước_kẻ kéo búa máy_khoan giấy_nhám bào cuốc liềm hái bừa cào
            mỏ_lết tua_vít mỏ_hàn máy_mài máy_cắt máy_hàn thước_dây dây_mực com_pa xà_beng
            đòn_bẩy nêm ròng_rọc tay_quay búa_tạ bay đá_mài giũa bàn_nạo cái_sàng mai cày
            cối_xay thoi ống_chỉ cán lưỡi_dao bộ_dụng_cụ hộp_đồ_nghề máy_bắn_đinh cưa_lọng
            cưa_vòng máy_tiện máy_chà_nhám cưa_xích mũi_vạch ke_góc bàn_thợ khoan_tay
            thước_vạch dây_dọi kìm_cắt kích máy_bấm đèn_khò khuôn_đúc khuôn_dập đá_ráp
            mũi_khoan dao_tỉa bàn_kẹp rựa cuốc_chim thuổng gầu đòn_gánh quang_gánh bàn_xoa
            bơm bút_thử_điện dao_rọc_giấy súng_bắn_keo bàn_chải_sắt chổi_sơn con_lăn
            giàn_giáo lưỡi_cưa kính_bảo_hộ dụng_cụ máy_cắt_cỏ bình_phun bình_tưới bẫy
            lưỡi_câu đinh_tán bu_lông dao_găm lục_giác tời máy_nén_khí đồng_hồ_vạn_năng
            que_hàn dao_mổ ống_nghe kim_tiêm chài vó nơm kiếm nỏ súng kéo_cắt_cành chĩa
        """),
        "drink": words("""
            cà_phê trà_xanh trà_đen nước_ép sữa nước trà_lúa_mạch trà_hoa_cúc trà_gừng
            trà_sen trà_atiso sữa_đậu_nành cà_phê_sữa cà_phê_đen bạc_xỉu nước_dừa nước_mía
            nước_chanh sinh_tố sữa_lắc nước_ngọt trà_sữa bia bia_hơi rượu_vang rượu_trắng
            rượu_nếp rượu_cần rượu_gạo rượu_thuốc rượu_mạnh sâm_banh cốc_tai nước_sâm
            nước_rau_má nước_vối nước_sấu trà_bí_đao nước_yến nước_khoáng trà_ô_long
            trà_nhài nước_cam rượu_táo rượu_mơ rượu_sim nước_ngô trà soda nước_tăng_lực
            trà_chanh trà_đào cà_phê_trứng cappuccino espresso latte cacao sữa_hạt
            nước_chanh_leo sâm_bổ_lượng sữa_chua_uống rượu sake whisky vodka rượu_ngô
            rượu_táo_mèo trà_thảo_mộc matcha đá_xay sương_sáo cà_phê_muối cà_phê_cốt_dừa
            americano mocha macchiato trà_tắc kombucha nước_sắn_dây nước_đậu_đen nước_lá_dứa
            nước_nha_đam nước_thốt_nốt trà_shan_tuyết rum gin tequila brandy cognac soju
            mojito martini sangria rượu_mùi rượu_rắn nước_điện_giải nước_mủ_trôm
        """),
        "toy": words("""
            bóng_bay diều con_quay bi xúc_xắc mảnh_ghép cờ_vua cờ_tướng đô_mi_nô đồ_chơi
            búp_bê gấu_bông xếp_hình lego rubik trò_chơi cờ_caro cờ_cá_ngựa cờ_vây bộ_bài
            quân_bài quân_cờ bàn_cờ ô_ăn_quan trốn_tìm bịt_mắt_bắt_dê rồng_rắn_lên_mây
            nhảy_lò_cò kéo_co oẳn_tù_tì chong_chóng lật_đật bong_bóng_xà_phòng súng_nước
            kiếm_gỗ ná tò_he đèn_ông_sao đèn_kéo_quân mặt_nạ đồ_hàng nhà_búp_bê bập_bênh
            cầu_trượt xích_đu đu_quay nhà_bóng hố_cát nhà_phao tàu_lượn_siêu_tốc
            xe_điện_đụng thú_nhún yoyo bi_lắc tam_cúc tổ_tôm thẻ_bài mô_hình máy_bay_giấy
            thuyền_giấy đánh_khăng đất_nặn kính_vạn_hoa con_rối cà_kheo vòng_lắc
            thả_đỉa_ba_ba ném_vòng siêu_nhân cờ_tỷ_phú bầu_cua sudoku ô_chữ đánh_đáo
            mèo_đuổi_chuột cướp_cờ trò_chơi_điện_tử cờ_gánh phỏm uno ma_sói thú_bông
            xe_điều_khiển lô_tô trống_bỏi slime ngựa_bập_bênh phao_bơi trò_ú_òa nhảy_bao_bố
            đập_niêu jenga bóng_nảy lục_lạc
        """),
        "sound": words("""
            âm_thanh tiếng_động tiếng_ồn giọng tiếng_cười tiếng_khóc tiếng_hét lời_thì_thầm
            tiếng_thở_dài tiếng_sủa tiếng_kêu tiếng_hót tiếng_gáy tiếng_gầm tiếng_rít vo_ve
            rì_rào xào_xạc róc_rách lộp_độp tí_tách ào_ào vù_vù leng_keng lách_cách cót_két
            kẽo_kẹt thình_thịch bịch bùm đùng_đoàng ầm_ầm rào_rào rỉ_rả oe_oe khúc_khích
            tiếng_ho tiếng_hắt_hơi tiếng_ngáy tiếng_nấc tiếng_gõ tiếng_chuông tiếng_còi
            tiếng_trống tiếng_sấm tiếng_súng tiếng_nổ tiếng_vỗ_tay bước_chân tiếng_rên
            tiếng_gọi tiếng_lẩm_bẩm xì_xào tiếng_reo_hò tiếng_hát gừ_gừ meo_meo gâu_gâu
            ò_ó_o chiêm_chiếp ủn_ỉn be_be ộp_ộp cạp_cạp tích_tắc âm_lượng tần_số sóng_âm
            tiếng_rè tiếng_hú tiếng_hí tiếng_rống tiếng_vang tiếng_mưa tiếng_sóng tiếng_gió
            tiếng_đàn tiếng_động_cơ tiếng_ve tiếng_dế tiếng_nói tiếng_huýt_sáo tiếng_bíp
            tiếng_vỡ sột_soạt loảng_xoảng rầm bộp tõm xoẹt vèo xình_xịch bính_boong huỵch
            vi_vu rì_rầm xèo_xèo lốp_bốp ùng_ục ríu_rít lanh_canh dư_âm tạp_âm siêu_âm
        """),
        "person": words("""
            người đàn_ông phụ_nữ con_trai con_gái trẻ_em em_bé thiếu_niên thanh_niên
            người_lớn người_già ông bà bố mẹ con_cái anh_trai chị_gái em_trai em_gái ông_nội
            bà_nội ông_ngoại bà_ngoại chú bác cô dì cậu mợ thím dượng cháu cụ chắt vợ chồng
            mẹ_chồng con_dâu con_rể anh_rể chị_dâu họ_hàng gia_đình tổ_tiên hàng_xóm bạn
            bạn_thân người_yêu người_lạ khách chủ_nhà người_qua_đường kẻ_lang_thang anh_hùng
            kẻ_thù đối_thủ đồng_nghiệp đồng_đội ông_chủ bệnh_nhân nạn_nhân nhân_chứng
            trẻ_mồ_côi góa_phụ cô_dâu chú_rể song_sinh thiên_tài kẻ_ngốc mọt_sách kẻ_mơ_mộng
            kẻ_nói_dối kẻ_phản_bội kẻ_hèn_nhát thần_đồng bợm_nhậu người_hâm_mộ người_quen
            bạn_học bạn_cùng_phòng mỹ_nhân công_tử tiểu_thư cậu_bé cô_bé chàng_trai cô_gái
            nhóc người_dân người_nước_ngoài du_khách khách_hàng con_một con_út trẻ_sơ_sinh
            bạn_trai bạn_gái cặp_đôi mẹ_kế mẹ_vợ bố_vợ bố_chồng em_họ bạn_đời tri_kỷ
            người_thân thông_gia con_nuôi kẻ_xấu quý_ông quý_bà thiếu_nữ ông_lão bà_lão
            kẻ_lừa_đảo người_ăn_xin người_vô_gia_cư tình_nguyện_viên thành_viên đồng_hương
            thí_sinh ứng_viên người_chiến_thắng người_nổi_tiếng thần_tượng đồng_minh đối_tác
            sếp cấp_trên cấp_dưới tiền_bối hậu_bối đàn_anh đàn_em ân_nhân tù_nhân nghi_phạm
            tội_phạm bà_bầu người_mới bạn_đồng_hành kẻ_bắt_nạt
        """),
        "furniture": words("""
            gối chăn rèm_cửa tủ_áo giá_sách ghế_tựa ghế_đẩu khung_giường ga_giường vỏ_gối
            thảm rèm_sáo đèn_chùm đèn_bàn bàn ghế giường tủ kệ ngăn_kéo ghế_sofa ghế_bành
            ghế_xoay ghế_dài bàn_ăn bàn_học bàn_làm_việc bàn_trang_điểm bàn_trà tủ_bếp
            tủ_giày tủ_đầu_giường kệ_tivi nôi võng đệm thảm_chùi_chân màn gối_ôm đệm_ngồi
            khăn_trải_bàn chao_đèn đèn_ngủ đèn_sàn bình_hoa khung_ảnh tranh
            đồng_hồ_treo_tường bàn_thờ tủ_kính cây_treo_đồ quầy_bar ghế_đu ghế_gấp
            giường_tầng cũi bình_phong mành sập tràng_kỷ phản tủ_chè đôn chân_nến chiếu
            tủ_hồ_sơ ghế_lười chõng giá_phơi ghế_ăn_dặm án_thư tủ_rượu tủ_âm_tường
            giường_xếp ghế_bố đèn_tường
        """),
    },
    parts=words("""
        đuôi chân cánh bóng mắt tay tiếng hơi_thở hương vảy bờm sừng mỏ vây tổ hang
        trứng hạt mảnh đàn làng xứ chuyến_đi câu_chuyện bài_hát điệu_múa ánh_sáng
        tiếng_vọng làn_gió gợn_sóng lối_mòn vương_miện áo_choàng bùa tia_lửa nụ_hoa
        vịnh_nhỏ đỉnh con_đường đèn_lồng móng nanh lông_vũ gạc quầng dấu_chân ánh_mắt
        nụ_cười giọt_nước hơi_ấm
    """),
    # Vietnamese puts the modifier after the noun (mèo xanh) and the possessed
    # thing in front of its owner (đuôi mèo), so its frames run the other way
    # round from the ones above.
    # How common each noun is, for `vocabulary` to draw by: the everyday words,
    # and the ones a specialist or a dictionary would know. Every noun in neither
    # list is common.
    levels=WordLevels(
        basic=words("""
            mèo chó hổ sư_tử cáo sói gấu gấu_trúc thỏ sóc voi hươu nai ngựa lừa bò trâu dê
            cừu lợn khỉ cá_sấu rắn thằn_lằn rùa ếch cóc chim én sẻ quạ đại_bàng công vẹt cú
            bồ_câu thiên_nga vịt ngỗng gà cá cá_voi cá_heo cá_mập mực bạch_tuộc tôm cua sò
            ốc bướm ong kiến nhện chuồn_chuồn ve muỗi ruồi giun sâu dơi lạc_đà hà_mã tê_giác
            hươu_cao_cổ chuột cá_chép lươn chuột_túi cò châu_chấu dế đom_đóm chai bút tẩy ô
            đèn gương chìa_khóa ổ_khóa túi cúc kim chỉ giấy vở thư bản_đồ máy_ảnh phim
            bóng_bay diều thẻ đèn_pin diêm nến chậu ấm chén thìa đĩa nồi gối chăn giỏ chổi
            dây xô quạt lưới lọ lược bình rổ khay hộp thùng móc_khóa đinh khóa_kéo vòng_tay
            nhẫn cặp_sách ba_lô bát kẹp biển sông hồ thác thung_lũng núi đồi rừng hang
            sa_mạc cát đá sỏi núi_lửa động_đất san_hô suối vịnh đỉnh_núi đảo cao_nguyên
            bãi_cát bóng hương lửa bờ_biển đồng_bằng bãi_biển kênh sóng bọt đèo cây lá hoa
            rễ hạt quả tre thông anh_đào hoa_hồng hoa_sen hoa_cúc hoa_mai hoa_lan
            bồ_công_anh hướng_dương cỏ cành mầm chồi nụ cánh_hoa rong_biển bó_hoa cỏ_dại
            xương_rồng húng_quế bạc_hà rau_mùi hẹ me ổi thân_cây vỏ_cây gai cây_táo vàng bạc
            đồng sắt thép thủy_tinh pha_lê ngọc_trai ngọc đá_vôi đá_quý kim_cương nhôm chì
            đá_cuội than_đá đá_tảng tự_do hòa_bình trí_tuệ ký_ức tưởng_tượng câu_chuyện thơ
            ngữ_pháp vật_lý hóa_học sinh_học toán_học lịch_sử thần_thoại câu_đố bí_mật
            lời_hứa chuyến_đi phiêu_lưu khám_phá thí_nghiệm câu_hỏi câu_trả_lời lễ_hội
            văn_hóa ngôn_ngữ chữ_cái mật_mã lịch chân_trời chủ_đề truyền_thống kỹ_thuật
            nghệ_thuật khoa_học chính_tả vận_may nguyên_nhân kết_quả rồng phượng_hoàng
            kỳ_lân tiên yêu_tinh ma thần thiên_thần ác_quỷ người_cá quái_vật phép_thuật
            thần_chú lời_nguyền người_sói ma_cà_rồng linh_hồn pháp_sư thầy_bói khổng_lồ
            thổ_địa thợ_săn kẻ_trộm thủy_thủ đầu_bếp thám_tử nhà_thơ họa_sĩ chú_hề võ_sĩ vua
            nữ_hoàng hoàng_tử công_chúa hoàng_đế nông_dân phi_công kỹ_sư lính_cứu_hỏa
            cảnh_sát bác_sĩ y_tá thú_y giáo_viên học_sinh nhà_báo nhà_văn ca_sĩ diễn_viên
            đạo_diễn thợ_mộc thợ_may trọng_tài luật_sư kế_toán người_bán bồi_bàn tài_xế
            thợ_cắt_tóc đàn_piano ghi_ta trống chuông đàn_tranh bài_hát điệu_múa nhịp_điệu
            giai_điệu sáo kèn đàn_bầu bản_nhạc nốt_nhạc buổi_diễn sân_khấu dân_ca dàn_nhạc
            song_ca chiêng điệp_khúc ca_khúc chợ thành_phố làng ngõ cầu vườn thư_viện
            bảo_tàng nhà_hát trường_học công_viên cảng nhà_ga sân_bay lâu_đài chùa đền
            tầng_hầm mái_nhà sân_vận_động bể_bơi vườn_thú bưu_điện ngân_hàng bệnh_viện
            hiệu_thuốc quán_cà_phê nhà_hàng bếp phòng_ngủ phòng_khách hành_lang cầu_thang
            ngã_tư nhà_thờ biệt_thự xóm nghĩa_trang quán_ăn khu_phố cơm mì phở bún bánh_mì
            bánh_bao bánh_chưng nem chả giò_lụa muối đường tiêu tỏi hành khoai cà_rốt
            dưa_chuột bí_đỏ rau_xà_lách nấm đậu_phụ trứng phô_mai bơ sữa_chua táo dâu nho
            dưa_hấu quýt chanh chuối xoài sô_cô_la kẹo bánh_quy bánh_ngọt bánh_kem mứt
            tương_ớt nước_mắm cháo xôi chè canh súp lẩu ngô cà_chua lê bưởi đậu_phộng
            bóng_đá bóng_rổ bóng_chuyền bóng_bàn quần_vợt cầu_lông bi_a bơi_lội thể_dục
            karate judo đấu_vật leo_núi nhảy_dây vợt khung_thành huy_chương cúp vô_địch
            chung_kết cổ_vũ luyện_tập chạy_bộ mũ_bảo_hiểm khởi_động cờ_vua cờ_tướng sân_bóng
            phạt_đền thẻ_vàng tỷ_số hòa chiến_thắng thất_bại kỷ_lục xe_đạp tàu_hỏa thuyền
            ô_tô xe_buýt taxi xe_tải xe_máy xe_ga máy_bay trực_thăng tên_lửa tàu_ngầm bè
            xe_tăng xe_ngựa xe_đẩy xe_cứu_hỏa xe_cảnh_sát cáp_treo tàu_điện dù cần_cẩu
            xe_đạp_điện ghe xe_rác xe_khách xe_ôm máy_tính bàn_phím màn_hình máy_in loa
            tai_nghe điện_thoại sạc pin điều_khiển tủ_lạnh máy_giặt máy_hút_bụi quạt_máy
            điều_hòa nồi_cơm_điện lò_vi_sóng lò_nướng máy_xay bàn_chải xà_phòng dầu_gội
            nước_hoa máy_sấy_tóc bóng_đèn ổ_cắm móc_áo tủ_áo giá_sách khăn_tắm vòi_nước
            ti_vi cân bàn_là thảm đèn_bàn bồn_tắm hồng_đào vàng_chanh xanh_lá xanh_rêu
            xanh_ngọc xanh_lam xanh_biển xanh_da_trời chàm tím_than nâu_đất be xám_tro
            trắng_ngà đen_tuyền đỏ_gạch hồng_phấn đỏ_cam hóa_đơn lãi_suất khoản_vay
            tiết_kiệm tài_khoản lương_hưu tiền_lương tiền_thưởng két_sắt chuyển_tiền
            sổ_tiết_kiệm trả_góp hợp_đồng thuế tiền_phạt tiền_cọc tiền_thuê kho_báu giàu_có
            nghèo_khó lỗ vốn tiền_lãi tiền_mặt bản_sao ảnh_chụp lệnh thư_mục khôi_phục bảng
            cột hàng nút đồ_thị danh_sách tập_hợp tiện_ích phiên_bản hồ_sơ sự_kiện tín_hiệu
            bộ_lọc nhãn_dán mây gió mưa tuyết sương_mù sương cầu_vồng hoàng_hôn sét sấm
            mưa_rào gió_mùa bão mưa_phùn mưa_đá tia_nắng giọt_mưa nắng_nóng thời_tiết
            khí_hậu nhiệt_độ độ_ẩm bóng_râm chớp hạn_hán lũ_lụt sao mặt_trăng mặt_trời
            thiên_hà sao_chổi sao_băng dải_ngân_hà nhật_thực nguyệt_thực vũ_trụ hành_tinh
            vệ_tinh chòm_sao trọng_lực hố_đen hệ_mặt_trời trăng_khuyết trăng_tròn tàu_vũ_trụ
            bình_minh mùa tương_lai ngày_lễ buổi_sáng buổi_trưa buổi_chiều buổi_tối nửa_đêm
            sáng_sớm hôm_qua hôm_nay ngày_mai ngày_kia hôm_kia quá_khứ hiện_tại thế_kỷ
            cuối_tuần năm_nay năm_ngoái năm_sau mùa_xuân mùa_hè mùa_thu mùa_đông giao_thừa
            rằm sinh_nhật ngày_xưa thời_gian tuổi_trẻ bây_giờ sau_này phút giây giờ
            ngày_thường ngày_nghỉ can_đảm tò_mò lòng_biết_ơn kiên_nhẫn tình_bạn niềm_vui
            nỗi_buồn cơn_giận nỗi_sợ ngạc_nhiên hạnh_phúc sung_sướng an_ủi hy_vọng
            tuyệt_vọng tội_lỗi xấu_hổ tự_hào ghen_tuông tham_lam tình_cảm dịu_dàng ấm_áp
            tử_tế tin_tưởng nghi_ngờ lo_lắng bực_bội khó_chịu chán_nản háo_hức tự_tin
            khiêm_tốn bình_tĩnh tâm_trạng hối_hận đầu trán lông_mày lông_mi mũi má cằm hàm
            môi lưỡi răng lợi tai cổ gáy vai khuỷu_tay cổ_tay ngón_tay ngón_cái móng_tay
            ngực bụng rốn eo đùi đầu_gối gót ngón_chân móng_chân xương tim phổi gan dạ_dày
            thận ruột não máu thịt da tóc râu nước_mắt mồ_hôi nước_bọt hơi_thở sẹo cánh_tay
            nách mũ giày găng khăn_quàng kính_mắt dép_lê quần_áo áo_khoác áo_vest áo_sơ_mi
            áo_dài quần quần_bò quần_soóc váy váy_đầm áo_len tất đồ_lót đồ_ngủ cà_vạt
            thắt_lưng ủng đồng_phục nón_lá áo_mưa đồ_bơi áo_ấm tay_áo cổ_áo vải rìu xẻng cưa
            thang cờ_lê kìm thước_kẻ kéo búa máy_khoan cuốc liềm cào mỏ_lết tua_vít
            thước_dây com_pa xà_beng đòn_bẩy ròng_rọc cày lưỡi_dao bộ_dụng_cụ cà_phê
            trà_xanh nước_ép sữa nước sữa_đậu_nành cà_phê_sữa cà_phê_đen nước_dừa nước_mía
            nước_chanh sinh_tố nước_ngọt trà_sữa bia bia_hơi rượu_vang nước_khoáng sữa_đặc
            nước_cam đồ_chơi búp_bê gấu_bông xếp_hình lego rubik trò_chơi bộ_bài trốn_tìm
            kéo_co chong_chóng bong_bóng_xà_phòng súng_nước cầu_trượt xích_đu đu_quay
            bập_bênh đất_nặn mặt_nạ âm_thanh tiếng_động tiếng_ồn giọng tiếng_cười tiếng_khóc
            tiếng_hét lời_thì_thầm tiếng_sủa tiếng_kêu tiếng_hót tiếng_gõ tiếng_chuông
            tiếng_còi tiếng_nổ tiếng_vỗ_tay bước_chân meo_meo gâu_gâu tích_tắc tiếng_hát
            người đàn_ông phụ_nữ con_trai con_gái trẻ_em em_bé người_lớn người_già ông bà bố
            mẹ anh_trai chị_gái em_trai em_gái ông_nội bà_nội ông_ngoại bà_ngoại chú bác cô
            dì cậu cháu vợ chồng gia_đình hàng_xóm bạn bạn_thân người_yêu khách anh_hùng
            kẻ_thù đồng_nghiệp bệnh_nhân cô_dâu chú_rể cậu_bé cô_bé chàng_trai cô_gái nhóc
            du_khách khách_hàng bàn ghế giường tủ kệ ngăn_kéo ghế_sofa bàn_ăn bàn_học nôi
            võng đệm màn khung_ảnh tranh bàn_thờ đèn_ngủ ngựa_vằn chim_cánh_cụt khỉ_đột
            cá_vàng ốc_sên gián gà_tây sổ_tay bút_chì bút_bi ví ống_hút cốc đũa dao thớt nắp
            bình_nước tăm bật_lửa sách tờ_báo từ_điển nhật_ký dây_chuyền hoa_tai kẹp_tóc
            băng_dính keo_dán phấn thùng_rác bầu_trời mặt_đất đại_dương ao ruộng cánh_đồng
            bùn băng bụi tro khói bóng_tối ánh_sáng thiên_nhiên phượng hoa_đào dừa cau mía
            lúa sắn rau_má tía_tô sả gừng nghệ hoa_nhài gỗ gang inox kim_loại đá_xanh
            kiến_thức ý_tưởng ý_nghĩa niềm_tin giáo_dục pháp_luật cổ_tích giấc_mơ thói_quen
            bài_học kinh_nghiệm địa_lý văn_học phù_thủy bụt thần_tài tử_thần yêu_quái
            nữ_thần xác_ướp đũa_thần thảm_bay đèn_thần phép_lạ thiên_đường địa_ngục giáo_sư
            nha_sĩ kiến_trúc_sư nhà_khoa_học người_mẫu lập_trình_viên thợ_điện bảo_vệ
            nhân_viên giám_đốc thư_ký nhà_sư linh_mục hiệu_trưởng thuyền_trưởng công_nhân
            nghệ_sĩ nhạc_sĩ nhạc_cụ nhạc_rock nhạc_trẻ karaoke ban_nhạc album ca_dao
            nhạc_phim cải_lương chèo hò nhà phòng lớp_học văn_phòng cửa_hàng siêu_thị
            rạp_phim khách_sạn bến_xe trạm_xăng cổng hàng_rào ban_công sân giếng nhà_máy phố
            vỉa_hè nhà_vệ_sinh thị_trấn thủ_đô quê nông_thôn thịt_bò thịt_gà thịt_lợn rau
            rau_muống bắp_cải đậu gạo bột xúc_xích bún_chả cơm_tấm pizza mì_tôm kem mật_ong
            dầu_ăn ớt khoai_tây khoai_lang đu_đủ dứa mít sầu_riêng nhãn cam chảo đá_cầu
            võ_thuật taekwondo yoga marathon đua_xe thể_thao trận_đấu đội cầu_thủ thủ_môn
            quả_bóng tạ bàn_thắng thẻ_đỏ thể_hình xe_điện xe_lăn xe_cứu_thương xích_lô mô_tô
            xe_đua tàu_điện_ngầm tàu_thủy ca_nô phà drone máy_tính_bảng laptop ổ_cứng
            đồng_hồ camera bếp_ga bình_giữ_nhiệt quạt_trần kem_đánh_răng sữa_tắm son thuốc
            khẩu_trang giấy_vệ_sinh khăn_giấy tã bột_giặt sơn vé thẻ_sim radio lốp màu_đỏ
            màu_xanh màu_vàng màu_trắng màu_đen màu_tím màu_nâu màu_hồng màu_xám màu_cam
            màu_sắc màu_kem đỏ_đô tiền tiền_xu tiền_giấy đô_la thẻ_tín_dụng chuyển_khoản
            đầu_tư giá_cả giảm_giá khuyến_mãi thanh_toán bảo_hiểm thu_nhập heo_đất lì_xì
            tiền_lẻ học_phí tiền_điện kinh_tế mạng internet wifi phần_mềm ứng_dụng trang_web
            mật_khẩu email tin_nhắn dữ_liệu virus robot cập_nhật đăng_nhập mạng_xã_hội
            túi_xách nắng trời_lạnh không_khí dự_báo mùa_mưa mùa_khô bông_tuyết
            tiểu_hành_tinh trạm_vũ_trụ không_gian người_ngoài_hành_tinh đĩa_bay
            kính_thiên_văn ngày đêm tuần tháng năm tết trung_thu giáng_sinh năm_mới kỳ_nghỉ
            nghỉ_hè học_kỳ tuổi tuần_trước tuần_sau tình_yêu nỗi_nhớ hồi_hộp hài_lòng
            thất_vọng bối_rối cảm_xúc nỗi_đau mắt tay chân bàn_tay bàn_chân lưng mông lông
            cổ_họng mụn áo áo_phông áo_ngực áo_gió dép giày_thể_thao giày_cao_gót kính_râm
            dây_giày bikini rựa bơm dụng_cụ bình_tưới bẫy chổi_sơn dao_rọc_giấy đòn_gánh
            bu_lông trà soda trà_chanh trà_đào cappuccino latte cacao sữa_chua_uống rượu
            whisky sao_Thủy sao_Kim Trái_Đất sao_Hỏa sao_Mộc sao_Thổ sao_Thiên_Vương
            sao_Hải_Vương sao_Diêm_Vương bê nghé ngan nòng_nọc cào_cào khủng_long ghẹ hến
            nghêu đỉa chấy sâu_bướm cá_rô_phi cá_cơm quà thiệp ảnh nĩa mâm hũ bút_máy
            bút_màu gậy cờ nhang biển_báo đất hố bắc_cực nam_cực lục_địa đất_liền
            hoa_đồng_tiền hoa_sứ trúc gốc ngọn rơm cây_cảnh hoa_huệ oải_hương sứ gốm vôi
            sự_thật công_bằng xã_hội tôn_giáo kế_hoạch mục_tiêu vấn_đề lý_do thành_công
            ước_mơ sức_khỏe thế_giới ý_kiến thông_tin tin_tức trí_nhớ tài_năng kỹ_năng
            chiến_tranh du_lịch điện_ảnh thời_trang ẩm_thực truyện_tranh phép_màu bùa_chú
            bói_toán tàng_hình nước_thánh bảo_vật thiên_đình chổi_bay tử_vi phong_thủy quỷ
            thần_đèn người_tuyết cô_hồn xác_sống công_an bộ_đội sinh_viên phóng_viên shipper
            doanh_nhân quản_lý thu_ngân bưu_tá phi_hành_gia giảng_viên âm_nhạc đĩa_nhạc
            giọng_hát tràng_pháo_tay liveshow nhạc_nền nhạc_chuông bản_hit nhạc_pop
            nhạc_jazz nhạc_rap nhạc_cổ_điển bolero ballad nhạc_vàng hip_hop nhạc_dance
            nhạc_thiếu_nhi tình_khúc Kpop quốc_ca nhạc_kịch đồng_dao quan_họ nhạc_đỏ
            nhạc_điện_tử EDM opera con_đường hẻm thôn xã huyện tỉnh quận phường đô_thị
            quốc_gia vùng mộ di_tích địa_điểm trạm_xe_buýt khu_vui_chơi căn_hộ phòng_trọ
            nhà_nghỉ tường cửa_sổ cửa sàn_nhà trần_nhà tầng thang_máy mẫu_giáo nhà_trẻ
            trường_đại_học quán_bar tiệm_tạp_hóa phòng_tập ga_ra nhà_phố bánh_trung_thu
            bánh_flan bim_bim bỏng_ngô kẹo_mút kẹo_cao_su cơm_rang mì_xào gà_rán bít_tết
            hamburger sushi cà_ri gỏi trứng_ốp_la bò_kho cá_kho thịt_kho bánh_canh sườn
            cánh_gà đùi_gà mỡ hải_sản giấm quế tương_cà nếp bột_ngọt hạt_nêm nước_dùng
            rau_ngót mồng_tơi rau_dền bí_đao mướp su_hào su_su hành_tây đậu_bắp khoai_môn
            rau_thơm cải_xanh vải_thiều khế na thanh_long mỹ_phẩm trang_điểm phấn_phủ
            mascara kem_nền cắt_tóc dao_cạo sữa_rửa_mặt kem_dưỡng dầu_xả gội_đầu tóc_giả
            sơn_móng_tay khăn_mặt khăn_ướt phích_cắm pin_dự_phòng đạp_xe câu_cá bán_kết
            cú_đấm đò xanh_dương màu_da công_ty doanh_nghiệp thương_hiệu giao_dịch đơn_hàng
            video livestream bình_luận bài_đăng mã_độc ảnh_đại_diện bluetooth thứ_hai thứ_ba
            thứ_tư thứ_năm thứ_sáu thứ_bảy chủ_nhật âm_lịch căng_thẳng áp_lực cảm_động
            tủi_thân bình_yên mặt miệng gàu ráy_tai vết_thương cơ_thể quần_lót quần_đùi
            trang_phục đồ_bộ túi_áo súng kiếm kim_tiêm thú_bông trò_chơi_điện_tử phao_bơi
            slime bạn_trai bạn_gái trẻ_sơ_sinh người_thân sếp tội_phạm thành_viên
            người_nổi_tiếng thần_tượng bố_vợ mẹ_vợ bố_chồng chiếu giường_xếp mùa_bão
            hồng_ruốc
        """),
        rare=words("""
            hải_ly thú_mỏ_vịt vượn_cáo khỉ_đầu_chó heo_vòi sóc_bay lửng gà_lôi đa_đa
            chim_cắt cá_tuyết ong_nghệ kỳ_giông mẹt nia đai_ốc vòng_đệm then_cài trâm_cài
            bấc khuy_bấm eo_đất hố_sụt măng_đá gờ_đá bãi_bồi lãnh_nguyên đầm_phá bãi_lầy
            gành_đá vòng_gỗ nghệ_tây tần_bì du đoạn phong_lữ dạ_lan_hương tầm_ma kế linh_lan
            tử_đằng mã_não vân_mẫu huỳnh_thạch sa_khoáng đá_phiến đá_mắt_mèo đá_mặt_trăng
            ngọc_lam san_hô_đỏ vonfram coban mangan liti đá_sa_thạch đá_phiến_sét đá_bọt
            muối_mỏ đá_bùn hải_trình chiều_kích học_thuyết tiên_đề tiền_đề diễn_dịch quy_nạp
            loại_suy tự_sự biên_niên chứng_ngôn giao_ước luận_đề mỹ_học ngữ_nghĩa xác_tín
            bản_thể thần_thú sấm_truyền kết_giới phong_ấn hắc_long bạch_long chu_tước
            huyền_vũ cửu_vĩ_hồ hình_nhân quỷ_lùn tinh_linh hải_thần lôi_thần phong_thần
            thiên_mã hải_quái thần_điểu hiền_giả yêu_nữ sách_phép chén_thánh trượng
            vương_trượng linh_thú nhà_giả_kim mục_đồng phu_xe hoa_tiêu thầy_tế thị_nữ
            thợ_kính nhà_thực_vật văn_thư thợ_xay thợ_thùng đàn_viola chũm_chọe trống_lắc
            mộc_cầm phong_cầm khẩu_cầm âm_giai khúc_kết âm_sắc nhịp_phách chương_nhạc
            khúc_mở_màn dạ_khúc tụng_ca cầu_hồn_khúc tứ_tấu ngũ_tấu quãng_tám bán_âm
            tổng_phổ máy_nhịp đại_hồ_cầm kèn_trombone kèn_tuba kèn_túi đàn_cầm sáo_mèo
            đàn_tỳ_bà đàn_tam đối_âm luyến_âm thánh_thi trường_độ đàn_sến kèn_lá thành_lũy
            hào nhà_nguyện am cầu_dẫn lúa_mạch_đen đậu_lăng đậu_gà mộc_qua kiếm_đạo xà_kép
            cú_móc ván_nhún ngựa_gỗ xe_ủi_tuyết tàu_một_ray tàu_hai_thân tàu_phá_băng
            tàu_thăm_dò tàu_đổ_bộ xe_một_bánh xe_tưới_nước tàu_lặn toa_giường xe_thổ_mộ
            xe_trộn tàu_hộ_tống tàu_khu_trục áo_tắm_dài bạc_kim đỏ_ruby màu_lục_bảo
            màu_ngọc_lam màu_hổ_phách lam_biếc tím_biếc huyết_dụ sổ_cái nợ_phải_trả thặng_dư
            lợi_suất thấu_chi thanh_khoản vòng_quay sổ_quỹ văn_tự hối_phiếu hạn_ngạch bộ_đệm
            gói_tin hàng_đợi ngăn_xếp phần_sụn sổ_đăng_ký mạng_con tên_máy mã_kiểm_tra
            lược_đồ cụm_máy phân_mảnh vùng_chứa hộp_cát kho_mã trình_gỡ_lỗi mã_máy ngắt
            thanh_ghi tốc_độ_bit thông_lượng điểm_cuối băm kết_xuất bộ_tô_bóng khung_dây
            khung_nhìn bộ_đệm_khung tám_bit đường_lên đường_xuống định_tuyến chuyển_mạch
            hệ_thống_tệp liên_kết_mềm di_trú bản_dựng gói_cài kho_lệnh khí_áp quầng_trăng
            ráng_chiều gió_chướng thiên_đỉnh nhật_hoa gió_mặt_trời liên_sao định_tinh
            thiên_cầu thị_sai parsec thiên_để phương_vị cận_nhật viễn_nhật quang_cầu sắc_cầu
            tầng_điện_ly vành_đai_sao đĩa_sao lỗ_sâu sao_siêu_mới sát_na chính_ngọ tiết_khí
            lập_hạ lập_thu lập_đông thiên_thu niên_đại tuần_trăng trắc_ẩn kính_sợ can_trường
            sầu_muộn tủi_hờn sùng_kính độ_lượng hoan_hỉ mao_mạch hầu cơ_hoành xương_ức
            xương_bả khung_chậu xương_chày xương_mác khoeo mống_mắt lưỡi_gà áo_tơi
            áo_leo_núi áo_đuôi_tôm áo_lễ áo_chẽn xà_cạp áo_nịt mũ_ba_góc mũ_trụ ống_bễ ê_tô
            thước_cặp dây_mực mai thoi cưa_lọng cưa_vòng máy_chà_nhám mũi_vạch ke_góc
            bàn_thợ thước_vạch dây_dọi khuôn_dập đá_ráp bàn_kẹp trà_lúa_mạch rượu_táo
            rượu_sim tam_cúc tổ_tôm đánh_khăng thả_đỉa_ba_ba đèn_kéo_quân rỉ_rả tần_số
            sóng_âm sập tràng_kỷ tủ_chè đôn hải_mã đười_ươi ống_nhổ phù_sa hóa_thạch
            dung_nham rừng_ngập_mặn đồng_hoang lục_bình bồ_kết tràm đước xoan phỉ_thúy
            ngọc_hồng_lựu đá_vỏ_chai zircon đá_trầm_tích cao_lanh mica thạch_tín natri kali
            magiê đá_hộc lưu_ly xà_cừ luân_hồi thuồng_luồng cương_thi ma_da ma_xó dạ_xoa
            la_sát long_cung thợ_nhuộm cai_ngục đao_phủ cận_vệ sứ_giả bà_đỡ ca_trù xẩm
            tắc_ráng vỏ_lãi xe_lôi thuyền_độc_mộc đen_huyền bóng_bán_dẫn bộ_định_tuyến
            mưa_axit mây_tích điểm_sương gió_tín_phong tầng_ozon sao_neutron vật_chất_tối
            sao_thiên_lang sao_xung chuẩn_tinh hành_tinh_lùn tia_vũ_trụ sao_thần_nông áo_the
            khăn_xếp đinh_tán bàn_xoa thuổng quang_gánh sâm_bổ_lượng rượu_táo_mèo Quaoar
            Orcus Gonggong Salacia Varuna Ixion Hygiea Psyche Bennu Ryugu Itokawa Apophis
            Arrokoth Theia Vulcan Phaeton Dimidium Spe Orbitar Fortitudo Ægir Amateru Dagon
            Meztli Smertrios Phobetor Tassili Madriu Yanyan Tondra Eburonia Yvaga Mastika
            Bendida Nakanbé Awasis Wangshu Pipitea Asye Veles Boinayel Eyeke Cayahuanca
            Hämarik Abol Bélisama Mintome Toge Santamasa Noifasui Chura Buru Staburags
            Baiduri Cuptor Xólotl Hairu Laligurans Kererū Albmi Perwana Pollera Viculus
            Samagiya Ramajay Khomsa Barajeel Cruinlagh Ibirapitá Madalitso Bambaruush Tahay
            Awohali Enaiposha Phailinsiam Levantes Najsakopajk Qingluan Cuancoá Astrolábos
            Ahra Aumatex Ixbalanqué Surt Haik Mulchatna Makombé Zembretta Bocaprins Agouto
            cu_li voọc bọ_que cà_cuống diệc vạc chim_khướu linh_miêu nai_sừng_tấm sơn_dương
            tẩu chặn_giấy phụ_lưu mũi_đất thạch_thảo tử_đinh_hương lim bìm_bìm hoàng_lan
            bào_tử địa_y mắt_hổ diêm_tiêu đá_phấn sử_thi yêu_thuật luyện_đan tiên_đan
            bàn_đào thần_thông phân_thân trận_pháp thánh_tích thần_khí bồng_lai suối_vàng
            ma_giới luyện_ngục cầu_ô_thước cầu_nại_hà sổ_sinh_tử bát_quái cấm_thuật
            huyễn_thuật chú_ngữ nỏ_thần long_châu thuật_chiêu_hồn bùa_ngải ma_trành ma_gà
            long_mã ngư_tinh mộc_tinh thiên_cẩu quái_điểu basilisk chimera gargoyle
            tổng_lãnh_thiên_thần thầy_mo nhà_chiêm_tinh đàn_mandolin đàn_đáy đàn_môi khèn
            kèn_bầu song_loan miếng_gảy giá_nhạc ngân_rung dấu_thăng dấu_giáng giọng_nam_cao
            giọng_nữ_cao operetta oratorio cantata luyện_khúc fugue toccata minuet mazurka
            polonaise cuồng_tưởng_khúc tổ_khúc scherzo rondo madrigal motet bình_ca shoegaze
            post_rock surf_rock garage_rock psychedelic_rock doom_metal thrash_metal
            black_metal death_metal power_metal metalcore nu_metal art_pop power_pop
            bubblegum_pop teen_pop dream_pop tech_house acid_house future_house
            tropical_house electro_house progressive_house minimal_techno psytrance
            breakbeat hardstyle hardcore electro downtempo trip_hop synthwave vaporwave
            eurodance eurobeat nu_disco big_room moombahton bebop bluegrass ska dancehall
            cumbia bachata fado mambo polka ví_giặm bài_chòi hát_then hát_xoan chầu_văn
            nhã_nhạc đê_chắn_sóng đồng_muối thổ_cư nhà_dài thủy_đình cung_thiên_văn
            cối_xay_nước lãnh_sự_quán mẻ cao_lương mạch_nha thảo_quả kê rau_rút củ_kiệu trám
            nhót dâu_da bòn_bon tạo_khối phấn_bắt_sáng nối_mi phun_xăm lô_cuốn_tóc botox
            ba_môn_phối_hợp sumo aikido wushu tàu_đệm_khí cáng xanh_coban vàng_mù_tạt
            đơn_sắc tín_chấp lãi_kép nợ_công tiền_chuộc trình_biên_dịch máy_ảo mây_tầng
            mây_ti mây_vũ_tích mây_ngũ_sắc xoáy_thuận nước_dâng chân_trời_sự_kiện điểm_kỳ_dị
            từ_quyển nhật_quyển sao_biến_quang xích_vĩ xích_kinh cụm_thiên_hà phản_vật_chất
            tụy phế_quản nhân_trung yết_hầu hạch khăn_mỏ_quạ dây_đeo_quần vó nơm chĩa
            cờ_gánh phỏm trống_bỏi tạp_âm siêu_âm huỵch chõng án_thư ráng_mỡ_gà rãnh_áp_thấp
            nước_mủ_trôm đỏ_gụ silic paladi đất_hiếm
        """),
    ),
    frames=(
        WordFrame(("noun",), 10),
        WordFrame(("noun", "adjective"), 34),
        WordFrame(("noun", "action"), 22),
        WordFrame(("part", "noun"), 14),
        WordFrame(("part", "noun", "adjective"), 14),
        WordFrame(("noun", "adjective", "action"), 6),
    ),
    syn=SyllableSynthesis(
        onset=words("b c ch d đ g gh h k kh l m n ng nh ph qu r s t th tr v x"),
        vowel=words("a à á ả ã ạ e ê i o ô ơ u ư ai ao au ay êu ia iê oa oi ôi ơi ua uô ưa ươ ui"),
        coda=("", "", *words("n m ng nh t c ch p")),
        min_syllables=1,
        max_syllables=1,
    ),
)
