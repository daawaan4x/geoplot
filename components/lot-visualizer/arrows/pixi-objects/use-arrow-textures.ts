import { Container, Graphics, Point, Rectangle, RenderTexture, Sprite, Texture } from "pixi.js";
import type { Renderer } from "pixi.js";
import { useRenderCache } from "../../use-render-cache";

function createArrowTextures(renderer: Renderer) {
	const body = new Sprite(Texture.WHITE);
	body.width = 3;
	body.height = 3;

	const tail = new Graphics();
	tail.circle(2, 2, 2).fill(0xffffff);
	tail.position.x = body.x + body.width + 1;

	const head = new Graphics();
	head.poly([new Point(0, 0), new Point(24, 12), new Point(0, 24), new Point(6, 12)]).fill(0xffffff);
	head.position.x = tail.x + tail.width + 1;

	const container = new Container({ children: [body, tail, head] });
	const source = renderer.generateTexture({
		target: container,
		resolution: 2 * window.devicePixelRatio,
		antialias: true,
	}).source;

	const textures = {
		body: new RenderTexture({ source, frame: new Rectangle(body.x, body.y, 1, 1) }),
		tail: new RenderTexture({ source, frame: tail.getBounds().rectangle }),
		head: new RenderTexture({ source, frame: head.getBounds().rectangle }),
	};

	return textures;
}

export function useArrowTextures(renderer: Renderer) {
	return useRenderCache({ key: "arrow-textures", renderer }, () => createArrowTextures(renderer));
}
