import { FormatHandler } from "./handler";
import { TableFormatHandler } from "./table";
import { HeadingsFormatHandler } from "./headings";
import { FormatType, HfLSettings } from "../types";

export function detectFormat(content: string, settings: HfLSettings): FormatType {
	const table = new TableFormatHandler(settings);
	if (table.detect(content)) return "table";
	const headings = new HeadingsFormatHandler(settings);
	if (headings.detect(content)) return "headings";
	return settings.output_format;
}

export function createHandler(format: FormatType, settings: HfLSettings): FormatHandler {
	if (format === "table") return new TableFormatHandler(settings);
	return new HeadingsFormatHandler(settings);
}
