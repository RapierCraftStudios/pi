import chalk from "chalk";

const CHROME = ["#f7f3ea", "#d9cfba", "#a99a82", "#6e6252"] as const;
const EMBER = ["#ff4d00", "#ff8c1a", "#ffd166"] as const;

const MARK = ["   ▄▄████████", " ▄█████▀▀▀▀▀", " ▀▀ ▄████▀", "   ▀▀▀"] as const;

function gradient(text: string, stops: readonly string[]): string {
	const chars = [...text];
	const denominator = Math.max(chars.length - 1, 1);
	return chars
		.map((char, index) => {
			if (char === " ") return char;
			const scaled = (index / denominator) * (stops.length - 1);
			const leftIndex = Math.min(Math.floor(scaled), stops.length - 2);
			const amount = scaled - leftIndex;
			const left = stops[leftIndex] ?? stops[0];
			const right = stops[leftIndex + 1] ?? stops[stops.length - 1];
			if (!left || !right) return char;
			return chalk.hex(mix(left, right, amount))(char);
		})
		.join("");
}

function mix(left: string, right: string, amount: number): string {
	const parse = (value: string) => [1, 3, 5].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
	const a = parse(left);
	const b = parse(right);
	const channel = (index: number) => Math.round((a[index] ?? 0) + ((b[index] ?? 0) - (a[index] ?? 0)) * amount);
	return `#${[channel(0), channel(1), channel(2)].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

export function renderForgeDockBrand(version: string): string {
	const mark = MARK.map((line, index) => gradient(line, CHROME.slice(Math.min(index, CHROME.length - 2)))).join("\n");
	const wordmark = gradient("F O R G E D O C K", EMBER);
	return `${mark}\n${wordmark}${chalk.dim(`  v${version}`)}`;
}
