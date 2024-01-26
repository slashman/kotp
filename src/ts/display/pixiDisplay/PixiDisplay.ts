/**
 * Implements the Display interface using pixi.js to display the
 * level around the player using sprites and the UI using 
 * text components (including TTF fonts) laid over the map.
 * 
 */

import { Application, Assets, Texture, Rectangle, Sprite, Text, Container, AnimatedSprite } from 'pixi.js';
import ItemsData from '../../data/Items.data';
import Loc from '../../loc/Loc';
import Being from '../../model/Being.class';
import Item from '../../model/Item.class';
import Level from '../../model/Level.class';
import IPosition from '../../model/Position';
import { PIXIFrame } from './PIXIFrame.class';
import PIXIGrid from './PIXIGrid.class';
import PixiUtils from './PixiUtils';
const TWEEN = require('@tweenjs/tween.js');


let theCanvas;

const DEBUG_TWEEN_TIME_SCALE = 1;
const LOWER_BAR_HEIGHT = 16;
let frameDisabled = false;

function resizeCanvas () {
	if (!theCanvas) {
		return;
	}
	
	const aspectRatio = theCanvas.height / theCanvas.width;
	if (innerWidth * aspectRatio <= innerHeight) {
		resizeCanvasSlashieBC();
		document.getElementById('tvFrame').style.display = 'none';
	} else {
		resizeCanvasFull();
		document.getElementById('mobileFrame').style.display = 'none';
		document.getElementById('game').style.paddingTop = "0px";
		if (!frameDisabled) {
			document.getElementById('tvFrame').style.display = 'block';
		}
	}
}

function resizeCanvasFull () {
	if (!theCanvas) {
		return;
	}
	const padding = 0;
	const gameDiv = document.getElementById('game');
	const aspectRatio = theCanvas.height / theCanvas.width;
	if (innerWidth * aspectRatio <= innerHeight) {
		theCanvas.style.width = Math.floor((innerWidth - padding) * 1.167) + "px"; 
		theCanvas.style.height = (innerWidth * aspectRatio - padding) + "px";
	} else {
		theCanvas.style.width = Math.floor((innerHeight * 1/aspectRatio - padding) * 1.167)+ "px"; 
		theCanvas.style.height = (innerHeight - padding) + "px";
	}
	gameDiv.style.width = theCanvas.style.width;
	gameDiv.style.height = theCanvas.style.height;
}

function resizeCanvasSlashieBC () {
	if (!theCanvas) {
		return;
	}
	const gameDiv = document.getElementById('game');
	const aspectRatio = theCanvas.height / theCanvas.width;
	let gameCanvasHeight;
	if (innerWidth * aspectRatio <= innerHeight) {
		// Portrait
		const paddingLeft = Math.floor(innerWidth * 0.195);
		const paddingRight = paddingLeft;
		const paddingTotal = paddingLeft + paddingRight;

		gameCanvasHeight = (innerWidth - paddingTotal )* aspectRatio;

		const paddingTop = gameCanvasHeight * 0.25;
		theCanvas.style.width = (innerWidth - paddingTotal) + "px";
		theCanvas.style.height = `${gameCanvasHeight}px`; 
		gameDiv.style.paddingTop = `${paddingTop}px`;
	} else {
		// Landscape
		const paddingTop = Math.floor(innerHeight * 0.17857142);
		const paddingBottom = paddingTop;
		const paddingTotal = paddingTop + paddingBottom;
		theCanvas.style.width = ((innerHeight - paddingTotal) * 1/aspectRatio)+ "px"; 
		theCanvas.style.height = (innerHeight - paddingTotal) + "px";
		
		gameDiv.style.paddingTop = `${paddingTop}px`;
	}
	gameDiv.style.width = theCanvas.style.width;
	gameDiv.style.height = theCanvas.style.height;

	const oframe = document.getElementById('tvFrame');
	oframe.style.display = 'none';

	const frame = document.getElementById('mobileFrame');
	frame.style.display = 'block';
	frame.style.height = `${innerHeight}px`;
	frame.style.width = `${innerWidth}px`;
	frame.style.backgroundImage = 'url(./assets/hires/slashieboy.jpg)';
	frame.style.imageRendering = "auto";
	frame.style.backgroundSize = '100%';

	// Reloc buttons
	Object.keys(buttonLocs).forEach(key => {
		const specs = buttonLocs[key];
		document.getElementById(key).style.top = `${(innerWidth * specs.top)}px`;
		document.getElementById(key).style.left = `${(innerWidth * specs.left)}px`;
		document.getElementById(key).style.width = `${(innerWidth * specs.width)}px`;
		document.getElementById(key).style.height = `${(innerWidth * specs.height)}px`;
	})
}

const buttonLocs = {
	button7: {
		top: 0.93,
		left: 0.08,
		width: 0.1,
		height: 0.1
	},
	button8: {
		top: 0.93,
		left: 0.18,
		width: 0.1,
		height: 0.1
	},
	button9: {
		top: 0.93,
		left: 0.28,
		width: 0.1,
		height: 0.1
	},
	button4: {
		top: 1.03,
		left: 0.08,
		width: 0.1,
		height: 0.1
	},
	button1: {
		top: 1.13,
		left: 0.08,
		width: 0.1,
		height: 0.1
	},
	button2: {
		top: 1.13,
		left: 0.18,
		width: 0.1,
		height: 0.1
	},
	button6: {
		top: 1.03,
		left: 0.28,
		width: 0.1,
		height: 0.1
	},
	button3: {
		top: 1.13,
		left: 0.28,
		width: 0.1,
		height: 0.1
	},
	buttonA: {
		top: 1.0,
		left: 0.77,
		width: 0.15,
		height: 0.15
	},
	buttonB: {
		top: 1.05,
		left: 0.57,
		width: 0.15,
		height: 0.15
	},
	buttonStart: {
		top: 1.3,
		left: 0.5,
		width: 0.2,
		height: 0.15
	},
	buttonSelect: {
		top: 1.3,
		left: 0.3,
		width: 0.2,
		height: 0.15
	},
}

window.addEventListener("resize", resizeCanvas);

// Setup the animation loop.
function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}
requestAnimationFrame(animate);

export default {
	init: async function(game, config) {
		this.textureMap = {};
		this.components = {}
		this.game = game;
		const app = new Application<HTMLCanvasElement>({
			width: config.canvasWidth,
			height: config.canvasHeight,
			backgroundColor: 0x111111
		})
		document.getElementById('game').appendChild(app.view);
		theCanvas = app.view;
		theCanvas.style.imageRendering = 'pixelated';
		this.config = config;

		this.visibleBeings = [];

		this.tilesets = {};
		for (let i = 0; i < config.tilesets.length; i++) {
			const tilesetData = config.tilesets[i];
			const tileset = {
				textureMap: {},
				offsetX: tilesetData.offsetX,
				offsetY: tilesetData.offsetY,
			};
			const texture = await Assets.load(tilesetData.file);
			const tileSizeX = tilesetData.tileSizeX;
			const tileSizeY = tilesetData.tileSizeY;
			for (let x = 0; x < tilesetData.tilesetCountX; x++) {
				for (let y = 0; y < tilesetData.tilesetCountY; y++) {
					const spriteTexture = new Texture(
						texture,
						new Rectangle(x * tileSizeX, y * tileSizeY, tileSizeX, tileSizeY)
					);
					tileset.textureMap[x+'-'+y] = spriteTexture;
				}
			}
			this.tilesets[tilesetData.id] = tileset;
		}

		this.squareCursor = this.tilesets[config.squareCursor.tileset].textureMap[config.squareCursor.index];
		this.pointyCursor = this.tilesets[config.pointyCursor.tileset].textureMap[config.pointyCursor.index];

		const mainGameContainer = new Container();
		this.mainGameContainer = mainGameContainer;
		app.stage.addChild(mainGameContainer);
		mainGameContainer.visible = true;

		this.inGameContainer = new Container();
		this.mainGameContainer.addChild(this.inGameContainer);
		this.inGameContainer.visible = false;

		this.viewportContainer = new Container();
		this.inGameContainer.addChild(this.viewportContainer);

		this.tileLayers = [
			[], // Terrain
			[] // Items
		];
		const offsetX = Math.floor((config.viewportCountX * config.baseTileSize - config.canvasWidth) / 2);
		const offsetY = Math.floor((config.viewportCountY * config.baseTileSize - config.canvasHeight + LOWER_BAR_HEIGHT) / 2);
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		for (let l = 0; l < 2; l++) {
			for (let y = 0; y < config.viewportCountY + 1; y++) {
				for (let x = 0; x < config.viewportCountX + 1; x++) {
					const sprite = new Sprite(this.tilesets.main.textureMap['27-20']);
					this.viewportContainer.addChild(sprite);
					this.tileLayers[l][x+'-'+y] = sprite;
					sprite.position.x = x * config.baseTileSize - offsetX;
					sprite.position.y = y * config.baseTileSize - offsetY;
				}
			}
		}

		this.semiViewportCountX = Math.floor(config.viewportCountX / 2);
		this.semiViewportCountY = Math.floor(config.viewportCountY / 2);

		//this.inGameContainer.addChild(this.playerSprite);

		/*const hudSprite = this.inGameContainer.addChild(new Sprite(Texture.WHITE));
		hudSprite.tint = 0xabb3a3;
		hudSprite.position.x = 0;
		hudSprite.position.y = 128;
		hudSprite.width = 160;

		this.statusText = this.inGameContainer.addChild(PixiUtils.createTextBox(72, 128 + 3, config.textboxFontSize, config.textColor, ''));

		const heartSprite = this.inGameContainer.addChild(new Sprite(this.tilesets.ui.textureMap['0-3']));
		heartSprite.position.x = 0;
		heartSprite.position.y = 128;
		this.woundsText = this.inGameContainer.addChild(PixiUtils.createTextBox(16, 128 + 3, config.textboxFontSize, config.textColor, ''));

		const gutsSprite = this.inGameContainer.addChild(new Sprite(this.tilesets.ui.textureMap['1-3']));
		gutsSprite.position.x = 24;
		gutsSprite.position.y = 128;
		this.gutsText = this.inGameContainer.addChild(PixiUtils.createTextBox(24 + 16, 3 + 128, config.textboxFontSize, config.textColor, ''));
		*/

		await this.initTitleScreen();
		this.initInventoryWindow();
		this.initDialogWindow();
		this.initHelpWindow();
		this.initLanguageSelection();
		resizeCanvas();
	},
	async initTitleScreen () {
		this.components.titleScreen = {};

		const container = new Container();
		this.mainGameContainer.addChild(container);
		container.visible = false;
		this.components.titleScreen.mainContainer = container;

		container.addChild(PixiUtils.createTextBox(70, 80, this.config.textboxFontSize, this.config.textColor, "Knights of the Pun"));

		container.addChild(PixiUtils.createTextBox(80, 200, this.config.textboxFontSize, this.config.textColor, "Copyright 2024"));
		container.addChild(PixiUtils.createTextBox(60, 208, this.config.textboxFontSize, this.config.textColor, "Slashware Interactive"));
		container.addChild(PixiUtils.createTextBox(100, 216, this.config.textboxFontSize, this.config.textColor, "GGJ24"));

		const optionsContainer = new Container();
		container.addChild(optionsContainer);
		this.components.titleScreen.optionsContainer = optionsContainer;

		Loc.registerTextComponent(
			optionsContainer.addChild(PixiUtils.createTextBox(12 * 8, 16 * 8 + 2, this.config.textboxFontSize, this.config.textColor, "", 154 * 4)),
			"title.newGame"
		);

		Loc.registerTextComponent(
			optionsContainer.addChild(PixiUtils.createTextBox(12 * 8, 18 * 8 + 2, this.config.textboxFontSize, this.config.textColor, "", 154 * 4)),
			"title.continue"
		);

		this.components.titleScreen.cursor = optionsContainer.addChild(new Sprite(this.pointyCursor));
		this.components.titleScreen.cursor.position.x = 10 * 8 - 4;
		this.components.titleScreen.cursor.position.y = 16 * 8;
	
	},
	initDialogWindow () {
		const container = new Container();
		this.mainGameContainer.addChild(container);
		this.components.dialogWindow = {};
		container.visible = false;
		this.components.dialogWindow.container = container;
		const frame = new PIXIFrame(32, 16, 240 - 8 * 4, 8 * 8, 16, this.tilesets.ui.textureMap, this.config.windowTiles.tiles);
		container.addChild(frame.container);
		this.components.dialogWindow.text = container.addChild(PixiUtils.createTextBox(32 + 8, 16 + 8, this.config.textboxFontSize, this.config.textColor, "", (240 - 32) * 4));
	},
	initInventoryWindow () {
		const recipesContainer = new Container();
		this.mainGameContainer.addChild(recipesContainer);
		this.components.recipesWindow = {};
		recipesContainer.visible = false;
		this.components.recipesWindow.mainContainer = recipesContainer;
		const recipesFrame = new PIXIFrame(0, 0, 160, 144, 16, this.tilesets.ui.textureMap, this.config.windowTiles.tiles);
		recipesContainer.addChild(recipesFrame.container);
		const recipesGrid = new PIXIGrid(8, 8, 7, 5, 20, 20, this.squareCursor);
		this.components.recipesWindow.grid = recipesGrid;
		recipesContainer.addChild(recipesGrid.container);
		this.components.recipesWindow.selectedItemName = recipesContainer.addChild(PixiUtils.createTextBox(8, 4 * 24 - 4, this.config.textboxFontSize, this.config.textColor, "", (160 - 16) * 4));
	},
	initHelpWindow () {
		const container = new Container();
		this.mainGameContainer.addChild(container);
		this.components.helpWindow = {};
		container.visible = false;
		this.components.helpWindow.mainContainer = container;
		const frame = new PIXIFrame(0, 0, 160, 144, 16, this.tilesets.ui.textureMap, this.config.windowTiles.tiles);
		container.addChild(frame.container);
		this.components.helpWindow.textBox = container.addChild(PixiUtils.createTextBox(8, 8, this.config.textboxFontSize, this.config.textColor, "", (160 - 16) * 4));
	},
	initLanguageSelection () {
		this.languageIndex = 0;
		const container = new Container();
		this.mainGameContainer.addChild(container);
		this.components.languageSelection = {};
		container.visible = false;
		this.components.languageSelection.mainContainer = container;
		this.components.languageSelection.cursor = container.addChild(new Sprite(this.pointyCursor));
		this.components.languageSelection.cursor.position.x = 24;
		this.components.languageSelection.cursor.position.y = 4 * 16;
		container.addChild(PixiUtils.createTextBox(60, 4 * 16 + 4, this.config.textboxFontSize, this.config.textColor, "English", (160 - 16) * 4));
		container.addChild(PixiUtils.createTextBox(60, 5.5 * 16 + 4, this.config.textboxFontSize, this.config.textColor, "Español", (160 - 16) * 4));
		const englishFlag = container.addChild(new Sprite(this.tilesets.slashie.textureMap['10-1']));
		englishFlag.position.x = 40;
		englishFlag.position.y = 4*16;
		const spanishFlag = container.addChild(new Sprite(this.tilesets.slashie.textureMap['11-1']));
		spanishFlag.position.x = 40;
		spanishFlag.position.y = 5.5*16;
	},
	showTips () {
		this.components.helpWindow.textBox.text = Loc.loc('help.tips');
	},
	displayStore (inventory: any[]) {
		this.components.recipesWindow.grid.resetSelection();
		this.components.recipesWindow.mainContainer.visible = true;
		const listData = inventory.map((itemDef: any) => ({
			dataItem: itemDef,
			renderData: this.getMenuRenderData(itemDef)
		}));
		this.components.recipesWindow.grid.setData(listData);
		this.components.recipesWindow.grid.onBrowse = (itemDef: any) => this.showItemInfo(itemDef, true);
		this.components.recipesWindow.grid.update();
		this.components.recipesWindow.grid.emitSelection();
		this.inventoryMode = 'BUY';
	},
	showInventory () {
		this.components.recipesWindow.grid.resetSelection();
		this.components.recipesWindow.mainContainer.visible = true;
		const player = this.game.world.level.player;
		const listData = player.items.map((item: Item) => ({
			dataItem: item,
			renderData: this.getMenuRenderData(item.def)
		}));
		listData.unshift({
			dataItem: {
				def: ItemsData.COIN
			},
			renderData: {
				texture: this.tilesets.main.textureMap[ItemsData.COIN.tilesetData],
				offsetX: 0,
				offsetY: 0
			}
		});
		listData.unshift({
			dataItem: {
				def: ItemsData.ESCAPE_PRAYER
			},
			renderData: {
				texture: this.tilesets.main.textureMap[ItemsData.ESCAPE_PRAYER.tilesetData],
				offsetX: 0,
				offsetY: 0
			}
		});
		listData.unshift({
			dataItem: {
				def: ItemsData.CARRIEL
			},
			renderData: {
				texture: this.tilesets.main.textureMap[ItemsData.CARRIEL.tilesetData],
				offsetX: 0,
				offsetY: 0
			}
		});
		listData.unshift({
			dataItem: {
				def: ItemsData.RUANA
			},
			renderData: {
				texture: this.tilesets.main.textureMap[ItemsData.RUANA.tilesetData],
				offsetX: 0,
				offsetY: 0
			}
		});
		listData.unshift({
			dataItem: {
				def: ItemsData.MACHETE
			},
			renderData: {
				texture: this.tilesets.main.textureMap[ItemsData.MACHETE.tilesetData],
				offsetX: 0,
				offsetY: 0
			}
		});
		this.components.recipesWindow.grid.setData(listData);
		this.components.recipesWindow.grid.onBrowse = (item: Item) => this.showItemInfo(item.def);
		this.components.recipesWindow.grid.update();
		this.components.recipesWindow.grid.emitSelection();
		this.inventoryMode = 'USE';
	},
	moveInventory (moveDir) {
		this.components.recipesWindow.grid.moveCursor(moveDir);
	},
	hideInventory () {
		this.game.audio.playSfx("ui_inventory_close");
		this.components.recipesWindow.mainContainer.visible = false;
	},
	getMenuRenderData (itemDef: any) {
		return {
			texture: this.tilesets.main.textureMap[itemDef.tilesetData],
			offsetX: 0,
			offsetY: 0
		}
	},
	showItemInfo  (itemDef: any, selling: boolean) {
		if (selling) {
			this.components.recipesWindow.selectedItemName.position.y = 2 * 24 - 4;
		} else {
			this.components.recipesWindow.selectedItemName.position.y = 4 * 24 - 4;
		}
		if (itemDef === ItemsData.MACHETE) {
			this.components.recipesWindow.selectedItemName.text =
				(this.game.player.holyMachete ? `${Loc.loc("items.machete.blessedPrefix")} ` : '') +
				Loc.loc(itemDef.name) + '\n---\n' +
				(itemDef.description ? Loc.loc(itemDef.description) : '') + 
				`\n${Loc.loc("items.level", this.game.player.macheteLevel)} [${Loc.loc("items.attack", this.game.player.getMacheteDamage())}]`;
		} else if (itemDef === ItemsData.RUANA) {
			this.components.recipesWindow.selectedItemName.text = 
				Loc.loc(itemDef.name) + '\n---\n' +
				(itemDef.description ? Loc.loc(itemDef.description) : '') + 
				`\n${Loc.loc("items.level", this.game.player.ruanaLevel)} [${Loc.loc("items.evade",this.game.player.getEvadeChance())}]`;
		} else if (itemDef === ItemsData.CARRIEL) {
			this.components.recipesWindow.selectedItemName.text = 
				Loc.loc(itemDef.name) + '\n---\n' +
				(itemDef.description ? Loc.loc(itemDef.description) : '') + 
				`\n${Loc.loc("items.level", this.game.player.carrielLevel)} [${Loc.loc("items.carry", this.game.player.getCarryCapacity())}]`;
		} else if (itemDef === ItemsData.COIN) {
			this.components.recipesWindow.selectedItemName.text = 
				Loc.loc(itemDef.name) + '\n---\n' +
				(itemDef.description ? Loc.loc(itemDef.description) : '') + 
				`\n${this.game.player.money}$`;
		} else {
			this.components.recipesWindow.selectedItemName.text =
				Loc.loc(itemDef.name) +
				` ${(selling || itemDef.treasure)? `[${itemDef.goldValue}$]` : ``}\n---${itemDef.effectDescription ? ` (${Loc.loc(itemDef.effectDescription)})` : ''}\n` +
				(selling ? '\n' : '') +
				(itemDef.description ? Loc.loc(itemDef.description) : '');
		}
		if (selling) {
			this.components.recipesWindow.selectedItemName.text += `\n\n ${Loc.loc("items.currentMoney", this.game.player.money)}\n\n `;
			if (this.isMobile()) {
				this.components.recipesWindow.selectedItemName.text += Loc.loc('ui.buyPrompt.mobile');
			} else {
				this.components.recipesWindow.selectedItemName.text += Loc.loc('ui.buyPrompt.desktop');
			}
		}
	},
	getSelectedItem(): Item {
		this.game.audio.playSfx("ui_select");
		return this.components.recipesWindow.grid.getSelected();
	},
	getTerrainAppearance: function(x: number, y: number) {
		var level = this.game.world.level;
		var xr = x - level.player.x;
		var yr = y - level.player.y;
		if (level.player.canSee(xr, yr)){
			if (level.map[x] && level.map[x][y]){
				const tile = level.map[x][y];
				const tileset = this.tilesets[tile.tileset];
				return {
					coords: tile.coord[0] + '-' + tile.coord[1],
					tileset: tile.tileset,
					offsetX: tileset.offsetX,
					offsetY: tileset.offsetY,
				}
			} else {
				return null;
			}
		}/* else if (level.player.remembers(x, y)){
			if (level.map[x] && level.map[x][y]){
				return {
					tilesetData: level.map[x][y].coord[0] + '-' + level.map[x][y].coord[1],
					variation: 'outOfSight'
				}
			} else {
				return null;
			}
		}*/ else {
			return null;
		}
	},
	getItem: function(x: number, y: number) {
		var level = this.game.world.level;
		var xr = x - level.player.x;
		var yr = y - level.player.y;
		if (level.player.canSee(xr, yr)){
			if (level.items[x] && level.items[x][y]){
				return level.items[x][y].def.tilesetData;
			} else {
				return null;
			}
		} else {
			return null;
		}
	},
	async scroll (dx: number, dy: number, time: number): Promise<void> {
		const originalX = this.viewportContainer.position.x;
		const originalY = this.viewportContainer.position.y;
		await new Promise<void>(resolve => {
			new TWEEN.Tween(this.viewportContainer.position).to(
			{ y: originalY - dy * 16,
			x: originalX - dx * 16}, time * DEBUG_TWEEN_TIME_SCALE ).easing(TWEEN.Easing.Linear.None)
			.onUpdate((position) => {
				position.x = Math.floor(position.x);
				position.y = Math.floor(position.y);
			})
			.onComplete(() => {
				resolve();
			})
			.start();
		});
		this.viewportContainer.position.x = originalX;
		this.viewportContainer.position.y = originalY;
	},
	refresh: function() {
		this.visibleBeings.forEach(being => being.sprite.visible = false);
		this.visibleBeings = [];
		const player = this.game.world.level.player;
		player.sprite.position.x = Math.floor(this.config.canvasWidth / 2);
		player.sprite.position.y = Math.floor((this.config.canvasHeight - LOWER_BAR_HEIGHT) / 2);
		this.viewportContainer.position.x = 0;
		this.viewportContainer.position.y = 0;
		const noTexture = this.tilesets.slashie.textureMap['1-5'];
		const oosTexture = this.game.world.level.id === 'overworld' ? this.tilesets.slashie.textureMap['0-5'] : this.tilesets.slashie.textureMap['2-5'];
		for (var x = -this.semiViewportCountX; x <= this.semiViewportCountX; x++) {
			for (var y = -this.semiViewportCountY; y <= this.semiViewportCountY; y++) {
				const mapX = player.x + x;
				const mapY = player.y + y;
				// Render items and terrain
				const item = this.getItem(mapX, mapY);
				const terrainAppearance = this.getTerrainAppearance(mapX, mapY);
				const itemTexture = item ? this.tilesets.main.textureMap[item] : noTexture;
				const terrainTexture = terrainAppearance ? this.tilesets[terrainAppearance.tileset].textureMap[terrainAppearance.coords] : oosTexture;
				const index = (x+this.semiViewportCountX)+'-'+(y+this.semiViewportCountY);
				this.tileLayers[0][index].texture = terrainTexture;
				if (terrainAppearance) {
					this.tileLayers[0][index].position.x = (x + this.semiViewportCountX) * this.config.baseTileSize - this.offsetX + terrainAppearance.offsetX;
					this.tileLayers[0][index].position.y = (y + this.semiViewportCountY) * this.config.baseTileSize - this.offsetY + terrainAppearance.offsetY;
					if (terrainAppearance.variation === 'outOfSight') {
						this.tileLayers[0][index].tint = 0x000055;
					} else {
						this.tileLayers[0][index].tint = 0xFFFFFF;
					}
				} else {
					this.tileLayers[0][index].position.x = (x + this.semiViewportCountX) * this.config.baseTileSize - this.offsetX;
					this.tileLayers[0][index].position.y = (y + this.semiViewportCountY) * this.config.baseTileSize - this.offsetY;
				}
				this.tileLayers[1][index].texture = itemTexture;
				// 
				const being = terrainAppearance ? this.game.world.level.getBeing(mapX, mapY) : null;
				if (being) {
					being.sprite.visible = true;
					if (!being.isMoving) {
						being.sprite.position.x = player.sprite.position.x + x * 16 + being.spriteOffsetX;
						being.sprite.position.y = player.sprite.position.y + y * 16 + being.spriteOffsetY;
					}
					this.visibleBeings.push(being);
				}
			}
		}
		/*
		this.woundsText.text = player.hp.current;
		this.gutsText.text = player.guts.current;*/
	},
	getRenderDataFromApp(app: any) {
		const tileset = this.tilesets[app.tileset];
		return {
			texture: tileset.textureMap[app.coord],
			offsetX: tileset.offsetX,
			offsetY: tileset.offsetY,
		}
	},
	renderTile(layer: number, screenX: number, screenY: number, coord: string, renderData) {
		const sprite = this.tileLayers[layer][coord];
		if (!renderData) {
			sprite.visible = false;
			return;
		}
		sprite.visible = true;
		sprite.texture = renderData.texture;
		const baseX = screenX * this.config.baseTileSize;
		const baseY = screenY * this.config.baseTileSize;
		sprite.position.x = baseX + renderData.offsetX - this.offsetX;
		sprite.position.y = baseY + renderData.offsetY - this.offsetY;
	},
	message: function(str: string) {
		//this.showText(str);
	},
	showText (text: string) {
		// this.statusText.text = text;
	},
	hideDialog() {
		this.components.dialogWindow.container.visible = false;
	},
	showDialogs (texts: string[], cb: () => {}) {
		this.game.audio.playSfx("ui_dialogue");
		this.dialogChain = texts;
		this.dialogChainIndex = -1;
		this.dialogChainCallback = cb;
		this.nextDialogChain();
	},
	nextDialogChain () {
		this.dialogChainIndex ++;
		if (this.dialogChainIndex == this.dialogChain.length - 1) {
			this.showDialog(this.dialogChain[this.dialogChainIndex], this.dialogChainCallback);
		} else {
			this.showDialog(this.dialogChain[this.dialogChainIndex], () => this.nextDialogChain());
		}
	},
	showDialog (text: string, cb: () => {}) {
		this.components.dialogWindow.container.visible = true;
		this.components.dialogWindow.text.text = text;
		this.game.input.mode = 'DIALOG';
		this.game.input.inputEnabled = true;
		this.game.input.dialogCallback = cb;
	},
	displayTitleScreen() {
		this.components.titleScreen.mainContainer.visible = true;
		this.titleIndex = 0;
	},
	hideTitleScreen() {
		this.components.titleScreen.mainContainer.visible = false;
	},
	showFloatingText(worldX: number, worldY: number, text: string, color: number) {
		const player = this.game.world.level.player;
		const x = (this.semiViewportCountX + worldX - player.x) * 16 - this.offsetX;
		const y = (this.semiViewportCountY + worldY - player.y) * 16 - this.offsetY;
		const floatingText = this.mainGameContainer.addChild(PixiUtils.createTextBox(x, y, this.config.textboxFontSize, color, text));
		new TWEEN.Tween(floatingText.position).to( {y: y - 8}, 250 ).easing(TWEEN.Easing.Quadratic.Out).start();
		setTimeout(() => new TWEEN.Tween(floatingText).to( {alpha: 0}, 500 ).start(), 250);
	},
	hide () : void {
		/*document.getElementById('tvFrame').style.display = 'none';
		document.getElementById('game').style.display = 'none';*/
	},
	show () : void {
		/*document.getElementById('tvFrame').style.display = 'block';
		document.getElementById('game').style.display = 'block';*/
	},
	showHelp (): void {
		this.components.helpWindow.textBox.text = this.isMobile() ? Loc.loc('help.mobile') : Loc.loc('help.desktop');
		this.components.helpWindow.mainContainer.visible = true;
	},
	hideHelp (): void {
		this.components.helpWindow.mainContainer.visible = false;
	},
	async moveBeing (being: Being, dx: number, dy: number): Promise<void> {
		return this.moveSprite(being.sprite, dx, dy, 290);
	},

	async moveSprite (sprite: Sprite, dx: number, dy: number, time: number): Promise<void> {
		return new Promise<void>(resolve => {
			new TWEEN.Tween(sprite.position).to(
				{
					x: sprite.position.x + dx * 16,
					y: sprite.position.y + dy * 16
				},
				time * DEBUG_TWEEN_TIME_SCALE
			)
			.easing(TWEEN.Easing.Linear.None)
			.onComplete(() => resolve())
			.onUpdate((position) => {
				position.x = Math.floor(position.x);
				position.y = Math.floor(position.y);
			}).start();
		});
	},


	async springBeing (being: Being, dx: number, dy: number, edgeAction: () => Promise<void>): Promise<void> {
		const player = this.game.world.level.player;
		var xr = being.x + dx - player.x;
		var yr = being.y + dy - player.y;
		if (player.canSee(xr, yr, true)){	
			return this.springSprite(being.sprite, dx, dy, being.spriteOffsetX, being.spriteOffsetY, being.x, being.y, edgeAction);
		}
	},
	async springPlayer (dx: number, dy: number, edgeAction: () => Promise<void>): Promise<void> {
		const player = this.game.world.level.player;
		return this.springSprite(player.sprite, dx, dy, 0, 0, player.x, player.y, edgeAction);
	},
	async springSprite (sprite: Sprite, dx: number, dy: number, offsetX: number, offsetY: number, fromMapX: number, fromMapY: number, edgeAction: () => Promise<void>): Promise<void> {
		const player = this.game.world.level.player;
		const originalPlayerX = player.x;
		const originalPlayerY = player.y;
		const originalPlayerSpriteX = player.sprite.position.x;
		const originalPlayerSpriteY = player.sprite.position.y;
		await new Promise<void>((resolve) => {
			new TWEEN.Tween(sprite.position).to(
				{
					x: sprite.position.x + dx * 8,
					y: sprite.position.y + dy * 8
				},
				200 * DEBUG_TWEEN_TIME_SCALE
			)
			.easing(TWEEN.Easing.Linear.None)
			.onComplete(() => resolve())
			.onUpdate((position) => {
				position.x = Math.floor(position.x);
				position.y = Math.floor(position.y);
			})
			.start();
		});
		const floatingX = sprite.position.x;
		const floatingY = sprite.position.y;
		await edgeAction();
		// The player position may have changed due to dodge or something

		// Relocate the sprite
		const viewportDiffX = originalPlayerX - player.x;
		const viewportDiffY = originalPlayerY - player.y;
		sprite.position.x = floatingX + viewportDiffX * 16;
		sprite.position.y = floatingY + viewportDiffY * 16;
		
		// Calculate new destination
		const screenX = fromMapX - player.x;
		const screenY = fromMapY - player.y;
		return new Promise<void>((resolve) => {
			new TWEEN.Tween(sprite.position).to(
				{
					x: originalPlayerSpriteX + screenX * 16 + offsetX,
					y: originalPlayerSpriteY + screenY * 16 + offsetY,
				},
				150 * DEBUG_TWEEN_TIME_SCALE
			).easing(TWEEN.Easing.Linear.None)
			.onComplete(() => resolve())
			.onUpdate((position) => {
				position.x = Math.floor(position.x);
				position.y = Math.floor(position.y);
			})
			.start();
		});
	},
	waitPromise (millis) {
		return new Promise<void>(resolve => setTimeout(() => resolve(), millis));
	},
	createSprite (tilesetName: string, coord: string) {
		const sprite = new Sprite(this.tilesets[tilesetName].textureMap[coord]);
		this.viewportContainer.addChild(sprite); // TODO: Ask for the container?
		return sprite;
	},
	getTextures (tilesetName: string, coords: string[]) {
		return coords.map(coord => this.tilesets[tilesetName].textureMap[coord]);
	},
	createAnimatedSprite(player: true,textures: Texture[]) {
		const sprite = new AnimatedSprite(textures);
		if (player) {
			this.inGameContainer.addChild(sprite); // TODO: Ask for the container?
		} else {
			this.viewportContainer.addChild(sprite); // TODO: Ask for the container?
		}
		sprite.animationSpeed = 1 / 8;
		return sprite;
	},
	isMobile () {
		return innerWidth <= innerHeight;
	},
	showLanguageSelection (): void {
		this.components.languageSelection.mainContainer.visible = true;
	},
	hideLanguageSelection (): void {
		this.components.languageSelection.mainContainer.visible = false;
	},
	moveLanguage (moveDir) {
		this.languageIndex += moveDir.y;
		if (this.languageIndex < 0) {
			this.languageIndex = 0;
		}
		if (this.languageIndex > 1) {
			this.languageIndex = 1;
		}
		this.components.languageSelection.cursor.position.y = (4 + this.languageIndex * 1.5) * 16;
	},
	showTitleOptions () {
		this.components.titleScreen.optionsContainer.visible = true;
	},
	moveTitleOption (moveDir: IPosition): void {
		this.titleIndex += moveDir.y;
		if (this.titleIndex < 0) {
			this.titleIndex = 0;
		}
		if (this.titleIndex > 1) {
			this.titleIndex = 1;
		}
		this.components.titleScreen.cursor.position.y = 16 * 8 + this.titleIndex * 16;
	},
	selectTitleOption (): void {
		if (this.titleIndex === 0) {
			this.game.newGameSelected();
		} else {
			this.game.continueGameSelected();
		}
	},

	activateViewport () {
		this.inGameContainer.visible = true;
	}
}
