export function lotDescription(...lines: string[]) {
	return lines.join("\n");
}

export const squareLotDescription = lotDescription("E, 10 m", "N, 10 m", "W, 10 m", "S, 10 m");

export const diagonalLotDescription = lotDescription(
	"N 45d 0' E, 10 m",
	"S 45d 0' E, 10 m",
	"S 45d 0' W, 10 m",
	"N 45d 0' W, 10 m",
);

export const malformedLotDescription = lotDescription("E, 10 m", "not a valid boundary", "W, 10 m");

export const openLotDescription = lotDescription("E, 10 m", "W, 10 m");

export const shortSquareLotDescription = lotDescription("E, 10 m", "N, 10 m", "W, 10 m");
