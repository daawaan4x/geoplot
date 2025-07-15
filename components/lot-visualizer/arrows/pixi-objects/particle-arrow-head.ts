import type { Renderer } from "pixi.js";
import { Particle } from "pixi.js";
import { useArrowTextures } from "./use-arrow-textures";

export const ParticleArrowHead = (renderer: Renderer) => {
	const texture = useArrowTextures(renderer).head;
	const particle = new Particle(texture);
	particle.anchorX = 1;
	particle.anchorY = 0.5;
	return particle;
};
