<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';
import Lang from './Lang.vue';
import { localeOf, t } from '../../data/i18n';
import { FICTIONAL_PLACE_OPTIONS } from '../../data/fictionalOptions';
import { isPhrase, isVariants } from '../../data/wordOptions';

/**
 * The option table the four fictional place functions share, drawn from
 * `data/fictionalOptions.ts` for the same reason `LocationOptions.vue` draws its
 * own: four pages, two locales and three packages' types in every cell.
 */
const { lang } = useData();
const locale = computed(() => localeOf(lang.value));
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
				v-for="row in FICTIONAL_PLACE_OPTIONS"
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
