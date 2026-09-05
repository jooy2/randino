<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useData } from 'vitepress';
import {
	NAME_LANGUAGES,
	RAND_SENTENCE_COUNT_MAX,
	WORD_LANGUAGES,
	WORD_THEMES,
	nameLengthRange,
	nameSupportsMiddleName,
	nicknameLengthRange,
	randModifier,
	randName,
	randNickname,
	randPrefix,
	randSentence,
	randSuffix,
	randWord,
	sentenceLengthRange,
	wordLengthRange
} from 'randino';
import { localeOf, t } from '../../data/i18n';

/**
 * The demo — the page where the library is not described but run.
 *
 * It imports `randino` for real, and the alias in `config.ts` points that at
 * `packages/javascript/lib`, so the page generates from the source in this
 * repository rather than from whatever is on npm. A page documenting an option
 * added since the last release would otherwise demo a build without it.
 *
 * **Nothing is generated during SSR.** The output would be baked into the
 * pre-rendered HTML and then disagree with the first client render, which is a
 * hydration mismatch — and a page of random text is the one place that is
 * guaranteed rather than unlikely. `onMounted` draws the first batch.
 *
 * Controls are labelled with the option names themselves rather than with prose.
 * `includeMiddleName` is what the reader will type into their own call, and the
 * code block under the output is that call, written out with only the options
 * they actually changed.
 */
const { lang } = useData();
const locale = computed(() => localeOf(lang.value));

/** What each code means, for a `<select>` that would otherwise read `ko  ja  zh`. */
const LANGUAGE_NAMES = {
	en: 'English',
	ko: '한국어',
	ja: '日本語',
	zh: '中文',
	it: 'Italiano',
	de: 'Deutsch',
	ru: 'Русский',
	es: 'Español',
	vi: 'Tiếng Việt'
};

const COUNT_MAX = 50;

const tab = ref('name');
const details = ref(false);

/** A decorator, applied to whatever the generator returned. */
const decorate = reactive({ kind: 'none', length: 5, separator: '_' });

/** The separator each kind defaults to, so switching does not carry one over. */
watch(
	() => decorate.kind,
	(kind) => {
		decorate.separator = kind === 'modifier' ? '' : '_';
	}
);

const name = reactive({
	language: 'en',
	gender: 'all',
	count: 8,
	realism: 'real',
	script: 'native',
	includeSurname: true,
	includeMiddleName: false,
	minLength: '',
	maxLength: '',
	startsWith: '',
	unique: false
});

const nickname = reactive({
	language: 'en',
	theme: 'all',
	count: 8,
	realism: 'real',
	minLength: '',
	maxLength: '',
	wordSeparator: '',
	startsWith: '',
	unique: false
});

const word = reactive({
	language: 'en',
	theme: 'all',
	count: 8,
	realism: 'real',
	minLength: '',
	maxLength: '',
	startsWith: '',
	unique: false
});

const sentence = reactive({
	language: 'en',
	theme: 'all',
	shape: 'all',
	slots: 'all',
	sentences: 1,
	count: 8,
	realism: 'real',
	minLength: '',
	maxLength: '',
	include: '',
	startsWith: '',
	unique: false
});

const SENTENCE_SLOTS = ['object', 'place', 'time', 'manner', 'state'];

/** The words typed into `include`, which the option takes as an array. */
const included = computed(() => sentence.include.split(/[\s,]+/).filter(Boolean));

/** An empty box is "not asked for", not `0`. */
function num(value) {
	const parsed = Number(value);

	return value === '' || Number.isNaN(parsed) ? undefined : parsed;
}

/** Only what the reader changed, so the code block shows the shortest call. */
const options = computed(() => {
	const out = {};

	if (tab.value === 'name') {
		if (name.language !== 'all') out.language = name.language;
		if (name.gender !== 'all') out.gender = name.gender;
		if (name.count !== 1) out.count = Number(name.count);
		if (name.realism !== 'real') out.realism = name.realism;
		if (name.script !== 'native') out.script = name.script;
		if (!name.includeSurname) out.includeSurname = false;
		if (name.includeMiddleName) out.includeMiddleName = true;
		if (num(name.minLength) !== undefined) out.minLength = num(name.minLength);
		if (num(name.maxLength) !== undefined) out.maxLength = num(name.maxLength);
		if (name.startsWith) out.startsWith = name.startsWith;
		if (name.unique) out.unique = true;

		return out;
	}

	if (tab.value === 'sentence') {
		if (sentence.language !== 'all') out.language = sentence.language;
		if (sentence.theme !== 'all') out.theme = sentence.theme;
		if (sentence.shape !== 'all') out.shape = sentence.shape;
		if (sentence.slots !== 'all') out.slots = sentence.slots;
		if (Number(sentence.sentences) > 1) out.sentences = Number(sentence.sentences);
		if (included.value.length) out.include = included.value;
		if (sentence.count !== 1) out.count = Number(sentence.count);
		if (sentence.realism !== 'real') out.realism = sentence.realism;
		if (num(sentence.minLength) !== undefined) out.minLength = num(sentence.minLength);
		if (num(sentence.maxLength) !== undefined) out.maxLength = num(sentence.maxLength);
		if (sentence.startsWith) out.startsWith = sentence.startsWith;
		if (sentence.unique) out.unique = true;

		return out;
	}

	if (tab.value === 'word') {
		if (word.language !== 'all') out.language = word.language;
		if (word.theme !== 'all') out.theme = word.theme;
		if (word.count !== 1) out.count = Number(word.count);
		if (word.realism !== 'real') out.realism = word.realism;
		if (num(word.minLength) !== undefined) out.minLength = num(word.minLength);
		if (num(word.maxLength) !== undefined) out.maxLength = num(word.maxLength);
		if (word.startsWith) out.startsWith = word.startsWith;
		if (word.unique) out.unique = true;

		return out;
	}

	if (nickname.language !== 'all') out.language = nickname.language;
	if (nickname.theme !== 'all') out.theme = nickname.theme;
	if (nickname.count !== 1) out.count = Number(nickname.count);
	if (nickname.realism !== 'real') out.realism = nickname.realism;
	if (num(nickname.minLength) !== undefined) out.minLength = num(nickname.minLength);
	if (num(nickname.maxLength) !== undefined) out.maxLength = num(nickname.maxLength);
	if (nickname.wordSeparator) out.wordSeparator = nickname.wordSeparator;
	if (nickname.startsWith) out.startsWith = nickname.startsWith;
	if (nickname.unique) out.unique = true;

	return out;
});

/**
 * What the generator is actually called with.
 *
 * `script` is dropped in detail mode: the detail form carries both scripts and
 * ignores the option, so leaving it in the code block would show the reader
 * something that does nothing in the call they are looking at.
 */
const generatorOptions = computed(() => {
	const out = { ...options.value };

	if (details.value) {
		if (tab.value === 'name') {
			delete out.script;
		}

		out.output = 'detail';
	}

	return out;
});

/** What the decorator is called with — a modifier takes no `length`. */
const decorateOptions = computed(() => {
	const out = {};

	if (decorate.kind === 'modifier') {
		if (decorate.separator) out.separator = decorate.separator;

		return out;
	}

	if (Number(decorate.length) !== 5) out.length = Number(decorate.length);
	if (decorate.separator !== '_') out.separator = decorate.separator;

	return out;
});

/** The default range the language falls back to, shown as the input's placeholder. */
const fallbackRange = computed(() => {
	if (tab.value === 'name') {
		return nameLengthRange(name.language, name.includeSurname, name.includeMiddleName);
	}

	if (tab.value === 'word') {
		return wordLengthRange(word.language, word.theme);
	}

	if (tab.value === 'sentence') {
		const [low, high] = sentenceLengthRange(sentence.language);
		// The bounds describe the whole result, so the placeholder does too.
		const count = Number(sentence.sentences) || 1;

		return [low * count, high * count];
	}

	return nicknameLengthRange(nickname.language, nickname.wordSeparator);
});

const supportsMiddleName = computed(() => nameSupportsMiddleName(name.language));

/** The three of them, by the name the reader picks in the select. */
const DECORATORS = { suffix: randSuffix, prefix: randPrefix, modifier: randModifier };

/**
 * Whether a decorator runs at all. It is offered on every tab but this one: a
 * decorator attaches a token or a word to a name, and a whole sentence is not a
 * string anybody attaches anything to.
 */
const decorating = computed(() => tab.value !== 'sentence' && decorate.kind !== 'none');

const rows = ref([]);
const asked = ref(0);

function generate() {
	const config = generatorOptions.value;
	let items;
	let meta = null;

	if (tab.value === 'name') {
		if (details.value) {
			const drawn = randName({ ...config, output: 'detail' });

			items = drawn.map((detail) => (name.script === 'roman' ? detail.roman : detail.native));
			meta = drawn.map((detail) => [
				['native', detail.native],
				['roman', detail.roman],
				['language', detail.language],
				['gender', detail.gender]
			]);
		} else {
			items = randName(config);
		}
	} else if (tab.value === 'sentence') {
		if (details.value) {
			const drawn = randSentence({ ...config, output: 'detail' });

			items = drawn.map((detail) => detail.sentence);
			meta = drawn.map((detail) => [
				['phrases', detail.phrases.join(' + ')],
				['slots', detail.slots.join(' + ')],
				['language', detail.language],
				['theme', String(detail.theme)]
			]);
		} else {
			items = randSentence(config);
		}
	} else if (tab.value === 'word') {
		if (details.value) {
			const drawn = randWord({ ...config, output: 'detail' });

			items = drawn.map((detail) => detail.word);
			meta = drawn.map((detail) => [
				['language', detail.language],
				['theme', String(detail.theme)]
			]);
		} else {
			items = randWord(config);
		}
	} else if (details.value) {
		const drawn = randNickname({ ...config, output: 'detail' });

		items = drawn.map((detail) => detail.nickname);
		meta = drawn.map((detail) => [
			['words', detail.words.join(' + ')],
			['language', detail.language],
			['theme', String(detail.theme)]
		]);
	} else {
		items = randNickname(config);
	}

	if (decorating.value) {
		const attach = DECORATORS[decorate.kind];

		items = attach(items, decorateOptions.value);
	}

	asked.value = config.count ?? 1;
	rows.value = items.map((text, index) => ({ text, meta: meta ? meta[index] : null }));
}

// Not in `setup`: see the note at the top about SSR.
onMounted(generate);

// Switching tab or turning details on is a different question, so it is asked
// straight away rather than leaving the previous answer on screen.
watch([tab, details], generate);

/* ---------------------------------------------------------------------------
 * The call, written out
 * ------------------------------------------------------------------------- */

function literal(value) {
	if (Array.isArray(value)) {
		return `[${value.map(literal).join(', ')}]`;
	}

	return typeof value === 'string' ? `'${value.replace(/'/g, "\\'")}'` : String(value);
}

function objectLiteral(source) {
	const entries = Object.entries(source);

	if (!entries.length) {
		return '';
	}

	const pairs = entries.map(([key, value]) => `${key}: ${literal(value)}`);
	const inline = `{ ${pairs.join(', ')} }`;

	return inline.length <= 56 ? inline : `{\n\t${pairs.join(',\n\t')}\n}`;
}

const GENERATORS = {
	name: 'randName',
	nickname: 'randNickname',
	word: 'randWord',
	sentence: 'randSentence'
};

const DECORATOR_NAMES = {
	suffix: 'randSuffix',
	prefix: 'randPrefix',
	modifier: 'randModifier'
};

const DETAIL_FIELDS = {
	name: 'native',
	nickname: 'nickname',
	word: 'word',
	sentence: 'sentence'
};

const code = computed(() => {
	const generator = GENERATORS[tab.value];
	const call = `${generator}(${objectLiteral(generatorOptions.value)})`;

	if (!decorating.value) {
		return `import { ${generator} } from 'randino';\n\n${call};`;
	}

	const wrapper = DECORATOR_NAMES[decorate.kind];
	const extra = objectLiteral(decorateOptions.value);
	const imports = [generator, wrapper].sort().join(', ');

	if (!details.value) {
		return `import { ${imports} } from 'randino';\n\n${wrapper}(${call}${extra ? `, ${extra}` : ''});`;
	}

	// A decorator attaches to strings, and details are objects — so the two-step
	// form, which is what the page is doing behind the output above.
	const field =
		tab.value === 'name' && name.script === 'roman' ? 'roman' : DETAIL_FIELDS[tab.value];

	return [
		`import { ${imports} } from 'randino';`,
		'',
		`const details = ${call};`,
		`${wrapper}(details.map((detail) => detail.${field})${extra ? `, ${extra}` : ''});`
	].join('\n');
});

const copied = ref(false);

async function copy() {
	try {
		await navigator.clipboard.writeText(rows.value.map((row) => row.text).join('\n'));
		copied.value = true;
		setTimeout(() => (copied.value = false), 1200);
	} catch {
		// No clipboard permission. The text is on screen and selectable anyway.
	}
}
</script>

<template>
	<div class="randino-demo">
		<div class="randino-demo-tabs" role="tablist">
			<button
				type="button"
				role="tab"
				:aria-selected="tab === 'name'"
				class="randino-demo-tab"
				@click="tab = 'name'"
			>
				{{ t(locale, 'demoNames') }}
			</button>
			<button
				type="button"
				role="tab"
				:aria-selected="tab === 'nickname'"
				class="randino-demo-tab"
				@click="tab = 'nickname'"
			>
				{{ t(locale, 'demoNicknames') }}
			</button>
			<button
				type="button"
				role="tab"
				:aria-selected="tab === 'word'"
				class="randino-demo-tab"
				@click="tab = 'word'"
			>
				{{ t(locale, 'demoWords') }}
			</button>
			<button
				type="button"
				role="tab"
				:aria-selected="tab === 'sentence'"
				class="randino-demo-tab"
				@click="tab = 'sentence'"
			>
				{{ t(locale, 'demoSentences') }}
			</button>
		</div>

		<div class="randino-demo-body">
			<div v-if="tab === 'name'" class="randino-demo-fields">
				<label class="randino-demo-field">
					<span><code>language</code></span>
					<select v-model="name.language">
						<option value="all">all</option>
						<option v-for="code_ in NAME_LANGUAGES" :key="code_" :value="code_">
							{{ code_ }} — {{ LANGUAGE_NAMES[code_] }}
						</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>gender</code></span>
					<select v-model="name.gender">
						<option value="all">all</option>
						<option value="male">male</option>
						<option value="female">female</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>script</code></span>
					<select v-model="name.script">
						<option value="native">native</option>
						<option value="roman">roman</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>count</code></span>
					<input v-model.number="name.count" type="number" min="1" :max="COUNT_MAX" />
				</label>

				<label class="randino-demo-field">
					<span><code>realism</code></span>
					<select v-model="name.realism">
						<option value="real">real</option>
						<option value="mixed">mixed</option>
						<option value="invented">invented</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>minLength</code></span>
					<input v-model="name.minLength" type="number" min="1" :placeholder="fallbackRange[0]" />
				</label>

				<label class="randino-demo-field">
					<span><code>maxLength</code></span>
					<input v-model="name.maxLength" type="number" min="1" :placeholder="fallbackRange[1]" />
				</label>

				<label class="randino-demo-field">
					<span><code>startsWith</code></span>
					<input v-model="name.startsWith" type="text" maxlength="1" placeholder="—" />
				</label>

				<label class="randino-demo-check">
					<input v-model="name.includeSurname" type="checkbox" />
					<code>includeSurname</code>
				</label>

				<label class="randino-demo-check" :class="{ 'is-off': !supportsMiddleName }">
					<input v-model="name.includeMiddleName" type="checkbox" :disabled="!supportsMiddleName" />
					<code>includeMiddleName</code>
				</label>

				<label class="randino-demo-check">
					<input v-model="name.unique" type="checkbox" />
					<code>unique</code>
				</label>
			</div>

			<div v-else-if="tab === 'sentence'" class="randino-demo-fields">
				<label class="randino-demo-field">
					<span><code>language</code></span>
					<select v-model="sentence.language">
						<option value="all">all</option>
						<option v-for="code_ in WORD_LANGUAGES" :key="code_" :value="code_">
							{{ code_ }} — {{ LANGUAGE_NAMES[code_] }}
						</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>theme</code></span>
					<select v-model="sentence.theme">
						<option value="all">all</option>
						<option v-for="item in WORD_THEMES" :key="item" :value="item">{{ item }}</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>shape</code></span>
					<select v-model="sentence.shape">
						<option value="all">all</option>
						<option value="simple">simple</option>
						<option value="detailed">detailed</option>
						<option value="complex">complex</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>slots</code></span>
					<select v-model="sentence.slots">
						<option value="all">all</option>
						<option value="none">none</option>
						<option v-for="item in SENTENCE_SLOTS" :key="item" :value="item">{{ item }}</option>
					</select>
				</label>

				<label class="randino-demo-field randino-demo-wide">
					<span><code>include</code></span>
					<input
						v-model="sentence.include"
						type="text"
						:placeholder="t(locale, 'demoIncludeHint')"
					/>
				</label>

				<label class="randino-demo-field">
					<span><code>sentences</code></span>
					<input
						v-model.number="sentence.sentences"
						type="number"
						min="1"
						:max="RAND_SENTENCE_COUNT_MAX"
					/>
				</label>

				<label class="randino-demo-field">
					<span><code>count</code></span>
					<input v-model.number="sentence.count" type="number" min="1" :max="COUNT_MAX" />
				</label>

				<label class="randino-demo-field">
					<span><code>realism</code></span>
					<select v-model="sentence.realism">
						<option value="real">real</option>
						<option value="mixed">mixed</option>
						<option value="invented">invented</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>minLength</code></span>
					<input
						v-model="sentence.minLength"
						type="number"
						min="1"
						:placeholder="fallbackRange[0]"
					/>
				</label>

				<label class="randino-demo-field">
					<span><code>maxLength</code></span>
					<input
						v-model="sentence.maxLength"
						type="number"
						min="1"
						:placeholder="fallbackRange[1]"
					/>
				</label>

				<label class="randino-demo-field">
					<span><code>startsWith</code></span>
					<input v-model="sentence.startsWith" type="text" maxlength="1" placeholder="—" />
				</label>

				<label class="randino-demo-check">
					<input v-model="sentence.unique" type="checkbox" />
					<code>unique</code>
				</label>
			</div>

			<div v-else-if="tab === 'word'" class="randino-demo-fields">
				<label class="randino-demo-field">
					<span><code>language</code></span>
					<select v-model="word.language">
						<option value="all">all</option>
						<option v-for="code_ in WORD_LANGUAGES" :key="code_" :value="code_">
							{{ code_ }} — {{ LANGUAGE_NAMES[code_] }}
						</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>theme</code></span>
					<select v-model="word.theme">
						<option value="all">all</option>
						<option v-for="item in WORD_THEMES" :key="item" :value="item">{{ item }}</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>count</code></span>
					<input v-model.number="word.count" type="number" min="1" :max="COUNT_MAX" />
				</label>

				<label class="randino-demo-field">
					<span><code>realism</code></span>
					<select v-model="word.realism">
						<option value="real">real</option>
						<option value="mixed">mixed</option>
						<option value="invented">invented</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>minLength</code></span>
					<input v-model="word.minLength" type="number" min="1" :placeholder="fallbackRange[0]" />
				</label>

				<label class="randino-demo-field">
					<span><code>maxLength</code></span>
					<input v-model="word.maxLength" type="number" min="1" :placeholder="fallbackRange[1]" />
				</label>

				<label class="randino-demo-field">
					<span><code>startsWith</code></span>
					<input v-model="word.startsWith" type="text" maxlength="1" placeholder="—" />
				</label>

				<label class="randino-demo-check">
					<input v-model="word.unique" type="checkbox" />
					<code>unique</code>
				</label>
			</div>

			<div v-else class="randino-demo-fields">
				<label class="randino-demo-field">
					<span><code>language</code></span>
					<select v-model="nickname.language">
						<option value="all">all</option>
						<option v-for="code_ in WORD_LANGUAGES" :key="code_" :value="code_">
							{{ code_ }} — {{ LANGUAGE_NAMES[code_] }}
						</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>theme</code></span>
					<select v-model="nickname.theme">
						<option value="all">all</option>
						<option v-for="item in WORD_THEMES" :key="item" :value="item">{{ item }}</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>count</code></span>
					<input v-model.number="nickname.count" type="number" min="1" :max="COUNT_MAX" />
				</label>

				<label class="randino-demo-field">
					<span><code>realism</code></span>
					<select v-model="nickname.realism">
						<option value="real">real</option>
						<option value="mixed">mixed</option>
						<option value="invented">invented</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>minLength</code></span>
					<input
						v-model="nickname.minLength"
						type="number"
						min="1"
						:placeholder="fallbackRange[0]"
					/>
				</label>

				<label class="randino-demo-field">
					<span><code>maxLength</code></span>
					<input
						v-model="nickname.maxLength"
						type="number"
						min="1"
						:placeholder="fallbackRange[1]"
					/>
				</label>

				<label class="randino-demo-field">
					<span><code>wordSeparator</code></span>
					<input v-model="nickname.wordSeparator" type="text" maxlength="4" placeholder="—" />
				</label>

				<label class="randino-demo-field">
					<span><code>startsWith</code></span>
					<input v-model="nickname.startsWith" type="text" maxlength="1" placeholder="—" />
				</label>

				<label class="randino-demo-check">
					<input v-model="nickname.unique" type="checkbox" />
					<code>unique</code>
				</label>
			</div>

			<div class="randino-demo-fields randino-demo-affix">
				<label v-if="tab !== 'sentence'" class="randino-demo-field">
					<span>{{ t(locale, 'demoDecorate') }}</span>
					<select v-model="decorate.kind">
						<option value="none">{{ t(locale, 'demoDecorateNone') }}</option>
						<option value="suffix">randSuffix</option>
						<option value="prefix">randPrefix</option>
						<option value="modifier">randModifier</option>
					</select>
				</label>

				<label
					v-if="tab !== 'sentence'"
					class="randino-demo-field"
					:class="{ 'is-off': decorate.kind === 'none' || decorate.kind === 'modifier' }"
				>
					<span><code>length</code></span>
					<input
						v-model.number="decorate.length"
						type="number"
						min="1"
						max="32"
						:disabled="decorate.kind === 'none' || decorate.kind === 'modifier'"
					/>
				</label>

				<label
					v-if="tab !== 'sentence'"
					class="randino-demo-field"
					:class="{ 'is-off': decorate.kind === 'none' }"
				>
					<span><code>separator</code></span>
					<input
						v-model="decorate.separator"
						type="text"
						maxlength="4"
						placeholder="—"
						:disabled="decorate.kind === 'none'"
					/>
				</label>

				<label class="randino-demo-check">
					<input v-model="details" type="checkbox" />
					<span>{{ t(locale, 'demoDetails') }}</span>
				</label>
			</div>

			<div class="randino-demo-actions">
				<button type="button" class="randino-demo-run" @click="generate">
					{{ t(locale, 'demoGenerate') }}
				</button>
				<button type="button" class="randino-demo-copy" :disabled="!rows.length" @click="copy">
					{{ copied ? t(locale, 'demoCopied') : t(locale, 'demoCopy') }}
				</button>
			</div>

			<ul v-if="rows.length" class="randino-demo-output">
				<li v-for="(row, index) in rows" :key="index">
					<span class="randino-demo-value">{{ row.text }}</span>
					<span v-if="row.meta" class="randino-demo-meta">
						<span v-for="[key, value] in row.meta" :key="key">
							<code>{{ key }}</code>
							{{ value }}
						</span>
					</span>
				</li>
			</ul>

			<p v-else class="randino-demo-note">{{ t(locale, 'demoEmpty') }}</p>

			<p v-if="rows.length && rows.length < asked" class="randino-demo-note">
				{{ t(locale, 'demoShort') }}
			</p>

			<details class="randino-demo-code">
				<summary>{{ t(locale, 'demoCall') }}</summary>
				<pre><code>{{ code }}</code></pre>
			</details>

			<p class="randino-demo-note randino-demo-live">{{ t(locale, 'demoLive') }}</p>
		</div>
	</div>
</template>
