import * as vscode from 'vscode';
import { DEFAULT_HEADER_WIDTH } from './headerConstants';
import { sanitizeWidth } from './headerFormat';
import type { HeaderSettings } from './types';

export function readSettings(): HeaderSettings {
	const configuration = vscode.workspace.getConfiguration('42-header');
	return {
		username: configuration.get<string>('username', '').trim(),
		email: configuration.get<string>('email', '').trim(),
		headerWidth: sanitizeWidth(configuration.get<number>('headerWidth', DEFAULT_HEADER_WIDTH)),
	};
}

export async function promptForSettings() {
	const openSettings = 'Open Settings';
	const choice = await vscode.window.showErrorMessage(
		'Set both "42 Header > Username" and "42 Header > Email" in Settings.',
		openSettings,
	);

	if (choice === openSettings) {
		void vscode.commands.executeCommand('workbench.action.openSettings', '@ext:42-header');
	}
}
