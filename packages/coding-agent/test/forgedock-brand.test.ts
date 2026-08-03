import { describe, expect, it } from "vitest";
import { renderForgeDockBrand } from "../src/modes/interactive/components/forgedock-header.ts";

describe("ForgeDock terminal brand", () => {
	it("renders the compact F mark, wordmark, and fork version", () => {
		const output = renderForgeDockBrand("0.83.0");
		expect(output).toContain("▄▄████████");
		expect(output).toContain("F O R G E D O C K");
		expect(output).toContain("v0.83.0");
	});
});
