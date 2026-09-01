<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useData, useRoute } from 'vitepress';
import LangMark from './LangMark.vue';
import { codeLanguage, setCodeLanguage } from '../../data/language';
import { CODE_LANGUAGES } from '../../data/languages';
import { localeOf, t } from '../../data/i18n';

/**
 * The language switch, at the top of the sidebar.
 *
 * It sits above the menu rather than in the navbar because it is not
 * navigation: it does not take the reader anywhere, it changes what the page
 * they are already on says.
 *
 * It was a stack of three always-visible options, and it is a dropdown now for
 * the reason a setting usually is one: the three of them cost four rows above
 * every sidebar on the site to show two answers nobody is currently reading. A
 * reader picks a language once and then wants the menu back. What is left is one
 * row that names the choice — which is also the only part of the control that
 * was ever load-bearing.
 *
 * **The button's face is not rendered from the ref.** All three labels are in
 * the button and CSS displays the chosen one, exactly the way a `::: lang` block
 * works, because `html[data-lang]` is set by the inline head script before the
 * first paint and a `v-if` cannot run before hydration. Render it from the ref
 * and a pre-rendered page announces "JavaScript" to a reader who chose Python,
 * for as long as it takes the bundle to arrive, on the one control whose whole
 * job is to say which package you are reading.
 *
 * The menu itself is `v-if`'d, so it has no server-rendered markup to disagree
 * with and can read the ref directly.
 */
const { lang } = useData();
const route = useRoute();
const locale = computed(() => localeOf(lang.value));

const open = ref(false);
const root = ref(null);
const button = ref(null);

/** The option buttons, read off the DOM rather than tracked as an array of refs. */
function optionsOf() {
	return root.value ? [...root.value.querySelectorAll('[role="option"]')] : [];
}

function focusOption(index) {
	const options = optionsOf();

	if (options.length) {
		options[(index + options.length) % options.length].focus();
	}
}

/** Opens on the current choice, which is where a reader expects to land. */
async function openMenu(index) {
	open.value = true;

	await nextTick();

	focusOption(index ?? CODE_LANGUAGES.findIndex((item) => item.id === codeLanguage.value));
}

function closeMenu(refocus = false) {
	if (!open.value) {
		return;
	}

	open.value = false;

	if (refocus) {
		button.value?.focus();
	}
}

function choose(id) {
	setCodeLanguage(id);
	closeMenu(true);
}

function onMenuKey(event) {
	const options = optionsOf();
	const at = options.indexOf(document.activeElement);

	switch (event.key) {
		case 'ArrowDown':
			event.preventDefault();
			focusOption(at + 1);
			break;
		case 'ArrowUp':
			event.preventDefault();
			focusOption(at - 1);
			break;
		case 'Home':
			event.preventDefault();
			focusOption(0);
			break;
		case 'End':
			event.preventDefault();
			focusOption(options.length - 1);
			break;
		case 'Escape':
			event.preventDefault();
			closeMenu(true);
			break;
		case 'Tab':
			// Not `preventDefault` — the focus is meant to leave, the menu is not
			// meant to be left behind open.
			closeMenu();
			break;
	}
}

function onPointerDown(event) {
	if (root.value && !root.value.contains(event.target)) {
		closeMenu();
	}
}

onMounted(() => document.addEventListener('pointerdown', onPointerDown));
onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown));

// The sidebar survives a navigation, so without this the menu would too.
watch(
	() => route.path,
	() => closeMenu()
);
</script>

<template>
	<div ref="root" class="randino-lang-select">
		<p id="randino-lang-label" class="randino-lang-title">{{ t(locale, 'languageLabel') }}</p>

		<button
			ref="button"
			type="button"
			class="randino-lang-button"
			aria-haspopup="listbox"
			:aria-expanded="open"
			aria-labelledby="randino-lang-label randino-lang-current"
			@click="open ? closeMenu() : openMenu()"
			@keydown.down.prevent="openMenu()"
			@keydown.up.prevent="openMenu()"
		>
			<span id="randino-lang-current" class="randino-lang-current">
				<span
					v-for="item in CODE_LANGUAGES"
					:key="item.id"
					class="randino-lang randino-lang-face"
					:data-lang="item.id"
				>
					<LangMark :language="item.id" :size="15" />
					<span>{{ item.label }}</span>
				</span>
			</span>
			<svg class="randino-lang-chevron" viewBox="0 0 24 24" aria-hidden="true">
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m6 9 6 6 6-6"
				/>
			</svg>
		</button>

		<div v-if="open" class="randino-lang-menu" @keydown="onMenuKey">
			<!-- The hint is a sibling of the list rather than a child of it: a
			     `listbox` whose children are not all `option`s is a listbox screen
			     readers have to guess at. -->
			<div class="randino-lang-list" role="listbox" :aria-label="t(locale, 'languageSelect')">
				<button
					v-for="item in CODE_LANGUAGES"
					:key="item.id"
					type="button"
					role="option"
					class="randino-lang-option"
					:aria-selected="item.id === codeLanguage"
					@click="choose(item.id)"
				>
					<LangMark :language="item.id" :size="15" />
					<span class="randino-lang-option-label">{{ item.label }}</span>
					<svg class="randino-lang-check" viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill="none"
							stroke="currentColor"
							stroke-width="2.4"
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m5 12.5 4.5 4.5L19 7"
						/>
					</svg>
				</button>
			</div>

			<p class="randino-lang-hint">{{ t(locale, 'languageHint') }}</p>
		</div>
	</div>
</template>
