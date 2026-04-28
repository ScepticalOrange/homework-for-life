export interface FrontmatterSplit {
	fm: string;
	body: string;
}

export function splitFrontmatter(content: string): FrontmatterSplit {
	const m = content.match(/^---\n[\s\S]*?\n---\n?/);
	if (!m) return { fm: "", body: content };
	return { fm: m[0], body: content.slice(m[0].length) };
}
