/**
 * Object representing the entirety of the world of the game.
 * Connects with LevelLoader and procedural level generators to build levels as required.
 * Contains the state of the levels generated or loaded previously.
 */

import Level from './Level.class';
import LevelLoader from '../LevelLoader';
import StygianGenerator from '../procgen/StygianGenerator';
import RacesData from '../data/Races.data';
import ItemsData from '../data/Items.data';
import Loc from '../loc/Loc';
import Player from './Player';

const circular = require('circular-functions');

// Generated from https://docs.google.com/spreadsheets/d/1ZkdQlkB8nc2Ktuyz8nclj8urzEkMVdMLjNnL8Ro40N8/edit#gid=1799448659
const levelsMetadata = {
	guacharos1: { gen: StygianGenerator, name: "Guacharos 1", depth: 1, nextLevelId: "guacharos2", enterMessage: "", chances: { lava: 100, water: 0, cavern: 80, lagoon: 0, wall_less: 50}, enemyPopulation: 5, vermin: [RacesData.VISAGE,], itemsQuantity: 6, items: [ItemsData.DONGO,ItemsData.SHOVEL,ItemsData.AXE,ItemsData.KNIFE,], gangs: [{ boss: RacesData.BAT, minions: [RacesData.BAT], quantity: 2}], features: [] },
	guacharos2: { gen: StygianGenerator, name: "Guacharos 2", depth: 2, nextLevelId: "guacharos3", enterMessage: "", chances: { lava: 0, water: 100, cavern: 80, lagoon: 10, wall_less: 10}, enemyPopulation: 10, vermin: [RacesData.MONKEY,], itemsQuantity: 6, items: [ItemsData.BANDAGE,ItemsData.DONGO,ItemsData.SHOVEL,ItemsData.AXE,ItemsData.KNIFE,ItemsData.HOLY_WATER,], gangs: [{ boss: RacesData.BAT, minions: [RacesData.BAT], quantity: 3}], features: [] },
	guacharos3: { gen: StygianGenerator, name: "Guacharos 3", depth: 3, nextLevelId: "guacharos4", enterMessage: "", chances: { lava: 20, water: 10, cavern: 20, lagoon: 10, wall_less: 80}, enemyPopulation: 10, vermin: [RacesData.MONKEY,], itemsQuantity: 6, items: [ItemsData.CHOCOLATE,ItemsData.DONGO,ItemsData.SHOVEL,ItemsData.CRUCIFIX,], gangs: [{ boss: RacesData.BAT, minions: [RacesData.BAT], quantity: 3}], features: [] },
	guacharos4: { gen: StygianGenerator, name: "Guacharos 4", depth: 4, nextLevelId: "guacharosGrotto", enterMessage: "", chances: { lava: 20, water: 10, cavern: 20, lagoon: 10, wall_less: 80}, enemyPopulation: 15, vermin: [RacesData.CAIMAN,], itemsQuantity: 6, items: [ItemsData.COFFEE,ItemsData.BANDAGE,ItemsData.DONGO,ItemsData.AXE,ItemsData.TUNJO,], gangs: [{ boss: RacesData.BAT, minions: [RacesData.BAT], quantity: 4}], features: [] },
	farashon1: { gen: StygianGenerator, name: "Farashon 1", depth: 1, nextLevelId: "farashon2", enterMessage: "", chances: { lava: 0, water: 100, cavern: 20, lagoon: 20, wall_less: 90}, enemyPopulation: 10, vermin: [RacesData.VISAGE,RacesData.MONKEY,], itemsQuantity: 6, items: [ItemsData.SHOVEL,ItemsData.AXE,ItemsData.KNIFE,], gangs: [{ boss: RacesData.GOBLIN, minions: [RacesData.VISAGE], quantity: 4}], features: [] },
	farashon2: { gen: StygianGenerator, name: "Farashon 2", depth: 2, nextLevelId: "madremonteLair", enterMessage: "", chances: { lava: 100, water: 0, cavern: 60, lagoon: 0, wall_less: 10}, enemyPopulation: 10, vermin: [RacesData.VISAGE,RacesData.MONKEY,], itemsQuantity: 6, items: [ItemsData.COFFEE,ItemsData.BANDAGE,ItemsData.SHOVEL,ItemsData.AXE,ItemsData.KNIFE,ItemsData.CRUCIFIX,], gangs: [{ boss: RacesData.GOBLIN, minions: [RacesData.MONKEY], quantity: 4}], features: [] },
	farashon3: { gen: StygianGenerator, name: "Farashon 3", depth: 3, nextLevelId: "farashon4", enterMessage: "", chances: { lava: 10, water: 50, cavern: 90, lagoon: 30, wall_less: 90}, enemyPopulation: 15, vermin: [RacesData.VISAGE,RacesData.GOBLIN,], itemsQuantity: 6, items: [ItemsData.AGUARDIENTE,ItemsData.CHOCOLATE,ItemsData.SHOVEL,ItemsData.HOLY_WATER,], gangs: [{ boss: RacesData.GOBLIN, minions: [RacesData.GOBLIN], quantity: 3}], features: [] },
	farashon4: { gen: StygianGenerator, name: "Farashon 4", depth: 4, nextLevelId: "patasolaLair", enterMessage: "", chances: { lava: 50, water: 0, cavern: 10, lagoon: 0, wall_less: 10}, enemyPopulation: 15, vermin: [RacesData.VISAGE,RacesData.GOBLIN,RacesData.PUMA,RacesData.CAIMAN,], itemsQuantity: 6, items: [ItemsData.AGUAPANELA,ItemsData.BANDAGE,ItemsData.AXE,ItemsData.CRUCIFIX,ItemsData.HOLY_WATER,], gangs: [{ boss: RacesData.JAGUAR, minions: [RacesData.CAIMAN], quantity: 2}], features: [] },
	farashon5: { gen: StygianGenerator, name: "Farashon 5", depth: 5, nextLevelId: "farashon6", enterMessage: "", chances: { lava: 100, water: 0, cavern: 50, lagoon: 0, wall_less: 50}, enemyPopulation: 20, vermin: [RacesData.GOBLIN,RacesData.PUMA,RacesData.JAGUAR,RacesData.CAIMAN,], itemsQuantity: 6, items: [ItemsData.COFFEE,ItemsData.BANDAGE,ItemsData.DONGO,ItemsData.SHOVEL,ItemsData.KNIFE,], gangs: [{ boss: RacesData.JAGUAR, minions: [RacesData.PUMA], quantity: 3}], features: [] },
	farashon6: { gen: StygianGenerator, name: "Farashon 6", depth: 6, nextLevelId: "sombreronLair", enterMessage: "", chances: { lava: 20, water: 10, cavern: 20, lagoon: 10, wall_less: 10}, enemyPopulation: 20, vermin: [RacesData.GOBLIN,RacesData.PUMA,RacesData.JAGUAR,RacesData.CAIMAN,RacesData.CROCODILE,], itemsQuantity: 6, items: [ItemsData.AGUARDIENTE,ItemsData.AXE,ItemsData.TUNJO,ItemsData.CRUCIFIX,], gangs: [{ boss: RacesData.JAGUAR, minions: [RacesData.GOBLIN], quantity: 5}], features: [] },
	farashon7: { gen: StygianGenerator, name: "Farashon 7", depth: 7, nextLevelId: "bracamonteLair", enterMessage: "", chances: { lava: 0, water: 100, cavern: 80, lagoon: 10, wall_less: 10}, enemyPopulation: 30, vermin: [RacesData.PUMA,RacesData.JAGUAR,RacesData.CROCODILE,], itemsQuantity: 6, items: [ItemsData.AGUAPANELA,ItemsData.KNIFE,ItemsData.TUNJO,ItemsData.HOLY_WATER,], gangs: [{ boss: RacesData.JAGUAR, minions: [RacesData.PUMA], quantity: 3}], features: [] },
	farashon8: { gen: StygianGenerator, name: "Farashon 8", depth: 8, nextLevelId: "farashonHilltop", enterMessage: "", chances: { lava: 20, water: 10, cavern: 20, lagoon: 10, wall_less: 80}, enemyPopulation: 30, vermin: [RacesData.JAGUAR,RacesData.CROCODILE,], itemsQuantity: 6, items: [ItemsData.DONGO,ItemsData.AXE,ItemsData.TUNJO,ItemsData.CRUCIFIX,], gangs: [{ boss: RacesData.CROCODILE, minions: [RacesData.CAIMAN], quantity: 3}], features: [] },
}

export default class World {
	_c: any;
	game: any;
	player: Player;
	levels: any;
	level: Level;

	constructor () {
		this.levels = {
			_c: circular.register('World.levels')
		};
	}

	init (game: any) {
		this._c = circular.register('World');
		this.game = game;
		this.player = game.player;
		StygianGenerator.init();
	}
	loadLevel (levelId: string, overrideFromLevel?: string) {
		let previousLevelId = overrideFromLevel ?? this.level?.id;
		if (this.levels[levelId]){
			// We already generated or loaded that level, so we just move to it
			this.level = this.levels[levelId];
			let exit = this.level.getExitFor(previousLevelId);
			if (!exit) {
				// It's possible the level is persistent but has 'anonymous' start entrance
				exit = this.level.getEntrance();
			}
			this.player.x = exit.x;
			this.player.y = exit.y;
		} else {
			// We must generate or load the level, and then move to it
			this.level = new Level();
			this.level.init(this.game, levelId);
			const metadata = levelsMetadata[levelId];
			let generator;
			if (!metadata) {
				generator = LevelLoader;
			} else {
				generator = metadata.gen;
			}
			generator.loadLevel(this.level, levelId, previousLevelId, metadata);
			if (this.level.persistent) {
				this.levels[levelId] = this.level;
			}
		}
		this.game.display.showText(this.game.world.level.name)
		if (!this.level.safe && !this.player.combatOnboarded) {
			this.game.display.showDialogs(Loc.locAll(
				[
					"dialog.combat.1",
					"dialog.combat.2",
					"dialog.combat.3",
					"dialog.combat.4",
					"dialog.combat.5",
					"dialog.combat.6",
					"dialog.combat.7",
					"dialog.combat.8",
					"dialog.combat.9",
					"dialog.combat.10",
					this.game.display.isMobile() ? 
						"dialog.combat.11.mobile" :
						"dialog.combat.11.desktop"
				]));
			this.player.combatOnboarded = true;
		}
		if (this.level.onEnter) {
			this.game.display.showDialogs(Loc.locAll(this.level.onEnter, {
				helpButton: this.game.display.isMobile() ? 'Select' : '?'
			}));
			this.level.onEnter = null;
		}
		if (this.level.enterSFX) {
			this.game.audio.playSfx(this.level.enterSFX);
		}
		if (this.level.respawn) {
			this.player.lastRespawn = this.level.id;
			this.player.hp.recoverAll();
			this.player.drunkness.recoverAll();
		}
		if (this.level.music) {
			this.game.audio.playMx(this.level.music);
		} else {
			this.game.audio.stopCurrentMx();
		}
		if (this.level.ambience) {
			this.game.audio.playAmbience(this.level.ambience);
		} else {
			this.game.audio.stopCurrentAmbience();
		}
		this.game.input.clearQueuedMovement();
	}
}

circular.registerClass('World', World);