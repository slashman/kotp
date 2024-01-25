import { Container, Sprite } from "pixi.js";

export class PIXIFrame {
	container: Container;
	
	private a: Sprite;
	private b: Sprite;
	private c: Sprite;
	private d: Sprite;
	private e: Sprite;
	private f: Sprite;
	private g: Sprite;
	private h: Sprite;
	private i: Sprite;

	private hh: number;

	private x: number;
	private y: number;
	private w: number;
	private tileSize: number;

	constructor (x: number, y: number, w: number, h: number, tileSize: number, textureMap: any, sliceConfig: any) {
		this.container = new Container();
		this.a = new Sprite(textureMap[sliceConfig.a]);
		this.b = new Sprite(textureMap[sliceConfig.b]);
		this.c = new Sprite(textureMap[sliceConfig.c]);
		this.d = new Sprite(textureMap[sliceConfig.d]);
		this.e = new Sprite(textureMap[sliceConfig.e]);
		this.f = new Sprite(textureMap[sliceConfig.f]);
		this.g = new Sprite(textureMap[sliceConfig.g]);
		this.h = new Sprite(textureMap[sliceConfig.h]);
		this.i = new Sprite(textureMap[sliceConfig.i]);

		this.container.addChild(this.a);
		this.container.addChild(this.b);
		this.container.addChild(this.c);
		this.container.addChild(this.d);
		this.container.addChild(this.e);
		this.container.addChild(this.f);
		this.container.addChild(this.g);
		this.container.addChild(this.h);
		this.container.addChild(this.i);
		this.x = x;
		this.y = y;
		this.w = w;
		this.hh = h;
		this.tileSize = tileSize;
		this.relocate();
	}

	resize (height: number): void {
		this.hh = height;
		this.relocate();
	}

	private relocate(): void {
		const {x, y, w, tileSize} = this;
		const h = this.hh;

		this.a.position.x = x;
		this.a.position.y = y;
		this.b.position.x = x + tileSize;
		this.b.position.y = y;
		this.c.position.x = x + w - tileSize;
		this.c.position.y = y;
		this.d.position.x = x;
		this.d.position.y = y + tileSize;
		this.e.position.x = x + tileSize;
		this.e.position.y = y + tileSize;
		this.f.position.x = x + w - tileSize;
		this.f.position.y = y + tileSize;
		this.g.position.x = x;
		this.g.position.y = y + h - tileSize;
		this.h.position.x = x + tileSize;
		this.h.position.y = y + h - tileSize;
		this.i.position.x = x + w - tileSize;
		this.i.position.y = y + h - tileSize;
		this.b.width = w - 2 * tileSize;
		this.e.width = w - 2 * tileSize;
		this.h.width = w - 2 * tileSize;
		this.d.height = h - 2 * tileSize;
		this.e.height = h - 2 * tileSize;
		this.f.height = h - 2 * tileSize;
	}

}