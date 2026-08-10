import chalk from "chalk";

const CHROME = ["#f7f3ea", "#d9cfba", "#a99a82", "#6e6252"] as const;
const EMBER = ["#ff4d00", "#ff8c1a", "#ffd166"] as const;

const MARK = ["   ▄▄████████", " ▄█████▀▀▀▀▀", " ▀▀ ▄████▀", "   ▀▀▀"] as const;
const MARK_WIDTH = Math.max(...MARK.map((line) => [...line].length));
const SHINE_RADIUS = 3.25;

export interface ForgeDockBrandEnvironment {
	isTTY?: boolean;
	env?: NodeJS.ProcessEnv;
}

export function shouldAnimateForgeDockBrand({
	isTTY = process.stdout.isTTY,
	env = process.env,
}: ForgeDockBrandEnvironment = {}): boolean {
	return isTTY === true && !env.CI && !env.NO_COLOR && !env.FORGE_NO_MOTION && env.TERM !== "dumb";
}

/** Position of the diagonal shine band for a zero-based animation frame. */
export function forgeDockBrandShinePosition(frame: number, frames = 14): number {
	const progress = Math.min(Math.max(frame / Math.max(frames, 1), 0), 1);
	return progress * (MARK_WIDTH + 12) - 6;
}

function gradient(text: string, stops: readonly string[], shinePosition?: number, row = 0): string {
	const characters = [...text];
	const denominator = Math.max(characters.length - 1, 1);
	return characters
		.map((character, index) => {
			if (character === " ") return character;
			let rgb = sampleGradient(stops, index / denominator);
			if (shinePosition !== undefined) {
				const distance = Math.abs(index - shinePosition + row * 1.5);
				if (distance < SHINE_RADIUS) {
					const boost = (1 - distance / SHINE_RADIUS) * 0.9;
					const brighten = (channel: number) => Math.round(channel + (255 - channel) * boost);
					rgb = [brighten(rgb[0]), brighten(rgb[1]), brighten(rgb[2])];
				}
			}
			return chalk.rgb(rgb[0], rgb[1], rgb[2])(character);
		})
		.join("");
}

function sampleGradient(stops: readonly string[], value: number): readonly [number, number, number] {
	const colors = stops.map(parseHex);
	if (colors.length === 1) return colors[0] ?? [255, 255, 255];
	const clamped = Math.min(Math.max(value, 0), 1);
	const scaled = clamped * (colors.length - 1);
	const leftIndex = Math.min(Math.floor(scaled), colors.length - 2);
	const amount = scaled - leftIndex;
	const left = colors[leftIndex] ?? colors[0];
	const right = colors[leftIndex + 1] ?? colors[colors.length - 1];
	if (!left || !right) return [255, 255, 255];
	const channel = (index: number) =>
		Math.round((left[index] ?? 0) + ((right[index] ?? 0) - (left[index] ?? 0)) * amount);
	return [channel(0), channel(1), channel(2)];
}

function parseHex(value: string): readonly [number, number, number] {
	return [1, 3, 5].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16)) as [number, number, number];
}

export function renderForgeDockBrand(version: string, shinePosition?: number): string {
	const mark = MARK.map((line, index) =>
		gradient(line, CHROME.slice(Math.min(index, CHROME.length - 2)), shinePosition, index),
	).join("\n");
	const wordmark = gradient("ForgeDock", EMBER);
	return `${mark}\n${wordmark}${chalk.dim(`  v${version}`)}`;
}
