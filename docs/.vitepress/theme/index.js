import DefaultTheme from 'vitepress/theme';
import Layout from './components/Layout.vue';
import Lang from './components/Lang.vue';
import { syncCodeLanguage } from '../data/language';
import './styles/lang.css';
import './custom.css';

export default {
	extends: DefaultTheme,
	// Adds the package switch to the sidebar; everything else is the default theme.
	Layout,
	enhanceApp({ app }) {
		// Used straight from Markdown, so it is registered globally rather than
		// imported page by page.
		app.component('Lang', Lang);

		// Reads the stored choice into the reactive copy the components use, and
		// writes it back onto `<html>`. No-op during SSR.
		syncCodeLanguage();
	}
};
