<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';
import LangMark from './LangMark.vue';
import { setCodeLanguage } from '../../data/language';
import { CODE_LANGUAGES } from '../../data/languages';
import { localeOf, t } from '../../data/i18n';

/**
 * The package picker on the home page.
 *
 * The sidebar's switch is a setting: one row that names the current choice and
 * hides the others until asked. This is the same choice made the other way
 * round — three cards, all visible, for a reader who has not made it yet and is
 * standing on the page whose code samples are about to change under them.
 *
 * It writes the same value the sidebar's switch does, so picking here is picking
 * for the whole site.
 *
 * **Which card is current is drawn by CSS, not by the ref.** `html[data-lang]`
 * is set by the inline head script before the first paint, while a value read
 * from the ref would be the default in the pre-rendered HTML and would have to
 * be corrected on hydration — on the one control whose job is to say which
 * package you are reading. The "selected" label inside each card is in the
 * document three times for the same reason, so that a screen reader is told the
 * state without anything having to re-render to say it.
 */
const { lang } = useData();
const locale = computed(() => localeOf(lang.value));
</script>

<template>
	<div class="randino-start">
		<div class="randino-start-options" role="group" :aria-label="t(locale, 'languageSelect')">
			<button
				v-for="item in CODE_LANGUAGES"
				:key="item.id"
				type="button"
				class="randino-start-option"
				:data-lang="item.id"
				@click="setCodeLanguage(item.id)"
			>
				<LangMark :language="item.id" :size="30" />
				<span class="randino-start-label">{{ item.label }}</span>
				<code class="randino-start-install">{{ item.install }}</code>
				<span class="randino-lang randino-start-current" :data-lang="item.id">
					{{ t(locale, 'languageCurrent') }}
				</span>
			</button>
		</div>

		<p class="randino-start-hint">{{ t(locale, 'languageHint') }}</p>
	</div>
</template>
