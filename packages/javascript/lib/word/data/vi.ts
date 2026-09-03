import { words } from '../../_internal/parse.js';
import type { WordLanguageData } from './types.js';

export const VI: WordLanguageData = {
	joiner: ' ',
	capitalize: false,
	adjectives: words(`
		xanh đỏ vàng trắng đen tím nâu hồng xám lớn nhỏ cao thấp dài ngắn rộng hẹp dày mỏng nặng
		nhẹ nhanh chậm mạnh yếu cứng mềm nóng lạnh ấm mát khô ướt sạch mới cũ trẻ già đẹp hiền dữ
		vui buồn hiếm quý sáng tối ngọt đắng cay mặn chua thơm êm sắc tròn vuông xa gần sâu nông
		giàu nghèo lạ quen tươi im_lặng ồn_ào dịu_dàng can_đảm thông_minh tự_do vĩnh_cửu
		trong_suốt kỳ_lạ huyền_bí cô_đơn rực_rỡ lấp_lánh mờ_ảo dữ_dội nhẹ_nhàng vững_chãi
		tinh_khôi hoang_dã bình_yên lặng_lẽ rộn_ràng nhanh_nhẹn chậm_rãi mạnh_mẽ yếu_ớt xinh_xắn
		duyên_dáng thanh_tao cổ_kính hiện_đại bất_tận rỗng_không gồ_ghề mượt_mà óng_ánh trầm_mặc
		thảnh_thơi tinh_nghịch nghiêm_trang ung_dung hồn_nhiên táo_bạo thận_trọng khôn_ngoan
		lanh_lợi cần_mẫn lười_biếng nhút_nhát vô_tư thẳng_thắn kín_đáo lộng_lẫy giản_dị
	`),
	actions: words(`
		ngủ chạy bay bơi hát nhảy cười khóc đi đứng ngồi nằm ăn uống đọc viết vẽ học làm nghỉ chờ
		tìm gọi nghe nhìn nhớ quên mơ thức trốn đuổi bắt ném kéo đẩy mở đóng xây sửa trồng hái nấu
		nướng dệt may đan chèo lái leo lăn trôi chảy cháy tan nở tàn rơi đợi dạo lượn săn gieo gặt
		gánh vác đội cõng bồng ôm vuốt xoa gõ đập chặt cắt khâu thêu nhuộm phơi giặt quét lau rửa
		xay giã sàng lọc đo đếm ghi kể ngâm ngân gảy thổi đánh vỗ reo hò thầm_thì lang_thang
		bay_lượn tỏa_sáng nhấp_nháy đung_đưa dập_dờn rung_rinh thấp_thoáng vụt_qua ngẩng_lên
		cúi_xuống quay_lại bước_tới dừng_lại
	`),
	nouns: {
		animal: words(`
			mèo chó hổ sư_tử báo cáo sói gấu gấu_trúc rái_cá thỏ sóc voi hươu nai ngựa lừa bò trâu dê
			cừu lợn khỉ vượn cá_sấu rắn thằn_lằn rùa ếch cóc chim én sẻ quạ chim_ưng đại_bàng công
			vẹt cú bồ_câu hạc thiên_nga vịt ngỗng gà cá cá_voi cá_heo cá_mập mực bạch_tuộc tôm cua sò
			ốc bướm ong kiến nhện chuồn_chuồn ve muỗi ruồi giun sâu tằm dơi chồn nhím lạc_đà hà_mã
			tê_giác hươu_cao_cổ chuột sứa hải_cẩu đà_điểu chim_sẻ cá_chép lươn
		`),
		object: words(`
			chai bút tẩy ô đèn gương chìa_khóa ổ_khóa túi cúc kim chỉ cọ giấy vở thư tem con_dấu
			bản_đồ ống_nhòm kính_hiển_vi máy_ảnh phim bóng_bay diều con_quay bi xúc_xắc thẻ mảnh_ghép
			buồm neo lều đèn_pin diêm nến chậu ấm chén thìa đĩa nồi bánh_răng dây_cót ruy_băng gối
			chăn giỏ chổi còi dây xô quạt khiên lưới cần_câu lọ lược chuông_gió hạc_giấy đồng_hồ_cát
			ống_khói phễu bình gáo mẹt nia rổ khay hộp thùng vại chum
		`),
		nature: words(`
			biển sông hồ thác thung_lũng núi đồi đồng_cỏ rừng hang sa_mạc cát đá sỏi núi_lửa động_đất
			sông_băng san_hô đầm_lầy suối vịnh cồn_cát đỉnh_núi hoang_mạc rừng_thưa thảo_nguyên đầm
			cửa_sông châu_thổ phá đảo bán_đảo eo_đất quần_đảo cao_nguyên vách_đá khe_núi bãi_cát
			bãi_đá rạn_san_hô đáy_biển vực_sâu mạch_nước hố_sụt măng_đá nhũ_đá hang_động gờ_đá bóng
			vọng hương lửa than_hồng dòng_chảy bờ_biển bãi_bồi
		`),
		plant: words(`
			cây lá hoa rễ hạt quả rêu dương_xỉ tre thông phong anh_đào hoa_hồng hoa_sen hoa_cúc
			hoa_mai hoa_lan bồ_công_anh hướng_dương hoa_súng cỏ cành mầm chồi nụ cánh_hoa phấn_hoa
			vòng_gỗ quả_thông quả_sồi bạch_quả liễu bạch_dương tùng bách sồi dẻ óc_chó thảm_cỏ rong
			tảo rong_biển bồn_cây hàng_rào_cây lá_non lá_rụng lá_khô bó_hoa cỏ_dại xương_rồng lô_hội
			húng_quế hương_thảo bạc_hà thì_là mùi_tây nghệ_tây rau_mùi hẹ me sim ổi
		`),
		gem: words(`
			vàng bạc đồng sắt thép đồng_thau thiếc kẽm bạch_kim thủy_tinh pha_lê thạch_anh mã_não
			hổ_phách ngọc_trai ngọc_bích bạch_ngọc ngọc đá_hoa đá_granit đá_vôi đá_bazan đá_lửa
			thiên_thạch quặng đá_thô đá_quý thỏi_vàng thỏi_bạc vân_mẫu huỳnh_thạch lưu_huỳnh ngà
			sa_khoáng lá_vàng lá_bạc than_chì thủy_ngân thạch_cao bạch_á ngọc_quý mạch_quặng
			hồng_ngọc lam_ngọc lục_bảo đá_mắt_mèo đá_mặt_trăng ngọc_lam kim_cương san_hô_đỏ
		`),
		concept: words(`
			tự_do hòa_bình công_lý chân_lý trí_tuệ ký_ức tưởng_tượng câu_chuyện thơ phác_họa ngữ_pháp
			lô_gic vật_lý hóa_học sinh_học triết_học toán_học hình_học đại_số lịch_sử thần_thoại
			ngụ_ngôn tục_ngữ câu_đố bí_mật lời_hứa chuyến_đi phiêu_lưu hải_trình khám_phá thí_nghiệm
			câu_hỏi câu_trả_lời tranh_luận hội_nghị lễ_hội chiều_kích cân_bằng hài_hòa nghi_lễ
			phong_tục văn_hóa ngôn_ngữ chữ_cái mật_mã lưu_trữ lịch chân_trời trực_giác lý_trí
			phán_đoán học_thuyết định_lý tiên_đề giả_thuyết nghịch_lý khuôn_mẫu tiền_đề suy_luận
			diễn_dịch quy_nạp loại_suy ẩn_dụ biểu_tượng chủ_đề tự_sự biên_niên chứng_ngôn tuyên_ngôn
			đồng_thuận thỏa_hiệp giao_ước hiệp_ước liên_minh huyết_thống di_sản truyền_thống
			ngưỡng_cửa mở_đầu kết_cục
		`),
		myth: words(`
			rồng phượng_hoàng kỳ_lân tiên yêu_tinh ma hồn oan_hồn thần thiên_thần ác_quỷ người_cá
			quái_vật ác_thú thánh_thú thần_thú ảo_thú ma_vương long_vương nữ_thần_ảo phép_thuật
			ma_lực thần_chú lời_nguyền tiên_tri sấm_truyền kết_giới bùa_hộ_mệnh phong_ấn ảo_giác
			rồng_lửa rồng_băng hắc_long bạch_long thanh_long bạch_hổ chu_tước huyền_vũ cửu_vĩ_hồ
			chim_lửa người_sói ma_cà_rồng xác_sống ma_nơ_canh người_lùn quỷ_lùn tinh_linh thủy_thần
			sơn_thần hải_thần lôi_thần phong_thần nữ_thủy_thần mỹ_nhân_ngư nhân_mã nhân_sư thiên_mã
			hải_quái thần_điểu linh_hồn ma_thuật đạo_sĩ pháp_sư thầy_bói nhà_tiên_tri hiền_giả
		`),
		job: words(`
			hiệp_sĩ thợ_săn kẻ_trộm hải_tặc thủy_thủ đầu_bếp thợ_rèn thám_tử nhà_thơ họa_sĩ vũ_công
			chú_hề lữ_khách tu_sĩ nhà_giả_kim cung_thủ kiếm_sĩ võ_sĩ tướng_quân binh_sĩ lính_gác vua
			nữ_hoàng hoàng_tử công_chúa hoàng_đế quản_gia thị_nữ người_hầu thương_nhân nông_dân
			ngư_dân mục_đồng tiều_phu lái_đò phu_xe hoa_tiêu phi_công kỹ_sư lao_công lính_cứu_hỏa
			cảnh_sát bác_sĩ y_tá dược_sĩ thú_y giáo_viên học_sinh thủ_thư nhà_báo nhà_văn dịch_giả
			ca_sĩ diễn_viên đạo_diễn nhạc_công thợ_mỏ thợ_mộc thợ_gốm thợ_may tế_sư học_giả tiến_sĩ
			trọng_tài nghệ_sĩ_xiếc
		`),
		music: words(`
			đàn_piano ghi_ta trống chuông đàn_tranh bài_hát điệu_múa nhịp_điệu giai_điệu hòa_âm sáo
			kèn kèn_trumpet đàn_hạc đàn_cello đàn_viola vĩ_cầm trống_lớn chũm_chọe trống_lắc mộc_cầm
			phong_cầm khẩu_cầm đàn_bầu đàn_nhị đàn_nguyệt sáo_trúc bản_nhạc nốt_nhạc dấu_lặng âm_giai
			hợp_xướng đơn_ca hòa_tấu độc_tấu buổi_diễn sân_khấu giao_hưởng điệu_valse nhạc_jazz
			dân_ca khúc_hát_ru hành_khúc khúc_dạo_đầu khúc_giữa âm_sắc nhịp_phách dàn_nhạc
			chương_nhạc khúc_mở_màn dạ_khúc khúc_hát_đêm thánh_ca tụng_ca cầu_hồn_khúc song_ca tam_ca
			tứ_tấu ngũ_tấu nhạc_trưởng quãng_tám bán_âm khóa_nhạc khuông_nhạc tổng_phổ máy_nhịp
		`),
		place: words(`
			chợ quảng_trường thành_phố làng ngõ cầu vườn thư_viện bảo_tàng nhà_hát trường_học
			công_viên cảng bến_tàu nhà_ga sân_bay hải_đăng lâu_đài tường_thành cung_điện chùa đền
			tháp gác_mái tầng_hầm mái_nhà sân_trong hiên nhà_kính kho lều_gỗ đài_quan_sát sân_chơi
			sân_vận_động nhà_thi_đấu bể_bơi thủy_cung vườn_thú nhà_tắm bưu_điện ngân_hàng bệnh_viện
			hiệu_thuốc hiệu_sách tiệm_bánh quán_cà_phê nhà_hàng bếp phòng_ngủ phòng_khách hành_lang
			cầu_thang đường_hầm cầu_vượt ngã_tư đường_dạo pháo_đài nông_trại trang_trại vườn_cây
			nhà_thờ tu_viện thành_lũy hào bến_phà đê bãi_cắm_trại biệt_thự dinh_thự xóm
		`),
		food: words(`
			cơm mì phở bún bánh_mì bánh_bao bánh_xèo bánh_chưng nem chả giò_lụa muối đường tiêu tỏi
			hành khoai cà_rốt dưa_chuột bí_đỏ cải_thảo rau_xà_lách rau_bina nấm đậu_phụ trứng phô_mai
			bơ sữa_chua táo dâu nho dưa_hấu đào hồng quýt chanh chuối xoài sô_cô_la kẹo thạch
			bánh_quy bánh_ngọt bánh_pudding bánh_rán bánh_kếp bánh_kem mứt tương_ớt nước_mắm mắm_tôm
			dưa_muối kim_chi cháo xôi chè bánh_trôi thịt_nướng gỏi_cuốn bánh_cuốn bánh_đúc bánh_gai
			bánh_tét canh súp lẩu
		`),
		sport: words(`
			bóng_đá bóng_chày bóng_rổ bóng_chuyền bóng_bàn quần_vợt cầu_lông gôn bowling bi_a bơi_lội
			điền_kinh thể_dục karate judo kiếm_đạo đấu_vật quyền_anh đấu_kiếm bắn_cung bắn_súng
			cưỡi_ngựa chèo_thuyền lướt_sóng trượt_tuyết khúc_côn_cầu bóng_bầu_dục leo_núi nhảy_dây
			vợt khung_thành huy_chương cúp vô_địch chung_kết vòng_loại cổ_vũ lật_ngược hiệp_phụ
			luyện_tập trượt_băng nhảy_cầu phi_tiêu chạy_bộ vượt_rào ném_lao ném_đĩa tiếp_sức
			bảng_điểm mũ_bảo_hiểm phạm_lỗi nhảy_xa nhảy_cao xà_kép lễ_khai_mạc lễ_bế_mạc nhảy_dù
			bóng_nước đấu_tập cú_móc hạ_đo_ván vật_ngã lộn_nhào khởi_động hội_ý
		`),
		vehicle: words(`
			xe_đạp tàu_hỏa thuyền xe_trượt ô_tô xe_buýt taxi xe_tải xe_máy xe_ga máy_bay trực_thăng
			phi_thuyền tên_lửa tàu_ngầm du_thuyền tàu_hàng tàu_khách thuyền_buồm bè tàu_chiến xe_tăng
			xe_ngựa xe_kéo xe_đẩy xe_nâng máy_kéo máy_xúc xe_cứu_hỏa xe_cảnh_sát cáp_treo tàu_điện
			toa_xe đầu_máy khí_cầu dù kiệu xe_ba_bánh xe_van xe_bán_tải xe_limousine xe_ủi_tuyết
			tàu_một_ray tàu_hai_thân tàu_phá_băng tàu_dầu sà_lan tàu_thăm_dò tàu_đổ_bộ tàu_con_thoi
			xe_địa_hình xe_một_bánh xe_tang xe_nôi xe_con xe_chở_hàng xe_tưới_nước tàu_tuần_tra
			tàu_lặn xuồng toa_giường
		`),
		product: words(`
			máy_tính bàn_phím màn_hình máy_in loa tai_nghe micrô điện_thoại sạc pin điều_khiển
			tủ_lạnh máy_giặt máy_hút_bụi quạt_máy điều_hòa lò_sưởi máy_lọc_nước nồi_cơm_điện
			lò_vi_sóng lò_nướng máy_xay máy_tạo_ẩm máy_hút_ẩm dao_cạo bàn_chải xà_phòng dầu_gội
			nước_hoa máy_chiếu máy_quét máy_ảnh_web nồi_hấp máy_rửa_bát máy_sấy máy_sấy_tóc kem_dưỡng
			rèm_cửa chuông_cửa nhiệt_kế bình_cứu_hỏa bóng_đèn dây_nối ổ_cắm nước_giặt nước_xả móc_áo
			tủ_áo giá_sách ghế_tựa ghế_đẩu khung_giường chăn_bông ga_giường vỏ_gối khăn_tắm
			áo_tắm_dài vòi_sen vòi_nước cây_lau_nhà cốc_đong thìa_đong cây_cán_bột máy_trộn
		`),
		color: words(`
			đỏ_son đỏ_thẫm hồng_đào cam_đất vàng_nghệ vàng_chanh xanh_lá xanh_rêu xanh_ngọc xanh_lam
			xanh_biển xanh_da_trời chàm tím_than tím_hoa_cà nâu_đất nâu_cà_phê be xám_tro xám_khói
			trắng_ngà trắng_sữa đen_tuyền bạc_kim ánh_vàng ánh_bạc đỏ_gạch đỏ_ruby hồng_phấn hồng_sen
			cam_cháy vàng_kim vàng_mơ vàng_đồng màu_lục_bảo lục_nhạt lam_sẫm lam_nhạt tím_nhạt
			tím_sẫm nâu_sẫm nâu_nhạt xám_bạc trắng_tinh đen_nhánh đỏ_tươi cam_tươi vàng_tươi
			xanh_tươi màu_ngọc_lam hổ_phách_sắc đồng_sắc màu_cát màu_tro màu_khói màu_đất màu_trời
			màu_biển màu_mực màu_máu
		`),
		finance: words(`
			sổ_cái hóa_đơn biên_lai trái_phiếu cổ_phiếu cổ_tức lãi_suất khoản_vay thế_chấp tiền_gửi
			tiết_kiệm tài_khoản số_dư ngân_sách kiểm_toán tài_sản nợ_phải_trả doanh_thu lợi_nhuận
			thặng_dư thâm_hụt khoản_nợ tín_dụng tiền_tệ tỷ_giá lợi_suất thuế_quan hoàn_thuế
			phí_bảo_hiểm lương_hưu bảng_lương tiền_công tiền_lương tiền_thưởng nhượng_quyền sáp_nhập
			thâu_tóm cứu_trợ két_sắt kho_bạc chuyển_tiền quyết_toán rút_quá sao_kê sổ_tiết_kiệm
			chủ_nợ con_nợ người_đi_vay định_giá thẩm_định lạm_phát suy_thoái thanh_khoản phá_sản
			của_trời_cho trợ_cấp phụ_cấp chi_phí vòng_quay chiết_khấu trả_góp nợ_quá_hạn
		`),
		tech: words(`
			máy_chủ bộ_nhớ_đệm bộ_đệm điểm_ảnh mã_hóa gói_tin giao_thức hàng_đợi ngăn_xếp con_trỏ
			phần_sụn sổ_đăng_ký băng_thông độ_trễ cổng_kết_nối tường_lửa mạng_con tên_máy tải_trọng
			tổng_kiểm lược_đồ bản_sao_lưu cụm_máy phân_mảnh bản_sao ảnh_chụp vùng_chứa hộp_cát
			đường_ống kho_mã trình_gỡ_lỗi lệnh_tắt mảng ma_trận số_nguyên cú_pháp mã_máy lệnh ngắt
			thanh_ghi tốc_độ_bit thông_lượng bắt_tay trung_gian điểm_cuối giải_mã băm kết_xuất
			bộ_tô_bóng kết_cấu đa_giác khung_dây khung_nhìn bộ_đệm_khung tám_bit đường_lên
			đường_xuống định_tuyến chuyển_mạch bắc_cầu gói_dữ_liệu hệ_thống_tệp phân_vùng thư_mục
			liên_kết_mềm khôi_phục di_trú
		`),
		weather: words(`
			mây gió mưa tuyết sương_giá sương_mù sương cầu_vồng hoàng_hôn sét sấm mưa_rào gió_mùa bão
			lốc_xoáy bão_tuyết mưa_phùn mưa_lớn gió_giật gió_mạnh gió_nhẹ mưa_đá mưa_tuyết tia_nắng
			ảo_ảnh quầng_sáng giọt_mưa hạt_mưa màn_mưa mưa_xuân mưa_thu mưa_đêm tuyết_rơi băng_giá
			sương_muối nắng_nóng đợt_nóng đợt_lạnh gió_bấc gió_nồm gió_lào mây_đen mây_mưa áp_thấp
			áp_cao thời_tiết khí_hậu nhiệt_độ độ_ẩm khí_áp trời_quang trời_râm trời_mưa nắng_gắt
			bóng_râm nắng_chiều gió_biển gió_núi cơn_giông chớp sương_sớm nắng_sớm
		`),
		space: words(`
			sao mặt_trăng mặt_trời thiên_hà sao_chổi sao_băng cực_quang bụi_sao dải_ngân_hà nhật_thực
			nguyệt_thực thiên_đỉnh vũ_trụ hành_tinh vệ_tinh tinh_vân cụm_sao chòm_sao quỹ_đạo
			trọng_lực tự_quay công_chuyển vết_đen gió_mặt_trời bề_mặt_trăng năm_ánh_sáng thiên_thể
			liên_sao định_tinh thiên_cầu hoàng_đạo hệ_ngân_hà hố_đen mưa_sao_băng bụi_vũ_trụ
			hệ_mặt_trời chân_không trăng_khuyết trăng_tròn trăng_non ánh_trăng ánh_sao sao_bắc_cực
			sao_hôm sao_mai sao_hỏa sao_kim sao_mộc sao_thổ sao_thủy
		`),
		time: words(`
			bình_minh chạng_vạng hạ_chí đông_chí xuân_phân thu_phân mùa khoảnh_khắc vĩnh_hằng
			tương_lai sát_na năm_tháng ngày_lễ buổi_sáng buổi_trưa buổi_chiều buổi_tối ban_đêm
			nửa_đêm chính_ngọ rạng_sáng sáng_sớm đêm_khuya hôm_qua hôm_nay ngày_mai ngày_kia hôm_kia
			một_ngày hai_ngày ba_ngày mười_ngày nửa_tháng một_tháng nửa_năm một_năm năm_nay năm_ngoái
			năm_sau mùa_xuân mùa_hè mùa_thu mùa_đông đầu_xuân cuối_xuân đầu_hè giữa_hè cuối_hè
			đầu_thu cuối_thu đầu_đông giữa_đông cuối_đông tiết_khí lập_xuân lập_hạ lập_thu lập_đông
			thời_khắc thời_gian thiên_thu thời_thơ_ấu tuổi_trẻ tuổi_già xế_chiều quãng_đời thuở_xưa
			bây_giờ sau_này
		`),
		emotion: words(`
			can_đảm tò_mò cô_độc hoài_niệm khát_khao đồng_cảm trắc_ẩn lòng_biết_ơn khiêm_nhường
			kiên_nhẫn chuyên_cần thận_trọng điều_độ kiên_cường chính_trực chân_thành kinh_ngạc
			kính_sợ thanh_thản tình_bạn đoàn_kết ganh_đua niềm_vui nỗi_buồn cơn_giận nỗi_sợ
			ngạc_nhiên hân_hoan hạnh_phúc sung_sướng ngây_ngất an_ủi nhẹ_nhõm hy_vọng tuyệt_vọng
			đau_thương u_sầu ảm_đạm nỗi_cô_đơn hối_tiếc ăn_năn tội_lỗi xấu_hổ tự_hào kiêu_ngạo đố_kỵ
			ghen_tuông tham_lam ham_muốn đam_mê tình_cảm trìu_mến dịu_dàng ấm_áp tử_tế cảm_thông
			thương_hại tin_tưởng nghi_ngờ hoài_nghi lo_lắng bồn_chồn khiếp_sợ hoảng_loạn thịnh_nộ
			phẫn_nộ bực_bội khó_chịu chán_nản thờ_ơ nhiệt_huyết hăng_hái phấn_khích háo_hức quyết_tâm
			ý_chí tự_tin khiêm_tốn điềm_tĩnh bình_tĩnh can_trường rụt_rè hớn_hở tâm_trạng
		`),
		body: words(`
			đầu trán lông_mày lông_mi mí_mắt mũi lỗ_mũi má cằm hàm môi lưỡi răng lợi tai dái_tai cổ
			gáy vai khuỷu_tay cổ_tay lòng_bàn_tay đốt_ngón ngón_tay ngón_cái móng_tay nắm_tay ngực
			xương_sườn bụng rốn cột_sống eo hông đùi đầu_gối ống_chân bắp_chân mắt_cá gót ngón_chân
			móng_chân xương hộp_sọ cơ_bắp gân dây_chằng khớp sụn tim phổi gan dạ_dày thận lá_lách
			ruột bàng_quang não thần_kinh tĩnh_mạch động_mạch mao_mạch máu thịt da lỗ_chân_lông tóc
			râu nước_mắt mồ_hôi nước_bọt hơi_thở mạch nhịp_tim lồng_ngực xương_sống xương_đòn
			xương_gò_má màng_nhĩ nhãn_cầu nếp_nhăn tàn_nhang sẹo vết_bầm phồng_rộp chai_tay
		`),
		clothing: words(`
			mũ giày găng khăn_quàng kính_mắt dép_lê dép_xăng_đan quần_áo áo_khoác áo_măng_tô áo_vest
			áo_sơ_mi áo_cánh áo_dài quần quần_bò quần_soóc váy váy_đầm áo_gi_lê áo_len áo_nỉ
			áo_hoodie tất tất_dài đồ_lót đồ_ngủ tạp_dề cà_vạt nơ thắt_lưng dây_lưng giày_da bốt ủng
			đồng_phục lễ_phục com_lê áo_tứ_thân nón_lá áo_bà_ba khăn_rằn áo_tơi áo_mưa đồ_bơi đồ_lặn
			đồ_bảo_hộ áo_ấm áo_leo_núi đồ_thể_thao tay_áo cổ_áo vạt_áo lớp_lót vải vải_lanh lụa bông
			nhung dạ da_thuộc lông_thú mũ_lưỡi_trai mũ_bảo_hộ khăn_voan khăn_choàng bao_tay bịt_tai
		`),
		tool: words(`
			rìu xẻng cưa thang cờ_lê kìm đục đe ống_bễ dùi kẹp ê_tô thước_thủy thước_cặp thước_đo_góc
			thước_kẻ kéo búa búa_gỗ máy_khoan giấy_nhám bào cuốc liềm hái bừa cào mỏ_lết tua_vít
			mỏ_hàn máy_mài máy_cắt máy_hàn thước_dây dây_mực com_pa rìu_nhỏ xà_beng đòn_bẩy nêm
			ròng_rọc tay_quay búa_tạ bay đá_mài giũa bàn_nạo cái_sàng mai bừa_đất cối_xay thoi
			ống_chỉ cán lưỡi_dao bộ_dụng_cụ hộp_đồ_nghề đinh_vít máy_bắn_đinh cưa_lọng cưa_vòng
			máy_tiện máy_chà_nhám cưa_xích cưa_tay mũi_vạch thước_vuông ke_góc bàn_thợ
		`),
		drink: words(`
			cà_phê trà_xanh trà_đen nước_ép sữa nước nước_suối nước_có_ga trà_lúa_mạch trà_hoa_cúc
			trà_gừng trà_sen trà_atiso sữa_đậu_nành cà_phê_sữa cà_phê_đen bạc_xỉu nước_dừa nước_mía
			nước_chanh sinh_tố sữa_lắc nước_ngọt trà_sữa trà_đá cà_phê_đá bia bia_hơi bia_đen
			rượu_vang rượu_trắng rượu_nếp rượu_cần rượu_gạo rượu_thuốc rượu_mạnh sâm_banh cốc_tai
			nước_lọc nước_ấm nước_nóng nước_đá nước_đường mật_ong_pha nước_sâm nước_rau_má nước_vối
			trà_atisô trà_bí_đao nước_yến nước_khoáng nước_hoa_quả sữa_tươi sữa_đặc
		`)
	},
	parts: words(`
		đuôi chân cánh bóng mắt tay tiếng hơi_thở hương vảy bờm sừng mỏ vây tổ hang trứng hạt mảnh
		đàn làng xứ chuyến_đi câu_chuyện bài_hát điệu_múa ánh_sáng tiếng_vọng làn_gió gợn_sóng
		lối_mòn vương_miện áo_choàng bùa tia_lửa nụ_hoa vịnh_nhỏ đỉnh con_đường đèn_lồng móng nanh
		lông_vũ gạc quầng dấu_chân ánh_mắt nụ_cười giọt_nước hơi_ấm
	`),
	// Vietnamese puts the modifier after the noun (mèo xanh) and the possessed
	// thing in front of its owner (đuôi mèo), so its frames run the other way
	// round from the ones above. That is what the per-language frames are for.
	frames: [
		{ slots: ['noun'], weight: 10 },
		{ slots: ['noun', 'adjective'], weight: 34 },
		{ slots: ['noun', 'action'], weight: 22 },
		{ slots: ['part', 'noun'], weight: 14 },
		{ slots: ['part', 'noun', 'adjective'], weight: 14 },
		{ slots: ['noun', 'adjective', 'action'], weight: 6 }
	],
	syn: {
		kind: 'syllable',
		onset: words('b c ch d đ g gh h k kh l m n ng nh ph qu r s t th tr v x'),
		vowel: words('a à á ả ã ạ e ê i o ô ơ u ư ai ao au ay êu ia iê oa oi ôi ơi ua uô ưa ươ ui'),
		coda: ['', '', ...words('n m ng nh t c ch p')],
		minSyllables: 1,
		maxSyllables: 1
	}
};
