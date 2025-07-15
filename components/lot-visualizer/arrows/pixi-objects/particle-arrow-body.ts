import type { Renderer } from "pixi.js";
import { Particle } from "pixi.js";
import { useArrowTextures } from "./use-arrow-textures";

export const ParticleArrowBody = (renderer: Renderer) => {
	const texture = useArrowTextures(renderer).body;
	const particle = new Particle(texture);
	particle.scaleY = 5;
	particle.anchorX = 0;
	particle.anchorY = 0.5;
	return particle;
};
