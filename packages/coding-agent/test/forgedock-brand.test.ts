import { describe, expect, it } from "vitest";
import { buildSystemPrompt } from "../src/core/system-prompt.ts";
import {
	forgeDockBrandShinePosition,
	renderForgeDockBrand,
	shouldAnimateForgeDockBrand,
} from "../src/modes/interactive/components/forgedock-header.ts";

const stripAnsi = (value: string) => value.replace(/\x1b\[[0-9;]*m/g, "");

describe("ForgeDock terminal brand", () => {
	it("renders the original compact mark, wordmark, and fork version", () => {
		const output = stripAnsi(renderForgeDockBrand("0.83.0"));
		expect(output.split("\n")).toHaveLength(5);
		expect(output).toContain("▄▄████████");
		expect(output).toContain("▄█████▀▀▀▀▀");
		expect(output).toContain("ForgeDock");
		expect(output).not.toContain("F O R G E D O C K");
		expect(output).toContain("v0.83.0");
	});

	it("moves one bounded shine pass across the original mark", () => {
		expect(forgeDockBrandShinePosition(0)).toBe(-6);
		expect(forgeDockBrandShinePosition(14)).toBe(19);
		expect(forgeDockBrandShinePosition(99)).toBe(19);
	});

	it("disables startup motion for accessibility and non-interactive runs", () => {
		expect(shouldAnimateForgeDockBrand({ isTTY: false, env: {} })).toBe(false);
		expect(shouldAnimateForgeDockBrand({ isTTY: true, env: { FORGE_NO_MOTION: "1" } })).toBe(false);
		expect(shouldAnimateForgeDockBrand({ isTTY: true, env: { NO_COLOR: "1" } })).toBe(false);
		expect(shouldAnimateForgeDockBrand({ isTTY: true, env: { CI: "1" } })).toBe(false);
		expect(shouldAnimateForgeDockBrand({ isTTY: true, env: {} })).toBe(true);
	});

	it("uses ForgeDock—not Pi—as the assistant identity", () => {
		const prompt = buildSystemPrompt({ cwd: process.cwd(), selectedTools: [] });
		expect(prompt).toContain("You are ForgeDock");
		expect(prompt).toContain("You are ForgeDock, a provider-neutral software delivery assistant");
		expect(prompt).toContain("GitHub artifacts are durable workflow truth");
		expect(prompt).not.toContain("You are an expert coding assistant operating inside pi");
	});
});
