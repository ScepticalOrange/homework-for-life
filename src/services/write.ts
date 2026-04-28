import { App, TFile, normalizePath } from "obsidian";
import { buildFilename, parseLocalDate } from "../utils/date";
import { detectFormat, createHandler } from "../format/factory";
import { HfLSettings } from "../types";

export interface WriteResult {
	created: boolean;
	appendedToExistingDay: boolean;
	path: string;
}

export class WriteService {
	constructor(private app: App, private getSettings: () => HfLSettings) {}

	async append(date: string, moments: string[]): Promise<WriteResult> {
		if (moments.length === 0) {
			throw new Error("Keine Momente zum Speichern");
		}
		if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
			throw new Error(`Ungültiges Datum: ${date}`);
		}

		const settings = this.getSettings();
		const dateObj = parseLocalDate(date);
		const filename = buildFilename(dateObj, settings.filename_pattern);
		const path = normalizePath(`${settings.hfl_folder}/${filename}.md`);

		if (!(await this.app.vault.adapter.exists(settings.hfl_folder))) {
			await this.app.vault.createFolder(settings.hfl_folder);
		}

		const existing = this.app.vault.getAbstractFileByPath(path);

		if (!existing) {
			const handler = createHandler(settings.output_format, settings);
			await this.app.vault.create(path, handler.initialContent(filename, date, moments));
			return { created: true, appendedToExistingDay: false, path };
		}

		if (!(existing instanceof TFile)) {
			throw new Error(`Pfad ${path} ist keine Datei`);
		}

		const content = await this.app.vault.read(existing);
		const format = detectFormat(content, settings);
		const handler = createHandler(format, settings);

		const dayExists = handler.readDay(content, date) !== null;
		const updated = dayExists
			? handler.appendToDay(content, date, moments)
			: handler.insertNewDay(content, date, moments);

		await this.app.vault.modify(existing, updated);
		return { created: false, appendedToExistingDay: dayExists, path };
	}
}
