import { HfLSettings, Language } from "./types";

const en = {
	settingLanguage: "Language",
	settingLanguageDesc: "Language of the plugin UI and of the table header in new files. Auto follows Obsidian's language (German → Deutsch, everything else → English).",
	languageAuto: "Auto",
	settingFolder: "Folder",
	settingFolderDesc: "Where the monthly files are stored.",
	settingPattern: "Filename pattern",
	settingPatternDesc: "Tokens: YYYY = year, MM = month, Q = quarter. Default: YYYY-MM.",
	settingPosition: "Position of new entries",
	settingPositionDesc: "Whether new days are added at the top or bottom of the file.",
	positionTop: "Top",
	positionBottom: "Bottom",
	settingFormat: "Format for new files",
	settingFormatDesc: "Table or headings + bullets. Existing files keep their format.",
	formatTable: "Table",
	formatHeadings: "Headings + bullets",
	settingMulti: "Multiple moments in table",
	settingMultiDesc: "How multiple moments of one day are shown in a table cell. Only applies to the table format.",
	multiBr: "<br> only",
	multiBrBullets: "<br> with • bullet",
	modalDate: "Date",
	modalPrompt: "What happened today?",
	modalPlaceholder: "One moment per line…",
	modalHint: "One line = one moment. Cmd/Ctrl+Enter to save.",
	modalCancel: "Cancel",
	modalSave: "Save",
	noticeDateMissing: "Date missing",
	noticeNoMoments: "Enter at least one moment",
	noticeSaveFailed: "Save failed",
	moments: (n: number) => (n === 1 ? "1 moment" : `${n} moments`),
	noticeNewFile: (m: string) => `new file + ${m}`,
	noticeAppended: (m: string, date: string) => `${m} added to ${date}`,
	noticeInserted: (m: string, date: string) => `${m} saved for ${date}`,
	errorNoMoments: "No moments to save",
	errorInvalidDate: (date: string) => `Invalid date: ${date}`,
	errorNotAFile: (path: string) => `Path ${path} is not a file`,
	tableHeader: "| Date | Moment |",
};

type Strings = typeof en;

const de: Strings = {
	settingLanguage: "Sprache",
	settingLanguageDesc: "Sprache der Plugin-Oberfläche und der Tabellenüberschrift in neuen Dateien. Automatisch folgt der Sprache von Obsidian (Deutsch → Deutsch, alles andere → English).",
	languageAuto: "Automatisch",
	settingFolder: "Ordner",
	settingFolderDesc: "Wo die Monatsdateien gespeichert werden.",
	settingPattern: "Dateinamen-Muster",
	settingPatternDesc: "Tokens: YYYY = Jahr, MM = Monat, Q = Quartal. Default: YYYY-MM.",
	settingPosition: "Position neuer Einträge",
	settingPositionDesc: "Neue Tage oben oder unten in der Datei.",
	positionTop: "Oben",
	positionBottom: "Unten",
	settingFormat: "Format für neue Dateien",
	settingFormatDesc: "Tabelle oder Headings + Bullets. Bestehende Dateien behalten ihr Format.",
	formatTable: "Tabelle",
	formatHeadings: "Headings + Bullets",
	settingMulti: "Multi-Moment in Tabelle",
	settingMultiDesc: "Wie mehrere Momente eines Tages in einer Tabellen-Zelle dargestellt werden. Nur beim Tabellen-Format relevant.",
	multiBr: "<br> nur",
	multiBrBullets: "<br> mit • Bullet",
	modalDate: "Datum",
	modalPrompt: "Was war heute?",
	modalPlaceholder: "Ein Moment pro Zeile…",
	modalHint: "Eine Zeile = ein Moment. Cmd/Ctrl+Enter zum Speichern.",
	modalCancel: "Abbrechen",
	modalSave: "Speichern",
	noticeDateMissing: "Datum fehlt",
	noticeNoMoments: "Mindestens einen Moment eingeben",
	noticeSaveFailed: "Speichern fehlgeschlagen",
	moments: (n: number) => (n === 1 ? "1 Moment" : `${n} Momente`),
	noticeNewFile: (m: string) => `neue Datei + ${m}`,
	noticeAppended: (m: string, date: string) => `${m} an ${date} ergänzt`,
	noticeInserted: (m: string, date: string) => `${m} für ${date} eingetragen`,
	errorNoMoments: "Keine Momente zum Speichern",
	errorInvalidDate: (date: string) => `Ungültiges Datum: ${date}`,
	errorNotAFile: (path: string) => `Pfad ${path} ist keine Datei`,
	tableHeader: "| Datum | Erlebnis |",
};

// Obsidian stores its UI language in localStorage ("de", "es", …); unset means English.
function obsidianLanguage(): string {
	try {
		return window.localStorage.getItem("language") ?? "en";
	} catch {
		return "en";
	}
}

export function resolveLanguage(setting: Language): "en" | "de" {
	if (setting !== "auto") return setting;
	return obsidianLanguage().toLowerCase().startsWith("de") ? "de" : "en";
}

export function t(settings: HfLSettings): Strings {
	return resolveLanguage(settings.language) === "de" ? de : en;
}
