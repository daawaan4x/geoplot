import geoBearing from "@turf/bearing";
import geoDestination from "@turf/destination";
import geoDistance from "@turf/distance";
import type { Direction, Quadrant } from "./bearing";
import { Bearing } from "./bearing";
import type { Boundary } from "./boundary";
import { BoundaryVector } from "./boundary-vector";
import { GeoPolygon } from "./geo-polygon";
import { Point } from "./point";
import { Polygon } from "./polygon";

export type { Quadrant, Boundary };
export { Bearing, BoundaryVector, Point, Polygon, GeoPolygon };

const pattern = new RegExp("^(?:(?:([NS]) ([0-9]{1,2})d ([0-9]{1,2})' ([EW]))|([NSEW])), ([+-]?[0-9]*[.]?[0-9]+) m$");

export class ParserError extends Error {
	constructor(
		public readonly lineNumber: number,
		message: string,
	) {
		super(message);
	}
}

export type ParseResults = {
	boundary: Boundary;
	area?: number;
	deviation: string;
};

export class ValidationError extends Error {
	constructor(
		public readonly results: ParseResults,
		message: string,
	) {
		super(message);
	}
}

function toDegreesMinutes(radians: number) {
	const degrees = (radians * 180) / Math.PI;
	const intDegrees = Math.trunc(degrees);
	const minutes = (degrees % 1) * 60;
	const intMinutes = Math.trunc(minutes);
	return {
		degrees: intDegrees,
		minutes: intMinutes,
	};
}

function toBearing(radians: number) {
	const { degrees, minutes } = toDegreesMinutes(radians);
	const total = degrees + minutes / 60;

	if (total == 90) return "N";
	if (total == -90) return "S";
	if (total == 0) return "E";
	if (total == 180 || total == -180) return "W";

	let quadrant: Quadrant = "NE";
	if (0 < total && total < 90) quadrant = "NE";
	if (90 < total && total < 180) quadrant = "NW";
	if (-90 < total && total < 0) quadrant = "SE";
	if (-180 < total && total < -90) quadrant = "SW";

	if (Math.abs(total) < 90) {
		const { degrees, minutes } = toDegreesMinutes(Math.PI / 2 - Math.abs(radians));
		return `${quadrant[0]} ${degrees}d ${minutes}' ${quadrant[1]}`;
	} else {
		const { degrees, minutes } = toDegreesMinutes(Math.abs(radians) - Math.PI / 2);
		return `${quadrant[0]} ${degrees}d ${minutes}' ${quadrant[1]}`;
	}
}

function toDescription(radians: number, distance: number) {
	const roundedDistance = Math.round(distance * 100) / 100;
	const fixedDistance = roundedDistance.toFixed(2);
	if (roundedDistance == 0) return `${fixedDistance} m`;
	return `${toBearing(radians)}, ${fixedDistance} m`;
}

function parseBoundaryVector(tokens: RegExpExecArray) {
	const direction = tokens[5] as Direction | null;
	const distance = parseFloat(tokens[6]!);
	let bearing: Bearing | null = null;
	if (direction) bearing = new Bearing(direction);
	else {
		const quadrant = (tokens[1]! + tokens[4]!) as Quadrant;
		const degrees = parseInt(tokens[2]!);
		const minutes = parseInt(tokens[3]!);
		bearing = new Bearing(quadrant, degrees, minutes);
	}
	return new BoundaryVector(bearing, distance);
}

function toBoundaryVector(radians: number, distance: number) {
	const tokens = pattern.exec(toDescription(radians, distance));
	if (!tokens) throw new Error("Cannot serialize input as a boundary vector");
	return parseBoundaryVector(tokens);
}

/**
 * Finds a representable closing vector for the residual offset left by the
 * already-quantized boundary vectors.
 *
 * The input `x`/`y` is the current Cartesian displacement from the reference
 * point after earlier segments have already been rounded into boundary vectors.
 * This function first computes the ideal closing direction and length back to
 * the origin, then searches a small neighborhood of nearby bearings and
 * distances that can survive `toBoundaryVector()` serialization. The candidate
 * whose rounded vector leaves the smallest remaining closure residual is used
 * as the final edge.
 */
function findClosingBoundaryVector(x: number, y: number) {
	// Point from the current accumulated offset back toward the reference point.
	const targetRadians = Math.atan2(-y, -x);
	// Use the remaining displacement magnitude as the ideal closing distance.
	const targetDistance = Math.hypot(x, y);
	// Start with the direct rounded version of that ideal closing vector.
	let best = toBoundaryVector(targetRadians, targetDistance);
	// Measure how much offset would remain after applying the rounded closing vector.
	let bestResidual = Math.hypot(x + best.x, y + best.y);

	const minuteStep = Math.PI / (180 * 60);

	// Search nearby representable bearings within +/- 2 minutes.
	for (let angleOffset = -2; angleOffset <= 2; angleOffset++) {
		// Search nearby representable distances within +/- 0.02 m.
		for (let distanceOffset = -2; distanceOffset <= 2; distanceOffset++) {
			// Round each nearby ideal vector through the same boundary serialization path.
			const candidate = toBoundaryVector(
				targetRadians + angleOffset * minuteStep,
				targetDistance + distanceOffset / 100,
			);

			// Compute the leftover closure error if this rounded candidate were used.
			const residual = Math.hypot(x + candidate.x, y + candidate.y);

			// Keep the candidate that closes the polygon most tightly after rounding.
			if (residual < bestResidual) {
				best = candidate;
				bestResidual = residual;
			}
		}
	}

	return best;
}

export function parseDescription(rawInput: string, params: { ref: [number, number] }) {
	const inputs = rawInput
		.trim()
		.split("\n")
		.map((line) => line.trim());
	const boundary = new Array<BoundaryVector>(inputs.length);
	let index = 0;

	try {
		for (; index < inputs.length; index++) {
			const tokens = pattern.exec(inputs[index]!);
			if (!tokens) throw new Error("Cannot recognize input as a technical description of lots/surveys");
			boundary[index] = parseBoundaryVector(tokens);
		}
	} catch (error) {
		const message = (error as Error).message;
		throw new ParserError(index + 1, message);
	}

	const geopolygon = new GeoPolygon(params.ref, boundary);
	const polygon = new Polygon(boundary);

	const results = {
		boundary: boundary as Boundary,
		area: polygon.area,
		deviation: toDescription((geopolygon.deviation.degrees / 180) * Math.PI, geopolygon.deviation.magnitude),
	} as ParseResults;

	if (geopolygon.deviation.magnitude > 1 / 3 || inputs.length < 3) {
		results.area = undefined;
		throw new ValidationError(results, "The boundary must form an approximately enclosed shape");
	}

	return results;
}

export function fromBoundaryToDescription(boundary: Boundary) {
	return boundary.map((vector) => toDescription(vector.bearing.angle.radians, vector.distance)).join("\n");
}

/**
 * Converts a geographic polygon into the boundary-vector format used by the parser.
 *
 * Each non-closing side is measured from the current `start` coordinate, then
 * passed through `toBoundaryVector()`, which snaps the segment to the same
 * serialized precision the textual boundary format supports. After that, the
 * next `start` is not the raw polygon vertex, but the geodesic destination
 * implied by the rounded vector itself.
 *
 * This means later sides are measured from the already-quantized path, so the
 * function stays consistent with earlier rounding instead of repeatedly measuring
 * from the original polygon vertices. It does not optimize each side
 * incrementally; explicit closure correction is deferred to the last edge, where
 * `findClosingBoundaryVector()` searches nearby representable vectors and picks
 * the one with the smallest remaining closure error in Cartesian `x`/`y` space.
 */
export function fromGeoPolygonToBoundary(points: [number, number][]) {
	const count = points.length;
	if (count < 2) return [];

	// Use the first coordinate as the reference point, and ignore a duplicated closing vertex.
	const ref = points[0]!;
	let boundaryCount = count;
	const lastPoint = points[count - 1]!;
	if (count > 2 && lastPoint[0] === ref[0] && lastPoint[1] === ref[1]) {
		boundaryCount--;
	}

	if (boundaryCount < 2) return [];

	// Track the rounded boundary plus the accumulated Cartesian offset it produces.
	const boundary = new Array<BoundaryVector>(boundaryCount);
	let start = ref;
	let x = 0;
	let y = 0;

	// Convert each side in order, leaving the final side to explicitly close the rounded path.
	for (let index = 0; index < boundaryCount; index++) {
		// For the closing side, target the reference point; otherwise use the next polygon vertex.
		const target = index === boundaryCount - 1 ? ref : points[index + 1]!;
		let vector: BoundaryVector;

		if (index === boundaryCount - 1) {
			// Choose the last vector from the remaining rounded offset, minimizing final closure error.
			vector = findClosingBoundaryVector(x, y);
		} else {
			// Turf returns a geographic bearing clockwise from north; convert it to this module's math angle.
			const degrees = ((90 - geoBearing(start, target) + 540) % 360) - 180;
			// Convert the normalized angle to radians for `toBoundaryVector()`.
			const radians = (degrees / 180) * Math.PI;
			// Quantize the raw geodesic segment into the parser's boundary-vector representation.
			vector = toBoundaryVector(radians, geoDistance(start, target, { units: "meters" }));
		}

		// Accumulate the rounded segment so the closing search sees the actual residual offset.
		boundary[index] = vector;
		x += vector.x;
		y += vector.y;

		// Advance from the rounded vector so later measurements follow the quantized path.
		const transformedBearing = ((-vector.bearing.angle.degrees - 90 + 720) % 360) - 180;
		// Reproject that rounded segment geodesically to obtain the next measurement origin.
		start = geoDestination(start, vector.distance, transformedBearing, {
			units: "meters",
		}).geometry.coordinates as [number, number];
	}

	return boundary as Boundary;
}
