import { boundarySamples } from "~/shared/boundary-samples";
import { fromBoundaryToDescription, parseDescription } from "~/shared/lot-parser";
import { describe, expect, it } from "vitest";

describe("boundary sample fixtures", () => {
	it.each(boundarySamples)("sample $id ($title) serializes into valid parser text", (sample) => {
		const description = fromBoundaryToDescription(sample.boundary);
		const results = parseDescription(description, { ref: [0, 0] });

		expect(description.split("\n")).toHaveLength(sample.boundary.length);
		expect(results.boundary).toHaveLength(sample.boundary.length);
		expect(results.area).toBeDefined();
	});
});
