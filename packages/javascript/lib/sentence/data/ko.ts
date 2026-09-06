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
			...koVerbs(`일어나:일어나:서 일어서:일어서:서 깨어나:깨어나:서 눈뜨:눈떠:서`)
		},
		// Setting off: the verbs that need somewhere to go, and the ones that stand on
		// their own. `향한다` wants a `시장으로` in front of it; `떠난다` does not.
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			...koVerbs(`가:가:서 향하:향해:서 올라가:올라가:서 내려가:내려가:서`)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			requires: 'destination',
			// Running somewhere is for legs: a fish and a snake go, and do not run.
			subjectWithout: ['swimmer', 'crawler'],
			...koVerbs(`달려가:달려가:서`)
		},
		{
			field: 'go',
			subject: ['creature', 'person'],
			...koVerbs(`떠나:떠나:서 나서:나서:서 출발하:출발해:서 길을떠나:길을떠나:서`)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			requires: 'destination',
			...koVerbs(`들어오:들어와:서 닿:닿아:서 이르:이르러:서 다다르:다다라:서 들어서:들어서:서`)
		},
		{
			field: 'arrive',
			subject: ['creature', 'person'],
			...koVerbs(`돌아오:돌아와:서 도착하:도착해:서 돌아가:돌아가:서 귀가하:귀가해:서`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// Running and walking are for legs: a fish and a snake do neither.
			subjectWithout: ['swimmer', 'crawler'],
			...koVerbs(
				`달리:달려 걷:걸어 뛰:뛰어 서성이:서성여 지나가:지나가 어슬렁대:어슬렁대 뛰어다니:뛰어다녀 거닐:거닐어 산책하:산책해`
			)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A fish's, a whale's and a mermaid's; a lion does not swim here.
			subjectTraits: ['swimmer'],
			...koVerbs(`헤엄치:헤엄쳐`)
		},
		{
			field: 'move',
			subject: ['creature', 'person'],
			// A snake's, a snail's and a beetle's.
			subjectTraits: ['crawler'],
			...koVerbs(`기어가:기어가`)
		},
		{
			// Taking off is a flier's alone: a sparrow's, a dragon's, never a fish's.
			field: 'move',
			subject: ['creature'],
			subjectTraits: ['flier'],
			...koVerbs(`날아오르:날아올라`)
		},
		{
			field: 'wait',
			subject: ['creature', 'person'],
			...koVerbs(
				`기다리:기다려 두리번거리:두리번거려 숨:숨어 뒤척이:뒤척여 머뭇거리:머뭇거려 기웃거리:기웃거려 멈추:멈춰 멈춰서:멈춰서`
			)
		},
		{
			field: 'rest',
			subject: ['creature', 'person'],
			...koVerbs(`쉬:쉬어 앉:앉아:서 눕:누워:서 웅크리:웅크려 드러눕:드러누워:서`)
		},
		{
			field: 'sleep',
			subject: ['creature', 'person'],
			...koVerbs(`잠자:잠자 잠들:잠들어 졸:졸아 꾸벅이:꾸벅여`)
		},
		{
			field: 'express',
			subject: ['creature', 'person'],
			...koVerbs(
				`웃:웃어 울:울어 하품하:하품해 한숨짓:한숨지어 미소짓:미소지어 콧노래하:콧노래해 중얼거리:중얼거려 소리치:소리쳐`
			)
		},
		{
			field: 'talk',
			subject: ['creature', 'person'],
			...koVerbs(`이야기하:이야기해 수다떨:수다떨어 대화하:대화해`)
		},
		{
			field: 'play',
			subject: ['creature', 'person'],
			...koVerbs(
				`춤추:춤춰 노래하:노래해 뒹굴:뒹굴어 뛰놀:뛰놀아 장난치:장난쳐 뛰어오르:뛰어올라 폴짝거리:폴짝거려 구르:굴러`
			)
		},
		{
			field: 'think',
			subject: ['person', 'creature'],
			object: ['idea', 'event', 'place'],
			...koVerbs(
				`꿈꾸:꿈꿔 기억하:기억해 잊:잊어 상상하:상상해 헤아리:헤아려 떠올리:떠올려 그리워하:그리워해 궁금해하:궁금해해`
			)
		},
		{
			field: 'look',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'plant', 'food', 'drink'],
			...koVerbs(
				`보:봐 바라보:바라봐 살피:살펴 들여다보:들여다봐 구경하:구경해 만지:만져 쓰다듬:쓰다듬어 지켜보:지켜봐`
			)
		},
		{
			field: 'search',
			subject: ['creature', 'person'],
			...koVerbs(`찾아다니:찾아다녀 헤매:헤매 둘러보:둘러봐 살펴보:살펴봐`)
		},
		{
			field: 'find',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'plant', 'food', 'drink'],
			...koVerbs(`찾:찾아:서 발견하:발견해 줍:주워:서 찾아내:찾아내:서`)
		},
		{
			field: 'take',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'plant', 'food', 'drink'],
			...koVerbs(
				`챙기:챙겨:서 고르:골라:서 집:집어:서 얻:얻어:서 받:받아:서 꺼내:꺼내:서 움켜쥐:움켜쥐어`
			)
		},
		{
			field: 'carry',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'plant', 'food', 'drink'],
			...koVerbs(`옮기:옮겨 나르:날라 가져오:가져와:서 들고오:들고와:서 안고오:안고와:서`)
		},
		{
			field: 'hide',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'plant', 'food', 'drink'],
			...koVerbs(`감추:감춰 숨기:숨겨 넣어두:넣어둬 간직하:간직해 묻:묻어 챙겨두:챙겨둬`)
		},
		{
			field: 'lose',
			subject: ['creature', 'person'],
			object: ['thing', 'plant', 'edible'],
			// What one can hold, and so can lose.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'plant', 'food', 'drink'],
			...koVerbs(`잃어버리:잃어버려 떨어뜨리:떨어뜨려 놓치:놓쳐`)
		},
		{
			field: 'meet',
			subject: ['creature', 'person'],
			object: ['person'],
			...koVerbs(`만나:만나 마주치:마주쳐`)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'vehicle'],
			...koVerbs(`만들:만들어 짓:지어 빚:빚어 그리:그려 엮:엮어`)
		},
		{
			field: 'make',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			// Assembled or carved: an object, a tool or a vehicle, never a song or a gem.
			objectThemes: ['object', 'tool', 'vehicle'],
			...koVerbs(`조립하:조립해 깎:깎아`)
		},
		{
			field: 'tend',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'vehicle'],
			...koVerbs(
				`고치:고쳐 닦:닦아 손질하:손질해 다듬:다듬어 정리하:정리해 매만지:매만져 수리하:수리해`
			)
		},
		{
			field: 'sell',
			subject: ['person'],
			object: ['thing', 'vehicle'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'vehicle'],
			...koVerbs(`팔:팔아 넘기:넘겨 건네:건네 내놓:내놓아`)
		},
		{
			field: 'buy',
			subject: ['person'],
			object: ['thing', 'vehicle', 'edible'],
			// What one can hold: an instrument is, and a song is not.
			objectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'vehicle', 'food', 'drink'],
			...koVerbs(`사:사:서 사오:사와:서 구하:구해:서 장만하:장만해:서 사들이:사들여:서`)
		},
		{
			field: 'cook',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...koVerbs(`굽:구워:서 데우:데워:서 끓이:끓여:서 요리하:요리해:서 썰:썰어:서 담:담아:서`)
		},
		{
			field: 'eat',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['food'],
			...koVerbs(`먹:먹어 씹:씹어 삼키:삼켜 맛보:맛봐 베어먹:베어먹어 먹어치우:먹어치워`)
		},
		{
			field: 'drink',
			subject: ['creature', 'person'],
			object: ['edible'],
			objectThemes: ['drink'],
			...koVerbs(`마시:마셔 들이키:들이켜 홀짝이:홀짝여 음미하:음미해`)
		},
		// What a place does on its own is what a story's scene is made of: it goes
		// quiet, darkens, fills up. What an event does is a different list, so the
		// two are apart — a market does not set the way a day does.
		{
			field: 'change',
			subject: ['place'],
			...koVerbs(
				`조용해지:조용해져 어두워지:어두워져 밝아오:밝아와 고요해지:고요해져 붐비:붐벼 물들:물들어 환해지:환해져 잠잠해지:잠잠해져`
			)
		},
		{
			field: 'change',
			subject: ['event'],
			...koVerbs(`흐르:흘러 시작되:시작돼 끝나:끝나 이어지:이어져 지나가:지나가`)
		},
		{
			field: 'change',
			subject: ['event'],
			// A season deepens and a sky shines; a match does neither.
			subjectThemes: ['time', 'weather'],
			...koVerbs(`빛나:빛나 저물:저물어 깊어지:깊어져`)
		},
		{
			field: 'change',
			subject: ['thing', 'vehicle'],
			// What a thing one can hold does. A song is a thing of another kind, below.
			subjectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'vehicle'],
			...koVerbs(
				`흔들리:흔들려 반짝이:반짝여 떨어지:떨어져 굴러가:굴러가 기울어지:기울어져 낡아가:낡아가`
			)
		},
		{
			field: 'change',
			subject: ['thing'],
			subjectThemes: ['music'],
			...koVerbs(`울리:울려 흐르:흘러 퍼지:퍼져 잦아들:잦아들어 이어지:이어져`)
		},
		{
			field: 'move',
			subject: ['vehicle'],
			...koVerbs(`달리:달려 멈추:멈춰 지나가:지나가 돌아오:돌아와 출발하:출발해 미끄러지:미끄러져`)
		},
		{
			field: 'change',
			subject: ['idea', 'event'],
			...koVerbs(`번지:번져 사라지:사라져 남:남아 스며들:스며들어 되풀이되:되풀이돼 짙어지:짙어져`)
		},
		{
			field: 'change',
			subject: ['plant'],
			...koVerbs(`자라:자라 시들:시들어 피어나:피어나 흔들리:흔들려 뿌리내리:뿌리내려`)
		},
		{
			field: 'change',
			subject: ['body'],
			...koVerbs(`떨리:떨려 움직이:움직여 저리:저려 굳:굳어`)
		},
		{
			field: 'change',
			subject: ['edible'],
			...koVerbs(`식:식어 끓:끓어 상하:상해 남:남아`)
		},
		{
			field: 'change',
			subject: ['edible'],
			// Ripening and melting are what food does; a drink cools, boils and spoils.
			subjectThemes: ['food'],
			...koVerbs(`익:익어 녹:녹아`)
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
			`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'hungry',
			...koStates(`배고프:배고파:배고픈 허기지:허기져:허기진`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'full',
			...koStates(`배부르:배불러:배부른 든든하:든든해:든든한`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'tired',
			...koStates(`피곤하:피곤해:피곤한 졸리:졸려:졸린 나른하:나른해:나른한 고단하:고단해:고단한`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'rested',
			...koStates(`상쾌하:상쾌해:상쾌한 개운하:개운해:개운한 활기차:활기차:활기찬`)
		},
		{
			subject: ['creature', 'person'],
			condition: 'content',
			...koStates(
				`기쁘:기뻐:기쁜 즐겁:즐거워:즐거운 편안하:편안해:편안한 만족스럽:만족스러워:만족스러운 행복하:행복해:행복한 뿌듯하:뿌듯해:뿌듯한`
			)
		},
		{
			subject: ['creature', 'person'],
			condition: 'restless',
			...koStates(
				`심심하:심심해:심심한 궁금하:궁금해:궁금한 초조하:초조해:초조한 답답하:답답해:답답한`
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
			...koStates(
				`아름답:아름다워:아름다운 낯설:낯설어:낯선 새롭:새로워:새로운 흔하:흔해:흔한 드물:드물어:드문`
			)
		},
		{
			subject: ['place'],
			...koStates(
				`넓:넓어:넓은 좁:좁아:좁은 고요하:고요해:고요한 깊:깊어:깊은 어둡:어두워:어두운 밝:밝아:밝은 아득하:아득해:아득한 가파르:가팔라:가파른`
			)
		},
		{
			subject: ['event'],
			...koStates(
				`길:길어:긴 짧:짧아:짧은 요란하:요란해:요란한 고요하:고요해:고요한 갑작스럽:갑작스러워:갑작스러운`
			)
		},
		{
			subject: ['thing', 'vehicle'],
			// What a thing one can hold is like. A song is a thing of another kind, below.
			subjectThemes: ['object', 'tool', 'clothing', 'product', 'gem', 'vehicle'],
			...koStates(`
				단단하:단단해:단단한 가볍:가벼워:가벼운 무겁:무거워:무거운 매끈하:매끈해:매끈한 투명하:투명해:투명한 튼튼하:튼튼해:튼튼한 반들반들하:반들반들해:반들반들한
			`)
		},
		{
			subject: ['thing'],
			subjectThemes: ['music'],
			...koStates(
				`잔잔하:잔잔해:잔잔한 경쾌하:경쾌해:경쾌한 구슬프:구슬퍼:구슬픈 감미롭:감미로워:감미로운 흥겹:흥겨워:흥겨운`
			)
		},
		{
			subject: ['edible'],
			...koStates(`달:달아:단 시:셔:신 뜨겁:뜨거워:뜨거운 차갑:차가워:차가운`)
		},
		{
			subject: ['edible'],
			// Spicy, salty, nutty and plain are a dish's; a drink is sweet, sour, hot or cold.
			subjectThemes: ['food'],
			...koStates(`짜:짜:짠 맵:매워:매운 고소하:고소해:고소한 담백하:담백해:담백한`)
		},
		{
			subject: ['idea'],
			...koStates(
				`분명하:분명해:분명한 흐릿하:흐릿해:흐릿한 영원하:영원해:영원한 덧없:덧없어:덧없는`
			)
		},
		{
			subject: ['idea'],
			// Hard and easy are a thought's, a machine's or a debt's, not a colour's or a mood's.
			subjectThemes: ['concept', 'tech', 'finance'],
			...koStates(`어렵:어려워:어려운 쉽:쉬워:쉬운`)
		},
		{
			subject: ['idea'],
			subjectThemes: ['color'],
			...koStates(
				`짙:짙어:짙은 옅:옅어:옅은 선명하:선명해:선명한 화사하:화사해:화사한 은은하:은은해:은은한`
			)
		},
		{
			subject: ['plant'],
			...koStates(
				`푸르:푸르러:푸른 무성하:무성해:무성한 향기롭:향기로워:향기로운 시들하:시들해:시들한`
			)
		},
		{
			subject: ['body'],
			...koStates(`따뜻하:따뜻해:따뜻한 차갑:차가워:차가운 아프:아파:아픈 뻣뻣하:뻣뻣해:뻣뻣한`)
		}
	],
	// Attributive forms, grouped by what they can sit in front of. A nickname's
	// pool is allowed `맑은 기계공`; a sentence is not.
	modifiers: [
		{
			subject: ['creature', 'person'],
			words: words(`
				용감한 씩씩한 다정한 부지런한 게으른 수줍은 영리한 어린 늙은 작은 커다란 조용한 명랑한 느긋한 재빠른 호기심어린 명민한 씩씩한 의젓한 천진한
			`)
		},
		{ subject: ['person'], words: words(`젊은 친절한 엄격한 진지한 바쁜 성실한 낯선 유쾌한`) },
		{ subject: ['creature'], words: words(`날쌘 사나운 순한 겁많은 통통한 조그만`) },
		{
			subject: ['edible'],
			themes: ['food'],
			words: words(
				`달콤한 매콤한 따뜻한 신선한 바삭한 고소한 향긋한 뜨거운 짭짤한 말랑한 촉촉한 새콤한 먹음직한 담백한`
			)
		},
		{
			subject: ['edible'],
			themes: ['drink'],
			words: words(`달콤한 따뜻한 차가운 시원한 뜨거운 향긋한 신선한 새콤한 진한 씁쓸한 시원한`)
		},
		{
			subject: ['thing', 'vehicle'],
			words: words(
				`낡은 새로운 작은 커다란 가벼운 무거운 반짝이는 매끈한 투명한 단단한 예쁜 소중한 오래된 반듯한`
			)
		},
		{ subject: ['vehicle'], words: words(`빠른 느린 덜컹거리는 튼튼한`) },
		{
			subject: ['place'],
			words: words(
				`고요한 넓은 어두운 밝은 낯선 오래된 아늑한 한적한 북적이는 조용한 외딴 먼 가까운 텅빈 쓸쓸한 환한`
			)
		},
		{ subject: ['plant'], words: words(`푸른 무성한 향기로운 어린 시든 커다란 작은 여린 싱싱한`) },
		{
			subject: ['idea'],
			words: words(`희미한 오래된 새로운 낯선 분명한 소중한 작은 엉뚱한 막연한`)
		},
		{ subject: ['event'], words: words(`긴 짧은 조용한 화창한 흐린 요란한 갑작스러운 느긋한`) },
		{ subject: ['body'], words: words(`작은 차가운 따뜻한 튼튼한 여린`) },
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
			words: words(`아름다운 신비한 낯선 새로운`)
		}
	],
	// How something is done, by what can do it that way. A fox may act 부지런히
	// and a river may not; a river flows 서서히 and 여전히, which a fox arriving
	// somewhere does not.
	manners: [
		{
			subject: ['creature', 'person'],
			words: words(`
				조용히 천천히 빠르게 가만히 슬며시 홀로 잠시 갑자기 조심스레 힘차게 살며시 묵묵히 느긋하게 씩씩하게 훌쩍 곧장 슬쩍 사뿐히 성큼성큼 부지런히 유유히
				냉큼 차분히 은근히 대뜸 나직이 느릿느릿 재빨리 가볍게 얌전히 무심히 덤덤히 성실히 신나게 살짝 부리나케 천연덕스럽게
			`)
		},
		{
			subject: ['plant', 'edible', 'thing', 'vehicle', 'place', 'event', 'idea', 'body'],
			words: words(
				`조용히 천천히 서서히 문득 다시 계속 잠시 갑자기 언제나 여전히 은은히 살며시 가만히 슬며시 조금씩 차츰 점점 어느새 고요히`
			)
		}
	],
	// Sorted by what a paragraph has to know: the phases of a day in order, what
	// fits any tense, and what names one.
	times: {
		day: words(`새벽에 이른아침에 아침에 한낮에 오후에 해질녘에 초저녁에 저녁에 밤에 한밤중에`),
		any: words(`봄에 여름에 가을에 겨울에 주말에 휴일에 명절에 장마철에 이른봄에 늦가을에 새해에`),
		past: words(`어제 지난주에 오래전에 한때 그날 그때 며칠전에 지난밤에`),
		present: words(`오늘 방금 이제 내일 다음주에`),
		habitual: words(`요즘 가끔 매일 자주 이따금`)
	},
	homes: words(`집`),
	// Two clauses are joined on the first one's predicate, in the `linking` form
	// each group writes: `집에 돌아와서 사과를 먹었다`. The tense stays on the last
	// clause, which is where Korean puts it.
	join: { form: 'linking' },
	// What a sentence opens on when it follows another. Written whole, so a
	// language that wants a comma after its connective writes the comma.
	connectives: {
		additive: words(`그리고 게다가 그러고는`),
		temporal: words(`이윽고 곧 그러자 이내 어느새 마침내 그제야 한편 그러고나서 잠시후 얼마뒤`),
		contrastive: words(`하지만 그런데 그러나 다만 오히려 그래도`),
		causal: words(`그래서 그러므로 결국 그러니`)
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
