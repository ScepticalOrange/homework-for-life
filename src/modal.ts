import { App, Modal, Notice } from "obsidian";
import { WriteService } from "./services/write";
import { formatLocalDate } from "./utils/date";
import { t } from "./i18n";
import { HfLSettings } from "./types";

export class CaptureModal extends Modal {
	private dateInput!: HTMLInputElement;
	private textarea!: HTMLTextAreaElement;
	private submitting = false;

	constructor(
		app: App,
		private writeService: WriteService,
		private getSettings: () => HfLSettings
	) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		const s = t(this.getSettings());
		contentEl.addClass("hfl-modal");
		contentEl.createEl("h2", { text: "Homework for Life" });

		const dateRow = contentEl.createDiv("hfl-row");
		dateRow.createEl("label", { text: s.modalDate, attr: { for: "hfl-date" } });
		this.dateInput = dateRow.createEl("input", {
			type: "date",
			attr: { id: "hfl-date", value: formatLocalDate() },
		});

		const textWrap = contentEl.createDiv();
		textWrap.createEl("label", { text: s.modalPrompt });
		this.textarea = textWrap.createEl("textarea", {
			attr: { rows: "6", placeholder: s.modalPlaceholder },
		});
		this.textarea.addEventListener("keydown", (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
				e.preventDefault();
				this.submit();
			}
		});

		const hint = textWrap.createDiv("hfl-hint");
		hint.setText(s.modalHint);

		const actions = contentEl.createDiv("hfl-actions");
		const cancelBtn = actions.createEl("button", { text: s.modalCancel });
		cancelBtn.onclick = () => this.close();

		const submitBtn = actions.createEl("button", {
			text: s.modalSave,
			cls: "mod-cta",
		});
		submitBtn.onclick = () => this.submit();

		setTimeout(() => this.textarea.focus(), 0);
	}

	private async submit() {
		if (this.submitting) return;
		const s = t(this.getSettings());
		const date = this.dateInput.value;
		const moments = this.textarea.value
			.split("\n")
			.map((l) => l.trim())
			.filter((l) => l.length > 0);

		if (!date) {
			new Notice(`HfL: ${s.noticeDateMissing}`);
			return;
		}
		if (moments.length === 0) {
			new Notice(`HfL: ${s.noticeNoMoments}`);
			return;
		}

		this.submitting = true;
		try {
			const result = await this.writeService.append(date, moments);
			const m = s.moments(moments.length);
			const verb = result.created
				? s.noticeNewFile(m)
				: result.appendedToExistingDay
				? s.noticeAppended(m, date)
				: s.noticeInserted(m, date);
			new Notice(`HfL: ${verb}`);
			this.close();
		} catch (err) {
			console.error("HfL: write failed", err);
			const msg = err instanceof Error ? err.message : s.noticeSaveFailed;
			new Notice(`HfL: ${msg}`);
		} finally {
			this.submitting = false;
		}
	}

	onClose() {
		this.contentEl.empty();
	}
}
