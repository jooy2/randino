<script setup>
import { computed, onMounted, ref } from 'vue';
import { useData } from 'vitepress';
import LangMark from './LangMark.vue';
import { codeLanguage, setCodeLanguage } from '../../data/language';
import { CODE_LANGUAGES, DEFAULT_CODE_LANGUAGE } from '../../data/languages';
import { localeOf, t } from '../../data/i18n';

/**
 * The package switch, at the top of the sidebar.
 *
 * It sits above the menu rather than in the navbar because it is not
 * navigation: it does not take the reader anywhere, it changes what the page
 * they are already on says.
 *
 * A segmented control rather than a `<select>`, and the reason is not that a
 * select is ugly. There are exactly two options, both are always worth showing,
 * and the choice colours every page on the site — a popup list of two items is a
 * popup for nothing.
 *
 * Built out of real radio inputs, hidden and labelled. That is what buys the
 * arrow keys, the group semantics and the focus behaviour for free; a row of
 * `<button>`s would need a roving tabindex written by hand to be as good.
 */
const { lang } = useData();
const locale = computed(() => localeOf(lang.value));

/*
 * Which option the radios say is chosen — and it is deliberately behind the page
 * for one tick.
 *
 * The pre-rendered HTML is built with the default selected, because that is all
 * a build can know. `syncCodeLanguage()` then runs in `enhanceApp`, *before*
 * hydration, so by the time this component first renders in the browser it
 * already holds the stored choice — and a first render that disagrees with the
 * server's DOM is precisely what Vue does not repair: hydration patches event
 * handlers and `value`, and leaves `checked` and `class` as the server wrote
 * them.
 *
 * Rendering the default first and correcting it in `onMounted` makes the
 * correction an ordinary update, which Vue does apply. What the eye reads
 * meanwhile is not this at all — the active option is drawn from
 * `html[data-lang]`, which the inline head script sets before the first paint.
 */
const hydrated = ref(false);

onMounted(() => {
	hydrated.value = true;
});

const checked = computed(() => (hydrated.value ? codeLanguage.value : DEFAULT_CODE_LANGUAGE));
</script>

<template>
	<div class="randino-lang-select">
		<p id="randino-lang-label" class="randino-lang-title">{{ t(locale, 'languageLabel') }}</p>
		<div class="randino-lang-track" role="radiogroup" aria-labelledby="randino-lang-label">
			<label
				v-for="item in CODE_LANGUAGES"
				:key="item.id"
				class="randino-lang-option"
				:data-lang="item.id"
			>
				<input
					type="radio"
					name="randino-lang"
					:value="item.id"
					:checked="checked === item.id"
					@change="setCodeLanguage(item.id)"
				/>
				<LangMark :language="item.id" />
				<span>{{ item.label }}</span>
			</label>
		</div>
	</div>
</template>
