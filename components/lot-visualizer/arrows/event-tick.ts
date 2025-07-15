import type { Application } from "pixi.js";
import { Container, ParticleContainer } from "pixi.js";
import type { PanzoomView } from "../panzoom";
import type { Vector } from "../primitives";
import type { Arrow, ArrowData } from "./arrow-data";
import { ArrowBinding } from "./pixi-objects";

export const EventTick = (panzoomView: PanzoomView, arrowData: ArrowData) => {
	const arrowsContainer = new ParticleContainer({
		dynamicProperties: {
			color: true,
			position: true,
			rotation: true,
			vertex: true,
		},
	});

	const labelsContainer = new Container();

	const bindingsPool: ArrowBinding[] = [];
	let cachedArrows: Arrow[] = [];

	return {
		init(app: Application) {
			arrowData.onReset((arrows) => {
				cachedArrows = arrows;

				if (bindingsPool.length < arrows.length) {
					const count = arrows.length - bindingsPool.length;
					for (let c = 0; c < count; c++) {
						const binding = ArrowBinding(app.renderer);
						bindingsPool.push(binding);
						const particles = arrowsContainer.particleChildren;

						if (particles.length == 0) {
							arrowsContainer.addParticle(binding.body, binding.tail, binding.head);
						} else {
							const previousHead = particles[particles.length - 1];
							particles[particles.length - 1] = binding.body;
							arrowsContainer.addParticle(binding.tail, previousHead, binding.head);
						}

						labelsContainer.addChild(binding.text);
					}
				}

				while (bindingsPool.length > arrows.length) {
					const binding = bindingsPool.pop()!;
					arrowsContainer.removeParticle(binding.body, binding.head, binding.tail);
					labelsContainer.removeChild(binding.text);
					binding.text.destroy();
				}
			});

			app.stage.addChild(arrowsContainer);
			app.stage.addChild(labelsContainer);
			app.stage.interactive = false;
			app.stage.interactiveChildren = false;

			app.ticker.add((_) => {
				const scale = panzoomView.scale().current;
				const translate = {
					x: panzoomView.translate().current.x,
					y: panzoomView.translate().current.y,
				} as Vector;

				for (let index = 0; index < cachedArrows.length; index++) {
					bindingsPool[index]!.tick(cachedArrows[index]!, scale, translate);
				}
			});
		},
	};
};
