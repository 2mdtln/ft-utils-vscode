import * as path from 'node:path';
import * as vscode from 'vscode';
import { CREATED_LINE_INDEX, getHeaderWidthForLanguage, HEADER_LINE_COUNT } from './headerConstants';
import { isBorderLine, parseDelimitersFromLine } from './commentDelimiters';
import { buildHeaderText } from './headerFormat';
import type { ExistingHeader, HeaderSettings } from './types';
import { formatTimestamp } from './time';

const SHEBANG_PATTERN = /^#!/;

export function detectHeader(document: vscode.TextDocument): ExistingHeader | undefined {
	const startLine = getHeaderStartLine(document);
	if (document.lineCount < startLine + HEADER_LINE_COUNT) {
		return undefined;
	}

	const firstLineText = document.lineAt(startLine).text;
	const delimiters = parseDelimitersFromLine(firstLineText);
	if (!delimiters || !isBorderLine(firstLineText, delimiters)) {
		return undefined;
	}

	const lastLine = document.lineAt(startLine + HEADER_LINE_COUNT - 1);
	if (!isBorderLine(lastLine.text, delimiters)) {
		return undefined;
	}

	const range = new vscode.Range(
		new vscode.Position(startLine, 0),
		lastLine.range.end,
	);

	let createdAt: string | undefined;
	let createdBy: string | undefined;
	const createdLine = document.lineAt(startLine + CREATED_LINE_INDEX).text;
	const match = createdLine.match(/Created:\s+(\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2})\s+by\s+(\S+)/);
	if (match) {
		createdAt = match[1];
		createdBy = match[2];
	}

	return { startLine, range, createdAt, createdBy, delimiters };
}

export function createHeaderEdit(document: vscode.TextDocument, settings: HeaderSettings): vscode.TextEdit | undefined {
	const detection = detectHeader(document);
	if (!detection) {
		return undefined;
	}

	const now = formatTimestamp(new Date());
	const createdAt = detection.createdAt ?? now;
	const createdBy = detection.createdBy ?? settings.login;
	const fileName = path.basename(document.fileName);
	const eol = document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
	const needsSeparatorLine = hasTextDirectlyBelowHeader(document, detection.startLine);
	const replacementRange = needsSeparatorLine
		? new vscode.Range(
			new vscode.Position(detection.startLine, 0),
			new vscode.Position(detection.startLine + HEADER_LINE_COUNT, 0),
		)
		: detection.range;
	const separator = needsSeparatorLine ? eol.repeat(2) : '';
	const headerWidth = getHeaderWidthForLanguage(document.languageId);
	const headerText = buildHeaderText(fileName, settings, createdAt, now, detection.delimiters, createdBy, headerWidth) + separator;
	return new vscode.TextEdit(replacementRange, headerText);
}

export function getHeaderStartLine(document: vscode.TextDocument): number {
	if (document.languageId.toLowerCase() !== 'python' || document.lineCount === 0) {
		return 0;
	}
	return SHEBANG_PATTERN.test(document.lineAt(0).text) ? 1 : 0;
}

function hasTextDirectlyBelowHeader(document: vscode.TextDocument, startLine: number): boolean {
	const lineBelowHeader = startLine + HEADER_LINE_COUNT;
	if (document.lineCount <= lineBelowHeader) {
		return false;
	}
	return document.lineAt(lineBelowHeader).text.trim().length > 0;
}
