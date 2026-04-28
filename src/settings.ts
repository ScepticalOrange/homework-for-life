import { App, PluginSettingTab, Setting } from "obsidian";
import type HfLPlugin from "./main";
import { DEFAULT_SETTINGS, AppendPosition, FormatType, MultiMomentStyle } from "./types";

export class HfLSettingTab extends PluginSettingTab {
	plugin: HfLPlugin;

	constructor(app: App, plugin: HfLPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Ordner")
			.setDesc("Wo die Monatsdateien gespeichert werden.")
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_SETTINGS.hfl_folder)
					.setValue(this.plugin.settings.hfl_folder)
					.onChange(async (v) => {
						this.plugin.settings.hfl_folder = v.trim() || DEFAULT_SETTINGS.hfl_folder;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Dateinamen-Muster")
			.setDesc("Tokens: YYYY = Jahr, MM = Monat, Q = Quartal. Default: YYYY-MM.")
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_SETTINGS.filename_pattern)
					.setValue(this.plugin.settings.filename_pattern)
					.onChange(async (v) => {
						this.plugin.settings.filename_pattern = v.trim() || DEFAULT_SETTINGS.filename_pattern;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Position neuer Einträge")
			.setDesc("Neue Tage oben oder unten in der Datei.")
			.addDropdown((dd) =>
				dd
					.addOption("top", "Oben")
					.addOption("bottom", "Unten")
					.setValue(this.plugin.settings.append_position)
					.onChange(async (v) => {
						this.plugin.settings.append_position = v as AppendPosition;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Format für neue Dateien")
			.setDesc("Tabelle oder Headings + Bullets. Bestehende Dateien behalten ihr Format.")
			.addDropdown((dd) =>
				dd
					.addOption("table", "Tabelle")
					.addOption("headings", "Headings + Bullets")
					.setValue(this.plugin.settings.output_format)
					.onChange(async (v) => {
						this.plugin.settings.output_format = v as FormatType;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Multi-Moment in Tabelle")
			.setDesc("Wie mehrere Momente eines Tages in einer Tabellen-Zelle dargestellt werden. Nur beim Tabellen-Format relevant.")
			.addDropdown((dd) =>
				dd
					.addOption("br", "<br> nur")
					.addOption("br_bullets", "<br> mit • Bullet")
					.setValue(this.plugin.settings.multi_moment_style)
					.onChange(async (v) => {
						this.plugin.settings.multi_moment_style = v as MultiMomentStyle;
						await this.plugin.saveSettings();
					})
			);
	}
}
