import { words } from '../../../_internal/parse.js';
import type { WordModifierData } from '../types.js';

// What `randModifier` needs of the language, apart from its nouns: the modifiers,
// how they agree, and the shapes they sit in. `vi.ts` spreads it into the whole
// dataset.
export const VI_MODIFIERS: WordModifierData = {
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
