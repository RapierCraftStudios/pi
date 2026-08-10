import { describe, expect, test } from "vitest";
import { defaultImagePasteKeys, KeybindingsManager } from "../src/core/keybindings.ts";

describe("clipboard image keybindings", () => {
	test("accepts Ctrl+V plus terminal-safe fallbacks on Windows", () => {
		expect(defaultImagePasteKeys("win32")).toEqual(["ctrl+v", "alt+v", "ctrl+alt+v"]);
		if (process.platform === "win32") {
			expect(new KeybindingsManager().matches("\x16", "app.clipboard.pasteImage")).toBe(true);
		}
	});

	test("uses the conventional Ctrl+V binding on Unix terminals", () => {
		expect(defaultImagePasteKeys("linux")).toEqual(["ctrl+v"]);
		expect(defaultImagePasteKeys("darwin")).toEqual(["ctrl+v"]);
	});
});
