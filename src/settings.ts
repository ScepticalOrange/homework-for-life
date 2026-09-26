import { App, PluginSettingTab, Setting } from "obsidian";
import type HfLPlugin from "./main";
import { DEFAULT_SETTINGS, AppendPosition, FormatType, Language, MultiMomentStyle } from "./types";
import { t } from "./i18n";

export class HfLSettingTab extends PluginSettingTab {
	plugin: HfLPlugin;

	constructor(app: App, plugin: HfLPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		const s = t(this.plugin.settings);

		new Setting(containerEl)
			.setName(s.settingLanguage)
			.setDesc(s.settingLanguageDesc)
			.addDropdown((dd) =>
				dd
					.addOption("auto", s.languageAuto)
					.addOption("en", "English")
					.addOption("de", "Deutsch")
					.setValue(this.plugin.settings.language)
					.onChange(async (v) => {
						this.plugin.settings.language = v as Language;
						await this.plugin.saveSettings();
						this.display();
					})
			);

		new Setting(containerEl)
			.setName(s.settingFolder)
			.setDesc(s.settingFolderDesc)
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
			.setName(s.settingPattern)
			.setDesc(s.settingPatternDesc)
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
			.setName(s.settingPosition)
			.setDesc(s.settingPositionDesc)
			.addDropdown((dd) =>
				dd
					.addOption("top", s.positionTop)
					.addOption("bottom", s.positionBottom)
					.setValue(this.plugin.settings.append_position)
					.onChange(async (v) => {
						this.plugin.settings.append_position = v as AppendPosition;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(s.settingFormat)
			.setDesc(s.settingFormatDesc)
			.addDropdown((dd) =>
				dd
					.addOption("table", s.formatTable)
					.addOption("headings", s.formatHeadings)
					.setValue(this.plugin.settings.output_format)
					.onChange(async (v) => {
						this.plugin.settings.output_format = v as FormatType;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(s.settingMulti)
			.setDesc(s.settingMultiDesc)
			.addDropdown((dd) =>
				dd
					.addOption("br", s.multiBr)
					.addOption("br_bullets", s.multiBrBullets)
					.setValue(this.plugin.settings.multi_moment_style)
					.onChange(async (v) => {
						this.plugin.settings.multi_moment_style = v as MultiMomentStyle;
						await this.plugin.saveSettings();
					})
			);
	}
}
