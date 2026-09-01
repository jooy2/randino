<script setup>
import { computed, useAttrs } from 'vue';
import { CODE_LANGUAGES } from '../../data/languages';

/**
 * The inline half of `::: lang` — a few words that differ, in the middle of a
 * sentence that does not.
 *
 * `<Lang js="options object" dart="named parameters" />`
 *
 * A container cannot do this: `:::` is a block, and splitting a sentence into
 * two blocks to swap one phrase inside it would leave two paragraphs where there
 * was one. Anything longer than a phrase belongs in the block form.
 *
 * Each package's text arrives as an attribute named after its id, read off
 * `$attrs` rather than declared, so adding a package stays one entry in
 * `data/languages.ts`. One with nothing given for it renders nothing, which is
 * how a clause only one of them has gets written.
 */
defineOptions({ inheritAttrs: false });

defineProps({
	/** Renders each variant as `<code>`, for an option or an identifier. */
	code: { type: Boolean, default: false }
});

const attrs = useAttrs();

const variants = computed(() =>
	CODE_LANGUAGES.filter((language) => attrs[language.id]).map((language) => ({
		id: language.id,
		text: String(attrs[language.id])
	}))
);
</script>

<template>
	<template v-for="variant in variants" :key="variant.id">
		<code v-if="code" class="randino-lang" :data-lang="variant.id">{{ variant.text }}</code>
		<span v-else class="randino-lang" :data-lang="variant.id">{{ variant.text }}</span>
	</template>
</template>
