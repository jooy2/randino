import { romanMap, words } from './parse.js';
import type { NameLanguageData } from './types.js';

// Conventional romanization of the surnames below. Anything missing (including a
// syllable passed through `startsWith`) falls back to Revised Romanization.
export const KO_SURNAME_ROMAN: Record<string, string> = romanMap(`
	김:Kim 이:Lee 박:Park 최:Choi 정:Jung 강:Kang 조:Cho 윤:Yoon 장:Jang 임:Lim 한:Han
	오:Oh 서:Seo 신:Shin 권:Kwon 황:Hwang 안:Ahn 송:Song 류:Ryu 전:Jeon 홍:Hong 고:Ko
	문:Moon 양:Yang 손:Son 배:Bae 백:Baek 허:Heo 유:Yoo 남:Nam 심:Shim 노:Noh 하:Ha
	곽:Kwak 성:Sung 차:Cha 주:Joo 우:Woo 구:Koo 나:Na 민:Min 진:Jin 지:Ji 엄:Um 채:Chae
	원:Won 천:Chun 방:Bang 공:Kong 현:Hyun 함:Ham 변:Byun 염:Yeom 여:Yeo 추:Chu 도:Do
	소:So 석:Seok 선:Sun 마:Ma
`);

export const KO: NameLanguageData = {
	order: 'family-first',
	joiner: '',
	hasMiddle: false,
	roman: 'hangul',
	lengthSpec: { given: [2, 2], last: [1, 1], middle: [0, 0] },
	// Weighted to reality: two-syllable given names dominate, one- and
	// three-syllable ones are the exception.
	givenLenWeights: { 1: 4, 2: 92, 3: 4 },
	last: words(`
		김 이 박 최 정 강 조 윤 장 임 한 오 서 신 권 황 안 송 류 전 홍 고 문 양 손 배 백
		허 유 남 심 노 하 곽 성 차 주 우 구 나 민 진 지 엄 채 원 천 방 공 현 함 변 염 여
		추 도 소 석 선 마
	`),
	givenMale: words(`
		민준 서준 도윤 예준 시우 하준 주원 지호 지후 준우 준서 건우 현우 우진 선우 서진
		연우 유준 정우 승우 승현 시윤 지훈 진우 지환 수현 시현 동현 예성 재윤 은우 유찬
		이준 시온 재원 한결 태윤 승민 준혁 성민 지안 강민 재훈 민성 규민 도현 민재 재민
		성현 우성 태현 지성 준호 현준 형준 성준 정민 상현 진호 성호 종민 태호 재현 상우
		준영 동욱 정훈 영호 창민 대현 기현 승준 민수 영수 상민 경민 동주 승호 원준 호준
		세훈 지완 태민 정현 민혁 준수 상준 세준 이안 시원 재하 성우 동민 우빈 태우 진혁
		준현 성찬 예찬 은찬 도훈 시후 현수 정호 민호 종현 재준 우현 승재 태경 성재 규현
		동혁 상혁 인우 도영 하진 은성 재영 광수 종석 인호 승기 우재 지웅 다온 하람 준 현
		훈 빈 찬 진 결 온 솔 강 산 담 별 건
	`),
	givenFemale: words(`
		서연 서윤 지우 하은 하윤 민서 지유 윤서 채원 수아 지아 지안 다은 은서 예은 수빈
		소율 예린 지원 아린 서아 예원 유진 시은 하린 예진 지민 수연 유나 나윤 서영 은지
		지현 채은 서현 유주 지율 소은 나은 하영 다인 시아 연우 지수 가은 소연 세아 은채
		채영 다연 유빈 하늘 예서 소윤 서하 유하 다현 은하 아연 세은 채아 하연 나연 정연
		수현 예나 서인 지혜 아름 슬기 보라 유리 하나 다솜 영희 미영 은영 정희 지영 현정
		은주 미경 수진 혜진 경미 선영 소영 은정 미선 예지 승희 현주 은경 유정 소미 아윤
		서율 도연 세연 지선 은수 채린 다희 시연 예솔 나현 주하 서희 민지 수민 지은 혜원
		다빈 유은 하진 소희 예빈 태연 나래 미주 솔 별 봄 온 결 린 슬 담 진 윤
	`),
	firstMale: words(`
		민 서 준 도 예 시 하 지 현 우 건 선 유 정 승 태 재 성 동 진 상 영 수 주 강 규 인
		경 한 세 원 찬 은 광 종 창 기 병 대 호
	`),
	restMale: words(`
		준 우 훈 호 윤 혁 원 재 민 현 수 진 석 철 규 빈 성 한 찬 열 영 헌 겸 익 록 담 결 완
	`),
	firstFemale: words(`
		서 지 하 민 윤 채 수 예 다 은 소 유 시 아 나 가 정 미 주 세 혜 리 보 승 연 도 한 라
	`),
	restFemale: words(`
		연 윤 우 은 서 유 아 원 율 린 빈 진 하 영 지 희 나 슬 미 경 정 담 별
	`)
};
