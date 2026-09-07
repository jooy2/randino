// Emits the Dart and Python sentence datasets from the JavaScript ones, so the
// three packages hold the same data. `index.mjs` runs it and formats what it
// wrote; see `tools/emit/README.md`.

import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SENTENCE_DATA } from '../../packages/javascript/lib/sentence/data/index.js';
import type {
	PredicateTense,
	SentenceFrame,
	SentenceLanguageData,
	SentenceSpeech,
	StateGroup,
	VerbGroup
} from '../../packages/javascript/lib/sentence/data/types.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../packages');
const FORMS = [
	'question',
	'exclamation',
	'casual',
	'casualQuestion',
	'polite',
	'politeQuestion',
	'formal',
	'formalQuestion',
	'linking'
];

/** A pool entry as the source writes it: a space inside one entry is `_`. */
const entry = (word: string) => word.replace(/ /g, '_');

/** Wrap pool entries into lines of at most `width` characters. */
function wrap(pool: readonly string[], indent: string, width = 100): string {
	const lines: string[] = [];
	let line = '';

	for (const word of pool.map(entry)) {
		if (line && (indent + line + ' ' + word).length > width) {
			lines.push(indent + line);
			line = word;
		} else {
			line = line ? line + ' ' + word : word;
		}
	}

	if (line) lines.push(indent + line);

	return lines.join('\n');
}

/**
 * Korean-style stems: every past statement ends on the same syllable, and every
 * form is that stem plus one ending shared by the whole group. Returns the stems
 * and the endings when a tense is written that way, and null otherwise.
 */
function stemsOf(
	tense: PredicateTense
): { stems: string[]; endings: Record<string, string> } | null {
	if (!tense.words.length || !tense.words.every((word) => word.endsWith('다'))) return null;

	const stems = tense.words.map((word) => word.slice(0, -1));
	const endings: Record<string, string> = { statement: '다' };

	for (const [form, pool] of Object.entries(tense.forms ?? {})) {
		if (!pool || pool.length !== stems.length) return null;

		const ending = pool[0]
			.split('|')
			.map((each) => (each.startsWith(stems[0]) ? each.slice(stems[0].length) : null));

		if (ending.some((each) => each === null)) return null;

		const joined = ending.join('|');

		for (let i = 0; i < stems.length; i += 1) {
			const expected = joined
				.split('|')
				.map((each) => stems[i] + each)
				.join('|');

			if (pool[i] !== expected) return null;
		}

		endings[form] = joined;
	}

	return { stems, endings };
}

/* --- Dart ------------------------------------------------------------------ */

/** A `SentenceSpeech` as a Dart constructor call. */
function dartSpeech(speech: SentenceSpeech): string {
	const head = speech.head === undefined ? '' : `, head: ${dq(speech.head)}`;
	const heads =
		speech.heads === undefined
			? ''
			: `, heads: <String, String>{${Object.entries(speech.heads)
					.map(([from, to]) => `${dq(from)}: ${dq(to)}`)
					.join(', ')}}`;

	return `const SentenceSpeech(subject: ${dq(speech.subject)}${head}${heads})`;
}

const dq = (text: string) =>
	text.includes("'") ? `"${text.replace(/\$/g, '\\$')}"` : `'${text.replace(/\$/g, '\\$')}'`;

function dartWords(pool: readonly string[], indent: string): string {
	const joined = pool.map(entry).join(' ');

	if ((indent + joined).length < 80 && !joined.includes("'")) return `words(r'${joined}')`;

	const raw = joined.includes("'") ? '"""' : "'''";

	return `words(r${raw}\n${wrap(pool, indent + '  ')}\n${indent}${raw})`;
}

function dartList(items: readonly string[], type: string, indent: string): string {
	return `<${type}>[${items.map((item) => `${type}.${item}`).join(', ')}]`;
}

function dartStrings(items: readonly string[]): string {
	return `<String>[${items.map(dq).join(', ')}]`;
}

function dartForms(forms: Record<string, readonly string[]> | undefined, indent: string): string {
	const entries = Object.entries(forms ?? {}).filter(([, pool]) => pool);

	if (!entries.length) return '';

	return `\n${indent}forms: <PredicateForm, WordPool>{\n${entries
		.map(([form, pool]) => `${indent}  PredicateForm.${form}: ${dartWords(pool!, indent + '  ')},`)
		.join('\n')}\n${indent}},`;
}

function dartTense(tense: PredicateTense | undefined, indent: string, koPast: boolean): string {
	if (!tense) return '';

	const stems = koPast ? stemsOf(tense) : null;

	if (stems) {
		return `\n${indent}past: conjugate(${dartWordsRaw(stems.stems, indent + '  ')}, statement: '다', endings: _pastEndings),`;
	}

	return `\n${indent}past: PredicateTense(\n${indent}  words: ${dartWords(tense.words, indent + '  ')},${dartForms(tense.forms as never, indent + '  ')}\n${indent}),`;
}

function dartWordsRaw(pool: readonly string[], indent: string): string {
	const joined = pool.map(entry).join(' ');

	if ((indent + joined).length < 80) return `r'${joined}'`;

	return `r'''\n${wrap(pool, indent + '  ')}\n${indent}'''`;
}

function dartVerb(group: VerbGroup, indent: string, koPast: boolean): string {
	const lines = [
		`${indent}VerbGroup(`,
		`${indent}  field: VerbField.${group.field},`,
		`${indent}  subject: const ${dartList(group.subject, 'NounClass', indent)},`
	];

	if (group.subjectThemes)
		lines.push(
			`${indent}  subjectThemes: const ${dartList(group.subjectThemes, 'WordTheme', indent)},`
		);
	if (group.subjectTraits)
		lines.push(
			`${indent}  subjectTraits: const ${dartList(group.subjectTraits, 'NounTrait', indent)},`
		);
	if (group.subjectWithout)
		lines.push(
			`${indent}  subjectWithout: const ${dartList(group.subjectWithout, 'NounTrait', indent)},`
		);
	if (group.object)
		lines.push(`${indent}  object: const ${dartList(group.object, 'NounClass', indent)},`);
	if (group.objectThemes)
		lines.push(
			`${indent}  objectThemes: const ${dartList(group.objectThemes, 'WordTheme', indent)},`
		);
	if (group.objectTraits)
		lines.push(
			`${indent}  objectTraits: const ${dartList(group.objectTraits, 'NounTrait', indent)},`
		);
	if (group.objectWithout)
		lines.push(
			`${indent}  objectWithout: const ${dartList(group.objectWithout, 'NounTrait', indent)},`
		);
	if (group.requires) lines.push(`${indent}  requires: SentenceSlot.${group.requires},`);
	if (group.condition) lines.push(`${indent}  condition: Condition.${group.condition},`);

	lines.push(`${indent}  words: ${dartWords(group.words, indent + '  ')},`);

	const forms = dartForms(group.forms as never, indent + '  ');
	const past = dartTense(group.past, indent + '  ', koPast);

	return lines.join('\n') + forms + past + `\n${indent}),`;
}

function dartState(group: StateGroup, indent: string, koPast: boolean, plainWords = false): string {
	const lines = [
		`${indent}StateGroup(`,
		`${indent}  subject: const ${dartList(group.subject, 'NounClass', indent)},`
	];

	if (group.subjectThemes)
		lines.push(
			`${indent}  subjectThemes: const ${dartList(group.subjectThemes, 'WordTheme', indent)},`
		);
	if (group.condition) lines.push(`${indent}  condition: Condition.${group.condition},`);
	if (group.head) lines.push(`${indent}  head: ${dq(group.head)},`);
	if (group.pastHead) lines.push(`${indent}  pastHead: ${dq(group.pastHead)},`);

	lines.push(
		`${indent}  words: ${plainWords ? dartStrings(group.words) : dartWords(group.words, indent + '  ')},`
	);

	const forms = plainWords
		? Object.entries(group.forms ?? {}).length
			? `\n${indent}  forms: <PredicateForm, WordPool>{\n${Object.entries(group.forms ?? {})
					.map(([form, pool]) => `${indent}    PredicateForm.${form}: ${dartStrings(pool!)},`)
					.join('\n')}\n${indent}  },`
			: ''
		: dartForms(group.forms as never, indent + '  ');
	const past =
		plainWords && group.past
			? `\n${indent}  past: PredicateTense(\n${indent}    words: ${dartStrings(group.past.words)},${
					Object.entries(group.past.forms ?? {}).length
						? `\n${indent}    forms: <PredicateForm, WordPool>{\n${Object.entries(
								group.past.forms ?? {}
							)
								.map(
									([form, pool]) => `${indent}      PredicateForm.${form}: ${dartStrings(pool!)},`
								)
								.join('\n')}\n${indent}    },`
						: ''
				}\n${indent}  ),`
			: dartTense(group.past, indent + '  ', koPast);

	return lines.join('\n') + forms + past + `\n${indent}),`;
}

function dartFrame(frame: SentenceFrame, indent: string): string {
	const parts = frame.parts
		.map((part) => {
			const args = [`SentenceSlot.${part.slot}`];

			if (part.head !== undefined) args.push(`head: ${dq(part.head)}`);
			if (part.pastHead !== undefined) args.push(`pastHead: ${dq(part.pastHead)}`);
			if (part.tail !== undefined) args.push(`tail: ${dq(part.tail)}`);
			if (part.tailAlt !== undefined) args.push(`tailAlt: ${dq(part.tailAlt)}`);
			if (part.tailLiquid !== undefined) args.push(`tailLiquid: ${dq(part.tailLiquid)}`);
			if (part.modifiable) args.push('modifiable: true');
			if (part.bare) args.push('bare: true');
			if (part.copula) args.push(`copula: CopulaSide.${part.copula}`);

			return `${indent}    SentencePart(${args.join(', ')}),`;
		})
		.join('\n');
	const extras: string[] = [];

	if (frame.mood) extras.push(`mood: SentenceMood.${frame.mood}`);
	if (frame.tag) extras.push(`tag: ${dq(frame.tag)}`);
	if (frame.fields) extras.push(`fields: ${dartList(frame.fields, 'VerbField', indent)}`);

	return `${indent}SentenceFrame(\n${indent}  <SentencePart>[\n${parts}\n${indent}  ],\n${indent}  ${frame.weight},${
		extras.length ? `\n${indent}  ${extras.join(',\n' + indent + '  ')},` : ''
	}\n${indent}),`;
}

function dartModifiers(
	groups: readonly {
		subject: readonly string[];
		themes?: readonly string[];
		words: readonly string[];
	}[],
	indent: string
): string {
	return groups
		.map((group) => {
			const lines = [
				`${indent}ModifierGroup(`,
				`${indent}  subject: const ${dartList(group.subject, 'NounClass', indent)},`
			];

			if (group.themes)
				lines.push(`${indent}  themes: const ${dartList(group.themes, 'WordTheme', indent)},`);

			if (group.fields)
				lines.push(`${indent}  fields: const ${dartList(group.fields, 'VerbField', indent)},`);

			lines.push(`${indent}  words: ${dartWords(group.words, indent + '  ')},`, `${indent}),`);

			return lines.join('\n');
		})
		.join('\n');
}

function dartRules(
	rules: Record<string, readonly (readonly [string, string])[] | undefined>
): string {
	return `const <WordGender, List<List<String>>>{\n${Object.entries(rules)
		.filter(([, list]) => list)
		.map(
			([gender, list]) =>
				`    WordGender.${gender}: <List<String>>[${list!.map(([a, b]) => `<String>[${dq(a)}, ${dq(b)}]`).join(', ')}],`
		)
		.join('\n')}\n  }`;
}

function emitDart(code: string, data: SentenceLanguageData): string {
	const koPast = code === 'ko';
	const out: string[] = [];

	out.push('// Ported verbatim from the JavaScript package; see CLAUDE.md.');
	out.push('');
	out.push("import 'package:randino/src/internal/parse.dart';");
	out.push("import 'package:randino/src/sentence/data/types.dart';");
	out.push("import 'package:randino/src/types.dart';");
	out.push("import 'package:randino/src/word/data/types.dart';");
	out.push('');

	if (koPast) {
		const first = stemsOf(data.verbs[0].past!)!;

		out.push('// Every Korean past form is one stem and one ending: `달렸` closes on `ㅆ`, and');
		out.push('// so does every other past stem, so the endings attach to all of them alike.');
		out.push('const Map<PredicateForm, String> _pastEndings = <PredicateForm, String>{');

		for (const [form, ending] of Object.entries(first.endings)) {
			if (form !== 'statement') out.push(`  PredicateForm.${form}: '${ending}',`);
		}

		out.push('};');
		out.push('');
	}

	out.push(`/// The sentence dataset for ${code}.`);
	out.push(`final SentenceLanguageData ${code} = SentenceLanguageData(`);
	out.push(`  space: ${dq(data.space)},`);
	out.push(`  capitalize: ${data.capitalize},`);
	out.push(`  terminators: const <SentenceType, String>{`);

	for (const [kind, mark] of Object.entries(data.terminators))
		out.push(`    SentenceType.${kind}: ${dq(mark)},`);

	out.push('  },');

	if (data.openers) {
		out.push('  openers: const <SentenceType, String>{');

		for (const [kind, mark] of Object.entries(data.openers))
			out.push(`    SentenceType.${kind}: ${dq(mark!)},`);

		out.push('  },');
	}

	out.push('  quotes: const <SentenceQuote, List<String>>{');

	for (const [kind, pair] of Object.entries(data.quotes))
		out.push(`    SentenceQuote.${kind}: ${dartStrings(pair)},`);

	out.push('  },');

	if (data.articles) out.push(`  articles: ${dartRules(data.articles as never)},`);
	if (data.predicateAgrees) out.push('  predicateAgrees: true,');
	if (data.pastAgreement) out.push(`  pastAgreement: ${dartRules(data.pastAgreement as never)},`);
	if (data.pastMark) {
		const args = [];

		if (data.pastMark.head) args.push(`head: ${dq(data.pastMark.head)}`);
		if (data.pastMark.tail) args.push(`tail: ${dq(data.pastMark.tail)}`);

		out.push(`  pastMark: const SentencePastMark(${args.join(', ')}),`);
	}

	out.push('  verbs: <VerbGroup>[');

	for (const group of data.verbs) out.push(dartVerb(group, '    ', koPast));

	out.push('  ],');
	out.push('  states: <StateGroup>[');

	for (const group of data.states) out.push(dartState(group, '    ', koPast));

	out.push('  ],');
	out.push('  modifiers: <ModifierGroup>[');
	out.push(dartModifiers(data.modifiers, '    '));
	out.push('  ],');
	out.push('  manners: <ModifierGroup>[');
	out.push(dartModifiers(data.manners, '    '));
	out.push('  ],');
	out.push('  times: SentenceTimes(');
	out.push(`    day: ${dartWords(data.times.day, '    ')},`);
	out.push(`    any: ${dartWords(data.times.any, '    ')},`);

	if (data.times.past) out.push(`    past: ${dartWords(data.times.past, '    ')},`);
	if (data.times.present) out.push(`    present: ${dartWords(data.times.present, '    ')},`);
	if (data.times.habitual) out.push(`    habitual: ${dartWords(data.times.habitual, '    ')},`);

	out.push('  ),');
	out.push(`  homes: ${dartWords(data.homes, '  ')},`);

	if (data.join) {
		const args = [];

		if (data.join.form) args.push(`form: PredicateForm.${data.join.form}`);
		if (data.join.word) args.push(`word: ${dq(data.join.word)}`);

		out.push(`  join: const SentenceJoin(${args.join(', ')}),`);
	}

	out.push('  connectives: <ConnectiveKind, WordPool>{');

	for (const [kind, pool] of Object.entries(data.connectives)) {
		if (pool) out.push(`    ConnectiveKind.${kind}: ${dartWords(pool, '    ')},`);
	}

	out.push('  },');

	if (data.traits) {
		out.push('  traits: <NounTrait, WordPool>{');

		for (const [trait, pool] of Object.entries(data.traits)) {
			if (pool) out.push(`    NounTrait.${trait}: ${dartWords(pool, '    ')},`);
		}

		out.push('  },');
	}

	out.push(`  interjections: ${dartWords(data.interjections, '  ')},`);
	out.push('  pronouns: const <WordGender, WordPool>{');

	for (const [gender, pool] of Object.entries(data.pronouns)) {
		if (pool) out.push(`    WordGender.${gender}: ${dartStrings(pool)},`);
	}

	out.push('  },');

	if (data.pronounless)
		out.push(`  pronounless: const ${dartList(data.pronounless, 'NounClass', '  ')},`);

	if (data.objectPronouns) {
		out.push('  objectPronouns: const SentenceObjectPronouns(');
		out.push('    words: <WordGender, WordPool>{');

		for (const [gender, pool] of Object.entries(data.objectPronouns.words)) {
			if (pool) out.push(`      WordGender.${gender}: ${dartStrings(pool)},`);
		}

		out.push('    },');

		if (data.objectPronouns.clitic) out.push('    clitic: true,');

		out.push('  ),');
	}

	if (data.speech) out.push(`  speech: ${dartSpeech(data.speech)},`);

	if (data.replies) {
		out.push('  replies: <SentenceStyle, Map<ReplyCue, WordPool>>{');

		for (const [level, pools] of Object.entries(data.replies)) {
			if (!pools) continue;

			out.push(`    SentenceStyle.${level}: <ReplyCue, WordPool>{`);

			for (const [cue, pool] of Object.entries(pools)) {
				if (pool) out.push(`      ReplyCue.${cue}: ${dartWords(pool, '      ')},`);
			}

			out.push('    },');
		}

		out.push('  },');
	}

	if (data.listener) out.push(`  listener: ${dartSpeech(data.listener)},`);

	if (data.homecomings) {
		out.push('  homecomings: <SentenceStyle, WordPool>{');

		for (const [level, pool] of Object.entries(data.homecomings)) {
			if (pool) out.push(`    SentenceStyle.${level}: ${dartWords(pool, '    ')},`);
		}

		out.push('  },');
	}

	if (data.degrees) out.push(`  degrees: ${dartWords(data.degrees, '  ')},`);

	if (data.placeHeads) {
		out.push('  placeHeads: <String, WordPool>{');

		for (const [head, pool] of Object.entries(data.placeHeads)) {
			out.push(`    ${dq(head)}: ${dartWords(pool, '    ')},`);
		}

		out.push('  },');
	}

	if (data.numeral) {
		const n = data.numeral;

		out.push('  numeral: const SentenceNumeral(');
		out.push(`    order: NumeralOrder.${n.order},`);
		out.push('    counters: <NounClass, String>{');

		for (const [cls, counter] of Object.entries(n.counters))
			out.push(`      NounClass.${cls}: ${dq(counter!)},`);

		out.push('    },');
		out.push(`    count: LengthRange(${n.count[0]}, ${n.count[1]}),`);
		out.push(`    currency: ${dq(n.currency)},`);
		out.push(`    amounts: <int>[${n.amounts.join(', ')}],`);
		out.push(`    group: ${dq(n.group)},`);
		out.push(`    gap: ${dq(n.gap)},`);
		out.push('  ),');
	}

	if (data.calendar) {
		const c = data.calendar;

		out.push('  calendar: SentenceCalendar(');
		out.push(`    date: ${dq(c.date)},`);

		if (c.months) out.push(`    months: ${dartWords(c.months, '    ')},`);

		out.push(`    clock: ${dq(c.clock)},`);
		out.push(`    years: const LengthRange(${c.years[0]}, ${c.years[1]}),`);
		out.push(`    copula: ${dartState(c.copula, '    ', false, true).trim().replace(/,$/, '')},`);
		out.push('  ),');
	}

	out.push('  frames: const <SentenceFrame>[');

	for (const frame of data.frames) out.push(dartFrame(frame, '    '));

	out.push('  ],');
	out.push(');');

	return out.join('\n') + '\n';
}

/* --- Python ---------------------------------------------------------------- */

const pq = (text: string) => JSON.stringify(text);

/** A `SentenceSpeech` as a Python constructor call. */
function pySpeech(speech: SentenceSpeech): string {
	const head = speech.head === undefined ? '' : `, head=${pq(speech.head)}`;
	const heads =
		speech.heads === undefined
			? ''
			: `, heads={${Object.entries(speech.heads)
					.map(([from, to]) => `${pq(from)}: ${pq(to)}`)
					.join(', ')}}`;

	return `SentenceSpeech(subject=${pq(speech.subject)}${head}${heads})`;
}

function pyWords(pool: readonly string[], indent: string): string {
	const joined = pool.map(entry).join(' ');

	if ((indent + joined).length < 80) return `words(${pq(joined)})`;

	return `words("""\n${wrap(pool, indent + '    ')}\n${indent}""")`;
}

function pyTuple(items: readonly string[]): string {
	return items.length === 1 ? `(${pq(items[0])},)` : `(${items.map(pq).join(', ')})`;
}

function pyForms(forms: Record<string, readonly string[]> | undefined, indent: string): string {
	const entries = Object.entries(forms ?? {}).filter(([, pool]) => pool);

	if (!entries.length) return '';

	return `\n${indent}forms={\n${entries.map(([form, pool]) => `${indent}    ${pq(form)}: ${pyWords(pool!, indent + '    ')},`).join('\n')}\n${indent}},`;
}

function pyTense(tense: PredicateTense | undefined, indent: string, koPast: boolean): string {
	if (!tense) return '';

	const stems = koPast ? stemsOf(tense) : null;

	if (stems) {
		const joined = stems.stems.map(entry).join(' ');
		const source =
			(indent + joined).length < 80
				? pq(joined)
				: `"""\n${wrap(stems.stems, indent + '        ')}\n${indent}    """`;

		return `\n${indent}past=conjugate(${source}, _PAST),`;
	}

	return `\n${indent}past=PredicateTense(\n${indent}    words=${pyWords(tense.words, indent + '    ')},${pyForms(tense.forms as never, indent + '    ')}\n${indent}),`;
}

function pyVerb(group: VerbGroup, indent: string, koPast: boolean): string {
	const lines = [
		`${indent}VerbGroup(`,
		`${indent}    field=${pq(group.field)},`,
		`${indent}    subject=${pyTuple(group.subject)},`
	];

	if (group.subjectThemes)
		lines.push(`${indent}    subject_themes=${pyTuple(group.subjectThemes)},`);
	if (group.subjectTraits)
		lines.push(`${indent}    subject_traits=${pyTuple(group.subjectTraits)},`);
	if (group.subjectWithout)
		lines.push(`${indent}    subject_without=${pyTuple(group.subjectWithout)},`);
	if (group.object) lines.push(`${indent}    object=${pyTuple(group.object)},`);
	if (group.objectThemes) lines.push(`${indent}    object_themes=${pyTuple(group.objectThemes)},`);
	if (group.objectTraits) lines.push(`${indent}    object_traits=${pyTuple(group.objectTraits)},`);
	if (group.objectWithout)
		lines.push(`${indent}    object_without=${pyTuple(group.objectWithout)},`);
	if (group.requires) lines.push(`${indent}    requires=${pq(group.requires)},`);
	if (group.condition) lines.push(`${indent}    condition=${pq(group.condition)},`);

	lines.push(`${indent}    words=${pyWords(group.words, indent + '    ')},`);

	return (
		lines.join('\n') +
		pyForms(group.forms as never, indent + '    ') +
		pyTense(group.past, indent + '    ', koPast) +
		`\n${indent}),`
	);
}

function pyState(group: StateGroup, indent: string, koPast: boolean): string {
	const lines = [`${indent}StateGroup(`, `${indent}    subject=${pyTuple(group.subject)},`];

	if (group.subjectThemes)
		lines.push(`${indent}    subject_themes=${pyTuple(group.subjectThemes)},`);
	if (group.condition) lines.push(`${indent}    condition=${pq(group.condition)},`);
	if (group.head) lines.push(`${indent}    head=${pq(group.head)},`);
	if (group.pastHead) lines.push(`${indent}    past_head=${pq(group.pastHead)},`);

	lines.push(`${indent}    words=${pyWords(group.words, indent + '    ')},`);

	return (
		lines.join('\n') +
		pyForms(group.forms as never, indent + '    ') +
		pyTense(group.past, indent + '    ', koPast) +
		`\n${indent}),`
	);
}

function pyFrame(frame: SentenceFrame, indent: string): string {
	const parts = frame.parts
		.map((part) => {
			const args = [pq(part.slot)];

			if (part.head !== undefined) args.push(`head=${pq(part.head)}`);
			if (part.pastHead !== undefined) args.push(`past_head=${pq(part.pastHead)}`);
			if (part.tail !== undefined) args.push(`tail=${pq(part.tail)}`);
			if (part.tailAlt !== undefined) args.push(`tail_alt=${pq(part.tailAlt)}`);
			if (part.tailLiquid !== undefined) args.push(`tail_liquid=${pq(part.tailLiquid)}`);
			if (part.modifiable) args.push('modifiable=True');
			if (part.bare) args.push('bare=True');
			if (part.copula) args.push(`copula=${pq(part.copula)}`);

			return `${indent}        SentencePart(${args.join(', ')}),`;
		})
		.join('\n');
	const extras: string[] = [];

	if (frame.mood) extras.push(`mood=${pq(frame.mood)}`);
	if (frame.tag) extras.push(`tag=${pq(frame.tag)}`);
	if (frame.fields) extras.push(`fields=${pyTuple(frame.fields)}`);

	return `${indent}SentenceFrame(\n${indent}    (\n${parts}\n${indent}    ),\n${indent}    ${frame.weight},${
		extras.length ? `\n${indent}    ${extras.join(',\n' + indent + '    ')},` : ''
	}\n${indent}),`;
}

function pyModifiers(
	groups: readonly {
		subject: readonly string[];
		themes?: readonly string[];
		words: readonly string[];
	}[],
	indent: string
): string {
	return groups
		.map((group) => {
			const lines = [`${indent}ModifierGroup(`, `${indent}    subject=${pyTuple(group.subject)},`];

			if (group.themes) lines.push(`${indent}    themes=${pyTuple(group.themes)},`);
			if (group.fields) lines.push(`${indent}    fields=${pyTuple(group.fields)},`);

			lines.push(`${indent}    words=${pyWords(group.words, indent + '    ')},`, `${indent}),`);

			return lines.join('\n');
		})
		.join('\n');
}

function pyRules(
	rules: Record<string, readonly (readonly [string, string])[] | undefined>
): string {
	return `{\n${Object.entries(rules)
		.filter(([, list]) => list)
		.map(
			([gender, list]) =>
				`        ${pq(gender)}: (${list!.map(([a, b]) => `(${pq(a)}, ${pq(b)})`).join(', ')}${list!.length === 1 ? ',' : ''}),`
		)
		.join('\n')}\n    }`;
}

function emitPython(code: string, data: SentenceLanguageData): string {
	const koPast = code === 'ko';
	const out: string[] = [];
	const imports = [
		'SentenceFrame',
		'SentenceLanguageData',
		'SentencePart',
		'StateGroup',
		'VerbGroup',
		'ModifierGroup',
		'SentenceTimes'
	];

	if (data.numeral) imports.push('SentenceNumeral');
	if (data.calendar) imports.push('SentenceCalendar');
	if (data.pastMark) imports.push('SentencePastMark');
	if (data.join) imports.push('SentenceJoin');

	out.push(
		`"""The ${code} sentence grammar: the verbs, the predicates and the shapes.\n\nPorted verbatim from the JavaScript package; see CLAUDE.md.\n"""`
	);
	out.push('');
	out.push(
		koPast
			? 'from randino._internal.parse import conjugate, words'
			: 'from randino._internal.parse import words'
	);
	out.push('__IMPORTS__');
	out.push('');

	if (koPast) {
		const first = stemsOf(data.verbs[0].past!)!;

		out.push('# Every Korean past form is one stem and one ending: `달렸` closes on `ㅆ`, and so');
		out.push('# does every other past stem, so the endings attach to all of them alike.');
		out.push('_PAST = {');

		for (const [form, ending] of Object.entries(first.endings))
			out.push(`    ${pq(form)}: ${pq(ending)},`);

		out.push('}');
		out.push('');
	}

	out.push(`${code.toUpperCase()} = SentenceLanguageData(`);
	out.push(`    space=${pq(data.space)},`);
	out.push(`    capitalize=${data.capitalize ? 'True' : 'False'},`);
	out.push(
		`    terminators={${Object.entries(data.terminators)
			.map(([k, v]) => `${pq(k)}: ${pq(v)}`)
			.join(', ')}},`
	);

	if (data.openers)
		out.push(
			`    openers={${Object.entries(data.openers)
				.map(([k, v]) => `${pq(k)}: ${pq(v!)}`)
				.join(', ')}},`
		);

	out.push(
		`    quotes={${Object.entries(data.quotes)
			.map(([k, v]) => `${pq(k)}: (${pq(v[0])}, ${pq(v[1])})`)
			.join(', ')}},`
	);

	if (data.articles) out.push(`    articles=${pyRules(data.articles as never)},`);
	if (data.predicateAgrees) out.push('    predicate_agrees=True,');
	if (data.pastAgreement) out.push(`    past_agreement=${pyRules(data.pastAgreement as never)},`);
	if (data.pastMark) {
		const args = [];

		if (data.pastMark.head) args.push(`head=${pq(data.pastMark.head)}`);
		if (data.pastMark.tail) args.push(`tail=${pq(data.pastMark.tail)}`);

		out.push(`    past_mark=SentencePastMark(${args.join(', ')}),`);
	}

	out.push('    verbs=(');

	for (const group of data.verbs) out.push(pyVerb(group, '        ', koPast));

	out.push('    ),');
	out.push('    states=(');

	for (const group of data.states) out.push(pyState(group, '        ', koPast));

	out.push('    ),');
	out.push('    modifiers=(');
	out.push(pyModifiers(data.modifiers, '        '));
	out.push('    ),');
	out.push('    manners=(');
	out.push(pyModifiers(data.manners, '        '));
	out.push('    ),');
	out.push('    times=SentenceTimes(');
	out.push(`        day=${pyWords(data.times.day, '        ')},`);
	out.push(`        any=${pyWords(data.times.any, '        ')},`);

	if (data.times.past) out.push(`        past=${pyWords(data.times.past, '        ')},`);
	if (data.times.present) out.push(`        present=${pyWords(data.times.present, '        ')},`);
	if (data.times.habitual)
		out.push(`        habitual=${pyWords(data.times.habitual, '        ')},`);

	out.push('    ),');
	out.push(`    homes=${pyWords(data.homes, '    ')},`);

	if (data.join) {
		const args = [];

		if (data.join.form) args.push(`form=${pq(data.join.form)}`);
		if (data.join.word) args.push(`word=${pq(data.join.word)}`);

		out.push(`    join=SentenceJoin(${args.join(', ')}),`);
	}

	out.push('    connectives={');

	for (const [kind, pool] of Object.entries(data.connectives)) {
		if (pool) out.push(`        ${pq(kind)}: ${pyWords(pool, '        ')},`);
	}

	out.push('    },');

	if (data.traits) {
		out.push('    traits={');

		for (const [trait, pool] of Object.entries(data.traits)) {
			if (pool) out.push(`        ${pq(trait)}: ${pyWords(pool, '        ')},`);
		}

		out.push('    },');
	}

	out.push(`    interjections=${pyWords(data.interjections, '    ')},`);
	out.push(
		`    pronouns={${Object.entries(data.pronouns)
			.filter(([, p]) => p)
			.map(([g, p]) => `${pq(g)}: ${pyTuple(p!)}`)
			.join(', ')}},`
	);

	if (data.pronounless) out.push(`    pronounless=${pyTuple(data.pronounless)},`);

	if (data.objectPronouns) {
		const words = Object.entries(data.objectPronouns.words)
			.filter(([, p]) => p)
			.map(([g, p]) => `${pq(g)}: ${pyTuple(p!)}`)
			.join(', ');
		const clitic = data.objectPronouns.clitic ? ', clitic=True' : '';

		out.push(`    object_pronouns=SentenceObjectPronouns(words={${words}}${clitic}),`);
	}

	if (data.speech) out.push(`    speech=${pySpeech(data.speech)},`);

	if (data.replies) {
		out.push('    replies={');

		for (const [level, pools] of Object.entries(data.replies)) {
			if (!pools) continue;

			out.push(`        ${pq(level)}: {`);

			for (const [cue, pool] of Object.entries(pools)) {
				if (pool) out.push(`            ${pq(cue)}: ${pyWords(pool, '            ')},`);
			}

			out.push('        },');
		}

		out.push('    },');
	}

	if (data.listener) out.push(`    listener=${pySpeech(data.listener)},`);

	if (data.homecomings) {
		out.push('    homecomings={');

		for (const [level, pool] of Object.entries(data.homecomings)) {
			if (pool) out.push(`        ${pq(level)}: ${pyWords(pool, '        ')},`);
		}

		out.push('    },');
	}

	if (data.degrees) out.push(`    degrees=${pyWords(data.degrees, '    ')},`);

	if (data.placeHeads) {
		out.push('    place_heads={');

		for (const [head, pool] of Object.entries(data.placeHeads)) {
			out.push(`        ${pq(head)}: ${pyWords(pool, '        ')},`);
		}

		out.push('    },');
	}

	if (data.numeral) {
		const n = data.numeral;

		out.push('    numeral=SentenceNumeral(');
		out.push(`        order=${pq(n.order)},`);
		out.push(
			`        counters={${Object.entries(n.counters)
				.map(([k, v]) => `${pq(k)}: ${pq(v!)}`)
				.join(', ')}},`
		);
		out.push(`        count=(${n.count[0]}, ${n.count[1]}),`);
		out.push(`        currency=${pq(n.currency)},`);
		out.push(`        amounts=(${n.amounts.join(', ')}),`);
		out.push(`        group=${pq(n.group)},`);
		out.push(`        gap=${pq(n.gap)},`);
		out.push('    ),');
	}

	if (data.calendar) {
		const c = data.calendar;

		out.push('    calendar=SentenceCalendar(');
		out.push(`        date=${pq(c.date)},`);

		if (c.months) out.push(`        months=${pyWords(c.months, '        ')},`);

		out.push(`        clock=${pq(c.clock)},`);
		out.push(`        years=(${c.years[0]}, ${c.years[1]}),`);
		out.push(`        copula=${pyState(c.copula, '        ', false).trim().replace(/,$/, '')},`);
		out.push('    ),');
	}

	out.push('    frames=(');

	for (const frame of data.frames) out.push(pyFrame(frame, '        '));

	out.push('    ),');
	out.push(')');

	// The copula's past is written as a literal even in Korean (`이었다` is not
	// one stem and one ending), so the import follows what was actually written.
	const body = out.join('\n') + '\n';

	if (body.includes('PredicateTense(')) imports.push('PredicateTense');
	if (body.includes('SentenceObjectPronouns(')) imports.push('SentenceObjectPronouns');
	if (body.includes('SentenceSpeech(')) imports.push('SentenceSpeech');

	return body.replace(
		'__IMPORTS__',
		`from randino.sentence.data._types import (\n${imports
			.sort()
			.map((name) => `    ${name},`)
			.join('\n')}\n)`
	);
}

for (const [code, data] of Object.entries(SENTENCE_DATA)) {
	writeFileSync(`${ROOT}/dart/lib/src/sentence/data/${code}.dart`, emitDart(code, data));
	writeFileSync(`${ROOT}/python/src/randino/sentence/data/${code}.py`, emitPython(code, data));
}

console.log('emitted');
