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
 * Each mark is the product's own, used to name it. They take their colour from
 * `tint` rather than from the text around them: a logo in the wrong colour is a
 * worse logo, and here the mark is what identifies the choice rather than
 * decorating it. Python's is its two-tone logo drawn in one of its two tones,
 * which is how a monochrome mark of it is normally set.
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
	<svg
		v-else-if="language === 'py'"
		class="randino-lang-mark"
		viewBox="0 0 24 24"
		:width="size"
		:height="size"
		:style="{ color: tint }"
		aria-hidden="true"
	>
		<path
			fill="currentColor"
			d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"
		/>
	</svg>
</template>
