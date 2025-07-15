export function floorDistance(a: number) {
	if (a == 0) return 0;

	let digit = 0;
	let padding = 0;

	if (a < 1) {
		const str = a.toString().split(".")[1]!;
		for (let index = 0; index < str.length; index++) {
			if (str[index] == "0") continue;
			digit = parseInt(str[index]!);
			padding = Math.pow(10, -(index + 1));
			break;
		}
	} else {
		const rounded = Math.round(a);
		const str = rounded.toString();
		const digitCount = str.length;
		digit = parseInt(str[0]!);
		padding = Math.pow(10, digitCount - 1);
	}

	if (digit > 5) return 5 * padding;
	else if (digit > 2) return 2 * padding;
	return padding;
}
