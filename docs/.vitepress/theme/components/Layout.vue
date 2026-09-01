<script setup>
import DefaultTheme from 'vitepress/theme';
import { onContentUpdated } from 'vitepress';
import { nextTick, watch } from 'vue';
import LangSelect from './LangSelect.vue';
import { codeLanguage } from '../../data/language';

/**
 * The default layout with one addition: the language switch above the sidebar
 * menu.
 *
 * The rest of this file is the outline, filtered to the selected language. A
 * heading inside a `::: lang` block is hidden with the block it belongs to, but
 * VitePress builds "On this page" from the Markdown rather than from the DOM —
 * so without this a reader on Dart is offered a link to a JavaScript-only
 * heading, and clicking it scrolls to nothing.
 *
 * Done here rather than by teaching the outline about packages because the
 * outline is the default theme's, and this is a handful of lines against a fork
 * of it. The anchors are the join: an outline link's `href` is the id of the
 * heading it points at, and the heading knows which block it is in.
 */
const { Layout } = DefaultTheme;

function syncOutline() {
	const doc = document.querySelector('.vp-doc');

	if (!doc) {
		return;
	}

	for (const link of document.querySelectorAll('.outline-link')) {
		const id = decodeURIComponent(link.getAttribute('href')?.slice(1) ?? '');
		const heading = id ? doc.querySelector(`[id="${CSS.escape(id)}"]`) : null;
		const block = heading?.closest('.randino-lang');
		const hidden = Boolean(block) && !block.dataset.lang.split(' ').includes(codeLanguage.value);

		(link.closest('li') ?? link).classList.toggle('randino-lang-hidden', hidden);
	}
}

// `onContentUpdated` is the hook the outline itself is built on, so it fires on
// the first render and on every navigation — and a `nextTick` puts this after
// the outline has been rebuilt rather than in the middle of it.
onContentUpdated(() => nextTick(syncOutline));

// And again when the reader switches package, which changes which half of the
// page exists without changing the page.
watch(codeLanguage, () => nextTick(syncOutline));
</script>

<template>
	<Layout>
		<template #sidebar-nav-before>
			<LangSelect />
		</template>
	</Layout>
</template>
