import * as path from 'node:path';
import * as vscode from 'vscode';
import { CREATED_LINE_INDEX, HEADER_LINE_COUNT } from './headerConstants';
import { isBorderLine, parseDelimitersFromLine } from './commentDelimiters';
import { buildHeaderText } from './headerFormat';
import type { ExistingHeader, HeaderSettings } from './types';
import { formatTimestamp } from './time';

export function detectHeader(document: vscode.TextDocument): ExistingHeader | undefined {
	if (document.lineCount < HEADER_LINE_COUNT) {
		return undefined;
	}

	const firstLineText = document.lineAt(0).text;
	const delimiters = parseDelimitersFromLine(firstLineText);
	if (!delimiters || !isBorderLine(firstLineText, delimiters)) {
		return undefined;
	}

	const lastLine = document.lineAt(HEADER_LINE_COUNT - 1);
	if (!isBorderLine(lastLine.text, delimiters)) {
		return undefined;
	}

	const range = new vscode.Range(
		new vscode.Position(0, 0),
		lastLine.range.end,
	);

	let createdAt: string | undefined;
	const createdLine = document.lineAt(CREATED_LINE_INDEX).text;
	const match = createdLine.match(/Created:\s+(\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2})/);
	if (match) {
		createdAt = match[1];
	}

	return { range, createdAt, delimiters };
}

export function createHeaderEdit(document: vscode.TextDocument, settings: HeaderSettings): vscode.TextEdit | undefined {
	const detection = detectHeader(document);
	if (!detection) {
		return undefined;
	}

	const now = formatTimestamp(new Date());
	const createdAt = detection.createdAt ?? now;
	const fileName = path.basename(document.fileName);
	const headerText = buildHeaderText(fileName, settings, createdAt, now, detection.delimiters);
	return new vscode.TextEdit(detection.range, headerText);
}
