/**
 * Fails on a module that does something a bundler has to keep when it is
 * imported.
 *
 * `package.json` declares `sideEffects: false`, which is what lets a bundler drop
 * the modules a caller never reaches. A bundler, or a configuration of one, that
 * does not read the field has to decide from the code instead, and it keeps every
 * module whose top level might do something: a call it cannot prove pure, a
 * spread, a property read. One such statement keeps the whole module, so one
 * dataset written the ordinary way puts every pool in the library into a bundle
 * that imports `randSuffix` — over 500 KB gzipped, where it needs under 1 KB.
 *
 * So everything a module evaluates on import has to be something a bundler can
 * drop unread:
 *
 * - a literal, a name, a function, or an array or object built of those;
 * - a call or a `new` marked `/*#__PURE__*\/`, whose arguments are the same;
 * - a property of `Math` or `Number`.
 *
 * A dataset built by many calls is wrapped whole in one marked arrow function,
 * called on the spot — `/*#__PURE__*\/ ((): T => ({ … }))()` — so the calls and
 * spreads inside it are a function body, which nothing evaluates on import.
 *
 * The rule is stricter than any one bundler: esbuild keeps a spread and an
 * arithmetic operator, terser keeps an unmarked `new Map()`, and Rollup keeps
 * neither. A module that passes it is one all of them can drop.
 *
 * The test suite runs it over `lib`, which says where to fix a module. `npm run
 * build` runs it over `dist` after `terser`, which says the marks survived the
 * minifier — they do only because `terser.config.json` sets
 * `preserve_annotations`.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const PURE_MARK = /\/\*\s*[#@]__PURE__\s*\*\//;

// Built-ins whose properties a bundler knows are plain values.
const BUILT_INS = new Set(['Math', 'Number']);

const LITERALS = new Set([
	ts.SyntaxKind.StringLiteral,
	ts.SyntaxKind.NumericLiteral,
	ts.SyntaxKind.BigIntLiteral,
	ts.SyntaxKind.NoSubstitutionTemplateLiteral,
	ts.SyntaxKind.TrueKeyword,
	ts.SyntaxKind.FalseKeyword,
	ts.SyntaxKind.NullKeyword
]);

/** The expression under any type assertion or parentheses around it. */
function bare(node) {
	while (
		ts.isParenthesizedExpression(node) ||
		ts.isAsExpression(node) ||
		ts.isSatisfiesExpression(node) ||
		ts.isNonNullExpression(node) ||
		ts.isTypeAssertionExpression(node)
	) {
		node = node.expression;
	}

	return node;
}

/**
 * Whether an expression is a literal. A negative number is one, and so are `!0`
 * and `!1`, which is how terser writes `true` and `false`.
 */
function literal(node) {
	node = bare(node);

	if (
		ts.isPrefixUnaryExpression(node) &&
		(node.operator === ts.SyntaxKind.MinusToken || node.operator === ts.SyntaxKind.ExclamationToken)
	) {
		node = bare(node.operand);
	}

	return LITERALS.has(node.kind);
}

/**
 * Every place in one module that does something on import, as `{ line, what }`.
 * `fileName` only decides whether the text is read as TypeScript.
 */
export function sideEffectsIn(fileName, text) {
	const source = ts.createSourceFile(
		fileName,
		text,
		ts.ScriptTarget.Latest,
		true,
		fileName.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS
	);
	const found = [];

	const report = (node, what) => {
		const { line } = source.getLineAndCharacterOfPosition(node.getStart(source));

		found.push({ line: line + 1, what });
	};

	// The mark is in the trivia in front of the call. `getLeadingCommentRanges`
	// would miss it there: a comment on the same line as the `=` before it counts
	// as that token's trailing comment.
	const marked = (node) => PURE_MARK.test(text.slice(node.pos, node.getStart(source)));

	const visit = (node) => {
		node = bare(node);

		if (
			literal(node) ||
			ts.isRegularExpressionLiteral(node) ||
			ts.isIdentifier(node) ||
			ts.isArrowFunction(node) ||
			ts.isFunctionExpression(node)
		) {
			return;
		}

		if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
			if (!marked(node)) {
				report(node, 'a call without /*#__PURE__*/');
			}

			// The mark makes the call droppable and leaves its arguments to be evaluated.
			for (const argument of node.arguments ?? []) {
				if (ts.isSpreadElement(argument)) {
					report(argument, 'a spread');
				} else {
					visit(argument);
				}
			}

			return;
		}

		if (ts.isArrayLiteralExpression(node)) {
			for (const element of node.elements) {
				if (ts.isSpreadElement(element)) {
					report(element, 'a spread');
				} else if (!ts.isOmittedExpression(element)) {
					visit(element);
				}
			}

			return;
		}

		if (ts.isObjectLiteralExpression(node)) {
			for (const property of node.properties) {
				if (ts.isSpreadAssignment(property)) {
					report(property, 'a spread');
					continue;
				}

				if (property.name && ts.isComputedPropertyName(property.name)) {
					if (!literal(property.name.expression)) {
						report(property.name, 'a computed key that is not a literal');
					}
				}

				if (ts.isPropertyAssignment(property)) {
					visit(property.initializer);
				}
			}

			return;
		}

		if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
			const object = bare(node.expression);

			if (!ts.isIdentifier(object) || !BUILT_INS.has(object.text)) {
				report(node, 'a property read');
			}

			return;
		}

		if (ts.isClassExpression(node)) {
			visitClass(node);
			return;
		}

		if (ts.isTypeOfExpression(node) || ts.isVoidExpression(node)) {
			visit(node.expression);
			return;
		}

		// An operator can run code: `+` calls `valueOf` on an object, and a template
		// calls `toString`. esbuild keeps one inside an object or an array even over
		// literals, so `{ bytes: 1000 ** 3 }` keeps its module where `{ bytes: 1e9 }`
		// does not.
		if (
			ts.isBinaryExpression(node) ||
			ts.isPrefixUnaryExpression(node) ||
			ts.isConditionalExpression(node) ||
			ts.isTemplateExpression(node)
		) {
			report(node, 'an operator');
			return;
		}

		report(node, 'an expression that runs on import');
	};

	const visitClass = (node) => {
		for (const clause of node.heritageClauses ?? []) {
			for (const type of clause.types) {
				visit(type.expression);
			}
		}

		for (const member of node.members) {
			if (ts.isClassStaticBlockDeclaration(member)) {
				report(member, 'a static block');
			} else if (
				ts.isPropertyDeclaration(member) &&
				member.initializer &&
				member.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword)
			) {
				visit(member.initializer);
			}
		}
	};

	for (const statement of source.statements) {
		if (
			ts.isFunctionDeclaration(statement) ||
			ts.isInterfaceDeclaration(statement) ||
			ts.isTypeAliasDeclaration(statement) ||
			ts.isExportDeclaration(statement) ||
			ts.isEmptyStatement(statement) ||
			statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DeclareKeyword)
		) {
			continue;
		}

		if (ts.isImportDeclaration(statement)) {
			if (!statement.importClause) {
				report(statement, 'an import for its effects');
			}
		} else if (ts.isVariableStatement(statement)) {
			for (const declaration of statement.declarationList.declarations) {
				if (!ts.isIdentifier(declaration.name)) {
					report(declaration, 'a destructuring, which reads properties');
				}

				if (declaration.initializer) {
					visit(declaration.initializer);
				}
			}
		} else if (ts.isClassDeclaration(statement)) {
			visitClass(statement);
		} else if (ts.isExportAssignment(statement)) {
			visit(statement.expression);
		} else {
			report(statement, 'a statement that runs on import');
		}
	}

	return found;
}

/** Every module under `dir` that does something on import, as `{ file, line, what }`. */
export function sideEffectsUnder(dir) {
	const found = [];

	const walk = (current) => {
		for (const entry of readdirSync(current).sort()) {
			const path = join(current, entry);

			if (statSync(path).isDirectory()) {
				walk(path);
			} else if (/\.(ts|js)$/.test(entry) && !entry.endsWith('.d.ts')) {
				for (const each of sideEffectsIn(path, readFileSync(path, 'utf8'))) {
					found.push({ file: relative(dir, path), ...each });
				}
			}
		}
	};

	walk(dir);

	return found;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const dir = resolve(process.argv[2] ?? 'dist');
	const found = sideEffectsUnder(dir);

	for (const { file, line, what } of found) {
		console.error(`${join(relative(process.cwd(), dir), file)}:${line}: ${what}`);
	}

	if (found.length > 0) {
		console.error(
			`\n${found.length} place(s) run on import. A bundler that does not read \`sideEffects: false\` keeps every module named above; see scripts/check-side-effects.mjs.`
		);
		process.exit(1);
	}

	console.log(`No module under ${relative(process.cwd(), dir) || '.'} does anything on import.`);
}
