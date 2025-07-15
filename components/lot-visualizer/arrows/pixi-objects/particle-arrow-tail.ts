import type { Renderer } from "pixi.js";
import { Particle } from "pixi.js";
import { useArrowTextures } from "./use-arrow-textures";

export const ParticleArrowTail = (renderer: Renderer) => {
	const texture = useArrowTextures(renderer).tail;
	const particle = new Particle(texture);
	particle.anchorX = 0.5;
	particle.anchorY = 0.5;
	return particle;
};
