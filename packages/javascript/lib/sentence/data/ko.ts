import { conjugate, words } from '../../_internal/parse.js';
import type { WordPool } from '../../word/data/types.js';
import type { PredicateTense, SentenceLanguageData } from './types.js';

// Every Korean past form is one stem and one ending: `달렸` closes on `ㅆ`, and
// so does every other past stem, so `다`, `니`, `구나`, `어요` and `습니다` attach
// to all of them alike. The stems are written per group and the endings once.
const PAST = {
	statement: '다',
	question: '니|나|는가',
	exclamation: '구나|네|군',
	casual: '어',
	casualQuestion: '어|지',
	polite: '어요',
	politeQuestion: '어요|죠',
	formal: '습니다',
	formalQuestion: '습니까'
};

// Every Korean form is one stem and one ending, and the endings do not change
// from verb to verb: what changes is the stem in front of them — whether it
// closes on a consonant (`먹` takes `는다`, `달리` takes `ㄴ다`), whether that
// consonant is `ㄹ`, which drops in front of `ㄴ`, `ㅂ` and `는` (`놀다` is
// `논다`, `노니`, `놉니다`), and what the irregular ones do in front of a vowel
// (`걷다` is `걸어`, `굽다` is `구워`, `이르다` is `이르러`). The vowel form is the
// one that cannot be derived, so a verb is written as its stem and its 해체
// form — `달리:달려`, `걷:걸어` — and every other form is spelt out of the two.
// The past is that 해체 form closed on `ㅆ`, which is why `conjugate` takes it
// as a stem.

const HANGUL_BASE = 0xac00;
const FINAL_N = 4;
const FINAL_L = 8;
const FINAL_B = 17;
const FINAL_SS = 20;

/** The final consonant of a word's last syllable, as its jamo index; 0 for none. */
function finalOf(word: string): number {
	const code = word.charCodeAt(word.length - 1) - HANGUL_BASE;

	return code >= 0 && code < 11172 ? code % 28 : 0;
}

/** The word with its last syllable's final consonant replaced. */
function closeOn(word: string, final: number): string {
	const code = word.charCodeAt(word.length - 1) - HANGUL_BASE;

	return word.slice(0, -1) + String.fromCharCode(HANGUL_BASE + code - (code % 28) + final);
}

/** The stem with a closing `ㄹ` dropped: `놀` is `노` in front of `ㄴ`, `ㅂ` and `는`. */
function dropL(stem: string): string {
	return finalOf(stem) === FINAL_L ? closeOn(stem, 0) : stem;
}

/** Every alternative of one ending, attached to one base. */
function attach(base: string, endings: string): string {
	return endings
		.split('|')
		.map((ending) => base + ending)
		.join('|');
}

/**
 * A verb group's every form out of `stem:해체` pairs — `달리:달려 걷:걸어`. A
 * verb that is a step leading on to the next (rising, setting off, sitting
 * down) writes `서` as a third field, and its linking form is then `-서|-고`
 * rather than `-고` alone: `일어나서 … `, where `달리고 …` is all running does.
 */
function koVerbs(entries: string): {
	words: WordPool;
	forms: Record<
		| 'question'
		| 'exclamation'
		| 'casual'
		| 'casualQuestion'
		| 'polite'
		| 'politeQuestion'
		| 'formal'
		| 'formalQuestion'
		| 'linking',
		WordPool
	>;
	past: PredicateTense;
} {
	const pairs = words(entries).map((entry) => entry.split(':') as [string, string, string?]);
	const stems = pairs.map(([stem]) => stem);
	const casual = pairs.map(([, form]) => form);
	const leads = pairs.map(([, , then]) => then === '서');
	const bases = stems.map(dropL);
	// `먹는다` and `달린다`: a stem closing on a consonant other than `ㄹ` takes the
	// ending with `는` and `습` in it, and every other one closes on `ㄴ` and `ㅂ`.
	const closed = bases.map((base) => finalOf(base) !== 0);

	return {
		words: bases.map((base, i) => (closed[i] ? `${base}는다` : `${closeOn(base, FINAL_N)}다`)),
		forms: {
			question: bases.map((base) => attach(base, '니|나|는가')),
			exclamation: bases.map((base) => attach(base, '는구나|네|는군')),
			casual,
			casualQuestion: casual.map((form, i) => `${form}|${stems[i]}지`),
			polite: casual.map((form) => `${form}요`),
			politeQuestion: casual.map((form, i) => `${form}요|${stems[i]}죠`),
			formal: bases.map((base, i) =>
				closed[i] ? `${base}습니다` : `${closeOn(base, FINAL_B)}니다`
			),
			formalQuestion: bases.map((base, i) =>
				closed[i] ? `${base}습니까` : `${closeOn(base, FINAL_B)}니까`
			),
			linking: stems.map((stem, i) => (leads[i] ? `${casual[i]}서|${stem}고` : `${stem}고`))
		},
		past: conjugate(casual.map((form) => closeOn(form, FINAL_SS)).join(' '), PAST)
	};
}

/**
 * A state group's every form out of `stem:해체:관형사형` triples — `크:커:큰
 * 작:작아:작은 시끄럽:시끄러워:시끄러운` — the third being the form in front of a
 * noun, which is what the `-ㄴ가` question is written on: `작은가`, `시끄러운가`,
 * where `-니` takes the stem itself (`작니`, `시끄럽니`, `기니`).
 */
function koStates(entries: string): {
	words: WordPool;
	forms: Record<
		| 'question'
		| 'exclamation'
		| 'casual'
		| 'casualQuestion'
		| 'polite'
		| 'politeQuestion'
		| 'formal'
		| 'formalQuestion',
		WordPool
	>;
	past: PredicateTense;
} {
	const triples = words(entries).map((entry) => entry.split(':') as [string, string, string]);
	const stems = triples.map(([stem]) => stem);
	const casual = triples.map(([, form]) => form);
	const attributive = triples.map(([, , form]) => form);
	const bases = stems.map(dropL);
	const closed = bases.map((base) => finalOf(base) !== 0);

	return {
		words: stems.map((stem) => `${stem}다`),
		forms: {
			question: attributive.map((form, i) => `${bases[i]}니|${form}가`),
			exclamation: stems.map((stem, i) => `${stem}구나|${bases[i]}네|${stem}군`),
			casual,
			casualQuestion: casual.map((form, i) => `${form}|${stems[i]}지`),
			polite: casual.map((form) => `${form}요`),
			politeQuestion: casual.map((form, i) => `${form}요|${stems[i]}죠`),
			formal: bases.map((base, i) =>
				closed[i] ? `${base}습니다` : `${closeOn(base, FINAL_B)}니다`
			),
			formalQuestion: bases.map((base, i) =>
				closed[i] ? `${base}습니까` : `${closeOn(base, FINAL_B)}니까`
			)
		},
		past: conjugate(casual.map((form) => closeOn(form, FINAL_SS)).join(' '), PAST)
	};
}

export const KO: SentenceLanguageData = {
	space: ' ',
	capitalize: false,
	terminators: { statement: '.', question: '?', exclamation: '!', trailing: '…' },
	quotes: { double: ['“', '”'], single: ['‘', '’'] },
	// Written in 해라체, the plain form a statement closes on: 달린다, not 달려요.
	// Each group also carries the same verbs in every other form Korean has —
	// the question and exclamation endings of 해라체, then 해체, 해요체 and 합쇼체
	// with its own question — index-aligned with `words`, and the `linking` form
	// the first clause of a two-clause sentence takes. All of it is spelt by
	// `koVerbs` out of the stem and the 해체 form, which is the one form the
	// endings cannot be told from.
	verbs: [
		{
			field: 'rise',
			subject: ['creature', 'person'],
			...koVerbs(
				`
				일어나:일어나:서 일어서:일어서:서 깨어나:깨어나:서 눈뜨:눈떠:서 잠깨:잠깨:서 기지개켜:기지개켜:서 몸을일으키:몸을일으켜:서 정신차리:정신차려:서
				눈을뜨:눈을떠:서 잠에서깨:잠에서깨:서 깨:깨:서 정신들:정신들어:서 몸을펴:몸을펴:서 기운차리:기운차려:서
			`
			)
		},
		// Setting off: the verbs that need somewhere to go, and the ones that stand on
		// their own. `향한다` wants a `시장으로` in front of it; `떠난다` does not.
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			...koVerbs(
				`
				가:가:서 향하:향해:서 올라가:올라가:서 내려가:내려가:서 찾아가:찾아가:서 나아가:나아가:서 다가가:다가가:서 건너가:건너가:서 들어가:들어가:서 떠나가:떠나가:서
				접어들:접어들어:서 이동하:이동해:서 진입하:진입해:서
			`
			)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			// Running somewhere is for legs: a fish and a snake go, and do not run.
			subjectWithout: ['swimmer', 'crawler'],
			...koVerbs(
				`달려가:달려가:서 걸어가:걸어가:서 뛰어가:뛰어가:서 서둘러가:서둘러가:서 뛰쳐가:뛰쳐가:서 내달려가:내달려가:서`
			)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			...koVerbs(
				`
				떠나:떠나:서 나서:나서:서 출발하:출발해:서 길을떠나:길을떠나:서 길을나서:길을나서:서 자리를뜨:자리를떠:서 발길을돌리:발길을돌려:서 걸음을옮기:걸음을옮겨:서
				작별하:작별해:서 발을떼:발을떼:서 채비하:채비해:서 짐을싸:짐을싸:서
			`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			requires: 'destination',
			...koVerbs(
				`
				들어오:들어와:서 닿:닿아:서 이르:이르러:서 다다르:다다라:서 들어서:들어서:서 찾아오:찾아와:서 다가오:다가와:서 건너오:건너와:서 도달하:도달해:서 당도하:당도해:서
				발을들이:발을들여:서 들이닥치:들이닥쳐:서
			`
			)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			...koVerbs(
				`
				돌아오:돌아와:서 도착하:도착해:서 돌아가:돌아가:서 귀가하:귀가해:서 복귀하:복귀해:서 되돌아오:되돌아와:서 되돌아가:되돌아가:서 집에오:집에와:서
				귀환하:귀환해:서 돌아들:돌아들어:서
			`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// Running and walking are for legs: a fish and a snake do neither.
			subjectWithout: ['swimmer', 'crawler'],
			...koVerbs(
				`
				달리:달려 걷:걸어 뛰:뛰어 서성이:서성여 지나가:지나가 어슬렁대:어슬렁대 뛰어다니:뛰어다녀 거닐:거닐어 산책하:산책해 돌아다니:돌아다녀 뛰어나가:뛰어나가 걸어다니:걸어다녀
				껑충뛰:껑충뛰어 성큼성큼걷:성큼성큼걸어 종종걸음치:종종걸음쳐 활보하:활보해 질주하:질주해 배회하:배회해 총총거리:총총거려 내달리:내달려 뛰쳐나가:뛰쳐나가 발을구르:발을굴러
				내닫:내달아 어정거리:어정거려 휘적휘적걷:휘적휘적걸어 타박타박걷:타박타박걸어 뒷걸음질치:뒷걸음질쳐 앞장서:앞장서 발을내딛:발을내디뎌 종종거리:종종거려 어정대:어정대
			`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// What anything does that moves at all, legs or no legs.
			...koVerbs(
				`
				맴돌:맴돌아 오가:오가 움직이:움직여 물러나:물러나 떠돌:떠돌아 돌아서:돌아서 다가서:다가서 비켜서:비켜서
				스치:스쳐 지나치:지나쳐 비켜나:비켜나 몸을돌리:몸을돌려 자리를옮기:자리를옮겨 오르내리:오르내려
			`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A fish's, a whale's and a mermaid's; a lion does not swim here.
			subjectTraits: ['swimmer'],
			...koVerbs(
				`헤엄치:헤엄쳐 유영하:유영해 자맥질하:자맥질해 헤엄쳐다니:헤엄쳐다녀 물장구치:물장구쳐 잠수하:잠수해 떠다니:떠다녀 물살을가르:물살을갈라 물속을누비:물속을누벼`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A snake's, a snail's and a beetle's.
			subjectTraits: ['crawler'],
			...koVerbs(
				`기어가:기어가 기어다니:기어다녀 꿈틀거리:꿈틀거려 기어오르:기어올라 기어나오:기어나와 기:기어 스멀거리:스멀거려 굼실거리:굼실거려 기어들:기어들어 몸을비틀:몸을비틀어`
			)
		},
		{
			// Taking off is a flier's alone: a sparrow's, a dragon's, never a fish's.
			field: 'move',
			subject: ['creature'],
			subjectTraits: ['flier'],
			...koVerbs(
				`
				날아오르:날아올라 날:날아 날아다니:날아다녀 날갯짓하:날갯짓해 날아가:날아가 날아내리:날아내려 활공하:활공해 퍼덕이:퍼덕여 솟구치:솟구쳐 내려앉:내려앉아
				날아들:날아들어 비상하:비상해 선회하:선회해 활강하:활강해 날개를펴:날개를펴 하늘을가르:하늘을갈라
			`
			)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			...koVerbs(
				`기다리:기다려 두리번거리:두리번거려 숨:숨어 뒤척이:뒤척여 머뭇거리:머뭇거려 기웃거리:기웃거려 멈추:멈춰 멈춰서:멈춰서 망설이:망설여 주저하:주저해 숨죽이:숨죽여 귀기울이:귀기울여 눈치보:눈치봐 우물쭈물하:우물쭈물해 대기하:대기해 쭈뼛거리:쭈뼛거려 곁눈질하:곁눈질해`
			)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			...koVerbs(
				`쉬:쉬어 앉:앉아:서 눕:누워:서 웅크리:웅크려 드러눕:드러누워:서 걸터앉:걸터앉아:서 기대:기대:서 주저앉:주저앉아:서 쭈그리:쭈그려:서 엎드리:엎드려:서 한숨돌리:한숨돌려 휴식하:휴식해 늘어지:늘어져 숨을고르:숨을골라 자리잡:자리잡아:서 다리를뻗:다리를뻗어`
			)
		},
		{
			field: 'sleep',
			subject: ['creature', 'person'],
			...koVerbs(
				`잠자:잠자 잠들:잠들어 졸:졸아 꾸벅이:꾸벅여 잠에빠지:잠에빠져 곯아떨어지:곯아떨어져 눈을붙이:눈을붙여 낮잠자:낮잠자 선잠들:선잠들어 잠을청하:잠을청해 코를골:코를골아 꿈나라로가:꿈나라로가`
			)
		},
		// What somebody shows, split by what it shows: a story draws the group that
		// matches what is true of its hero, so the hero laughs after the meal and
		// sighs after losing the key. The last group shows nothing in particular and
		// is what a story falls back on.
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'content',
			...koVerbs(
				`
				웃:웃어 미소짓:미소지어 콧노래하:콧노래해 킥킥거리:킥킥거려 깔깔대:깔깔대 환호하:환호해 히죽거리:히죽거려 흥얼거리:흥얼거려 웃음짓:웃음지어 손뼉치:손뼉쳐
				감탄하:감탄해 안도하:안도해 고개를끄덕이:고개를끄덕여 싱글벙글하:싱글벙글해 방긋웃:방긋웃어 활짝웃:활짝웃어 빙긋거리:빙긋거려 기뻐하:기뻐해 함박웃음짓:함박웃음지어
				콧노래를부르:콧노래를불러 어깨를들썩이:어깨를들썩여
			`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'restless',
			...koVerbs(
				`
				한숨짓:한숨지어 중얼거리:중얼거려 투덜거리:투덜거려 혼잣말하:혼잣말해 탄식하:탄식해 고개를젓:고개를저어 짜증내:짜증내 씩씩거리:씩씩거려 입을삐죽이:입을삐죽여
				발을구르:발을굴러 안절부절못하:안절부절못해 손톱을물어뜯:손톱을물어뜯어 입술을깨물:입술을깨물어 눈살을찌푸리:눈살을찌푸려 머리를긁:머리를긁어 볼멘소리하:볼멘소리해
				울:울어 흐느끼:흐느껴 훌쩍이:훌쩍여 눈물짓:눈물지어 화내:화내 성내:성내 눈을흘기:눈을흘겨 코웃음치:코웃음쳐 한숨을내쉬:한숨을내쉬어 이마를짚:이마를짚어
			`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'tired',
			...koVerbs(
				`하품하:하품해 눈을비비:눈을비벼 어깨를주무르:어깨를주물러 목을돌리:목을돌려 허리를두드리:허리를두드려 눈을깜빡이:눈을깜빡여 고개를떨구:고개를떨궈 하품을참:하품을참아`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			condition: 'hungry',
			...koVerbs(
				`침을삼키:침을삼켜 군침을흘리:군침을흘려 배를문지르:배를문질러 입맛을다시:입맛을다셔 코를킁킁거리:코를킁킁거려 배를움켜쥐:배를움켜쥐어 입을다시:입을다셔`
			)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			...koVerbs(
				`
				소리치:소리쳐 외치:외쳐 놀라:놀라 어리둥절하:어리둥절해 헛기침하:헛기침해 어깨를으쓱하:어깨를으쓱해
				고개를갸웃하:고개를갸웃해 눈을크게뜨:눈을크게떠 숨을들이켜:숨을들이켜 멈칫하:멈칫해 기지개켜:기지개켜 심호흡하:심호흡해 뒤돌아보:뒤돌아봐 고개를들:고개를들어
			`
			)
		},
		{
			field: 'talk',
			subject: ['creature', 'person'],
			...koVerbs(
				`
				이야기하:이야기해 수다떨:수다떨어 대화하:대화해 말하:말해 담소하:담소해 잡담하:잡담해 떠들:떠들어 속삭이:속삭여 재잘거리:재잘거려 얘기하:얘기해 수군거리:수군거려
				이야기를나누:이야기를나눠 말을건네:말을건네
				인사하:인사해 소곤거리:소곤거려 되묻:되물어 대답하:대답해 설명하:설명해 말을붙이:말을붙여 화답하:화답해 중얼대:중얼대
			`
			)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			...koVerbs(
				`
				춤추:춤춰 노래하:노래해 뒹굴:뒹굴어 뛰놀:뛰놀아 장난치:장난쳐 뛰어오르:뛰어올라 폴짝거리:폴짝거려 구르:굴러 놀:놀아 뛰어놀:뛰어놀아 까불:까불어 재롱부리:재롱부려
				깡충거리:깡충거려 숨바꼭질하:숨바꼭질해 신나하:신나해 물장난치:물장난쳐 공놀이하:공놀이해 노닐:노닐어 재주넘:재주넘어 빙글빙글돌:빙글빙글돌아
				물놀이하:물놀이해 술래잡기하:술래잡기해 그네타:그네타 미끄럼타:미끄럼타 팽이치:팽이쳐 연날리:연날려 딱지치:딱지쳐 공차:공차 줄넘기하:줄넘기해
			`
			)
		},
		{
			field: 'think',
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			...koVerbs(
				`꿈꾸:꿈꿔 기억하:기억해 잊:잊어 상상하:상상해 헤아리:헤아려 떠올리:떠올려 그리워하:그리워해 궁금해하:궁금해해 생각하:생각해 되새기:되새겨 고민하:고민해 곱씹:곱씹어 걱정하:걱정해 궁리하:궁리해 회상하:회상해 추억하:추억해 믿:믿어 기대하:기대해 이해하:이해해 깨닫:깨달아 잊어버리:잊어버려 동경하:동경해 예감하:예감해 떠올려보:떠올려봐`
			)
		},
		{
			field: 'look',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'plant', 'food', 'drink'],
			...koVerbs(
				`보:봐 바라보:바라봐 살피:살펴 들여다보:들여다봐 구경하:구경해 만지:만져 쓰다듬:쓰다듬어 지켜보:지켜봐 쳐다보:쳐다봐 훑어보:훑어봐 노려보:노려봐 응시하:응시해 관찰하:관찰해 뜯어보:뜯어봐 눈여겨보:눈여겨봐 어루만지:어루만져 만져보:만져봐 내려다보:내려다봐 올려다보:올려다봐 두드리:두드려 냄새맡:냄새맡아 감상하:감상해`
			)
		},
		{
			field: 'search',
			subject: ['creature', 'person'],
			...koVerbs(
				`
				찾아다니:찾아다녀 헤매:헤매 둘러보:둘러봐 살펴보:살펴봐 뒤지:뒤져 뒤적이:뒤적여 수색하:수색해 탐색하:탐색해 물색하:물색해 더듬:더듬어 샅샅이뒤지:샅샅이뒤져 파헤치:파헤쳐
				탐험하:탐험해 살펴다니:살펴다녀 찾아헤매:찾아헤매
				뒤져보:뒤져봐 찾아보:찾아봐 헤집:헤집어 훑:훑어 두리번대:두리번대
			`
			)
		},
		{
			field: 'find',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'plant', 'food', 'drink'],
			...koVerbs(
				`
				찾:찾아:서 발견하:발견해 줍:주워:서 찾아내:찾아내:서 건지:건져:서 집어들:집어들어:서 알아보:알아봐:서 캐내:캐내:서 손에넣:손에넣어:서 주워들:주워들어:서 되찾:되찾아:서
				알아채:알아채:서 캐:캐:서 골라내:골라내:서 주워담:주워담아:서
			`
			)
		},
		{
			field: 'take',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'plant', 'food', 'drink'],
			...koVerbs(
				`챙기:챙겨:서 고르:골라:서 집:집어:서 얻:얻어:서 받:받아:서 꺼내:꺼내:서 움켜쥐:움켜쥐어 잡:잡아:서 쥐:쥐어:서 들:들어:서 가지:가져:서 붙잡:붙잡아:서 붙들:붙들어:서 낚아채:낚아채:서 집어올리:집어올려:서 건네받:건네받아:서 추리:추려:서 골라잡:골라잡아:서 챙겨들:챙겨들어:서 물:물어:서`
			)
		},
		{
			field: 'carry',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'plant', 'food', 'drink'],
			...koVerbs(
				`옮기:옮겨 나르:날라 가져오:가져와:서 들고오:들고와:서 안고오:안고와:서 짊어지:짊어져:서 둘러메:둘러메:서 들고가:들고가:서 가져가:가져가:서 끌고가:끌고가:서 끌:끌어 밀:밀어 운반하:운반해 들어올리:들어올려 안:안아 품:품어 실어나르:실어날라 날라오:날라와:서`
			)
		},
		{
			field: 'hide',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'plant', 'food', 'drink'],
			...koVerbs(
				`감추:감춰 숨기:숨겨 넣어두:넣어둬 간직하:간직해 묻:묻어 챙겨두:챙겨둬 보관하:보관해 저장하:저장해 모아두:모아둬 쟁여두:쟁여둬 파묻:파묻어 덮어두:덮어둬 집어넣:집어넣어 밀어넣:밀어넣어 지키:지켜 간수하:간수해 싸두:싸둬 숨겨두:숨겨둬 담아두:담아둬 놓아두:놓아둬 치우:치워`
			)
		},
		{
			field: 'lose',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			// What one can hold, and so can lose.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'plant', 'food', 'drink'],
			...koVerbs(
				`잃어버리:잃어버려 떨어뜨리:떨어뜨려 놓치:놓쳐 잃:잃어 흘리:흘려 빠뜨리:빠뜨려 두고오:두고와 놓고오:놓고와 분실하:분실해 떨구:떨궈 놓아버리:놓아버려 흘려버리:흘려버려`
			)
		},
		{
			field: 'meet',
			subject: ['creature', 'person'],
			object: ['person'],
			...koVerbs(
				`
				만나:만나 마주치:마주쳐 마주하:마주해 조우하:조우해 맞이하:맞이해 반기:반겨 방문하:방문해 마주보:마주봐 만나보:만나봐 부딪치:부딪쳐
				마중하:마중해 배웅하:배웅해 마주앉:마주앉아 상봉하:상봉해
			`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'vehicle'],
			...koVerbs(
				`
				만들:만들어 짓:지어 빚:빚어 그리:그려 엮:엮어 만들어내:만들어내 완성하:완성해 꾸미:꾸며 빚어내:빚어내 손수만들:손수만들어 창작하:창작해 그려내:그려내 장식하:장식해
				세우:세워 쌓:쌓아 새기:새겨 이어붙이:이어붙여 짜:짜 뜨:떠 매듭짓:매듭지어
			`
			)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			// Assembled or carved: an object, a tool or a vehicle, never a song or a gem.
			objectThemes: ['object', 'tool', 'vehicle'],
			...koVerbs(
				`조립하:조립해 깎:깎아 조각하:조각해 용접하:용접해 설계하:설계해 제작하:제작해 제조하:제조해 세공하:세공해 벼리:벼려 주조하:주조해 대패질하:대패질해`
			)
		},
		{
			field: 'tend',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'vehicle'],
			...koVerbs(
				`고치:고쳐 닦:닦아 손질하:손질해 다듬:다듬어 정리하:정리해 매만지:매만져 수리하:수리해 손보:손봐 씻:씻어 문지르:문질러 털:털어 닦아내:닦아내 윤내:윤내 광내:광내 조이:조여 기름치:기름쳐 정돈하:정돈해 관리하:관리해 돌보:돌봐 보수하:보수해 점검하:점검해 헹구:헹궈 말리:말려`
			)
		},
		{
			field: 'sell',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'vehicle'],
			...koVerbs(
				`팔:팔아 넘기:넘겨 건네:건네 내놓:내놓아 판매하:판매해 처분하:처분해 팔아치우:팔아치워 내다팔:내다팔아 팔아넘기:팔아넘겨 넘겨주:넘겨줘 건네주:건네줘 거래하:거래해 진열하:진열해 늘어놓:늘어놓아 값을매기:값을매겨`
			)
		},
		{
			field: 'buy',
			subject: ['person'],
			object: ['thing', 'vehicle', 'edible'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'vehicle', 'food', 'drink'],
			...koVerbs(
				`사:사:서 사오:사와:서 구하:구해:서 장만하:장만해:서 사들이:사들여:서 구입하:구입해:서 구매하:구매해:서 주문하:주문해:서 골라사:골라사:서 값을치르:값을치러:서 마련하:마련해:서 사가지고오:사가지고와:서 흥정하:흥정해:서 사두:사둬:서 사모으:사모아:서`
			)
		},
		{
			field: 'cook',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...koVerbs(
				`굽:구워:서 데우:데워:서 끓이:끓여:서 요리하:요리해:서 썰:썰어:서 담:담아:서 볶:볶아:서 삶:삶아:서 찌:쪄:서 튀기:튀겨:서 조리하:조리해:서 익히:익혀:서 데치:데쳐:서 졸이:졸여:서 다지:다져:서 버무리:버무려:서 양념하:양념해:서 간을맞추:간을맞춰:서 차리:차려:서 젓:저어:서 뒤집:뒤집어:서 푸:퍼:서 덜:덜어:서`
			)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...koVerbs(
				`먹:먹어 씹:씹어 삼키:삼켜 맛보:맛봐 베어먹:베어먹어 먹어치우:먹어치워 먹어보:먹어봐 깨물:깨물어 갉아먹:갉아먹어 뜯어먹:뜯어먹어 집어먹:집어먹어 주워먹:주워먹어 우물거리:우물거려 오물거리:오물거려 핥:핥아 야금야금먹:야금야금먹어 허겁지겁먹:허겁지겁먹어 꿀꺽삼키:꿀꺽삼켜 해치우:해치워 씹어삼키:씹어삼켜 비우:비워`
			)
		},
		{
			field: 'drink',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['drink'],
			...koVerbs(
				`
				마시:마셔 들이키:들이켜 홀짝이:홀짝여 음미하:음미해 마셔보:마셔봐 벌컥벌컥마시:벌컥벌컥마셔 꿀꺽꿀꺽마시:꿀꺽꿀꺽마셔 한모금마시:한모금마셔 들이마시:들이마셔
				마셔버리:마셔버려 홀짝거리:홀짝거려 다마시:다마셔 한잔하:한잔해 맛보:맛봐
				목을축이:목을축여 삼키:삼켜 들이켜:들이켜 축이:축여
			`
			)
		},
		// What a place does on its own is what a story's scene is made of: it goes
		// quiet, darkens, fills up. What an event does is a different list, so the
		// two are apart — a market does not set the way a day does.
		{
			field: 'change',
			subject: ['place'],
			...koVerbs(
				`조용해지:조용해져 어두워지:어두워져 밝아오:밝아와 고요해지:고요해져 붐비:붐벼 물들:물들어 환해지:환해져 잠잠해지:잠잠해져 북적이:북적여 소란해지:소란해져 한산해지:한산해져 텅비:텅비어 가득차:가득차 술렁이:술렁여 깨어나:깨어나 잠들:잠들어 어둑해지:어둑해져 훤해지:훤해져 젖:젖어 마르:말라 얼어붙:얼어붙어 반짝이:반짝여 달라지:달라져 활기를띠:활기를띠어 고요에잠기:고요에잠겨 안개에잠기:안개에잠겨`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			...koVerbs(
				`흐르:흘러 시작되:시작돼 끝나:끝나 이어지:이어져 지나가:지나가 계속되:계속돼 멈추:멈춰 끝나가:끝나가 흘러가:흘러가 거듭되:거듭돼 마무리되:마무리돼 가까워지:가까워져 멀어지:멀어져 다가오:다가와 찾아오:찾아와 물러가:물러가`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// A season deepens and a sky shines; a match does neither.
			subjectThemes: ['time', 'weather'],
			...koVerbs(`빛나:빛나 저물:저물어 깊어지:깊어져 깊어가:깊어가 무르익:무르익어`)
		},
		{
			field: 'change',
			subject: ['event'],
			// What a time of day or a season does: it wears on, turns, settles.
			subjectThemes: ['time'],
			...koVerbs(
				`기울:기울어 저물어가:저물어가 밝아오:밝아와 찾아들:찾아들어 내려앉:내려앉아 밝아지:밝아져 어두워지:어두워져 지나:지나`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What weather does: it rolls in, thickens, lets up.
			subjectThemes: ['weather'],
			...koVerbs(
				`몰려오:몰려와 짙어지:짙어져 옅어지:옅어져 잦아들:잦아들어 거세지:거세져 몰아치:몰아쳐 흩어지:흩어져 걷히:걷혀`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			// What a match does: it is held, gets going, closes.
			subjectThemes: ['sport'],
			...koVerbs(
				`열리:열려 벌어지:벌어져 펼쳐지:펼쳐져 무르익:무르익어 막을내리:막을내려 치러지:치러져 재개되:재개돼 달아오르:달아올라`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			// What a thing one can hold does. A song is a thing of another kind, below.
			subjectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'vehicle'],
			...koVerbs(
				`흔들리:흔들려 반짝이:반짝여 떨어지:떨어져 굴러가:굴러가 기울어지:기울어져 낡아가:낡아가 빛나:빛나 닳:닳아 빛바래:빛바래 흔들거리:흔들거려 넘어지:넘어져 날아가:날아가 미끄러지:미끄러져 튀어오르:튀어올라 돌:돌아 멈추:멈춰 놓이:놓여 흔들흔들하:흔들흔들해`
			)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			// What only something made of metal and wood does: a jewel never rusts.
			subjectThemes: ['object', 'tool', 'vehicle'],
			...koVerbs(
				`녹슬:녹슬어 덜컹거리:덜컹거려 삐걱거리:삐걱거려 망가지:망가져 부서지:부서져 깨지:깨져 굴러떨어지:굴러떨어져 뒤집히:뒤집혀 쓰러지:쓰러져`
			)
		},
		{
			field: 'change',
			subject: ['thing'],
			subjectThemes: ['music'],
			...koVerbs(
				`울리:울려 흐르:흘러 퍼지:퍼져 잦아들:잦아들어 이어지:이어져 울려퍼지:울려퍼져 들려오:들려와 멈추:멈춰 잠잠해지:잠잠해져 메아리치:메아리쳐 감돌:감돌아 흘러나오:흘러나와 반복되:반복돼 가라앉:가라앉아 커지:커져`
			)
		},
		{
			field: 'move',
			subject: ['vehicle'],
			...koVerbs(
				`달리:달려 멈추:멈춰 지나가:지나가 돌아오:돌아와 출발하:출발해 미끄러지:미끄러져 떠나:떠나 도착하:도착해 움직이:움직여 굴러가:굴러가 나아가:나아가 지나치:지나쳐 서:서 속도를내:속도를내 속도를줄이:속도를줄여 흔들리:흔들려 덜컹거리:덜컹거려 방향을바꾸:방향을바꿔 후진하:후진해 질주하:질주해 돌아가:돌아가 들어오:들어와 다가오:다가와 멀어지:멀어져 정차하:정차해`
			)
		},
		{
			field: 'change',
			subject: ['idea', 'event'],
			...koVerbs(
				`번지:번져 사라지:사라져 남:남아 스며들:스며들어 되풀이되:되풀이돼 짙어지:짙어져 퍼지:퍼져 커지:커져 사그라들:사그라들어 옅어지:옅어져 흐려지:흐려져 되살아나:되살아나 떠오르:떠올라 맴돌:맴돌아 감돌:감돌아 쌓이:쌓여 깊어지:깊어져 밀려오:밀려와 가라앉:가라앉아 피어오르:피어올라 흩어지:흩어져 스러지:스러져 잦아들:잦아들어 되돌아오:되돌아와`
			)
		},
		{
			field: 'change',
			subject: ['plant'],
			...koVerbs(
				`자라:자라 시들:시들어 피어나:피어나 흔들리:흔들려 뿌리내리:뿌리내려 피:피어 지:져 움트:움터 싹트:싹터 우거지:우거져 무성해지:무성해져 마르:말라 물들:물들어 살랑이:살랑여 나부끼:나부껴 자라나:자라나 뻗어나가:뻗어나가 열매맺:열매맺어 꽃피우:꽃피워 푸르러지:푸르러져 시들어가:시들어가 고개숙이:고개숙여 돋아나:돋아나 향기를풍기:향기를풍겨 흐드러지:흐드러져 만발하:만발해`
			)
		},
		{
			field: 'change',
			subject: ['body'],
			...koVerbs(
				`떨리:떨려 움직이:움직여 저리:저려 굳:굳어 쑤시:쑤셔 욱신거리:욱신거려 떨:떨어 흔들리:흔들려 뻐근해지:뻐근해져 풀리:풀려 굳어지:굳어져 저려오:저려와 붓:부어 부풀:부풀어 나른해지:나른해져 지치:지쳐 뻣뻣해지:뻣뻣해져 무거워지:무거워져 가벼워지:가벼워져 시리:시려 화끈거리:화끈거려 따뜻해지:따뜻해져 차가워지:차가워져 간질거리:간질거려 근질거리:근질거려`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			...koVerbs(
				`식:식어 끓:끓어 상하:상해 남:남아 데워지:데워져 따뜻해지:따뜻해져 차가워지:차가워져 시원해지:시원해져 뜨거워지:뜨거워져 미지근해지:미지근해져 김이나:김이나 향을풍기:향을풍겨 냄새를풍기:냄새를풍겨 줄어들:줄어들어 바닥나:바닥나 동나:동나 남아돌:남아돌아 차려지:차려져 나오:나와`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			// Ripening and melting are what food does; a drink cools, boils and spoils.
			subjectThemes: ['food'],
			...koVerbs(
				`익:익어 녹:녹아 굳:굳어 타:타 눋:눌어 부풀:부풀어 바삭해지:바삭해져 눅눅해지:눅눅해져 딱딱해지:딱딱해져 말랑해지:말랑해져 무르:물러 익어가:익어가 곰팡이피:곰팡이피어`
			)
		},
		{
			field: 'change',
			subject: ['edible'],
			// What a drink does and a dish does not: it spills, fizzes, sloshes, freezes.
			subjectThemes: ['drink'],
			...koVerbs(
				`넘치:넘쳐 쏟아지:쏟아져 흘러넘치:흘러넘쳐 김이오르:김이올라 거품이일:거품이일어 출렁이:출렁여 찰랑이:찰랑여 얼:얼어 식어가:식어가`
			)
		}
	],
	// The same forms for a predicate that describes rather than does. An
	// adjective parts company with a verb in one place: it asks with `-(으)ㄴ가`
	// and `-(으)니` where a verb asks with `-나` and a bare `-니`. The groups that
	// carry a `condition` are the ones a story can read and write: `배고프다` is
	// what the hero is before the meal and `배부르다` what they are after it.
	states: [
		{
			subject: ['creature', 'person'],
			...koStates(`
				크:커:큰 작:작아:작은 빠르:빨라:빠른 느리:느려:느린 조용하:조용해:조용한 시끄럽:시끄러워:시끄러운 용감하:용감해:용감한 게으르:게을러:게으른 부지런하:부지런해:부지런한
				사납:사나워:사나운 순하:순해:순한 영리하:영리해:영리한
				어리:어려:어린 늙:늙어:늙은 착하:착해:착한 얌전하:얌전해:얌전한 활발하:활발해:활발한 대담하:대담해:대담한 신중하:신중해:신중한 무뚝뚝하:무뚝뚝해:무뚝뚝한
				다부지:다부져:다부진 늘씬하:늘씬해:늘씬한 우직하:우직해:우직한 날쌔:날쌔:날쌘 튼튼하:튼튼해:튼튼한 건강하:건강해:건강한 씩씩하:씩씩해:씩씩한 다정하:다정해:다정한
				수줍:수줍어:수줍은 명랑하:명랑해:명랑한 느긋하:느긋해:느긋한
			`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'hungry',
			...koStates(
				`배고프:배고파:배고픈 허기지:허기져:허기진 시장하:시장해:시장한 출출하:출출해:출출한`
			)
		},
		{
			subject: ['creature', 'person'],
			condition: 'full',
			...koStates(
				`배부르:배불러:배부른 든든하:든든해:든든한 흡족하:흡족해:흡족한 넉넉하:넉넉해:넉넉한`
			)
		},
		{
			subject: ['creature', 'person'],
			condition: 'tired',
			...koStates(
				`피곤하:피곤해:피곤한 졸리:졸려:졸린 나른하:나른해:나른한 고단하:고단해:고단한 노곤하:노곤해:노곤한 뻐근하:뻐근해:뻐근한 힘겹:힘겨워:힘겨운`
			)
		},
		{
			subject: ['creature', 'person'],
			condition: 'rested',
			...koStates(
				`상쾌하:상쾌해:상쾌한 개운하:개운해:개운한 활기차:활기차:활기찬 거뜬하:거뜬해:거뜬한 홀가분하:홀가분해:홀가분한 산뜻하:산뜻해:산뜻한 가뿐하:가뿐해:가뿐한`
			)
		},
		{
			subject: ['creature', 'person'],
			condition: 'content',
			...koStates(`
				기쁘:기뻐:기쁜 즐겁:즐거워:즐거운 편안하:편안해:편안한 만족스럽:만족스러워:만족스러운 행복하:행복해:행복한 뿌듯하:뿌듯해:뿌듯한
				흐뭇하:흐뭇해:흐뭇한 포근하:포근해:포근한 평온하:평온해:평온한 다행스럽:다행스러워:다행스러운
			`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'restless',
			...koStates(`
				심심하:심심해:심심한 궁금하:궁금해:궁금한 초조하:초조해:초조한 답답하:답답해:답답한
				불안하:불안해:불안한 지루하:지루해:지루한 뒤숭숭하:뒤숭숭해:뒤숭숭한 조급하:조급해:조급한
			`)
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
			...koStates(`
				아름답:아름다워:아름다운 낯설:낯설어:낯선 새롭:새로워:새로운
				신비롭:신비로워:신비로운 낯익:낯익어:낯익은 특별하:특별해:특별한 평범하:평범해:평범한 이상하:이상해:이상한
			`)
		},
		{
			// Rare, common and precious are things a thing is, and a place is not.
			subject: ['creature', 'plant', 'edible', 'thing', 'vehicle', 'idea', 'body'],
			...koStates(`흔하:흔해:흔한 드물:드물어:드문 소중하:소중해:소중한 귀하:귀해:귀한`)
		},
		{
			subject: ['place'],
			...koStates(`
				넓:넓어:넓은 좁:좁아:좁은 고요하:고요해:고요한 깊:깊어:깊은 어둡:어두워:어두운 밝:밝아:밝은 아득하:아득해:아득한 가파르:가팔라:가파른
				한적하:한적해:한적한 아늑하:아늑해:아늑한 황량하:황량해:황량한 눅눅하:눅눅해:눅눅한 서늘하:서늘해:서늘한 험하:험해:험한 평평하:평평해:평평한
				널찍하:널찍해:널찍한 비좁:비좁아:비좁은 멀:멀어:먼 가깝:가까워:가까운 울창하:울창해:울창한
			`)
		},
		{
			subject: ['event'],
			...koStates(`
				길:길어:긴 짧:짧아:짧은 요란하:요란해:요란한 고요하:고요해:고요한 갑작스럽:갑작스러워:갑작스러운
				잔잔하:잔잔해:잔잔한 성대하:성대해:성대한 조촐하:조촐해:조촐한 분주하:분주해:분주한 한가롭:한가로워:한가로운 소란스럽:소란스러워:소란스러운 화창하:화창해:화창한
			`)
		},
		{
			subject: ['thing', 'vehicle'],
			// What a thing one can hold is like. A song is a thing of another kind, below.
			subjectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'vehicle'],
			...koStates(`
				단단하:단단해:단단한 가볍:가벼워:가벼운 무겁:무거워:무거운 매끈하:매끈해:매끈한 투명하:투명해:투명한 튼튼하:튼튼해:튼튼한 반들반들하:반들반들해:반들반들한
				낡:낡아:낡은 두껍:두꺼워:두꺼운 얇:얇아:얇은 둥글:둥글어:둥근 뾰족하:뾰족해:뾰족한 납작하:납작해:납작한 화려하:화려해:화려한 투박하:투박해:투박한
				정교하:정교해:정교한 값비싸:값비싸:값비싼 길쭉하:길쭉해:길쭉한
			`)
		},
		{
			subject: ['thing'],
			subjectThemes: ['music'],
			...koStates(`
				잔잔하:잔잔해:잔잔한 경쾌하:경쾌해:경쾌한 구슬프:구슬퍼:구슬픈 감미롭:감미로워:감미로운 흥겹:흥겨워:흥겨운
				웅장하:웅장해:웅장한 애절하:애절해:애절한 은은하:은은해:은은한 청아하:청아해:청아한 우렁차:우렁차:우렁찬 나직하:나직해:나직한
			`)
		},
		{
			subject: ['edible'],
			...koStates(
				`달:달아:단 시:셔:신 뜨겁:뜨거워:뜨거운 차갑:차가워:차가운 미지근하:미지근해:미지근한 진하:진해:진한 연하:연해:연한 시원하:시원해:시원한 향긋하:향긋해:향긋한`
			)
		},
		{
			subject: ['edible'],
			// Spicy, salty, nutty and plain are a dish's; a drink is sweet, sour, hot or cold.
			subjectThemes: ['food'],
			...koStates(`
				짜:짜:짠 맵:매워:매운 고소하:고소해:고소한 담백하:담백해:담백한
				짭짤하:짭짤해:짭짤한 매콤하:매콤해:매콤한 쫄깃하:쫄깃해:쫄깃한 바삭하:바삭해:바삭한 부드럽:부드러워:부드러운 느끼하:느끼해:느끼한 싱겁:싱거워:싱거운
			`)
		},
		{
			subject: ['idea'],
			...koStates(`
				분명하:분명해:분명한 흐릿하:흐릿해:흐릿한 영원하:영원해:영원한 덧없:덧없어:덧없는
				뚜렷하:뚜렷해:뚜렷한 아련하:아련해:아련한 오묘하:오묘해:오묘한 은밀하:은밀해:은밀한 사소하:사소해:사소한 부질없:부질없어:부질없는
			`)
		},
		{
			subject: ['idea'],
			// Hard and easy are a thought's, a machine's or a debt's, not a colour's or a mood's.
			subjectThemes: ['concept', 'tech', 'finance'],
			...koStates(
				`어렵:어려워:어려운 쉽:쉬워:쉬운 까다롭:까다로워:까다로운 간단하:간단해:간단한 복잡하:복잡해:복잡한 유용하:유용해:유용한 번거롭:번거로워:번거로운`
			)
		},
		{
			subject: ['idea'],
			subjectThemes: ['color'],
			...koStates(`
				짙:짙어:짙은 옅:옅어:옅은 선명하:선명해:선명한 화사하:화사해:화사한 은은하:은은해:은은한
				밝:밝아:밝은 어둡:어두워:어두운 곱:고와:고운 산뜻하:산뜻해:산뜻한 강렬하:강렬해:강렬한 부드럽:부드러워:부드러운
			`)
		},
		{
			subject: ['plant'],
			...koStates(`
				푸르:푸르러:푸른 무성하:무성해:무성한 향기롭:향기로워:향기로운 시들하:시들해:시들한
				싱싱하:싱싱해:싱싱한 여리:여려:여린 앙상하:앙상해:앙상한 탐스럽:탐스러워:탐스러운 싱그럽:싱그러워:싱그러운
			`)
		},
		{
			subject: ['body'],
			...koStates(
				`따뜻하:따뜻해:따뜻한 차갑:차가워:차가운 아프:아파:아픈 뻣뻣하:뻣뻣해:뻣뻣한 시리:시려:시린 부드럽:부드러워:부드러운 거칠:거칠어:거친 저리:저려:저린 묵직하:묵직해:묵직한`
			)
		}
	],
	// Attributive forms, grouped by what they can sit in front of. A nickname's
	// pool is allowed `맑은 기계공`; a sentence is not.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(`
				용감한 씩씩한 다정한 부지런한 게으른 수줍은 영리한 어린 늙은 작은 커다란 조용한 명랑한 느긋한 재빠른 호기심어린 명민한 의젓한 천진한
				착한 순박한 얌전한 활발한 발랄한 당돌한 대담한 신중한 무뚝뚝한 장난스러운 자그마한 여윈 건강한 지친 고집센 다부진 늘씬한 우직한
				어수룩한 사려깊은 늠름한 상냥한 슬기로운 엉뚱한 새침한
			`)
		},
		{
			subject: ['person'],
			words: words(`
				젊은 친절한 엄격한 진지한 바쁜 성실한 낯선 유쾌한
				너그러운 인자한 어진 지혜로운 근면한 과묵한 수다스러운 소탈한 깐깐한 침착한 노련한 서투른 나이든 이름난 가난한 부유한 정직한 솔직한 점잖은 무심한
			`)
		},
		{
			subject: ['creature'],
			words: words(`
				날쌘 사나운 순한 겁많은 통통한 조그만
				털북숭이 얼룩진 뾰족한 날렵한 굼뜬 우렁찬 조그마한 앙증맞은 온순한 영악한 잽싼 길쭉한 짤막한 포동포동한 매끄러운 복슬복슬한
			`)
		},
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(`
				달콤한 매콤한 따뜻한 신선한 바삭한 고소한 향긋한 뜨거운 짭짤한 말랑한 촉촉한 새콤한 먹음직한 담백한
				부드러운 쫄깃한 폭신한 노릇한 진한 알싸한 시큼한 달달한 구수한 큼직한 갓구운 잘익은 푸짐한 소박한 정갈한 따끈한 눅진한 바삭바삭한 말끔한
			`)
		},
		{
			subject: ['edible'],
			themes: ['drink'],
			words: words(`
				달콤한 따뜻한 차가운 시원한 뜨거운 향긋한 신선한 새콤한 진한 씁쓸한
				미지근한 시큼한 달달한 은은한 알싸한 부드러운 맑은 탁한 거품나는 김이나는 상큼한 텁텁한 청량한 뜨끈한
			`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(`
				낡은 새로운 작은 커다란 가벼운 무거운 반짝이는 매끈한 투명한 단단한 예쁜 소중한 오래된 반듯한
				녹슨 닳은 해진 튼튼한 널찍한 길쭉한 납작한 둥근 뾰족한 두꺼운 얇은 화려한 소박한 정교한 투박한 값비싼 흔한 진귀한 먼지쌓인 반들반들한
			`)
		},
		{
			subject: ['vehicle'],
			words: words(`
				빠른 느린 덜컹거리는 튼튼한
				요란한 날렵한 육중한 삐걱대는 반짝이는 커다란 자그마한 새빨간 하얀 미끄러지는
			`)
		},
		{
			subject: ['place'],
			words: words(`
				고요한 넓은 어두운 밝은 낯선 오래된 아늑한 한적한 북적이는 조용한 외딴 먼 가까운 텅빈 쓸쓸한 환한
				널찍한 비좁은 눅눅한 메마른 서늘한 포근한 황량한 울창한 험한 가파른 평평한 나지막한 드높은 정겨운 낯익은 인적드문 후미진 으슥한 깨끗한 지저분한
			`)
		},
		{
			subject: ['plant'],
			words: words(`
				푸른 무성한 향기로운 어린 시든 커다란 작은 여린 싱싱한
				싱그러운 우거진 앙상한 가시돋친 활짝핀 갓피어난 키큰 흐드러진 청초한 소담한 연둣빛 새파란 노랗게핀 탐스러운 앙증맞은
			`)
		},
		{
			subject: ['idea'],
			words: words(`
				희미한 오래된 새로운 낯선 분명한 소중한 작은 엉뚱한 막연한
				아련한 뚜렷한 깊은 단순한 복잡한 기묘한 서글픈 아득한 은밀한 사소한 어렴풋한 그럴듯한 뜬금없는 야릇한 오랜
			`)
		},
		{
			subject: ['event'],
			words: words(`
				긴 짧은 조용한 화창한 흐린 요란한 갑작스러운 느긋한
				잔잔한 소란한 즐거운 지루한 뜻밖의 흐뭇한 어수선한 성대한 조촐한 나른한 눈부신 아찔한 분주한 한가로운
			`)
		},
		{
			subject: ['body'],
			words: words(`
				작은 차가운 따뜻한 튼튼한 여린
				부드러운 거친 매끈한 앙상한 통통한 길쭉한 조그만 따스한 시린 뻣뻣한 나른한 상처난
			`)
		},
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
			words: words(`
				아름다운 신비한 낯선 새로운
				신비로운 낯익은 어여쁜 정겨운 쓸쓸한 눈부신 희귀한 이상한 고요한 오래된
			`)
		}
	],
	// How something is done, by what can do it that way. A fox may act 부지런히
	// and a river may not; a river flows 서서히 and 여전히, which a fox arriving
	// somewhere does not.
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				씩씩하게 훌쩍 사뿐히 성큼성큼 부지런히 유유히 살금살금 슬금슬금 뚜벅뚜벅 터벅터벅 허둥지둥 헐레벌떡 사뿐사뿐 총총히 벌떡
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(
				`
				조용히 천천히 서서히 문득 다시 계속 잠시 갑자기 언제나 여전히 은은히 살며시 가만히 슬며시 조금씩 차츰 점점 어느새 고요히
				불현듯 금세 한참 오래도록 내내 줄곧 한동안 잔뜩 유난히 부쩍 사뭇 자못 흠뻑 그득히 자욱이
				나직이 잔잔히 아득히 그윽이 곱게 소복이 촉촉이 나른하게 느슨하게 묵직하게 가볍게 조용조용 소리없이
				흐릿하게 뚜렷하게 선명하게 희미하게 스르르 사르르 스멀스멀 뭉게뭉게 넘실넘실 일렁일렁 반짝반짝 하늘하늘 살랑살랑 나풀나풀 몽글몽글 우수수
			`
			)
		}
	],
	// Sorted by what a paragraph has to know: the phases of a day in order, what
	// fits any tense, and what names one.
	times: {
		day: words(`새벽에 이른아침에 아침에 한낮에 오후에 해질녘에 초저녁에 저녁에 밤에 한밤중에`),
		any: words(`
			봄에 여름에 가을에 겨울에 주말에 휴일에 명절에 장마철에 이른봄에 늦가을에 새해에
			초봄에 늦봄에 초여름에 한여름에 늦여름에 초가을에 한겨울에 늦겨울에 환절기에 꽃샘추위에 단풍철에 수확철에
			연휴에 방학에 축제날에 장날에 보름날에 그믐날에 비오는날에 눈오는날에 바람부는날에 맑은날에 흐린날에 안개낀날에 첫눈오는날에
		`),
		past: words(`
			어제 지난주에 오래전에 한때 그날 그때 며칠전에 지난밤에
			그저께 엊그제 지지난주에 지난달에 작년에 재작년에 예전에 옛날에 그해에 그무렵에 이튿날 얼마전에 조금전에 한참전에
			그날밤에 그날아침에 지난봄에 지난여름에 지난가을에 지난겨울에
		`),
		present: words(`
			오늘 방금 이제 내일 다음주에
			지금 이따가 모레 올해 내년에 이번주에 이번달에 이번주말에 오늘밤에 오늘아침에 잠시후에 조금뒤에 머지않아 다음달에
		`),
		habitual: words(`
			요즘 가끔 매일 자주 이따금
			늘 항상 종종 때때로 간혹 드물게 좀처럼 날마다 해마다 철마다 주말마다 아침마다 밤마다 하루종일 온종일 근래에 평소에 대개 보통
		`)
	},
	homes: words(`집`),
	// Two clauses are joined on the first one's predicate, in the `linking` form
	// each group writes: `집에 돌아와서 사과를 먹었다`. The tense stays on the last
	// clause, which is where Korean puts it.
	join: { form: 'linking' },
	// What a sentence opens on when it follows another. Written whole, so a
	// language that wants a comma after its connective writes the comma.
	connectives: {
		additive: words(`그리고 게다가 그러고는 또 또한 아울러 더구나 나아가 그런가하면`),
		temporal: words(`
			이윽고 곧 그러자 이내 어느새 마침내 그제야 한편 그러고나서 잠시후 얼마뒤
			그러는사이 곧이어 뒤이어 그런다음 그러더니 어느덧 드디어 그무렵 잠시뒤 한참뒤 그때부터
		`),
		contrastive: words(
			`하지만 그런데 그러나 다만 오히려 그래도 그렇지만 반면에 도리어 그럼에도 그런데도`
		),
		causal: words(`그래서 그러므로 결국 그러니 따라서 그리하여 그러니까 그러기에 그런탓에`)
	},
	// What a noun can do that its theme does not say. A noun listed nowhere has no
	// trait, and takes any verb that asks for none.
	traits: {
		flier: words(`
			부엉이 올빼미 참새 까치 제비 독수리 매 학 백조 오리 기러기 딱따구리 앵무새 공작 나비 벌 잠자리 무당벌레 박쥐
			갈매기 까마귀 비둘기 꾀꼬리 반딧불이 매미 하루살이 풍뎅이 사슴벌레 파리 모기 나방
			용 봉황 마룡 비룡 흑룡 백룡 청룡 주작 삼족오 하피 드래곤 와이번 불사조 그리핀 페가수스 천마 천사 선녀 요정 정령 픽시
			임프 가고일 발키리
		`),
		swimmer: words(`
			고래 돌고래 상어 거북 물개 펭귄 개구리 문어 오징어 해마 불가사리 새우 잉어 연어 고등어 올챙이 악어 붕어 메기 가물치
			쏘가리 송사리 미꾸라지 장어 뱀장어 갈치 삼치 꽁치 멸치 조기 명태 대구 광어 도미 우럭 볼락 방어 참치 가오리 홍어 복어
			인어 세이렌 크라켄 물귀신 나이아드
		`),
		crawler: words(`
			거북 도마뱀 카멜레온 뱀 달팽이 개미 거미 소라 게 지렁이 지네 노래기 전갈 진드기 벼룩 누에 번데기 애벌레 도롱뇽 사마귀
			악어 구렁이 살모사 독사 코브라 방울뱀 비단뱀 이구아나
		`),
		// A word of a creature theme that is no creature: it takes no verb and no state.
		lifeless: words(`
			마법 마력 주문 저주 예언 신탁 결계 성배 마검 부적 룬 봉인 환영 마술 도술 술법 마법진 명계 장승 호신부 호부 룬문자 인장술 문양술 저주술
			축복술 징조 전조 예언서 신화집 전설집
		`),
		// A word of the place class that is no place.
		placeless: words(`
			얼음 파도 물결 모래 조약돌 지진 밀물 썰물 그림자 메아리 향기 불꽃 잿불 산호 물보라 빙퇴석 너덜 바윗돌 암반 간헐천 분기공 종유석 석순 해일
			지평 수평
			별 태양 별자리 유성 오로라 초승달 보름달 별똥별 일식 월식 코로나 극광 별무리 천정 위성 혜성 성단 북극성 샛별 궤도 중력 자전 공전 흑점 태양풍
			광년 천체 성간 항성 성좌 천구 황도 초신성 유성우 우주먼지 그믐달 반달 하현달 상현달 만월 신월 월광 성광
		`)
	},
	interjections: words(`
		아, 오, 와, 어머, 이런, 저런, 세상에, 아이고, 참, 어이쿠, 아이참, 어라, 우와, 이야,
		아하, 오호, 오오, 허허, 어머나, 아뿔싸, 맙소사, 이럴수가, 웬걸, 아차, 옳지, 후유, 에구, 어이구, 저기,
	`),
	// Korean leaves the subject out as readily as it writes 그것, and the empty
	// entry is how the data says so.
	pronouns: { n: ['', '그것'] },
	// And an object it has named is left out the next time: `소시지를 끓여서 먹었다`.
	objectPronouns: { words: { n: [''] } },
	// A line of the hero's own drops its subject, the way a spoken sentence does.
	speech: { subject: '' },
	// And 그것 is a thing: a person and an animal are referred to by leaving the
	// subject out.
	pronounless: ['person', 'creature'],
	// How much a state holds, in front of it: `무척 피곤하다`.
	degrees: words(`
		무척 아주 정말 몹시 꽤 조금 너무 한층 제법 참 유난히 사뭇 퍽 살짝 다소 상당히 매우 유독 한결 더없이 워낙 되게 엄청
	`),
	// And 그것 is a thing: a person, an animal, a place and what happens are
	// referred to by leaving the subject out — `그것이 안개에 잠긴다` is no way to
	// say a valley does.
	pronounless: ['person', 'creature', 'place', 'event'],
	// Korean counts anything, because a classifier is what makes a noun countable:
	// `가지` turns an abstraction into kinds of it. The counter is spaced off the
	// number, which is what 한글 맞춤법 prescribes as the default.
	numeral: {
		order: 'after',
		counters: {
			creature: '마리',
			person: '명',
			plant: '그루',
			edible: '개',
			thing: '개',
			vehicle: '대',
			place: '곳',
			event: '번',
			idea: '가지',
			body: '개'
		},
		count: [2, 12],
		currency: '원',
		amounts: [1000, 5000, 10000, 30000, 50000, 100000, 300000, 500000, 1000000],
		group: ',',
		gap: ''
	},
	// Korean writes a date largest to smallest and a clock the same way, and its
	// copula is written onto the end of what it equates the subject to. Both close
	// on a coda — `일`, `분` — so `이다` never has to contract to `다`.
	calendar: {
		date: 'Y년 M월 D일',
		clock: 'h시 mm분',
		years: [2020, 2030],
		copula: {
			// An event is a thing that happens on a day, and a lion is not.
			subject: ['event'],
			words: words(`이다`),
			forms: {
				question: words(`이니|인가`),
				exclamation: words(`이구나|이네`),
				casual: words(`이야`),
				casualQuestion: words(`이야|이지`),
				polite: words(`이에요`),
				politeQuestion: words(`이에요|이죠`),
				formal: words(`입니다`),
				formalQuestion: words(`입니까`)
			},
			past: conjugate(`이었`, PAST)
		}
	},
	frames: [
		// A date and a clock, standing where an adverbial stands.
		{
			parts: [
				{ slot: 'date', tail: '에' },
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		{
			parts: [
				{ slot: 'clock', tail: '에' },
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		// And the shape that equates the subject to one, which is what the copula is
		// for: `면접은 2026년 9월 5일이다.`
		{
			parts: [
				{ slot: 'subject', tail: '는', tailAlt: '은' },
				{ slot: 'date', copula: 'tail' }
			],
			weight: 4
		},
		{
			parts: [
				{ slot: 'subject', tail: '는', tailAlt: '은' },
				{ slot: 'clock', copula: 'tail' }
			],
			weight: 4
		},
		{
			parts: [{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true }, { slot: 'verb' }],
			weight: 20
		},
		{
			parts: [
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'object', tail: '를', tailAlt: '을', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 18
		},
		{
			parts: [
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'place', tail: '에서', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 14
		},
		// Where the subject is going, and where it arrives. `로` is the one Korean
		// particle that treats `ㄹ` as a vowel — `시장으로`, `마을로` — and `에`
		// after a verb of arriving: `집에 돌아온다`.
		{
			parts: [
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'destination', tail: '로', tailAlt: '으로', tailLiquid: '로', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 8,
			fields: ['go']
		},
		{
			parts: [
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'destination', tail: '에', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 8,
			fields: ['arrive']
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'destination', tail: '로', tailAlt: '으로', tailLiquid: '로', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 4,
			fields: ['go']
		},
		{
			parts: [
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'manner' },
				{ slot: 'destination', tail: '에', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 3,
			fields: ['arrive']
		},
		{
			parts: [{ slot: 'subject', tail: '는', tailAlt: '은', modifiable: true }, { slot: 'state' }],
			weight: 12
		},
		// A state with how much of it in front, and one with when: `여우는 무척
		// 피곤하다`, `저녁에 여우는 피곤했다`. A state sentence is a subject and one
		// word otherwise, and a paragraph of those is a list.
		{
			parts: [
				{ slot: 'subject', tail: '는', tailAlt: '은', modifiable: true },
				{ slot: 'degree' },
				{ slot: 'state' }
			],
			weight: 9
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', tail: '는', tailAlt: '은', modifiable: true },
				{ slot: 'state' }
			],
			weight: 5
		},
		{
			parts: [
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'manner' },
				{ slot: 'verb' }
			],
			weight: 10
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 8
		},
		{
			parts: [
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'place', tail: '에서', modifiable: true },
				{ slot: 'object', tail: '를', tailAlt: '을', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 7
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'place', tail: '에서', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 6
		},
		{
			parts: [
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'manner' },
				{ slot: 'object', tail: '를', tailAlt: '을', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 5
		},
		{
			parts: [
				{ slot: 'time' },
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'object', tail: '를', tailAlt: '을', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 4
		},
		{
			parts: [
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'place', tail: '에서', modifiable: true },
				{ slot: 'manner' },
				{ slot: 'object', tail: '를', tailAlt: '을', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 3
		},
		// Korean asks with a different ending on the same predicate, so the shapes
		// are the statement's and `forms.question` does the rest.
		{
			parts: [{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true }, { slot: 'verb' }],
			weight: 20,
			mood: 'question'
		},
		{
			parts: [
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'object', tail: '를', tailAlt: '을', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 16,
			mood: 'question'
		},
		{
			parts: [{ slot: 'subject', tail: '는', tailAlt: '은', modifiable: true }, { slot: 'state' }],
			weight: 14,
			mood: 'question'
		},
		{
			parts: [
				{ slot: 'subject', tail: '는', tailAlt: '은', modifiable: true },
				{ slot: 'degree' },
				{ slot: 'state' }
			],
			weight: 6,
			mood: 'question'
		},
		{
			parts: [
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'place', tail: '에서', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 12,
			mood: 'question'
		},
		{
			parts: [
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'destination', tail: '로', tailAlt: '으로', tailLiquid: '로', modifiable: true },
				{ slot: 'verb' }
			],
			weight: 6,
			mood: 'question',
			fields: ['go']
		},
		// A count and an amount. Money is an object of the verbs that take an idea,
		// which is the class it belongs to.
		{
			parts: [
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'quantity', tail: '를', tailAlt: '을' },
				{ slot: 'verb' }
			],
			weight: 6
		},
		{
			parts: [{ slot: 'quantity', tail: '가', tailAlt: '이' }, { slot: 'verb' }],
			weight: 5
		},
		{
			parts: [
				{ slot: 'subject', tail: '가', tailAlt: '이', modifiable: true },
				{ slot: 'money', tail: '를', tailAlt: '을' },
				{ slot: 'verb' }
			],
			weight: 5
		}
	]
};
