<script setup>
import { computed } from 'vue';

/**
 * A registry's own logo, drawn at text size and in its own colour.
 *
 * The sibling of `LangMark.vue`, and separate from it on purpose: npm is not
 * JavaScript and PyPI is not Python. The navbar's Packages menu is a list of
 * places to install from, so it is labelled with the marks those places use —
 * the JavaScript logo next to `npm` named the wrong thing.
 *
 * pub.dev is the one that looks like a language mark, and it is not a mistake:
 * pub.dev brands itself with the Dart logo, so that is its mark too.
 *
 * The paths are Simple Icons', which is where VitePress's own social icons come
 * from. Each takes its colour from `tint` rather than from the text around it —
 * a logo in the wrong colour is a worse logo, and here the mark identifies the
 * row rather than decorating it.
 */
const TINTS = {
	npm: '#CB3837',
	pubdev: '#0175C2',
	pypi: '#3775A9'
};

const props = defineProps({
	registry: { type: String, required: true },
	size: { type: Number, default: 16 }
});

const tint = computed(() => TINTS[props.registry] ?? 'currentColor');
</script>

<template>
	<svg
		v-if="registry === 'npm'"
		class="randino-registry-mark"
		viewBox="0 0 24 24"
		:width="size"
		:height="size"
		:style="{ color: tint }"
		aria-hidden="true"
	>
		<path
			fill="currentColor"
			d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019l-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"
		/>
	</svg>
	<svg
		v-else-if="registry === 'pubdev'"
		class="randino-registry-mark"
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
		v-else-if="registry === 'pypi'"
		class="randino-registry-mark"
		viewBox="0 0 24 24"
		:width="size"
		:height="size"
		:style="{ color: tint }"
		aria-hidden="true"
	>
		<path
			fill="currentColor"
			d="M23.922 13.58v3.912L20.55 18.72l-.078.055l.052.037l3.45-1.256l.026-.036v-3.997l-.053-.036l-.025.092zm-.301-7.962l-3.04 1.107v3.912l3.339-1.215V5.509zm.299 7.839V9.544l-3.336 1.215v3.913zm-3.45 1.253V10.8l-3.3 1.2v3.913zm-3.436 5.286v-3.912l-3.313 1.206v3.912zm.136-3.939v3.868l3.314-1.206V14.85zm2.093 1.882c-.367.134-.663-.074-.663-.463s.296-.814.663-.947c.365-.133.662.075.662.464s-.297.814-.662.946m-6.038-8.624l.365-.132l-3.285-1.197l-3.323 1.21l.102.037l3.184 1.16zm7.282 1.349V6.751L17.17 7.965v3.913zm-3.449 1.254V8.005l-3.302 1.202v3.912zm-3.415-2.672l-3.336 1.215v3.913l3.336-1.215zm-6.736 3.919l3.322 1.209v-3.913L6.907 9.252zm3.433-5.292l3.281 1.193V5.198l-3.28-1.193zm10.167-5.158L17.19 3.922v3.913l3.317-1.207zM16.95 3.903L13.724 2.73l-3.269 1.19l3.225 1.174zm-1.585.703l-1.624.592v3.868l3.317-1.207V3.991zm-.391 2.778c-.367.134-.662-.074-.662-.464s.295-.813.662-.946c.366-.133.663.074.663.464s-.297.813-.663.946M10.229 18.41v-3.914l-3.322-1.209V17.2zm3.449-1.228v-3.913l-3.371 1.227v3.913zm.078-.028l3.3-1.2V12.04l-3.3 1.2zm-.078 4.063l-3.371 1.227v-3.912h-.078v3.912l-3.322-1.209v-3.913l-.053-.058l-.025-.06l-3.336-1.21v-3.948l.034.013l3.287 1.196l.015-.078l-3.261-1.187l3.26-1.187v-.109L3.876 9.62l-.307-.112l3.26-1.188v.877l.079-.055V6.769l3.257 1.185l.058-.061L7.084 6.75l-.102-.037l3.24-1.179v-.083L6.854 6.677v.018l-.025.018v1.523L3.44 9.47v.02l-.025.017v4.007l-3.39 1.233v.019L0 14.784v3.995l.025.037l3.4 1.237l.008-.006l.007.01l3.4 1.238l.008-.006l.006.01l3.4 1.237l.014-.009l.012.01l3.45-1.256l.026-.037zM3.493 9.563l3.257 1.185l-3.257 1.187V9.562zM3.4 19.96L.078 18.752v-3.913l2.361.86l.96.349zm.015-3.99l-3.08-1.12l-.182-.066l3.262-1.187zm3.399 5.231l-3.321-1.209V16.08l3.321 1.209zM23.791 5.434l-3.21-1.17v2.338zm-3.404-2.791l-3.24-1.18l-3.27 1.19l3.247 1.182z"
		/>
	</svg>
</template>
