<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';
import Lang from './Lang.vue';
import { localeOf, t } from '../../data/i18n';
import { isPhrase, isVariants, wordOptionRows } from '../../data/wordOptions';

/**
 * The option table `randWord` and its twenty-five themed forms share.
 *
 * Fifteen pages take the same options, and the only difference is that the
 * themed ones answer `theme` rather than accepting it. Written out in Markdown
 * that is thirty copies of one table — in two locales, with three packages'
 * types in every cell — and an option added to the generator would have to be
 * added to all thirty. So the rows live in `data/wordOptions.ts` and this draws
 * them; `llms-full.txt` draws the same rows as plain Markdown.
 *
 * The **row labels are the option names themselves**, which is the rule the
 * reference pages follow for headings too: `minLength` is what the reader will
 * type. Only the prose around them is localised.
 */
const props = defineProps({
	/** Include the `theme` row. Only `randWord` takes one; the rest answer it. */
	theme: { type: Boolean, default: false }
});

const { lang } = useData();
const locale = computed(() => localeOf(lang.value));
const rows = computed(() => wordOptionRows(props.theme));
</script>

<template>
	<table class="randino-options">
		<thead>
			<tr>
				<th>{{ t(locale, 'optionName') }}</th>
				<th>{{ t(locale, 'optionType') }}</th>
				<th>{{ t(locale, 'optionDefault') }}</th>
				<th>{{ t(locale, 'optionAbout') }}</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="row in rows"
				:key="row.about"
				:class="row.langs ? 'randino-lang' : undefined"
				:data-lang="row.langs"
			>
				<td v-for="cell in [row.name, row.type, row.fallback]" :key="String(cell)">
					<em v-if="isPhrase(cell)">{{ t(locale, cell.i18n) }}</em>
					<Lang v-else-if="isVariants(cell)" v-bind="cell" code />
					<code v-else>{{ cell }}</code>
				</td>
				<td>{{ t(locale, row.about) }}</td>
			</tr>
		</tbody>
	</table>
</template>
