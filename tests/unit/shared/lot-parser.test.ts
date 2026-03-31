import destination from "@turf/destination";
import type { ParserError } from "~/shared/lot-parser";
import {
	fromBoundaryToDescription,
	fromGeoPolygonToBoundary,
	parseDescription,
	ValidationError,
} from "~/shared/lot-parser";
import { describe, expect, it } from "vitest";
import {
	diagonalLotDescription,
	malformedLotDescription,
	openLotDescription,
	squareLotDescription,
} from "../../fixtures/lot-descriptions";

describe("parseDescription", () => {
	it.each([
		{
			name: "cardinal boundaries",
			description: squareLotDescription,
			expectedAngles: [
				{ index: 0, degrees: 0 },
				{ index: 1, degrees: 90 },
			],
		},
		{
			name: "quadrant bearings",
			description: diagonalLotDescription,
			expectedAngles: [
				{ index: 0, degrees: 45 },
				{ index: 2, degrees: -135 },
			],
		},
	])("parses $name into a closed polygon", ({ description, expectedAngles }) => {
		const results = parseDescription(description, { ref: [0, 0] });
		expect(results.boundary).toHaveLength(4);
		expect(results.area).toBeCloseTo(100, 5);
		expect(results.deviation).toBe("0.00 m");
		for (const angle of expectedAngles) {
			expect(results.boundary[angle.index]?.bearing.angle.degrees).toBeCloseTo(angle.degrees);
		}
	});

	it.each([
		{
			name: "malformed descriptions",
			description: malformedLotDescription,
			lineNumber: 2,
			message: "Cannot recognize input as a technical description of lots/surveys",
		},
	])("surfaces parser line numbers for $name", ({ description, lineNumber, message }) => {
		expect(() =>
			parseDescription(description, {
				ref: [0, 0],
			}),
		).toThrowError(
			expect.objectContaining({
				lineNumber,
				message,
			}) satisfies Partial<ParserError>,
		);
	});

	it("returns partial validation results for non-polygon boundaries", () => {
		try {
			parseDescription(openLotDescription, { ref: [0, 0] });
			throw new Error("Expected validation error");
		} catch (error) {
			expect(error).toBeInstanceOf(ValidationError);
			const validationError = error as ValidationError;

			expect(validationError.results.boundary).toHaveLength(2);
			expect(validationError.results.area).toBeUndefined();
			expect(validationError.results.deviation).toBe("0.00 m");
			expect(validationError.message).toBe("The boundary must form an approximately enclosed shape");
		}
	});
});

describe("fromGeoPolygonToBoundary", () => {
	const travel = (start: [number, number], distance: number, bearing: number) =>
		destination(start, distance, bearing, { units: "meters" }).geometry.coordinates as [number, number];
	const diagonalDistance = Math.sqrt(200);

	it("serializes geographic points relative to the reference point", () => {
		const ref: [number, number] = [121.0244, 14.5547];
		const p1 = travel(ref, 10, 90);
		const p2 = travel(p1, 10, 0);
		const p3 = travel(p2, 10, -90);
		const boundary = fromGeoPolygonToBoundary([ref, p1, p2, p3]);
		const description = fromBoundaryToDescription(boundary);
		const lines = description.split("\n");
		const results = parseDescription(description, { ref });

		expect(boundary).toHaveLength(4);
		expect(lines).toHaveLength(4);
		expect(lines[0]).toBe("E, 10.00 m");
		expect(lines[1]).toBe("N, 10.00 m");
		expect(results.deviation).toBe("0.00 m");
		expect(results.boundary[0]?.bearing.angle.degrees).toBeCloseTo(0, 1);
		expect(results.boundary[1]?.bearing.angle.degrees).toBeCloseTo(90, 1);
		expect(results.boundary[2]?.bearing.angle.degrees).toBeCloseTo(180, 1);
		expect(results.boundary[3]?.bearing.angle.degrees).toBeCloseTo(-90, 1);
	});

	it("accepts explicit reference endpoints without emitting an extra zero-length edge", () => {
		const ref: [number, number] = [121.0244, 14.5547];
		const p1 = travel(ref, diagonalDistance, 45);
		const p2 = travel(p1, diagonalDistance, 135);
		const p3 = travel(p2, diagonalDistance, -135);
		const boundary = fromGeoPolygonToBoundary([ref, p1, p2, p3, ref]);
		const description = fromBoundaryToDescription(boundary);
		const lines = description.split("\n");
		const results = parseDescription(description, { ref });

		expect(boundary).toHaveLength(4);
		expect(lines).toHaveLength(4);
		expect(description).not.toContain("0.00 m");
		expect(results.boundary).toHaveLength(4);
		expect(results.boundary[0]?.bearing.angle.degrees).toBeCloseTo(45, 1);
		expect(results.boundary[1]?.bearing.angle.degrees).toBeCloseTo(-45, 1);
		expect(results.boundary[2]?.bearing.angle.degrees).toBeCloseTo(-135, 1);
		expect(results.boundary[3]?.bearing.angle.degrees).toBeCloseTo(135, 1);
	});
});
