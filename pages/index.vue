<script setup lang="ts">
	import { LotVisualizer } from "#components";
	import { Bearing, BoundaryVector } from "~/shared/lot-parser";
</script>

<template>
	<div class="h-dvh min-h-dvh w-dvw min-w-dvw">
		<div class="relative flex h-full w-full flex-col items-center justify-center">
			<LotVisualizer
				:boundary="[
					new BoundaryVector(new Bearing('N'), 1),
					new BoundaryVector(new Bearing('W'), 1),
					new BoundaryVector(new Bearing('S'), 1),
					new BoundaryVector(new Bearing('E'), 1),
				]" />
		</div>
	</div>
</template>
