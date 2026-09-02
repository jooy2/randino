import DefaultTheme from 'vitepress/theme';
import Layout from './components/Layout.vue';
import Lang from './components/Lang.vue';
import Demo from './components/Demo.vue';
import WordOptions from './components/WordOptions.vue';
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
		// reference page.
		app.component('Demo', Demo);

		// One table, fifteen pages: `randWord` and each of its themed forms.
		app.component('WordOptions', WordOptions);

		// Reads the stored choice into the reactive copy the components use, and
		// writes it back onto `<html>`. No-op during SSR.
		syncCodeLanguage();
	}
};
