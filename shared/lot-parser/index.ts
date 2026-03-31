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

function findClosingBoundaryVector(x: number, y: number) {
	const targetRadians = Math.atan2(-y, -x);
	const targetDistance = Math.hypot(x, y);
	let best = toBoundaryVector(targetRadians, targetDistance);
	let bestResidual = Math.hypot(x + best.x, y + best.y);

	const minuteStep = Math.PI / (180 * 60);
	for (let angleOffset = -2; angleOffset <= 2; angleOffset++) {
		for (let distanceOffset = -2; distanceOffset <= 2; distanceOffset++) {
			const candidate = toBoundaryVector(
				targetRadians + angleOffset * minuteStep,
				targetDistance + distanceOffset / 100,
			);
			const residual = Math.hypot(x + candidate.x, y + candidate.y);
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

export function fromGeoPolygonToBoundary(points: [number, number][]) {
	const count = points.length;
	if (count < 2) return [];

	const ref = points[0]!;
	let boundaryCount = count;
	const lastPoint = points[count - 1]!;
	if (count > 2 && lastPoint[0] === ref[0] && lastPoint[1] === ref[1]) {
		boundaryCount--;
	}

	if (boundaryCount < 2) return [];

	const boundary = new Array<BoundaryVector>(boundaryCount);
	let start = ref;
	let x = 0;
	let y = 0;
	for (let index = 0; index < boundaryCount; index++) {
		const target = index === boundaryCount - 1 ? ref : points[index + 1]!;
		let vector: BoundaryVector;
		if (index === boundaryCount - 1) {
			vector = findClosingBoundaryVector(x, y);
		} else {
			const degrees = ((90 - geoBearing(start, target) + 540) % 360) - 180;
			const radians = (degrees / 180) * Math.PI;
			vector = toBoundaryVector(radians, geoDistance(start, target, { units: "meters" }));
		}

		boundary[index] = vector;
		x += vector.x;
		y += vector.y;

		// Advance from the rounded vector so each segment corrects prior serialization drift.
		const transformedBearing = ((-vector.bearing.angle.degrees - 90 + 720) % 360) - 180;
		start = geoDestination(start, vector.distance, transformedBearing, {
			units: "meters",
		}).geometry.coordinates as [number, number];
	}

	return boundary as Boundary;
}
