// Internal shape of the per-language sentence datasets. Not part of the public
// API — consumers only ever see `RandSentenceOptions` and `SentenceDetail`.
//
// One dataset per language, beside `word/data` rather than inside it. The word
// pools hold nouns and the words that sit in front of them; a sentence needs
// what neither of those is — a verb in the form a sentence ends on, an adjective
// in the form a predicate takes, and the shapes the language's own grammar
// allows. So the nouns are still drawn from `word/data`, and everything a
// sentence adds to them lives here.

import type { SentenceQuote, SentenceSlot, SentenceType, WordTheme } from '../../_types/global.js';
import type { WordAgreement, WordGender, WordPool } from '../../word/data/types.js';

/**
 * The kind of thing a noun names, which is what makes a sentence hold together:
 * a verb states the classes it accepts, and the nouns beside it are drawn from
 * those classes alone. `사자가 사과를 먹는다` and `사자가 철학을 먹는다` differ by
 * nothing else.
 *
 * Derived from `WordTheme`, so no noun carries a tag of its own — a theme is
 * already a slice of vocabulary, and which of these it falls into is the same in
 * every language. `THEME_CLASS` is where that map is written.
 */
export type NounClass =
	| 'creature'
	| 'person'
	| 'plant'
	| 'edible'
	| 'thing'
	| 'vehicle'
	| 'place'
	| 'event'
	| 'idea'
	| 'body';

/**
 * A form a predicate takes beside the one a plain statement ends on. `question`
 * is Korean `달리니` beside `달린다` and English `run` beside `runs`;
 * `exclamation` is `달리는구나`, `casual` `달려`, `polite` `달려요` and `formal`
 * `달립니다`.
 *
 * A form rather than another pool: the same verbs, said differently. Every form
 * pool is index-aligned with `words`, so a verb keeps its meaning across them and
 * a word the caller required can be translated into the form the sentence needs.
 *
 * A group declares only what its language actually writes, and each level falls
 * back along its own chain to the plain statement the `words` already are. That
 * is why Japanese declares `polite` alone: `走ります` is its formal form and its
 * polite question too, because the `か` that asks is the frame's tag rather than
 * part of the verb.
 */
export type PredicateForm =
	| 'question'
	| 'exclamation'
	| 'casual'
	| 'casualQuestion'
	| 'polite'
	| 'politeQuestion'
	| 'formal'
	| 'formalQuestion'
	| 'linking';

/**
 * `casualQuestion` and `politeQuestion` are 해체 and 해요체 asking. Those two
 * levels have no question of their own — `달려?` asks with the mark alone — but
 * they have an ending that only asks well: `달리지?` and `달리죠?` invite the
 * listener to agree, and a statement closing on it in every other line reads as
 * somebody looking for a nod. So the plain pool holds `달려` and `달려요`, and the
 * question pool holds both endings.
 */

/**
 * `linking` is the form a predicate takes when its clause is not the last one of
 * the sentence — Korean `돌아오고` or `돌아와서` beside `돌아온다`, Japanese `戻って`
 * beside `戻る`. It carries no tense of its own, so it lives in the present forms
 * alone and the clause after it decides when everything happened. A language that
 * joins its clauses with a word rather than a form (`and`, `y`, `и`) declares none.
 *
 * The forms a group declares, beside the plain statement its `words` are in.
 * Every one of them is index-aligned with `words`.
 *
 * `casual` and `polite` carry no mood of their own because in Korean they have
 * none: `달려` is the statement, the question and the exclamation, and only the
 * mark after it differs. `formal` is the level that does move for a question,
 * which is why it is the only one with a `formalQuestion` beside it.
 *
 * An entry may write more than one ending with `|` between them, and one of
 * them is drawn. That is what keeps a pool index-aligned with `words` while
 * `달리니|달리나|달리는가` is still one entry for one verb — a Korean question
 * has several endings and a generator that only ever wrote the first would
 * close every sentence the same way.
 */
export type PredicateForms = Partial<Record<PredicateForm, WordPool>>;

/**
 * What a verb does, as coarsely as a story needs to know it. A step of a story
 * asks for a field rather than for a word — "the hero eats something" — and the
 * language answers with any verb it has filed there, which is what lets one story
 * be told in nine languages and never twice the same way.
 *
 * - The hero on the move: `rise` (gets up), `go` (sets off, towards a
 *   destination), `arrive` (comes back, reaches), `move` (runs, swims, wanders,
 *   with no destination), `wait` (waits, lingers, looks around).
 * - The hero at rest: `rest`, `sleep`.
 * - The hero showing something: `express` (laughs, cries, yawns), `play` (dances,
 *   tumbles, sings), `think` (remembers, imagines — takes an idea).
 * - The hero and a thing: `look`, `search` (with no object; the place is what is
 *   searched), `find`, `take`, `carry`, `hide`, `make`, `tend` (mends, cleans),
 *   `sell`, `buy`, `cook`, `eat`, `drink`.
 * - `change` is everything that happens to something that is not a hero: a place
 *   darkens, an apple ripens, a flag sways.
 *
 * `FIELD_RULES` in `data/index.ts` says what each field needs to be true first
 * and what it leaves true afterwards, which is the whole of the story's memory.
 */
export type VerbField =
	| 'rise'
	| 'go'
	| 'arrive'
	| 'move'
	| 'wait'
	| 'rest'
	| 'sleep'
	| 'express'
	| 'play'
	| 'think'
	| 'look'
	| 'search'
	| 'find'
	| 'take'
	| 'carry'
	| 'hide'
	| 'make'
	| 'tend'
	| 'sell'
	| 'buy'
	| 'cook'
	| 'eat'
	| 'drink'
	| 'change';

/**
 * What can be true of a story's hero at one moment, which is what a state
 * sentence says and what an action changes. `holding` is the one that is about a
 * thing rather than a feeling: it is what `eat`, `carry` and `sell` need and what
 * `find`, `take`, `buy` and `make` leave behind.
 */
export type Condition =
	| 'awake'
	| 'asleep'
	| 'hungry'
	| 'full'
	| 'tired'
	| 'rested'
	| 'away'
	| 'home'
	| 'holding'
	| 'content'
	| 'restless';

/**
 * The same predicates in another tense: the statement form in `words` and the
 * moods and levels in `forms`, both index-aligned with the present-tense pools
 * of the group. A group declares what its language writes — Korean and Japanese
 * every level, English only the statement and its question's base form — and
 * leaves the tense out entirely where the language does not inflect for it.
 */
export type PredicateTense = {
	words: WordPool;
	forms?: PredicateForms;
};

/**
 * Verbs that take the same arguments and do the same kind of thing. Written as a
 * group rather than one tagged entry per verb, because the tags are the
 * interesting part and a group of ten verbs shares them: they all say what can do
 * the doing, what it can be done to, and — for a story — what sort of doing it is.
 */
export type VerbGroup = {
	/** What these verbs do, as a story asks for it. */
	field: VerbField;
	/** Classes a noun has to belong to to be the subject of these verbs. */
	subject: readonly NounClass[];
	/**
	 * The themes the subject may come from, when a class is too wide: `익는다` is a
	 * thing food does and drink does not, and `울린다` is a thing a song does and a
	 * spoon does not. Left out where the class alone is right. A theme narrowed
	 * out of one group has to be accepted by another of the same field, and
	 * `test/sentence.test.ts` asserts it is.
	 */
	subjectThemes?: readonly WordTheme[];
	/**
	 * A trait the subject has to carry, one of these: `날아오른다` takes a `flier`,
	 * `헤엄친다` a `swimmer`. Left out by a group that asks for none.
	 */
	subjectTraits?: readonly NounTrait[];
	/**
	 * Traits the subject may not carry: `달린다` and `걷는다` take no `swimmer` and
	 * no `crawler`. A noun with no trait at all passes.
	 */
	subjectWithout?: readonly NounTrait[];
	/** Classes it can take as a direct object. Left out by an intransitive group. */
	object?: readonly NounClass[];
	/**
	 * The themes the object may come from, when a class is too wide: `eat` takes an
	 * edible and `drink` takes an edible, and a lion that drinks a pretzel is the
	 * difference. Left out where the class alone is right.
	 */
	objectThemes?: readonly WordTheme[];
	/**
	 * A part the shape has to carry for these verbs to make sense. `향한다` and
	 * `heads` want somewhere to head to, where `떠난다` and `leaves` stand on their
	 * own; a group that names a slot is drawn only for a shape that has it.
	 */
	requires?: SentenceSlot;
	/** The verbs themselves, in the form a plain statement ends on (`달린다`, `runs`). */
	words: WordPool;
	/**
	 * The same verbs in another form, index-aligned with `words`. Left out by a
	 * language whose verb does not change — Chinese, Vietnamese, Spanish, Italian
	 * and Russian ask a question with the mark alone.
	 */
	forms?: PredicateForms;
	/**
	 * The same verbs in the past, index-aligned with `words`. Left out by a language
	 * that marks the past with a word beside the verb rather than on it — Chinese
	 * `了`, Vietnamese `đã` — which is `pastMark`'s business.
	 */
	past?: PredicateTense;
};

/**
 * Predicate adjectives that describe the same kinds of thing, grouped the way
 * verbs are. Its own pool rather than `word/data`'s `adjectives`, which are
 * written to sit in front of a noun: Korean `파란` cannot end a sentence and
 * `파랗다` cannot start a noun phrase.
 */
export type StateGroup = {
	/** Classes a noun has to belong to to be described by these. */
	subject: readonly NounClass[];
	/** The themes the subject may come from, when a class is too wide — see `VerbGroup`. */
	subjectThemes?: readonly WordTheme[];
	/**
	 * What these adjectives say is true of the subject, for a story to read and to
	 * write. `배고프다` is `hungry` and `피곤하다` is `tired`; `크다` is neither, and a
	 * group of traits like it leaves this out.
	 */
	condition?: Condition;
	/**
	 * What is written in front of these instead of the shape's own head, in a
	 * language whose copula depends on what is said: Spanish `es valiente` and
	 * `está cansado` are two verbs, and only the group knows which its words take.
	 * `pastHead` is the same in the past (`era`, `estaba`).
	 */
	head?: string;
	pastHead?: string;
	words: WordPool;
	/** The same adjectives in another form, index-aligned with `words`. */
	forms?: PredicateForms;
	/** The same adjectives in the past, index-aligned with `words`. */
	past?: PredicateTense;
};

/**
 * Attributive modifiers that fit the same kinds of noun, grouped the way the
 * states are. `word/data`'s `adjectives` are what a nickname is built from, and
 * a nickname is allowed to be a joke — `맑은기계공` is a handle. A sentence is
 * not, so it draws its modifiers from here instead, and `맑은` sits in front of a
 * place or a drink and never in front of a mechanic.
 */
export type ModifierGroup = {
	/** Classes a noun has to belong to to carry one of these. */
	subject: readonly NounClass[];
	/**
	 * The themes it may belong to, when a class is too wide: a soup is `매콤한`
	 * and a tea is not, though both are edible.
	 */
	themes?: readonly WordTheme[];
	/** Base forms, which `agree` reshapes in a language that inflects. */
	words: WordPool;
};

/**
 * One phrase of a shape, with whatever the language writes around it.
 *
 * Both sides, because languages mark a phrase on either: Korean and Japanese
 * suffix a particle, English and Chinese put a preposition in front, and a
 * language can want both at once (Chinese `在` … `里`).
 */
export type SentencePart = {
	slot: SentenceSlot;
	/** Written in front of the phrase (`in`, `在`, `is`). */
	head?: string;
	/**
	 * What `head` becomes in a past-tense sentence, for a language whose auxiliary
	 * or copula carries the tense: English `does` is `did` and `is` is `was`,
	 * Spanish `es` is `era`. Left out where the head does not change.
	 */
	pastHead?: string;
	/** Written after it (`가`, `が`, `里`). */
	tail?: string;
	/**
	 * Used instead of `tail` when the word in front of it ends on a consonant.
	 * That is the whole of Korean particle alternation — `사자가` beside `사슴이`
	 * — and a language whose particles do not alternate leaves it out.
	 */
	tailAlt?: string;
	/**
	 * Used instead of either when the word in front of it ends on `ㄹ`, for the
	 * one Korean particle that treats that consonant as a vowel: `시장으로` and
	 * `마을로` are `로` after a vowel, `으로` after a consonant, and `로` again
	 * after `ㄹ`. Left out by every other particle.
	 */
	tailLiquid?: string;
	/**
	 * Whether the phrase may carry a modifier when there is room for one. Off for
	 * a phrase that is already a fixed expression, which is every adverbial.
	 */
	modifiable?: boolean;
	/**
	 * Whether the phrase goes without the article the language would otherwise
	 * give it. Italian is why this exists: every Italian preposition merges with
	 * the article behind it (`in` + `la` is `nella`), so a phrase opening on one
	 * either carries the merged form or carries no article at all.
	 */
	bare?: boolean;
	/**
	 * Where the copula stands relative to this phrase, on the shape that equates
	 * a subject to it. `head` is English `is` and Chinese `是`, written as their
	 * own word in front; `tail` is Korean `이다` and Japanese `です`, written onto
	 * the end of the phrase.
	 *
	 * On the phrase rather than a part of its own because that is what a copula
	 * is in half of these languages: `11시 40분이다` is one word, and a slot for it
	 * would have to be written with no space in front, which is a thing no other
	 * part does.
	 */
	copula?: 'head' | 'tail';
};

/**
 * What a shape is for. A frame with no mood is a statement, and a statement shape
 * also serves an exclamation and a sentence that trails off — those differ from
 * it by the mark and by what stands in front, not by the order of the words.
 *
 * A question is the one that can differ, and only four of the nine languages need
 * it to. The rest declare no question shape and get their statement shapes back,
 * which is the same best-effort every other narrowing here makes.
 */
export type SentenceMood = 'statement' | 'question';

/**
 * The kinds of sentence a language writes a mark of its own for.
 *
 * `dialogue` and `thought` are not among them: what they quote is a sentence of
 * one of these, so they take its mark and add the quotation marks around it.
 */
export type SentenceMark = Exclude<SentenceType, 'dialogue' | 'thought'>;

/**
 * One shape a sentence can take, written in the order the language puts it in.
 *
 * Per language rather than shared, and for the same reason a nickname's frames
 * are: Korean closes on its verb where English puts it second, and a language
 * whose articles cannot mark an object has no shape that carries one.
 */
export type SentenceFrame = {
	parts: readonly SentencePart[];
	/** How often this shape is used, against the other frames of the language. */
	weight: number;
	/**
	 * The fields the verb of this shape may come from, for a shape only some verbs
	 * can head. A destination is the reason: `시장으로` wants a verb that goes
	 * somewhere and `시장에` one that arrives, and `시장으로 웃는다` is neither.
	 */
	fields?: readonly VerbField[];
	/** What the shape is for. Left out by a statement. */
	mood?: SentenceMood;
	/**
	 * Written after the last phrase and before the terminator, with the language's
	 * own space in front of it. That is Chinese `吗`, Japanese `か` and Vietnamese
	 * `không` — none of which is a phrase, and none of which any slot could carry.
	 */
	tag?: string;
};

/**
 * The article a noun takes, by its gender and by how the word right after the
 * article begins. Each rule is `[prefix, article]`; the first whose prefix
 * matches wins, and `''` matches anything, which is how Italian picks `l'`
 * before a vowel, `lo` before `s` plus a consonant, and `il` for the rest.
 *
 * A language whose nouns carry no gender writes every rule under `n`, which is
 * what the lookup falls back to.
 */
export type SentenceArticles = {
	[gender in WordGender]?: readonly (readonly [string, string])[];
};

/**
 * What a connective claims about the sentence before it.
 *
 * - `additive` says here is one more thing (`그리고`, `besides`, `また`).
 * - `temporal` says time passed (`이윽고`, `meanwhile`, `やがて`).
 * - `contrastive` says this cuts against it (`하지만`, `however`, `しかし`).
 * - `causal` says this follows from it (`그러므로`, `therefore`, `だから`).
 *
 * The first three can open any continuation: time passes whatever is said, one
 * more thing is always one more thing, and any two things can be set against
 * each other. `causal` is the one that can be false — `그러므로 금빛 하이볼이
 * 식죠?` after a sentence about a pretzel claims a consequence that is not
 * there — so the generator writes one only where the sentences can carry it.
 */
export type ConnectiveKind = 'additive' | 'temporal' | 'contrastive' | 'causal';

/**
 * What a noun can do that its theme does not say. A fish and a sparrow are both
 * `animal`, and only one of them flies; a snake and a lion are both `animal`,
 * and only one of them runs. A language lists the nouns that carry each trait
 * under `SentenceLanguageData.traits`, and a verb group asks for one with
 * `subjectTraits` or rules one out with `subjectWithout`. A noun listed nowhere
 * has no trait, so it takes any group that asks for none.
 */
export type NounTrait = 'flier' | 'swimmer' | 'crawler';

/** The nouns that carry each trait, written the way the word pools write them. */
export type SentenceTraits = {
	[trait in NounTrait]?: WordPool;
};

/**
 * What a sentence opens on when it follows another one of the same result, by
 * what that opening claims. Written whole, so a language that needs a comma
 * after it writes the comma.
 *
 * A language declares only the kinds it can actually write. German declares no
 * `temporal`: `dann` and `danach` are adverbs, and an adverb in the first
 * position moves the finite verb, so the five coordinating conjunctions are all
 * it has to open a clause with.
 */
export type SentenceConnectives = {
	[kind in ConnectiveKind]?: WordPool;
};

/**
 * When something happens, written whole, particle and all, and sorted by what a
 * paragraph has to know about each one.
 *
 * `day` is the phases of a day in the order they come, from dawn to midnight,
 * because a story told across several sentences moves forward through them and
 * never back: a paragraph that has reached the evening does not return to the
 * morning. `any` is what fits every tense — a season, a habit, a weekend. `past`
 * and `present` are the ones that name a tense (`어제`, `yesterday`; `오늘`,
 * `these days`), and a sentence takes only the pool of the tense it is in.
 */
export type SentenceTimes = {
	day: WordPool;
	any: WordPool;
	past?: WordPool;
	present?: WordPool;
	/**
	 * What happens as a habit: `every day`, `sometimes`, `these days`. Right in a
	 * sentence on its own and wrong in a story, which tells of one time something
	 * happened, so a story never draws from it.
	 */
	habitual?: WordPool;
};

/**
 * How the language marks the past when it does not inflect its verb for it.
 * Vietnamese writes `đã` in front (`con mèo đã chạy`) and Chinese `了` behind
 * (`狮子跑了`, `狐狸吃了苹果`), and a language that conjugates leaves it out and
 * writes `past` on its groups instead.
 */
export type SentencePastMark = {
	head?: string;
	tail?: string;
};

/**
 * How two clauses become one sentence: `돌아와서 사과를 먹었다`, `came home and
 * ate the apple`. Either the first clause's predicate takes the `linking` form
 * its group declares, or a word is written between the two — a language declares
 * whichever its grammar does, and one that declares neither joins nothing.
 */
export type SentenceJoin = {
	form?: 'linking';
	word?: string;
};

/**
 * The subject pronoun a later sentence refers to the topic with, by the topic's
 * gender. Nominative only, because a subject is never in another case.
 *
 * `''` is a real entry and means the language writes no subject at all, which is
 * what Korean, Japanese, Chinese, Spanish and Italian actually do in a second
 * sentence about the same thing. The lookup falls back to `n` the way
 * `SentenceArticles` does, so a language whose pronoun does not inflect writes
 * one rule.
 */
export type SentencePronouns = {
	[gender in WordGender]?: WordPool;
};

/**
 * How a later sentence refers to a noun it has already put in the object slot,
 * rather than naming it a second time. `words` is by the noun's gender the way
 * `SentencePronouns` is, and `''` is a real entry meaning the language leaves
 * the object out altogether (`끓여서 먹었다`); `clitic` is set where the pronoun
 * is written in front of the verb rather than where the object stood (Spanish
 * `la comió`). Left out by a language that names the noun again.
 */
export type SentenceObjectPronouns = {
	words: SentencePronouns;
	clitic?: boolean;
};

/**
 * How the hero of a story speaks for themselves, in a line the story quotes
 * rather than narrates. `subject` is what stands where the subject would: `''`
 * for a language that drops it (`“배고프다.”`), `我`, `Tôi`, `I`. `head` is the
 * copula the first person takes where a state's head changes for it — English
 * `am` beside `is`. Left out by a language whose predicates would have to change
 * for the first person, which is Spanish, Italian, German and Russian; their
 * stories are narrated all the way through.
 */
export type SentenceSpeech = {
	subject: string;
	head?: string;
};

/**
 * How a language writes a number beside a noun, and beside money.
 *
 * Left out by a language that cannot write either correctly, which is what
 * German and Russian do: both would need a case their nouns change their own
 * ending for, the same reason neither declares an object shape.
 */
/**
 * How a language writes a date, a clock time, and the copula that equates a
 * subject to one.
 *
 * The templates are written as the language writes them, with letters standing
 * for the numbers, because a date is word order as much as it is digits:
 * `2026년 9월 5일` runs largest to smallest and `ngày 5 tháng 9 năm 2026` runs
 * the other way with a word in front of every part.
 */
export type SentenceCalendar = {
	/**
	 * The date. `Y` is the year, `M` the month as a number, `D` the day, and
	 * `MMMM` the month's name for a language that writes one.
	 */
	date: string;
	/** The month names in order, for a date that writes `MMMM`. */
	months?: WordPool;
	/** The clock. `h` is the hour and `mm` the minute, zero-padded to two. */
	clock: string;
	/** The years a date may fall in, at the earliest and the latest. */
	years: readonly [number, number];
	/**
	 * The copula, as a predicate group: one entry with whatever forms the
	 * language writes for a question, an exclamation and each level. It states
	 * the classes its subject may belong to the way a verb group does — an event
	 * is a thing that happens on a day, and a lion is not.
	 */
	copula: StateGroup;
};

export type SentenceNumeral = {
	/**
	 * Where the number stands relative to the noun it counts. Korean, Japanese and
	 * Chinese put it behind (`사과 12 개`); Vietnamese puts it in front, classifier
	 * and all (`12 con mèo`).
	 */
	order: 'before' | 'after';
	/**
	 * The counter each kind of noun takes, which is what the noun classes were
	 * worth having for: `마리` for a creature, `명` for a person, `대` for a vehicle.
	 *
	 * A classifier is also what makes an abstract noun countable at all — `슬픔 12
	 * 가지` is twelve kinds of sadness — so a language with this table can count
	 * anything in its pools. English, Spanish and Italian have no such word and
	 * would need a plural, and a plural of `sadness` is not a thing anyone writes;
	 * that is why they declare `counters` empty and no counted shape.
	 */
	counters: Partial<Record<NounClass, string>>;
	/** How many of a counted thing, at the fewest and at the most. */
	count: readonly [number, number];
	/**
	 * What money is written in, after the amount (`원`, `dollars`, `円`), joined by
	 * the same `gap` a counter is.
	 */
	currency: string;
	/**
	 * The amounts the language writes, as a pool rather than a range. A range would
	 * hand back `73,412 dollars`, and nobody writes that; these are the round
	 * numbers a sentence actually names.
	 */
	amounts: readonly number[];
	/**
	 * What separates the thousands. `,` in English, Korean, Japanese and Chinese;
	 * `.` in Vietnamese, Spanish and Italian.
	 */
	group: string;
	/**
	 * What stands between the digits and what they count — the counter, or the
	 * currency. Empty in Korean, Japanese and Chinese, which write `6개`, `6個` and
	 * `6个` with nothing in between; a space in Vietnamese, English, Spanish and
	 * Italian, which write `6 con` and `500 dollars`.
	 *
	 * Its own field rather than the language's `space`, because Korean writes a
	 * space everywhere else and still attaches this one. 한글 맞춤법 제43항 spaces a
	 * unit noun off the number it follows and then allows the attached form with
	 * Arabic numerals, which is what anyone writing `6개` actually does.
	 */
	gap: string;
};

export type SentenceLanguageData = {
	/**
	 * Placed between the phrases, and between the words inside one. A space in
	 * every language that writes one, and nothing in Japanese and Chinese.
	 *
	 * Not `word/data`'s `joiner`, which runs a nickname's words together on
	 * purpose: `멋진사자` is a handle, and `멋진 사자가 달린다` is a sentence.
	 */
	space: string;
	/** Whether the sentence opens on a capital letter. */
	capitalize: boolean;
	/** What a sentence of each kind closes on. */
	terminators: Record<SentenceMark, string>;
	/**
	 * What it opens on, for a language that marks the kind at both ends. Spanish
	 * `¿` and `¡` are the only ones here, and every other language leaves it out.
	 */
	openers?: Partial<Record<SentenceMark, string>>;
	/**
	 * The two levels of quotation marks the language writes, as `[open, close]`.
	 *
	 * Per language and not close to universal: Japanese writes `「」` and `『』`,
	 * German opens low and closes high (`„…“`), and Spanish, Italian and Russian
	 * reach for guillemets before anything else.
	 */
	quotes: Record<SentenceQuote, readonly [string, string]>;
	/** The article a noun phrase opens with. Left out by a language with no articles. */
	articles?: SentenceArticles;
	/**
	 * Whether a predicate adjective agrees with its subject the way an attributive
	 * one does. Spanish, Italian and Russian inflect both; German inflects only
	 * the attributive form, so `der Wal ist blau` keeps the base word.
	 */
	predicateAgrees?: boolean;
	/**
	 * How a past-tense verb agrees with its subject, in a language where it does.
	 * Russian is the one: `бежал` beside `бежала`, and `вернулся` beside
	 * `вернулась`. The same rule shape `word/data`'s `agreement` has, applied to
	 * the verb's past form rather than to a modifier.
	 */
	pastAgreement?: WordAgreement;
	/**
	 * What marks the past beside the verb, for a language that does not put it on
	 * the verb. Left out by every language that writes `past` on its groups.
	 */
	pastMark?: SentencePastMark;
	verbs: readonly VerbGroup[];
	states: readonly StateGroup[];
	/** The modifiers a noun phrase may carry, by what they can describe. */
	modifiers: readonly ModifierGroup[];
	/**
	 * How something is done, written as the language writes it (`조용히`,
	 * `quietly`), grouped by what can do it that way: a fox walks `부지런히` and a
	 * river does not flow so.
	 */
	manners: readonly ModifierGroup[];
	/** When it happens, written whole, particle and all (`새벽에`, `at dawn`). */
	times: SentenceTimes;
	/**
	 * Where the hero of a story comes back to (`집`, `house`, `家`). Bare nouns,
	 * and the destination frame writes its own particle or preposition around
	 * one, so English says `to the house` rather than the `home` that would need
	 * the preposition dropped.
	 */
	homes: WordPool;
	/** How two clauses are written as one sentence. Left out by a language that does not. */
	join?: SentenceJoin;
	/** What a sentence opens on when it follows another one, by what it claims. */
	connectives: SentenceConnectives;
	/**
	 * The nouns that fly, swim or crawl, for the verb groups that ask. Written in
	 * the plain form — lowercase where the pools capitalize — and left out by a
	 * language whose verbs ask for no trait.
	 */
	traits?: SentenceTraits;
	/** How a later sentence refers to the topic without naming it again. */
	pronouns: SentencePronouns;
	/**
	 * What an exclamation opens on (`와,`, `Wow,`, `ああ、`). Written whole, comma
	 * and all, because where the comma goes is the language's business.
	 *
	 * Exclamations alone: a statement that opened on one would be reading itself
	 * aloud, and a question has its own mark to do the work.
	 */
	interjections: WordPool;
	/**
	 * Noun classes the language's written pronouns are wrong for. A sentence about
	 * one of them leaves the subject out where the language can, and names the
	 * topic again where it cannot.
	 *
	 * English is the reason it exists: `he` and `she` need a person's gender,
	 * which a job noun does not carry, and `they` needs a plural verb the pools
	 * are not written in — so an English sentence about a person names it again.
	 * The languages whose written pronoun is inanimate — `그것`, `それ`, `它`, `nó`
	 * — list `person` too, and drop the subject instead, which is what they would
	 * do anyway. Omitted by a language whose pronouns stand for anything.
	 *
	 * A topic that carries a gender is the exception, and a person's name is the
	 * only thing that does: `he` is wrong for `the locksmith` and right for
	 * `Philip`. A language that declares no pool for that gender is unaffected,
	 * which is why Korean drops the subject rather than writing `그것` about
	 * somebody.
	 */
	pronounless?: readonly NounClass[];
	/**
	 * How a later sentence refers to the object the one before it named. Left out
	 * by a language that names it again.
	 */
	objectPronouns?: SentenceObjectPronouns;
	/** How a story's hero speaks for themselves. Left out by a language that cannot write it. */
	speech?: SentenceSpeech;
	/**
	 * How the language writes a number. Left out by one that cannot, which then
	 * declares no `quantity` and no `money` shape either.
	 */
	numeral?: SentenceNumeral;
	/**
	 * How the language writes a date and a clock time, and the copula that
	 * equates a subject to one. Left out by a language that cannot write them the
	 * way the shapes here need — Russian equates with a dash rather than a word,
	 * and a dash does not change for a question or a level.
	 */
	calendar?: SentenceCalendar;
	frames: readonly SentenceFrame[];
};
