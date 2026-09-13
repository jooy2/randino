<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';
import Lang from './Lang.vue';
import { localeOf, t } from '../../data/i18n';
import { locationOptionRows } from '../../data/locationOptions';
import { isPhrase, isVariants } from '../../data/wordOptions';

/**
 * The option table `randLocation` and its four level functions share, drawn from
 * `data/locationOptions.ts` for the same reason `WordOptions.vue` draws its own:
 * five pages, two locales and three packages' types in every cell.
 */
const props = defineProps({
	/** Include the `level` row. Only `randLocation` takes one; the rest answer it. */
	level: { type: Boolean, default: false },
	/** `randCountry`'s page, whose `language` is any word language. */
	country: { type: Boolean, default: false }
});

const { lang } = useData();
const locale = computed(() => localeOf(lang.value));
const rows = computed(() => locationOptionRows(props.level, props.country));
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
