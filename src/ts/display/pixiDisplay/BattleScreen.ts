import { AnimatedSprite, Container } from "pixi.js";

export default class BattleScreen {
	private rootContainer: Container;
	private playerSprites: AnimatedSprite[];
	constructor (display: any /*ugh*/, parentContainer: Container) {
		this.rootContainer = new Container();
		this.rootContainer.visible = false;
		parentContainer.addChild(this.rootContainer);
		this.playerSprites = [];
		this.playerSprites[0] = new AnimatedSprite(display.getTextures('battle', ['0-0']));
		this.playerSprites[1] = new AnimatedSprite(display.getTextures('battle', ['0-1']));
		this.playerSprites[2] = new AnimatedSprite(display.getTextures('battle', ['0-2']));
		this.playerSprites[0].x = 100;
		this.playerSprites[0].y = 16;
		this.playerSprites[1].x = 100;
		this.playerSprites[1].y = 16 + 24 + 8;
		this.playerSprites[2].x = 100;
		this.playerSprites[2].y = 16 + (24 + 8) * 2;
		this.rootContainer.addChild(this.playerSprites[0]);
		this.rootContainer.addChild(this.playerSprites[1]);
		this.rootContainer.addChild(this.playerSprites[2]);
	}

	display () {
		this.rootContainer.visible = true;
	}
}