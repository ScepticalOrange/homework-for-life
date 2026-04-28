export function formatLocalDate(d: Date = new Date()): string {
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const dd = String(d.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}

export function parseLocalDate(s: string): Date {
	const [y, m, d] = s.split("-").map(Number);
	return new Date(y, m - 1, d);
}

export function wikilinkDate(date: string): string {
	return `[[${date}]]`;
}

export function buildFilename(date: Date, pattern: string): string {
	const yyyy = String(date.getFullYear());
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const q = Math.floor(date.getMonth() / 3) + 1;
	return pattern
		.replace(/YYYY/g, yyyy)
		.replace(/MM/g, mm)
		.replace(/\[Q\]Q/g, `Q${q}`)
		.replace(/Q/g, String(q));
}
