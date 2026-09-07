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
		gan_dạ trung_thành kiên_nhẫn cảnh_giác khéo_léo vững_vàng ôn_hòa phóng_khoáng cởi_mở
		trầm_lặng bướng_bỉnh chất_phác ranh_mãnh kiên_cường đài_các lông_xù bóng_loáng tròn_trịa
		nặng_trịch nhẹ_bẫng lạnh_ngắt nóng_hổi thơm_phức ngọt_lịm chua_lè đắng_ngắt loang_lổ
		kẻ_sọc han_gỉ sờn_cũ mới_tinh cũ_kỹ dày_dặn mỏng_manh dẹt nhọn_hoắt cong_queo thẳng_tắp
		thon_dài ngắn_ngủn êm_dịu ồn_ã lặng_thinh trong_trẻo vang_dội trầm_đục du_dương réo_rắt
		khàn_khàn ấm_áp buốt_giá oi_ả khô_ráo ẩm_lạnh u_ám quang_đãng lộng_gió mù_mịt đẫm_sương
		trắng_sương ánh_sao ánh_trăng rêu_phong dây_leo bóng_trúc thông_reo phong_đỏ sen_thơm
		cúc_nhạt lan_u lau_trắng sậy_vàng ngọc_bích san_hô ngà_voi hắc_diện pha_lê bạc_trắng
		đồng_xanh thiếc_bạc chì_xám mã_não son_phấn xanh_đá vàng_nghệ đất_son chàm_đậm
		nguyệt_bạch thiên_thanh cánh_sen xa_xăm nhỏ_nhặt tráng_lệ mộc_mạc tinh_xảo thô_mộc
		mảnh_dẻ cường_tráng rộng_rãi dốc_đứng
	`),
	actions: words(`
		ngủ chạy bay bơi hát nhảy cười khóc đi đứng ngồi nằm ăn uống đọc viết vẽ học làm nghỉ chờ
		tìm gọi nghe nhìn nhớ quên mơ thức trốn đuổi bắt ném kéo đẩy mở đóng xây sửa trồng hái nấu
		nướng dệt may đan chèo lái leo lăn trôi chảy cháy tan nở tàn rơi đợi dạo lượn săn gieo gặt
		gánh vác đội cõng bồng ôm vuốt xoa gõ đập chặt cắt khâu thêu nhuộm phơi giặt quét lau rửa
		xay giã sàng lọc đo đếm ghi kể ngâm ngân gảy thổi đánh vỗ reo hò thầm_thì lang_thang
		bay_lượn tỏa_sáng nhấp_nháy đung_đưa dập_dờn rung_rinh thấp_thoáng vụt_qua ngẩng_lên
		cúi_xuống quay_lại bước_tới dừng_lại
		tỉnh_giấc trở_dậy đứng_lên ngồi_xuống thu_mình nép_vào lùi_lại dừng_chân rảo_bước sải_bước
		băng_qua quay_về rời_đi khuất_dạng rón_bước loạng_choạng nhảy_nhót ngó_quanh ngước_nhìn
		nhìn_xuống dõi_theo chăm_chú chạm_khẽ vuốt_phẳng sắp_xếp chăm_chút cọ_rửa lau_chùi
		đánh_bóng đan_kết khâu_vá cắt_tỉa dán_lại gấp_lại mở_ra khép_lại lấp_đầy dốc_cạn rót_đầy
		bày_biện khuấy_đều ninh_nhừ xào_nấu hâm_nóng để_nguội nếm_thử nuốt_chửng khắc_chạm
		nhuộm_màu quét_sơn mài_giũa cân_nhắc ngẫm_lại nhấm_nháp
	`),
	nouns: {
		animal: words(`
			mèo chó hổ sư_tử báo cáo sói gấu gấu_trúc rái_cá thỏ sóc voi hươu nai ngựa lừa bò trâu dê
			cừu lợn khỉ vượn cá_sấu rắn thằn_lằn rùa ếch cóc chim én sẻ quạ chim_ưng đại_bàng công
			vẹt cú bồ_câu hạc thiên_nga vịt ngỗng gà cá cá_voi cá_heo cá_mập mực bạch_tuộc tôm cua sò
			ốc bướm ong kiến nhện chuồn_chuồn ve muỗi ruồi giun sâu tằm dơi chồn nhím lạc_đà hà_mã
			tê_giác hươu_cao_cổ chuột sứa hải_cẩu đà_điểu bọ_ngựa cá_chép lươn
			lợn_rừng tuần_lộc linh_dương hải_ly thú_mỏ_vịt chuột_túi vượn_cáo tinh_tinh khỉ_đầu_chó
			heo_vòi sóc_bay chuột_chũi lửng cầy sơn_ca chim_cút gà_lôi đa_đa chim_ruồi hồng_hạc cò
			chim_gõ_kiến chim_sáo chim_chích chim_cắt hải_âu bồ_nông cá_trích cá_ngừ cá_tuyết cá_hồi
			cá_trê cá_rô cá_thu cá_đuối hàu trai vẹm tôm_hùm sao_biển cá_kiếm cá_ngựa bọ_cánh_cứng
			châu_chấu dế ong_bắp_cày bướm_đêm đom_đóm rết bọ_cạp bọ_chét ong_nghệ bọ_rùa kỳ_nhông
			tắc_kè kỳ_giông trăn rắn_hổ_mang rắn_lục
		`),
		object: words(`
			chai bút tẩy ô đèn gương chìa_khóa ổ_khóa túi cúc kim chỉ cọ giấy vở thư tem con_dấu
			bản_đồ ống_nhòm kính_hiển_vi máy_ảnh phim bóng_bay diều con_quay bi xúc_xắc thẻ mảnh_ghép
			buồm neo lều đèn_pin diêm nến chậu ấm chén thìa đĩa nồi bánh_răng dây_cót ruy_băng gối
			chăn giỏ chổi còi dây xô quạt khiên lưới cần_câu lọ lược chuông_gió hạc_giấy đồng_hồ_cát
			ống_khói phễu bình gáo mẹt nia rổ khay hộp thùng vại chum
			la_bàn móc_khóa ghim cuộn_chỉ dây_thừng móc đinh ốc_vít đai_ốc vòng_đệm bản_lề then_cài
			xích khóa_kéo trâm_cài vòng_tay nhẫn cặp_sách ba_lô rương thùng_gỗ bát chày cối kẹp bấc
			kính_lúp mảnh_vải khuy_bấm
		`),
		nature: words(`
			biển sông hồ thác thung_lũng núi đồi đồng_cỏ rừng hang sa_mạc cát đá sỏi núi_lửa động_đất
			sông_băng san_hô đầm_lầy suối vịnh cồn_cát đỉnh_núi hoang_mạc rừng_thưa thảo_nguyên đầm
			cửa_sông châu_thổ phá đảo bán_đảo eo_đất quần_đảo cao_nguyên vách_đá khe_núi bãi_cát
			bãi_đá rạn_san_hô đáy_biển vực_sâu mạch_nước hố_sụt măng_đá nhũ_đá hang_động gờ_đá bóng
			âm_vang hương lửa than_hồng dòng_chảy bờ_biển bãi_bồi
			rừng_rậm đồng_bằng lãnh_nguyên đầm_phá ốc_đảo hẻm_núi bãi_biển eo_biển kênh dòng_nước
			thủy_triều sóng bọt sóng_vỗ khe_hở lòng_chảo trũng đèo núi_đá chân_núi bãi_lầy gành_đá
			vũng cửa_hang
		`),
		plant: words(`
			cây lá hoa rễ hạt quả rêu dương_xỉ tre thông phong anh_đào hoa_hồng hoa_sen hoa_cúc
			hoa_mai hoa_lan bồ_công_anh hướng_dương hoa_súng cỏ cành mầm chồi nụ cánh_hoa phấn_hoa
			vòng_gỗ quả_thông quả_sồi bạch_quả liễu bạch_dương tùng bách sồi dẻ óc_chó thảm_cỏ
			tảo rong_biển bồn_cây hàng_rào_cây bó_hoa cỏ_dại xương_rồng lô_hội
			húng_quế hương_thảo bạc_hà thì_là mùi_tây nghệ_tây rau_mùi hẹ me sim ổi
			thân_cây vỏ_cây nhựa_cây gai mâm_xôi tầm_gửi nguyệt_quế ô_liu cây_táo hạnh_nhân
			bạch_đàn tần_bì du đoạn cây_gạo keo mộc_lan trà_mi thược_dược phong_lữ cẩm_chướng
			cúc_họa_mi anh_túc dạ_lan_hương thủy_tiên hoa_ly cỏ_ba_lá sậy tầm_ma kế linh_lan
			tử_đằng
		`),
		gem: words(`
			vàng bạc đồng sắt thép đồng_thau thiếc kẽm bạch_kim thủy_tinh pha_lê thạch_anh mã_não
			hổ_phách ngọc_trai ngọc_bích bạch_ngọc ngọc đá_hoa đá_granit đá_vôi đá_bazan đá_lửa
			thiên_thạch quặng đá_thô đá_quý thỏi_vàng thỏi_bạc vân_mẫu huỳnh_thạch lưu_huỳnh ngà
			sa_khoáng lá_vàng lá_bạc than_chì thủy_ngân thạch_cao đá_phiến mạch_quặng
			hồng_ngọc ngọc_đen lục_bảo đá_mắt_mèo đá_mặt_trăng ngọc_lam kim_cương san_hô_đỏ
			niken titan nhôm chì vonfram coban crom mangan liti urani ngọc_bội đá_cẩm_thạch
			đá_sa_thạch đá_phiến_sét đá_ong đá_bọt đá_cuội khoáng_vật tinh_thể đá_hoa_cương
			bô_xít than_đá muối_mỏ đá_bùn đá_tảng
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
			vần_thơ văn_xuôi tiểu_thuyết tiểu_luận luận_đề tổng_hợp phân_tích phương_pháp lý_thuyết
			thực_hành kỹ_thuật nghệ_thuật khoa_học đạo_đức mỹ_học hùng_biện ngữ_nghĩa chính_tả
			thư_pháp xác_tín ngẫu_nhiên số_phận vận_may lương_tâm bản_thể vật_chất hình_thức
			nguyên_nhân kết_quả trật_tự hỗn_độn giới_hạn nguồn_cội
		`),
		myth: words(`
			rồng phượng_hoàng kỳ_lân tiên yêu_tinh ma hồn oan_hồn thần thiên_thần ác_quỷ người_cá
			quái_vật ác_thú thánh_thú thần_thú ma_vương long_vương phép_thuật
			ma_lực thần_chú lời_nguyền tiên_tri sấm_truyền kết_giới bùa_hộ_mệnh phong_ấn ảo_giác
		 hắc_long bạch_long thanh_long bạch_hổ chu_tước huyền_vũ cửu_vĩ_hồ
			chim_lửa người_sói ma_cà_rồng xác_sống hình_nhân người_lùn quỷ_lùn tinh_linh thủy_thần
			sơn_thần hải_thần lôi_thần phong_thần mỹ_nhân_ngư nhân_mã nhân_sư thiên_mã
			hải_quái thần_điểu linh_hồn ma_thuật đạo_sĩ pháp_sư thầy_bói nhà_tiên_tri hiền_giả
			yêu_nữ mãng_xà khổng_lồ thủy_quái yêu_ma quỷ_dữ thổ_địa hà_bá tiên_nữ tiên_ông
			sách_phép chén_thánh gậy_phép trượng vương_trượng hồ_ly bạch_xà thanh_xà thần_hộ_mệnh
			linh_thú ma_trơi quỷ_sứ thiên_binh
		`),
		job: words(`
			hiệp_sĩ thợ_săn kẻ_trộm hải_tặc thủy_thủ đầu_bếp thợ_rèn thám_tử nhà_thơ họa_sĩ vũ_công
			chú_hề lữ_khách tu_sĩ nhà_giả_kim cung_thủ kiếm_sĩ võ_sĩ tướng_quân binh_sĩ lính_gác vua
			nữ_hoàng hoàng_tử công_chúa hoàng_đế quản_gia thị_nữ người_hầu thương_nhân nông_dân
			ngư_dân mục_đồng tiều_phu lái_đò phu_xe hoa_tiêu phi_công kỹ_sư lao_công lính_cứu_hỏa
			cảnh_sát bác_sĩ y_tá dược_sĩ thú_y giáo_viên học_sinh thủ_thư nhà_báo nhà_văn dịch_giả
			ca_sĩ diễn_viên đạo_diễn nhạc_công thợ_mỏ thợ_mộc thợ_gốm thợ_may thầy_tế học_giả tiến_sĩ
			trọng_tài nghệ_sĩ_xiếc
			luật_sư thẩm_phán kế_toán thủ_quỹ người_bán bồi_bàn gác_cổng tài_xế thợ_máy thợ_ống_nước
			thợ_hồ thợ_kính thợ_kim_hoàn thợ_giày thợ_cắt_tóc thợ_cạo thợ_bánh đồ_tể nhà_khảo_cổ
			nhà_sinh_học nhà_địa_chất nhà_thực_vật sử_gia triết_gia văn_thư thợ_xay thợ_thùng thợ_dệt
			thợ_sơn
			nhà_du_hành
		`),
		music: words(`
			đàn_piano ghi_ta trống chuông đàn_tranh bài_hát điệu_múa nhịp_điệu giai_điệu hòa_âm sáo
			kèn kèn_trumpet đàn_hạc đàn_cello đàn_viola vĩ_cầm trống_lớn chũm_chọe trống_lắc mộc_cầm
			phong_cầm khẩu_cầm đàn_bầu đàn_nhị đàn_nguyệt sáo_trúc bản_nhạc nốt_nhạc dấu_lặng âm_giai
			hợp_xướng đơn_ca hòa_tấu độc_tấu buổi_diễn sân_khấu giao_hưởng điệu_valse nhạc_jazz
			dân_ca khúc_hát_ru hành_khúc khúc_dạo_đầu khúc_kết âm_sắc nhịp_phách dàn_nhạc
			chương_nhạc khúc_mở_màn dạ_khúc biến_tấu thánh_ca tụng_ca cầu_hồn_khúc song_ca tam_ca
			tứ_tấu ngũ_tấu nhạc_trưởng quãng_tám bán_âm khóa_nhạc khuông_nhạc tổng_phổ máy_nhịp
			đại_hồ_cầm kèn_trombone kèn_tuba kèn_túi đàn_cầm cồng chiêng đàn_đá sáo_mèo đàn_tỳ_bà
			đàn_tam trống_cơm đối_âm luyến_âm nhịp_độ điệp_khúc khổ_thơ ca_khúc thánh_thi hợp_ca
			đồng_dao ngâm_thơ cao_độ trường_độ âm_vực đàn_sến kèn_lá
		`),
		place: words(`
			chợ quảng_trường thành_phố làng ngõ cầu vườn thư_viện bảo_tàng nhà_hát trường_học
			công_viên cảng bến_tàu nhà_ga sân_bay hải_đăng lâu_đài tường_thành cung_điện chùa đền
			tháp gác_mái tầng_hầm mái_nhà sân_trong hiên nhà_kính kho lều_gỗ đài_quan_sát sân_chơi
			sân_vận_động nhà_thi_đấu bể_bơi thủy_cung vườn_thú nhà_tắm bưu_điện ngân_hàng bệnh_viện
			hiệu_thuốc hiệu_sách tiệm_bánh quán_cà_phê nhà_hàng bếp phòng_ngủ phòng_khách hành_lang
			cầu_thang đường_hầm cầu_vượt ngã_tư đường_dạo pháo_đài nông_trại trang_trại vườn_cây
			nhà_thờ tu_viện thành_lũy hào bến_phà đê bãi_cắm_trại biệt_thự dinh_thự xóm
			nhà_thờ_lớn nhà_nguyện am nghĩa_trang lăng_mộ hầm_mộ thánh_đường nhà_trọ quán_trọ
			quán_ăn quán_rượu hội_chợ khu_phố ngoại_ô đại_lộ lối_đi lối_tắt ngã_ba bến_đò đập_nước
			cống cầu_dẫn cối_xay_gió lò_rèn xưởng nhà_kho chuồng nhà_sàn trạm_gác
		`),
		food: words(`
			cơm mì phở bún bánh_mì bánh_bao bánh_xèo bánh_chưng nem chả giò_lụa muối đường tiêu tỏi
			hành khoai cà_rốt dưa_chuột bí_đỏ cải_thảo rau_xà_lách rau_bina nấm đậu_phụ trứng phô_mai
			bơ sữa_chua táo dâu nho dưa_hấu đào hồng quýt chanh chuối xoài sô_cô_la kẹo thạch
			bánh_quy bánh_ngọt bánh_pudding bánh_rán bánh_kếp bánh_kem mứt tương_ớt nước_mắm mắm_tôm
			dưa_muối kim_chi cháo xôi chè bánh_trôi thịt_nướng gỏi_cuốn bánh_cuốn bánh_đúc bánh_gai
			bánh_tét canh súp lẩu
			lúa_mạch_đen lúa_mạch yến_mạch ngô đậu_lăng đậu_gà đậu_xanh đậu_nành cà_chua ớt_chuông
			cà_tím bí_ngòi súp_lơ bông_cải atisô măng_tây tỏi_tây củ_cải củ_dền cần_tây lê mận lựu
			mộc_qua mơ bưởi kiwi hạt_dẻ đậu_phộng hạt_điều bánh_nướng bánh_khúc bánh_tro bánh_bèo
			bánh_nậm bún_bò bún_riêu miến hủ_tiếu
		`),
		sport: words(`
			bóng_đá bóng_chày bóng_rổ bóng_chuyền bóng_bàn quần_vợt cầu_lông gôn bowling bi_a bơi_lội
			điền_kinh thể_dục karate judo kiếm_đạo đấu_vật quyền_anh đấu_kiếm bắn_cung bắn_súng
			cưỡi_ngựa chèo_thuyền lướt_sóng trượt_tuyết khúc_côn_cầu bóng_bầu_dục leo_núi nhảy_dây
			vợt khung_thành huy_chương cúp vô_địch chung_kết vòng_loại cổ_vũ lật_ngược hiệp_phụ
			luyện_tập trượt_băng nhảy_cầu phi_tiêu chạy_bộ vượt_rào ném_lao ném_đĩa tiếp_sức
			bảng_điểm mũ_bảo_hiểm phạm_lỗi nhảy_xa nhảy_cao xà_kép lễ_khai_mạc lễ_bế_mạc nhảy_dù
			bóng_nước đấu_tập cú_móc hạ_đo_ván vật_ngã lộn_nhào khởi_động hội_ý
			đua_thuyền ném_tạ nhảy_sào ván_nhún thảm_tập ngựa_gỗ cờ_vua cờ_tướng đô_mi_nô tiền_đạo
			hậu_vệ sân_bóng đường_chạy phạt_đền phạt_góc thẻ_vàng tỷ_số hòa chiến_thắng thất_bại
			kỷ_lục giải_đấu giải_vô_địch cầu_môn
		`),
		vehicle: words(`
			xe_đạp tàu_hỏa thuyền xe_trượt ô_tô xe_buýt taxi xe_tải xe_máy xe_ga máy_bay trực_thăng
			phi_thuyền tên_lửa tàu_ngầm du_thuyền tàu_hàng tàu_khách thuyền_buồm bè tàu_chiến xe_tăng
			xe_ngựa xe_kéo xe_đẩy xe_nâng máy_kéo máy_xúc xe_cứu_hỏa xe_cảnh_sát cáp_treo tàu_điện
			toa_xe đầu_máy khí_cầu dù kiệu xe_ba_bánh xe_van xe_bán_tải xe_limousine xe_ủi_tuyết
			tàu_một_ray tàu_hai_thân tàu_phá_băng tàu_dầu sà_lan tàu_thăm_dò tàu_đổ_bộ tàu_con_thoi
			xe_địa_hình xe_một_bánh xe_tang xe_nôi xe_con xe_chở_hàng xe_tưới_nước tàu_tuần_tra
			tàu_lặn xuồng toa_giường
			xe_thổ_mộ xe_mui_trần xe_ben xe_trộn cần_cẩu xe_lu máy_gặt ván_trượt xe_đạp_điện
			thuyền_thúng ghe xuồng_ba_lá tàu_hộ_tống tàu_khu_trục tàu_cao_tốc tàu_lượn xe_bồn xe_rác
			xe_khách xe_ôm xe_thồ thuyền_nan bè_tre
		`),
		product: words(`
			máy_tính bàn_phím màn_hình máy_in loa tai_nghe micrô điện_thoại sạc pin điều_khiển
			tủ_lạnh máy_giặt máy_hút_bụi quạt_máy điều_hòa lò_sưởi máy_lọc_nước nồi_cơm_điện
			lò_vi_sóng lò_nướng máy_xay máy_tạo_ẩm máy_hút_ẩm dao_cạo bàn_chải xà_phòng dầu_gội
			nước_hoa máy_chiếu máy_quét máy_ảnh_web nồi_hấp máy_rửa_bát máy_sấy máy_sấy_tóc kem_dưỡng
			rèm_cửa chuông_cửa nhiệt_kế bình_cứu_hỏa bóng_đèn dây_nối ổ_cắm nước_giặt nước_xả móc_áo
			tủ_áo giá_sách ghế_tựa ghế_đẩu khung_giường chăn_bông ga_giường vỏ_gối khăn_tắm
			áo_tắm_dài vòi_sen vòi_nước cây_lau_nhà cốc_đong thìa_đong cây_cán_bột máy_trộn
			ti_vi loa_thùng cân bàn_là máy_nướng nồi_chiên máy_ép ấm_điện thảm rèm_sáo đèn_chùm
			đèn_bàn bộ_đồ_ăn khăn_ăn giá_bát bồn_rửa vòi_hoa_sen bồn_tắm gương_soi dũa_móng hộp_đựng
			lọ_muối đế_lót khay_đá
		`),
		color: words(`
			đỏ_son đỏ_thẫm hồng_đào cam_đất vàng_nghệ vàng_chanh xanh_lá xanh_rêu xanh_ngọc xanh_lam
			xanh_biển xanh_da_trời chàm tím_than tím_hoa_cà nâu_đất nâu_cà_phê be xám_tro xám_khói
			trắng_ngà trắng_sữa đen_tuyền bạc_kim ánh_vàng ánh_bạc đỏ_gạch đỏ_ruby hồng_phấn hồng_sen
			cam_cháy vàng_kim vàng_mơ vàng_đồng màu_lục_bảo lục_nhạt lam_sẫm lam_nhạt tím_nhạt
			tím_sẫm nâu_sẫm nâu_nhạt xám_bạc trắng_tinh đen_nhánh đỏ_tươi cam_tươi vàng_tươi
			xanh_tươi màu_ngọc_lam màu_hổ_phách màu_đồng màu_cát màu_tro màu_khói màu_đất màu_trời
			màu_biển màu_mực màu_máu
			đỏ_thắm đỏ_bầm hồng_nhạt cam_nhạt vàng_nhạt xanh_thẫm lam_biếc tím_biếc nâu_đỏ xám_xanh
			trắng_ngần đen_thẫm bạc_xám hồng_cam vàng_hoe xanh_lục lục_thẫm chàm_đen huyết_dụ đỏ_cam
			vàng_óng trắng_xanh
		`),
		finance: words(`
			sổ_cái hóa_đơn biên_lai trái_phiếu cổ_phiếu cổ_tức lãi_suất khoản_vay thế_chấp tiền_gửi
			tiết_kiệm tài_khoản số_dư ngân_sách kiểm_toán tài_sản nợ_phải_trả doanh_thu lợi_nhuận
			thặng_dư thâm_hụt khoản_nợ tín_dụng tiền_tệ tỷ_giá lợi_suất thuế_quan hoàn_thuế
			phí_bảo_hiểm lương_hưu bảng_lương tiền_công tiền_lương tiền_thưởng nhượng_quyền sáp_nhập
			thâu_tóm cứu_trợ két_sắt kho_bạc chuyển_tiền quyết_toán thấu_chi sao_kê sổ_tiết_kiệm
			chủ_nợ con_nợ người_đi_vay định_giá thẩm_định lạm_phát suy_thoái thanh_khoản phá_sản
			của_trời_cho trợ_cấp phụ_cấp chi_phí vòng_quay chiết_khấu trả_góp nợ_quá_hạn
			sổ_quỹ hợp_đồng văn_tự hối_phiếu lãi hạn_ngạch khoản_phí thuế tiền_phạt tiền_cọc
			của_hồi_môn thừa_kế tiền_thuê kho_báu giàu_có nghèo_khó tích_lũy phụ_thu doanh_số lỗ vốn
			quỹ tiền_lãi sổ_nợ tiền_mặt
		`),
		tech: words(`
			máy_chủ bộ_nhớ_đệm bộ_đệm điểm_ảnh mã_hóa gói_tin giao_thức hàng_đợi ngăn_xếp con_trỏ
			phần_sụn sổ_đăng_ký băng_thông độ_trễ cổng_kết_nối tường_lửa mạng_con tên_máy tải_trọng
			mã_kiểm_tra lược_đồ bản_sao_lưu cụm_máy phân_mảnh bản_sao ảnh_chụp vùng_chứa hộp_cát
			đường_ống kho_mã trình_gỡ_lỗi lệnh_tắt mảng ma_trận số_nguyên cú_pháp mã_máy lệnh ngắt
			thanh_ghi tốc_độ_bit thông_lượng bắt_tay trung_gian điểm_cuối giải_mã băm kết_xuất
			bộ_tô_bóng kết_cấu đa_giác khung_dây khung_nhìn bộ_đệm_khung tám_bit đường_lên
			đường_xuống định_tuyến chuyển_mạch bắc_cầu gói_dữ_liệu hệ_thống_tệp phân_vùng thư_mục
			liên_kết_mềm khôi_phục di_trú
			nhân tiến_trình phiên truy_vấn chỉ_mục bảng cột hàng trường nút đồ_thị danh_sách
			tập_hợp mô_đun tiện_ích bản_vá nhánh phiên_bản bản_dựng kiểm_thử hồ_sơ
			ngưỡng sự_kiện tín_hiệu luồng bộ_lọc gói_cài
			kho_lệnh mã_nguồn nhãn_dán
		`),
		weather: words(`
			mây gió mưa tuyết sương_giá sương_mù sương cầu_vồng hoàng_hôn sét sấm mưa_rào gió_mùa bão
			lốc_xoáy bão_tuyết mưa_phùn mưa_lớn gió_giật gió_mạnh gió_nhẹ mưa_đá mưa_tuyết tia_nắng
			ảo_ảnh quầng_sáng giọt_mưa hạt_mưa màn_mưa mưa_xuân mưa_thu mưa_đêm tuyết_rơi băng_giá
			sương_muối nắng_nóng đợt_nóng đợt_lạnh gió_bấc gió_nồm gió_lào mây_đen vầng_mây áp_thấp
			áp_cao thời_tiết khí_hậu nhiệt_độ độ_ẩm khí_áp trời_quang trời_râm trời_mưa nắng_gắt
			bóng_râm nắng_chiều gió_biển gió_núi cơn_giông chớp nắng_sớm
			nắng_hạn gió_xoáy vòi_rồng mưa_bụi mưa_ngâu mưa_dầm sương_sa băng_tan trời_nồm oi_bức
			rét_đậm rét_hại nắng_hanh trời_âm_u mây_mù quầng_trăng ráng_chiều tia_chớp hạn_hán lũ_lụt
			triều_cường gió_chướng mưa_ngâu_dài
		`),
		space: words(`
			sao mặt_trăng mặt_trời thiên_hà sao_chổi sao_băng cực_quang bụi_sao dải_ngân_hà nhật_thực
			nguyệt_thực thiên_đỉnh vũ_trụ hành_tinh vệ_tinh tinh_vân cụm_sao chòm_sao quỹ_đạo
			trọng_lực tự_quay nhật_hoa vết_đen gió_mặt_trời bề_mặt_trăng năm_ánh_sáng thiên_thể
			liên_sao định_tinh thiên_cầu hoàng_đạo hệ_ngân_hà hố_đen mưa_sao_băng bụi_vũ_trụ
			hệ_mặt_trời chân_không trăng_khuyết trăng_tròn trăng_non ánh_trăng ánh_sao sao_bắc_cực
			sao_hôm sao_mai sao_hỏa sao_kim sao_mộc sao_thổ sao_thủy
			thị_sai parsec thiên_để phương_vị cận_nhật viễn_nhật quang_cầu sắc_cầu tầng_điện_ly
			tầng_đối_lưu trọng_trường sao_lùn sao_đôi tàu_vũ_trụ thiên_văn vành_đai_sao
			đĩa_sao lỗ_sâu sao_siêu_mới
		`),
		time: words(`
			bình_minh chạng_vạng hạ_chí đông_chí xuân_phân thu_phân mùa khoảnh_khắc vĩnh_hằng
			tương_lai sát_na năm_tháng ngày_lễ buổi_sáng buổi_trưa buổi_chiều buổi_tối ban_đêm
			nửa_đêm chính_ngọ rạng_sáng sáng_sớm đêm_khuya hôm_qua hôm_nay ngày_mai ngày_kia hôm_kia
			quá_khứ hiện_tại thế_kỷ thập_kỷ kỷ_nguyên thời_đại tuần_lễ cuối_tuần năm_nay năm_ngoái
			năm_sau mùa_xuân mùa_hè mùa_thu mùa_đông đầu_xuân giây_lát chốc_lát giữa_hè giao_thừa
			rằm cuối_thu sinh_nhật thời_hạn ngày_xưa tiết_khí lập_xuân lập_hạ lập_thu lập_đông
			thời_khắc thời_gian thiên_thu thời_thơ_ấu tuổi_trẻ tuổi_già xế_chiều quãng_đời thuở_xưa
			bây_giờ sau_này
			phút giây giờ chu_kỳ ca vòng giai_đoạn chặng buổi_sớm dĩ_vãng mai_sau niên_đại thập_niên
			thế_hệ tuần_trăng khắc chiều_tà đầu_hè cuối_đông ngày_thường ngày_nghỉ nửa_ngày độ_dài
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
			đắng_cay oán_hận căm_ghét khinh_thường ngờ_vực chán_chường sầu_muộn tủi_hờn khuây_khỏa
			sùng_kính khoan_dung độ_lượng thiện_chí mến_mộ ác_cảm hoan_hỉ mãn_nguyện thấp_thỏm
			bồi_hồi sửng_sốt hối_hận day_dứt khát_vọng rạo_rực nôn_nao ngưỡng_mộ
		`),
		body: words(`
			đầu trán lông_mày lông_mi mí_mắt mũi lỗ_mũi má cằm hàm môi lưỡi răng lợi tai dái_tai cổ
			gáy vai khuỷu_tay cổ_tay lòng_bàn_tay đốt_ngón ngón_tay ngón_cái móng_tay nắm_tay ngực
			xương_sườn bụng rốn cột_sống eo hông đùi đầu_gối ống_chân bắp_chân mắt_cá gót ngón_chân
			móng_chân xương hộp_sọ cơ_bắp gân dây_chằng khớp sụn tim phổi gan dạ_dày thận lá_lách
			ruột bàng_quang não thần_kinh tĩnh_mạch động_mạch mao_mạch máu thịt da lỗ_chân_lông tóc
			râu nước_mắt mồ_hôi nước_bọt hơi_thở mạch nhịp_tim lồng_ngực xương_sống xương_đòn
			xương_gò_má màng_nhĩ nhãn_cầu nếp_nhăn tàn_nhang sẹo vết_bầm phồng_rộp chai_tay
			thái_dương vòm_miệng amidan thanh_quản hầu khí_quản thực_quản cơ_hoành xương_ức
			xương_bả đốt_sống khung_chậu xương_đùi xương_chày xương_mác cánh_tay cẳng_tay
			mu_bàn_chân nách bẹn khoeo mống_mắt con_ngươi giác_mạc võng_mạc vách_ngăn lưỡi_gà
		`),
		clothing: words(`
			mũ giày găng khăn_quàng kính_mắt dép_lê dép_xăng_đan quần_áo áo_khoác áo_măng_tô áo_vest
			áo_sơ_mi áo_cánh áo_dài quần quần_bò quần_soóc váy váy_đầm áo_gi_lê áo_len áo_nỉ
			áo_hoodie tất tất_dài đồ_lót đồ_ngủ tạp_dề cà_vạt nơ thắt_lưng dây_lưng giày_da bốt ủng
			đồng_phục lễ_phục com_lê áo_tứ_thân nón_lá áo_bà_ba khăn_rằn áo_tơi áo_mưa đồ_bơi đồ_lặn
			đồ_bảo_hộ áo_ấm áo_leo_núi đồ_thể_thao tay_áo cổ_áo vạt_áo lớp_lót vải vải_lanh lụa bông
			nhung dạ da_thuộc lông_thú mũ_lưỡi_trai mũ_bảo_hộ khăn_voan khăn_choàng bao_tay bịt_tai
			áo_đuôi_tôm áo_lễ áo_chẽn váy_lót yếm xà_cạp guốc dép_xỏ_ngón áo_nịt váy_phồng khăn_trùm
			mũ_ba_góc mũ_trụ mũ_trùm khăn_cổ ống_tay viền dải_viền khố váy_xòe áo_choàng quần_lửng
		`),
		tool: words(`
			rìu xẻng cưa thang cờ_lê kìm đục đe ống_bễ dùi ê_tô thước_thủy thước_cặp thước_đo_góc
			thước_kẻ kéo búa búa_gỗ máy_khoan giấy_nhám bào cuốc liềm hái bừa cào mỏ_lết tua_vít
			mỏ_hàn máy_mài máy_cắt máy_hàn thước_dây dây_mực com_pa rìu_nhỏ xà_beng đòn_bẩy nêm
			ròng_rọc tay_quay búa_tạ bay đá_mài giũa bàn_nạo cái_sàng mai cày cối_xay thoi
			ống_chỉ cán lưỡi_dao bộ_dụng_cụ hộp_đồ_nghề đinh_vít máy_bắn_đinh cưa_lọng cưa_vòng
			máy_tiện máy_chà_nhám cưa_xích cưa_tay mũi_vạch thước_vuông ke_góc bàn_thợ
			khoan_tay giũa_thô thước_vạch dây_dọi kìm_cắt kích máy_bấm đèn_khò khuôn_đúc khuôn_dập
			đá_ráp mũi_khoan dao_tỉa rìu_tay dao_bào dùi_đục mỏ_cặp cưa_cắt bàn_kẹp
			kìm_kẹp
		`),
		drink: words(`
			cà_phê trà_xanh trà_đen nước_ép sữa nước nước_suối nước_có_ga trà_lúa_mạch trà_hoa_cúc
			trà_gừng trà_sen trà_atiso sữa_đậu_nành cà_phê_sữa cà_phê_đen bạc_xỉu nước_dừa nước_mía
			nước_chanh sinh_tố sữa_lắc nước_ngọt trà_sữa trà_đá cà_phê_đá bia bia_hơi bia_đen
			rượu_vang rượu_trắng rượu_nếp rượu_cần rượu_gạo rượu_thuốc rượu_mạnh sâm_banh cốc_tai
		 nước_đường nước_sâm nước_rau_má nước_vối
			nước_sấu trà_bí_đao nước_yến nước_khoáng sữa_tươi sữa_đặc
			nước_lọc trà_ô_long trà_nhài trà_bạc_hà nước_cam nước_táo nước_nho nước_gạo
			rượu_vang_đỏ rượu_táo rượu_mơ rượu_sim rượu_đế nước_ngô chè_đỗ_đen rượu_ngâm nước_me
			nước_nhãn trà_hoa_nhài
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
	// How common each noun is, for `vocabulary` to draw by: the everyday words,
	// and the ones a specialist or a dictionary would know. Every noun in neither
	// list is common. See `WordLevels`.
	levels: {
		basic: words(`
			mèo chó hổ sư_tử cáo sói gấu gấu_trúc thỏ sóc voi hươu nai ngựa lừa bò trâu dê cừu lợn khỉ cá_sấu
			rắn thằn_lằn rùa ếch cóc chim én sẻ quạ đại_bàng công vẹt cú bồ_câu thiên_nga vịt ngỗng gà cá
			cá_voi cá_heo cá_mập mực bạch_tuộc tôm cua sò ốc bướm ong kiến nhện chuồn_chuồn ve muỗi ruồi giun
			sâu dơi lạc_đà hà_mã tê_giác hươu_cao_cổ chuột cá_chép lươn chuột_túi cò châu_chấu dế đom_đóm
			chai bút tẩy ô đèn gương chìa_khóa ổ_khóa túi cúc kim chỉ giấy vở thư bản_đồ máy_ảnh phim
			bóng_bay diều thẻ đèn_pin diêm nến chậu ấm chén thìa đĩa nồi gối chăn giỏ chổi dây xô quạt lưới
			lọ lược bình rổ khay hộp thùng móc_khóa đinh khóa_kéo vòng_tay nhẫn cặp_sách ba_lô bát kẹp biển
			sông hồ thác thung_lũng núi đồi rừng hang sa_mạc cát đá sỏi núi_lửa động_đất san_hô suối vịnh
			đỉnh_núi đảo cao_nguyên bãi_cát hang_động bóng hương lửa bờ_biển rừng_rậm đồng_bằng bãi_biển kênh
			sóng bọt đèo cây lá hoa rễ hạt quả tre thông anh_đào hoa_hồng hoa_sen hoa_cúc hoa_mai hoa_lan
			bồ_công_anh hướng_dương cỏ cành mầm chồi nụ cánh_hoa rong_biển bó_hoa cỏ_dại xương_rồng húng_quế
			bạc_hà rau_mùi hẹ me ổi thân_cây vỏ_cây gai cây_táo vàng bạc đồng sắt thép thủy_tinh pha_lê
			ngọc_trai ngọc đá_vôi đá_quý kim_cương nhôm chì đá_cuội than_đá đá_tảng tự_do hòa_bình trí_tuệ
			ký_ức tưởng_tượng câu_chuyện thơ ngữ_pháp vật_lý hóa_học sinh_học toán_học lịch_sử thần_thoại
			câu_đố bí_mật lời_hứa chuyến_đi phiêu_lưu khám_phá thí_nghiệm câu_hỏi câu_trả_lời lễ_hội văn_hóa
			ngôn_ngữ chữ_cái mật_mã lịch chân_trời chủ_đề truyền_thống kỹ_thuật nghệ_thuật khoa_học chính_tả
			vận_may nguyên_nhân kết_quả rồng phượng_hoàng kỳ_lân tiên yêu_tinh ma hồn thần thiên_thần ác_quỷ
			người_cá quái_vật phép_thuật thần_chú lời_nguyền người_sói ma_cà_rồng linh_hồn pháp_sư thầy_bói
			khổng_lồ thổ_địa tiên_nữ tiên_ông thợ_săn kẻ_trộm thủy_thủ đầu_bếp thám_tử nhà_thơ họa_sĩ chú_hề
			võ_sĩ vua nữ_hoàng hoàng_tử công_chúa hoàng_đế nông_dân phi_công kỹ_sư lính_cứu_hỏa cảnh_sát
			bác_sĩ y_tá thú_y giáo_viên học_sinh nhà_báo nhà_văn ca_sĩ diễn_viên đạo_diễn thợ_mộc thợ_may
			trọng_tài luật_sư kế_toán người_bán bồi_bàn tài_xế thợ_cắt_tóc đàn_piano ghi_ta trống chuông
			đàn_tranh bài_hát điệu_múa nhịp_điệu giai_điệu sáo kèn đàn_bầu sáo_trúc bản_nhạc nốt_nhạc
			buổi_diễn sân_khấu dân_ca dàn_nhạc song_ca chiêng điệp_khúc ca_khúc chợ thành_phố làng ngõ cầu
			vườn thư_viện bảo_tàng nhà_hát trường_học công_viên cảng nhà_ga sân_bay lâu_đài chùa đền tầng_hầm
			mái_nhà sân_vận_động bể_bơi vườn_thú bưu_điện ngân_hàng bệnh_viện hiệu_thuốc quán_cà_phê nhà_hàng
			bếp phòng_ngủ phòng_khách hành_lang cầu_thang ngã_tư nhà_thờ biệt_thự xóm nghĩa_trang quán_ăn
			khu_phố cơm mì phở bún bánh_mì bánh_bao bánh_chưng nem chả giò_lụa muối đường tiêu tỏi hành khoai
			cà_rốt dưa_chuột bí_đỏ rau_xà_lách nấm đậu_phụ trứng phô_mai bơ sữa_chua táo dâu nho dưa_hấu quýt
			chanh chuối xoài sô_cô_la kẹo bánh_quy bánh_ngọt bánh_kem mứt tương_ớt nước_mắm cháo xôi chè canh
			súp lẩu ngô cà_chua lê bưởi đậu_phộng bóng_đá bóng_rổ bóng_chuyền bóng_bàn quần_vợt cầu_lông bi_a
			bơi_lội thể_dục karate judo đấu_vật leo_núi nhảy_dây vợt khung_thành huy_chương cúp vô_địch
			chung_kết cổ_vũ luyện_tập chạy_bộ mũ_bảo_hiểm khởi_động cờ_vua cờ_tướng sân_bóng phạt_đền
			thẻ_vàng tỷ_số hòa chiến_thắng thất_bại kỷ_lục xe_đạp tàu_hỏa thuyền ô_tô xe_buýt taxi xe_tải
			xe_máy xe_ga máy_bay trực_thăng tên_lửa tàu_ngầm bè xe_tăng xe_ngựa xe_đẩy xe_cứu_hỏa xe_cảnh_sát
			cáp_treo tàu_điện dù xe_con cần_cẩu xe_đạp_điện ghe xe_rác xe_khách xe_ôm máy_tính bàn_phím
			màn_hình máy_in loa tai_nghe điện_thoại sạc pin điều_khiển tủ_lạnh máy_giặt máy_hút_bụi quạt_máy
			điều_hòa nồi_cơm_điện lò_vi_sóng lò_nướng máy_xay bàn_chải xà_phòng dầu_gội nước_hoa máy_sấy_tóc
			bóng_đèn ổ_cắm móc_áo tủ_áo giá_sách khăn_tắm vòi_nước ti_vi cân bàn_là thảm đèn_bàn bồn_tắm
			đỏ_thẫm hồng_đào vàng_chanh xanh_lá xanh_rêu xanh_ngọc xanh_lam xanh_biển xanh_da_trời chàm
			tím_than nâu_đất be xám_tro trắng_ngà đen_tuyền đỏ_gạch hồng_phấn tím_nhạt nâu_nhạt trắng_tinh
			đỏ_tươi vàng_tươi hồng_nhạt vàng_nhạt xanh_lục đỏ_cam hóa_đơn lãi_suất khoản_vay tiết_kiệm
			tài_khoản lương_hưu tiền_lương tiền_thưởng két_sắt chuyển_tiền sổ_tiết_kiệm trả_góp hợp_đồng thuế
			tiền_phạt tiền_cọc tiền_thuê kho_báu giàu_có nghèo_khó lỗ vốn tiền_lãi tiền_mặt bản_sao ảnh_chụp
			lệnh thư_mục khôi_phục bảng cột hàng nút đồ_thị danh_sách tập_hợp tiện_ích phiên_bản hồ_sơ
			sự_kiện tín_hiệu bộ_lọc nhãn_dán mây gió mưa tuyết sương_mù sương cầu_vồng hoàng_hôn sét sấm
			mưa_rào gió_mùa bão mưa_phùn mưa_lớn mưa_đá tia_nắng giọt_mưa nắng_nóng mây_đen thời_tiết khí_hậu
			nhiệt_độ độ_ẩm trời_mưa nắng_gắt bóng_râm chớp hạn_hán lũ_lụt sao mặt_trăng mặt_trời thiên_hà
			sao_chổi sao_băng dải_ngân_hà nhật_thực nguyệt_thực vũ_trụ hành_tinh vệ_tinh chòm_sao trọng_lực
			hố_đen hệ_mặt_trời trăng_khuyết trăng_tròn ánh_trăng sao_hỏa sao_kim sao_mộc tàu_vũ_trụ bình_minh
			mùa tương_lai ngày_lễ buổi_sáng buổi_trưa buổi_chiều buổi_tối ban_đêm nửa_đêm sáng_sớm hôm_qua
			hôm_nay ngày_mai ngày_kia hôm_kia quá_khứ hiện_tại thế_kỷ tuần_lễ cuối_tuần năm_nay năm_ngoái
			năm_sau mùa_xuân mùa_hè mùa_thu mùa_đông giao_thừa rằm sinh_nhật ngày_xưa thời_gian tuổi_trẻ
			bây_giờ sau_này phút giây giờ ngày_thường ngày_nghỉ can_đảm tò_mò lòng_biết_ơn kiên_nhẫn tình_bạn
			niềm_vui nỗi_buồn cơn_giận nỗi_sợ ngạc_nhiên hạnh_phúc sung_sướng an_ủi hy_vọng tuyệt_vọng
			tội_lỗi xấu_hổ tự_hào ghen_tuông tham_lam tình_cảm dịu_dàng ấm_áp tử_tế tin_tưởng nghi_ngờ
			lo_lắng bực_bội khó_chịu chán_nản háo_hức tự_tin khiêm_tốn bình_tĩnh tâm_trạng hối_hận đầu trán
			lông_mày lông_mi mũi má cằm hàm môi lưỡi răng lợi tai cổ gáy vai khuỷu_tay cổ_tay ngón_tay
			ngón_cái móng_tay ngực bụng rốn eo đùi đầu_gối gót ngón_chân móng_chân xương tim phổi gan dạ_dày
			thận ruột não máu thịt da tóc râu nước_mắt mồ_hôi nước_bọt hơi_thở sẹo cánh_tay nách mũ giày găng
			khăn_quàng kính_mắt dép_lê quần_áo áo_khoác áo_vest áo_sơ_mi áo_dài quần quần_bò quần_soóc váy
			váy_đầm áo_len tất đồ_lót đồ_ngủ cà_vạt thắt_lưng dây_lưng ủng đồng_phục nón_lá áo_mưa đồ_bơi
			áo_ấm tay_áo cổ_áo vải rìu xẻng cưa thang cờ_lê kìm thước_kẻ kéo búa máy_khoan cuốc liềm cào
			mỏ_lết tua_vít thước_dây com_pa xà_beng đòn_bẩy ròng_rọc cày lưỡi_dao bộ_dụng_cụ cà_phê trà_xanh
			nước_ép sữa nước nước_suối sữa_đậu_nành cà_phê_sữa cà_phê_đen nước_dừa nước_mía nước_chanh
			sinh_tố nước_ngọt trà_sữa trà_đá bia bia_hơi rượu_vang nước_khoáng sữa_tươi sữa_đặc nước_lọc
			nước_cam
		`),
		rare: words(`
			hải_ly thú_mỏ_vịt vượn_cáo khỉ_đầu_chó heo_vòi sóc_bay lửng gà_lôi đa_đa chim_cắt cá_tuyết
			ong_nghệ kỳ_giông mẹt nia đai_ốc vòng_đệm then_cài trâm_cài bấc khuy_bấm rừng_thưa phá eo_đất
			hố_sụt măng_đá gờ_đá bãi_bồi lãnh_nguyên đầm_phá bãi_lầy gành_đá vòng_gỗ nghệ_tây tần_bì du đoạn
			phong_lữ dạ_lan_hương tầm_ma kế linh_lan tử_đằng mã_não bạch_ngọc đá_thô vân_mẫu huỳnh_thạch
			sa_khoáng lá_bạc đá_phiến mạch_quặng ngọc_đen đá_mắt_mèo đá_mặt_trăng ngọc_lam san_hô_đỏ vonfram
			coban mangan liti ngọc_bội đá_sa_thạch đá_phiến_sét đá_bọt muối_mỏ đá_bùn hải_trình chiều_kích
			học_thuyết tiên_đề tiền_đề diễn_dịch quy_nạp loại_suy tự_sự biên_niên chứng_ngôn giao_ước luận_đề
			mỹ_học ngữ_nghĩa xác_tín bản_thể thánh_thú thần_thú sấm_truyền kết_giới phong_ấn hắc_long
			bạch_long chu_tước huyền_vũ cửu_vĩ_hồ hình_nhân quỷ_lùn tinh_linh hải_thần lôi_thần phong_thần
			thiên_mã hải_quái thần_điểu hiền_giả yêu_nữ sách_phép chén_thánh trượng vương_trượng bạch_xà
			thanh_xà linh_thú nhà_giả_kim mục_đồng phu_xe hoa_tiêu thầy_tế thị_nữ thợ_kính nhà_thực_vật
			văn_thư thợ_xay thợ_thùng đàn_viola chũm_chọe trống_lắc mộc_cầm phong_cầm khẩu_cầm âm_giai
			khúc_kết âm_sắc nhịp_phách chương_nhạc khúc_mở_màn dạ_khúc tụng_ca cầu_hồn_khúc tứ_tấu ngũ_tấu
			quãng_tám bán_âm tổng_phổ máy_nhịp đại_hồ_cầm kèn_trombone kèn_tuba kèn_túi đàn_cầm sáo_mèo
			đàn_tỳ_bà đàn_tam đối_âm luyến_âm thánh_thi trường_độ đàn_sến kèn_lá thành_lũy hào nhà_nguyện am
			cầu_dẫn lúa_mạch_đen đậu_lăng đậu_gà mộc_qua kiếm_đạo xà_kép cú_móc ván_nhún ngựa_gỗ xe_ủi_tuyết
			tàu_một_ray tàu_hai_thân tàu_phá_băng tàu_thăm_dò tàu_đổ_bộ xe_một_bánh xe_tưới_nước tàu_lặn
			toa_giường xe_thổ_mộ xe_trộn tàu_hộ_tống tàu_khu_trục thuyền_nan máy_ảnh_web áo_tắm_dài bạc_kim
			đỏ_ruby màu_lục_bảo lục_nhạt màu_ngọc_lam màu_hổ_phách lam_biếc tím_biếc bạc_xám lục_thẫm
			chàm_đen huyết_dụ sổ_cái nợ_phải_trả thặng_dư lợi_suất thấu_chi thanh_khoản vòng_quay sổ_quỹ
			văn_tự hối_phiếu hạn_ngạch bộ_đệm gói_tin hàng_đợi ngăn_xếp phần_sụn sổ_đăng_ký mạng_con tên_máy
			mã_kiểm_tra lược_đồ cụm_máy phân_mảnh vùng_chứa hộp_cát kho_mã trình_gỡ_lỗi mã_máy ngắt thanh_ghi
			tốc_độ_bit thông_lượng điểm_cuối băm kết_xuất bộ_tô_bóng khung_dây khung_nhìn bộ_đệm_khung
			tám_bit đường_lên đường_xuống định_tuyến chuyển_mạch hệ_thống_tệp liên_kết_mềm di_trú bản_dựng
			gói_cài kho_lệnh khí_áp sương_sa quầng_trăng ráng_chiều gió_chướng mưa_ngâu_dài thiên_đỉnh
			nhật_hoa gió_mặt_trời liên_sao định_tinh thiên_cầu thị_sai parsec thiên_để phương_vị cận_nhật
			viễn_nhật quang_cầu sắc_cầu tầng_điện_ly vành_đai_sao đĩa_sao lỗ_sâu sao_siêu_mới sát_na
			chính_ngọ tiết_khí lập_hạ lập_thu lập_đông thiên_thu niên_đại tuần_trăng trắc_ẩn kính_sợ
			can_trường sầu_muộn tủi_hờn sùng_kính độ_lượng hoan_hỉ mao_mạch hầu cơ_hoành xương_ức xương_bả
			khung_chậu xương_chày xương_mác khoeo mống_mắt lưỡi_gà áo_tơi áo_leo_núi áo_đuôi_tôm áo_lễ
			áo_chẽn xà_cạp áo_nịt mũ_ba_góc mũ_trụ dải_viền ống_bễ ê_tô thước_cặp dây_mực mai thoi cưa_lọng
			cưa_vòng máy_chà_nhám mũi_vạch thước_vuông ke_góc bàn_thợ giũa_thô thước_vạch dây_dọi khuôn_dập
			đá_ráp rìu_tay dao_bào dùi_đục mỏ_cặp cưa_cắt bàn_kẹp trà_lúa_mạch rượu_táo rượu_sim nước_nhãn
		`)
	},
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
