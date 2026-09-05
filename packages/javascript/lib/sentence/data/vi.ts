import { words } from '../../_internal/parse.js';
import type { SentenceLanguageData } from './types.js';

export const VI: SentenceLanguageData = {
	space: ' ',
	capitalize: true,
	terminators: { statement: '.', question: '?', exclamation: '!', trailing: '…' },
	quotes: { double: ['“', '”'], single: ['‘', '’'] },
	// Vietnamese inflects nothing, so a verb is written once and stands wherever
	// Vietnamese puts the classifier in front of the noun and the number in front
	// of that, so the whole group reads `12 con mèo`.
	numeral: {
		order: 'before',
		counters: {
			creature: 'con',
			person: 'người',
			plant: 'cây',
			edible: 'cái',
			thing: 'cái',
			vehicle: 'chiếc',
			place: 'nơi',
			event: 'lần',
			idea: 'điều',
			body: 'cái'
		},
		count: [2, 12],
		currency: 'đồng',
		amounts: [10000, 50000, 100000, 200000, 500000, 1000000, 5000000],
		group: '.',
		gap: ' '
	},
	// it is put.
	verbs: [
		{
			subject: ['creature', 'person'],
			words: words(`
				chạy đi_bộ nhảy bơi bay bò trở_về rời_đi dừng_lại nghỉ_ngơi ngủ cười khóc hát
				nhảy_múa trốn chờ đứng ngồi lăn lang_thang đi_qua đến_gần lắng_nghe
			`)
		},
		{
			subject: ['creature', 'person'],
			object: ['edible'],
			words: words(`ăn uống nhai nếm nướng hâm_nóng`)
		},
		{
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`nhìn tìm nhặt mang chạm giữ chọn di_chuyển thu_thập`)
		},
		{
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(`làm sửa lau bán mua xây`)
		},
		{
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			words: words(`nhớ quên tưởng_tượng đếm`)
		},
		{
			subject: ['place', 'event'],
			words: words(`tỏa_sáng chảy tối_dần sáng_lên sâu_thêm lặng_đi`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`lung_lay lấp_lánh rơi lăn nghiêng cũ_đi`)
		},
		{
			subject: ['vehicle'],
			words: words(`chạy dừng_lại đi_qua trở_về khởi_hành trượt`)
		},
		{
			subject: ['idea', 'event'],
			words: words(`lan_ra biến_mất còn_lại trôi đậm_thêm`)
		},
		{
			subject: ['plant'],
			words: words(`mọc héo nở đung_đưa vươn_lên`)
		},
		{
			subject: ['body'],
			words: words(`run động tê cứng_lại`)
		},
		{
			subject: ['edible'],
			words: words(`chín nguội sôi tan hỏng`)
		}
	],
	states: [
		{
			subject: ['creature', 'person'],
			words: words(
				`to nhỏ nhanh chậm im_lặng ồn_ào dũng_cảm lười bận đói buồn_ngủ dữ hiền thông_minh`
			)
		},
		{
			subject: [
				'creature',
				'person',
				'plant',
				'edible',
				'thing',
				'vehicle',
				'place',
				'event',
				'idea',
				'body'
			],
			words: words(`đẹp lạ mới phổ_biến hiếm`)
		},
		{
			subject: ['place', 'event'],
			words: words(`rộng hẹp yên_tĩnh sâu tối sáng xa dốc`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`cứng nhẹ nặng cũ trơn trong_suốt chắc`)
		},
		{
			subject: ['edible'],
			words: words(`ngọt mặn cay chua nóng lạnh bùi`)
		},
		{
			subject: ['idea'],
			words: words(`đơn_giản rõ_ràng mơ_hồ vĩnh_cửu thoáng_qua`)
		},
		{
			subject: ['plant'],
			words: words(`xanh um_tùm thơm héo_úa`)
		},
		{
			subject: ['body'],
			words: words(`ấm lạnh đau cứng`)
		}
	],
	manners: words(`
		lặng_lẽ chậm_rãi nhanh_chóng nhẹ_nhàng đột_nhiên khẽ lại cùng_nhau một_mình một_lát đều_đặn
		mạnh_mẽ cẩn_thận háo_hức từ_từ vội_vã êm_ái chăm_chú thản_nhiên vui_vẻ bình_thản hối_hả
		kiên_nhẫn thong_thả
	`),
	times: words(`
		lúc_bình_minh vào_buổi_sáng vào_buổi_trưa vào_buổi_chiều vào_ban_đêm hôm_nay hôm_qua ngày_mai
		vào_mùa_xuân vào_mùa_hè vào_mùa_thu vào_mùa_đông vào_cuối_tuần vừa_rồi đôi_khi mỗi_ngày
		lúc_hoàng_hôn lúc_nửa_đêm vào_giữa_trưa tuần_trước tuần_sau dạo_này ngày_xưa vào_ngày_lễ cả_ngày
		mỗi_tối
	`),
	connectives: {
		additive: words(`ngoài_ra`),
		temporal: words(`rồi và_rồi sau_đó cuối_cùng sau_cùng thế_rồi đồng_thời`),
		contrastive: words(`nhưng tuy_vậy tuy_nhiên dù_vậy`),
		causal: words(`thế_là vì_thế rốt_cuộc`)
	},
	interjections: words(`
		ôi, chà, ồ, trời_ơi, chao_ôi, này, thật_đấy, ái_chà, ê, ơ_kìa, khiếp, ối,
	`),
	pronouns: { n: ['', 'nó'] },
	pronounless: ['person'],
	// Vietnamese writes a date smallest to largest, with a word in front of every
	// part, and its copula as a word of its own.
	calendar: {
		date: 'ngày D tháng M năm Y',
		clock: 'h giờ mm',
		years: [2020, 2030],
		copula: {
			// An event is a thing that happens on a day, and a lion is not.
			subject: ['event'],
			words: words(`là`)
		}
	},
	frames: [
		// A date and a clock, standing where an adverbial stands.
		{
			parts: [
				{ slot: 'date', head: 'vào', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		{
			parts: [
				{ slot: 'clock', head: 'lúc', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		// And the shape that equates the subject to one: `Trận đấu là 11 giờ 40.`
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'date', copula: 'head' }
			],
			weight: 4
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'clock', copula: 'head' }
			],
			weight: 4
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }],
			weight: 20
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true }
			],
			weight: 18
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'place', head: 'trong', modifiable: true }
			],
			weight: 14
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', head: 'rất' }
			],
			weight: 12
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }, { slot: 'manner' }],
			weight: 10
		},
		{
			parts: [{ slot: 'time', tail: ',' }, { slot: 'subject', modifiable: true }, { slot: 'verb' }],
			weight: 8
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true },
				{ slot: 'place', head: 'trong', modifiable: true }
			],
			weight: 7
		},
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'place', head: 'trong', modifiable: true }
			],
			weight: 6
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true },
				{ slot: 'manner' }
			],
			weight: 5
		},
		// Vietnamese wraps the predicate: có in front of it, không after the clause.
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb', head: 'có' }
			],
			weight: 20,
			mood: 'question',
			tag: 'không'
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb', head: 'có' },
				{ slot: 'object', modifiable: true }
			],
			weight: 16,
			mood: 'question',
			tag: 'không'
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'state', head: 'có' }
			],
			weight: 14,
			mood: 'question',
			tag: 'không'
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }, { slot: 'quantity' }],
			weight: 6
		},
		{
			parts: [{ slot: 'quantity' }, { slot: 'verb' }],
			weight: 5
		},
		{
			parts: [{ slot: 'subject', modifiable: true }, { slot: 'verb' }, { slot: 'money' }],
			weight: 5
		}
	]
};
