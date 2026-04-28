import { FormatHandler } from "./handler";
import { FormatType, HfLSettings } from "../types";
import { wikilinkDate } from "../utils/date";
import { splitFrontmatter } from "../utils/markdown";

const DAY_HEADING = /^## *\[\[\d{4}-\d{2}-\d{2}\]\]/m;

export class HeadingsFormatHandler implements FormatHandler {
	type: FormatType = "headings";

	constructor(private settings: HfLSettings) {}

	detect(content: string): boolean {
		const body = splitFrontmatter(content).body.slice(0, 2000);
		return DAY_HEADING.test(body);
	}

	readDay(content: string, date: string): string[] | null {
		const dateLink = wikilinkDate(date);
		const lines = splitFrontmatter(content).body.split("\n");
		const startIdx = lines.findIndex((l) => l.trim() === `## ${dateLink}`);
		if (startIdx === -1) return null;
		const moments: string[] = [];
		for (let i = startIdx + 1; i < lines.length; i++) {
			if (/^##\s/.test(lines[i])) break;
			const m = lines[i].match(/^-\s+(.*)$/);
			if (m) moments.push(m[1]);
		}
		return moments;
	}

	appendToDay(content: string, date: string, moments: string[]): string {
		const dateLink = wikilinkDate(date);
		const { fm, body } = splitFrontmatter(content);
		const lines = body.split("\n");
		const startIdx = lines.findIndex((l) => l.trim() === `## ${dateLink}`);
		if (startIdx === -1) return content;

		let endIdx = lines.length;
		for (let i = startIdx + 1; i < lines.length; i++) {
			if (/^##\s/.test(lines[i])) {
				endIdx = i;
				break;
			}
		}

		let insertAt = endIdx;
		while (insertAt > startIdx + 1 && lines[insertAt - 1].trim() === "") {
			insertAt--;
		}

		const newBullets = moments.map((m) => `- ${m}`);
		lines.splice(insertAt, 0, ...newBullets);
		return fm + lines.join("\n");
	}

	insertNewDay(content: string, date: string, moments: string[]): string {
		const dateLink = wikilinkDate(date);
		const block = [`## ${dateLink}`, ...moments.map((m) => `- ${m}`)].join("\n");

		const { fm, body } = splitFrontmatter(content);

		if (this.settings.append_position === "bottom") {
			const trimmed = body.trimEnd();
			return fm + (trimmed ? trimmed + "\n\n" : "") + block + "\n";
		}

		const lines = body.split("\n");
		const h1Idx = lines.findIndex((l) => /^#\s/.test(l));
		if (h1Idx === -1) {
			return fm + block + "\n\n" + body.trimStart();
		}

		let insertAt = h1Idx + 1;
		while (insertAt < lines.length && lines[insertAt].trim() === "") insertAt++;

		const before = lines.slice(0, insertAt).join("\n").trimEnd();
		const after = lines.slice(insertAt).join("\n").trimStart();
		const result = before + "\n\n" + block + (after ? "\n\n" + after + "\n" : "\n");
		return fm + result;
	}

	initialContent(filename: string, date: string, moments: string[]): string {
		const dateLink = wikilinkDate(date);
		return [
			`# Homework for Life – ${filename}`,
			"",
			`## ${dateLink}`,
			...moments.map((m) => `- ${m}`),
			"",
		].join("\n");
	}
}
