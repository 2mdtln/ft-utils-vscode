import type * as vscode from 'vscode';

export type CommentDelimiters = Readonly<{
	start: string;
	end: string;
}>;

export type HeaderSettings = {
	username: string;
	email: string;
	headerWidth: number;
};

export type ExistingHeader = {
	range: vscode.Range;
	createdAt?: string;
	delimiters: CommentDelimiters;
};
