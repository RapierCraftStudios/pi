import { describe, expect, test } from "vitest";
import { PendingImageAttachments } from "../src/modes/interactive/pending-image-attachments.ts";

const image = (data: string) => ({ type: "image" as const, data, mimeType: "image/png" });

describe("PendingImageAttachments", () => {
	test("attaches multiple images in marker order and consumes them once", () => {
		const queue = new PendingImageAttachments();
		const first = queue.add(image("first"));
		const second = queue.add(image("second"));

		expect(first.marker).toBe("[Image #1]");
		expect(second.marker).toBe("[Image #2]");
		expect(queue.consume(`Compare ${first.marker} with ${second.marker}`)).toEqual({
			text: "Compare [Image #1] with [Image #2]",
			images: [image("first"), image("second")],
		});
		expect(queue.size).toBe(0);
		expect(queue.consume("next prompt")).toEqual({ text: "next prompt" });
	});

	test("does not attach an image when the user removes its marker", () => {
		const queue = new PendingImageAttachments();
		queue.add(image("removed"));
		expect(queue.consume("marker deleted")).toEqual({ text: "marker deleted" });
		expect(queue.add(image("new")).marker).toBe("[Image #1]");
	});

	test("attaches only markers retained in the submitted draft", () => {
		const queue = new PendingImageAttachments();
		queue.add(image("removed"));
		const retained = queue.add(image("retained"));
		expect(queue.consume(retained.marker).images).toEqual([image("retained")]);
	});
});
