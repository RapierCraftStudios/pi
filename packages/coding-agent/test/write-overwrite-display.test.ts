import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { createWriteTool } from "../src/core/tools/write.ts";

const directories: string[] = [];

afterEach(() => {
	for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe("write overwrite presentation", () => {
	test("returns a display diff for an existing file without changing the model-facing success result", async () => {
		const directory = mkdtempSync(join(tmpdir(), "forgedock-write-diff-"));
		directories.push(directory);
		const file = join(directory, "example.ts");
		writeFileSync(file, "const value = 1;\n", "utf8");

		const result = await createWriteTool(directory).execute("write-overwrite", {
			path: "example.ts",
			content: "const value = 2;\n",
		});

		expect(result.content).toEqual([{ type: "text", text: "Successfully wrote 17 bytes to example.ts" }]);
		expect(result.details?.diff).toContain("const value = 1");
		expect(result.details?.diff).toContain("const value = 2");
	});
});
