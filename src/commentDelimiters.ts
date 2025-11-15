import type * as vscode from 'vscode';
import type { CommentDelimiters } from './types';

const COMMENT_STYLES: Record<string, CommentDelimiters> = {
	hashes: { start: '# ', end: ' #' },
	slashes: { start: '/* ', end: ' */' },
	semicolons: { start: ';; ', end: ' ;;' },
	parens: { start: '(* ', end: ' *)' },
	dashes: { start: '-- ', end: ' --' },
	percents: { start: '%% ', end: ' %%' },
};

export const LANGUAGE_DELIMITERS: Record<string, CommentDelimiters> = {
	c: COMMENT_STYLES.slashes,
	coffeescript: COMMENT_STYLES.hashes,
	cpp: COMMENT_STYLES.slashes,
	css: COMMENT_STYLES.slashes,
	dockerfile: COMMENT_STYLES.hashes,
	fsharp: COMMENT_STYLES.parens,
	go: COMMENT_STYLES.slashes,
	groovy: COMMENT_STYLES.slashes,
	haskell: COMMENT_STYLES.dashes,
	ini: COMMENT_STYLES.semicolons,
	jade: COMMENT_STYLES.slashes,
	java: COMMENT_STYLES.slashes,
	javascript: COMMENT_STYLES.slashes,
	javascriptreact: COMMENT_STYLES.slashes,
	latex: COMMENT_STYLES.percents,
	less: COMMENT_STYLES.slashes,
	lua: COMMENT_STYLES.dashes,
	makefile: COMMENT_STYLES.hashes,
	'objective-c': COMMENT_STYLES.slashes,
	ocaml: COMMENT_STYLES.parens,
	perl: COMMENT_STYLES.hashes,
	perl6: COMMENT_STYLES.hashes,
	php: COMMENT_STYLES.slashes,
	plaintext: COMMENT_STYLES.hashes,
	powershell: COMMENT_STYLES.hashes,
	python: COMMENT_STYLES.hashes,
	r: COMMENT_STYLES.hashes,
	ruby: COMMENT_STYLES.hashes,
	rust: COMMENT_STYLES.slashes,
	scss: COMMENT_STYLES.slashes,
	shellscript: COMMENT_STYLES.hashes,
	sql: COMMENT_STYLES.hashes,
	swift: COMMENT_STYLES.slashes,
	typescript: COMMENT_STYLES.slashes,
	typescriptreact: COMMENT_STYLES.slashes,
	xsl: COMMENT_STYLES.slashes,
	yaml: COMMENT_STYLES.hashes,
};

export const DEFAULT_DELIMITERS = COMMENT_STYLES.slashes;
const KNOWN_DELIMITERS = Object.values(COMMENT_STYLES);

export function getDelimitersForDocument(document: vscode.TextDocument): CommentDelimiters {
	const languageKey = document.languageId.toLowerCase();
	return LANGUAGE_DELIMITERS[languageKey] ?? DEFAULT_DELIMITERS;
}

export function parseDelimitersFromLine(line: string): CommentDelimiters | undefined {
	for (const delimiters of KNOWN_DELIMITERS) {
		if (line.startsWith(delimiters.start) && line.endsWith(delimiters.end)) {
			return delimiters;
		}
	}
	return undefined;
}

export function isBorderLine(line: string, delimiters: CommentDelimiters): boolean {
	if (!line.startsWith(delimiters.start) || !line.endsWith(delimiters.end)) {
		return false;
	}
	const inner = line.slice(delimiters.start.length, line.length - delimiters.end.length);
	return inner.length > 0 && /^[*]+$/.test(inner);
}
