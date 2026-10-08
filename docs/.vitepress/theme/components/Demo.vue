<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useData } from 'vitepress';
import {
	AGE_GROUPS,
	DATE_UNITS,
	LOCATION_LANGUAGES,
	LOCATION_LEVELS,
	NAME_LANGUAGES,
	ORGANIZATION_INDUSTRIES,
	ORGANIZATION_TYPES,
	PHONE_COUNTRIES,
	PHONE_TYPES,
	RAND_AGE_MAX,
	RAND_SENTENCE_COUNT_MAX,
	WORD_LANGUAGES,
	WORD_THEMES,
	nameLengthRange,
	nameSupportsMiddleName,
	nicknameLengthRange,
	randAge,
	randCity,
	randCountry,
	randDate,
	randDistrict,
	randGender,
	randLocation,
	randModifier,
	randName,
	randNickname,
	randOrganization,
	randPhone,
	randPrefix,
	randRegion,
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

/**
 * The generators, as a real tab list.
 *
 * `role="tablist"` was on the row and nothing else of the pattern was: no panel
 * for the tabs to control, and four buttons all in the tab order rather than one
 * with the arrow keys moving between them. A screen reader was told "tab 1 of 4"
 * about a control that pointed at nothing.
 */
const TABS = [
	'name',
	'nickname',
	'word',
	'sentence',
	'location',
	'age',
	'gender',
	'organization',
	'date',
	'phone'
];

const TAB_LABELS = {
	name: 'demoNames',
	nickname: 'demoNicknames',
	word: 'demoWords',
	sentence: 'demoSentences',
	location: 'demoLocations',
	age: 'demoAges',
	gender: 'demoGenders',
	organization: 'demoOrganizations',
	date: 'demoDates',
	phone: 'demoPhones'
};

const tab = ref('name');
const tablist = ref(null);
const details = ref(false);

/** Arrow keys move between the tabs, which is what makes the row one control. */
function onTabKey(event) {
	const at = TABS.indexOf(tab.value);
	const step = { ArrowRight: 1, ArrowLeft: -1, Home: -at, End: TABS.length - 1 - at }[event.key];

	if (step === undefined) {
		return;
	}

	event.preventDefault();
	tab.value = TABS[(at + step + TABS.length) % TABS.length];
	// The focus follows the selection: the tab that is selected is the only one in
	// the tab order, so leaving the focus behind would strand it outside.
	nextTick(() => tablist.value?.querySelector('[aria-selected="true"]')?.focus());
}

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
	type: '',
	style: '',
	includeName: '',
	count: 8,
	realism: 'real',
	minLength: '',
	maxLength: '',
	include: '',
	startsWith: '',
	unique: false
});

/**
 * The location tab. `place` rather than `location`, which would shadow the
 * browser's own `location` everywhere in this component.
 */
const place = reactive({
	fn: 'randLocation',
	language: 'all',
	level: 'district',
	includeCountry: true,
	count: 8,
	minLength: '',
	maxLength: '',
	startsWith: '',
	unique: false
});

const age = reactive({
	minAge: '',
	maxAge: '',
	group: 'all',
	distribution: 'population',
	count: 8,
	unique: false
});

const gender = reactive({
	language: 'en',
	includeUnknown: false,
	includeNonbinary: false,
	count: 8,
	unique: false
});

const organization = reactive({
	language: 'en',
	type: 'all',
	industry: 'all',
	includeLegalForm: '',
	count: 8,
	realism: 'real',
	minLength: '',
	maxLength: '',
	startsWith: '',
	unique: false
});

const date = reactive({
	minDate: '',
	maxDate: '',
	format: '',
	unit: '',
	count: 8,
	unique: false
});

/**
 * What `separator` is left at when the reader has not picked one: the country's
 * own punctuation, which is the option left out rather than any string. `''` is
 * a separator of its own — the digits alone — so it cannot stand for "none".
 */
const OWN_SEPARATOR = 'own';

/** The separators the select offers, each with how it reads in a call. */
const PHONE_SEPARATORS = [
	{ value: '', label: "''" },
	{ value: '-', label: "'-'" },
	{ value: ' ', label: "' '" },
	{ value: '.', label: "'.'" }
];

const phone = reactive({
	country: 'all',
	type: 'mobile',
	includeCountryCode: false,
	separator: OWN_SEPARATOR,
	count: 8,
	unique: false
});

/**
 * Whether a company can come out. An industry and a legal form are a company's,
 * so their selects only mean something then — and with `type` on `all`, an
 * industry asks for companies outright.
 */
const companyPossible = computed(() => ['all', 'company'].includes(organization.type));

/** `randLocation` and the four that hand back one level of it, by the name picked. */
const LOCATION_FUNCTIONS = { randLocation, randCountry, randRegion, randCity, randDistrict };

/**
 * The languages the picked function writes. `randCountry` names every country in
 * every word language; the rest write only the languages with divisions.
 */
const placeLanguages = computed(() =>
	place.fn === 'randCountry' ? WORD_LANGUAGES : LOCATION_LANGUAGES
);

// A language the newly picked function does not write falls back to all of them,
// rather than asking it for a language it would quietly replace.
watch(placeLanguages, (languages) => {
	if (place.language !== 'all' && !languages.includes(place.language)) {
		place.language = 'all';
	}
});

const SENTENCE_SLOTS = [
	'object',
	'place',
	'time',
	'manner',
	'state',
	'quantity',
	'money',
	'date',
	'clock'
];

const SENTENCE_TYPES = ['statement', 'question', 'exclamation', 'trailing', 'dialogue', 'thought'];

const SENTENCE_STYLES = ['plain', 'casual', 'polite', 'formal'];

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

	if (tab.value === 'age') {
		if (num(age.minAge) !== undefined) out.minAge = num(age.minAge);
		if (num(age.maxAge) !== undefined) out.maxAge = num(age.maxAge);
		if (age.group !== 'all') out.group = age.group;
		if (age.distribution !== 'population') out.distribution = age.distribution;
		if (age.count !== 1) out.count = Number(age.count);
		if (age.unique) out.unique = true;

		return out;
	}

	if (tab.value === 'date') {
		if (date.minDate.trim()) out.minDate = date.minDate.trim();
		if (date.maxDate.trim()) out.maxDate = date.maxDate.trim();
		if (date.format) out.format = date.format;
		if (date.unit) out.unit = date.unit;
		if (date.count !== 1) out.count = Number(date.count);
		if (date.unique) out.unique = true;

		return out;
	}

	if (tab.value === 'phone') {
		if (phone.country !== 'all') out.country = phone.country;
		if (phone.type !== 'mobile') out.type = phone.type;
		if (phone.includeCountryCode) out.includeCountryCode = true;
		if (phone.separator !== OWN_SEPARATOR) out.separator = phone.separator;
		if (phone.count !== 1) out.count = Number(phone.count);
		if (phone.unique) out.unique = true;

		return out;
	}

	if (tab.value === 'gender') {
		if (gender.language !== 'all') out.language = gender.language;
		if (gender.includeUnknown) out.includeUnknown = true;
		if (gender.includeNonbinary) out.includeNonbinary = true;
		if (gender.count !== 1) out.count = Number(gender.count);
		if (gender.unique) out.unique = true;

		return out;
	}

	if (tab.value === 'organization') {
		if (organization.language !== 'all') out.language = organization.language;
		if (organization.type !== 'all') out.type = organization.type;
		if (companyPossible.value && organization.industry !== 'all') {
			out.industry = organization.industry;
		}
		if (companyPossible.value && organization.includeLegalForm) {
			out.includeLegalForm = organization.includeLegalForm === 'on';
		}
		if (organization.count !== 1) out.count = Number(organization.count);
		if (organization.realism !== 'real') out.realism = organization.realism;
		if (num(organization.minLength) !== undefined) out.minLength = num(organization.minLength);
		if (num(organization.maxLength) !== undefined) out.maxLength = num(organization.maxLength);
		if (organization.startsWith) out.startsWith = organization.startsWith;
		if (organization.unique) out.unique = true;

		return out;
	}

	if (tab.value === 'location') {
		if (place.language !== 'all') out.language = place.language;
		// Only `randLocation` takes a level; the other four answer it.
		if (place.fn === 'randLocation' && place.level !== 'district') out.level = place.level;
		if (place.fn === 'randLocation' && !place.includeCountry) out.includeCountry = false;
		if (place.count !== 1) out.count = Number(place.count);
		if (num(place.minLength) !== undefined) out.minLength = num(place.minLength);
		if (num(place.maxLength) !== undefined) out.maxLength = num(place.maxLength);
		if (place.startsWith) out.startsWith = place.startsWith;
		if (place.unique) out.unique = true;

		return out;
	}

	if (tab.value === 'sentence') {
		if (sentence.language !== 'all') out.language = sentence.language;
		if (sentence.theme !== 'all') out.theme = sentence.theme;
		if (sentence.shape !== 'all') out.shape = sentence.shape;
		if (sentence.slots !== 'all') out.slots = sentence.slots;
		if (Number(sentence.sentences) > 1) out.sentences = Number(sentence.sentences);
		if (sentence.includeName) out.includeName = sentence.includeName === 'on';
		if (sentence.type) out.type = sentence.type;
		if (sentence.style) out.style = sentence.style;
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
 * Whether the tab offers a decorator at all. A decorator attaches a token or a
 * word to a name or a handle, and a sentence, a real place, an age, a gender,
 * an organization, a date and a phone number are not strings anybody attaches
 * one to.
 */
const decoratable = computed(() => ['name', 'nickname', 'word'].includes(tab.value));

/** Whether a decorator runs. */
const decorating = computed(() => decoratable.value && decorate.kind !== 'none');

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
	} else if (tab.value === 'age') {
		if (details.value) {
			const drawn = randAge({ ...config, output: 'detail' });

			items = drawn.map((detail) => String(detail.age));
			meta = drawn.map((detail) => [['group', detail.group]]);
		} else {
			items = randAge(config).map(String);
		}
	} else if (tab.value === 'date') {
		if (details.value) {
			const drawn = randDate({ ...config, output: 'detail' });

			// The detail is the whole date whatever `unit` asked for, so the line shows
			// the part the value form would have, and the date beside it.
			items = drawn.map((detail) => (date.unit ? String(detail[date.unit]) : detail.date));
			meta = drawn.map((detail) => [
				['date', detail.date],
				['timestamp', String(detail.timestamp)]
			]);
		} else {
			items = randDate(config).map(String);
		}
	} else if (tab.value === 'phone') {
		if (details.value) {
			const drawn = randPhone({ ...config, output: 'detail' });

			items = drawn.map((detail) => detail.phone);
			meta = drawn.map((detail) => [
				['e164', detail.e164],
				['country', detail.country],
				['callingCode', detail.callingCode],
				['type', detail.type]
			]);
		} else {
			items = randPhone(config);
		}
	} else if (tab.value === 'gender') {
		if (details.value) {
			const drawn = randGender({ ...config, output: 'detail' });

			items = drawn.map((detail) => detail.gender);
			meta = drawn.map((detail) => [
				['code', detail.code],
				['language', detail.language]
			]);
		} else {
			items = randGender(config);
		}
	} else if (tab.value === 'organization') {
		if (details.value) {
			const drawn = randOrganization({ ...config, output: 'detail' });

			items = drawn.map((detail) => detail.organization);
			meta = drawn.map((detail) => [
				['name', detail.name],
				['legalForm', String(detail.legalForm)],
				['type', detail.type],
				['industry', String(detail.industry)],
				['language', detail.language]
			]);
		} else {
			items = randOrganization(config);
		}
	} else if (tab.value === 'location') {
		const draw = LOCATION_FUNCTIONS[place.fn];

		if (details.value && place.fn === 'randCountry') {
			const drawn = draw({ ...config, output: 'detail' });

			items = drawn.map((detail) => detail.country);
			meta = drawn.map((detail) => [
				['code', detail.code],
				['language', detail.language]
			]);
		} else if (details.value) {
			const drawn = draw({ ...config, output: 'detail' });

			items = drawn.map((detail) => detail.location);
			meta = drawn.map((detail) => [
				['level', detail.level],
				['country', detail.country],
				['region', String(detail.region)],
				['city', String(detail.city)],
				['district', String(detail.district)],
				['language', detail.language]
			]);
		} else {
			items = draw(config);
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

// Switching tab, turning details on or picking another location function is a
// different question, so it is asked straight away rather than leaving the
// previous answer on screen.
watch([tab, details, () => place.fn], generate);

/**
 * Whether an empty location result is the level missing rather than a filter
 * that matched nothing: US locations stop at the city, so `randDistrict` has
 * nothing to hand back in English whatever the options say.
 */
const levelMissing = computed(
	() =>
		tab.value === 'location' &&
		!place.startsWith &&
		num(place.minLength) === undefined &&
		num(place.maxLength) === undefined
);

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
	sentence: 'randSentence',
	age: 'randAge',
	gender: 'randGender',
	organization: 'randOrganization',
	date: 'randDate',
	phone: 'randPhone'
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
	const generator = tab.value === 'location' ? place.fn : GENERATORS[tab.value];
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
		<div ref="tablist" class="randino-demo-tabs" role="tablist" @keydown="onTabKey">
			<button
				v-for="item in TABS"
				:id="`randino-demo-tab-${item}`"
				:key="item"
				type="button"
				role="tab"
				class="randino-demo-tab"
				:aria-selected="tab === item"
				:aria-controls="`randino-demo-panel-${item}`"
				:tabindex="tab === item ? 0 : -1"
				@click="tab = item"
			>
				{{ t(locale, TAB_LABELS[item]) }}
			</button>
		</div>

		<div
			:id="`randino-demo-panel-${tab}`"
			class="randino-demo-body"
			role="tabpanel"
			:aria-labelledby="`randino-demo-tab-${tab}`"
			tabindex="0"
		>
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

			<div v-else-if="tab === 'age'" class="randino-demo-fields">
				<label class="randino-demo-field">
					<span><code>minAge</code></span>
					<input v-model="age.minAge" type="number" min="0" :max="RAND_AGE_MAX" placeholder="0" />
				</label>

				<label class="randino-demo-field">
					<span><code>maxAge</code></span>
					<input v-model="age.maxAge" type="number" min="0" :max="RAND_AGE_MAX" placeholder="100" />
				</label>

				<label class="randino-demo-field">
					<span><code>group</code></span>
					<select v-model="age.group">
						<option value="all">all</option>
						<option v-for="item in AGE_GROUPS" :key="item" :value="item">{{ item }}</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>distribution</code></span>
					<select v-model="age.distribution">
						<option value="population">population</option>
						<option value="uniform">uniform</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>count</code></span>
					<input v-model.number="age.count" type="number" min="1" :max="COUNT_MAX" />
				</label>

				<label class="randino-demo-check">
					<input v-model="age.unique" type="checkbox" />
					<code>unique</code>
				</label>
			</div>

			<div v-else-if="tab === 'date'" class="randino-demo-fields">
				<label class="randino-demo-field">
					<span><code>minDate</code></span>
					<input v-model="date.minDate" type="text" placeholder="1900-01-01" />
				</label>

				<label class="randino-demo-field">
					<span><code>maxDate</code></span>
					<input v-model="date.maxDate" type="text" placeholder="2099-12-31" />
				</label>

				<label class="randino-demo-field">
					<span><code>format</code></span>
					<input v-model="date.format" type="text" placeholder="YYYY-MM-DDTHH:mm:ss.SSSZ" />
				</label>

				<label class="randino-demo-field">
					<span><code>unit</code></span>
					<select v-model="date.unit">
						<option value="">—</option>
						<option v-for="item in DATE_UNITS" :key="item" :value="item">{{ item }}</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>count</code></span>
					<input v-model.number="date.count" type="number" min="1" :max="COUNT_MAX" />
				</label>

				<label class="randino-demo-check">
					<input v-model="date.unique" type="checkbox" />
					<code>unique</code>
				</label>
			</div>

			<div v-else-if="tab === 'phone'" class="randino-demo-fields">
				<label class="randino-demo-field">
					<span><code>country</code></span>
					<select v-model="phone.country">
						<option value="all">all</option>
						<option v-for="item in PHONE_COUNTRIES" :key="item" :value="item">{{ item }}</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>type</code></span>
					<select v-model="phone.type">
						<option v-for="item in PHONE_TYPES" :key="item" :value="item">{{ item }}</option>
						<option value="all">all</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>separator</code></span>
					<select v-model="phone.separator">
						<option :value="OWN_SEPARATOR">—</option>
						<option v-for="item in PHONE_SEPARATORS" :key="item.label" :value="item.value">
							{{ item.label }}
						</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>count</code></span>
					<input v-model.number="phone.count" type="number" min="1" :max="COUNT_MAX" />
				</label>

				<label class="randino-demo-check">
					<input v-model="phone.includeCountryCode" type="checkbox" />
					<code>includeCountryCode</code>
				</label>

				<label class="randino-demo-check">
					<input v-model="phone.unique" type="checkbox" />
					<code>unique</code>
				</label>
			</div>

			<div v-else-if="tab === 'gender'" class="randino-demo-fields">
				<label class="randino-demo-field">
					<span><code>language</code></span>
					<select v-model="gender.language">
						<option value="all">all</option>
						<option v-for="code_ in WORD_LANGUAGES" :key="code_" :value="code_">
							{{ code_ }} — {{ LANGUAGE_NAMES[code_] }}
						</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>count</code></span>
					<input v-model.number="gender.count" type="number" min="1" :max="COUNT_MAX" />
				</label>

				<label class="randino-demo-check">
					<input v-model="gender.includeUnknown" type="checkbox" />
					<code>includeUnknown</code>
				</label>

				<label class="randino-demo-check">
					<input v-model="gender.includeNonbinary" type="checkbox" />
					<code>includeNonbinary</code>
				</label>

				<label class="randino-demo-check">
					<input v-model="gender.unique" type="checkbox" />
					<code>unique</code>
				</label>
			</div>

			<div v-else-if="tab === 'organization'" class="randino-demo-fields">
				<label class="randino-demo-field">
					<span><code>language</code></span>
					<select v-model="organization.language">
						<option value="all">all</option>
						<option v-for="code_ in WORD_LANGUAGES" :key="code_" :value="code_">
							{{ code_ }} — {{ LANGUAGE_NAMES[code_] }}
						</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>type</code></span>
					<select v-model="organization.type">
						<option value="all">all</option>
						<option v-for="item in ORGANIZATION_TYPES" :key="item" :value="item">
							{{ item }}
						</option>
					</select>
				</label>

				<label class="randino-demo-field" :class="{ 'is-off': !companyPossible }">
					<span><code>industry</code></span>
					<select v-model="organization.industry" :disabled="!companyPossible">
						<option value="all">all</option>
						<option v-for="item in ORGANIZATION_INDUSTRIES" :key="item" :value="item">
							{{ item }}
						</option>
					</select>
				</label>

				<label class="randino-demo-field" :class="{ 'is-off': !companyPossible }">
					<span><code>includeLegalForm</code></span>
					<select v-model="organization.includeLegalForm" :disabled="!companyPossible">
						<option value="">random</option>
						<option value="on">on</option>
						<option value="off">off</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>count</code></span>
					<input v-model.number="organization.count" type="number" min="1" :max="COUNT_MAX" />
				</label>

				<label class="randino-demo-field">
					<span><code>realism</code></span>
					<select v-model="organization.realism">
						<option value="real">real</option>
						<option value="mixed">mixed</option>
						<option value="invented">invented</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>minLength</code></span>
					<input v-model="organization.minLength" type="number" min="1" placeholder="—" />
				</label>

				<label class="randino-demo-field">
					<span><code>maxLength</code></span>
					<input v-model="organization.maxLength" type="number" min="1" placeholder="—" />
				</label>

				<label class="randino-demo-field">
					<span><code>startsWith</code></span>
					<input v-model="organization.startsWith" type="text" maxlength="1" placeholder="—" />
				</label>

				<label class="randino-demo-check">
					<input v-model="organization.unique" type="checkbox" />
					<code>unique</code>
				</label>
			</div>

			<div v-else-if="tab === 'location'" class="randino-demo-fields">
				<label class="randino-demo-field">
					<span>{{ t(locale, 'demoFunction') }}</span>
					<select v-model="place.fn">
						<option v-for="item in Object.keys(LOCATION_FUNCTIONS)" :key="item" :value="item">
							{{ item }}
						</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>language</code></span>
					<select v-model="place.language">
						<option value="all">all</option>
						<option v-for="code_ in placeLanguages" :key="code_" :value="code_">
							{{ code_ }} — {{ LANGUAGE_NAMES[code_] }}
						</option>
					</select>
				</label>

				<label class="randino-demo-field" :class="{ 'is-off': place.fn !== 'randLocation' }">
					<span><code>level</code></span>
					<select v-model="place.level" :disabled="place.fn !== 'randLocation'">
						<option v-for="item in LOCATION_LEVELS" :key="item" :value="item">{{ item }}</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>count</code></span>
					<input v-model.number="place.count" type="number" min="1" :max="COUNT_MAX" />
				</label>

				<label class="randino-demo-field">
					<span><code>minLength</code></span>
					<input v-model="place.minLength" type="number" min="1" placeholder="—" />
				</label>

				<label class="randino-demo-field">
					<span><code>maxLength</code></span>
					<input v-model="place.maxLength" type="number" min="1" placeholder="—" />
				</label>

				<label class="randino-demo-field">
					<span><code>startsWith</code></span>
					<input v-model="place.startsWith" type="text" maxlength="1" placeholder="—" />
				</label>

				<label class="randino-demo-check" :class="{ 'is-off': place.fn !== 'randLocation' }">
					<input
						v-model="place.includeCountry"
						type="checkbox"
						:disabled="place.fn !== 'randLocation'"
					/>
					<code>includeCountry</code>
				</label>

				<label class="randino-demo-check">
					<input v-model="place.unique" type="checkbox" />
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
					<span><code>type</code></span>
					<select v-model="sentence.type">
						<option value="">random</option>
						<option v-for="item in SENTENCE_TYPES" :key="item" :value="item">{{ item }}</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>style</code></span>
					<select v-model="sentence.style">
						<option value="">random</option>
						<option v-for="item in SENTENCE_STYLES" :key="item" :value="item">{{ item }}</option>
					</select>
				</label>

				<label class="randino-demo-field">
					<span><code>includeName</code></span>
					<select v-model="sentence.includeName">
						<option value="">random</option>
						<option value="on">on</option>
						<option value="off">off</option>
					</select>
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
				<label v-if="decoratable" class="randino-demo-field">
					<span>{{ t(locale, 'demoDecorate') }}</span>
					<select v-model="decorate.kind">
						<option value="none">{{ t(locale, 'demoDecorateNone') }}</option>
						<option value="suffix">randSuffix</option>
						<option value="prefix">randPrefix</option>
						<option value="modifier">randModifier</option>
					</select>
				</label>

				<label
					v-if="decoratable"
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
					v-if="decoratable"
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

			<ul v-if="rows.length" class="randino-demo-output" aria-live="polite" aria-atomic="false">
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

			<p v-else class="randino-demo-note">
				{{ t(locale, levelMissing ? 'demoNoLevel' : 'demoEmpty') }}
			</p>

			<p v-if="rows.length && rows.length < asked" class="randino-demo-note">
				{{ t(locale, 'demoShort') }}
			</p>

			<p v-if="tab === 'phone'" class="randino-demo-note">{{ t(locale, 'demoPhoneNote') }}</p>

			<details class="randino-demo-code">
				<summary>{{ t(locale, 'demoCall') }}</summary>
				<pre><code>{{ code }}</code></pre>
			</details>

			<p class="randino-demo-note randino-demo-live">{{ t(locale, 'demoLive') }}</p>
		</div>
	</div>
</template>
