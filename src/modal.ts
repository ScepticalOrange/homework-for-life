import { App, Modal, Notice } from "obsidian";
import { WriteService } from "./services/write";
import { formatLocalDate } from "./utils/date";

export class CaptureModal extends Modal {
	private dateInput!: HTMLInputElement;
	private textarea!: HTMLTextAreaElement;
	private submitting = false;

	constructor(app: App, private writeService: WriteService) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.addClass("hfl-modal");
		contentEl.createEl("h2", { text: "Homework for Life" });

		const dateRow = contentEl.createDiv("hfl-row");
		dateRow.createEl("label", { text: "Date", attr: { for: "hfl-date" } });
		this.dateInput = dateRow.createEl("input", {
			type: "date",
			attr: { id: "hfl-date", value: formatLocalDate() },
		});

		const textWrap = contentEl.createDiv();
		textWrap.createEl("label", { text: "What happened today?" });
		this.textarea = textWrap.createEl("textarea", {
			attr: { rows: "6", placeholder: "One moment per line…" },
		});
		this.textarea.addEventListener("keydown", (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
				e.preventDefault();
				this.submit();
			}
		});

		const hint = textWrap.createDiv("hfl-hint");
		hint.setText("One line = one moment. Cmd/Ctrl+Enter to save.");

		const actions = contentEl.createDiv("hfl-actions");
		const cancelBtn = actions.createEl("button", { text: "Cancel" });
		cancelBtn.onclick = () => this.close();

		const submitBtn = actions.createEl("button", {
			text: "Save",
			cls: "mod-cta",
		});
		submitBtn.onclick = () => this.submit();

		setTimeout(() => this.textarea.focus(), 0);
	}

	private async submit() {
		if (this.submitting) return;
		const date = this.dateInput.value;
		const moments = this.textarea.value
			.split("\n")
			.map((l) => l.trim())
			.filter((l) => l.length > 0);

		if (!date) {
			new Notice("HfL: Date missing");
			return;
		}
		if (moments.length === 0) {
			new Notice("HfL: Enter at least one moment");
			return;
		}

		this.submitting = true;
		try {
			const result = await this.writeService.append(date, moments);
			const word = moments.length === 1 ? "moment" : "moments";
			const verb = result.created
				? `new file + ${moments.length} ${word}`
				: result.appendedToExistingDay
				? `${moments.length} ${word} added to ${date}`
				: `${moments.length} ${word} saved for ${date}`;
			new Notice(`HfL: ${verb}`);
			this.close();
		} catch (err) {
			console.error("HfL: write failed", err);
			const msg = err instanceof Error ? err.message : "Save failed";
			new Notice(`HfL: ${msg}`);
		} finally {
			this.submitting = false;
		}
	}

	onClose() {
		this.contentEl.empty();
	}
}
