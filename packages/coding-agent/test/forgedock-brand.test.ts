import { describe, expect, it } from "vitest";
import { buildSystemPrompt } from "../src/core/system-prompt.ts";
import { renderForgeDockBrand } from "../src/modes/interactive/components/forgedock-header.ts";

describe("ForgeDock terminal brand", () => {
	it("renders the compact F mark, wordmark, and fork version", () => {
		const output = renderForgeDockBrand("0.83.0");
		expect(output).toContain("▄▄████████");
		expect(output).toContain("F O R G E D O C K");
		expect(output).toContain("v0.83.0");
	});

	it("uses ForgeDock—not Pi—as the assistant identity", () => {
		const prompt = buildSystemPrompt({ cwd: process.cwd(), selectedTools: [] });
		expect(prompt).toContain("You are ForgeDock");
		expect(prompt).toContain("You are ForgeDock, a provider-neutral software delivery assistant");
		expect(prompt).toContain("GitHub artifacts are durable workflow truth");
		expect(prompt).not.toContain("You are an expert coding assistant operating inside pi");
	});
});
