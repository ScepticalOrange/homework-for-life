import { Plugin } from "obsidian";
import { WriteService } from "./services/write";
import { CaptureModal } from "./modal";
import { HfLSettingTab } from "./settings";
import { DEFAULT_SETTINGS, HfLSettings } from "./types";

export default class HfLPlugin extends Plugin {
	settings!: HfLSettings;
	private writeService!: WriteService;

	async onload() {
		await this.loadSettings();

		this.writeService = new WriteService(this.app, () => this.settings);

		this.addRibbonIcon("notebook-pen", "Homework for Life", () => {
			this.openCaptureModal();
		});

		this.addCommand({
			id: "open-capture-modal",
			name: "Open capture modal",
			callback: () => this.openCaptureModal(),
		});

		this.registerObsidianProtocolHandler("hfl-capture", () => {
			this.openCaptureModal();
		});

		this.addSettingTab(new HfLSettingTab(this.app, this));
	}

	onunload() {}

	private openCaptureModal() {
		new CaptureModal(this.app, this.writeService, () => this.settings).open();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
