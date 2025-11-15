import * as vscode from 'vscode';

const STATUS_MESSAGE_TIMEOUT_MS = 1500;

export class StatusNotifier implements vscode.Disposable {
	private hideDisposable?: vscode.Disposable;

	show(message: string) {
		this.hideDisposable?.dispose();
		this.hideDisposable = vscode.window.setStatusBarMessage(`$(megaphone) ${message}`, STATUS_MESSAGE_TIMEOUT_MS);
	}

	dispose() {
		this.hideDisposable?.dispose();
	}
}
