export type ZoomControllerProps = {
	minEdge: {
		magnitude: number;
		distance: number;
	};
	size: {
		x: number;
		y: number;
	};
	shift: {
		target: {
			x: number;
			y: number;
		};
	};
	zoom: {
		target: number;
	};
};

export type ZoomControllerComputes = {
	translate(): {
		target: {
			x: number;
			y: number;
		};
	};
};

export function createZoomController(props: ZoomControllerProps, computes: ZoomControllerComputes) {
	function getMaxZoom() {
		if (props.minEdge.magnitude <= 0) return Number.POSITIVE_INFINITY;

		const longerSide = Math.max(props.size.x, props.size.y);
		return (longerSide * 0.25) / props.minEdge.magnitude;
	}

	function setZoomAt(focusX: number, focusY: number, nextZoom: number) {
		if (!Number.isFinite(nextZoom) || nextZoom <= 0) return false;

		const clampedZoom = Math.min(getMaxZoom(), Math.max(1, nextZoom));
		if (clampedZoom === props.zoom.target) return false;

		const appliedScale = clampedZoom / props.zoom.target;
		const translate = computes.translate().target;

		props.shift.target.x += (1 - appliedScale) * (focusX - translate.x);
		props.shift.target.y += (1 - appliedScale) * (focusY - translate.y);
		props.zoom.target = clampedZoom;

		return true;
	}

	function zoomByFactor(focusX: number, focusY: number, scaleFactor: number) {
		if (!Number.isFinite(scaleFactor) || scaleFactor <= 0) return false;
		return setZoomAt(focusX, focusY, props.zoom.target * scaleFactor);
	}

	function zoomByStep(direction: 1 | -1) {
		const scaleFactor = direction > 0 ? 2 : 0.5;
		return zoomByFactor(props.size.x / 2, props.size.y / 2, scaleFactor);
	}

	return {
		getMaxZoom,
		setZoomAt,
		zoomByFactor,
		zoomByStep,
	} as const;
}
