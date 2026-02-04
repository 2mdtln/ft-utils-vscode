import {
	BY_SUFFIX,
	COLUMN_SUFFIX,
	CREATED_SUFFIX,
	DEFAULT_HEADER_WIDTH,
	FILE_SUFFIX,
	MIN_INNER_WIDTH,
	SPACER_SUFFIX,
	TITLE_SUFFIX,
	UPDATED_SUFFIX,
} from './headerConstants';
import type { CommentDelimiters, HeaderSettings } from './types';

export function buildHeaderText(
	fileName: string,
	settings: HeaderSettings,
	createdAt: string,
	updatedAt: string,
	delimiters: CommentDelimiters,
	createdByUsername = settings.username,
): string {
	return buildHeaderLines(fileName, settings, createdAt, updatedAt, delimiters, createdByUsername).join('\n');
}

export function buildHeaderLines(
	fileName: string,
	settings: HeaderSettings,
	createdAt: string,
	updatedAt: string,
	delimiters: CommentDelimiters,
	createdByUsername = settings.username,
): string[] {
	const innerWidth = computeInnerWidth(DEFAULT_HEADER_WIDTH, delimiters);
	const identity = `${settings.username} <${settings.email}>`;

	return [
		formatBorder(innerWidth, delimiters),
		formatEmpty(innerWidth, delimiters),
		formatRightAligned(TITLE_SUFFIX, innerWidth, delimiters),
		formatLine(`  ${fileName}`, FILE_SUFFIX, innerWidth, delimiters),
		formatRightAligned(COLUMN_SUFFIX, innerWidth, delimiters),
		formatLine(`  By: ${identity}`, BY_SUFFIX, innerWidth, delimiters),
		formatRightAligned(SPACER_SUFFIX, innerWidth, delimiters),
		formatLine(`  Created: ${createdAt} by ${createdByUsername}`, CREATED_SUFFIX, innerWidth, delimiters),
		formatLine(`  Updated: ${updatedAt} by ${settings.username}`, UPDATED_SUFFIX, innerWidth, delimiters),
		formatEmpty(innerWidth, delimiters),
		formatBorder(innerWidth, delimiters),
	];
}

export function computeInnerWidth(totalWidth: number, delimiters: CommentDelimiters): number {
	const available = totalWidth - delimiters.start.length - delimiters.end.length;
	return Math.max(MIN_INNER_WIDTH, available);
}

function formatLine(left: string, right: string, innerWidth: number, delimiters: CommentDelimiters): string {
	const sanitizedRight = right.slice(0, Math.max(0, innerWidth - 1));
	const maxLeft = Math.max(0, innerWidth - sanitizedRight.length);
	const sanitizedLeft = truncate(left, maxLeft);
	const padding = Math.max(0, innerWidth - sanitizedLeft.length - sanitizedRight.length);
	return `${delimiters.start}${sanitizedLeft}${' '.repeat(padding)}${sanitizedRight}${delimiters.end}`;
}

function formatRightAligned(text: string, innerWidth: number, delimiters: CommentDelimiters): string {
	return formatLine('', text, innerWidth, delimiters);
}

function formatBorder(innerWidth: number, delimiters: CommentDelimiters): string {
	return `${delimiters.start}${'*'.repeat(innerWidth)}${delimiters.end}`;
}

function formatEmpty(innerWidth: number, delimiters: CommentDelimiters): string {
	return `${delimiters.start}${' '.repeat(innerWidth)}${delimiters.end}`;
}

function truncate(value: string, maxLength: number): string {
	if (value.length <= maxLength) {
		return value;
	}
	return value.slice(0, Math.max(0, maxLength));
}
