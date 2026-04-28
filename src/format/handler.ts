import { FormatType } from "../types";

export interface FormatHandler {
	type: FormatType;
	detect(content: string): boolean;
	readDay(content: string, date: string): string[] | null;
	appendToDay(content: string, date: string, moments: string[]): string;
	insertNewDay(content: string, date: string, moments: string[]): string;
	initialContent(filename: string, date: string, moments: string[]): string;
}
