import { defineAsyncComponent } from 'vue';
import DefaultTheme from 'vitepress/theme';
import Layout from './components/Layout.vue';
import Lang from './components/Lang.vue';
import LangStart from './components/LangStart.vue';
import WordOptions from './components/WordOptions.vue';
import LocationOptions from './components/LocationOptions.vue';
import PackageLinks from './components/PackageLinks.vue';
import { syncCodeLanguage } from '../data/language';
import './styles/lang.css';
import './styles/nav.css';
import './styles/demo.css';
import './custom.css';

export default {
	extends: DefaultTheme,
	// Adds the language switch to the sidebar; everything else is the default theme.
	Layout,
	enhanceApp({ app }) {
		// Used straight from Markdown, so it is registered globally rather than
		// imported page by page.
		app.component('Lang', Lang);

		// Named as a string by the navbar's Packages menu in `config.ts` — a nav
		// item is JSON, so the component behind one has to be findable by name.
		app.component('PackageLinks', PackageLinks);

		// Used straight from `demo.md`, the same way `Lang` is used from every
		// reference page. Loaded only where it is used: the demo runs the whole
		// library, and imported here it put every pool in the chunk each page of the
		// site loads, whether or not the page had a demo on it.
		app.component(
			'Demo',
			defineAsyncComponent(() => import('./components/Demo.vue'))
		);

		// The home page's package picker, which writes the same choice the
		// sidebar's switch does.
		app.component('LangStart', LangStart);

		// One table, twenty-six pages: `randWord` and each of its themed forms.
		app.component('WordOptions', WordOptions);

		// One table, five pages: `randLocation` and each of its level functions.
		app.component('LocationOptions', LocationOptions);

		// Reads the stored choice into the reactive copy the components use, and
		// writes it back onto `<html>`. No-op during SSR.
		syncCodeLanguage();
	}
};
