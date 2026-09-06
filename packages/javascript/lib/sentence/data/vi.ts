import { words } from '../../_internal/parse.js';
import type { SentenceLanguageData } from './types.js';

export const VI: SentenceLanguageData = {
	space: ' ',
	capitalize: true,
	terminators: { statement: '.', question: '?', exclamation: '!', trailing: '…' },
	quotes: { double: ['“', '”'], single: ['‘', '’'] },
	// Vietnamese marks the past beside the verb rather than on it: `con mèo đã
	// chạy`. A state takes no mark.
	pastMark: { head: 'đã' },
	// Vietnamese inflects nothing, so a verb is written once and stands wherever
	// it is put.
	verbs: [
		{
			field: 'rise',
			subject: ['creature', 'person'],
			words: words(`thức_dậy tỉnh_giấc đứng_lên ngồi_dậy`)
		},
		// Setting off: the verbs that need somewhere to go, and the ones that stand
		// on their own. `đi đến chợ`, and `về nhà` with nothing between.
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			words: words(`đi hướng lên_đường`)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			// Running somewhere is for legs: a fish and a snake go, and do not run.
			subjectWithout: ['swimmer', 'crawler'],
			words: words(`chạy rảo_bước`)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			words: words(`rời_đi khởi_hành ra_đi ra_ngoài`)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			requires: 'destination',
			words: words(`trở_về về_đến tới đến về_tới`)
		},
		{ field: 'arrive', subject: ['creature', 'person'], words: words(`quay_về trở_lại về_nhà`) },
		{
			field: 'move',
			subject: ['creature', 'person'],
			// Running and walking are for legs: a fish and a snake do neither.
			subjectWithout: ['swimmer', 'crawler'],
			words: words(`chạy đi_bộ nhảy dạo_chơi đi_dạo`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			words: words(`lang_thang đi_qua`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A fish's, a whale's and a mermaid's; a lion does not swim here.
			subjectTraits: ['swimmer'],
			words: words(`bơi`)
		},
		{
			field: 'move',
			// Flying is a flier's alone: a sparrow's, a dragon's, never a fish's.
			subject: ['creature'],
			subjectTraits: ['flier'],
			words: words(`bay`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A snake's, a snail's and a beetle's.
			subjectTraits: ['crawler'],
			words: words(`bò`)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			words: words(`chờ trốn nhìn_quanh ngập_ngừng dừng_lại đứng_yên`)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			words: words(`nghỉ_ngơi ngồi nằm tựa cuộn_mình ngả_lưng`)
		},
		{
			field: 'sleep',
			subject: ['creature', 'person'],
			words: words(`ngủ thiếp_đi chợp_mắt ngủ_say`)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			words: words(`cười khóc ngáp thở_dài mỉm_cười ngâm_nga lầm_bầm la_lên`)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			words: words(`nhảy_múa hát lăn_lộn nô_đùa tung_tăng vui_chơi`)
		},
		{
			field: 'think',
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			words: words(`nhớ quên tưởng_tượng đếm nhớ_lại nhớ_về`)
		},
		{
			field: 'look',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`nhìn ngắm ngó xem_xét chạm vuốt_ve săm_soi`)
		},
		{
			field: 'search',
			subject: ['creature', 'person'],
			words: words(`tìm_kiếm lục_lọi tìm_quanh sục_sạo`)
		},
		{
			field: 'find',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`tìm_thấy phát_hiện nhặt_được tìm_ra`)
		},
		{
			field: 'take',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`chọn cầm nắm lấy nhặt nhận`)
		},
		{
			field: 'carry',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`mang đem_về khiêng ôm mang_về`)
		},
		{
			field: 'hide',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			words: words(`giấu cất giữ chôn cất_kỹ`)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(`làm xây chạm_khắc vẽ đan lắp_ráp`)
		},
		{
			field: 'tend',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(`sửa lau đánh_bóng chỉnh_sửa sắp_xếp tu_sửa`)
		},
		{
			field: 'sell',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			words: words(`bán bán_đi trao nhượng_lại`)
		},
		{
			field: 'buy',
			subject: ['person'],
			object: ['thing', 'vehicle', 'edible'],
			words: words(`mua mua_về sắm đặt_mua`)
		},
		{
			field: 'cook',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			words: words(`nướng hâm_nóng nấu chế_biến thái bày`)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			words: words(`ăn nhai nếm gặm ăn_hết`)
		},
		{
			field: 'drink',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['drink'],
			words: words(`uống nhấp uống_cạn thưởng_thức`)
		},
		{
			field: 'change',
			subject: ['place'],
			words: words(`yên_tĩnh_lại tối_dần sáng_lên đông_vui_lên lặng_đi rực_sáng`)
		},
		{
			field: 'change',
			subject: ['event'],
			words: words(`tỏa_sáng chảy sâu_thêm bắt_đầu kết_thúc kéo_dài trôi_qua`)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			words: words(`lung_lay lấp_lánh rơi lăn nghiêng cũ_đi`)
		},
		{
			field: 'move',
			subject: ['vehicle'],
			words: words(`chạy dừng_lại đi_qua trở_về khởi_hành trượt`)
		},
		{
			field: 'change',
			subject: ['idea', 'event'],
			words: words(`lan_ra biến_mất còn_lại trôi đậm_thêm`)
		},
		{ field: 'change', subject: ['plant'], words: words(`mọc héo nở đung_đưa vươn_lên`) },
		{ field: 'change', subject: ['body'], words: words(`run động tê cứng_lại`) },
		{ field: 'change', subject: ['edible'], words: words(`chín nguội sôi tan hỏng`) }
	],
	states: [
		{
			subject: ['creature', 'person'],
			words: words(`to nhỏ nhanh chậm im_lặng ồn_ào dũng_cảm lười bận dữ hiền thông_minh`)
		},
		{ subject: ['creature', 'person'], condition: 'hungry', words: words(`đói đói_bụng`) },
		{ subject: ['creature', 'person'], condition: 'full', words: words(`no no_nê`) },
		{
			subject: ['creature', 'person'],
			condition: 'tired',
			words: words(`mệt buồn_ngủ mệt_mỏi uể_oải`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'rested',
			words: words(`sảng_khoái khoan_khoái tràn_đầy_sức_sống`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'content',
			words: words(`vui hạnh_phúc hài_lòng vui_vẻ thoải_mái`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'restless',
			words: words(`buồn_chán tò_mò bồn_chồn lo_lắng`)
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
	// Vietnamese puts the modifier after its noun, which the word frames already
	// say; these are the ones a sentence may use, by what they describe.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(`
				dũng_cảm hiền_lành chăm_chỉ lười_biếng nhút_nhát thông_minh trẻ già nhỏ to hoạt_bát thong_thả nhanh_nhẹn hiếu_kỳ
			`)
		},
		{ subject: ['person'], words: words(`trẻ tốt_bụng nghiêm_khắc nghiêm_túc bận_rộn tận_tâm`) },
		{ subject: ['creature'], words: words(`nhanh_nhẹn hung_dữ hiền nhỏ_bé mập_mạp`) },
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(`ngọt cay ấm tươi giòn thơm nóng mặn mềm chín ngon_lành`)
		},
		{ subject: ['edible'], themes: ['drink'], words: words(`ngọt ấm lạnh mát nóng thơm tươi đậm`) },
		{
			subject: ['thing', 'vehicle'],
			words: words(`cũ mới nhỏ to nhẹ nặng sáng_bóng nhẵn trong_suốt cứng đẹp quý cổ`)
		},
		{ subject: ['vehicle'], words: words(`nhanh chậm chắc_chắn`) },
		{
			subject: ['place'],
			words: words(
				`yên_tĩnh rộng tối sáng lạ cũ ấm_cúng vắng_vẻ đông_đúc xa gần trống_trải hiu_quạnh đầy_nắng`
			)
		},
		{ subject: ['plant'], words: words(`xanh um_tùm thơm non héo cao nhỏ tươi`) },
		{ subject: ['idea'], words: words(`mờ_nhạt cũ mới lạ rõ_ràng quý_giá nhỏ kỳ_lạ`) },
		{ subject: ['event'], words: words(`dài ngắn yên_ả nắng âm_u ồn_ào bất_ngờ`) },
		{ subject: ['body'], words: words(`nhỏ lạnh ấm mảnh_mai khỏe`) },
		{
			subject: [
				'creature',
				'person',
				'plant',
				'thing',
				'vehicle',
				'place',
				'event',
				'idea',
				'body'
			],
			words: words(`đẹp bí_ẩn lạ mới`)
		}
	],
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				lặng_lẽ chậm_rãi nhanh_chóng nhẹ_nhàng khẽ một_mình một_lát mạnh_mẽ cẩn_thận háo_hức từ_từ vội_vã
				êm_ái chăm_chú thản_nhiên vui_vẻ bình_thản hối_hả kiên_nhẫn thong_thả hớn_hở
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(
				`lặng_lẽ chậm_rãi từ_từ đột_nhiên khẽ lại đều_đặn dần_dần vẫn mãi nhẹ_nhàng chầm_chậm dần`
			)
		}
	],
	times: {
		day: words(`
			lúc_bình_minh sáng_sớm vào_buổi_sáng gần_trưa vào_buổi_trưa vào_buổi_chiều lúc_hoàng_hôn
			vào_buổi_tối vào_ban_đêm đêm_khuya lúc_nửa_đêm
		`),
		any: words(
			`vào_mùa_xuân vào_mùa_hè vào_mùa_thu vào_mùa_đông vào_cuối_tuần vào_ngày_lễ cả_ngày`
		),
		past: words(`hôm_qua tuần_trước ngày_xưa hôm_ấy đêm_qua`),
		present: words(`hôm_nay vừa_rồi ngày_mai tuần_sau`),
		habitual: words(`dạo_này đôi_khi mỗi_ngày mỗi_tối`)
	},
	homes: words(`nhà`),
	// Two clauses are joined on rồi: `Con mèo về đến nhà rồi ăn táo.`
	join: { word: 'rồi' },
	connectives: {
		additive: words(`ngoài_ra hơn_nữa`),
		temporal: words(`rồi và_rồi sau_đó cuối_cùng sau_cùng thế_rồi đồng_thời lát_sau`),
		contrastive: words(`nhưng tuy_vậy tuy_nhiên dù_vậy`),
		causal: words(`thế_là vì_thế rốt_cuộc`)
	},
	// What a noun can do that its theme does not say. A noun listed nowhere has no
	// trait, and takes any verb that asks for none.
	traits: {
		flier: words(`
		chim én sẻ quạ chim_ưng đại_bàng công vẹt cú bồ_câu hạc thiên_nga vịt ngỗng bướm ong chuồn_chuồn ve muỗi
		ruồi dơi
		rồng phượng_hoàng tiên thiên_thần hắc_long bạch_long thanh_long chu_tước chim_lửa thiên_mã thần_điểu tinh_linh
		`),
		swimmer: words(`
		cá_sấu rùa ếch cóc cá cá_voi cá_heo cá_mập mực bạch_tuộc tôm cua sứa hải_cẩu cá_chép lươn
		người_cá mỹ_nhân_ngư hải_quái
		`),
		crawler: words(`
		cá_sấu rắn thằn_lằn rùa ốc kiến nhện giun sâu tằm cua bọ_ngựa
		`)
	},
	interjections: words(`
		ôi, chà, ồ, trời_ơi, chao_ôi, này, thật_đấy, ái_chà, ê, ơ_kìa, khiếp, ối,
	`),
	pronouns: { n: ['', 'nó'] },
	// And an object it has named is left out the next time: `nấu rồi ăn`.
	objectPronouns: { words: { n: [''] } },
	// A line of the hero's own opens on tôi.
	speech: { subject: 'Tôi' },
	// nó is a thing, and rude of a person: a person is referred to by leaving the
	// subject out. An animal may be nó.
	pronounless: ['person'],
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
		// Where the subject is going, on đến, and where it arrives, with nothing
		// between the verb and the place: `đi đến chợ`, `về đến nhà`.
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'đến', modifiable: true }
			],
			weight: 8,
			fields: ['go']
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', modifiable: true }
			],
			weight: 8,
			fields: ['arrive']
		},
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', head: 'đến', modifiable: true }
			],
			weight: 4,
			fields: ['go']
		},
		{
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'destination', modifiable: true },
				{ slot: 'manner' }
			],
			weight: 3,
			fields: ['arrive']
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
		{
			parts: [
				{ slot: 'time', tail: ',' },
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb' },
				{ slot: 'object', modifiable: true }
			],
			weight: 4
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
			parts: [
				{ slot: 'subject', modifiable: true },
				{ slot: 'verb', head: 'có' },
				{ slot: 'destination', head: 'đến', modifiable: true }
			],
			weight: 6,
			mood: 'question',
			tag: 'không',
			fields: ['go']
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
