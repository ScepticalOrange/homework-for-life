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
			.setName("Folder")
			.setDesc("Where the monthly files are stored.")
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
			.setName("Filename pattern")
			.setDesc("Tokens: YYYY = year, MM = month, Q = quarter. Default: YYYY-MM.")
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
			.setName("Position of new entries")
			.setDesc("Whether new days are added at the top or bottom of the file.")
			.addDropdown((dd) =>
				dd
					.addOption("top", "Top")
					.addOption("bottom", "Bottom")
					.setValue(this.plugin.settings.append_position)
					.onChange(async (v) => {
						this.plugin.settings.append_position = v as AppendPosition;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Format for new files")
			.setDesc("Table or headings + bullets. Existing files keep their format.")
			.addDropdown((dd) =>
				dd
					.addOption("table", "Table")
					.addOption("headings", "Headings + bullets")
					.setValue(this.plugin.settings.output_format)
					.onChange(async (v) => {
						this.plugin.settings.output_format = v as FormatType;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Multiple moments in table")
			.setDesc("How multiple moments of one day are shown in a table cell. Only applies to the table format.")
			.addDropdown((dd) =>
				dd
					.addOption("br", "<br> only")
					.addOption("br_bullets", "<br> with • bullet")
					.setValue(this.plugin.settings.multi_moment_style)
					.onChange(async (v) => {
						this.plugin.settings.multi_moment_style = v as MultiMomentStyle;
						await this.plugin.saveSettings();
					})
			);
	}
}
