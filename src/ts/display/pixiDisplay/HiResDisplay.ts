import { Application, Assets, Sprite, Container } from 'pixi.js';
import Loc from '../../loc/Loc';
import { PIXIFrame } from './PIXIFrame.class';
import PixiUtils from './PixiUtils';

let theHRCanvas;
const useGBC = true;

function resizeHRCanvas () {
	if (!theHRCanvas || document.getElementById('cutscene').style.display === 'none') {
		return;
	}
	const padding = 0;
	const gameDiv = document.getElementById('cutscene');
	gameDiv.style.display = 'none'; // Prevent the base size of the div from stretching the viewport
	// ...could use document.documentElement.clientWidth instead but don't want to fight that now
	const aspectRatio = theHRCanvas.height / theHRCanvas.width;
	if (innerWidth * aspectRatio <= innerHeight) {
		if (useGBC) {
			resizeHRCanvasSlashieBC ();
			return;
		}
		theHRCanvas.style.width = (innerWidth - padding) + "px"; 
		theHRCanvas.style.height = (innerWidth * aspectRatio - padding) + "px";
	} else {
		theHRCanvas.style.width = (innerHeight * 1/aspectRatio - padding)+ "px"; 
		theHRCanvas.style.height = (innerHeight - padding) + "px";
	}
	gameDiv.style.width = theHRCanvas.style.width;
	gameDiv.style.height = theHRCanvas.style.height;
	gameDiv.style.display = 'block'; // Restore displaying
}

function resizeHRCanvasSlashieBC () {
	if (!theHRCanvas) {
		return;
	}
	const gameDiv = document.getElementById('cutscene');
	const aspectRatio = theHRCanvas.height / theHRCanvas.width;
	let gameCanvasHeight;
	
	const paddingLeft = Math.floor(innerWidth * 0.195);
	const paddingRight = paddingLeft;
	const paddingTotal = paddingLeft + paddingRight;

	gameCanvasHeight = (innerWidth - paddingTotal )* aspectRatio;

	const paddingTop = gameCanvasHeight * 0.25;
	theHRCanvas.style.width = (innerWidth - paddingTotal) + "px";
	theHRCanvas.style.height = `${gameCanvasHeight}px`; 
	gameDiv.style.paddingTop = `${paddingTop}px`;
	
	gameDiv.style.width = theHRCanvas.style.width;
	gameDiv.style.height = theHRCanvas.style.height;

}

window.addEventListener("resize", resizeHRCanvas);

export default {
	init: async function(game) {
		this.game = game;
		let width = 1024;
		let height = 768;
		const aspectRatio = height / width;
		this.lores = false;
		if (innerWidth * aspectRatio <= innerHeight && useGBC) {
			width = 160;
			height = 144;
			this.lores = true;
		}


		const app = new Application<HTMLCanvasElement>({
			width,
			height,
			backgroundColor: 0x0000
		})
		document.getElementById('cutscene').appendChild(app.view);
		theHRCanvas = app.view;
		theHRCanvas.style.imageRendering = this.lores ? 'pixelated' : 'auto';
		this.texturesMap = [];
		const images = [ // TODO: Use alternate images for lores
		];
		this.scenes = [];
		for (let i = 0; i < images.length; i++) {
			this.texturesMap.push(await Assets.load(images[i]));
		}
		const titleScreenContainer = new Container();
		this.titleScreenContainer = titleScreenContainer;
		app.stage.addChild(titleScreenContainer);
		this.cutsceneSprite = titleScreenContainer.addChild(new Sprite());
		const slidesAR = 1024 / 576;
		this.cutsceneSprite.width = width;
		this.cutsceneSprite.height = width / slidesAR;
		this.cutsceneSprite.interactive = true;
		this.cutsceneSprite.on('pointerdown', (event) => { this.nextSlide(); });


		this.cutsceneText = titleScreenContainer.addChild(PixiUtils.createTextBox(100, 620, 128, 0xffffff,
			'', 800 * 4,
			'cutsceneFont', 'center'));

		this.components = {};	
		this.initDialogWindow();
		resizeHRCanvas();
	},
	initDialogWindow () {
		const container = new Container();
		this.titleScreenContainer.addChild(container);
		this.components.dialogWindow = {};
		container.visible = false;
		this.components.dialogWindow.container = container;
		const frame = new PIXIFrame(0, 88, 160, 144 - 88, 16, this.game.display.tilesets.ui.textureMap, this.game.display.config.windowTiles.tiles);
		container.addChild(frame.container);
		this.components.dialogWindow.text = container.addChild(PixiUtils.createTextBox(8, 88 + 6, this.game.display.config.textboxFontSize, this.game.display.config.textColor, "", (160 - 16) * 4));
	},
	show (index: number, after: ()=>{}) {
		document.getElementById('cutscene').style.display = 'block';
		this.currentIndex = -1;
		this.currentScene = index;
		this.after = after;
		this.nextSlide();
	},
	skip () {
		this.after();
	},
	nextSlide () {
		this.currentIndex++;
		if (this.currentIndex >= this.scenes[this.currentScene].length) {
			this.after();
			return;
		}
		const fragment = this.scenes[this.currentScene][this.currentIndex];
		this.cutsceneSprite.texture = this.texturesMap[fragment.image];
		if (this.lores) {
			this.components.dialogWindow.container.visible = true;
			this.components.dialogWindow.text.text = Loc.loc(fragment.text, { mainButton: this.game.input.getButtonAName() });;
		} else {
			this.cutsceneText.text = Loc.loc(fragment.text, { mainButton: this.game.input.getButtonAName() });;
		}
	},
	hide () {
		document.getElementById('cutscene').style.display = 'none';
	}
}
