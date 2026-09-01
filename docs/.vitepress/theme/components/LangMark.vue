<script setup>
import { computed } from 'vue';
import { CODE_LANGUAGES } from '../../data/languages';

/**
 * A language's own logo, drawn at text size and in its own colour.
 *
 * It is here rather than in `data/languages.ts` because a data file holding raw
 * path data is a data file nobody can read. Adding a language is an entry in
 * that file plus a branch here — the one place the "one entry" rule bends, and
 * it bends because a logo is a drawing.
 *
 * Both marks are the products' own, used to name them. They take their colour
 * from `tint` rather than from the text around them: a logo in the wrong colour
 * is a worse logo, and here the mark is what identifies the choice rather than
 * decorating it.
 */
const props = defineProps({
	language: { type: String, required: true },
	size: { type: Number, default: 14 }
});

const tint = computed(
	() => CODE_LANGUAGES.find((item) => item.id === props.language)?.tint ?? 'currentColor'
);
</script>

<template>
	<svg
		v-if="language === 'js'"
		class="randino-lang-mark"
		viewBox="0 0 24 24"
		:width="size"
		:height="size"
		:style="{ color: tint }"
		aria-hidden="true"
	>
		<rect width="24" height="24" rx="2" fill="currentColor" />
		<path
			fill="#000"
			d="M6.5 17.2l1.6-1c.3.6.6 1 1.3 1s1-.3 1-1.2V10h2v6c0 2.1-1.2 3-3 3-1.7 0-2.7-.9-3.2-2zm7 0l1.6-.9c.4.7 1 1.2 2 1.2.8 0 1.3-.4 1.3-1 0-.7-.5-.9-1.5-1.3l-.5-.2c-1.5-.6-2.5-1.4-2.5-3.1 0-1.6 1.2-2.7 3-2.7 1.3 0 2.3.4 3 1.6l-1.6 1c-.4-.6-.8-.9-1.4-.9s-1 .4-1 .9c0 .6.4.8 1.3 1.2l.5.2c1.8.8 2.8 1.5 2.8 3.2 0 1.9-1.5 3-3.5 3-2 0-3.2-.9-3.8-2.1z"
		/>
	</svg>
	<svg
		v-else-if="language === 'dart'"
		class="randino-lang-mark"
		viewBox="0 0 24 24"
		:width="size"
		:height="size"
		:style="{ color: tint }"
		aria-hidden="true"
	>
		<path
			fill="currentColor"
			d="M4.105 4.105S9.158 1.58 11.684.316a3.1 3.1 0 0 1 1.481-.315c.766.047 1.677.788 1.677.788L24 9.948v9.789h-4.263V24H9.789l-9-9C.303 14.5 0 13.795 0 13.105c0-.319.18-.818.316-1.105zm.679.679v11.787c.002.543.021 1.024.498 1.508L10.204 23h8.533v-4.263zm12.055-.678c-.899-.896-1.809-1.78-2.74-2.643c-.302-.267-.567-.468-1.07-.462c-.37.014-.87.195-.87.195L6.341 4.105z"
		/>
	</svg>
</template>
