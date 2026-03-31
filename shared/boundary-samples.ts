export type BoundarySample = {
	id: number;
	title: string;
	description: string;
};

export const boundarySamples: BoundarySample[] = [
	{
		id: 1,
		title: "Irregular Interior Parcel",
		description: `
N 45d 12' E, 12.35 m
S 44d 50' E, 7.92 m
S 89d 15' E, 5.47 m
S 46d 5' E, 9.88 m
S 1d 35' W, 6.30 m
S 43d 45' W, 11.72 m
N 89d 50' W, 6.91 m
N 42d 55' W, 8.41 m
N 3d 15' E, 7.08 m
N 44d 10' W, 5.64 m
N 60d 0' W, 3.00 m
		`.trim(),
	},
	{
		id: 2,
		title: "Tapered Frontage Lot",
		description: `
E, 9.00 m
N 63d 26' E, 4.47 m
N 21d 48' E, 5.39 m
N 30d 57' W, 5.83 m
N 59d 2' W, 5.83 m
S 68d 11' W, 5.39 m
S 21d 48' W, 5.39 m
S, 8.00 m
		`.trim(),
	},
	{
		id: 3,
		title: "Rear-Expanded Urban Parcel",
		description: `
E, 11.00 m
N 53d 7' E, 5.00 m
N 11d 18' W, 5.10 m
N 45d 0' W, 5.66 m
S 75d 57' W, 4.12 m
N 33d 41' W, 3.61 m
S 63d 26' W, 4.47 m
S, 12.00 m
		`.trim(),
	},
	{
		id: 4,
		title: "Chamfered Corner Parcel",
		description: `
E, 8.00 m
N 45d 0' E, 5.66 m
N, 5.00 m
N 45d 0' W, 5.66 m
W, 5.00 m
S 36d 52' W, 5.00 m
S, 9.00 m
		`.trim(),
	},
	{
		id: 5,
		title: "Road-Bend Interior Lot",
		description: `
E, 6.00 m
N 75d 57' E, 4.12 m
N 45d 0' E, 5.66 m
N 11d 18' W, 5.10 m
N 45d 0' W, 5.66 m
N 78d 41' W, 5.10 m
S 45d 0' W, 5.66 m
S, 11.00 m
		`.trim(),
	},
	{
		id: 6,
		title: "Backyard Easement Parcel",
		description: `
E, 7.00 m
N 53d 7' E, 5.00 m
N, 5.00 m
N 45d 0' W, 4.24 m
N, 4.00 m
W, 5.00 m
S 30d 57' W, 5.83 m
S, 10.00 m
		`.trim(),
	},
	{
		id: 7,
		title: "Side-Access Notch Lot",
		description: `
E, 10.00 m
N 56d 18' E, 3.61 m
N, 4.00 m
W, 4.00 m
N, 4.00 m
N 51d 20' W, 6.40 m
S 53d 7' W, 5.00 m
S, 11.00 m
		`.trim(),
	},
	{
		id: 8,
		title: "Drainage Edge Parcel",
		description: `
E, 12.00 m
N 36d 52' E, 5.00 m
N 21d 48' W, 5.39 m
N 59d 2' W, 5.83 m
S 63d 26' W, 4.47 m
N 33d 41' W, 3.61 m
S 26d 33' W, 4.47 m
S, 9.00 m
		`.trim(),
	},
	{
		id: 9,
		title: "Split-Boundary Residential Lot",
		description: `
E, 8.00 m
N 63d 26' E, 4.47 m
N 26d 33' E, 4.47 m
N 45d 0' W, 5.66 m
N, 4.00 m
N 78d 41' W, 5.10 m
S 59d 2' W, 5.83 m
S, 12.00 m
		`.trim(),
	},
	{
		id: 10,
		title: "Laneway Transition Parcel",
		description: `
E, 9.00 m
N 45d 0' E, 7.07 m
N 11d 18' W, 5.10 m
N 53d 7' W, 5.00 m
S 56d 18' W, 3.61 m
N 45d 0' W, 4.24 m
S 36d 52' W, 5.00 m
S, 10.00 m
		`.trim(),
	},
	{
		id: 11,
		title: "Broad Rear Setback Lot",
		description: `
E, 7.00 m
N 63d 26' E, 4.47 m
N 26d 33' E, 4.47 m
N 21d 48' W, 5.39 m
N 53d 7' W, 5.00 m
W, 5.00 m
S 21d 48' W, 5.39 m
S, 9.00 m
		`.trim(),
	},
	{
		id: 12,
		title: "Utility Easement Inset Lot",
		description: `
E, 10.00 m
N 63d 26' E, 4.47 m
N, 5.00 m
W, 3.00 m
N 45d 0' W, 4.24 m
N 45d 0' W, 5.66 m
S 53d 7' W, 5.00 m
S, 11.00 m
		`.trim(),
	},
	{
		id: 13,
		title: "Garden Court Parcel",
		description: `
E, 8.00 m
N 53d 7' E, 5.00 m
N 14d 2' E, 4.12 m
N 21d 48' W, 5.39 m
N 59d 2' W, 5.83 m
S 68d 11' W, 5.39 m
S 11d 18' W, 5.10 m
S, 8.00 m
		`.trim(),
	},
	{
		id: 14,
		title: "Hillside Bench Lot",
		description: `
E, 9.00 m
N 75d 57' E, 4.12 m
N 36d 52' E, 5.00 m
N 11d 18' W, 5.10 m
N 45d 0' W, 5.66 m
N 68d 11' W, 5.39 m
S 56d 18' W, 7.21 m
S, 12.00 m
		`.trim(),
	},
	{
		id: 15,
		title: "Angled Corner Setback Lot",
		description: `
E, 6.00 m
N 51d 20' E, 6.40 m
N 11d 18' E, 5.10 m
N 36d 52' W, 5.00 m
N 75d 57' W, 4.12 m
S 63d 26' W, 4.47 m
S 11d 18' W, 5.10 m
S, 7.00 m
		`.trim(),
	},
	{
		id: 16,
		title: "Narrow Access Interior Lot",
		description: `
E, 11.00 m
N 36d 52' E, 5.00 m
N 21d 48' W, 5.39 m
N 63d 26' W, 4.47 m
N 26d 33' W, 4.47 m
S 78d 41' W, 5.10 m
S 11d 18' W, 5.10 m
S, 9.00 m
		`.trim(),
	},
	{
		id: 17,
		title: "Rear Garden Expansion Lot",
		description: `
E, 7.00 m
N 68d 11' E, 5.39 m
N 36d 52' E, 5.00 m
N 11d 18' W, 5.10 m
N 45d 0' W, 5.66 m
N 78d 41' W, 5.10 m
S 59d 2' W, 5.83 m
S, 13.00 m
		`.trim(),
	},
	{
		id: 18,
		title: "Service Alley Inset Parcel",
		description: `
E, 9.00 m
N 53d 7' E, 5.00 m
N, 5.00 m
W, 3.00 m
N 36d 52' W, 5.00 m
N 68d 11' W, 5.39 m
S 26d 33' W, 4.47 m
S, 10.00 m
		`.trim(),
	},
	{
		id: 19,
		title: "Tapered Avenue Parcel",
		description: `
E, 10.00 m
N 68d 11' E, 5.39 m
N 11d 18' E, 5.10 m
N 38d 39' W, 6.40 m
N 78d 41' W, 5.10 m
S 56d 18' W, 3.61 m
N 75d 57' W, 4.12 m
S, 12.00 m
		`.trim(),
	},
	{
		id: 20,
		title: "Mid-Block Expansion Parcel",
		description: `
E, 8.00 m
N 56d 18' E, 7.21 m
N 11d 18' E, 5.10 m
N 45d 0' W, 5.66 m
W, 5.00 m
N 63d 26' W, 4.47 m
S 18d 26' W, 6.32 m
S, 9.00 m
		`.trim(),
	},
	{
		id: 21,
		title: "Cul-de-Sac Shoulder Parcel",
		description: `
E, 12.00 m
N 53d 7' E, 5.00 m
N 11d 18' W, 5.10 m
N 63d 26' W, 4.47 m
N 36d 52' W, 5.00 m
N 78d 41' W, 5.10 m
S 36d 52' W, 5.00 m
S, 11.00 m
		`.trim(),
	},
	{
		id: 22,
		title: "Terraced Slope Parcel",
		description: `
E, 6.00 m
N 63d 26' E, 6.71 m
N 21d 48' E, 5.39 m
N 21d 48' W, 5.39 m
N 68d 11' W, 5.39 m
S 68d 11' W, 5.39 m
S 21d 48' W, 5.39 m
S, 8.00 m
		`.trim(),
	},
	{
		id: 23,
		title: "Skewed Street Wall Parcel",
		description: `
E, 9.00 m
N 71d 33' E, 3.16 m
N 36d 52' E, 5.00 m
N 14d 2' W, 4.12 m
N 45d 0' W, 5.66 m
N 78d 41' W, 5.10 m
S 59d 2' W, 5.83 m
S, 11.00 m
		`.trim(),
	},
	{
		id: 24,
		title: "Front Setback Shoulder Lot",
		description: `
E, 11.00 m
N 56d 18' E, 3.61 m
N, 4.00 m
N 26d 33' W, 4.47 m
N 51d 20' W, 6.40 m
S 75d 57' W, 4.12 m
S 36d 52' W, 5.00 m
S, 9.00 m
		`.trim(),
	},
	{
		id: 25,
		title: "Ridgeline Edge Parcel",
		description: `
E, 8.00 m
N 68d 11' E, 5.39 m
N 36d 52' E, 5.00 m
N 11d 18' W, 5.10 m
N 56d 18' W, 7.21 m
N 78d 41' W, 5.10 m
S 45d 0' W, 5.66 m
S, 12.00 m
		`.trim(),
	},
];
