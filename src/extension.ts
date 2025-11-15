import * as path from 'node:path';
import * as vscode from 'vscode';
import { AutoInsertController } from './autoInsertController';
import { buildHeaderText } from './headerFormat';
import { detectHeader, createHeaderEdit } from './headerDetection';
import { getDelimitersForDocument } from './commentDelimiters';
import { promptForSettings, readSettings } from './settings';
import { formatTimestamp } from './time';
import type { HeaderSettings } from './types';
import { StatusNotifier } from './statusNotifier';

export function activate(context: vscode.ExtensionContext) {
	const notifier = new StatusNotifier();
	const autoInsertController = new AutoInsertController(context, notifier);

	const insertCommand = vscode.commands.registerCommand('42-header.insertHeader', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('Open a file before inserting a 42 header.');
			return;
		}

		const settings = readSettings();
		if (!settings.username || !settings.email) {
			await promptForSettings();
			return;
		}

		const result = await applyHeader(editor, settings);
		notifier.show(result === 'updated' ? '42 header refreshed' : '42 header inserted');
	});

	const saveSubscription = vscode.workspace.onWillSaveTextDocument(event => {
		const settings = readSettings();
		if (!settings.username || !settings.email) {
			return;
		}

		event.waitUntil((async () => {
			const edit = createHeaderEdit(event.document, settings);
			if (!edit) {
				return;
			}
			return [edit];
		})());
	});

	const toggleAutoInsert = vscode.commands.registerCommand('42-header.toggleAutoInsert', () => autoInsertController.toggle());

	const fileCreateSubscription = vscode.workspace.onDidCreateFiles(async event => {
		const settings = readSettings();
		if (!settings.username || !settings.email) {
			return;
		}
		await autoInsertController.handleFileCreation(event.files, settings);
	});

	context.subscriptions.push(
		insertCommand,
		saveSubscription,
		toggleAutoInsert,
		fileCreateSubscription,
		autoInsertController,
		notifier,
	);
}

export function deactivate() {}

type HeaderApplyResult = 'inserted' | 'updated';

async function applyHeader(editor: vscode.TextEditor, settings: HeaderSettings): Promise<HeaderApplyResult> {
	const document = editor.document;
	const fileName = path.basename(document.fileName);
	const detection = detectHeader(document);
	const delimiters = detection?.delimiters ?? getDelimitersForDocument(document);
	const result: HeaderApplyResult = detection ? 'updated' : 'inserted';

	const now = formatTimestamp(new Date());
	const createdAt = detection?.createdAt ?? now;
	const headerText = buildHeaderText(fileName, settings, createdAt, now, delimiters);

	await editor.edit(editBuilder => {
		if (detection) {
			editBuilder.replace(detection.range, headerText);
		} else {
			const hasContent = document.getText().length > 0;
			const trailing = hasContent ? '\n\n' : '\n';
			editBuilder.insert(new vscode.Position(0, 0), headerText + trailing);
		}
	});

	return result;
}
