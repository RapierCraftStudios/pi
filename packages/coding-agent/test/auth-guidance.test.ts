import { describe, expect, it } from "vitest";
import {
	formatNoModelsAvailableMessage,
	modelFallbackMessageForInteractiveStartup,
} from "../src/core/auth-guidance.ts";

describe("interactive startup model guidance", () => {
	it("does not show the pre-auth no-model fallback during ForgeDock onboarding", () => {
		const message = formatNoModelsAvailableMessage();

		expect(modelFallbackMessageForInteractiveStartup(message, true)).toBeUndefined();
	});

	it("preserves model fallback guidance outside ForgeDock onboarding", () => {
		const message = "Could not restore the selected model";

		expect(modelFallbackMessageForInteractiveStartup(message, false)).toBe(message);
	});
});
