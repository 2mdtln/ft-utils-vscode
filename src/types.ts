import type * as vscode from 'vscode';

export type CommentDelimiters = Readonly<{
	start: string;
	end: string;
}>;

export type HeaderSettings = {
	login: string;
	email: string;
};

export type ExistingHeader = {
	range: vscode.Range;
	createdAt?: string;
	createdBy?: string;
	delimiters: CommentDelimiters;
};
