import { FormatHandler } from "./handler";
import { FormatType, HfLSettings } from "../types";
import { wikilinkDate } from "../utils/date";
import { splitFrontmatter } from "../utils/markdown";
import { t } from "../i18n";

// Also matches the German header used by 0.1.0 so existing files are still detected.
const TABLE_HEADER = /^\| *(Date|Datum) *\| *(Moment|Erlebnis) *\|/m;
const TABLE_SEP = /^\|[\s\-:|]+\|/;

export class TableFormatHandler implements FormatHandler {
	type: FormatType = "table";

	constructor(private settings: HfLSettings) {}

	detect(content: string): boolean {
		const body = splitFrontmatter(content).body.slice(0, 2000);
		return TABLE_HEADER.test(body);
	}

	readDay(content: string, date: string): string[] | null {
		const dateLink = wikilinkDate(date);
		const lines = splitFrontmatter(content).body.split("\n");
		const row = lines.find((l) => l.startsWith("|") && l.includes(dateLink));
		if (!row) return null;
		const parts = row.split("|");
		if (parts.length < 4) return [];
		const cell = parts[2].trim();
		if (!cell) return [];
		const sep = this.momentSeparator();
		return cell
			.split(sep)
			.map((s) => s.replace(/^•\s*/, "").trim())
			.filter((s) => s.length > 0);
	}

	appendToDay(content: string, date: string, moments: string[]): string {
		const dateLink = wikilinkDate(date);
		const sep = this.momentSeparator();
		const newCellPart = moments.join(sep);

		const { fm, body } = splitFrontmatter(content);
		const lines = body.split("\n");
		const idx = lines.findIndex((l) => l.startsWith("|") && l.includes(dateLink));
		if (idx === -1) return content;

		const parts = lines[idx].split("|");
		if (parts.length < 4) return content;
		const oldText = parts[2].trim();
		parts[2] = oldText ? ` ${oldText}${sep}${newCellPart} ` : ` ${newCellPart} `;
		lines[idx] = parts.join("|");
		return fm + lines.join("\n");
	}

	insertNewDay(content: string, date: string, moments: string[]): string {
		const dateLink = wikilinkDate(date);
		const cellText = moments.join(this.momentSeparator());
		const newRow = `| ${dateLink} | ${cellText} |`;

		const { fm, body } = splitFrontmatter(content);
		const lines = body.split("\n");
		const sepIdx = lines.findIndex((l) => TABLE_SEP.test(l));

		if (sepIdx === -1) {
			const h1Idx = lines.findIndex((l) => /^#\s/.test(l));
			const insertAt = h1Idx === -1 ? 0 : h1Idx + 1;
			const skeleton = ["", this.header(), this.headerSeparator(), newRow];
			lines.splice(insertAt, 0, ...skeleton);
			return fm + lines.join("\n");
		}

		if (this.settings.append_position === "bottom") {
			let lastDataRow = sepIdx;
			for (let i = sepIdx + 1; i < lines.length; i++) {
				if (lines[i].startsWith("|")) lastDataRow = i;
				else if (lines[i].trim() === "") break;
			}
			lines.splice(lastDataRow + 1, 0, newRow);
		} else {
			lines.splice(sepIdx + 1, 0, newRow);
		}
		return fm + lines.join("\n");
	}

	initialContent(filename: string, date: string, moments: string[]): string {
		const dateLink = wikilinkDate(date);
		const cellText = moments.join(this.momentSeparator());
		return [
			`# Homework for Life – ${filename}`,
			"",
			this.header(),
			this.headerSeparator(),
			`| ${dateLink} | ${cellText} |`,
			"",
		].join("\n");
	}

	private header(): string {
		return t(this.settings).tableHeader;
	}

	private headerSeparator(): string {
		return this.header().replace(/[^|]/g, "-");
	}

	private momentSeparator(): string {
		return this.settings.multi_moment_style === "br_bullets" ? "<br>• " : "<br>";
	}
}
