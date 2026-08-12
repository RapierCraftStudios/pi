import { mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { shouldRunFirstTimeSetup } from "../src/cli/startup-ui.ts";
import { ENV_AGENT_DIR } from "../src/config.ts";
import { SettingsManager } from "../src/core/settings-manager.ts";

describe("shouldRunFirstTimeSetup", () => {
	const originalPiExperimental = process.env.PI_EXPERIMENTAL;
	const originalAgentDir = process.env[ENV_AGENT_DIR];
	let tempDir: string;
	let settingsPath: string;
	let authPath: string;

	beforeEach(() => {
		tempDir = mkdtempSync(join(tmpdir(), "pi-first-time-setup-"));
		settingsPath = join(tempDir, "settings.json");
		authPath = join(tempDir, "auth.json");
		process.env.PI_EXPERIMENTAL = "1";
		delete process.env[ENV_AGENT_DIR];
	});

	afterEach(() => {
		rmSync(tempDir, { recursive: true, force: true });
		if (originalPiExperimental === undefined) {
			delete process.env.PI_EXPERIMENTAL;
		} else {
			process.env.PI_EXPERIMENTAL = originalPiExperimental;
		}
		if (originalAgentDir === undefined) {
			delete process.env[ENV_AGENT_DIR];
		} else {
			process.env[ENV_AGENT_DIR] = originalAgentDir;
		}
	});

	it("runs ForgeDock onboarding when its receipt is absent", () => {
		expect(shouldRunFirstTimeSetup(settingsPath, join(tempDir, "onboarding.json"), authPath)).toBe(true);
	});

	it("does not require Pi's experimental flag", () => {
		delete process.env.PI_EXPERIMENTAL;
		expect(shouldRunFirstTimeSetup(settingsPath, join(tempDir, "onboarding.json"), authPath)).toBe(true);
	});

	it("supports a custom ForgeDock agent directory", () => {
		process.env[ENV_AGENT_DIR] = tempDir;
		expect(shouldRunFirstTimeSetup(settingsPath, join(tempDir, "onboarding.json"), authPath)).toBe(true);
	});

	it("does not mistake partial theme settings for completed onboarding", () => {
		writeFileSync(settingsPath, "{}", "utf-8");
		expect(shouldRunFirstTimeSetup(settingsPath, join(tempDir, "onboarding.json"), authPath)).toBe(true);
	});

	it("does not restart setup when stored credentials already exist", () => {
		writeFileSync(authPath, JSON.stringify({ "openai-codex": { type: "oauth" } }), "utf-8");
		expect(shouldRunFirstTimeSetup(settingsPath, join(tempDir, "onboarding.json"), authPath)).toBe(false);
	});

	it("stops after a completion receipt is written", () => {
		const receiptPath = join(tempDir, "onboarding.json");
		writeFileSync(receiptPath, "{}", "utf-8");
		expect(shouldRunFirstTimeSetup(settingsPath, receiptPath, authPath)).toBe(false);
	});
});

describe("analytics settings", () => {
	it("defaults to disabled with no tracking identifier", () => {
		const manager = SettingsManager.inMemory();

		expect(manager.getEnableAnalytics()).toBe(false);
		expect(manager.getTrackingId()).toBeUndefined();
	});

	it("generates a tracking identifier on opt-in", () => {
		const manager = SettingsManager.inMemory();

		manager.setEnableAnalytics(true);

		expect(manager.getEnableAnalytics()).toBe(true);
		expect(manager.getTrackingId()).toMatch(/^[0-9a-f-]{36}$/);
	});

	it("does not generate a tracking identifier on opt-out", () => {
		const manager = SettingsManager.inMemory();

		manager.setEnableAnalytics(false);

		expect(manager.getEnableAnalytics()).toBe(false);
		expect(manager.getTrackingId()).toBeUndefined();
	});

	it("keeps the tracking identifier when toggling analytics", () => {
		const manager = SettingsManager.inMemory();

		manager.setEnableAnalytics(true);
		const trackingId = manager.getTrackingId();
		manager.setEnableAnalytics(false);
		manager.setEnableAnalytics(true);

		expect(manager.getTrackingId()).toBe(trackingId);
	});
});
