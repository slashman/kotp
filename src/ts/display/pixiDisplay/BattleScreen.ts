import { AnimatedSprite, Container, Sprite, Text } from "pixi.js";

export default class BattleScreen {
	private rootContainer: Container;
	private playerSprites: AnimatedSprite[];
	private hpTxt: Text;
	private mpTxt: Text;
	private enemySprite: AnimatedSprite; 
	private cursorSprite: Sprite;
	private playerSprite: AnimatedSprite;
	
	constructor (display: any /*ugh*/, parentContainer: Container) {
		this.rootContainer = new Container();
		this.rootContainer.visible = false;
		parentContainer.addChild(this.rootContainer);
		this.rootContainer.addChild(new Sprite(display.getTexture('battleBackground')));
		this.playerSprites = [];
		this.playerSprites[0] = new AnimatedSprite(display.getTextures('battle', ['0-0']));
		this.playerSprites[1] = new AnimatedSprite(display.getTextures('battle', ['0-1']));
		this.playerSprites[2] = new AnimatedSprite(display.getTextures('battle', ['0-2']));
		this.playerSprites[0].x = 200;
		this.playerSprites[0].y = 40;
		this.playerSprites[1].x = 200;
		this.playerSprites[1].y = 40 + 24 + 8;
		this.playerSprites[2].x = 200;
		this.playerSprites[2].y = 40 + (24 + 8) * 2;
		this.rootContainer.addChild(this.playerSprites[0]);
		this.rootContainer.addChild(this.playerSprites[1]);
		this.rootContainer.addChild(this.playerSprites[2]);
		this.enemySprite = new AnimatedSprite(display.getTextures('battle', ['0-3']));
		this.enemySprite.x = 64;
		this.enemySprite.y = 64;
		this.rootContainer.addChild(this.enemySprite);
		this.rootContainer.addChild(display.createTextBox(192, 152, "PUN\n\nCHEER\n\nDANCE", 200));
		this.rootContainer.addChild(display.createTextBox(24, 168, "GABY\n\nSLAS\n\nADRI", 200));
		this.rootContainer.addChild(display.createTextBox(64, 152, "Confidence      Spirit", undefined));
		this.hpTxt = display.createTextBox(80, 168, "100/100\n\n80/80\n\n70/70", undefined);
		this.mpTxt = display.createTextBox(144, 168, "10\n\n50\n\n30", undefined);
		this.rootContainer.addChild(this.hpTxt);
		this.rootContainer.addChild(this.mpTxt);
		this.cursorSprite = new Sprite(display.pointyCursor);
		this.cursorSprite.x = 192 - 16;
		this.cursorSprite.y = 152;
		this.rootContainer.addChild(this.cursorSprite);

		this.playerSprite = new AnimatedSprite(display.getTextures('slashie', ['10-0','11-0']));
		this.playerSprite.animationSpeed = 1/16;
		this.playerSprite.play();
		this.playerSprite.x = 216 - 32;
		this.playerSprite.y = 48;
		this.rootContainer.addChild(this.playerSprite);
	}

	display () {
		this.rootContainer.visible = true;
	}

	private currentIndex: number = 0;

	move (dir) {
		this.currentIndex += dir.y;
		if (this.currentIndex > 3) {
			this.currentIndex = 0;
		}
		if (this.currentIndex < 0) {
			this.currentIndex = 3;
		}
		this.updateCursorPosition();
	}

	private updateCursorPosition() {
		this.cursorSprite.y = 152 + this.currentIndex * 20;
	}
}