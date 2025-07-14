export type Direction = "N" | "S" | "E" | "W";
export type Quadrant = "NE" | "NW" | "SE" | "SW";

const angleReferences = {
	N: { start: 90, direction: 0 },
	S: { start: -90, direction: 0 },
	W: { start: 180, direction: 0 },
	E: { start: 0, direction: 0 },
	NW: { start: 90, direction: 1 },
	NE: { start: 90, direction: -1 },
	SW: { start: -90, direction: -1 },
	SE: { start: -90, direction: 1 },
} as const;

export class Bearing {
	readonly angle: {
		degrees: number;
		radians: number;
		perpDegrees: number;
		perpRadians: number;
	};

	constructor(reference: Direction);
	constructor(reference: Quadrant, degrees: number, minutes: number);
	constructor(reference: Direction | Quadrant, degrees = 0, minutes = 0) {
		if (minutes! >= 60) throw new Error("The minute component of the bearing cannot be greater than or equal to 60");
		if (degrees! + minutes! / 60 > 90)
			throw new Error("The total angle of the bearing cannot be greater than 90 degrees");

		const { start, direction } = angleReferences[reference];
		const totalDegrees = start + direction * (degrees + minutes / 60);
		{
			const degrees = totalDegrees;
			const radians = (degrees / 180) * Math.PI;
			const perpDegrees = -(Math.abs(degrees) <= 90 ? degrees : ((degrees + 720) % 360) - 180);
			const perpRadians = (perpDegrees / 180) * Math.PI;
			this.angle = { degrees, radians, perpDegrees, perpRadians };
		}
	}
}
