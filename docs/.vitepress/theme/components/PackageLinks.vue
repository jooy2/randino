<script setup>
import { inject } from 'vue';
import LangMark from './LangMark.vue';
import { CODE_LANGUAGES } from '../../data/languages';

/**
 * The navbar's Packages menu — one row per registry randino is published to.
 *
 * It replaces three social-link icons. npm, pub.dev and PyPI were sitting next
 * to GitHub as logos, which put four marks in the corner that also holds the
 * locale switch and the appearance toggle, and asked the reader to recognise
 * three of them by drawing alone. A dropdown gives each one its name and its
 * language, and leaves the corner with the one icon that is genuinely a
 * destination rather than a package.
 *
 * VitePress renders a nav item that has a `component` instead of a `link`
 * through this file, in the desktop flyout and in the mobile nav screen alike —
 * the screen passes `screen-menu`, which is the only thing the two need to
 * disagree about.
 *
 * The mark is the **language's**, not the registry's: it is the same mark the
 * sidebar's language switch uses, so the row a reader on Dart wants is the row
 * with the icon they already picked.
 */
defineProps({
	/** `{ id, registry, url }` per package — built in `config.ts` from the manifests. */
	links: { type: Array, required: true },
	/** Set by VitePress when this renders inside the mobile nav screen. */
	screenMenu: { type: Boolean, default: false }
});

/*
 * The mobile nav screen stays open behind whatever it opened, so the link that
 * left it has to close it. Provided by `VPNav`, which is above both places this
 * renders — the fallback is only there so the component does not depend on it.
 */
const closeScreen = inject('close-screen', null);

function labelOf(id) {
	return CODE_LANGUAGES.find((item) => item.id === id)?.label ?? id;
}
</script>

<template>
	<div class="randino-pkg" :class="{ 'randino-pkg-screen': screenMenu }">
		<a
			v-for="item in links"
			:key="item.id"
			class="randino-pkg-link"
			:href="item.url"
			target="_blank"
			rel="noopener"
			@click="closeScreen?.()"
		>
			<LangMark :language="item.id" :size="16" />
			<span class="randino-pkg-registry">{{ item.registry }}</span>
			<span class="randino-pkg-lang">{{ labelOf(item.id) }}</span>
		</a>
	</div>
</template>
