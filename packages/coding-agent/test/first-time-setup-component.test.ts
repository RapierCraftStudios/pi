import { setKeybindings } from "@earendil-works/pi-tui";
import { beforeEach, describe, expect, it } from "vitest";
import { KeybindingsManager } from "../src/core/keybindings.ts";
import { FirstTimeSetupComponent, type FirstTimeSetupResult } from "../src/modes/interactive/components/first-time-setup.ts";
import { initTheme } from "../src/modes/interactive/theme/theme.ts";
import { stripAnsi } from "../src/utils/ansi.ts";

describe("ForgeDock first-time setup", () => {
	beforeEach(() => {
		initTheme("dark");
		setKeybindings(new KeybindingsManager());
	});

	it("uses the cinematic brand and does not advertise navigation on the welcome screen", () => {
		const component = new FirstTimeSetupComponent({
			detectedTheme: "dark",
			onThemePreview: () => {},
			onSubmit: () => {},
			onCancel: () => {},
		});

		try {
			const output = stripAnsi(component.render(120).join("\n"));
			expect(output).toContain("ForgeDock");
			expect(output).toContain("▄▄████████");
			expect(output).toContain("provider-neutral software delivery with GitHub as durable institutional memory");
			expect(output).toContain("begin setup");
			expect(output).not.toContain("navigate");
		} finally {
			component.dispose();
		}
	});

	it("uses arrow-style selection for appearance and continues directly to provider setup", () => {
		const previews: string[] = [];
		const submitted: FirstTimeSetupResult[] = [];
		const component = new FirstTimeSetupComponent({
			detectedTheme: "dark",
			onThemePreview: (themeName) => previews.push(themeName),
			onSubmit: (result) => submitted.push(result),
			onCancel: () => {},
		});

		try {
			component.handleInput("\n");
			expect(stripAnsi(component.render(120).join("\n"))).toContain("Choose your terminal appearance.");
			component.handleInput("j");
			expect(previews).toEqual(["light"]);
			component.handleInput("\n");
			expect(submitted).toEqual([{ theme: "light", shareAnalytics: false }]);
		} finally {
			component.dispose();
		}
	});
});
