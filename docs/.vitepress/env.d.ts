/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue';

	const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;

	export default component;
}

// `markdown-it-container` ships no types and has no `@types` package. It is used
// once, in `config.ts`, to register the `::: lang` container.
declare module 'markdown-it-container';
