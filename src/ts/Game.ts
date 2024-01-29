/**
 * Single object that controls the initialization of the 
 * game and serves as a container for its main subsystems (Display, World, Player and Input)
 * 
 */

import PIXIDisplay from'./display/pixiDisplay/PixiDisplay';

import World from './model/World';
import Player from './model/Player';
import Input from './Input';

import Item from './model/Item.class';
import Items from './data/Items.data';
import Audio from './Audio';
import AudioTracks from './data/AudioTracks';
import TilesData from './data/Tiles.data';
import HiResDisplay from './display/pixiDisplay/HiResDisplay';
import Loc from './loc/Loc';
import Persistence from './Persistence';

const circular = require('circular-functions');

declare global {
	interface Window {
		Game: {}
	}
}

const Game = {
	start: async function(config) {
		const selectedDisplay = PIXIDisplay;
		this.display = selectedDisplay;
		this.world = new World();
		this.player = new Player();
		this.input = Input;
		this.audio = Audio;
		this.hrd = HiResDisplay;
		this.persistence = new Persistence();
		Loc.init();
		TilesData.init();
		Audio.init(this);
		AudioTracks.loadAudio(this);
		await this.display.init(this, config.displayConfig);
		await HiResDisplay.init(this);
		this.player.init(this);
		this.world.init(this);
		Input.init(this);

		circular.registerClass('Game', undefined, {
			transients: {
				display: true,
				hrd: true,
				input: true,
				audio: true,
				persistence: true,
				scenarioData: true
			},
			reviver(game) {
				game.display = selectedDisplay;
				game.hrd = HiResDisplay;
				game.input = Input;
				game.audio = Audio;
				game.persistence = new Persistence();
			}
		});

		this._c = circular.register('Game');

		this.display.show();
		//this.display.showLanguageSelection();
		//this.input.mode = 'LANGUAGE';
		this.languageSelected(0);
	},
	languageSelected (languageIndex: number) {
		Loc.setBundle(languageIndex === 0 ? 'en' : 'es');
		this.display.hideLanguageSelection();
		this.input.mode = 'TITLE';
		this.display.displayTitleScreen();
	},

	newGameSelected () {
		this.display.hideTitleScreen();
		this.display.activateViewport();
		this.newGame();
		this.input.mode = 'MOVEMENT';
	},
	continueGameSelected () {
		if (!this.persistence.hasSaveGame()) {
			this.display.showDialog(Loc.loc("save.notFound"), () => {
				this.display.hideDialog();
				this.input.mode = 'TITLE';
			});
			return;
		}

		try {
			this.persistence.loadIntoGame(this);
		} catch (e) {
			if (e.code == 'versionMismatch') {
				this.display.showDialog(Loc.loc("save.versionMismatch", e.version), () => {this.display.hideDialog(); this.input.mode = 'TITLE';});
				return;
			}
			if (e.code === 'parseError') {
				this.display.showDialog(Loc.loc("save.loadError"), () => {this.display.hideDialog(); this.input.mode = 'TITLE';});
				throw e;
			}
			throw e;
		}

		this.display.hideTitleScreen();
		// Game start
		this.display.activateViewport();

		this.player.updateFOV();
		this.display.refresh();
		this.input.mode = 'MOVEMENT';
	},
	newGame: function () {
		this.world.loadLevel('farm');
		this.player.updateFOV();
		this.display.refresh();
		[
			Items.AGUARDIENTE, Items.AGUAPANELA, Items.COFFEE
		].forEach((itemDef: any) => {
			const item = new Item();
			item.init(itemDef);
			this.player.addItem(item);
		});
	}
}

window.Game = Game;

export default Game;
