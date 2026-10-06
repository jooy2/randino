import { words } from '../../_internal/parse.js';
import type { OrganizationLanguageData } from './types.js';

export const KO: OrganizationLanguageData = {
	// Mostly native Korean words, the kind a school, a firm and a foundation all
	// borrow. Any one of them can name a small business or a school somewhere;
	// what is left out is every name a well-known company already carries (한빛,
	// 한솔, 하나, 우리, 미래, 청솔).
	stems: words(`
		가람 나린 다온 마루 미리내 바름 새솔 소담 솔내 아라 여울 윤슬 이든 자람 한결
		해솔 해오름 푸른솔 늘해랑 별하 비나리 단미 도담 들꽃 물빛 산들 솔길 은빛 초롱
		하랑 한별 해든 혜윰 너울 다솔 맑은샘 봄내 새움 아름드리 은결
	`),
	syn: {
		kind: 'pool',
		// Without 한, 나, 대, 동, 라, 서 or 진, so that two of them drawn at random do not
		// spell a well-known company (한솔, 하나, 대한, 동아, 라온, 서울, 유진).
		pool: words(`
			가 다 마 바 사 아 자 하 온 솔 빛 결 람 윤 은 별 해 늘 새 슬 담 든 루 린 봄 울
			초 휘 연 채 율 겸 누 여 예 유 지
		`),
		joiner: '',
		minSyllables: 2,
		maxSyllables: 2
	},
	industries: {
		tech: words('테크 소프트 시스템 정보통신 네트웍스 랩스 데이터 전자'),
		manufacturing: words('정밀 기계 화학 금속 공업 소재 산업기계'),
		food: words('식품 푸드 제과 농산 수산 베이커리 유업'),
		retail: words('유통 상사 리테일 마트 무역 상회'),
		finance: words('캐피탈 투자 자산운용 인베스트먼트 파트너스 보험'),
		construction: words('건설 건축 엔지니어링 개발 종합건설 하우징'),
		logistics: words('물류 운송 해운 익스프레스 로지스틱스 택배'),
		media: words('미디어 엔터테인먼트 출판 스튜디오 커뮤니케이션즈 프로덕션'),
		health: words('제약 바이오 메디칼 헬스케어 약품 의료기'),
		energy: words('에너지 전력 솔라 가스 발전 그린에너지')
	},
	generic: words('산업 그룹 홀딩스 인터내셔널 글로벌'),
	templates: {
		company: ['{stem}{industry}'],
		school: [
			'{stem}유치원',
			'{stem}초등학교',
			'{stem}중학교',
			'{stem}고등학교',
			'{stem}여자중학교',
			'{stem}여자고등학교',
			'{stem}외국어고등학교',
			'{stem}예술고등학교',
			'{stem}대학',
			'{stem}대학교'
		],
		government: [
			'{stem}시청',
			'{stem}구청',
			'{stem}군청',
			'{stem}경찰서',
			'{stem}소방서',
			'{stem}세무서',
			'{stem}동 행정복지센터',
			'{stem}지방법원',
			'{stem}교육지원청',
			'{stem}보건소'
		],
		public: [
			'{stem}도시공사',
			'{stem}교통공사',
			'{stem}시설관리공단',
			'{stem}산업진흥원',
			'{stem}연구원',
			'{stem}시립도서관',
			'{stem}박물관',
			'{stem}미술관',
			'{stem}의료원',
			'{stem}종합사회복지관'
		],
		nonprofit: [
			'{stem}재단',
			'{stem}장학재단',
			'{stem}문화재단',
			'{stem}협회',
			'{stem}복지회',
			'{stem}봉사단',
			'{stem}연합회',
			'{stem}청년회',
			'{stem}보존회'
		]
	},
	legalForms: ['주식회사 {name}', '{name} 주식회사', '(주){name}', '{name}(주)', '유한회사 {name}']
};
