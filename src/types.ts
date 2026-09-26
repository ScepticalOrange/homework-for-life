export type FormatType = "table" | "headings";
export type AppendPosition = "top" | "bottom";
export type MultiMomentStyle = "br" | "br_bullets";
export type Language = "auto" | "en" | "de";

export interface HfLSettings {
	hfl_folder: string;
	filename_pattern: string;
	append_position: AppendPosition;
	output_format: FormatType;
	multi_moment_style: MultiMomentStyle;
	language: Language;
}

export const DEFAULT_SETTINGS: HfLSettings = {
	hfl_folder: "HfL",
	filename_pattern: "YYYY-MM",
	append_position: "top",
	output_format: "table",
	multi_moment_style: "br",
	language: "auto",
};
